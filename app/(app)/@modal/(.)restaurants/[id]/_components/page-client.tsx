"use client";

import RestaurantDetail from "@/components/restaurant-detail";
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/react";
import { Meal, Restaurant } from "@prisma/client";
import { useRouter } from "next/navigation";
import Stripe from "stripe";

type Props = {
  selectedRestaurant: Restaurant;
  meal?: Meal;
  paymentMethods: Stripe.PaymentMethod[];
};

export default function RestaurantModal({
  selectedRestaurant,
  meal,
  paymentMethods,
}: Props) {
  const router = useRouter();
  return (
    <Drawer isOpen placement="bottom" onClose={() => router.back()}>
      <DrawerOverlay />
      <DrawerContent pb={3} borderTopRadius={16}>
        <DrawerCloseButton />
        <DrawerHeader>お店詳細</DrawerHeader>

        <DrawerBody p={0}>
          <RestaurantDetail
            selectedRestaurant={selectedRestaurant}
            meal={meal}
            paymentMethods={paymentMethods}
          />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
