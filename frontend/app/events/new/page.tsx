import { createEvent } from '../actions'
import BackgroundGradient from "@/components/BackgroundGradient";
import Link from 'next/link';

export default function NewEventPage() {
    return (
        <div className="flex min-h-screen items-center justify-center p-4 font-sans text-white">
            <BackgroundGradient />
            <div className="w-full max-w-md p-8 space-y-8 bg-white/5 border border-white/10 backdrop-blur-xl rounded-xl shadow-2xl">
                <h2 className="text-3xl font-bold tracking-tight text-white text-center">
                    Create New Event
                </h2>
                <form action={createEvent} className="mt-8 space-y-6">
                    <div className="space-y-4 rounded-md shadow-sm">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-400">Event Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
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
                                className="mt-1 block w-full rounded-md border-white/10 bg-black/20 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3"
                                placeholder="Leave blank for unlimited"
                            />
                        </div>
                        <div className="flex items-center gap-3 py-2">
                            <input
                                id="requires_approval"
                                name="requires_approval"
                                type="checkbox"
                                className="w-4 h-4 rounded border-white/10 bg-black/20 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label htmlFor="requires_approval" className="text-sm font-medium text-gray-400">Requires Admin Approval</label>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button type="submit" className="flex-1 justify-center rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 text-indigo-100 px-3 py-2 text-sm font-semibold backdrop-blur-md shadow-lg hover:shadow-indigo-500/20 transition-all">
                            Create Event
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
