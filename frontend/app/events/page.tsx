import { createClient } from "@/utils/supabase/server";
import { signout } from "@/app/auth/actions";
import { deleteEvent } from "@/app/events/actions";
import Link from "next/link";
import { Home } from "lucide-react";
import BackgroundGradient from "@/components/BackgroundGradient";

export default async function EventsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { data: events } = await supabase.from("events").select("*").order('date', { ascending: true });

    return (
        <div className="min-h-screen text-gray-100 font-sans">
            <BackgroundGradient />
            <header className="p-6 flex justify-between items-center border-b border-white/10 backdrop-blur-sm bg-black/20">
                <Link href="/" className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 transition-all backdrop-blur-md group">
                    <Home className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
                </Link>
                {user ? (
                    <div className="flex items-center gap-4">
                        <Link
                            href="/events/new"
                            className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2 rounded-lg backdrop-blur-md transition-all shadow-lg hover:shadow-white/10 font-medium"
                        >
                            + Create Event
                        </Link>
                        <Link
                            href="/tickets"
                            className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-100 px-4 py-2 rounded-lg backdrop-blur-md transition-all shadow-lg hover:shadow-blue-500/20 font-medium"
                        >
                            My Tickets
                        </Link>
                        <span className="text-sm text-gray-400 hidden sm:inline"> | </span>
                        <span className="text-sm text-gray-400 hidden sm:inline">{user.email}</span>
                        <form action={signout}>
                            <button className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors">
                                Sign out
                            </button>
                        </form>
                    </div>
                ) : (
                    <Link href="/login" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm">
                        Sign in
                    </Link>
                )
                }
            </header >

            <main className="container mx-auto px-4 py-16">
                <h2 className="text-4xl font-bold mb-12 text-center text-white">
                    Upcoming Events
                </h2>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {events?.map((event) => (
                        <div
                            key={event.id}
                            className="bg-white/5 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/10 flex flex-col backdrop-blur-md"
                        >
                            <div className="p-6 flex-grow">
                                <h3 className="text-2xl font-semibold mb-2">{event.name}</h3>
                                <div className="flex items-center text-gray-400 mb-4">
                                    <span className="mr-2">📍</span>
                                    <span>{event.location}</span>
                                </div>
                                <div className="flex items-center text-gray-400 mb-6">
                                    <span className="mr-2">📅</span>
                                    <span>
                                        {new Date(event.date).toLocaleDateString("en-US", {
                                            weekday: "long",
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                            hour: "numeric",
                                            minute: "numeric"
                                        })}
                                    </span>
                                </div>
                            </div>

                            <div className="p-4 bg-black/20 border-t border-white/10 flex gap-2">
                                <Link href={`/events/${event.id}/register`} className="flex-1 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-100 font-medium py-2 px-3 rounded-lg backdrop-blur-md transition-all text-center shadow-lg hover:shadow-green-500/20">
                                    Register
                                </Link>
                                {user && (
                                    <Link href={`/events/${event.id}/attendees`} className="flex-[2] bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 text-indigo-100 font-medium py-2 px-3 rounded-lg backdrop-blur-md transition-all text-center shadow-lg hover:shadow-indigo-500/20">
                                        Manage Event
                                    </Link>
                                )}
                            </div>
                        </div>
                    ))}

                    {(!events || events.length === 0) && (
                        <div className="col-span-full text-center py-12 text-gray-500 bg-gray-800/50 rounded-xl border border-gray-800 border-dashed">
                            <p className="text-xl mb-4">No events found.</p>
                            {user && (
                                <Link href="/events/new" className="text-indigo-400 hover:text-indigo-300 underline">
                                    Create the first one!
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div >
    );
}
