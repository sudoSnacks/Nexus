'use client';

import { X, Calendar, MapPin, Ticket, Clock, Info } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import Link from 'next/link';

interface EventPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    event: {
        id: string;
        name: string;
        date: string;
        location: string;
        ai_summary?: string;
        ai_key_times?: { [key: string]: string | number } | string[]; // Adapt based on actual generation
        gallery_images?: string[];
        primary_color?: string; // Hex code
    };
}

export default function EventPreviewModal({ isOpen, onClose, event }: EventPreviewModalProps) {
    const [emblaRef] = useEmblaCarousel({ loop: true });

    if (!isOpen) return null;

    // Logic to handle both old AI JSON and new Manual Text
    let blurb = "";
    let keyDetails: string[] = [];

    if (event.ai_summary) {
        if (event.ai_summary.trim().startsWith('{')) {
            // Support legacy AI data if any exists
            try {
                const parsed = JSON.parse(event.ai_summary);
                blurb = parsed.blurb || "";
                keyDetails = parsed.key_details || [];
            } catch {
                blurb = event.ai_summary;
            }
        } else {
            // New Text Format
            blurb = event.ai_summary;
        }
    } else {
        blurb = "No description provided.";
    }

    // Manual highlights take precedence
    if (event.ai_key_times && Array.isArray(event.ai_key_times) && event.ai_key_times.length > 0) {
        // @ts-ignore
        keyDetails = event.ai_key_times;
    }

    // Defaults / Fallback
    if (!blurb && keyDetails.length === 0) {
        blurb = "Join us for an unforgettable experience.";
    }

    // Filter valid images
    const validGalleryImages = event.gallery_images?.filter(url => url && typeof url === 'string' && url.length > 5) || [];

    const images = validGalleryImages.length > 0
        ? validGalleryImages
        : [
            "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2670&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2669&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2612&auto=format&fit=crop"
        ];

    const primaryColor = event.primary_color || "#4f46e5"; // Default Indigo

    // Basic optimization for generic URLs if possible, or just pass through
    const getOptimizedImageUrl = (url: string) => url;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-5xl bg-[#0f172a] rounded-2xl shadow-2xl overflow-hidden border border-white/10 flex flex-col md:flex-row max-h-[90vh]">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-all"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Left Panel: Content (40%) */}
                <div className="w-full md:w-2/5 p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10 bg-gradient-to-b from-[#1e293b] to-[#0f172a] overflow-y-auto">
                    <div className="space-y-6">
                        <div>
                            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 block">The Experience</span>
                            <h2 className="text-3xl font-bold text-white leading-tight mb-2" style={{ color: primaryColor }}>
                                {event.name}
                            </h2>
                            <div className="flex items-center gap-2 text-gray-400 text-sm">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(event.date).toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>
                            </div>
                        </div>

                        {/* Summary Blurb */}
                        <div className="prose prose-invert">
                            <p className="text-lg leading-relaxed text-gray-300 font-light whitespace-pre-wrap">
                                {blurb}
                            </p>
                        </div>

                        {/* At a Glance / Key Details */}
                        {keyDetails.length > 0 && (
                            <div className="bg-white/5 rounded-xl p-5 border border-white/5">
                                <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gray-400 mb-3">
                                    <Clock className="w-4 h-4" /> Highlights
                                </h3>
                                <ul className="space-y-3">
                                    {keyDetails.map((detail, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-sm text-gray-300">
                                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: primaryColor }} />
                                            {detail}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className="hidden md:block mt-8 text-xs text-gray-500 italic">
                        {event.location}
                    </div>
                </div>

                {/* Right Panel: Visuals & Action (60%) */}
                <div className="w-full md:w-3/5 relative flex flex-col h-64 md:h-auto bg-gray-900 min-h-[300px]">

                    {/* Carousel */}
                    <div className="flex-1 overflow-hidden relative" ref={emblaRef}>
                        <div className="flex h-full touch-pan-y">
                            {images.map((src, index) => (
                                <div className="flex-[0_0_100%] min-w-0 relative h-64 md:h-full" key={index}>
                                    <img
                                        src={getOptimizedImageUrl(src)}
                                        alt={`Slide ${index + 1}`}
                                        className="absolute block w-full h-full object-cover opacity-90"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60" />
                                </div>
                            ))}
                        </div>
                        {/* Pagination Dots (Optional enhancements could go here) */}
                    </div>

                    {/* Sticky Action Bar */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent pt-12 flex items-center justify-between">
                        <div className="text-white">
                            <p className="text-sm text-gray-300 mb-1 flex items-center gap-2">
                                <MapPin className="w-4 h-4" /> {event.location}
                            </p>
                        </div>
                        <Link
                            href={`/events/${event.id}/register`}
                            className="px-8 py-3 rounded-full font-bold text-white shadow-lg transform hover:scale-105 transition-all text-sm md:text-base flex items-center gap-2"
                            style={{ backgroundColor: primaryColor }}
                        >
                            <Ticket className="w-5 h-5" />
                            Register Now
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
