"use server";

import { Resend } from "resend";
import { render } from "@react-email/render";
import { renderToBuffer } from "@react-pdf/renderer";
import { InvitedEmail } from "@/components/emails/InvitedEmail";
import { RejectedEmail } from "@/components/emails/RejectedEmail";
import { CertificateEmail } from "@/components/emails/CertificateEmail";
import { TicketPdf } from "@/components/pdfs/TicketPdf";
import React from "react";
import QRCode from 'qrcode';
import { createClient } from "@/utils/supabase/server";

const resend = new Resend(process.env.RESEND_API_KEY);
const SENDER_EMAIL = "onboarding@resend.dev"; // Change this to your verified domain

export async function sendDidYouGetInEmail(
    userEmail: string,
    userName: string,
    status: "accepted" | "rejected",
    eventDetails: { name: string; date: string; location: string; ticketId?: string }
) {
    try {
        if (status === "accepted") {
            if (!eventDetails.ticketId) throw new Error("Ticket ID required for accepted status");

            // Generate QR Code Data URL
            // This URL should point to the check-in page for the admin
            const checkInUrl = `http://localhost:3000/admin/check-in/${eventDetails.ticketId}`;
            const qrCodeUrl = await QRCode.toDataURL(checkInUrl);

            const bookingDate = new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });

            // 1. Generate PDF Ticket
            const pdfBuffer = await renderToBuffer(
                <TicketPdf
                    eventDetails={{
                        name: eventDetails.name,
                        date: eventDetails.date,
                        location: eventDetails.location,
                        organizer: "GDG Nexus"
                    }}
                    attendeeDetails={{
                        name: userName,
                        email: userEmail,
                        bookingId: eventDetails.ticketId,
                        bookingDate: bookingDate,
                        ticketType: "Regular Admission"
                    }}
                    qrCodeUrl={qrCodeUrl}
                />
            );

            // 2. Render Email HTML
            const emailHtml = await render(
                <InvitedEmail
                    attendeeDetails={{
                        name: userName,
                        bookingId: eventDetails.ticketId,
                        bookingDate: bookingDate,
                        ticketType: "Regular Admission"
                    }}
                    eventDetails={{
                        name: eventDetails.name,
                        date: eventDetails.date,
                        location: eventDetails.location,
                        organizer: "GDG Nexus",
                        url: "http://localhost:3000"
                    }}
                    qrCodeUrl={qrCodeUrl}
                />
            );

            // 3. Send Email with Attachment
            const { data, error } = await resend.emails.send({
                from: SENDER_EMAIL,
                to: userEmail,
                subject: `Your Registration Confirmation for ${eventDetails.name}`,
                html: emailHtml,
                attachments: [
                    {
                        filename: `ticket-${eventDetails.ticketId}.pdf`,
                        content: pdfBuffer,
                    },
                ],
            });

            if (error) throw error;
            return { success: true, data };
        } else {
            // Rejected path
            const emailHtml = await render(
                <RejectedEmail userName={userName} eventName={eventDetails.name} />
            );

            const { data, error } = await resend.emails.send({
                from: SENDER_EMAIL,
                to: userEmail,
                subject: `Update regarding ${eventDetails.name}`,
                html: emailHtml,
            });

            if (error) throw error;
            return { success: true, data };
        }
    } catch (error) {
        console.error("Failed to send email:", error);
        return { success: false, error };
    }
}

export async function sendCertificateEmail(
    userEmail: string,
    userName: string,
    eventName: string,
    certificateUrl?: string // Optional if you want to attach a PDF generated elsewhere or generate here
) {
    try {
        const emailHtml = await render(
            <CertificateEmail userName={userName} eventName={eventName} />
        );

        // If implementing certificate generation, do it similarly to ticket PDF here via renderToBuffer

        const { data, error } = await resend.emails.send({
            from: SENDER_EMAIL,
            to: userEmail,
            subject: `Certificate of Participation: ${eventName}`,
            html: emailHtml,
            // attachments: certificateUrl ? [{ path: certificateUrl }] : undefined
        });

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error("Failed to send certificate email:", error);
        return { success: false, error };
    }
}

export async function sendBatchEmails(eventId: string) {
    const supabase = await createClient();

    // Fetch event details
    const { data: event } = await supabase.from('events').select('*').eq('id', eventId).single();
    if (!event) return { success: false, error: "Event not found" };

    // Fetch attendees who haven't received an email yet
    const { data: attendees } = await supabase
        .from('attendees')
        .select('*')
        .eq('event_id', eventId)
        .eq('email_sent', false);

    if (!attendees || attendees.length === 0) {
        return { success: true, message: "No pending emails to send." };
    }

    let sentCount = 0;
    let errorCount = 0;

    for (const attendee of attendees) {
        let result;
        if (attendee.status === 'confirmed') {
            result = await sendDidYouGetInEmail(attendee.email, attendee.name, 'accepted', {
                name: event.name,
                date: new Date(event.date).toLocaleDateString(),
                location: event.location,
                ticketId: attendee.id
            });
        } else if (attendee.status === 'rejected') {
            result = await sendDidYouGetInEmail(attendee.email, attendee.name, 'rejected', {
                name: event.name,
                date: new Date(event.date).toLocaleDateString(),
                location: event.location
            });
        } else {
            continue; // Skip pending
        }

        if (result && result.success) {
            // Update email_sent flag
            await supabase.from('attendees').update({ email_sent: true }).eq('id', attendee.id);
            sentCount++;
        } else {
            errorCount++;
        }

        // Simple delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    return { success: true, sentCount, errorCount };
}

export async function sendBatchCertificates(eventId: string) {
    const supabase = await createClient();

    // Fetch event details
    const { data: event } = await supabase.from('events').select('*').eq('id', eventId).single();
    if (!event) return { success: false, error: "Event not found" };

    // Fetch attendees who are CHECKED IN
    const { data: attendees } = await supabase
        .from('attendees')
        .select('*')
        .eq('event_id', eventId)
        .eq('checked_in', true);

    if (!attendees || attendees.length === 0) {
        return { success: true, message: "No checked-in attendees found." };
    }

    let sentCount = 0;
    let errorCount = 0;

    for (const attendee of attendees) {
        const result = await sendCertificateEmail(attendee.email, attendee.name, event.name);

        if (result.success) {
            sentCount++;
        } else {
            errorCount++;
        }

        // Simple delay
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    return { success: true, sentCount, errorCount };
}

export async function resendAttendeeEmail(attendeeId: string) {
    const supabase = await createClient();

    // Fetch attendee with event details
    const { data: attendee } = await supabase
        .from('attendees')
        .select('*, events(*)')
        .eq('id', attendeeId)
        .single();

    if (!attendee || !attendee.events) {
        return { success: false, error: "Attendee or Event not found" };
    }

    const event = attendee.events;

    // Reuse existing logic
    if (attendee.status === 'confirmed') {
        return await sendDidYouGetInEmail(attendee.email, attendee.name, 'accepted', {
            name: event.name,
            date: new Date(event.date).toLocaleDateString(),
            location: event.location,
            ticketId: attendee.id
        });
    } else if (attendee.status === 'rejected') {
        return await sendDidYouGetInEmail(attendee.email, attendee.name, 'rejected', {
            name: event.name,
            date: new Date(event.date).toLocaleDateString(),
            location: event.location
        });
    } else {
        return { success: false, error: "Cannot resend email for pending status." };
    }
}
