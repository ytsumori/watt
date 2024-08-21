"use client";

import { MealDetailPage } from "@/app/(user-app)/_components/MealDetailPage";
import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import { useRouter } from "next-nprogress-bar";
import { ComponentProps } from "react";

type Props = ComponentProps<typeof MealDetailPage> & { restaurantId: string };

export function HomeMealModal({ restaurantId, ...mealDetailProps }: Props) {
  const router = useRouter();

  return (
    <Modal isOpen={true} onClose={router.back} isCentered blockScrollOnMount={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader />
        <ModalCloseButton />
        <ModalBody>
          <MealDetailPage {...mealDetailProps} />
          <Button onClick={() => router.replace(`/restaurants/${restaurantId}`)} w="full" my={2}>
            お店詳細を見る
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
