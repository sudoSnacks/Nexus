import { updateEvent } from '../../actions'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import BackgroundGradient from "@/components/BackgroundGradient";
import Link from 'next/link';

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient()
    const { id } = await params
    const { data: event } = await supabase.from('events').select('*').eq('id', id).single()

    if (!event) {
        redirect('/')
    }

    // Format date for datetime-local input (YYYY-MM-DDTHH:mm)
    const formattedDate = new Date(event.date).toISOString().slice(0, 16)

    return (
        <div className="flex min-h-screen items-center justify-center p-4 font-sans text-white">
            <BackgroundGradient />
            <div className="w-full max-w-md p-8 space-y-8 bg-white/5 border border-white/10 backdrop-blur-xl rounded-xl shadow-2xl">
                <h2 className="text-3xl font-bold tracking-tight text-white text-center">
                    Edit Event
                </h2>
                <form action={updateEvent} className="mt-8 space-y-6">
                    <input type="hidden" name="id" value={event.id} />
                    <div className="space-y-4 rounded-md shadow-sm">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-400">Event Name</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                defaultValue={event.name}
                                required
                                className="mt-1 block w-full rounded-md border-white/10 bg-black/20 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3"
                            />
                        </div>
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-400">Date</label>
                            <input
                                id="date"
                                name="date"
                                type="datetime-local"
                                defaultValue={formattedDate}
                                required
                                className="mt-1 block w-full rounded-md border-white/10 bg-black/20 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3"
                            />
                        </div>
                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-400">Location</label>
                            <input
                                id="location"
                                name="location"
                                type="text"
                                defaultValue={event.location}
                                required
                                className="mt-1 block w-full rounded-md border-white/10 bg-black/20 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3"
                            />
                        </div>
                        <div>
                            <label htmlFor="capacity" className="block text-sm font-medium text-gray-400">Capacity (Optional)</label>
                            <input
                                id="capacity"
                                name="capacity"
                                type="number"
                                defaultValue={event.capacity}
                                className="mt-1 block w-full rounded-md border-white/10 bg-black/20 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3"
                                placeholder="Leave blank for unlimited"
                            />
                        </div>
                        <div className="flex items-center gap-3 py-2">
                            <input
                                id="requires_approval"
                                name="requires_approval"
                                type="checkbox"
                                defaultChecked={event.requires_approval}
                                className="w-4 h-4 rounded border-white/10 bg-black/20 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label htmlFor="requires_approval" className="text-sm font-medium text-gray-400">Requires Admin Approval</label>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button type="submit" className="flex-1 justify-center rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 text-indigo-100 px-3 py-2 text-sm font-semibold backdrop-blur-md shadow-lg hover:shadow-indigo-500/20 transition-all">
                            Save Changes
                        </button>
                        <Link href="/events" className="flex-1 flex justify-center items-center rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-gray-200 px-3 py-2 text-sm font-semibold backdrop-blur-md transition-all">
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
