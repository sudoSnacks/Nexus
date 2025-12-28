import { createClient } from '@/utils/supabase/server';
import { renderToStream } from '@react-pdf/renderer';
import { TicketPdf } from '@/components/pdfs/TicketPdf';
import QRCode from 'qrcode';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    // 1. Fetch Ticket Data
    const { data: attendee, error } = await supabase
        .from('attendees')
        .select('*, events(*)')
        .eq('id', id)
        .single();

    if (error || !attendee) {
        return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    const { events: event } = attendee;

    // 2. Generate QR Code
    const checkInUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/check-in/${attendee.id}`;
    const qrCodeUrl = await QRCode.toDataURL(checkInUrl);

    // 3. Render PDF Stream
    const stream = await renderToStream(
        <TicketPdf
            eventDetails={{
                name: event.name,
                date: new Date(event.date).toLocaleDateString(),
                location: event.location,
                organizer: "GDG Nexus", // Or fetch organizer
                logoUrl: event.logo_url,
            }}
            attendeeDetails={{
                name: attendee.name,
                email: attendee.email,
                bookingId: attendee.id,
                bookingDate: new Date(attendee.created_at).toLocaleDateString(),
                ticketType: "Regular Admission"
            }}
            qrCodeUrl={qrCodeUrl}
        />
    );

    // 4. Return as Stream
    // @ts-ignore - ReactPDF stream matches standard ReadableStream but TS might complain
    return new NextResponse(stream as unknown as ReadableStream, {
        headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="ticket-${attendee.id.slice(0, 8)}.pdf"`
        }
    });
}
