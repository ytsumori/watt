"use client";

import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader } from "@chakra-ui/react";
import { Meal } from "@prisma/client";
import React from "react";
import { MealForm } from "../MealForm";

type Props = {
  restaurantId: string;
  editingMeal?: Meal;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
};

export function MealFormModal({ restaurantId, isOpen, onClose, onSubmit, editingMeal }: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalContent>
        <ModalHeader>推しメシを{editingMeal ? "編集" : "登録"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <MealForm restaurantId={restaurantId} editingMeal={editingMeal} onSubmit={onSubmit} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
