import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const createMiddlewareSupabase = () => {
  const cookieStore = cookies();

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      }
    }
  });
};
