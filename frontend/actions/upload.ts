'use server';

import { createClient } from '@/utils/supabase/server';

export async function uploadImage(formData: FormData) {
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'misc';

    if (!file) {
        throw new Error('No file provided');
    }

    try {
        const supabase = await createClient();

        // Sanitize filename and add timestamp to prevent collisions
        const fileExt = file.name.split('.').pop();
        const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const { error } = await supabase
            .storage
            .from('documents') // Using 'documents' bucket as a generic container, or 'events' if preferred. Let's stick to a standard bucket name.
            .upload(fileName, buffer, {
                contentType: file.type,
                upsert: false
            });

        if (error) {
            console.error('Supabase Storage Upload Error:', error);
            throw error;
        }

        const { data: { publicUrl } } = supabase
            .storage
            .from('documents')
            .getPublicUrl(fileName);

        return { success: true, url: publicUrl };
    } catch (error: any) {
        console.error('Upload Error:', error);
        return { success: false, error: error.message || 'Upload failed' };
    }
}
