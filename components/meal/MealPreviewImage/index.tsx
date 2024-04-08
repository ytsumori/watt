"use client";

import { createClientSupabase } from "@/lib/supabase/client";
import { Image, ImageProps } from "@chakra-ui/react";

type Props = {
  src: ImageProps["src"];
  alt: ImageProps["alt"];
};

export function MealPreviewImage({ src, alt }: Props) {
  const supabase = createClientSupabase();

  if (src === undefined) return <Image src={src} alt={alt} objectFit="cover" aspectRatio={1 / 1} borderRadius={8} />;

  const isUrl = src.startsWith("https://") || src.startsWith("http://");

  const imgPath = isUrl
    ? supabase.storage.from("meals").getPublicUrl(src.split("/meals/")[1], { transform: { width: 500, height: 500 } })
    : supabase.storage.from("meals").getPublicUrl(src, { transform: { width: 500, height: 500 } });

  return <Image src={imgPath.data.publicUrl} alt={alt} objectFit="cover" aspectRatio={1 / 1} borderRadius={8} />;
}
