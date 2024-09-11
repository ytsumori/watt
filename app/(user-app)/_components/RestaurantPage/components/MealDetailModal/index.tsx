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
        <ModalHeader pb={0} px={4}>
          {meal.title}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody mb={4} px={4} pt={0}>
          <MealDetailPage meal={meal} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
