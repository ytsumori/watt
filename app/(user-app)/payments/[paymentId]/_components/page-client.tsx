"use client";

import { updatePaymentStatus } from "@/actions/payment";
import {
  cancelPaymentIntent,
  capturePaymentIntent,
} from "@/actions/payment-intent";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Heading,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Prisma } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  payment: Prisma.PaymentGetPayload<{
    include: {
      order: { include: { meal: { include: { restaurant: true } } } };
    };
  }>;
};

export function PaymentPage({ payment }: Props) {
  const router = useRouter();
  const [isPaying, setIsPaying] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const handlePaymentConfirm = () => {
    setIsPaying(true);
    capturePaymentIntent(payment.id).then((paymentStatus) => {
      if (paymentStatus === "succeeded") {
        router.refresh();
      } else {
        console.error("Failed to capture payment intent");
      }
    });
  };

  const handlePaymentCancel = () => {
    setIsCancelling(true);
    cancelPaymentIntent(payment.id).then((paymentStatus) => {
      if (paymentStatus === "canceled") {
        router.push("/");
      } else {
        console.error("Failed to cancel payment intent");
      }
    });
  };

  switch (payment.status) {
    case "PREAUTHORIZED":
      return (
        <>
          <VStack alignItems="start" p={4} spacing={4}>
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
                入店後、お店の人に「Wattでの注文で」と伝え
                <br />
                こちらの画面を見せて注文を確定してください
              </AlertDescription>
            </Alert>
            <Heading>注文情報</Heading>
            <VStack alignItems="start">
              <Heading size="md">店舗</Heading>
              <Heading size="sm">{payment.order.meal.restaurant.name}</Heading>
              <Box h="15vh" w="full">
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}&q=place_id:${payment.order.meal.restaurant.googleMapPlaceId}`}
                />
              </Box>
            </VStack>
            <VStack alignItems="start">
              <Heading size="md">注文商品</Heading>
              <Image
                w="50vw"
                src={payment.order.meal.imageUrl}
                alt={`meal-${payment.order.meal.id}`}
                objectFit="cover"
                aspectRatio={1 / 1}
              />
            </VStack>
            <VStack alignItems="start">
              <Heading size="md">金額</Heading>
              <Heading size="sm">
                {payment.order.meal.price.toLocaleString("ja-JP")}円
              </Heading>
            </VStack>
            <VStack w="full">
              <Button
                size="md"
                w="full"
                maxW="full"
                color="white"
                onClick={handlePaymentConfirm}
                isDisabled={isPaying || isCancelling}
              >
                注文を確定する
              </Button>
              <Button
                size="md"
                colorScheme="gray"
                w="full"
                maxW="full"
                onClick={handlePaymentCancel}
                isDisabled={isPaying || isCancelling}
              >
                キャンセル
              </Button>
            </VStack>
          </VStack>
          <Modal
            isOpen={isPaying}
            onClose={() => undefined}
            size="xs"
            isCentered
          >
            <ModalOverlay />
            <ModalContent>
              <ModalBody textAlign="center">
                <Spinner />
                <Text>決済中...</Text>
              </ModalBody>
            </ModalContent>
          </Modal>
          <Modal
            isOpen={isCancelling}
            onClose={() => undefined}
            size="xs"
            isCentered
          >
            <ModalOverlay />
            <ModalContent>
              <ModalBody textAlign="center">
                <Spinner />
                <Text>キャンセル中...</Text>
              </ModalBody>
            </ModalContent>
          </Modal>
        </>
      );
    case "COMPLETE":
      return (
        <VStack alignItems="start" p={4} spacing={4}>
          <Heading>決済完了</Heading>
          <Alert
            status="success"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            borderRadius={4}
          >
            <AlertIcon />
            <AlertTitle>決済が完了しました</AlertTitle>
            <AlertDescription>
              こちらの画面を
              <br />
              お店の人に確認してもらってください
            </AlertDescription>
          </Alert>
          <Heading>注文情報</Heading>
          <VStack alignItems="start">
            <Heading size="md">店舗</Heading>
            <Heading size="sm">{payment.order.meal.restaurant.name}</Heading>
          </VStack>
          <VStack alignItems="start">
            <Heading size="md">注文商品</Heading>
            <Image
              w="50vw"
              src={payment.order.meal.imageUrl}
              alt={`meal-${payment.order.meal.id}`}
              objectFit="cover"
              aspectRatio={1 / 1}
            />
          </VStack>
          <VStack alignItems="start">
            <Heading size="md">金額</Heading>
            <Heading size="sm">
              {payment.order.meal.price.toLocaleString("ja-JP")}円
            </Heading>
          </VStack>
          <Button
            variant="outline"
            size="md"
            colorScheme="gray"
            w="full"
            maxW="full"
            onClick={() => router.push("/")}
          >
            ホーム画面に戻る
          </Button>
        </VStack>
      );
    case "CANCELED":
      return (
        <div>
          <h1>Payment</h1>
          <p>
            You have cancelled the payment for the meal {payment.order.meal.id}.
          </p>
        </div>
      );
    default:
      throw new Error("Invalid payment status");
  }
}
