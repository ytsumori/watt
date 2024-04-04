"use client";

import {
  Button,
  Heading,
  VStack,
  Alert,
  AlertIcon,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Divider,
  Text,
  Flex,
  Spacer,
  Box,
  Td,
  useDisclosure,
  Icon,
  HStack,
} from "@chakra-ui/react";
import { useState } from "react";
import Stripe from "stripe";
import { Order, Prisma } from "@prisma/client";
import { createPaymentIntent } from "@/actions/payment-intent";
import { signIn } from "next-auth/react";
import { CheckCircleIcon, CheckIcon } from "@chakra-ui/icons";
import { useRouter, usePathname } from "next/navigation";
import { notifyStaffOrder } from "../../_actions/notify-staff-order";
import { findPreauthorizedOrder } from "@/actions/order";
import { applyEarlyDiscount } from "@/utils/discount-price";
import NextLink from "next/link";
import { ConfirmModal } from "@/components/confirm-modal";
import { FaMapMarkedAlt } from "react-icons/fa";
import { MealPreviewBox } from "@/components/meal-preview";

type Props = {
  meal: Prisma.MealGetPayload<{
    include: { restaurant: { include: { meals: true; googleMapPlaceInfo: { select: { url: true } } } } };
  }>;
  paymentMethods: Stripe.PaymentMethod[];
  isRestaurantActive: boolean;
  preauthorizedOrder?: Order;
  userId?: string;
};

