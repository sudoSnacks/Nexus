"use server";

import { createClient } from "@/utils/supabase/server";
import { isAdmin } from "@/utils/roles";
import { revalidatePath } from "next/cache";

export async function updateUserRole(userId: string, newRole: 'user' | 'helper') {
    try {
        if (!await isAdmin()) {
            throw new Error("Unauthorized");
        }

        const supabase = await createClient();

        // Prevent modifying other admins (for safety)
        const { data: targetProfile } = await supabase.from('profiles').select('role').eq('id', userId).single();
        if (targetProfile?.role === 'admin') {
            return { success: false, error: "Cannot modify an admin's role." };
        }

        const { error } = await supabase
            .from('profiles')
            .update({ role: newRole })
            .eq('id', userId);

        if (error) throw error;

        revalidatePath('/admin/helpers');
        return { success: true };
    } catch (error) {
        console.error("Failed to update role:", error);
        return { success: false, error: "Failed to update role" };
    }
}
