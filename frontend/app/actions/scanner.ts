'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function searchAttendee(query: string) {
    const supabase = await createClient();

    // 1. Try to find by ID (if query looks like UUID)
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(query);

    if (isUUID) {
        const { data: attendee } = await supabase
            .from('attendees')
            .select('id')
            .eq('id', query)
            .single();

        if (attendee) {
            return attendee.id;
        }
    }

    // 2. Try to find by email
    const { data: attendeeByEmail } = await supabase
        .from('attendees')
        .select('id')
        .eq('email', query)
        .single();

    if (attendeeByEmail) {
        return attendeeByEmail.id;
    }

    return null;
}

export async function getAttendee(id: string) {
    const supabase = await createClient();
    const { data: attendee } = await supabase
        .from('attendees')
        .select(`
            *,
            events (
                name,
                date
            )
        `)
        .eq('id', id)
        .single();

    return attendee;
}

export async function checkInAttendee(id: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from('attendees')
        .update({ checked_in: true })
        .eq('id', id);

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath('/admin/check-in/[id]', 'page');
    revalidatePath('/events/[id]/attendees', 'page');
    return { success: true };
}
