"use client";

import { MealDetailPage } from "@/app/(user-app)/_components/MealDetailPage";
import { Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, ModalHeader } from "@chakra-ui/react";
import { useRouter } from "next-nprogress-bar";
import { ComponentProps, FC } from "react";

type Props = ComponentProps<typeof MealDetailPage>;

export const MealDetailModalPage: FC<Props> = (props) => {
  const router = useRouter();
  return (
    <Modal isOpen={true} onClose={router.back} isCentered>
      <ModalOverlay />
      <ModalCloseButton />
      <ModalContent>
        <ModalHeader>←お店の詳細を確認</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <MealDetailPage {...props} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
