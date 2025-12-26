import { createEvent } from '../actions'

export default function NewEventPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-900 text-gray-100 font-sans">
            <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-xl shadow-2xl border border-gray-700">
                <h2 className="text-3xl font-bold tracking-tight text-white text-center">
                    Create New Event
                </h2>
                <form action={createEvent} className="mt-8 space-y-6">
                    <div className="space-y-4 rounded-md shadow-sm">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-400">Event Name</label>
                            <input id="name" name="name" type="text" required className="mt-1 block w-full rounded-md border-0 bg-gray-700 py-1.5 text-gray-100 ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6 pl-3" />
                        </div>
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-400">Date</label>
                            <input id="date" name="date" type="datetime-local" required className="mt-1 block w-full rounded-md border-0 bg-gray-700 py-1.5 text-gray-100 ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6 pl-3" />
                        </div>
                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-400">Location</label>
                            <input id="location" name="location" type="text" required className="mt-1 block w-full rounded-md border-0 bg-gray-700 py-1.5 text-gray-100 ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6 pl-3" />
                        </div>
                    </div>

                    <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                        Create Event
                    </button>
                </form>
            </div>
        </div>
    )
}
