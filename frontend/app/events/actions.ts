'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

import { isAdmin, isHelper } from '@/utils/roles'

export async function createEvent(formData: FormData) {
    if (!await isAdmin()) {
        redirect('/events?error=Unauthorized')
    }
    const supabase = await createClient()

    const name = formData.get('name') as string
    const date = formData.get('date') as string
    const location = formData.get('location') as string

    const data = {
        name,
        date,
        location,
        capacity: formData.get('capacity') ? parseInt(formData.get('capacity') as string) : null,
        requires_approval: formData.get('requires_approval') === 'on',
        // New Fields
        primary_color: formData.get('primary_color') as string,
        logo_url: formData.get('logo_url') as string,
        gallery_images: JSON.parse((formData.get('gallery_images') as string) || '[]'),

        // Manual input mapped to schema columns
        ai_summary: formData.get('ai_summary_text') as string,
        ai_key_times: JSON.parse((formData.get('ai_key_times_json') as string) || '[]'),
    }

    const { error } = await supabase.from('events').insert(data)

    if (error) {
        console.error('Error creating event:', error)
        redirect('/error?message=Failed to create event')
    }

    revalidatePath('/events', 'layout')
    redirect('/events')
}

export async function updateEvent(formData: FormData) {
    if (!await isAdmin()) {
        redirect('/events?error=Unauthorized')
    }
    const supabase = await createClient()

    const id = formData.get('id') as string
    const data = {
        name: formData.get('name') as string,
        date: formData.get('date') as string,
        location: formData.get('location') as string,
        capacity: formData.get('capacity') ? parseInt(formData.get('capacity') as string) : null,
        requires_approval: formData.get('requires_approval') === 'on',
        // Update new fields
        primary_color: formData.get('primary_color') as string,
        logo_url: formData.get('logo_url') as string,
        gallery_images: JSON.parse((formData.get('gallery_images') as string) || '[]'),
        // Manual inputs
        ai_summary: formData.get('ai_summary_text') as string,
        ai_key_times: JSON.parse((formData.get('ai_key_times_json') as string) || '[]')
    }

    const { error } = await supabase.from('events').update(data).eq('id', id)

    if (error) {
        console.error('Error updating event:', error)
        redirect('/error')
    }

    revalidatePath('/events', 'layout')
    redirect('/events')
}

export async function deleteEvent(id: string) {
    if (!await isAdmin()) {
        redirect('/events?error=Unauthorized')
    }
    const supabase = await createClient()

    // Constraint: Cascade delete on schema handles attendees
    const { error } = await supabase.from('events').delete().eq('id', id)

    if (error) {
        console.error('Error deleting event:', error)
        redirect('/error')
    }

    revalidatePath('/events', 'layout')
    redirect('/events')
}

export async function registerAttendee(formData: FormData) {
    const supabase = await createClient()

    const event_id = formData.get('event_id') as string
    const name = formData.get('name') as string
    const email = formData.get('email') as string

    // 1. Fetch Event Details
    const { data: event, error: eventError } = await supabase.from('events').select('capacity, requires_approval').eq('id', event_id).single()

    if (eventError || !event) {
        redirect('/error?message=Event not found')
    }

    // 2. Check Capacity
    if (event.capacity) {
        const { count, error: countError } = await supabase.from('attendees').select('*', { count: 'exact', head: true }).eq('event_id', event_id)

        if (countError) {
            console.error('Error checking capacity:', countError)
            redirect('/error?message=Could not verify capacity')
        }

        if (count !== null && count >= event.capacity) {
            redirect(`/events/${event_id}/register/full-capacity`)
        }
    }

    // 3. Determine Status
    const status = event.requires_approval ? 'pending' : 'confirmed'

    const data = {
        event_id,
        name,
        email,
        status
    }

    const { data: attendee, error } = await supabase.from('attendees').insert(data).select().single()

    if (error) {
        console.error('Error registering attendee:', error)
        redirect(`/error?message=${encodeURIComponent(error.message)}`)
    }

    revalidatePath('/events', 'layout')

    // 4. Redirect based on flow
    if (status === 'pending') {
        redirect(`/events/${event_id}/register/confirmation`)
    } else {
        redirect(`/tickets/${attendee.id}`)
    }
}

export async function updateAttendeeStatus(attendeeId: string, status: string) {
    if (!await isAdmin()) {
        // Only Admins can manually update status
        redirect('/?error=Unauthorized')
    }
    const supabase = await createClient()

    const { error } = await supabase.from('attendees').update({ status }).eq('id', attendeeId)

    if (error) {
        console.error('Error updating attendee status:', error)
        redirect('/error?message=Failed to update status')
    }

    revalidatePath('/events/[id]/attendees', 'page')
}

export async function confirmAllAttendees(eventId: string) {
    if (!await isAdmin()) {
        redirect('/?error=Unauthorized')
    }
    const supabase = await createClient()

    const { error } = await supabase.from('attendees').update({ status: 'confirmed' }).eq('event_id', eventId).eq('status', 'pending')

    if (error) {
        console.error('Error confirming all attendees:', error)
        redirect('/error?message=Failed to confirm all')
    }

    revalidatePath(`/events/${eventId}/attendees`)
}
