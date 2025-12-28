"use client";

import { useState } from "react";
import { Trash2, AlertTriangle } from "lucide-react";
import { deleteEvent } from "@/app/events/actions";
import Link from "next/link";

export default function DeleteEventForm({ eventId, eventName }: { eventId: string; eventName: string }) {
    const [inputValue, setInputValue] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    const isMatch = inputValue === eventName;

    const handleDelete = async () => {
        if (!isMatch) return;
        setIsDeleting(true);
        await deleteEvent(eventId);
    };

    return (
        <div className="w-full max-w-md p-8 relative bg-black border border-gray-800 rounded-xl text-left shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-semibold text-white">
                    Confirm deletion of {eventName}
                </h2>
            </div>

            {/* Warning Box */}
            <div className="bg-red-500/10 border border-red-500/20 rounded-md p-4 mb-6 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-red-200 text-sm">
                    <span className="font-bold block mb-1">This action cannot be undone.</span>
                    This will permanently delete the <span className="font-bold">{eventName}</span> event and all of its data, including attendee records.
                </p>
            </div>

            {/* Input Field */}
            <div className="mb-6 space-y-2">
                <label htmlFor="confirm-input" className="block text-sm text-gray-400">
                    Type <span className="font-bold text-white">{eventName}</span> to confirm.
                </label>
                <input
                    id="confirm-input"
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full bg-black border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-white transition-colors"
                    placeholder={eventName}
                    autoComplete="off"
                />
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3">
                <button
                    onClick={handleDelete}
                    disabled={!isMatch || isDeleting}
                    className={`w-full py-2 px-4 rounded-md font-medium text-sm transition-all flex items-center justify-center gap-2
                        ${isMatch && !isDeleting
                            ? "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/20"
                            : "bg-gray-800 text-gray-500 cursor-not-allowed"
                        }`}
                >
                    {isDeleting ? "Deleting..." : "I understand, delete this event"}
                </button>
                <Link
                    href={`/events/${eventId}/attendees`}
                    className="w-full py-2 px-4 rounded-md font-medium text-sm text-center text-gray-400 hover:text-white transition-colors border border-transparent hover:border-gray-800"
                >
                    Cancel
                </Link>
            </div>
        </div>
    );
}
