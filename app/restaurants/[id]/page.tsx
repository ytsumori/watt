"use client";

import Comments from "@/components/comments";
import RestaurantDetail from "@/components/restaurant-detail";
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
    router.push("/");
  }
  return isCommentOpen ? (
    <Comments />
  ) : (
    <RestaurantDetail
      isPurchased={isPurchased}
      selectedRestaurantId={restaurantId!}
      onPurchase={() => setIsPurchased(true)}
      onClickComment={() => setIsCommentOpen(true)}
    />
  );
}
