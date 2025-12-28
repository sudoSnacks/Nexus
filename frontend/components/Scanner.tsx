"use client";

import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function Scanner() {
    const [scanResult, setScanResult] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const scanner = new Html5QrcodeScanner(
            "reader",
            {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0
            },
            /* verbose= */ false
        );

        scanner.render(
            (decodedText) => {
                setScanResult(decodedText);
                try {
                    const url = new URL(decodedText);
                    if (url.pathname.startsWith('/admin/check-in/')) {
                        scanner.clear();
                        router.push(url.pathname);
                    }
                } catch (e) {
                    // Not a valid URL
                }
            },
            (errorMessage) => {
                // parse error, ignore it.
            }
        );

        return () => {
            scanner.clear().catch(error => {
                console.error("Failed to clear html5-qrcode scanner. ", error);
            });
        };
    }, [router]);

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            <header className="p-4 flex items-center border-b border-white/10 bg-white/5 backdrop-blur-md sticky top-0 z-10 w-full">
                <Link href="/" className="mr-4 text-gray-400 hover:text-white">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-lg font-bold">QR Scanner</h1>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center p-4 relative w-full">
                <div className="w-full max-w-sm bg-gray-900 rounded-2xl overflow-hidden border-2 border-indigo-500 shadow-2xl relative">
                    <div id="reader" className="w-full h-full"></div>
                </div>

                <div className="mt-8 text-center space-y-2 px-4">
                    <p className="text-gray-400 text-sm">Align the QR code within the frame</p>
                    {scanResult && (
                        <div className="bg-gray-800 p-2 rounded text-xs font-mono break-all text-green-400 border border-green-500/30">
                            Last scan: {scanResult}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
