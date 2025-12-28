import { createClient } from "@/utils/supabase/server";
import { signout } from "@/app/auth/actions";
import { deleteEvent } from "@/app/events/actions";
import Link from "next/link";
import { Home, Shield } from "lucide-react";
import BackgroundGradient from "@/components/BackgroundGradient";
import { isAdmin, isHelper } from "@/utils/roles";
import EventList from "@/components/EventList";

export default async function EventsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { data: events } = await supabase.from("events").select("*").order('date', { ascending: true });
    const isUserAdmin = await isAdmin();
    const isUserHelper = await isHelper();

    return (
        <div className="min-h-screen text-gray-100 font-sans">
            <BackgroundGradient />
            <header className="p-6 flex justify-between items-center border-b border-white/10 backdrop-blur-sm bg-black/20">
                <Link href="/" className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 transition-all backdrop-blur-md group">
                    <Home className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
                </Link>
                {user ? (
                    <div className="flex items-center gap-2 md:gap-4">
                        {isUserAdmin && (
                            <Link
                                href="/admin/helpers"
                                className="bg-gradient-to-r from-purple-500/20 to-indigo-500/20 hover:from-purple-500/30 hover:to-indigo-500/30 border border-purple-500/30 text-purple-100 px-2 py-1 text-xs md:text-base md:px-4 md:py-2 rounded-lg backdrop-blur-md transition-all shadow-lg hidden md:flex items-center gap-2 font-medium"
                            >
                                <Shield className="w-4 h-4" />
                                Manage Helpers
                            </Link>
                        )}
                        {isUserAdmin && (
                            <Link
                                href="/events/new"
                                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-2 py-1 text-xs md:text-base md:px-4 md:py-2 rounded-lg backdrop-blur-md transition-all shadow-lg hover:shadow-white/10 font-medium"
                            >
                                + Create Event
                            </Link>
                        )}
                        <Link
                            href="/tickets"
                            className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-100 px-2 py-1 text-xs md:text-base md:px-4 md:py-2 rounded-lg backdrop-blur-md transition-all shadow-lg hover:shadow-blue-500/20 font-medium"
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

                <EventList
                    events={events}
                    user={user}
                    isUserAdmin={isUserAdmin}
                    isUserHelper={isUserHelper}
                />
            </main>
        </div >
    );
}
