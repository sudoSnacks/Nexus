import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import BackgroundGradient from "@/components/BackgroundGradient";
import { Home, Ticket, Calendar, MapPin } from "lucide-react";

export default async function MyTicketsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch attendees (tickets) for the current user, including event details
    const { data: tickets } = await supabase
        .from("attendees")
        .select(`
      *,
      events (
        name,
        date,
        location
      )
    `)
        .eq("email", user.email)
        .neq('status', 'rejected') // Filter out rejected tickets
        .order('created_at', { ascending: false });

    return (
        <div className="min-h-screen text-gray-100 font-sans">
            <BackgroundGradient />

            {/* Header */}
            <header className="p-6 flex justify-between items-center border-b border-white/10 backdrop-blur-sm bg-black/20 sticky top-0 z-50">
                <Link href="/" className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 transition-all backdrop-blur-md group">
                    <Home className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
                </Link>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-400 hidden md:block">
                    My Tickets
                </h1>
                <Link href="/events" className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2 rounded-lg backdrop-blur-md transition-all shadow-lg hover:shadow-white/10 font-medium text-sm">
                    View Events
                </Link>
            </header>

            <main className="container mx-auto px-4 py-12">
                <h2 className="text-3xl font-bold mb-8 text-center md:text-left flex items-center gap-3">
                    <Ticket className="w-8 h-8 text-blue-400" />
                    <span className="text-white">Your Tickets</span>
                </h2>

                {(!tickets || tickets.length === 0) ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md text-center">
                        <Ticket className="w-16 h-16 text-gray-600 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-300 mb-2">No tickets found</h3>
                        <p className="text-gray-500 mb-6">You haven't registered for any events yet.</p>
                        <Link href="/events" className="bg-white/10 hover:bg-white/20 border border-white/10 text-white px-6 py-3 rounded-lg backdrop-blur-md transition-all font-medium hover:shadow-lg hover:shadow-white/10">
                            Browse Events
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {tickets.map((ticket) => (
                            <div key={ticket.id} className="bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-md flex flex-col group">
                                <div className="p-6 flex-grow space-y-4">
                                    {/* Event Name */}
                                    <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
                                        {ticket.events?.name}
                                    </h3>

                                    {/* Date */}
                                    <div className="flex items-center gap-3 text-gray-400 text-sm">
                                        <Calendar className="w-4 h-4 text-gray-500" />
                                        <span>
                                            {ticket.events?.date ? new Date(ticket.events.date).toLocaleDateString("en-US", {
                                                weekday: "short",
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                                hour: "numeric",
                                                minute: "numeric"
                                            }) : 'TBA'}
                                        </span>
                                    </div>

                                    {/* Location */}
                                    <div className="flex items-center gap-3 text-gray-400 text-sm">
                                        <MapPin className="w-4 h-4 text-gray-500" />
                                        <span>{ticket.events?.location}</span>
                                    </div>

                                    {/* Status Badge */}
                                    <div className="pt-2">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                    ${ticket.status === 'confirmed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                                ticket.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                                                    'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                            {ticket.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Action Footer */}
                                <div className="p-4 bg-black/20 border-t border-white/10">
                                    {ticket.status === 'pending' ? (
                                        <button disabled className="block w-full text-center bg-yellow-500/10 text-yellow-500 font-medium py-2 rounded-lg border border-yellow-500/20 cursor-not-allowed opacity-75">
                                            Waiting for Confirmation
                                        </button>
                                    ) : (
                                        <Link href={`/tickets/${ticket.id}`} className="block w-full text-center bg-white/10 hover:bg-white/20 text-white font-medium py-2 rounded-lg transition-colors border border-white/10">
                                            View Ticket
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
