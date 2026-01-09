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
