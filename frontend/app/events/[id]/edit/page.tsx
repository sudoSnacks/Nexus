import { updateEvent } from '../../actions'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import BackgroundGradient from "@/components/BackgroundGradient";
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
        logo_url: event.logo_url,
        gallery_images: event.gallery_images,
        primary_color: event.primary_color,
        ai_summary: event.ai_summary,
        // Handle legacy or null ai_key_times
        ai_key_times: Array.isArray(event.ai_key_times) ? event.ai_key_times : []
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4 font-sans text-white">
            <BackgroundGradient primaryColor={event.primary_color} />
            <div className="w-full max-w-3xl p-8 space-y-8 bg-white/5 border border-white/10 backdrop-blur-xl rounded-xl shadow-2xl my-10">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-white mb-2">
                        Edit Event
                    </h2>
                    <p className="text-gray-400 text-sm">Update event details and branding.</p>
                </div>

                <EventForm mode="edit" initialData={initialData} action={updateEvent} />
            </div>
        </div>
    )
}
