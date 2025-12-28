import { createClient } from "@/utils/supabase/server";

export type UserRole = 'admin' | 'helper' | 'user';

export async function getUserRole(): Promise<UserRole> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        console.log('getUserRole: No user found');
        return 'user';
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    console.log(`getUserRole for ${user.email}: ${profile?.role}`);
    return (profile?.role as UserRole) || 'user';
}

export async function isAdmin() {
    const role = await getUserRole();
    return role === 'admin';
}

export async function isHelper() {
    const role = await getUserRole();
    console.log(`isHelper check: role is ${role}, returning ${role === 'admin' || role === 'helper'}`);
    return role === 'admin' || role === 'helper';
}
