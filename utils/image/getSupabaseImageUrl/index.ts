import { createClientSupabase } from "@/lib/supabase/client";

export const getSupabaseImageUrl = (bucketName: string, src: string): string => {
  const isUrl = src.startsWith("https://") || src.startsWith("http://");
  if (isUrl) return src;

  const supabase = createClientSupabase();
  const { data } = supabase.storage.from(bucketName).getPublicUrl(src, { transform: { width: 500, height: 500 } });

  return data.publicUrl;
};
