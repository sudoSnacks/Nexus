'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendCertificateEmail(to: string, name: string, certificateDataUrl: string, eventName: string) {
    if (!process.env.RESEND_API_KEY) {
        console.error("Missing RESEND_API_KEY");
        return { success: false, error: "Server configuration error" };
    }

    try {
        // Convert data URL to Buffer for attachment
        const base64Data = certificateDataUrl.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, 'base64');

        const { data, error } = await resend.emails.send({
            from: 'Events <onboarding@resend.dev>', // Update this with your verified domain
            to: [to],
            subject: `Your Certificate for ${eventName}`,
            html: `
                <div style="font-family: sans-serif; color: #333;">
                    <h1>Hi ${name},</h1>
                    <p>Thank you for attending <strong>${eventName}</strong>!</p>
                    <p>We are proud to present you with this certificate of participation.</p>
                    <p>Please find it attached to this email.</p>
                    <br/>
                    <p>Best regards,</p>
                    <p>The Team</p>
                </div>
            `,
            attachments: [
                {
                    filename: 'Certificate.png',
                    content: buffer,
                },
            ],
        });

        if (error) {
            console.error("Resend Error:", error);
            return { success: false, error: error.message };
        }

        return { success: true, data };
    } catch (err: any) { // Type 'any' for general error catching
        console.error("Submission Error:", err);
        return { success: false, error: err.message };
    }
}
