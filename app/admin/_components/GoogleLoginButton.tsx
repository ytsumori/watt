"use client";

import { FC } from "react";
import { createClientSupabase } from "@/lib/supabase/client";
import { Button } from "@chakra-ui/react";
import { useRouter } from "next-nprogress-bar";

export const GoogleLoginButton: FC = () => {
  const router = useRouter();
  const clientSupabase = createClientSupabase();
  const signInWithGoogle = async () => {
    const { data } = await clientSupabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/api/auth/callback` }
    });
    if (data.url) router.push(data.url);
  };
  return (
    <Button fontWeight="bold" onClick={signInWithGoogle}>
      Google Login
    </Button>
  );
};
