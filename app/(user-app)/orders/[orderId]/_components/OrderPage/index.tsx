"use client";

import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Icon,
  Spacer,
  Text,
  VStack,
  useDisclosure
} from "@chakra-ui/react";
import { Prisma } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaMapMarkedAlt } from "react-icons/fa";
import NextLink from "next/link";
import { ConfirmModal } from "@/components/confirm-modal";
import { cancelOrder } from "../../_actions/cancel-order";
import { completeOrder } from "../../_actions/complete-order";
import { CompleteConfirmModal } from "../PaymentConfirmModal";
import { CancelConfirmModal } from "../CancelConfirmModal";
import NextImage from "next/image";
import { getOrderStatus } from "@/lib/prisma/order-status";

type Props = {
  order: Prisma.OrderGetPayload<{
    include: {
      restaurant: { include: { googleMapPlaceInfo: { select: { url: true } } } };
      meals: { include: { meal: { select: { title: true; price: true } } } };
      payment: true;
    };
  }>;
};

export function OrderPage({ order }: Props) {
  const router = useRouter();
  const { isOpen: isCompleteModalOpen, onOpen: onCompleteModalOpen, onClose: onCompleteModalClose } = useDisclosure();
  const { isOpen: isCancelModalOpen, onOpen: onCancelModalOpen, onClose: onCancelModalClose } = useDisclosure();
  const [isConfirming, setIsConfirming] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [errorMessage, setErrorMessage] = useState<{ title: string; description: string }>();

  const handleCompleteConfirm = () => {
    setIsConfirming(true);
    completeOrder(order.id).then(() => {
      setIsConfirming(false);
      router.refresh();
      window.scrollTo(0, 0);
    });
  };

  const handleCancelConfirm = (isFull: boolean) => {
    setIsCancelling(true);

    cancelOrder({ orderId: order.id, restaurantId: order.restaurant.id, isFull })
      .then(() => {
        router.push("/");
        router.refresh();
      })
      .catch(() => {
        setErrorMessage({
          title: "キャンセルに失敗しました",
          description: "キャンセルに失敗しました。ページを更新して再度ご確認ください。"
        });
      });
  };

  switch (getOrderStatus(order)) {
    case "IN PROGRESS":
      return (
        <>
          <VStack alignItems="start" spacing={8} p={4}>
            <VStack alignItems="start" spacing={4}>
              <Heading>注文を確定</Heading>
              <Alert
                status="info"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                textAlign="center"
                borderRadius={4}
              >
                <AlertIcon />
                <AlertDescription>
                  入店後お店の人に「Wattでの注文で」と伝え、こちらの画面を見せて注文を確定してください
                </AlertDescription>
              </Alert>
              <VStack alignItems="start">
                <Heading size="md">店舗</Heading>
                <Heading size="sm">{order.restaurant.name}</Heading>
                {order.restaurant.googleMapPlaceInfo && (
                  <Button
                    w="full"
                    leftIcon={<Icon as={FaMapMarkedAlt} />}
                    as={NextLink}
                    href={order.restaurant.googleMapPlaceInfo.url}
                    target="_blank"
                  >
                    Googleマップでお店情報を見る
                  </Button>
                )}
                <Box h="15vh" w="full">
                  <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}&q=place_id:${order.restaurant.googleMapPlaceId}`}
                  />
                </Box>
              </VStack>
              <Text>
                注文番号:
                <Heading as="span" ml={2}>
                  {order.orderNumber}
                </Heading>
              </Text>
              <VStack alignItems="start" w="full">
                <Heading size="md">注文内容</Heading>
                {order.meals.map((orderMeal) => (
                  <Flex w="full" key={orderMeal.id}>
                    <Text>{orderMeal.meal.title}</Text>
                    <Spacer />
                    <Text as="p" fontWeight="bold">
                      ¥{orderMeal.meal.price.toLocaleString("ja-JP")} × {orderMeal.quantity}
                    </Text>
                  </Flex>
                ))}
                <Divider />
                <Heading size="sm" alignSelf="self-end">
                  合計 ¥
                  {order.meals
                    .reduce((acc, orderMeal) => acc + orderMeal.meal.price * orderMeal.quantity, 0)
                    .toLocaleString("ja-JP")}
                </Heading>
              </VStack>
              <VStack w="full" mt={10}>
                <Button
                  size="md"
                  w="full"
                  maxW="full"
                  onClick={onCompleteModalOpen}
                  isDisabled={isCancelling}
                  isLoading={isConfirming}
                >
                  注文を確定する
                </Button>
                <Button
                  size="md"
                  colorScheme="gray"
                  w="full"
                  maxW="full"
                  onClick={onCancelModalOpen}
                  isDisabled={isConfirming}
                  isLoading={isCancelling}
                >
                  キャンセル
                </Button>
              </VStack>
            </VStack>
          </VStack>
          <CompleteConfirmModal
            isOpen={isCompleteModalOpen}
            isConfirming={isConfirming}
            onClose={onCompleteModalClose}
            onConfirm={handleCompleteConfirm}
          />
          <CancelConfirmModal
            isOpen={isCancelModalOpen}
            isCancelling={isCancelling}
            onClose={onCancelModalClose}
            onConfirm={handleCancelConfirm}
          />
          <ConfirmModal
            isOpen={errorMessage !== undefined}
            title={errorMessage?.title ?? ""}
            confirmButton={{
              label: "OK",
              onClick: () => router.refresh()
            }}
            onClose={() => undefined}
          >
            {errorMessage?.description ?? ""}
          </ConfirmModal>
        </>
      );
    case "CANCELED":
      return (
        <VStack alignItems="start" p={4} spacing={4}>
          <Heading>キャンセル済み</Heading>
          <Text>
            注文番号:
            <Heading as="span" ml={2}>
              {order.orderNumber}
            </Heading>
          </Text>
          <Alert
            status="error"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            borderRadius={4}
          >
            <AlertIcon />
            <AlertTitle>こちらの注文はすでにキャンセルされています</AlertTitle>
          </Alert>
          <Heading>注文情報</Heading>
          <VStack alignItems="start">
            <Heading size="md">店舗</Heading>
            <Heading size="sm">{order.restaurant.name}</Heading>
          </VStack>
          <Button variant="outline" size="md" colorScheme="gray" w="full" maxW="full" as={NextLink} href="/">
            ホーム画面に戻る
          </Button>
        </VStack>
      );
    case "COMPLETE":
      const isPaymentCompleted = order.payment !== null && order.payment.completedAt !== null;
      return (
        <VStack alignItems="start" p={4} spacing={4}>
          <Heading>注文完了</Heading>
          <Text>
            注文番号:
            <Heading as="span" ml={2}>
              {order.orderNumber}
            </Heading>
          </Text>
          <Alert
            status="success"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            borderRadius={4}
          >
            <AlertIcon />
            <AlertTitle>注文が完了しました</AlertTitle>
            <AlertDescription>
              {isPaymentCompleted ? "ご利用ありがとうございました" : "お食事をお楽しみください"}
            </AlertDescription>
          </Alert>
          {!isPaymentCompleted && (
            <Button
              as={NextLink}
              size="lg"
              w="full"
              maxW="full"
              href={`/orders/${order.id}/payments/new`}
              isDisabled={isConfirming || isCancelling}
            >
              <NextImage src="/watt-logo-secondary.png" alt="Watt" width={67} height={36} /> で会計する
            </Button>
          )}
          <Heading>注文情報</Heading>
          <VStack alignItems="start">
            <Heading size="md">店舗</Heading>
            <Heading size="sm">{order.restaurant.name}</Heading>
          </VStack>
          <VStack alignItems="start" w="full">
            <Heading size="md">金額</Heading>
            <VStack spacing={0} alignItems="start" w="full">
              {order.meals.map((orderMeal) => (
                <Flex w="full" key={orderMeal.id} justifyContent="space-between">
                  <Text>{orderMeal.meal.title}</Text>
                  <Text as="p" fontWeight="bold">
                    ¥{orderMeal.meal.price.toLocaleString("ja-JP")} × {orderMeal.quantity}
                  </Text>
                </Flex>
              ))}
              {isPaymentCompleted && order.payment?.additionalAmount && (
                <Flex w="full" justifyContent="space-between">
                  <Text>追加料金</Text>
                  <Text as="p" fontWeight="bold">
                    ¥{order.payment.additionalAmount.toLocaleString("ja-JP")}
                  </Text>
                </Flex>
              )}
            </VStack>
            <Divider />
            <Flex w="full" justifyContent="space-between">
              <Text>合計</Text>
              <Text fontWeight="bold">
                ¥
                {(isPaymentCompleted
                  ? order.payment!!.totalAmount
                  : order.meals.reduce((acc, orderMeal) => acc + orderMeal.meal.price * orderMeal.quantity, 0)
                ).toLocaleString("ja-JP")}
              </Text>
            </Flex>
          </VStack>
          <Button variant="outline" size="md" colorScheme="gray" w="full" maxW="full" as={NextLink} href="/">
            ホーム画面に戻る
          </Button>
        </VStack>
      );
    default:
      throw new Error("Invalid payment status");
  }
}
