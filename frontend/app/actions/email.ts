'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendCertificateEmail({
    email,
    name,
    eventName,
    pdfBase64,
}: {
    email: string;
    name: string;
    eventName: string;
    pdfBase64: string;
}) {
    try {
        if (!process.env.RESEND_API_KEY) {
            console.error("[sendCertificateEmail] RESEND_API_KEY is missing");
            return { success: false, error: 'RESEND_API_KEY is missing' };
        }

        console.log(`[sendCertificateEmail] Sending certificate to ${email} for event ${eventName}`);

        const buffer = Buffer.from(pdfBase64.split('base64,')[1], 'base64');

        const { data, error } = await resend.emails.send({
            from: 'Nexus <onboarding@resend.dev>', // Update this if user has a custom domain
            to: [email],
            subject: `Your Certificate for ${eventName}`,
            html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h1>Hello ${name},</h1>
                    <p>Thank you for attending <strong>${eventName}</strong>!</p>
                    <p>Please find your certificate of participation attached to this email.</p>
                    <br/>
                    <p>Best regards,</p>
                    <p>The Team</p>
                </div>
            `,
            attachments: [
                {
                    filename: `${name.replace(/\s+/g, '_')}_Certificate.pdf`,
                    content: buffer,
                },
            ],
        });

        if (error) {
            console.error('[sendCertificateEmail] Resend error:', error);
            return { success: false, error: error.message };
        }

        console.log(`[sendCertificateEmail] Successfully sent to ${email}`);
        return { success: true, data };
    } catch (error: any) {
        console.error('Error sending email:', error);
        return { success: false, error: error.message || 'Failed to send email' };
    }
}
