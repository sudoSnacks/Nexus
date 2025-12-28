"use client";

import { getAttendee, checkInAttendee } from '@/app/actions/scanner';
import { useState } from 'react';
import { CheckCircle, X, Loader2, User, Mail, Calendar, MapPin } from 'lucide-react';
import Scanner from '@/components/Scanner';

export default function ScannerPageClient() {
    const [attendee, setAttendee] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [checkingIn, setCheckingIn] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const handleScan = async (id: string) => {
        setLoading(true);
        try {
            const data = await getAttendee(id);
            if (data) {
                setAttendee(data);
                setShowModal(true);
            } else {
                setMessage("Attendee not found");
                setTimeout(() => setMessage(null), 3000);
            }
        } catch (error) {
            console.error(error);
            setMessage("Error fetching attendee");
            setTimeout(() => setMessage(null), 3000);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmCheckIn = async () => {
        if (!attendee) return;
        setCheckingIn(true);
        try {
            await checkInAttendee(attendee.id);
            setAttendee({ ...attendee, checked_in: true });
            setMessage("Check-in confirmed!");
            setTimeout(() => {
                setMessage(null);
                setShowModal(false);
                setAttendee(null);
            }, 2000);
        } catch (error) {
            console.error(error);
            setMessage("Failed to check in");
        } finally {
            setCheckingIn(false);
        }
    };

    return (
        <div className="min-h-screen bg-black relative">
            <div className="bg-indigo-600/20 text-indigo-200 p-2 text-center text-sm sticky top-0 z-50 backdrop-blur-md border-b border-indigo-500/20">
                Nexus Event Scanner
            </div>

            <Scanner onScan={handleScan} />

            {/* Loading Overlay */}
            {loading && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center backdrop-blur-sm">
                    <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                </div>
            )}

            {/* Notification Toast */}
            {message && (
                <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-full shadow-2xl border border-gray-700 z-50 flex items-center gap-2">
                    {message.includes('confirmed') ? <CheckCircle className="text-green-500 w-5 h-5" /> : <X className="text-red-500 w-5 h-5" />}
                    {message}
                </div>
            )}

            {/* Check-in Modal */}
            {showModal && attendee && (
                <div className="fixed inset-0 bg-black/90 z-40 flex items-end sm:items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-gray-900 w-full max-w-md rounded-2xl border border-gray-800 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
                        {/* Modal Header */}
                        <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-800/50">
                            <h2 className="text-lg font-bold text-white">Confirm Check-in</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Attendee</p>
                                        <p className="text-lg font-semibold text-white">{attendee.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Email</p>
                                        <p className="text-base text-gray-200">{attendee.email}</p>
                                    </div>
                                </div>
                                <div className="p-4 bg-gray-800/50 rounded-xl space-y-2 border border-gray-800">
                                    <div className="flex items-center gap-2 text-sm text-gray-300">
                                        <Calendar className="w-4 h-4 text-gray-500" />
                                        <span>{attendee.events?.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-300">
                                        <MapPin className="w-4 h-4 text-gray-500" />
                                        <span>{attendee.events?.location || 'TBA'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl border border-gray-800/50">
                                <span className="text-sm text-gray-400">Current Status</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${attendee.checked_in ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                    {attendee.checked_in ? 'Checked In' : 'Not Checked In'}
                                </span>
                            </div>

                            <button
                                onClick={handleConfirmCheckIn}
                                disabled={checkingIn || attendee.checked_in}
                                className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-2
                                    ${attendee.checked_in
                                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                        : 'bg-green-600 hover:bg-green-500 text-white hover:scale-[1.02] active:scale-[0.98]'
                                    }`}
                            >
                                {checkingIn ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : attendee.checked_in ? (
                                    <>
                                        <CheckCircle className="w-5 h-5" />
                                        Already Checked In
                                    </>
                                ) : (
                                    'Check In Attendee'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
