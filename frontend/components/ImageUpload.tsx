'use client';

import { useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import { uploadImage } from '@/actions/upload'; // We'll create this server action

interface ImageUploadProps {
    onUpload: (url: string) => void;
    label?: string;
    folder?: string;
    className?: string;
    multiple?: boolean;
}

export default function ImageUpload({ onUpload, label = "Upload Image", folder = "events", className = "", multiple = false }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        setUploading(true);

        // Process files in parallel
        await Promise.all(files.map(async (file) => {
            try {
                // Compress Image
                const options = {
                    maxSizeMB: 1,
                    maxWidthOrHeight: 1920,
                    useWebWorker: true,
                };
                const compressedFile = await imageCompression(file, options);

                // Upload via Server Action
                const formData = new FormData();
                formData.append('file', compressedFile);
                formData.append('folder', folder);

                const result = await uploadImage(formData);

                if (result.success && result.url) {
                    // For single mode, set local preview
                    if (!multiple) {
                        setPreview(result.url);
                    }
                    onUpload(result.url);
                } else {
                    console.error('Upload failed for file:', file.name, result.error);
                    alert(`Upload failed for ${file.name}: ${result.error}`);
                }
            } catch (error) {
                console.error(error);
                alert(`Something went wrong uploading ${file.name}`);
            }
        }));

        setUploading(false);
        // Reset input
        e.target.value = '';
    };

    return (
        <div className={`space-y-2 ${className}`}>
            <label className="block text-sm font-medium text-gray-300">
                {label}
            </label>

            {preview && !multiple ? (
                <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-white/10 group">
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            setPreview(null);
                            onUpload("");
                        }}
                        className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors opacity-0 group-hover:opacity-100"
                    >
                        <X className="w-4 h-4" />
                    </button>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
                </div>
            ) : (
                <label className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:bg-white/5 hover:border-white/40 transition-all group">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {uploading ? (
                            <Loader2 className="w-8 h-8 text-gray-400 animate-spin mb-3" />
                        ) : (
                            <Upload className="w-8 h-8 text-gray-400 mb-3 group-hover:text-white transition-colors" />
                        )}
                        <p className="mb-2 text-sm text-gray-400 group-hover:text-gray-300">
                            <span className="font-semibold">Click to upload</span> {multiple ? '(Select Multiple)' : ''}
                        </p>
                        <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF</p>
                    </div>
                    <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        multiple={multiple}
                        onChange={handleFileChange}
                        disabled={uploading}
                    />
                </label>
            )}
        </div>
    );
}
