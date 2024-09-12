"use client";

import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Heading,
  Icon,
  Text,
  VStack,
  useDisclosure
} from "@chakra-ui/react";
import { Prisma } from "@prisma/client";
import { useState } from "react";
import { FaMapMarkedAlt } from "react-icons/fa";
import NextLink from "next/link";
import { ConfirmModal } from "@/components/confirm-modal";
import { cancelOrder } from "../../_actions/cancel-order";
import { CancelConfirmModal } from "../CancelConfirmModal";
import { getOrderStatus } from "@/lib/prisma/order-status";
import { PriceSection } from "../PriceSection";
import { format } from "date-fns";
import { PhoneIcon } from "@chakra-ui/icons";
import { useRouter } from "next-nprogress-bar";

type Props = {
  order: Prisma.OrderGetPayload<{
    include: {
      restaurant: { include: { googleMapPlaceInfo: { select: { url: true } } } };
      meals: {
        include: {
          meal: { select: { title: true; price: true; listPrice: true } };
          options: {
            select: {
              id: true;
              mealItemOption: {
                select: {
                  title: true;
                  extraPrice: true;
                  mealItem: { select: { title: true } };
                };
              };
            };
          };
        };
      };
    };
  }>;
};

export function OrderPage({ order }: Props) {
  const router = useRouter();
  const { isOpen: isCancelModalOpen, onOpen: onCancelModalOpen, onClose: onCancelModalClose } = useDisclosure();
  const [isCancelling, setIsCancelling] = useState(false);
  const [errorMessage, setErrorMessage] = useState<{ title: string; description: string }>();

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
          <VStack alignItems="start" spacing={8} p={4} w="full">
            <Heading>空き確認中</Heading>
            <Text>
              注文番号:
              <Heading as="span" ml={2}>
                {order.orderNumber}
              </Heading>
            </Text>
            <Alert
              status="warning"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              borderRadius={4}
            >
              <AlertIcon as={PhoneIcon} />
              <AlertTitle mb={1}>お店の空き状況を確認しています</AlertTitle>
              <AlertDescription fontSize="sm">5分以内に確認し、SMSで通知します</AlertDescription>
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
            <PriceSection order={order} />
            <VStack w="full" mt={10}>
              <Button
                size="md"
                colorScheme="gray"
                w="full"
                maxW="full"
                onClick={onCancelModalOpen}
                isLoading={isCancelling}
              >
                キャンセル
              </Button>
            </VStack>
          </VStack>
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
    case "APPROVED":
      if (!order.approvedByRestaurantAt) {
        throw new Error("approvedByRestaurantAt is not set");
      }
      const arrivalDeadline = new Date(order.approvedByRestaurantAt);
      arrivalDeadline.setMinutes(arrivalDeadline.getMinutes() + 30);
      const isBeforeDeadline = Date.now() < arrivalDeadline.getTime();
      return (
        <>
          <VStack alignItems="start" spacing={8} p={4} w="full">
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
              <AlertTitle mb={1}>
                {isBeforeDeadline
                  ? `${format(arrivalDeadline, "HH:mm")}までにお店に向かってください`
                  : "注文が完了しました"}
              </AlertTitle>
              <AlertDescription fontSize="sm" whiteSpace="pre-wrap">
                {isBeforeDeadline
                  ? "入店後お店の人に「Wattでの注文で」と伝え\nこちらの画面を見せてください"
                  : "お食事をお楽しみください"}
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
            <PriceSection order={order} />
            <VStack w="full" mt={10}>
              <Button variant="outline" size="md" colorScheme="gray" w="full" maxW="full" as={NextLink} href="/">
                ホーム画面に戻る
              </Button>
              {isBeforeDeadline && (
                <Button
                  size="md"
                  colorScheme="gray"
                  w="full"
                  maxW="full"
                  onClick={onCancelModalOpen}
                  isLoading={isCancelling}
                >
                  キャンセル
                </Button>
              )}
            </VStack>
          </VStack>
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
    default:
      throw new Error("Invalid payment status");
  }
}
