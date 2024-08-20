"use client";

import { MealDetailPage } from "@/app/(user-app)/_components/MealDetailPage";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import { useRouter } from "next-nprogress-bar";
import { ComponentProps } from "react";

type Props = ComponentProps<typeof MealDetailPage>;

export function MealDetailModalPage(props: Props) {
  const router = useRouter();

  return (
    <Modal isOpen={true} onClose={router.back} isCentered blockScrollOnMount={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader />
        <ModalCloseButton />
        <ModalBody>
          <MealDetailPage {...props} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
