'use client';

import Link from 'next/link';

interface Event {
    id: string;
    name: string;
    description?: string;
    date: string;
    location: string;
    ai_summary?: string;
    ai_key_times?: { [key: string]: string | number } | string[];
    gallery_images?: string[];
    primary_color?: string;
    logo_url?: string;
    is_registration_closed?: boolean;
}

interface EventListProps {
    events: Event[] | null;
    user: any;
    isUserAdmin: boolean;
    isUserHelper: boolean;
}

export default function EventList({ events, user, isUserAdmin, isUserHelper }: EventListProps) {
    const showManageButton = isUserAdmin || isUserHelper;

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events?.map((event) => {
                const primaryColor = event.primary_color || "#4f46e5";
                const eventDate = new Date(event.date);
                const isCompleted = eventDate < new Date();

                // Image Logic
                const coverImage = event.logo_url || (event.gallery_images && event.gallery_images[0]) ||
                    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2670&auto=format&fit=crop";

                return (
                    <div
                        key={event.id}
                        className="group relative bg-card rounded-3xl overflow-hidden border border-border hover:border-primary/20 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col"
                    >
                        {/* --- Image Section --- */}
                        <Link href={`/events/${event.id}`} className="relative h-48 w-full overflow-hidden bg-black block cursor-pointer">
                            <img
                                src={coverImage}
                                alt={event.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60" />

                            {/* Top Badges */}
                            <div className="absolute top-4 left-4">
                                <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                                    <span>🚀</span>
                                    <span>Event</span>
                                </div>
                            </div>

                            <div className="absolute top-4 right-4">
                                <div className={`backdrop-blur-md border px-3 py-1 rounded-full text-xs font-bold shadow-sm ${isCompleted ? 'bg-gray-500/20 border-gray-500/30 text-gray-300' : 'bg-green-500/20 border-green-500/30 text-green-300'}`}>
                                    {isCompleted ? "Completed" : "Open"}
                                </div>
                            </div>
                        </Link>

                        {/* --- Content Section --- */}
                        <div className="p-6 pt-2 flex flex-col flex-grow relative">
                            {/* Date/Time Row */}
                            <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4 border-b border-border pb-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-indigo-400">📅</span>
                                    <span>
                                        {eventDate.toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-indigo-400">⏰</span>
                                    <span>
                                        {eventDate.toLocaleTimeString("en-US", { hour: 'numeric', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>

                            {/* Title */}
                            <Link href={`/events/${event.id}`} className="block mb-3">
                                <h3 className="text-xl font-bold text-card-foreground group-hover:text-primary transition-colors leading-tight">
                                    {event.name}
                                </h3>
                            </Link>

                            {/* Location/Desc */}
                            <p className="text-muted-foreground text-sm line-clamp-2 mb-6 flex-grow">
                                {event.ai_summary ? event.ai_summary.replace(/[*#]/g, '') : `Join us at ${event.location} for this amazing event.`}
                            </p>

                            {/* Footer */}
                            <div className="flex flex-col gap-3 mt-auto pt-4 border-t border-border">
                                <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="flex -space-x-2">
                                            {[...Array(3)].map((_, i) => (
                                                <div key={i} className="w-6 h-6 rounded-full bg-gray-700 border-2 border-[#1e1e1e]" />
                                            ))}
                                        </div>
                                        <span>12+ joined</span>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    {(isCompleted || event.is_registration_closed) ? (
                                        <button disabled className="w-full px-4 py-3 bg-muted text-muted-foreground text-sm font-semibold rounded-xl cursor-not-allowed text-center">
                                            {event.is_registration_closed ? "Registration Closed" : "Event Ended"}
                                        </button>
                                    ) : (
                                        <Link
                                            href={`/events/${event.id}/register`}
                                            className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-base font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-95 text-center flex items-center justify-center gap-2"
                                        >
                                            Register
                                        </Link>
                                    )}

                                    {showManageButton && (
                                        <Link
                                            href={`/events/${event.id}/attendees`}
                                            className="px-4 py-3 bg-secondary hover:bg-secondary/80 border border-border text-secondary-foreground font-medium rounded-xl transition-all hover:scale-[1.02] text-center flex items-center justify-center whitespace-nowrap"
                                        >
                                            Manage
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}

            {(!events || events.length === 0) && (
                <div className="col-span-full flex flex-col items-center justify-center py-24 text-muted-foreground bg-card rounded-3xl border border-border border-dashed">
                    <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mb-4">
                        <span className="text-2xl">📅</span>
                    </div>
                    <p className="text-xl font-medium text-card-foreground mb-2">No events found</p>
                    <p className="text-sm mb-6">There are no upcoming events scheduled.</p>
                    {user && isUserAdmin && (
                        <Link href="/events/new" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all">
                            Create an Event
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}
