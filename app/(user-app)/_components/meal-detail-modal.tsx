"use client";

import { findMeal } from "@/actions/meal";
import {
  Button,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Meal } from "@prisma/client";
import { useEffect, useState } from "react";

type Props = {
  mealId: string;
  isOpen: boolean;
  completeButton: {
    label: string;
    onClick: (restaurantId: string) => void;
  };
  onClose: () => void;
};

export function MealDetailModal({
  mealId,
  isOpen,
  onClose,
  completeButton,
}: Props) {
  const [meal, setMeal] = useState<Meal>();
  const [isCompleteLoading, setIsCompleteLoading] = useState(false);

  useEffect(() => {
    findMeal(mealId).then((meal) => {
      if (meal) {
        setMeal(meal);
      } else {
        onClose();
      }
    });
  }, [mealId, onClose]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setMeal(undefined);
        onClose();
      }}
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        {meal ? (
          <>
            <ModalHeader>{meal.title}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack w="full" alignItems="start" spacing={2}>
                <Image src={meal.imageUrl} alt={meal.title} />
                <Text fontSize="sm">¥{meal.price.toLocaleString("ja-JP")}</Text>
                <Text fontSize="sm" whiteSpace="pre-wrap">
                  {meal.description}
                </Text>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button
                color="white"
                size="md"
                isLoading={isCompleteLoading}
                onClick={() => {
                  setIsCompleteLoading(true);
                  completeButton.onClick(meal.restaurantId);
                }}
              >
                {completeButton.label}
              </Button>
            </ModalFooter>
          </>
        ) : (
          <Spinner />
        )}
      </ModalContent>
    </Modal>
  );
}
