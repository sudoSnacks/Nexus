import { updateEvent } from '../../actions'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

import EventForm from "@/components/EventForm";

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient()
    const { id } = await params
    const { data: event } = await supabase.from('events').select('*').eq('id', id).single()

    if (!event) {
        redirect('/')
    }

    // Prepare initial data matching the EventForm interface
    const initialData = {
        id: event.id,
        name: event.name,
        date: new Date(event.date).toISOString().slice(0, 16), // Format for datetime-local
        location: event.location,
        capacity: event.capacity,
        requires_approval: event.requires_approval,
        is_registration_closed: event.is_registration_closed,
        logo_url: event.logo_url,
        gallery_images: event.gallery_images,
        primary_color: event.primary_color,
        ai_summary: event.ai_summary,
        // Handle legacy or null ai_key_times
        ai_key_times: Array.isArray(event.ai_key_times) ? event.ai_key_times : []
    };

    return (
        <EventForm mode="edit" initialData={initialData} action={updateEvent} />
    )
}
