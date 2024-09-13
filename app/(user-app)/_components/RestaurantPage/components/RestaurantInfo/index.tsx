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
  Flex,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel
} from "@chakra-ui/react";
import { Prisma } from "@prisma/client";
import NextLink from "next/link";
import { Fragment } from "react";
import { FaMapMarkedAlt } from "react-icons/fa";
import { MenuImages } from "../MenuImages";
import { groupedByDayOfWeeks } from "./util";
import { BusinessHourLabel } from "@/app/(user-app)/(home)/_components/HomePage/components/RestaurantListItem/_components/BusinessHourLabel";
import { useGetDuration } from "./hooks";
import { FaWalking } from "react-icons/fa";

type Props = {
  restaurant: Prisma.RestaurantGetPayload<{
    include: {
      googleMapPlaceInfo: { select: { url: true; latitude: true; longitude: true } };
      exteriorImage: true;
      menuImages: true;
      paymentOptions: true;
      openingHours: {
        select: {
          openDayOfWeek: true;
          openHour: true;
          openMinute: true;
          closeDayOfWeek: true;
          closeHour: true;
          closeMinute: true;
        };
      };
    };
  }>;
};

export function RestaurantInfo({ restaurant }: Props) {
  const { isOpen: isInteriorImageOpen, onOpen: onInteriorImageOpen, onClose: onInteriorImageClose } = useDisclosure();
  const { isOpen: isExteriorImageOpen, onOpen: onExteriorImageOpen, onClose: onExteriorImageClose } = useDisclosure();
  const duration = useGetDuration({
    latitude: restaurant.googleMapPlaceInfo ? restaurant.googleMapPlaceInfo.latitude : undefined,
    longitude: restaurant.googleMapPlaceInfo ? restaurant.googleMapPlaceInfo.longitude : undefined
  });
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
              width="300px"
            >
              Googleマップでお店情報を見る
            </Button>
          )}
          <Box fontSize="sm" fontWeight="bold" w="full">
            <SimpleGrid columns={2} spacingY={2} spacingX={4} templateColumns="minmax(auto, 100px) 1fr">
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
              {duration && (
                <>
                  <Text>現地からの距離</Text>
                  <Flex alignItems="center">
                    <FaWalking />
                    <Text ms={1} fontWeight="normal">
                      {duration}
                    </Text>
                  </Flex>
                </>
              )}
              <Text>営業時間</Text>
              <Box>
                <Accordion allowToggle border="none">
                  <AccordionItem border="none">
                    <AccordionButton padding={0} fontSize="sm">
                      <BusinessHourLabel openingHours={restaurant.openingHours} />
                      <AccordionIcon ml={2} />
                    </AccordionButton>
                    <Box mt={2}>
                      {groupedByDayOfWeeks(restaurant.openingHours).map((text, idx) => {
                        return (
                          <AccordionPanel key={idx} p={0} my={1}>
                            <Text fontWeight="normal">{text}</Text>
                          </AccordionPanel>
                        );
                      })}
                    </Box>
                  </AccordionItem>
                </Accordion>
              </Box>
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
                <ModalContent m={3}>
                  <Image
                    src={getRestaurantInteriorImageUrl(restaurant.interiorImagePath)}
                    alt={`interior-image-${restaurant.id}`}
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
                src={getSupabaseImageUrl("restaurant-exteriors", restaurant.exteriorImage.imagePath, {
                  width: 500,
                  height: 500
                })}
                alt={`exterior-image-${restaurant.id}`}
                borderRadius={8}
                objectFit="cover"
                aspectRatio={1 / 1}
                w="full"
                onClick={onExteriorImageOpen}
              />
              <Modal isOpen={isExteriorImageOpen} onClose={onExteriorImageClose} isCentered>
                <ModalOverlay />
                <ModalContent m={3}>
                  <Image
                    src={getSupabaseImageUrl("restaurant-exteriors", restaurant.exteriorImage.imagePath)}
                    alt={`exterior-image-${restaurant.id}`}
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
