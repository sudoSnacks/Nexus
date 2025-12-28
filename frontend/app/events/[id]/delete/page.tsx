
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import BackgroundGradient from '@/components/BackgroundGradient'
import DeleteEventForm from '@/components/DeleteEventForm'

export default async function DeleteEventPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient()
    const { id } = await params

    const { data: event } = await supabase.from('events').select('name').eq('id', id).single()

    if (!event) {
        redirect('/?error=Event not found')
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-4 font-sans text-white relative">
            <BackgroundGradient />

            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[30%] right-[20%] w-[40%] h-[40%] rounded-full bg-red-600/5 blur-[100px]" />
            </div>

            <DeleteEventForm eventId={id} eventName={event.name} />
        </div>
    )
}
