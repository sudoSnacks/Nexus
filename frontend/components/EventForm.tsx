'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, Wand2, MapPin, Calendar, Image as ImageIcon, Users, CheckCircle, Upload, X, Ban } from 'lucide-react';
import ImageUpload from "@/components/ImageUpload";
import EventPreviewCard from "./EventPreviewCard";
import Link from 'next/link';

// --- Types ---
interface EventFormProps {
    mode: 'create' | 'edit';
    initialData?: {
        id?: string;
        name: string;
        date: string;
        location: string;
        capacity?: number | null;
        requires_approval: boolean;
        is_registration_closed?: boolean;
        logo_url?: string;
        gallery_images?: string[];
        // AI / Content
        ai_summary?: string;
        ai_key_times?: string[];
        primary_color?: string;
    };
    action: (formData: FormData) => Promise<void>;
}

interface FormDataState {
    name: string;
    date: string;
    location: string;
    capacity: string;
    requires_approval: boolean;
    is_registration_closed: boolean;
    logo_url: string;
    gallery_images: string[];
    ai_summary: string;
    ai_key_times: string[];
}

// --- Steps Configuration ---
const STEPS = [
    { id: 'identity', title: 'Identity', icon: Wand2, description: "Name & Capacity" },
    { id: 'logistics', title: 'Logistics', icon: MapPin, description: "Time & Place" },
    { id: 'content', title: 'Content', icon: Calendar, description: "AI Description" },
    { id: 'visuals', title: 'Visuals', icon: ImageIcon, description: "Images & Gallery" },
    { id: 'confirm', title: 'Confirm', icon: CheckCircle, description: "Review & Publish" },
];

