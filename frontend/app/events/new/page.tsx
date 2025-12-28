'use client';

import { createEvent } from '@/app/events/actions';
import BackgroundGradient from "@/components/BackgroundGradient";
import EventForm from "@/components/EventForm";

export default function NewEventPage() {
    return (
        <div className="flex min-h-screen items-center justify-center p-4 font-sans text-white">
            <BackgroundGradient />
            <div className="w-full max-w-3xl p-8 space-y-8 bg-white/5 border border-white/10 backdrop-blur-xl rounded-xl shadow-2xl my-10">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-white mb-2">
                        Create New Event
                    </h2>
                    <p className="text-gray-400 text-sm">Design your event landing page.</p>
                </div>

                <EventForm mode="create" action={createEvent} />
            </div>
        </div>
    )
}
