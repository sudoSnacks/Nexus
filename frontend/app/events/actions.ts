'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function createEvent(formData: FormData) {
    const supabase = await createClient()

    const data = {
        name: formData.get('name') as string,
        date: formData.get('date') as string,
        location: formData.get('location') as string,
    }

    const { error } = await supabase.from('events').insert(data)

    if (error) {
        console.error('Error creating event:', error)
        redirect('/error')
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function updateEvent(formData: FormData) {
    const supabase = await createClient()

    const id = formData.get('id') as string
    const data = {
        name: formData.get('name') as string,
        date: formData.get('date') as string,
        location: formData.get('location') as string,
    }

    const { error } = await supabase.from('events').update(data).eq('id', id)

    if (error) {
        console.error('Error updating event:', error)
        redirect('/error')
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function deleteEvent(id: string) {
    const supabase = await createClient()

    // Constraint: Cascade delete on schema handles attendees
    const { error } = await supabase.from('events').delete().eq('id', id)

    if (error) {
        console.error('Error deleting event:', error)
        redirect('/error')
    }

    revalidatePath('/', 'layout')
}

export async function registerAttendee(formData: FormData) {
    const supabase = await createClient()

    const data = {
        event_id: formData.get('event_id') as string,
        name: formData.get('name') as string,
        email: formData.get('email') as string,
    }

    const { error } = await supabase.from('attendees').insert(data)

    if (error) {
        console.error('Error registering attendee:', error)
        redirect('/error')
    }

    revalidatePath('/', 'layout')
    redirect(`/?registered=true`)
}
