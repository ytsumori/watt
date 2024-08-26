"use client";

import { orderPaymentOptions } from "@/lib/prisma/order-enum";
import { translatePaymentOption, translateSmokingOption } from "@/lib/prisma/translate-enum";
import { getRestaurantInteriorImageUrl } from "@/utils/image/getRestaurantInteriorImageUrl";
import { getSupabaseImageUrl } from "@/utils/image/getSupabaseImageUrl";
import {
  Heading,
  VStack,
  Text,
  Button,
  Icon,
  Image,
  SimpleGrid,
  Box,
  useDisclosure,
  Modal,
  ModalContent,
  ModalOverlay,
  Flex
} from "@chakra-ui/react";
import { Prisma } from "@prisma/client";
import NextLink from "next/link";
import { Fragment } from "react";
import { FaMapMarkedAlt } from "react-icons/fa";
import { MenuImages } from "../MenuImages";

type Props = {
  restaurant: Prisma.RestaurantGetPayload<{
    include: {
      googleMapPlaceInfo: { select: { url: true } };
      exteriorImage: true;
      menuImages: true;
      paymentOptions: true;
    };
  }>;
};

export function RestaurantInfo({ restaurant }: Props) {
  const { isOpen: isInteriorImageOpen, onOpen: onInteriorImageOpen, onClose: onInteriorImageClose } = useDisclosure();
  const { isOpen: isExteriorImageOpen, onOpen: onExteriorImageOpen, onClose: onExteriorImageClose } = useDisclosure();

  return (
    <>
      <VStack w="full" alignItems="start" spacing={2} maxW="100%" mt={4}>
        <Flex mx={4} flexDir="column" gap={2}>
          <Heading size="lg">{restaurant.name}</Heading>
          {restaurant.googleMapPlaceInfo && (
            <Button
              leftIcon={<Icon as={FaMapMarkedAlt} />}
              as={NextLink}
              href={restaurant.googleMapPlaceInfo.url}
              target="_blank"
            >
              Googleマップでお店情報を見る
            </Button>
          )}
          <Box fontSize="sm" fontWeight="bold" w="full">
            <SimpleGrid columns={2} spacingY={2} spacingX={4}>
              {restaurant.smokingOption && (
                <>
                  <Text>喫煙・禁煙</Text>
                  <Text fontWeight="normal">{translateSmokingOption(restaurant.smokingOption)}</Text>
                </>
              )}
              {restaurant.paymentOptions.length > 0 && (
                <>
                  <Text>支払い方法</Text>
                  <Text fontWeight="normal">
                    {orderPaymentOptions(restaurant.paymentOptions.map((paymentOption) => paymentOption.option)).map(
                      (option) => (
                        <Fragment key={option}>
                          {translatePaymentOption(option)}
                          <br />
                        </Fragment>
                      )
                    )}
                  </Text>
                </>
              )}
            </SimpleGrid>
          </Box>
        </Flex>
        <Flex
          mt={2}
          maxW="full"
          className="hidden-scrollbar"
          overflowX="scroll"
          gap={2}
          px={4}
          fontSize="sm"
          fontWeight="bold"
        >
          {restaurant.interiorImagePath && (
            <Box position="relative">
              <Text>内観</Text>
              <Image
                maxW="100px"
                minW="100px"
                src={getRestaurantInteriorImageUrl(restaurant.interiorImagePath)}
                alt={`interior-image-${restaurant.id}`}
                borderRadius={8}
                objectFit="cover"
                aspectRatio={1 / 1}
                w="full"
                onClick={onInteriorImageOpen}
              />
              <Modal isOpen={isInteriorImageOpen} onClose={onInteriorImageClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                  <Image
                    src={getRestaurantInteriorImageUrl(restaurant.interiorImagePath, {
                      width: 1000,
                      height: 1000
                    })}
                    alt={`interior-image-${restaurant.id}`}
                    objectFit="cover"
                    aspectRatio={1 / 1}
                    w="full"
                  />
                </ModalContent>
              </Modal>
            </Box>
          )}
          {restaurant.exteriorImage && (
            <Box>
              <Text>外観</Text>
              <Image
                maxW="100px"
                minW="100px"
                src={getSupabaseImageUrl("restaurant-exteriors", restaurant.exteriorImage.imagePath)}
                alt={`exterior-image-${restaurant.id}`}
                borderRadius={8}
                objectFit="cover"
                aspectRatio={1 / 1}
                w="full"
                onClick={onExteriorImageOpen}
              />
              <Modal isOpen={isExteriorImageOpen} onClose={onExteriorImageClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                  <Image
                    src={getSupabaseImageUrl("restaurant-exteriors", restaurant.exteriorImage.imagePath, {
                      width: 1000,
                      height: 1000
                    })}
                    alt={`interior-image-${restaurant.id}`}
                    objectFit="cover"
                    aspectRatio={1 / 1}
                    w="full"
                  />
                </ModalContent>
              </Modal>
            </Box>
          )}
          {restaurant.menuImages.length > 0 && (
            <Box>
              <Text>メニュー</Text>
              <MenuImages menuImages={restaurant.menuImages} />
            </Box>
          )}
        </Flex>
      </VStack>
    </>
  );
}
