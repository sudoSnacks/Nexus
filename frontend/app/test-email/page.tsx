"use client";

import { sendDidYouGetInEmail, sendCertificateEmail } from "@/actions/email";
import { useState } from "react";

export default function TestEmailPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSendInvited = async () => {
        setLoading(true);
        try {
            const result = await sendDidYouGetInEmail(email, "Test User", "accepted", {
                name: "GDG Nexus Launch",
                date: "2025-01-01",
                location: "Main Auditorium",
                ticketId: "TICKET-12345"
            });
            setMessage(result.success ? "Invited email sent!" : "Failed to send.");
        } catch (e) {
            setMessage("Error: " + e);
        }
        setLoading(false);
    };

    const handleSendRejected = async () => {
        setLoading(true);
        try {
            const result = await sendDidYouGetInEmail(email, "Test User", "rejected", {
                name: "GDG Nexus Launch",
                date: "2025-01-01",
                location: "Main Auditorium"
            });
            setMessage(result.success ? "Rejected email sent!" : "Failed to send.");
        } catch (e) {
            setMessage("Error: " + e);
        }
        setLoading(false);
    };

    const handleSendCertificate = async () => {
        setLoading(true);
        try {
            const result = await sendCertificateEmail(email, "Test User", "GDG Nexus Launch");
            setMessage(result.success ? "Certificate email sent!" : "Failed to send.");
        } catch (e) {
            setMessage("Error: " + e);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4">
            <h1 className="text-3xl font-bold mb-8">Email Integration Test</h1>

            <input
                type="email"
                placeholder="Enter recipient email"
                className="p-3 rounded bg-white/10 border border-white/20 mb-4 w-full max-w-md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <div className="flex gap-4 mb-8">
                <button
                    onClick={handleSendInvited}
                    disabled={loading || !email}
                    className="bg-green-600 px-6 py-2 rounded hover:bg-green-500 disabled:opacity-50"
                >
                    Send Invited (w/ Ticket)
                </button>
                <button
                    onClick={handleSendRejected}
                    disabled={loading || !email}
                    className="bg-red-600 px-6 py-2 rounded hover:bg-red-500 disabled:opacity-50"
                >
                    Send Rejected
                </button>
                <button
                    onClick={handleSendCertificate}
                    disabled={loading || !email}
                    className="bg-blue-600 px-6 py-2 rounded hover:bg-blue-500 disabled:opacity-50"
                >
                    Send Certificate
                </button>
            </div>

            {loading && <p className="text-gray-400">Sending...</p>}
            {message && <p className="text-white font-mono">{message}</p>}
        </div>
    );
}
