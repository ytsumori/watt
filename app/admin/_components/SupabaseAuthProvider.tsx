import { FC, ReactNode } from "react";
import { GoogleLoginButton } from "./GoogleLoginButton";
import { createServerSupabase } from "@/lib/supabase/server";

type Props = { children: ReactNode };

export const SupabaseAuthProvider: FC<Props> = async ({ children }) => {
  const supabase = createServerSupabase();
  const { data, error } = await supabase.auth.getUser();
  const isAuthedUser = !(error || !data?.user);

  return isAuthedUser ? <>{children}</> : <GoogleLoginButton />;
};
