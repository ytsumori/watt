"use client";

import { transformSupabaseImage } from "@/utils/image/transformSupabaseImage";
import { Image, ImageProps } from "@chakra-ui/react";

type Props = {
  src: ImageProps["src"];
  alt: ImageProps["alt"];
};

export function MealPreviewImage({ src, alt }: Props) {
  if (src === undefined) return <Image src={src} alt={alt} objectFit="cover" aspectRatio={1 / 1} borderRadius={8} />;

  const publicUrl = transformSupabaseImage("meals", src);

  return <Image src={publicUrl} alt={alt} objectFit="cover" aspectRatio={1 / 1} borderRadius={8} />;
}
