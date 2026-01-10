import { LoginForm } from "@/components/ui/login-form";
import { Suspense } from "react";

export default function SignupPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoginForm mode="signup" heading="Join Nexus" />
        </Suspense>
    );
}
