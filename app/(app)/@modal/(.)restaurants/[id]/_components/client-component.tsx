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
import { useRouter } from "next/navigation";
import Stripe from "stripe";

type Props = {
  restaurantId: number;
  paymentMethods: Stripe.PaymentMethod[];
};

export default function RestaurantModal({
  restaurantId,
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
            selectedRestaurantId={restaurantId}
            paymentMethods={paymentMethods}
          />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
