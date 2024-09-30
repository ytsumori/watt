"use client";

import { getRestaurantInteriorImageUrl } from "@/utils/image/getRestaurantInteriorImageUrl";
import { getSupabaseImageUrl } from "@/utils/image/getSupabaseImageUrl";
import { Image, Text, Box, Flex } from "@chakra-ui/react";
import { Restaurant, RestaurantExteriorImage, RestaurantMenuImage } from "@prisma/client";
import { useState, useMemo } from "react";
import { RestaurantInfoImagesModal } from "../../RestaurantInfoImagesModal";

type Props = {
  restaurantId: Restaurant["id"];
  interiorImagePath: Restaurant["interiorImagePath"];
  exteriorImagePath?: RestaurantExteriorImage["imagePath"];
  menuImages: RestaurantMenuImage[];
};

export const RestaurantInfoImages = ({ restaurantId, interiorImagePath, exteriorImagePath, menuImages }: Props) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>();

  const restaurantImageInfos = useMemo(() => {
    return [
      interiorImagePath ? { type: "restaurant-interiors", path: interiorImagePath } : [],
      exteriorImagePath ? { type: "restaurant-exteriors", path: exteriorImagePath } : [],
      ...menuImages.map((menuImage) => ({ type: "menus", path: menuImage.imagePath }))
    ].flat();
  }, [interiorImagePath, exteriorImagePath, menuImages]);

  const onClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  return (
    <>
      <Flex w="full" className="hidden-scrollbar" overflowX="scroll" gap={2} px={4}>
        {interiorImagePath && (
          <Box position="relative">
            <Text fontSize="sm" fontWeight="bold">
              内観
            </Text>
            <Image
              maxW="100px"
              minW="100px"
              src={getRestaurantInteriorImageUrl(interiorImagePath, {
                width: 500,
                height: 500
              })}
              alt={`interior-image-${restaurantId}`}
              borderRadius={8}
              objectFit="cover"
              aspectRatio={1 / 1}
              w="full"
              onClick={() => onClick(0)}
            />
          </Box>
        )}
        {exteriorImagePath && (
          <Box>
            <Text fontSize="sm" fontWeight="bold">
              外観
            </Text>
            <Image
              maxW="100px"
              minW="100px"
              src={getSupabaseImageUrl("restaurant-exteriors", exteriorImagePath, {
                width: 500,
                height: 500
              })}
              alt={`exterior-image-${restaurantId}`}
              borderRadius={8}
              objectFit="cover"
              aspectRatio={1 / 1}
              w="full"
              onClick={() => onClick(1)}
            />
          </Box>
        )}
        {menuImages.length > 0 && (
          <Box>
            <Text fontSize="sm" fontWeight="bold">
              店内メニュー
            </Text>
            <Flex gap={2}>
              {menuImages.map((menuImage, idx) => (
                <Image
                  key={menuImage.id}
                  maxW="100px"
                  minW="100px"
                  src={getSupabaseImageUrl("menus", menuImage.imagePath, { width: 500, height: 500 })}
                  alt={`menu-image-${menuImage.id}`}
                  borderRadius={8}
                  objectFit="cover"
                  aspectRatio={1 / 1}
                  w="full"
                  onClick={() => onClick(idx + 2)}
                />
              ))}
            </Flex>
          </Box>
        )}
      </Flex>
      {selectedImageIndex !== undefined && (
        <RestaurantInfoImagesModal
          startIndex={selectedImageIndex}
          onClose={() => setSelectedImageIndex(undefined)}
          restaurantImageInfos={restaurantImageInfos}
          restaurantId={restaurantId}
        />
      )}
    </>
  );
};
