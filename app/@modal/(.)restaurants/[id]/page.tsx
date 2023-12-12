"use client";

import Comments from "@/components/comments";
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
import { useState } from "react";

type Params = {
  id: string;
};

export default function RestaurantModal({ params }: { params: Params }) {
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);
  const router = useRouter();
  const restaurantId = Number(params.id);
  if (isNaN(restaurantId)) {
    router.back();
  }
  return (
    <Drawer
      isOpen
      placement="bottom"
      onClose={() => (isCommentOpen ? setIsCommentOpen(false) : router.back())}
    >
      <DrawerOverlay />
      <DrawerContent pb={3} borderTopRadius={16}>
        <DrawerCloseButton />
        <DrawerHeader>{isCommentOpen ? "コメント" : "お店詳細"}</DrawerHeader>

        <DrawerBody p={0}>
          {isCommentOpen ? (
            <Comments />
          ) : (
            <RestaurantDetail
              isPurchased={isPurchased}
              selectedRestaurantId={restaurantId!}
              onPurchase={() => setIsPurchased(true)}
              onClickComment={() => setIsCommentOpen(true)}
            />
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
