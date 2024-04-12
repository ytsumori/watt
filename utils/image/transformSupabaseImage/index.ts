import { createClientSupabase } from "@/lib/supabase/client";

export const transformSupabaseImage = (
  bucketName: string,
  src?: string,
  size?: { width: number; height: number }
): string | undefined => {
  if (src === undefined) return undefined;

  const supabase = createClientSupabase();
  const isUrl = src.startsWith("https://") || src.startsWith("http://");
  const { data } = isUrl
    ? supabase.storage
        .from(bucketName)
        .getPublicUrl(src.split(`/${bucketName}/`)[1], { transform: size ?? { width: 500, height: 500 } })
    : supabase.storage.from("meals").getPublicUrl(src, { transform: size ?? { width: 500, height: 500 } });

  return data.publicUrl;
};
