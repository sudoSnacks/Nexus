import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Calendar, MapPin, Clock, ArrowLeft, Ticket, Check } from "lucide-react";
import BackgroundGradient from "@/components/BackgroundGradient";

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    // Fetch Event
    const { data: event, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !event) {
        redirect("/?error=Event not found");
    }

    // Parse Highlights if stored as text (legacy) or ensure it's an array
    let highlights: string[] = [];
    if (event.ai_key_times) {
        if (Array.isArray(event.ai_key_times)) {
            highlights = event.ai_key_times;
        } else if (typeof event.ai_key_times === 'string') {
            try {
                highlights = JSON.parse(event.ai_key_times);
            } catch {
                highlights = [event.ai_key_times];
            }
        }
    }

    const eventDate = new Date(event.date);

    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-indigo-500/30">
            <BackgroundGradient />

            {/* Navbar / Back Button */}
            <nav className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center pointer-events-none">
                <Link href="/events" className="pointer-events-auto flex items-center justify-center w-10 h-10 rounded-full bg-background/50 hover:bg-background/80 border border-border backdrop-blur-md transition-all group">
                    <ArrowLeft className="w-5 h-5 text-muted-foreground group-hover:text-foreground" />
                </Link>
                {/* Logo or Brand could go here */}
            </nav>

            <main className="relative z-10">
                {/* Hero Section */}
                <section className="relative min-h-[60vh] flex flex-col justify-end pb-20 px-4 pt-32">
                    <div className="container mx-auto max-w-5xl">
                        <div className="space-y-6">
                            {/* Date Badge */}
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-200 text-sm font-medium backdrop-blur-sm">
                                <Calendar className="w-4 h-4" />
                                {eventDate.toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                            </div>

                            {/* Title */}
                            <h1 className="text-5xl md:text-7xl font-bold text-foreground tracking-tight leading-tight max-w-4xl">
                                {event.name}
                            </h1>

                            {/* Meta */}
                            <div className="flex flex-wrap gap-6 text-muted-foreground text-lg">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-indigo-400" />
                                    {eventDate.toLocaleTimeString("en-US", { hour: 'numeric', minute: '2-digit' })}
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-indigo-400" />
                                    {event.location}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Content Grid */}
                <section className="container mx-auto max-w-5xl px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-12">

                    {/* Left Column: Description (2/3) */}
                    <div className="md:col-span-2 space-y-12">
                        {/* Event Description */}
                        <div>
                            <h2 className="text-2xl font-bold text-foreground mb-6">About the Event</h2>
                            <div className="prose prose-lg dark:prose-invert text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                {event.ai_summary || "No description available yet."}
                            </div>
                        </div>

                        {/* Gallery */}
                        {event.gallery_images && event.gallery_images.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-bold text-foreground mb-6">Gallery</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    {event.gallery_images.map((url: string, idx: number) => (
                                        <div key={idx} className={`relative rounded-xl overflow-hidden border border-border ${idx === 0 ? 'col-span-2 h-64 md:h-80' : 'h-48'}`}>
                                            <img src={url} alt={`Gallery ${idx}`} className="absolute w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Sticky Sidebar (1/3) */}
                    <div className="relative">
                        <div className="sticky top-24 space-y-8">

                            {/* Registration Card */}
                            <div className="p-6 rounded-2xl bg-card border border-border backdrop-blur-xl shadow-2xl">
                                <div className="mb-6">
                                    <h3 className="text-xl font-bold text-card-foreground mb-1">Registration</h3>
                                    <p className="text-muted-foreground text-sm">Secure your spot today.</p>
                                </div>

                                <Link
                                    href={`/events/${id}/register`}
                                    className="block w-full py-4 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-center shadow-lg shadow-indigo-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    Get Tickets
                                </Link>

                                {event.capacity && (
                                    <p className="text-center text-xs text-gray-500 mt-4">
                                        Limited Capacity available
                                    </p>
                                )}
                            </div>

                            {/* Highlights */}
                            {highlights.length > 0 && (
                                <div className="p-6 rounded-2xl bg-card/50 border border-border">
                                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">
                                        Effect Highlights
                                    </h3>
                                    <ul className="space-y-4">
                                        {highlights.map((item, idx) => (
                                            <li key={idx} className="flex gap-3 text-muted-foreground text-sm">
                                                <div className="mt-1 w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                                                    <Check className="w-3 h-3 text-indigo-400" />
                                                </div>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                        </div>
                    </div>

                </section>
            </main>
        </div>
    );
}
