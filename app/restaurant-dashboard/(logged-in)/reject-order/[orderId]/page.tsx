"use client";

import { useContext, useEffect, useState } from "react";
import { RestaurantIdContext } from "../../_components/restaurant-id-provider";
import { findOrder } from "@/actions/order";
import { Meal, Order } from "@prisma/client";
import {
  Alert,
  Button,
  Center,
  useDisclosure,
  Text,
  VStack,
  Spinner,
  Box,
  Heading,
} from "@chakra-ui/react";
import { ConfirmModal } from "@/components/confirm-modal";
import { cancelOrder } from "./_actions/cancel-order";
import { MealPreviewImage } from "@/components/meal-preview-image";
import { findMeal } from "@/actions/meal";

export default function RejectOrder({
  params,
}: {
  params: { orderId: string };
}) {
  const restaurantId = useContext(RestaurantIdContext);
  const [order, setOrder] = useState<Order>();
  const [meal, setMeal] = useState<Meal>();
  const [isPosting, setIsPosting] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    findOrder({
      where: { id: params.orderId, meal: { restaurantId: restaurantId } },
      include: { meal: true },
    }).then((order) => {
      if (order) {
        setOrder(order);
      }
    });
  }, [params.orderId, restaurantId]);

  useEffect(() => {
    if (order) {
      findMeal(order.mealId).then((meal) => {
        if (meal) {
          setMeal(meal);
        }
      });
    }
  }, [order]);

  if (!order) {
    return (
      <Center h="100vh" w="100vw">
        <VStack>
          <Spinner size="xl" />
          <Text>注文情報を取得中</Text>
        </VStack>
      </Center>
    );
  }

  const handleReject = () => {
    setIsPosting(true);
    cancelOrder(order.id).then((order) => {
      if (order) {
        setOrder(order);
      }
      onClose();
      setIsPosting(false);
    });
  };

  if (order.status === "CANCELED") {
    return (
      <Alert status="error">こちらの注文はすでにキャンセルされています</Alert>
    );
  }

  return (
    <>
      <Center w="100vw" h="100vh">
        <VStack spacing={5} px={2}>
          {meal && (
            <VStack>
              <Heading size="sm">注文予定の推しメシ</Heading>
              <Box w="50%">
                <MealPreviewImage src={meal?.imageUrl} alt={meal.title} />
              </Box>
            </VStack>
          )}
          <Button colorScheme="red" onClick={onOpen} w="full" size="md">
            店内が満席であることを伝える
          </Button>
        </VStack>
      </Center>
      <ConfirmModal
        isOpen={isOpen}
        title="満席を伝える"
        confirmButton={{
          label: "満席を伝える",
          onClick: handleReject,
          isLoading: isPosting,
        }}
        cancelButton={{
          label: "戻る",
          isDisabled: isPosting,
        }}
        onClose={onClose}
      >
        <Text>
          満席を伝えると自動で注文がキャンセルされ、店舗の営業ステータスが準備中に切り替わります。
        </Text>
      </ConfirmModal>
    </>
  );
}
