"use client";

import { VStack, Divider, Text, HStack, Button } from "@chakra-ui/react";
import { Prisma } from "@prisma/client";
import { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { RestaurantInfo } from "./components/RestaurantInfo";
import { LineLoginButton } from "../../../../components/Auth/LineLoginButton";
import { getRestaurantStatus } from "@/utils/restaurant-status";
import { MealPreviewBox } from "@/components/meal/MealPreviewBox";

type Props = {
  restaurant: Prisma.RestaurantGetPayload<{
    include: {
      meals: { include: { items: { include: { options: true } } } };
      googleMapPlaceInfo: { select: { url: true } };
      paymentOptions: true;
      fullStatuses: { select: { easedAt: true } };
      exteriorImage: true;
      menuImages: true;
    };
  }>;
  userId?: string;
};

export function RestaurantPage({ restaurant, userId }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const status = useMemo(
    () =>
      getRestaurantStatus({
        isOpen: restaurant.isOpen,
        isFull: restaurant.fullStatuses.some((status) => status.easedAt === null)
      }),
    [restaurant.fullStatuses, restaurant.isOpen]
  );

  return (
    <VStack w="full" p={4} alignItems="start" spacing={4}>
      <RestaurantInfo restaurant={restaurant} />
      <Divider borderColor="black" my={6} />
      <VStack alignItems="start" spacing={0}>
        <Text fontWeight="bold" mb={2}>
          セットメニュー
        </Text>
        <HStack>
          {restaurant.meals.map((meal) => (
            <MealPreviewBox
              key={meal.id}
              meal={meal}
              href={`/restaurants/${restaurant.id}/meals/${meal.id}`}
              isRouter
              isDiscounted={status === "open"}
            />
          ))}
        </HStack>
        {userId ? (
          <Button onClick={() => router.push(`/restaurants/${restaurant.id}/orders/new`)}>注文画面に進む</Button>
        ) : (
          <LineLoginButton callbackUrl={pathname} />
        )}
      </VStack>
    </VStack>
  );
}
