"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function loginWithGoogle() {
    const supabase = await createClient();
    const headersList = await headers();
    const origin = headersList.get("origin");
    const host = headersList.get("host");

    // Default to localhost:3000 if no origin (server-side call) or if specifically requested for mobile testing
    // This prioritizes localhost:3000 to solve the mobile redirect issue where ADB port forwarding relies on localhost
    let redirectUrl = "http://localhost:3000/auth/callback";

    if (origin) {
        redirectUrl = `${origin}/auth/callback`;
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: redirectUrl,
        },
    });

    if (data.url) {
        redirect(data.url);
    }

    if (error) {
        console.error("Auth error:", error);
        redirect("/login?error=auth_failed");
    }
}


export async function login(formData: FormData) {
    const supabase = await createClient();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        console.error("Login error:", error);
        redirect("/login?error=Invalid credentials");
    }

    redirect("/");
}

export async function signup(formData: FormData) {
    const supabase = await createClient();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const origin = (await headers()).get("origin") || "http://localhost:3000";

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${origin}/auth/callback`,
        },
    });

    if (error) {
        console.error("Signup error:", error);
        redirect("/signup?error=Could not create account");
    }

    redirect("/login?message=Check email to continue sign in process");
}


export async function signout() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/");
}

export async function resetPassword(formData: FormData) {
    const supabase = await createClient();
    const email = formData.get("email") as string;
    const origin = (await headers()).get("origin");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/auth/callback?next=/update-password`,
    });

    if (error) {
        console.error("Reset password error:", error);
        redirect("/forgot-password?error=Could not send reset link");
    }


    redirect("/forgot-password?message=Check your email to continue sign in process");
}

export async function updatePassword(formData: FormData) {
    const supabase = await createClient();
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.updateUser({
        password,
    });

    if (error) {
        console.error("Update password error:", error);
        redirect("/update-password?error=Could not update password");
    }

    redirect("/login?message=Password updated successfully");
}
