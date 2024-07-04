"use client";

import { getMealImageUrl } from "@/utils/image/getMealImageUrl";
import { Image, ImageProps } from "@chakra-ui/react";

type Props = {
  src: string;
  alt: ImageProps["alt"];
};

export function MealPreviewImage({ src, alt }: Props) {
  const publicUrl = getMealImageUrl(src);

  return <Image src={publicUrl} alt={alt} objectFit="cover" aspectRatio={1 / 1} borderRadius={8} loading="lazy" />;
}
