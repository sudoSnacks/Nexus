import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import CertificateGenerator from '@/components/certificate/CertificateGenerator';

export default async function CertificatePage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient();
    const { id } = await params;

    const { data: event } = await supabase.from('events').select('*').eq('id', id).single();
    if (!event) redirect('/?error=Event not found');

    // Future: Fetch existing template from DB

    // Only Checked-in attendees
    const { data: attendees } = await supabase
        .from('attendees')
        .select('name, email, id')
        .eq('event_id', id)
        .eq('checked_in', true);

    return (
        <div className="min-h-screen bg-black text-white font-sans">
            <CertificateGenerator attendees={attendees || []} eventName={event.name} />
        </div>
    );
}
