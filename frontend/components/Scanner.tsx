"use client";

import React, { useEffect, useState, useRef } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Search, Loader2 } from 'lucide-react';
import { searchAttendee } from '@/app/actions/scanner';

interface ScannerProps {
    onScan?: (result: string) => void;
}

export default function Scanner({ onScan }: ScannerProps) {
    const [scanResult, setScanResult] = useState<string | null>(null);
    const [manualQuery, setManualQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const router = useRouter();
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const readerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Initialize scanner
        const initScanner = async () => {
            if (scannerRef.current) return;

            try {
                const scanner = new Html5Qrcode("reader");
                scannerRef.current = scanner;

                await scanner.start(
                    { facingMode: "environment" },
                    {
                        fps: 10,
                        qrbox: { width: 250, height: 250 },
                        aspectRatio: 1.0,
                    },
                    (decodedText) => {
                        handleScan(decodedText);
                    },
                    (errorMessage) => {
                        // ignore frame errors
                    }
                );
            } catch (err) {
                console.error("Error starting scanner:", err);
                setCameraError("Camera access denied or not available. Please use manual check-in.");
            }
        };

        initScanner();

        return () => {
            if (scannerRef.current) {
                if (scannerRef.current.isScanning) {
                    scannerRef.current.stop().then(() => {
                        scannerRef.current?.clear();
                        scannerRef.current = null;
                    }).catch(err => {
                        console.warn("Scanner stop failed", err);
                        // Force clear if stop fails
                        try { scannerRef.current?.clear(); } catch (e) { }
                        scannerRef.current = null;
                    });
                } else {
                    try { scannerRef.current.clear(); } catch (e) { }
                    scannerRef.current = null;
                }

            }
        };
    }, []);

    const pauseScanner = () => {
        if (scannerRef.current && scannerRef.current.isScanning) {
            scannerRef.current.pause();
        }
    };

    const handleManualSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!manualQuery.trim()) return;

        setIsSearching(true);
        setSearchError(null);

        try {
            const attendeeId = await searchAttendee(manualQuery.trim());
            if (attendeeId) {
                if (onScan) {
                    onScan(attendeeId);
                } else {
                    router.push(`/admin/check-in/${attendeeId}`);
                }
            } else {
                setSearchError("No attendee found with that email or ID.");
            }
        } catch (err) {
            setSearchError("An error occurred during search.");
        } finally {
            setIsSearching(false);
        }
    };

    const handleScan = (decodedText: string) => {
        setScanResult(decodedText);
        try {
            const url = new URL(decodedText);
            // Check if it matches our expected URL pattern or is just an ID
            if (url.pathname.startsWith('/admin/check-in/')) {
                pauseScanner();
                if (onScan) {
                    // Extract ID from URL
                    const id = url.pathname.split('/admin/check-in/')[1];
                    onScan(id);
                } else {
                    router.push(url.pathname);
                }
            }
        } catch (e) {
            // Check if it's a UUID directly
            if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(decodedText)) {
                pauseScanner();
                if (onScan) {
                    onScan(decodedText);
                } else {
                    router.push(`/admin/check-in/${decodedText}`);
                }
            }
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col font-sans">
            <header className="p-4 flex items-center border-b border-white/10 bg-white/5 backdrop-blur-md sticky top-0 z-10 w-full">
                <Link href="/" className="mr-4 text-gray-400 hover:text-white">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-lg font-bold">QR Scanner & Check-in</h1>
            </header>

            <main className="flex-1 flex flex-col p-4 w-full max-w-lg mx-auto space-y-8">
                {/* Camera Section */}
                <div className="space-y-2">
                    <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Scan QR Code</h2>
                    <div className="w-full aspect-square bg-gray-900 rounded-2xl overflow-hidden border-2 border-indigo-500 shadow-2xl relative">
                        {cameraError ? (
                            <div className="flex items-center justify-center h-full p-4 text-center text-red-400 bg-gray-900">
                                <p>{cameraError}</p>
                            </div>
                        ) : (
                            <div id="reader" ref={readerRef} className="w-full h-full"></div>
                        )}
                        <div className="absolute inset-0 border-2 border-white/20 rounded-2xl pointer-events-none"></div>
                    </div>
                    {scanResult && (
                        <p className="text-xs text-green-400 text-center font-mono truncate">
                            Detected: {scanResult}
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <div className="h-px bg-white/10 flex-1"></div>
                    <span className="text-gray-500 text-sm">OR</span>
                    <div className="h-px bg-white/10 flex-1"></div>
                </div>

                {/* Manual Check-in Section */}
                <div className="space-y-4">
                    <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Manual Check-in</h2>
                    <form onSubmit={handleManualSearch} className="space-y-3">
                        <div className="space-y-2">
                            <input
                                type="text"
                                placeholder="Enter Email or Ticket ID"
                                value={manualQuery}
                                onChange={(e) => setManualQuery(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                            />
                            {searchError && (
                                <p className="text-red-400 text-xs px-1">{searchError}</p>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={isSearching || !manualQuery.trim()}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                        >
                            {isSearching ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Search className="w-5 h-5" />
                            )}
                            {isSearching ? 'Searching...' : 'Find Attendee'}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}
