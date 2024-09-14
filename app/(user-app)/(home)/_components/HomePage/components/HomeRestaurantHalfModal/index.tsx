"use client";

import { RestaurantHalfModal } from "@/app/(user-app)/_components/RestaurantHalfModal";
import { LineLoginButton } from "@/components/Auth/LineLoginButton";
import { Alert, AlertIcon, Button } from "@chakra-ui/react";
import { Prisma } from "@prisma/client";
import { useRouter } from "next-nprogress-bar";
import { usePathname } from "next/navigation";
import { ComponentProps } from "react";

type Props = {
  isOpen: boolean;
  restaurant: ComponentProps<typeof RestaurantHalfModal>["restaurant"] &
    Prisma.RestaurantGetPayload<{ select: { isAvailable: true } }>;
  userId: ComponentProps<typeof RestaurantHalfModal>["userId"];
};

export function HomeRestaurantHalfModal({ isOpen, restaurant, userId }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const handleClose = () => {
    router.push(pathname, {}, { showProgressBar: false });
  };
  return (
    <RestaurantHalfModal
      isOpen={isOpen}
      onClose={handleClose}
      restaurant={restaurant}
      userId={userId}
      footer={
        <>
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
                  <Alert status="warning" borderRadius={4} fontSize="sm">
                    <AlertIcon />
                    現在空き状況が確認できません
                  </Alert>
                );
              }
            })()
          ) : (
            <>
              <Alert status="error" fontSize="sm" mb={2}>
                <AlertIcon />
                現在の空き状況が確認するには
                <br />
                ログインが必要です
              </Alert>
              <LineLoginButton callbackPath={pathname} />
            </>
          )}
        </>
      }
    />
  );
}
