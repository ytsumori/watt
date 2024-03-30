"use client";

import { Image, ImageProps } from "@chakra-ui/react";
import { type SupabaseClient } from "@supabase/supabase-js";

type Props = {
  src: ImageProps["src"];
  alt: ImageProps["alt"];
  supabase: SupabaseClient<any, "public", any>;
};

export function MealPreviewImage({ src, alt, supabase }: Props) {
  const imgPath = src ? src.split("/meals/")[1] : src;

  const resizedImgSrc = imgPath
    ? supabase.storage.from("meals").getPublicUrl(imgPath, { transform: { width: 500, height: 600 } })
    : undefined;

  return (
    <Image
      src={resizedImgSrc ? resizedImgSrc.data.publicUrl : src}
      alt={alt}
      objectFit="cover"
      aspectRatio={1 / 1}
      borderRadius={8}
    />
  );
}
