'use client';

import { Calendar, Download } from 'lucide-react';
import { generateGoogleCalendarUrl, generateOutlookCalendarUrl, downloadIcsFile } from '@/utils/calendar';
import { useState } from 'react';

interface AddToCalendarProps {
    event: {
        title: string;
        description: string;
        location: string;
        date: string; // ISO
        durationHours?: number;
    }
}

export default function AddToCalendar({ event }: AddToCalendarProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Calculate end time (default 2 hours if not specified)
    const startDate = new Date(event.date);
    const endDate = new Date(startDate.getTime() + (event.durationHours || 2) * 60 * 60 * 1000);

    const calendarEvent = {
        title: event.title,
        description: event.description || "Join us for this event!",
        location: event.location,
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString()
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2 rounded-lg transition-all text-sm font-medium"
            >
                <Calendar className="w-4 h-4" />
                Add to Calendar
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-xl shadow-xl z-20 overflow-hidden">
                        <a
                            href={generateGoogleCalendarUrl(calendarEvent)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                        >
                            Google Calendar
                        </a>
                        <a
                            href={generateOutlookCalendarUrl(calendarEvent)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                        >
                            Outlook.com
                        </a>
                        <button
                            onClick={() => downloadIcsFile(calendarEvent)}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors border-t border-gray-700"
                        >
                            Apple / Outlook (.ics)
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