export default function EventForm({ mode, initialData, action }: EventFormProps) {
    // --- State ---
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Consolidated Form State
    const [data, setData] = useState<FormDataState>({
        name: initialData?.name || '',
        date: initialData?.date || '',
        location: initialData?.location || '',
        capacity: initialData?.capacity?.toString() || '',
        requires_approval: initialData?.requires_approval || false,
        is_registration_closed: initialData?.is_registration_closed || false,
        logo_url: initialData?.logo_url || '',
        gallery_images: initialData?.gallery_images || [],
        ai_summary: initialData?.ai_summary || '',
        ai_key_times: initialData?.ai_key_times || [],
    });

    // AI Generation State
    const [aiContext, setAiContext] = useState('');
    const [isGeneratingAI, setIsGeneratingAI] = useState(false);

    // --- Helpers ---
    const updateField = <K extends keyof FormDataState>(key: K, value: FormDataState[K]) => {
        setData(prev => ({ ...prev, [key]: value }));
    };

    const nextStep = () => setCurrentStep(p => Math.min(p + 1, STEPS.length - 1));
    const prevStep = () => setCurrentStep(p => Math.max(p - 1, 0));

    const handleGenerateAI = async () => {
        if (!data.name || !data.date || !data.location) {
            alert("Please fill in Name, Date, and Location first.");
            return;
        }
        setIsGeneratingAI(true);
        try {
            const { generateEventContent } = await import('@/app/events/ai-action');
            const result = await generateEventContent(data.name, data.date, data.location, aiContext);

            // Allow manual override, but append if empty
            const summary = `**Summary**\n${result.summary}\n\n**Details**\n${result.body}`;
            updateField('ai_summary', summary);
            updateField('ai_key_times', result.key_details);

        } catch (e) {
            console.error(e);
            alert("AI Generation failed. Please try again.");
        } finally {
            setIsGeneratingAI(false);
        }
    };

    // --- Renderers for Each Step ---
    const renderStepContent = (stepIndex: number) => {
        switch (stepIndex) {
            case 0: // IDENTITY
                return (
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-muted-foreground">Event Name</label>
                            <input
                                type="text"
                                required
                                value={data.name}
                                onChange={e => updateField('name', e.target.value)}
                                placeholder="e.g. Google I/O Extended"
                                className="w-full text-3xl font-bold bg-transparent border-b-2 border-border focus:border-indigo-500 py-3 outline-none placeholder:text-muted-foreground/50 transition-colors"
                                autoFocus
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-4">
                            {/* Capacity */}
                            <div className="bg-muted/10 border border-border rounded-2xl p-4 hover:border-indigo-500/50 transition-colors group">
                                <Users className="w-5 h-5 text-muted-foreground group-hover:text-indigo-400 mb-2" />
                                <label className="block text-xs text-muted-foreground mb-1">Capacity</label>
                                <input
                                    type="number"
                                    value={data.capacity}
                                    onChange={e => updateField('capacity', e.target.value)}
                                    placeholder="Unlimited"
                                    className="w-full bg-transparent font-medium outline-none text-lg"
                                />
                            </div>

                            {/* Approval Required */}
                            <label className={`cursor-pointer bg-white/5 border rounded-2xl p-4 transition-all flex flex-col justify-between ${data.requires_approval ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/5 hover:border-white/20'}`}>
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={data.requires_approval}
                                    onChange={e => updateField('requires_approval', e.target.checked)}
                                />
                                <CheckCircle className={`w-5 h-5 mb-2 ${data.requires_approval ? 'text-indigo-400' : 'text-gray-600'}`} />
                                <span className={`font-medium ${data.requires_approval ? 'text-indigo-200' : 'text-gray-400'}`}>Approval Required</span>
                            </label>

                            {/* Close Registration */}
                            <label className={`cursor-pointer bg-white/5 border rounded-2xl p-4 transition-all flex flex-col justify-between ${data.is_registration_closed ? 'border-red-500 bg-red-500/10' : 'border-white/5 hover:border-white/20'}`}>
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={data.is_registration_closed}
                                    onChange={e => updateField('is_registration_closed', e.target.checked)}
                                />
                                <Ban className={`w-5 h-5 mb-2 ${data.is_registration_closed ? 'text-red-400' : 'text-gray-600'}`} />
                                <span className={`font-medium ${data.is_registration_closed ? 'text-red-200' : 'text-gray-400'}`}>Close Registration</span>
                            </label>
                        </div>
                    </div>
                );

            case 1: // LOGISTICS
                return (
                    <div className="space-y-6">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
                            <div className="flex items-center gap-2 text-indigo-400 mb-2">
                                <Calendar className="w-5 h-5" />
                                <span className="text-sm font-bold uppercase tracking-wider">Date & Time</span>
                            </div>
                            <input
                                type="datetime-local"
                                required
                                value={data.date}
                                onChange={e => updateField('date', e.target.value)}
                                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-4 outline-none focus:border-indigo-500 transition-all text-xl"
                            />
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
                            <div className="flex items-center gap-2 text-pink-400 mb-2">
                                <MapPin className="w-5 h-5" />
                                <span className="text-sm font-bold uppercase tracking-wider">Location</span>
                            </div>
                            <input
                                type="text"
                                required
                                placeholder="Venue Name & Address"
                                value={data.location}
                                onChange={e => updateField('location', e.target.value)}
                                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-4 outline-none focus:border-pink-500 transition-all text-xl"
                            />
                        </div>
                    </div>
                );

            case 2: // CONTENT (AI)
                return (
                    <div className="space-y-6">
                        {/* AI Generator Box */}
                        <div className="bg-indigo-900/10 border border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Wand2 className="w-32 h-32 rotate-12" />
                            </div>
                            <h3 className="text-lg font-semibold text-indigo-300 mb-3 flex items-center gap-2">
                                <Wand2 className="w-5 h-5" /> AI Content Assistant
                            </h3>
                            <textarea
                                value={aiContext}
                                onChange={(e) => setAiContext(e.target.value)}
                                rows={2}
                                className="w-full bg-black/40 border border-indigo-500/20 rounded-xl p-4 text-sm focus:ring-1 focus:ring-indigo-500/50 outline-none resize-none mb-3 z-10 relative"
                                placeholder="E.g. 'Advanced React workshop for seniors, professional but fun tone'"
                            />
                            <button
                                type="button"
                                onClick={handleGenerateAI}
                                disabled={isGeneratingAI}
                                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2 z-10 relative"
                            >
                                {isGeneratingAI ? <span className="animate-spin">⌛</span> : <Wand2 className="w-4 h-4" />}
                                Generate Content
                            </button>
                        </div>

                        {/* Description Editor */}
                        <div>
                            <label className="text-gray-400 text-sm mb-2 block">Description (Markdown)</label>
                            <textarea
                                value={data.ai_summary}
                                onChange={(e) => updateField('ai_summary', e.target.value)}
                                rows={8}
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm font-mono text-gray-300 focus:border-indigo-500/50 outline-none"
                            />
                        </div>

                        {/* Highlights Editor */}
                        <div>
                            <label className="text-gray-400 text-sm mb-2 block">Key Highlights</label>
                            <div className="flex flex-wrap gap-2">
                                {data.ai_key_times.map((item, idx) => (
                                    <div key={idx} className="flex items-center bg-white/5 border border-white/10 rounded-full pl-3 pr-1 py-1">
                                        <input
                                            value={item}
                                            onChange={(e) => {
                                                const newItems = [...data.ai_key_times];
                                                newItems[idx] = e.target.value;
                                                updateField('ai_key_times', newItems);
                                            }}
                                            className="bg-transparent border-none outline-none text-sm text-gray-300 w-32"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => updateField('ai_key_times', data.ai_key_times.filter((_, i) => i !== idx))}
                                            className="ml-1 hover:bg-white/10 p-1 rounded-full text-gray-500 hover:text-red-400"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => updateField('ai_key_times', [...data.ai_key_times, "New Highlight"])}
                                    className="px-3 py-1.5 rounded-full border border-dashed border-gray-600 text-gray-400 text-xs hover:border-gray-400 hover:text-gray-200 transition-colors"
                                >
                                    + Add Item
                                </button>
                            </div>
                        </div>
                    </div>
                );

            case 3: // VISUALS
                return (
                    <div className="space-y-8">
                        <div>
                            <label className="text-lg font-medium text-white mb-2 block">Cover Image</label>
                            <div className={`h-64 rounded-3xl border border-white/10 overflow-hidden relative group transition-all ${data.logo_url ? 'bg-black' : 'bg-white/5 hover:bg-white/10'}`}>
                                <ImageUpload
                                    onUpload={(url) => updateField('logo_url', url)}
                                    folder="logos"
                                    compact
                                    className="w-full h-full"
                                    label="Upload Cover"
                                />
                                {data.logo_url && (
                                    <div className="absolute inset-0 pointer-events-none">
                                        <img src={data.logo_url} className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-lg font-medium text-white">Gallery</label>
                                <span className="text-xs text-gray-500">{data.gallery_images.length} Images</span>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {data.gallery_images.map((url, i) => (
                                    <div key={i} className="aspect-[4/3] rounded-2xl bg-white/5 border border-white/10 overflow-hidden relative group">
                                        <img src={url} className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => updateField('gallery_images', data.gallery_images.filter((_, idx) => idx !== i))}
                                            className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                <div className="aspect-[4/3] rounded-2xl bg-white/5 border border-dashed border-white/10 overflow-hidden">
                                    <ImageUpload
                                        onUpload={(url) => updateField('gallery_images', [...data.gallery_images, url])}
                                        folder="gallery"
                                        compact
                                        multiple
                                        label="+"
                                        className="w-full h-full"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 4: // CONFIRM
                return (
                    <div className="space-y-8">
                        <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-8 text-center space-y-4">
                            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-green-500" />
                            </div>
                            <h2 className="text-2xl font-bold text-green-400">Ready to Publish?</h2>
                            <p className="text-muted-foreground max-w-md mx-auto">
                                You are about to create <strong>{data.name}</strong> on <strong>{data.date ? new Date(data.date).toLocaleDateString() : '...'}</strong> at <strong>{data.location}</strong>.
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Please review your details one last time. You can still go back and edit anything.
                            </p>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <form action={action} className="flex flex-col lg:flex-row h-screen bg-background text-foreground font-sans overflow-hidden">

            {/* --- HIDDEN INPUTS FOR SERVER ACTION --- */}
            {mode === 'edit' && <input type="hidden" name="id" value={initialData?.id} />}
            <input type="hidden" name="name" value={data.name} />
            <input type="hidden" name="date" value={data.date} />
            <input type="hidden" name="location" value={data.location} />
            <input type="hidden" name="capacity" value={data.capacity} />
            <input type="hidden" name="requires_approval" value={data.requires_approval ? "on" : "off"} />
            <input type="hidden" name="is_registration_closed" value={data.is_registration_closed ? "on" : "off"} />
            <input type="hidden" name="logo_url" value={data.logo_url} />
            <input type="hidden" name="gallery_images" value={JSON.stringify(data.gallery_images)} />
            <input type="hidden" name="ai_summary_text" value={data.ai_summary} />
            <input type="hidden" name="ai_key_times_json" value={JSON.stringify(data.ai_key_times)} />

            {/* --- LEFT PANEL: NAVIGATION & FORM --- */}
            <div className={`flex flex-col h-full border-r border-border bg-background z-10 ${mode === 'edit' ? 'lg:w-1/2 w-full' : 'w-full max-w-4xl mx-auto border-x'}`}>

                {/* Header */}
                <div className="p-6 md:p-8 flex justify-between items-center border-b border-border">
                    <Link href="/events" className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back
                    </Link>
                    <div className="flex gap-2">
                        {STEPS.map((step, idx) => (
                            <div
                                key={step.id}
                                className={`h-1.5 w-8 rounded-full transition-all ${idx <= currentStep ? 'bg-indigo-500' : 'bg-white/10'}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Content Area - Scrollable */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8">
                    <div className="max-w-xl mx-auto">
                        <div className="mb-8">
                            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{STEPS[currentStep].title}</h1>
                            <p className="text-muted-foreground">{STEPS[currentStep].description}</p>
                        </div>

                        {renderStepContent(currentStep)}
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="p-6 md:p-8 border-t border-border bg-background/50 backdrop-blur-md flex justify-between">
                    <button
                        type="button"
                        onClick={prevStep}
                        disabled={currentStep === 0}
                        className="px-6 py-3 rounded-xl text-gray-400 font-medium hover:text-white disabled:opacity-30 transition-colors"
                    >
                        Back
                    </button>

                    {currentStep === STEPS.length - 1 ? (
                        <button
                            type="submit"
                            onClick={() => setIsSubmitting(true)}
                            disabled={isSubmitting}
                            className="px-8 py-3 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                        >
                            {isSubmitting ? 'Saving...' : (mode === 'edit' ? 'Save Changes' : 'Publish Event')}
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={nextStep}
                            className="px-8 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition-all flex items-center gap-2 shadow-lg shadow-indigo-900/20"
                        >
                            Next Step <ArrowRight className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* --- RIGHT PANEL: PREVIEW (Only in Edit Mode or Large Screen) --- */}
            {mode === 'edit' && (
                <div className="hidden lg:block lg:w-1/2 relative bg-[#0a0a0a]">
                    <div className="absolute inset-0 flex items-center justify-center p-12">
                        <div className="w-full max-w-md h-full max-h-[800px] pointer-events-none select-none opacity-90 scale-90 origin-top">
                            <EventPreviewCard
                                event={{
                                    name: data.name || "Event Name",
                                    date: data.date,
                                    location: data.location || "Location",
                                    ai_summary: data.ai_summary,
                                    ai_key_times: data.ai_key_times,
                                    gallery_images: data.gallery_images,
                                    logo_url: data.logo_url
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </form>
    );
}
