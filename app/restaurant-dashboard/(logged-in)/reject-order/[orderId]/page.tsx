"use client";

import { useContext, useEffect, useState } from "react";
import { Prisma } from "@prisma/client";
import { Alert, Button, Center, useDisclosure, Text, VStack, Spinner, Box, Heading } from "@chakra-ui/react";
import { ConfirmModal } from "@/components/confirm-modal";
import { MealPreviewImage } from "@/components/meal/MealPreviewImage";
import { getMealImageUrl } from "@/utils/image/getMealImageUrl";
import { findOrder } from "./_actions/find-order";
import { cancelOrder } from "./_actions/cancel-order";
import { RestaurantIdContext } from "../../_components/RestaurantIdProvider";

export default function RejectOrder({ params }: { params: { orderId: string } }) {
  const restaurantId = useContext(RestaurantIdContext);
  const [order, setOrder] = useState<Prisma.OrderGetPayload<{ include: { meals: { include: { meal: true } } } }>>();
  const [isPosting, setIsPosting] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    findOrder({ orderId: params.orderId, restaurantId }).then((order) => {
      if (order) {
        setOrder(order);
      }
    });
  }, [params.orderId, restaurantId]);

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

  if (order.canceledAt) {
    return <Alert status="error">こちらの注文はすでにキャンセルされています</Alert>;
  }

  return (
    <>
      <VStack spacing={5} px={2} w="full" alignItems="start" p={4}>
        <Heading>注文情報</Heading>
        <Text>
          注文番号:
          <Heading as="span" ml={2}>
            {order.orderNumber}
          </Heading>
        </Text>
        <Heading size="md">注文商品</Heading>
        {order.meals.map((orderMeal) => (
          <Box key={orderMeal.id} w="full">
            <MealPreviewImage src={getMealImageUrl(orderMeal.meal.imagePath)} alt={orderMeal.meal.title} />
            <Text>{orderMeal.meal.title}</Text>
          </Box>
        ))}
        <Button colorScheme="red" onClick={onOpen} w="full" size="md">
          店内が満席であることを伝える
        </Button>
      </VStack>
      <ConfirmModal
        isOpen={isOpen}
        title="満席を伝える"
        confirmButton={{
          label: "満席を伝える",
          onClick: handleReject,
          isLoading: isPosting
        }}
        cancelButton={{
          label: "戻る",
          isDisabled: isPosting
        }}
        onClose={onClose}
      >
        <Text>満席を伝えると自動で注文がキャンセルされ、営業ステータスが「入店不可」に切り替わります。</Text>
      </ConfirmModal>
    </>
  );
}
