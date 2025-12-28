
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import QRCode from "react-qr-code";
import { Calendar, MapPin, Ticket, X, User, Mail, CreditCard, Clock, Download } from "lucide-react";
import BackgroundGradient from "@/components/BackgroundGradient";
import AddToCalendar from "@/components/AddToCalendar";

export default async function TicketPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient()
    const { id } = await params

    const { data: attendee, error } = await supabase
        .from('attendees')
        .select('*, events(*)')
        .eq('id', id)
        .single()

    if (error || !attendee) {
        redirect('/?error=Ticket not found')
    }

    const event = attendee.events

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <BackgroundGradient />

            <div className="absolute top-6 right-6 z-50">
                <Link href="/events" className="flex items-center justify-center w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all border border-white/20 shadow-lg">
                    <X className="w-5 h-5" />
                </Link>
            </div>

            <div className="relative w-full max-w-sm bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                {/* Header / Event Image Placeholder */}
                <div className="h-32 bg-gradient-to-r from-purple-500 to-indigo-600 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute bottom-0 left-0 p-6">
                        <span className="px-2 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-medium text-white border border-white/10">
                            General Admission
                        </span>
                    </div>
                </div>

                <div className="p-8 space-y-8">
                    {/* Event Info */}
                    <div className="space-y-4">
                        <h1 className="text-2xl font-bold text-white leading-tight">
                            {event.name}
                        </h1>

                        <div className="space-y-2">
                            <div className="flex items-center text-gray-300 text-sm">
                                <Calendar className="w-4 h-4 mr-3 text-purple-400" />
                                <span> {new Date(event.date).toLocaleDateString("en-US", {
                                    weekday: "short",
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "numeric",
                                    minute: "numeric"
                                })}</span>
                            </div>
                            <div className="flex items-center text-gray-300 text-sm">
                                <MapPin className="w-4 h-4 mr-3 text-pink-400" />
                                <span>{event.location}</span>
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="relative h-px bg-white/10 my-6">
                        <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-gray-900" />
                        <div className="absolute -right-10 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-gray-900" />
                    </div>

                    {/* Attendee Info & QR */}
                    <div className="flex flex-col items-center space-y-6">
                        <div className="text-center">
                            <p className="text-sm text-gray-400 uppercase tracking-wider text-xs font-semibold mb-1">Attendee</p>
                            <p className="text-lg font-medium text-white">{attendee.name}</p>
                            <p className="text-sm text-gray-500">{attendee.email}</p>
                        </div>

                        <div className="bg-white p-4 rounded-xl shadow-inner">
                            <QRCode
                                size={150}
                                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                value={attendee.id}
                                viewBox="0 0 256 256"
                            />
                        </div>

                        <p className="text-xs text-center text-gray-500 font-mono">
                            ID: {attendee.id.slice(0, 8)}...
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="p-6 bg-white/5 border-t border-white/5 flex flex-col gap-3">
                    <div className="flex gap-2 justify-center">
                        <AddToCalendar event={{
                            title: event.name,
                            description: `Ticket for ${event.name}`,
                            location: event.location,
                            date: event.date // ISO string
                        }} />

                        <a
                            href={`/api/tickets/${attendee.id}/pdf`}
                            className="flex items-center gap-2 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 text-indigo-100 px-4 py-2 rounded-lg transition-all text-sm font-medium"
                        >
                            <Download className="w-4 h-4" />
                            Download PDF
                        </a>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 bg-black/20 text-center border-t border-white/5">
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                        <Ticket className="w-4 h-4" />
                        <span>Show this at the entrance</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
