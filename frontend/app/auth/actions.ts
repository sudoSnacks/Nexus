"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function loginWithGoogle() {
    const supabase = await createClient();
    const origin = (await headers()).get("origin") || "http://localhost:3000";

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: `${origin}/auth/callback`,
        },
    });

    if (data.url) {
        redirect(data.url);
    }

    if (error) {
        console.error("Auth error:", error);
        // You might want to redirect to an error page here
        redirect("/login?error=auth_failed");
    }
}

export async function signout() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/");
}
