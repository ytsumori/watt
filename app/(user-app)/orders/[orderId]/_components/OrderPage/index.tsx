"use client";

import { cancelPaymentIntent, capturePaymentIntent } from "@/actions/payment-intent";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  Heading,
  Icon,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Spacer,
  Spinner,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { Prisma } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PaymentConfirmModal } from "../payment-confirm-modal";
import Link from "next/link";
import { notifyStaffCancellation, notifyStaffFullCancellation } from "../../_actions/notify-staff-cancellation";
import { CancelConfirmModal } from "../cancel-confirm-modal";
import { updateIsOpen } from "@/actions/restaurant";
import { FaMapMarkedAlt } from "react-icons/fa";
import NextLink from "next/link";

type Props = {
  order: Prisma.OrderGetPayload<{
    include: { meal: { include: { restaurant: { include: { googleMapPlaceInfo: { select: { url: true } } } } } } };
  }>;
};

export function OrderPage({ order }: Props) {
  const router = useRouter();
  const { isOpen: isConfirmModalOpen, onOpen: onConfirmModalOpen, onClose: onConfirmModalClose } = useDisclosure();
  const { isOpen: isCancelModalOpen, onOpen: onCancelModalOpen, onClose: onCancelModalClose } = useDisclosure();
  const [isPaying, setIsPaying] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const handlePaymentConfirm = () => {
    setIsPaying(true);
    capturePaymentIntent(order.id).then((paymentStatus) => {
      if (paymentStatus === "succeeded") {
        router.refresh();
      } else {
        console.error("Failed to capture payment intent");
      }
    });
  };

  const handleCancelConfirm = (isFull: boolean) => {
    setIsCancelling(true);
    cancelPaymentIntent(order.id).then((paymentStatus) => {
      if (paymentStatus === "canceled") {
        if (isFull) {
          updateIsOpen({ id: order.meal.restaurant.id, isOpen: false }).then(() => {
            notifyStaffFullCancellation({ orderId: order.id });
          });
        } else {
          notifyStaffCancellation({ orderId: order.id });
        }
        router.push("/");
        router.refresh();
      } else {
        console.error("Failed to cancel payment intent");
      }
    });
  };

  switch (order.status) {
    case "PREAUTHORIZED":
      return (
        <>
          <VStack alignItems="start" spacing={8} p={4}>
            <VStack alignItems="start" spacing={4}>
              <Heading>注文を確定</Heading>
              <Text>
                注文番号:
                <Heading as="span" ml={2}>
                  {order.orderNumber}
                </Heading>
              </Text>
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
                  入店後お店の人に「Wattでの注文で」と伝え、こちらの画面を見せて決済を確定してください
                </AlertDescription>
              </Alert>
              <VStack w="full">
                <Button
                  size="md"
                  w="full"
                  maxW="full"
                  onClick={onConfirmModalOpen}
                  isDisabled={isPaying || isCancelling}
                >
                  決済を確定する
                </Button>
                <Button
                  size="md"
                  colorScheme="gray"
                  w="full"
                  maxW="full"
                  onClick={onCancelModalOpen}
                  isDisabled={isPaying || isCancelling}
                >
                  キャンセル
                </Button>
              </VStack>
            </VStack>
            <VStack alignItems="start" spacing={4} w="full">
              <Heading>注文情報</Heading>
              <VStack alignItems="start">
                <Heading size="md">店舗</Heading>
                <Heading size="sm">{order.meal.restaurant.name}</Heading>
                {order.meal.restaurant.googleMapPlaceInfo && (
                  <Button
                    w="full"
                    leftIcon={<Icon as={FaMapMarkedAlt} />}
                    as={NextLink}
                    href={order.meal.restaurant.googleMapPlaceInfo.url}
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
                    src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}&q=place_id:${order.meal.restaurant.googleMapPlaceId}`}
                  />
                </Box>
              </VStack>
              <Divider borderColor="black" />
              <VStack alignItems="start" w="full">
                <Heading size="md">注文商品</Heading>
                <Heading size="sm">{order.meal.title}</Heading>
                <Image
                  w="50vw"
                  src={order.meal.imageUrl}
                  alt={`meal-${order.meal.id}`}
                  objectFit="cover"
                  aspectRatio={1 / 1}
                />
                <Box borderWidth="1px" w="full" p={1}>
                  <Text fontSize="xs" whiteSpace="pre-wrap">
                    {order.meal.description}
                  </Text>
                </Box>
              </VStack>
              <Divider borderColor="black" />
              <VStack alignItems="start" w="full">
                <Heading size="md">金額</Heading>
                <Flex w="full">
                  <Text>{order.meal.title}</Text>
                  <Spacer />
                  <Text
                    as="p"
                    fontSize="sm"
                    textDecoration="line-through"
                    textDecorationColor="red.400"
                    textDecorationThickness="2px"
                    mr={1}
                  >
                    ¥{order.restaurantProfitPrice.toLocaleString("ja-JP")}
                  </Text>
                  <VStack spacing="0" display="inline-flex">
                    <Text color="red.400" as="b">
                      ¥{order.price.toLocaleString("ja-JP")}
                    </Text>
                    <Box backgroundColor="red.400" borderRadius={4}>
                      <Text color="white" fontWeight="bold" fontSize="xs" px={2}>
                        早期割引
                      </Text>
                    </Box>
                  </VStack>
                </Flex>
                <Divider />
                <Heading size="sm" alignSelf="self-end">
                  合計 ¥{order.price.toLocaleString("ja-JP")}
                </Heading>
              </VStack>
            </VStack>
          </VStack>
          <PaymentConfirmModal
            isOpen={isConfirmModalOpen}
            isConfirming={isPaying}
            onClose={onConfirmModalClose}
            onConfirm={handlePaymentConfirm}
          />
          <CancelConfirmModal
            isOpen={isCancelModalOpen}
            isCancelling={isCancelling}
            onClose={onCancelModalClose}
            onConfirm={handleCancelConfirm}
          />
          <Modal isOpen={isPaying} onClose={() => undefined} size="xs" isCentered>
            <ModalOverlay />
            <ModalContent>
              <ModalBody textAlign="center">
                <Spinner />
                <Text>決済中...</Text>
              </ModalBody>
            </ModalContent>
          </Modal>
          <Modal isOpen={isCancelling} onClose={() => undefined} size="xs" isCentered>
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
    case "CANCELLED":
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
            <Heading size="sm">{order.meal.restaurant.name}</Heading>
          </VStack>
          <VStack alignItems="start" w="full">
            <Heading size="md">注文商品</Heading>
            <Image
              w="50vw"
              src={order.meal.imageUrl}
              alt={`meal-${order.meal.id}`}
              objectFit="cover"
              aspectRatio={1 / 1}
            />
            <Box borderWidth="1px" w="full" p={1}>
              <Text fontSize="xs" whiteSpace="pre-wrap">
                {order.meal.description}
              </Text>
            </Box>
          </VStack>
          <VStack alignItems="start">
            <Heading size="md">金額</Heading>
            <Heading size="sm">
              合計{" "}
              <Text
                as="span"
                fontSize="sm"
                fontWeight="normal"
                textDecoration="line-through"
                textDecorationColor="red.400"
                textDecorationThickness="2px"
                mr={1}
              >
                ¥{order.restaurantProfitPrice.toLocaleString("ja-JP")}
              </Text>
              <HStack spacing={1} display="inline-flex">
                <Text color="red.400" as="b">
                  ¥{order.price.toLocaleString("ja-JP")}
                </Text>
                <Box backgroundColor="red.400" borderRadius={4}>
                  <Text color="white" fontWeight="bold" fontSize="xs" px={2}>
                    早期割引
                  </Text>
                </Box>
              </HStack>
            </Heading>
          </VStack>
          <Button variant="outline" size="md" colorScheme="gray" w="full" maxW="full" as={Link} href="/">
            ホーム画面に戻る
          </Button>
        </VStack>
      );
    case "COMPLETE":
      return (
        <VStack alignItems="start" p={4} spacing={4}>
          <Heading>決済完了</Heading>
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
            <Heading size="sm">{order.meal.restaurant.name}</Heading>
          </VStack>
          <VStack alignItems="start" w="full">
            <Heading size="md">注文商品</Heading>
            <Image
              w="50vw"
              src={order.meal.imageUrl}
              alt={`meal-${order.meal.id}`}
              objectFit="cover"
              aspectRatio={1 / 1}
            />
            <Box borderWidth="1px" w="full" p={1}>
              <Text fontSize="xs" whiteSpace="pre-wrap">
                {order.meal.description}
              </Text>
            </Box>
          </VStack>
          <VStack alignItems="start">
            <Heading size="md">金額</Heading>
            <Heading size="sm">
              合計{" "}
              <Text
                as="span"
                fontSize="sm"
                fontWeight="normal"
                textDecoration="line-through"
                textDecorationColor="red.400"
                textDecorationThickness="2px"
                mr={1}
              >
                ¥{order.restaurantProfitPrice.toLocaleString("ja-JP")}
              </Text>
              <HStack spacing={1} display="inline-flex">
                <Text color="red.400" as="b">
                  ¥{order.price.toLocaleString("ja-JP")}
                </Text>
                <Box backgroundColor="red.400" borderRadius={4}>
                  <Text color="white" fontWeight="bold" fontSize="xs" px={2}>
                    早期割引
                  </Text>
                </Box>
              </HStack>
            </Heading>
          </VStack>
          <Button variant="outline" size="md" colorScheme="gray" w="full" maxW="full" as={Link} href="/">
            ホーム画面に戻る
          </Button>
        </VStack>
      );
    default:
      throw new Error("Invalid payment status");
  }
}
