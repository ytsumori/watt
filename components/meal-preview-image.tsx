"use client";

import { Image, ImageProps } from "@chakra-ui/react";

type Props = {
  src: ImageProps["src"];
  alt: ImageProps["alt"];
};

export function MealPreviewImage({ src, alt }: Props) {
  return (
    <Image
      src={src}
      alt={alt}
      objectFit="cover"
      aspectRatio={1 / 1}
      borderRadius={8}
    />
  );
}
