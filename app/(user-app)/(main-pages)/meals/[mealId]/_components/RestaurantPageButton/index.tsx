"use client";

import { ArrowBackIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";
import { useRouter } from "next-nprogress-bar";

type Props = {
  restaurantId: string;
};

export function RestaurantPageButton({ restaurantId }: Props) {
  const router = useRouter();
  return (
    <Button
      leftIcon={<ArrowBackIcon />}
      onClick={() => router.push(`/restaurants/${restaurantId}`)}
      variant="ghost"
      px={0}
    >
      お店詳細を見る
    </Button>
  );
}
