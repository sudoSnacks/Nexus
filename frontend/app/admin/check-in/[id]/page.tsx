import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { updateAttendeeStatus } from '@/app/events/actions';
import { CheckCircle, XCircle, ArrowLeft } from 'lucide-react';

export default async function CheckInPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient();
    const { id: ticketId } = await params;

    // Fetch attendee details
    const { data: attendee, error } = await supabase
        .from('attendees')
        .select('*, events(name, date, location)')
        .eq('id', ticketId)
        .single();

    // Check permissions
    const { isHelper } = await import('@/utils/roles');
    if (!await isHelper()) {
        redirect('/');
    }

    if (error || !attendee) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4 text-center">
                <XCircle className="w-16 h-16 text-red-500 mb-4" />
                <h1 className="text-2xl font-bold mb-2">Invalid Ticket</h1>
                <p className="text-gray-400">Could not find an attendee with this ticket ID.</p>
                <Link href="/" className="mt-8 text-blue-400 hover:underline">Go Home</Link>
            </div>
        );
    }

    const event = attendee.events;

    async function toggleCheckIn() {
        "use server";
        const supabase = await createClient();
        // Since we don't have a direct 'updateAttendee' action for checked_in in the import yet, 
        // we'll implement the query directly or assume an action exists. 
        // For now, let's just do a direct update here for simplicity or creates a specialized action.

        await supabase
            .from('attendees')
            .update({ checked_in: !attendee.checked_in })
            .eq('id', ticketId);

        // Revalidate? Next.js should handle it on refresh, but server actions usually redirect.
        redirect(`/admin/check-in/${ticketId}`);
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4 font-sans">
            <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
                <div className={`p-6 text-center ${attendee.status === 'confirmed' ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                    {attendee.status === 'confirmed' ? (
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-2" />
                    ) : (
                        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-2" />
                    )}
                    <h1 className="text-2xl font-bold">{attendee.status === 'confirmed' ? 'Valid Ticket' : 'Invalid Status'}</h1>
                    <p className="text-sm uppercase tracking-wide opacity-75">{attendee.status}</p>
                </div>

                <div className="p-6 space-y-6">
                    <div>
                        <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Attendee</p>
                        <p className="text-xl font-medium">{attendee.name}</p>
                        <p className="text-gray-400 text-sm">{attendee.email}</p>
                    </div>

                    <div>
                        <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Event</p>
                        <p className="text-lg font-medium">{event?.name}</p>
                        <p className="text-gray-400 text-sm">{event?.date ? new Date(event.date).toLocaleDateString() : 'N/A'}</p>
                    </div>

                    <div className="pt-4 border-t border-gray-700">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-gray-300">Check-in Status:</span>
                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${attendee.checked_in ? 'bg-green-500 text-white' : 'bg-gray-600 text-gray-300'}`}>
                                {attendee.checked_in ? 'CHECKED IN' : 'NOT CHECKED IN'}
                            </span>
                        </div>

                        {attendee.status === 'confirmed' && (
                            <form action={toggleCheckIn}>
                                <button
                                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform active:scale-95 shadow-lg
                                    ${attendee.checked_in
                                            ? 'bg-red-600 hover:bg-red-500 text-white'
                                            : 'bg-green-600 hover:bg-green-500 text-white'}`}
                                >
                                    {attendee.checked_in ? 'Undo Check-in' : 'Check In Attendee'}
                                </button>
                            </form>
                        )}

                        {attendee.status !== 'confirmed' && (
                            <div className="bg-red-500/20 text-red-200 p-4 rounded-xl text-center text-sm">
                                Taking action not allowed. Attendee status is not confirmed.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Link href="/scanner" className="mt-8 flex items-center text-gray-400 hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Scanner
            </Link>
        </div>
    );
}
