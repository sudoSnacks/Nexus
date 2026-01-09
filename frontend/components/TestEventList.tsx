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

export default function TestEventList({ events, user, isUserAdmin, isUserHelper }: EventListProps) {
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

    return (
        <>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {events?.map((event) => {
                    const primaryColor = event.primary_color || "#4f46e5";

                    return (
                        <div
                            key={event.id}
                            className="bg-white/40 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-black/5 flex flex-col backdrop-blur-md group cursor-pointer"
                            onClick={() => setSelectedEvent(event)}
                            style={{ borderColor: `color-mix(in srgb, ${primaryColor}, transparent 90%)` }}
                        >
                            {/* Header Image / Color Bar */}
                            <div className="h-2 w-full transition-all group-hover:h-3" style={{ backgroundColor: primaryColor }} />

                            <div className="p-6 flex-grow">
                                <h3 className="text-2xl font-bold mb-2 text-gray-900 group-hover:text-black transition-colors tracking-tight">
                                    {event.name}
                                </h3>
                                <div className="flex items-center text-gray-600 mb-4 font-medium">
                                    <span className="mr-2">📍</span>
                                    <span>{event.location}</span>
                                </div>
                                <div className="flex items-center text-gray-500 mb-6 text-sm">
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

                            <div className="p-4 bg-white/40 border-t border-black/5 flex gap-2" onClick={(e) => e.stopPropagation()}>
                                <button
                                    onClick={() => setSelectedEvent(event)}
                                    className="flex-1 bg-white hover:bg-gray-50 border border-black/10 text-gray-700 font-medium py-2 px-3 rounded-lg backdrop-blur-md transition-all text-center text-sm shadow-sm"
                                >
                                    Details
                                </button>

                                <Link href={`/events/${event.id}/register`} className="flex-1 bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 font-medium py-2 px-3 rounded-lg backdrop-blur-md transition-all text-center shadow-sm hover:shadow-md text-sm">
                                    Register
                                </Link>

                                {user && isUserHelper && (
                                    <Link href={`/events/${event.id}/attendees`} className="flex-[2] bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-medium py-2 px-3 rounded-lg backdrop-blur-md transition-all text-center shadow-sm hover:shadow-md text-sm">
                                        Manage
                                    </Link>
                                )}
                            </div>
                        </div>
                    );
                })}

                {(!events || events.length === 0) && (
                    <div className="col-span-full text-center py-12 text-gray-500 bg-gray-50/50 rounded-xl border border-gray-200 border-dashed">
                        <p className="text-xl mb-4">No events found.</p>
                        {user && isUserAdmin && (
                            <Link href="/events/new" className="text-indigo-600 hover:text-indigo-500 underline font-medium">
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
