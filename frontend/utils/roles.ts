import { createClient } from "@/utils/supabase/server";

export type UserRole = 'admin' | 'helper' | 'user';

export async function getUserRole(): Promise<UserRole> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return 'user';

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    return (profile?.role as UserRole) || 'user';
}

export async function isAdmin() {
    const role = await getUserRole();
    return role === 'admin';
}

export async function isHelper() {
    const role = await getUserRole();
    return role === 'admin' || role === 'helper';
}
