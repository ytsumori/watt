"use client";

import { getRestaurantInteriorImageUrl } from "@/utils/image/getRestaurantInteriorImageUrl";
import { Image, Text, VStack } from "@chakra-ui/react";

type Props = {
  restaurantId: string;
  interiorImagePath: string;
};

export function InteriorImage({ restaurantId, interiorImagePath }: Props) {
  return (
    <VStack alignItems="start" spacing={0}>
      <Text fontSize="xs">内観</Text>
      <Image
        minW="130px"
        maxW="130px"
        src={getRestaurantInteriorImageUrl(interiorImagePath)}
        objectFit="cover"
        aspectRatio={1 / 1}
        borderRadius={8}
        loading="lazy"
        alt={`interior-image-${restaurantId}`}
      />
    </VStack>
  );
}
