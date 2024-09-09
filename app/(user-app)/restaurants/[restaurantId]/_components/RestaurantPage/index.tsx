"use client";

import { VStack, Text, HStack, Button, Box, Alert, AlertIcon, Flex } from "@chakra-ui/react";
import { Prisma } from "@prisma/client";
import { usePathname } from "next/navigation";
import { RestaurantInfo } from "./components/RestaurantInfo";
import { MealPreviewBox } from "@/components/meal/MealPreviewBox";
import { LineLoginButton } from "@/components/Auth/LineLoginButton";
import { useRouter } from "next-nprogress-bar";

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
};

export function RestaurantPage({ restaurant, userId }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <VStack w="full" alignItems="start" spacing={4}>
      <RestaurantInfo restaurant={restaurant} />
      <Box maxW="full">
        <Text fontWeight="bold" mb={1} ml={4}>
          Watt限定メニュー
        </Text>
        <Flex gap={3} className="hidden-scrollbar" overflowX="scroll" px={4}>
          {restaurant.meals.map((meal) => (
            <MealPreviewBox key={meal.id} meal={meal} href={`/restaurants/${meal.restaurantId}/meals/${meal.id}`} />
          ))}
        </Flex>
      </Box>

      <Box pb={4} px={4} w="full">
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
    </VStack>
  );
}
