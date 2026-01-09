'use client';

import { Calendar, MapPin, Ticket, Clock, Info } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import Link from 'next/link';

interface EventPreviewCardProps {
    event: {
        id?: string;
        name: string;
        date: string;
        location: string;
        // Supports both raw inputs and final detailed structure
        ai_summary?: string;
        ai_key_times?: string[] | { [key: string]: string | number } | null;
        gallery_images?: string[];
        primary_color?: string; // Optional override
        logo_url?: string;
    };
    compact?: boolean; // For smaller displays
}

export default function EventPreviewCard({ event, compact = false }: EventPreviewCardProps) {
    const [emblaRef] = useEmblaCarousel({ loop: true });

    // --- Content Normalization Logic ---
    let blurb = "";
    let keyDetails: string[] = [];

    // "Smart" Parsing of summary for legacy reasons or just raw text
    if (event.ai_summary) {
        if (event.ai_summary.trim().startsWith('{')) {
            try {
                const parsed = JSON.parse(event.ai_summary);
                blurb = parsed.blurb || "";
                keyDetails = parsed.key_details || [];
            } catch {
                blurb = event.ai_summary;
            }
        } else {
            blurb = event.ai_summary;
        }
    } else {
        blurb = "No description provided yet.";
    }

    // Explicit highlights override legacy parsed ones
    if (event.ai_key_times && Array.isArray(event.ai_key_times) && event.ai_key_times.length > 0) {
        keyDetails = event.ai_key_times as string[];
    }

    // Default Fallback
    if (!blurb && keyDetails.length === 0) {
        blurb = "Join us for an unforgettable experience.";
    }

    // Image Logic
    const validGalleryImages = event.gallery_images?.filter(url => url && typeof url === 'string' && url.length > 5) || [];

    // Combine Logo + Gallery for the preview carousel if desired, or just use gallery
    // For this design, let's prepend the logo if it exists so it shows first
    const allImages = event.logo_url ? [event.logo_url, ...validGalleryImages] : validGalleryImages;

    const images = allImages.length > 0
        ? allImages
        : [
            "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2670&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2669&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2612&auto=format&fit=crop"
        ];

    const primaryColor = event.primary_color || "#4f46e5"; // Default Indigo

    // Date Formatting
    const dateObj = event.date ? new Date(event.date) : new Date();
    const dateString = isNaN(dateObj.getTime()) ? "Date TBD" : dateObj.toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' });


    return (
        <div className={`active-preview-card w-full bg-[#0f172a] rounded-2xl shadow-2xl overflow-hidden border border-white/10 flex flex-col ${compact ? '' : 'md:flex-row'} h-full max-h-[800px]`}>

            {/* Left Panel: Content (40%) */}
            <div className={`w-full ${compact ? '' : 'md:w-2/5'} p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10 bg-gradient-to-b from-[#1e293b] to-[#0f172a] overflow-y-auto custom-scrollbar`}>
                <div className="space-y-6">
                    <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 block">The Experience</span>
                        <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-2" style={{ color: primaryColor }}>
                            {event.name || "Untitled Event"}
                        </h2>
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                            <Calendar className="w-4 h-4" />
                            <span>{dateString}</span>
                        </div>
                    </div>

                    {/* Summary Blurb */}
                    <div className="prose prose-invert prose-sm">
                        <p className="text-gray-300 font-light whitespace-pre-wrap">
                            {blurb}
                        </p>
                    </div>

                    {/* At a Glance / Key Details */}
                    {keyDetails.length > 0 && (
                        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                            <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                                <Clock className="w-3 h-3" /> Highlights
                            </h3>
                            <ul className="space-y-2">
                                {keyDetails.map((detail, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-xs md:text-sm text-gray-300">
                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: primaryColor }} />
                                        {detail}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="hidden md:block mt-6 text-xs text-gray-500 italic">
                    {event.location || "Location TBD"}
                </div>
            </div>

            {/* Right Panel: Visuals & Action (60%) */}
            <div className={`w-full ${compact ? '' : 'md:w-3/5'} relative flex flex-col h-64 md:h-auto bg-gray-900 min-h-[300px]`}>

                {/* Carousel */}
                <div className="flex-1 overflow-hidden relative" ref={emblaRef}>
                    <div className="flex h-full touch-pan-y">
                        {images.map((src, index) => (
                            <div className="flex-[0_0_100%] min-w-0 relative h-full" key={index}>
                                <img
                                    src={src}
                                    alt={`Slide ${index + 1}`}
                                    className="absolute block w-full h-full object-cover opacity-90"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sticky Action Bar */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent pt-12 flex items-center justify-between z-10">
                    <div className="text-white">
                        <p className="text-sm text-gray-300 mb-1 flex items-center gap-2">
                            <MapPin className="w-4 h-4" /> {event.location || "Location"}
                        </p>
                    </div>

                    {/* Fake Button for Preview */}
                    <button
                        className="px-6 py-2 md:px-8 md:py-3 rounded-full font-bold text-white shadow-lg transform translate-y-0 text-sm md:text-base flex items-center gap-2 cursor-pointer"
                        style={{ backgroundColor: primaryColor }}
                        onClick={(e) => e.preventDefault()}
                    >
                        <Ticket className="w-5 h-5" />
                        Register
                    </button>
                </div>
            </div>
        </div>
    );
}
