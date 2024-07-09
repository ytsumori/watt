"use client";

import { DrawerContent, DrawerOverlay, Drawer, DrawerCloseButton, DrawerBody } from "@chakra-ui/react";
import { Prisma } from "@prisma/client";
import { useRouter } from "next-nprogress-bar";
import { RestaurantPage } from "@/app/(user-app)/_components/RestaurantPage";
import { MealWithItems } from "@/app/(user-app)/_components/RestaurantPage/types/MealWithItems";

type Props = {
  restaurant: Prisma.RestaurantGetPayload<{
    include: {
      meals: { include: { items: { include: { options: true } } } };
      googleMapPlaceInfo: { select: { url: true } };
      paymentOptions: true;
    };
  }>;
  inProgressOrderId?: string;
  userId?: string;
  defaultMeal?: MealWithItems;
};

export function RestaurantModalPage({ restaurant, inProgressOrderId, userId, defaultMeal }: Props) {
  const router = useRouter();

  return (
    <Drawer isOpen={true} onClose={() => router.back()} placement="bottom">
      <DrawerOverlay />
      <DrawerContent height="95%">
        <DrawerCloseButton zIndex={1} />
        <DrawerBody p={0}>
          <RestaurantPage
            restaurant={restaurant}
            inProgressOrderId={inProgressOrderId}
            userId={userId}
            defaultMeal={defaultMeal}
          />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
