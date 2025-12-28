import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import { sendBatchEmails } from '@/actions/email';

export default async function BatchEmailPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient();
    const { id } = await params;

    const { data: event } = await supabase.from('events').select('*').eq('id', id).single();
    if (!event) redirect('/?error=Event not found');

    const { data: attendees } = await supabase
        .from('attendees')
        .select('*')
        .eq('event_id', id);

    const pendingEmails = attendees?.filter(a => !a.email_sent && (a.status === 'confirmed' || a.status === 'rejected')) || [];
    const confirmedCount = pendingEmails.filter(a => a.status === 'confirmed').length;
    const rejectedCount = pendingEmails.filter(a => a.status === 'rejected').length;

    async function handleSend() {
        "use server";
        await sendBatchEmails(id);
        redirect(`/events/${id}/attendees?message=Batch processing started`);
    }

    return (
        <div className="min-h-screen bg-black text-white p-8 font-sans flex flex-col items-center justify-center">
            <div className="max-w-2xl w-full bg-gray-900 rounded-2xl p-8 border border-gray-800 shadow-2xl relative">
                <Link href={`/events/${id}/attendees`} className="absolute top-6 left-6 text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </Link>

                <div className="text-center mb-10 mt-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 mb-6">
                        <Mail className="w-8 h-8 text-blue-500" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Send Event Emails</h1>
                    <p className="text-gray-400">Manage communications for <span className="text-blue-400">{event.name}</span></p>
                </div>

                <div className="space-y-4 mb-10">
                    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span>Invited Emails (Confirmed)</span>
                        </div>
                        <span className="text-2xl font-bold">{confirmedCount}</span>
                    </div>

                    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                            <span>Rejection Emails (Rejected)</span>
                        </div>
                        <span className="text-2xl font-bold">{rejectedCount}</span>
                    </div>
                </div>

                {pendingEmails.length === 0 ? (
                    <div className="text-center p-6 bg-green-500/10 rounded-xl border border-green-500/20 text-green-300 flex flex-col items-center">
                        <CheckCircle className="w-8 h-8 mb-2" />
                        <p>All emails have been sent!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-start gap-4 p-4 bg-yellow-500/10 rounded-lg text-yellow-200 text-sm border border-yellow-500/20">
                            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                            <p>This will send emails to {pendingEmails.length} attendees. This action cannot be undone. Please ensure you have sufficient quota on your email provider.</p>
                        </div>

                        <form action={handleSend}>
                            <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-blue-500/20">
                                Send {pendingEmails.length} Emails
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
