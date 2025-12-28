'use client';

import { useState } from 'react';
import Link from 'next/link';
import EventPreviewModal from './EventPreviewModal';

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
}

interface EventListProps {
    events: Event[] | null;
    user: any;
    isUserAdmin: boolean;
    isUserHelper: boolean;
}

export default function EventList({ events, user, isUserAdmin, isUserHelper }: EventListProps) {
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

    return (
        <>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {events?.map((event) => {
                    const primaryColor = event.primary_color || "#4f46e5";

                    return (
                        <div
                            key={event.id}
                            className="bg-white/5 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/10 flex flex-col backdrop-blur-md group cursor-pointer"
                            onClick={() => setSelectedEvent(event)}
                            style={{ borderColor: `color-mix(in srgb, ${primaryColor}, transparent 80%)` }}
                        >
                            {/* Header Image / Color Bar */}
                            <div className="h-2 w-full transition-all group-hover:h-3" style={{ backgroundColor: primaryColor }} />

                            <div className="p-6 flex-grow">
                                <h3 className="text-2xl font-semibold mb-2 group-hover:text-white transition-colors">
                                    {event.name}
                                </h3>
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

                            <div className="p-4 bg-black/20 border-t border-white/10 flex gap-2" onClick={(e) => e.stopPropagation()}>
                                <button
                                    onClick={() => setSelectedEvent(event)}
                                    className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium py-2 px-3 rounded-lg backdrop-blur-md transition-all text-center"
                                >
                                    Details
                                </button>

                                <Link href={`/events/${event.id}/register`} className="flex-1 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-100 font-medium py-2 px-3 rounded-lg backdrop-blur-md transition-all text-center shadow-lg hover:shadow-green-500/20">
                                    Register
                                </Link>

                                {user && isUserHelper && (
                                    <Link href={`/events/${event.id}/attendees`} className="flex-[2] bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 text-indigo-100 font-medium py-2 px-3 rounded-lg backdrop-blur-md transition-all text-center shadow-lg hover:shadow-indigo-500/20">
                                        Manage
                                    </Link>
                                )}
                            </div>
                        </div>
                    );
                })}

                {(!events || events.length === 0) && (
                    <div className="col-span-full text-center py-12 text-gray-500 bg-gray-800/50 rounded-xl border border-gray-800 border-dashed">
                        <p className="text-xl mb-4">No events found.</p>
                        {user && isUserAdmin && (
                            <Link href="/events/new" className="text-indigo-400 hover:text-indigo-300 underline">
                                Create the first one!
                            </Link>
                        )}
                    </div>
                )}
            </div>

            {selectedEvent && (
                <EventPreviewModal
                    isOpen={!!selectedEvent}
                    onClose={() => setSelectedEvent(null)}
                    event={selectedEvent}
                />
            )}
        </>
    );
}
