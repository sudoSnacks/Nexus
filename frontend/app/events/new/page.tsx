'use client';

import { createEvent } from '@/app/events/actions';
import EventForm from "@/components/EventForm";

export default function NewEventPage() {
    return (
        <EventForm mode="create" action={createEvent} />
    )
}
