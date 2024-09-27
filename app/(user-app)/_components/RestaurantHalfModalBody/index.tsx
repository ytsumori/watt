"use client";

import {
  Heading,
  VStack,
  Text,
  SimpleGrid,
  Button,
  Box,
  Flex,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  CloseButton
} from "@chakra-ui/react";
import { Prisma } from "@prisma/client";
import { ComponentProps, ReactNode, useState } from "react";
import { useGetDuration } from "./hooks";
import { MealDetailModal } from "./components/MealDetailModal";
import { BusinessHourLabel } from "../../(home)/_components/HomePage/components/RestaurantListItem/_components/BusinessHourLabel";
import { FaMapMarkerAlt, FaWalking } from "react-icons/fa";
import NextLink from "next/link";
import { groupedByDayOfWeeks } from "./util";
import { orderPaymentOptions } from "@/lib/prisma/order-enum";
import { translatePaymentOption, translateSmokingOption } from "@/lib/prisma/translate-enum";
import { MealPreview } from "@/components/meal/MealPreview";
import { RestaurantInfoImages } from "./components/RestaurantInfoImages";

type Props = {
  restaurant: Prisma.RestaurantGetPayload<{
    select: {
      id: true;
      name: true;
      meals: {
        select: {
          id: true;
          title: true;
          description: true;
          price: true;
          listPrice: true;
          imagePath: true;
          items: true;
        };
      };
      googleMapPlaceInfo: { select: { url: true; latitude: true; longitude: true } };
      paymentOptions: true;
      exteriorImage: true;
      menuImages: true;
      openingHours: {
        select: {
          id: true;
          openDayOfWeek: true;
          openHour: true;
          openMinute: true;
          closeDayOfWeek: true;
          closeHour: true;
          closeMinute: true;
        };
      };
      smokingOption: true;
      interiorImagePath: true;
      remark: true;
      tableSeatCount: true;
      counterSeatCount: true;
    };
  }>;
  userId?: string;
  onClose?: () => void;
  footer?: ReactNode;
};

export function RestaurantHalfModalBody({ restaurant, onClose, footer }: Props) {
  const duration = useGetDuration({
    latitude: restaurant.googleMapPlaceInfo ? restaurant.googleMapPlaceInfo.latitude : undefined,
    longitude: restaurant.googleMapPlaceInfo ? restaurant.googleMapPlaceInfo.longitude : undefined
  });
  const [selectedMeal, setSelectedMeal] = useState<ComponentProps<typeof MealDetailModal>["meal"]>();

  return (
    <>
      <Flex maxH="full" minH="full" position="relative" flexDir="column" justifyContent="space-between">
        <Box>
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
            <VStack width="full" spacing={2} alignItems="start">
              <SimpleGrid
                columns={2}
                spacingY={2}
                spacingX={2}
                templateColumns="minmax(auto, 100px) 1fr"
                fontSize="sm"
                fontWeight="bold"
                px={4}
              >
                {((restaurant.tableSeatCount ?? 0) > 0 || (restaurant.counterSeatCount ?? 0) > 0) && (
                  <>
                    <Text>席数</Text>
                    <Text fontWeight="normal">
                      {(restaurant.counterSeatCount ?? 0) > 0 && `カウンター${restaurant.counterSeatCount}席`}
                      {(restaurant.tableSeatCount ?? 0) > 0 && (restaurant.counterSeatCount ?? 0) > 0 && " ・ "}
                      {(restaurant.tableSeatCount ?? 0) > 0 && `テーブル${restaurant.tableSeatCount}席`}
                    </Text>
                  </>
                )}
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
                      <AccordionPanel p={0} mt={1}>
                        <Box>
                          {groupedByDayOfWeeks(restaurant.openingHours).map((text, idx) => {
                            return (
                              <Text key={idx} fontWeight="normal">
                                {text}
                              </Text>
                            );
                          })}
                        </Box>
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                </Box>
                {restaurant.remark && (
                  <>
                    <Text>備考</Text>
                    <Text whiteSpace="pre-wrap" fontWeight="normal">
                      {restaurant.remark}
                    </Text>
                  </>
                )}
              </SimpleGrid>
              <RestaurantInfoImages
                restaurantId={restaurant.id}
                interiorImagePath={restaurant.interiorImagePath}
                exteriorImagePath={restaurant.exteriorImage?.imagePath}
                menuImages={restaurant.menuImages}
              />
              <Box w="full">
                <Text fontSize="sm" fontWeight="bold" ml={4}>
                  Watt限定メニュー
                </Text>
                <Flex gap={3} className="hidden-scrollbar" overflowX="scroll" px={4}>
                  {restaurant.meals.map((meal) => (
                    <MealPreview key={meal.id} meal={meal} onClick={() => setSelectedMeal(meal)} />
                  ))}
                </Flex>
              </Box>
            </VStack>
          </VStack>

          {selectedMeal && <MealDetailModal isOpen onClose={() => setSelectedMeal(undefined)} meal={selectedMeal} />}
        </Box>
        {footer && (
          <Box
            px={4}
            py={2}
            w="full"
            bgColor="white"
            position="sticky"
            bottom={0}
            boxShadow="0 -4px 15px 0px rgba(0, 0, 0, 0.2)"
            zIndex={1}
          >
            {footer}
          </Box>
        )}
      </Flex>
    </>
  );
}
