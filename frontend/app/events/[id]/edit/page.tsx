import { updateEvent } from '../../actions'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

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
        <div className="flex min-h-screen items-center justify-center bg-gray-900 text-gray-100 font-sans">
            <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-xl shadow-2xl border border-gray-700">
                <h2 className="text-3xl font-bold tracking-tight text-white text-center">
                    Edit Event
                </h2>
                <form action={updateEvent} className="mt-8 space-y-6">
                    <input type="hidden" name="id" value={event.id} />
                    <div className="space-y-4 rounded-md shadow-sm">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-400">Event Name</label>
                            <input id="name" name="name" type="text" defaultValue={event.name} required className="mt-1 block w-full rounded-md border-0 bg-gray-700 py-1.5 text-gray-100 ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6 pl-3" />
                        </div>
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-400">Date</label>
                            <input id="date" name="date" type="datetime-local" defaultValue={formattedDate} required className="mt-1 block w-full rounded-md border-0 bg-gray-700 py-1.5 text-gray-100 ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6 pl-3" />
                        </div>
                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-400">Location</label>
                            <input id="location" name="location" type="text" defaultValue={event.location} required className="mt-1 block w-full rounded-md border-0 bg-gray-700 py-1.5 text-gray-100 ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6 pl-3" />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button type="submit" className="flex-1 justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                            Save Changes
                        </button>
                        <a href="/" className="flex-1 flex justify-center items-center rounded-md border border-gray-600 bg-transparent px-3 py-2 text-sm font-semibold text-gray-300 hover:bg-gray-700">
                            Cancel
                        </a>
                    </div>
                </form>
            </div>
        </div>
    )
}
