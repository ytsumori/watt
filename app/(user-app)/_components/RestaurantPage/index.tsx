"use client";

import { VStack, Divider, Text, HStack, Button } from "@chakra-ui/react";
import { Prisma } from "@prisma/client";
import { usePathname, useRouter } from "next/navigation";
import { RestaurantInfo } from "./components/RestaurantInfo";
import { MealPreviewBox } from "@/components/meal/MealPreviewBox";
import { LineLoginButton } from "@/components/Auth/LineLoginButton";

type Props = {
  restaurant: Prisma.RestaurantGetPayload<{
    include: {
      meals: { include: { items: { include: { options: true } } } };
      googleMapPlaceInfo: { select: { url: true } };
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
