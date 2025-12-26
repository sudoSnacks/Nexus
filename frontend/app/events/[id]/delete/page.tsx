
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Trash2, AlertTriangle } from 'lucide-react'
import { deleteEvent } from '../../actions'
import BackgroundGradient from '@/components/BackgroundGradient'

export default async function DeleteEventPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient()
    const { id } = await params

    const { data: event } = await supabase.from('events').select('*').eq('id', id).single()

    if (!event) {
        redirect('/?error=Event not found')
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-4 font-sans text-white">
            <BackgroundGradient />

            {/* Background decoration */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[30%] right-[20%] w-[40%] h-[40%] rounded-full bg-red-600/10 blur-[100px]" />
            </div>

            <div className="w-full max-w-md p-8 relative bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl text-center shadow-2xl">
                <div className="flex justify-center mb-6">
                    <div className="bg-red-500/20 p-4 rounded-full">
                        <Trash2 className="w-12 h-12 text-red-500" />
                    </div>
                </div>

                <h2 className="text-3xl font-bold text-white mb-2">
                    Delete Event?
                </h2>
                <div className="bg-red-900/20 border border-red-900/50 rounded-lg p-4 mb-6">
                    <p className="text-red-200 text-sm font-medium mb-1">Warning</p>
                    <p className="text-gray-300 text-sm">
                        Are you sure you want to delete <span className="text-white font-bold">"{event.name}"</span>?
                        <br />
                        This action cannot be undone and will remove all attendee data.
                    </p>
                </div>

                <div className="flex gap-3">
                    <Link href="/events" className="flex-1 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-sm font-bold text-gray-300 hover:bg-white/10 backdrop-blur-md transition-all">
                        Cancel
                    </Link>
                    <form action={deleteEvent.bind(null, id)} className="flex-1">
                        <button type="submit" className="w-full justify-center rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-100 px-4 py-3 text-sm font-bold backdrop-blur-md shadow-lg hover:shadow-red-900/20 transition-all flex items-center gap-2">
                            <Trash2 className="w-4 h-4" />
                            Yes, Delete
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
