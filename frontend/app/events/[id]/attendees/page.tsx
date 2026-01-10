import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { isAdmin } from '@/utils/roles'
import BackgroundGradient from '@/components/BackgroundGradient'
import AttendeeListClient from './AttendeeListClient'

export default async function AttendeesPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient()
    const { id } = await params
    const admin = await isAdmin()

    // Fetch event
    const { data: event } = await supabase.from('events').select('*').eq('id', id).single()

    if (!event) {
        redirect('/?error=Event not found')
    }

    // Fetch attendees
    const { data: attendees } = await supabase
        .from('attendees')
        .select('*')
        .eq('event_id', id)
        .order('created_at', { ascending: false })

    return (
        <div className="min-h-screen text-gray-100 font-sans p-4 md:p-8">
            <BackgroundGradient />
            <AttendeeListClient
                attendees={attendees || []}
                event={event}
                admin={admin}
            />
        </div>
    )
}
