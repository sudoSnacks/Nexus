import { registerAttendee } from '../../actions'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import BackgroundGradient from "@/components/BackgroundGradient";

export default async function RegisterPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient()
    const { id } = await params
    const { data: event } = await supabase.from('events').select('*').eq('id', id).single()

    if (!event) {
        redirect('/?error=Event not found')
    }

    const { data: { user } } = await supabase.auth.getUser()

    return (
        <div className="flex min-h-screen items-center justify-center p-4 font-sans text-white">
            <BackgroundGradient />

            <div className="w-full max-w-md p-8 relative bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl shadow-2xl">
                <div className="text-center space-y-2">
                    <span className="text-purple-400 text-xs font-bold tracking-widest uppercase">Event Registration</span>
                    <h2 className="text-4xl font-extrabold holo-text">
                        {event.name}
                    </h2>
                    <div className="flex flex-col items-center gap-1 text-gray-300 mt-4 text-sm">
                        <p className="flex items-center gap-2">
                            📅 {new Date(event.date).toLocaleDateString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "numeric",
                                minute: "numeric"
                            })}
                        </p>
                        <p className="flex items-center gap-2">📍 {event.location}</p>
                    </div>
                </div>

                <form action={registerAttendee} className="mt-10 space-y-6">
                    <input type="hidden" name="event_id" value={event.id} />
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-xs font-medium text-gray-400 uppercase tracking-wide mb-1.5 ml-1">Full Name</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                className="block w-full rounded-lg border border-white/10 bg-white/5 py-3 px-4 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all outline-none"
                                placeholder="John Doe"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-xs font-medium text-gray-400 uppercase tracking-wide mb-1.5 ml-1">Email Address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                defaultValue={user?.email || ''}
                                className="block w-full rounded-lg border border-white/10 bg-white/5 py-3 px-4 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all outline-none"
                                placeholder="john@example.com"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button type="submit" className="flex-1 justify-center rounded-lg bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-100 px-4 py-3 text-sm font-bold shadow-lg shadow-purple-900/10 hover:shadow-purple-900/30 backdrop-blur-md transition-all">
                            Get Ticket
                        </button>
                        <a href="/events" className="flex-none flex items-center justify-center rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-3 text-sm font-semibold text-gray-200 backdrop-blur-md transition-all">
                            Cancel
                        </a>
                    </div>
                </form>
            </div>
        </div>
    )
}
