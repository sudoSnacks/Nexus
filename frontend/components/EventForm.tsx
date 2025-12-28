'use client';

import ImageUpload from "@/components/ImageUpload";
import Link from 'next/link';
import { useState } from 'react';
import { Trash2, X } from 'lucide-react';

interface EventFormProps {
    mode: 'create' | 'edit';
    initialData?: {
        id?: string;
        name: string;
        date: string;
        location: string;
        capacity?: number | null;
        requires_approval: boolean;
        logo_url?: string;
        gallery_images?: string[];
        primary_color?: string;
        ai_summary?: string;
        ai_key_times?: string[];
    };
    action: (formData: FormData) => Promise<void>;
}

export default function EventForm({ mode, initialData, action }: EventFormProps) {
    const [logoUrl, setLogoUrl] = useState(initialData?.logo_url || '');
    const [galleryUrls, setGalleryUrls] = useState<string[]>(initialData?.gallery_images || []);
    const [primaryColor, setPrimaryColor] = useState(initialData?.primary_color || '#4f46e5');

    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        date: initialData?.date || '',
        location: initialData?.location || '',
        capacity: initialData?.capacity?.toString() || '',
        requires_approval: initialData?.requires_approval || false,
    });

    // Content State (mapped to DB schema columns previously used for AI)
    const [aiBlurb, setAiBlurb] = useState(initialData?.ai_summary || '');
    const [aiKeyDetails, setAiKeyDetails] = useState<string[]>(initialData?.ai_key_times || []);

    return (
        <form action={action} className="mt-8 space-y-8">
            {mode === 'edit' && <input type="hidden" name="id" value={initialData?.id} />}

            {/* Hidden Inputs for Client state */}
            <input type="hidden" name="logo_url" value={logoUrl} />
            <input type="hidden" name="gallery_images" value={JSON.stringify(galleryUrls)} />
            <input type="hidden" name="primary_color" value={primaryColor} />
            <input type="hidden" name="ai_summary_text" value={aiBlurb} />
            <input type="hidden" name="ai_key_times_json" value={JSON.stringify(aiKeyDetails)} />
            <input type="hidden" name="requires_approval" value={formData.requires_approval ? "on" : "off"} />

            {/* Basic Info */}
            <div className="space-y-6 rounded-md shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">Event Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. Annual Tech Summit 2024"
                            className="block w-full rounded-lg border-white/10 bg-black/20 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5 px-3 transition-colors"
                        />
                    </div>

                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-400 mb-1">Date & Time</label>
                        <input
                            id="date"
                            name="date"
                            type="datetime-local"
                            required
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="block w-full rounded-lg border-white/10 bg-black/20 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5 px-3 transition-colors"
                        />
                    </div>

                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-400 mb-1">Location</label>
                        <input
                            id="location"
                            name="location"
                            type="text"
                            required
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            placeholder="e.g. Grand Hall, NYC"
                            className="block w-full rounded-lg border-white/10 bg-black/20 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5 px-3 transition-colors"
                        />
                    </div>
                </div>

                {/* Content Section */}
                <div className="bg-white/5 p-6 rounded-xl border border-white/10 space-y-6">
                    <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                        Event Details
                    </h3>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                        <textarea
                            value={aiBlurb}
                            onChange={(e) => setAiBlurb(e.target.value)}
                            rows={4}
                            placeholder="Describe your event..."
                            className="block w-full rounded-lg border-white/10 bg-black/40 text-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm p-3"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Key Highlights / Facts</label>
                        <div className="space-y-2">
                            {aiKeyDetails.map((detail, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <span className="text-indigo-400 mt-1.5">•</span>
                                    <input
                                        type="text"
                                        value={detail}
                                        onChange={(e) => {
                                            const newDetails = [...aiKeyDetails];
                                            newDetails[idx] = e.target.value;
                                            setAiKeyDetails(newDetails);
                                        }}
                                        className="block w-full rounded-lg border-white/10 bg-black/40 text-gray-200 text-sm py-2 px-3 focus:border-indigo-500 focus:ring-indigo-500"
                                        placeholder="e.g. Guest Speaker: Jane Doe"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setAiKeyDetails(prev => prev.filter((_, i) => i !== idx))}
                                        className="text-gray-500 hover:text-red-400 px-1"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => setAiKeyDetails([...aiKeyDetails, ""])}
                                className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1 mt-2"
                            >
                                + Add Highlight
                            </button>
                        </div>
                    </div>
                </div>

                {/* Branding */}
                <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-4">
                    <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Branding & Visuals</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Event Logo</label>
                            <ImageUpload onUpload={setLogoUrl} folder="logos" />
                            {logoUrl && (
                                <div className="mt-2 w-16 h-16 relative rounded-lg overflow-hidden border border-white/10">
                                    <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Primary Theme Color</label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="color"
                                    value={primaryColor}
                                    onChange={(e) => setPrimaryColor(e.target.value)}
                                    className="h-10 w-20 rounded cursor-pointer bg-transparent border-0 p-0"
                                />
                                <span className="text-gray-400 font-mono">{primaryColor}</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Gallery Images (Carousel)</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
                            {galleryUrls.map((url, idx) => (
                                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-white/10 group">
                                    <img src={url} alt="Gallery" className="object-cover w-full h-full" />
                                    <button
                                        type="button"
                                        onClick={() => setGalleryUrls(prev => prev.filter((_, i) => i !== idx))}
                                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all"
                                    >
                                        <Trash2 className="w-5 h-5 text-red-400" />
                                    </button>
                                </div>
                            ))}
                            <ImageUpload
                                onUpload={(url) => setGalleryUrls(prev => [...prev, url])}
                                folder="gallery"
                                label="Add Images"
                                multiple={true}
                                className=""
                            />
                        </div>
                    </div>
                </div>

                {/* Optional */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="capacity" className="block text-sm font-medium text-gray-400 mb-1">Capacity</label>
                        <input
                            id="capacity"
                            name="capacity"
                            type="number"
                            value={formData.capacity}
                            onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                            className="block w-full rounded-lg border-white/10 bg-black/20 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5 px-3 transition-colors"
                            placeholder="Unlimited"
                        />
                    </div>
                    <div className="flex items-center gap-3 h-full pt-6">
                        <input
                            id="requires_approval"
                            type="checkbox"
                            checked={formData.requires_approval}
                            onChange={(e) => setFormData({ ...formData, requires_approval: e.target.checked })}
                            className="w-5 h-5 rounded border-white/10 bg-black/20 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor="requires_approval" className="text-sm font-medium text-gray-400">Requires Admin Approval</label>
                    </div>
                </div>
            </div>

            <div className="flex gap-4 pt-4 border-t border-white/10">
                <button type="submit" className="flex-1 justify-center rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-3 text-base font-semibold shadow-lg hover:shadow-indigo-500/20 transition-all">
                    {mode === 'edit' ? 'Save Changes' : 'Publish Event'}
                </button>
                <Link href="/events" className="flex-1 flex justify-center items-center rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-gray-200 px-4 py-3 text-base font-semibold transition-all">
                    Cancel
                </Link>
            </div>
        </form>
    )
}
