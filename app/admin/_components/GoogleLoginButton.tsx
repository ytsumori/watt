"use client";

import { FC } from "react";
import { useRouter } from "next/navigation";
import { createClientSupabase } from "@/lib/supabase/client";

export const GoogleLoginButton: FC = () => {
  const router = useRouter();
  const clientSupabase = createClientSupabase();
  const signInWithGoogle = async () => {
    const { data } = await clientSupabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${process.env.NEXT_PUBLIC_HOST_URL}/api/auth/callback` },
    });
    if (data.url) router.push(data.url);
  };
  return (
    <button type="button" onClick={signInWithGoogle}>
      Google Login
    </button>
  );
};
