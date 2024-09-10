"use client";

import {
  Heading,
  VStack,
  Text,
  Image,
  SimpleGrid,
  Button,
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
  AccordionPanel,
  Alert,
  AlertIcon,
  IconButton,
  CloseButton
} from "@chakra-ui/react";
import { Prisma } from "@prisma/client";
import { usePathname } from "next/navigation";
import { MealPreviewBox } from "@/components/meal/MealPreviewBox";
import { LineLoginButton } from "@/components/Auth/LineLoginButton";
import { useRouter } from "next-nprogress-bar";
import { FaWalking, FaMapMarkerAlt } from "react-icons/fa";
import { BusinessHourLabel } from "../../(home)/_components/HomePage/components/RestaurantListItem/_components/BusinessHourLabel";
import NextLink from "next/link";
import { translatePaymentOption, translateSmokingOption } from "@/lib/prisma/translate-enum";
import { orderPaymentOptions } from "@/lib/prisma/order-enum";
import { getRestaurantInteriorImageUrl } from "@/utils/image/getRestaurantInteriorImageUrl";
import { getSupabaseImageUrl } from "@/utils/image/getSupabaseImageUrl";
import { MenuImages } from "./components/MenuImages";
import { useGetDuration } from "./hooks";
import { groupedByDayOfWeeks } from "./util";

type Props = {
  restaurant: Prisma.RestaurantGetPayload<{
    include: {
      meals: { include: { items: { include: { options: { orderBy: { position: "asc" } } } } } };
      googleMapPlaceInfo: { select: { url: true; latitude: true; longitude: true } };
      paymentOptions: true;
      exteriorImage: true;
      menuImages: true;
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
  userId?: string;
  onClose?: () => void;
};

export function RestaurantPage({ restaurant, userId, onClose }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { isOpen: isInteriorImageOpen, onOpen: onInteriorImageOpen, onClose: onInteriorImageClose } = useDisclosure();
  const { isOpen: isExteriorImageOpen, onOpen: onExteriorImageOpen, onClose: onExteriorImageClose } = useDisclosure();
  const duration = useGetDuration({
    latitude: restaurant.googleMapPlaceInfo ? restaurant.googleMapPlaceInfo.latitude : undefined,
    longitude: restaurant.googleMapPlaceInfo ? restaurant.googleMapPlaceInfo.longitude : undefined
  });

  return (
    <Box maxH="full" minH="full" position="relative">
      <Flex
        w="full"
        alignItems="center"
        justifyContent="space-between"
        position="sticky"
        top={0}
        bgColor="white"
        pt={4}
        px={4}
        zIndex={1}
        borderTopRadius="md"
      >
        <Heading size="md">{restaurant.name}</Heading>
        {onClose && <CloseButton onClick={onClose} />}
      </Flex>
      <VStack w="full" alignItems="start" spacing={4} mb={4}>
        <Box fontSize="sm" px={4}>
          <BusinessHourLabel openingHours={restaurant.openingHours} />
          <Flex gap={2}>
            {restaurant.googleMapPlaceInfo && (
              <Button
                leftIcon={<FaMapMarkerAlt />}
                variant="outline"
                as={NextLink}
                href={restaurant.googleMapPlaceInfo.url}
                target="_blank"
                size="xs"
              >
                Google Map
              </Button>
            )}
            {duration && (
              <Flex alignItems="center">
                <FaWalking />
                <Text ml={1} fontWeight="normal">
                  {duration}
                </Text>
              </Flex>
            )}
          </Flex>
        </Box>
        <SimpleGrid
          columns={2}
          spacingY={2}
          spacingX={4}
          templateColumns="minmax(auto, 100px) 1fr"
          fontSize="sm"
          fontWeight="bold"
          px={4}
        >
          {restaurant.smokingOption && (
            <>
              <Text>喫煙・禁煙</Text>
              <Text fontWeight="normal">{translateSmokingOption(restaurant.smokingOption)}</Text>
            </>
          )}
          {restaurant.paymentOptions.length > 0 && (
            <>
              <Text>支払い方法</Text>
              <Text fontWeight="normal" whiteSpace="pre-wrap">
                {orderPaymentOptions(restaurant.paymentOptions.map((paymentOption) => paymentOption.option)).map(
                  (option) => `${translatePaymentOption(option)}\n`
                )}
              </Text>
            </>
          )}
          <Text>営業時間</Text>
          <Box>
            <Accordion allowToggle border="none">
              <AccordionItem border="none">
                <AccordionButton padding={0} fontSize="sm" textAlign="start">
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
        <Flex maxW="full" className="hidden-scrollbar" overflowX="scroll" gap={2} pl={4}>
          {restaurant.interiorImagePath && (
            <Box position="relative">
              <Text fontSize="sm" fontWeight="bold">
                内観
              </Text>
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
              <Text fontSize="sm" fontWeight="bold">
                外観
              </Text>
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
              <Text fontSize="sm" fontWeight="bold">
                店内メニュー
              </Text>
              <MenuImages menuImages={restaurant.menuImages} />
            </Box>
          )}
        </Flex>
        <Box w="full">
          <Text fontSize="sm" fontWeight="bold" ml={4}>
            Watt限定メニュー
          </Text>
          <Flex gap={3} className="hidden-scrollbar" overflowX="scroll" pl={4}>
            {restaurant.meals.map((meal) => (
              <MealPreviewBox key={meal.id} meal={meal} href={`/restaurants/${meal.restaurantId}/meals/${meal.id}`} />
            ))}
          </Flex>
        </Box>
      </VStack>
      <Box
        p={4}
        w="full"
        bgColor="white"
        position="sticky"
        bottom={0}
        boxShadow="0 -4px 15px 0px rgba(0, 0, 0, 0.2)"
        zIndex={1}
      >
        {userId ? (
          (() => {
            if (restaurant.isAvailable) {
              return (
                <Button onClick={() => router.push(`/restaurants/${restaurant.id}/orders/new`)} w="full" size="md">
                  お店の空き状況を確認する
                </Button>
              );
            } else {
              return (
                <Alert status="warning" borderRadius={4}>
                  <AlertIcon />
                  現在こちらのお店は入店できません
                </Alert>
              );
            }
          })()
        ) : (
          <>
            <Alert status="error">
              <AlertIcon />
              表示価格での注文にはログインが必要です
            </Alert>
            <LineLoginButton callbackPath={pathname} />
          </>
        )}
      </Box>
    </Box>
  );
}
