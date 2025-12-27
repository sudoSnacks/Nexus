import { createClient } from '@/utils/supabase/server';
import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action, eventId, attendeeId } = body;

    if (!eventId) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }

    // specific attendee or all unsent for event
    let attendeesToProcess = [];

    if (action === 'single' && attendeeId) {
      const { data, error } = await supabase
        .from('attendees')
        .select('*, events(*)')
        .eq('id', attendeeId)
        .single();
      
      if (error || !data) throw new Error('Attendee not found');
      attendeesToProcess = [data];
    } else if (action === 'batch') {
      const { data, error } = await supabase
        .from('attendees')
        .select('*, events(*)')
        .eq('event_id', eventId)
        .eq('status', 'confirmed') // Only confirmed attendees
        .eq('email_sent', false);  // Only those who haven't received it
      
      if (error) throw new Error('Error fetching attendees');
      attendeesToProcess = data || [];
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    if (attendeesToProcess.length === 0) {
      return NextResponse.json({ message: 'No attendees to email' });
    }

    const results = await Promise.allSettled(attendeesToProcess.map(async (attendee) => {
      const event = attendee.events;
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-site.com'}/tickets/${attendee.id}`
      )}`;

      const { error } = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
        to: attendee.email,
        subject: `Your Ticket for ${event.name}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1>Hi ${attendee.name}!</h1>
            <p>You are confirmed for <strong>${event.name}</strong>.</p>
            <p>
              <strong>Date:</strong> ${new Date(event.date).toLocaleString()}<br/>
              <strong>Location:</strong> ${event.location}
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <img src="${qrCodeUrl}" alt="Ticket QR Code" style="width: 200px; height: 200px;" />
              <p style="font-size: 12px; color: #666;">Scan this at the entrance</p>
            </div>
            <p>
              If the QR code doesn't load, please show this email or your 
              <a href="${process.env.NEXT_PUBLIC_SUPABASE_URL}/tickets/${attendee.id}">Ticket Page</a>.
            </p>
          </div>
        `,
      });

      if (error) throw error;

      // Update status
      await supabase
        .from('attendees')
        .update({ email_sent: true })
        .eq('id', attendee.id);
      
      return attendee.id;
    }));

    const successCount = results.filter(r => r.status === 'fulfilled').length;
    const failureCount = results.filter(r => r.status === 'rejected').length;

    return NextResponse.json({ 
      success: true, 
      processed: attendeesToProcess.length,
      sent: successCount,
      failed: failureCount
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
