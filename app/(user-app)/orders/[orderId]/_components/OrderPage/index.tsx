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
  Image,
  Spacer,
  Text,
  VStack,
  useDisclosure
} from "@chakra-ui/react";
import { Prisma } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CompleteConfirmModal } from "../payment-confirm-modal";
import { CancelConfirmModal } from "../cancel-confirm-modal";
import { FaMapMarkedAlt } from "react-icons/fa";
import NextLink from "next/link";
import { ConfirmModal } from "@/components/confirm-modal";
import { cancelOrder } from "../../_actions/cancel-order";
import { transformSupabaseImage } from "@/utils/image/transformSupabaseImage";
import { completeOrder } from "../../_actions/complete-order";

type Props = {
  order: Prisma.OrderGetPayload<{
    include: { meal: { include: { restaurant: { include: { googleMapPlaceInfo: { select: { url: true } } } } } } };
  }>;
};

export function OrderPage({ order }: Props) {
  const router = useRouter();
  const { isOpen: isCompleteModalOpen, onOpen: onCompleteModalOpen, onClose: onCompleteModalClose } = useDisclosure();
  const { isOpen: isCancelModalOpen, onOpen: onCancelModalOpen, onClose: onCancelModalClose } = useDisclosure();
  const [isConfirming, setIsConfirming] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [errorMessage, setErrorMessage] = useState<{ title: string; description: string }>();
  const publicUrl = transformSupabaseImage("meals", order.meal.imagePath);

  const handleCompleteConfirm = () => {
    setIsConfirming(true);
    completeOrder(order.id).then(() => {
      setIsConfirming(false);
      router.refresh();
    });
  };

  const handleCancelConfirm = (isFull: boolean) => {
    setIsCancelling(true);

    cancelOrder({ orderId: order.id, restaurantId: order.meal.restaurant.id, isFull })
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

  switch (order.status) {
    case "PREORDERED":
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
                  入店後お店の人に「Wattでの注文で」と伝え、こちらの画面を見せて注文を確定してください
                </AlertDescription>
              </Alert>
              <VStack w="full">
                <Button
                  size="md"
                  w="full"
                  maxW="full"
                  onClick={onCompleteModalOpen}
                  isDisabled={isConfirming || isCancelling}
                >
                  注文を確定する
                </Button>
                <Button
                  size="md"
                  colorScheme="gray"
                  w="full"
                  maxW="full"
                  onClick={onCancelModalOpen}
                  isDisabled={isConfirming || isCancelling}
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
                <Image w="50vw" src={publicUrl} alt={`meal-${order.meal.id}`} objectFit="cover" aspectRatio={1 / 1} />
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
                  <Text as="p" fontWeight="bold">
                    ¥{order.meal.price.toLocaleString("ja-JP")}
                  </Text>
                </Flex>
                <Divider />
                <Heading size="sm" alignSelf="self-end">
                  合計 ¥{order.meal.price.toLocaleString("ja-JP")}
                </Heading>
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
            <Image w="50vw" src={publicUrl} alt={`meal-${order.meal.id}`} objectFit="cover" aspectRatio={1 / 1} />
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
              <Text as="span" fontWeight="bold">
                ¥{order.meal.price.toLocaleString("ja-JP")}
              </Text>
            </Heading>
          </VStack>
          <Button variant="outline" size="md" colorScheme="gray" w="full" maxW="full" as={NextLink} href="/">
            ホーム画面に戻る
          </Button>
        </VStack>
      );
    case "COMPLETE":
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
            <AlertDescription>お食事をお楽しみください</AlertDescription>
          </Alert>
          <VStack w="full">
            <Button
              as={NextLink}
              size="md"
              w="full"
              maxW="full"
              href={`/orders/${order.id}/payments/new`}
              isDisabled={isConfirming || isCancelling}
            >
              Watt上で支払う
            </Button>
            <Button
              size="md"
              colorScheme="gray"
              w="full"
              maxW="full"
              onClick={onCancelModalOpen}
              isDisabled={isConfirming || isCancelling}
            >
              お店で支払う
            </Button>
          </VStack>
          <Heading>注文情報</Heading>
          <VStack alignItems="start">
            <Heading size="md">店舗</Heading>
            <Heading size="sm">{order.meal.restaurant.name}</Heading>
          </VStack>
          <VStack alignItems="start" w="full">
            <Heading size="md">注文商品</Heading>
            <Image w="50vw" src={publicUrl} alt={`meal-${order.meal.id}`} objectFit="cover" aspectRatio={1 / 1} />
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
              <Text as="span" fontWeight="bold">
                ¥{order.meal.price.toLocaleString("ja-JP")}
              </Text>
            </Heading>
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