export default function MealPage({ meal, paymentMethods, isRestaurantActive, preauthorizedOrder, userId }: Props) {
  const router = useRouter();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | undefined>(
    paymentMethods.length === 1 ? paymentMethods[0].id : undefined
  );
  const [isVisitRequesting, setIsVisitRequesting] = useState(false);
  const {
    isOpen: isVisitConfirmModalOpen,
    onOpen: onVisitConfirmModalOpen,
    onClose: onVisitConfirmModalClose,
  } = useDisclosure();
  const pathname = usePathname();

  const handleVisitingClick = async () => {
    if (!userId || !selectedPaymentMethod) return;

    onVisitConfirmModalOpen();
  };

  const handleVisitingConfirm = async () => {
    if (!userId || !selectedPaymentMethod) return;

    setIsVisitRequesting(true);

    createPaymentIntent({
      mealId: meal.id,
      userId,
      paymentMethodId: selectedPaymentMethod,
    }).then((status) => {
      if (status === "requires_capture") {
        findPreauthorizedOrder(userId).then((order) => {
          if (order) {
            notifyStaffOrder({ restaurantId: meal.restaurantId, orderId: order.id });
            router.push(`/orders/${order.id}`);
          }
        });
      } else {
        console.error("status", status);
        console.error("Failed to create payment intent");
      }
    });
  };

  return (
    <VStack w="full" p={4} alignItems="start" spacing={4}>
      <Heading size="lg">{meal.restaurant.name}</Heading>
      {meal.restaurant.googleMapPlaceInfo && (
        <Button
          w="full"
          leftIcon={<Icon as={FaMapMarkedAlt} />}
          as={NextLink}
          href={meal.restaurant.googleMapPlaceInfo.url}
          target="_blank"
        >
          Googleマップでお店情報を見る
        </Button>
      )}
      <Box h="20vh" w="full">
        <iframe
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}&q=place_id:${meal.restaurant.googleMapPlaceId}`}
        />
      </Box>
      <Divider borderColor="black" />
      <Box>
        <Heading size="md">推しメシ</Heading>
        <Text fontSize="xs">食べたい推しメシを選択してください</Text>
      </Box>
      <HStack overflowX="auto" maxW="full" className="hidden-scrollbar">
        <MealPreviewBox key={meal.id} meal={meal} href={`/meals/${meal.id}`} borderWidth={4} borderColor="orange.400">
          <CheckIcon
            position="absolute"
            top={0}
            right={0}
            backgroundColor="orange.400"
            color="white"
            boxSize={6}
            borderRadius={6}
            m={1}
            p={1}
            aria-label="checked"
          />
        </MealPreviewBox>
        {meal.restaurant.meals.map((currentMeal) => (
          <MealPreviewBox key={currentMeal.id} meal={currentMeal} href={`/meals/${currentMeal.id}`} />
        ))}
      </HStack>
      <Box borderWidth="1px" w="full" p={1}>
        <Text fontSize="xs" whiteSpace="pre-wrap">
          {meal.description}
        </Text>
      </Box>
      <VStack alignItems="baseline" spacing={4} w="full">
        {isRestaurantActive ? (
          preauthorizedOrder ? (
            <Alert status="warning" as={NextLink} href={`/orders/${preauthorizedOrder.id}`}>
              <AlertIcon />
              既に選択済みの推しメシがあります
            </Alert>
          ) : (
            <>
              <Divider borderColor="black" />
              {userId ? (
                <>
                  <Box>
                    <Heading size="md" minW="full">
                      支払い方法
                    </Heading>
                    <Text fontSize="xs">お支払い方法を選択してください</Text>
                  </Box>
                  <TableContainer minW="full">
                    <Table variant="simple" size="sm" __css={{ th: { paddingX: 0 }, td: { paddingX: 0 } }} w="full">
                      <Thead>
                        <Tr>
                          <Th></Th>
                          <Th>ブランド</Th>
                          <Th>カード番号</Th>
                          <Th>有効期限</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {paymentMethods.map((paymentMethod) => (
                          <Tr key={paymentMethod.id} onClick={() => setSelectedPaymentMethod(paymentMethod.id)}>
                            <Td>
                              {selectedPaymentMethod === paymentMethod.id && (
                                <CheckCircleIcon color="orange.400" boxSize={5} />
                              )}
                            </Td>
                            <Td>{paymentMethod.card?.brand}</Td>
                            <Td>**** **** **** {paymentMethod.card?.last4}</Td>
                            <Td>
                              {paymentMethod.card?.exp_month}/{paymentMethod.card?.exp_year}
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                  <Button variant="outline" as={NextLink} href={`/payment-methods/new?redirect_pathname=${pathname}`}>
                    決済方法を登録
                  </Button>
                  <Divider borderColor="black" />
                  <Heading size="md">ご注文内容の確認</Heading>
                  <Flex w="full">
                    <Text>{meal.title}</Text>
                    <Spacer />
                    <Text
                      as="p"
                      fontSize="sm"
                      textDecoration="line-through"
                      textDecorationColor="red.400"
                      textDecorationThickness="2px"
                      mr={1}
                    >
                      ¥{meal.price.toLocaleString("ja-JP")}
                    </Text>
                    <VStack spacing="0" display="inline-flex">
                      <Text color="red.400" as="b">
                        ¥{applyEarlyDiscount(meal.price).toLocaleString("ja-JP")}
                      </Text>
                      <Box backgroundColor="red.400" borderRadius={4}>
                        <Text color="white" fontWeight="bold" fontSize="xs" px={2} as="p">
                          早期割引
                        </Text>
                      </Box>
                    </VStack>
                  </Flex>
                  <Divider />
                  <Heading size="sm" alignSelf="self-end">
                    合計 ¥{applyEarlyDiscount(meal.price).toLocaleString("ja-JP")}
                  </Heading>
                  <Divider borderColor="black" />
                  <Text fontSize="xs">
                    注文内容を確定します。次の画面でお店に到着後に決済を確定するまで、調理は開始されずお支払いも発生しません。
                  </Text>
                  <Button
                    isLoading={isVisitRequesting}
                    onClick={handleVisitingClick}
                    w="full"
                    maxW="full"
                    isDisabled={selectedPaymentMethod === undefined}
                    size="md"
                  >
                    お店に向かう
                  </Button>
                </>
              ) : (
                <>
                  <Heading size="md">ログインして食事に進む</Heading>
                  <Alert borderRadius={4}>
                    <AlertIcon />
                    以下からLINEでログインすることでお食事に進めます
                  </Alert>
                  <Button onClick={() => signIn()} w="full" maxW="full">
                    ログインする
                  </Button>
                </>
              )}
            </>
          )
        ) : (
          <Alert status="warning" borderRadius={4}>
            <AlertIcon />
            現在こちらのお店は入店できません
          </Alert>
        )}
        <ConfirmModal
          isOpen={isVisitConfirmModalOpen}
          onClose={onVisitConfirmModalClose}
          title="お店に向かいますか？"
          confirmButton={{
            label: "お店に向かう",
            onClick: handleVisitingConfirm,
            isLoading: isVisitRequesting,
          }}
          cancelButton={{
            label: "キャンセル",
          }}
        >
          向かっていることをお店に通知します。
          <br />
          <br />
          次の画面でお店に到着後に決済を確定するまで、調理は開始されずお支払いも発生しません。
        </ConfirmModal>
      </VStack>
    </VStack>
  );
}
