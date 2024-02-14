"use client";

import { Image } from "@chakra-ui/react";

type Props = {
  src: string;
  alt: string;
};

export function MealPreviewImage({ src, alt }: Props) {
  return (
    <Image
      width={200}
      src={src}
      alt={alt}
      objectFit="cover"
      aspectRatio={1 / 1}
      borderRadius={8}
    />
  );
}
