"use client";

import { MealDetailPage } from "@/app/(user-app)/_components/MealDetailPage";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalProps
} from "@chakra-ui/react";
import { ComponentProps } from "react";

type Props = { meal: ComponentProps<typeof MealDetailPage>["meal"] } & Omit<ModalProps, "children">;

export function MealDetailModal({ meal, ...modalProps }: Props) {
  return (
    <Modal isCentered blockScrollOnMount={false} {...modalProps}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader />
        <ModalCloseButton />
        <ModalBody>
          <MealDetailPage meal={meal} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
