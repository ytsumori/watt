"use client";

import { Image, ImageProps } from "@chakra-ui/react";
import { SupabaseClient } from "@supabase/supabase-js";

type Props = {
  src: ImageProps["src"];
  alt: ImageProps["alt"];
  supabase: SupabaseClient<any, "public", any>;
};

export function MealPreviewImage({ src, alt, supabase }: Props) {
  if (src === undefined) return <Image src={src} alt={alt} objectFit="cover" aspectRatio={1 / 1} borderRadius={8} />;

  const isUrl = src.startsWith("https://") || src.startsWith("http://");

  const imgPath = isUrl
    ? supabase.storage.from("meals").getPublicUrl(src.split("/meals/")[1], { transform: { width: 500, height: 500 } })
    : supabase.storage.from("meals").getPublicUrl(src, { transform: { width: 500, height: 500 } });

  return <Image src={imgPath.data.publicUrl} alt={alt} objectFit="cover" aspectRatio={1 / 1} borderRadius={8} />;
}
