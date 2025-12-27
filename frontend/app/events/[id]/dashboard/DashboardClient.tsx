'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Home, Mail, CheckCircle, XCircle, RefreshCw, Send } from 'lucide-react';
import BackgroundGradient from '@/components/BackgroundGradient';
import { useRouter } from 'next/navigation';

interface Props {
    event: any;
    initialAttendees: any[];
}

export default function DashboardClient({ event, initialAttendees }: Props) {
    const [attendees, setAttendees] = useState(initialAttendees);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const router = useRouter();

    const sendEmail = async (action: 'single' | 'batch', attendeeId?: string) => {
        setLoading(true);
        setMessage('');

        try {
            const res = await fetch('/api/send-ticket', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action,
                    eventId: event.id,
                    attendeeId
                }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Failed to send');

            setMessage(action === 'batch'
                ? `Batch processed: ${data.sent} sent, ${data.failed} failed.`
                : 'Email sent successfully!'
            );

            // Refresh data (simplistic approach: just toggle the email_sent flag locally for now)
            if (action === 'single' && attendeeId) {
                setAttendees(prev => prev.map(a => a.id === attendeeId ? { ...a, email_sent: true } : a));
            } else if (action === 'batch') {
                // ideally re-fetch, but for now just mark all confirmed as sent if success > 0
                if (data.sent > 0) {
                    router.refresh();
                }
            }

        } catch (err: any) {
            setMessage(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen text-gray-100 font-sans">
            <BackgroundGradient />

            <header className="p-6 flex justify-between items-center border-b border-white/10 backdrop-blur-sm bg-black/20 sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <Link href="/" className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 transition-all backdrop-blur-md group">
                        <Home className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
                    </Link>
                    <h1 className="text-xl font-bold text-white">
                        Dashboard: <span className="text-blue-400">{event.name}</span>
                    </h1>
                </div>
                <Link href={`/events/${event.id}`} className="text-sm text-gray-400 hover:text-white transition-colors">
                    View Event Page
                </Link>
            </header>

            <main className="container mx-auto px-4 py-8">

                {/* Actions Bar */}
                <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between bg-white/5 p-6 rounded-xl border border-white/10 backdrop-blur-md">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-2">Attendee Management</h2>
                        <p className="text-gray-400">Manage approvals and send tickets.</p>
                    </div>

                    <button
                        onClick={() => sendEmail('batch')}
                        disabled={loading}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg hover:shadow-blue-500/20"
                    >
                        {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                        Send Emails to Approved
                    </button>
                </div>

                {message && (
                    <div className={`mb-6 p-4 rounded-lg border ${message.includes('Error') ? 'bg-red-500/10 border-red-500/20 text-red-300' : 'bg-green-500/10 border-green-500/20 text-green-300'}`}>
                        {message}
                    </div>
                )}

                {/* Attendees List */}
                <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden backdrop-blur-md">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-black/20 text-gray-400 text-sm border-b border-white/10">
                                    <th className="p-4 font-medium">Name</th>
                                    <th className="p-4 font-medium">Email</th>
                                    <th className="p-4 font-medium">Status</th>
                                    <th className="p-4 font-medium">Email Sent</th>
                                    <th className="p-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {attendees.map((attendee) => (
                                    <tr key={attendee.id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4 font-medium text-white">{attendee.name}</td>
                                        <td className="p-4 text-gray-300">{attendee.email}</td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize
                                        ${attendee.status === 'confirmed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                                    attendee.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                                                        'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                                {attendee.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            {attendee.email_sent ? (
                                                <span className="flex items-center gap-1 text-green-400 text-sm">
                                                    <CheckCircle className="w-4 h-4" /> Yes
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-gray-500 text-sm">
                                                    <XCircle className="w-4 h-4" /> No
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => sendEmail('single', attendee.id)}
                                                disabled={loading || attendee.status !== 'confirmed'}
                                                title={attendee.status !== 'confirmed' ? "Only confirmed attendees can receive tickets" : "Resend Ticket Email"}
                                                className="text-sm bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white px-3 py-1.5 rounded transition-colors disabled:opacity-30"
                                            >
                                                Resend Email
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {attendees.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-gray-500">
                                            No attendees found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
