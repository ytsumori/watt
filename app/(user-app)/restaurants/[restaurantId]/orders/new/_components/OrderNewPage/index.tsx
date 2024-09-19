"use client";

import NextLink from "next/link";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import {
  useDisclosure,
  VStack,
  Divider,
  Box,
  Heading,
  Alert,
  AlertIcon,
  Select,
  Text,
  Button,
  Flex,
  HStack,
  IconButton
} from "@chakra-ui/react";
import { Meal, Prisma } from "@prisma/client";
import { ConfirmModal } from "@/components/confirm-modal";
import { ComponentProps, FC, useMemo, useState } from "react";
import { visitRestaurant } from "./actions/visit-restaurant";
import { useRouter } from "next-nprogress-bar";
import { HeaderSection } from "@/app/(user-app)/_components/HeaderSection";
import { MealPreviewImage } from "@/components/meal/MealPreviewImage";
import { MealDetailModal } from "@/app/(user-app)/_components/RestaurantHalfModalBody/components/MealDetailModal";
import { MealPrice } from "@/app/(user-app)/_components/MealDetailPage/_components/MealPrice";
import { sendGAEvent } from "@next/third-parties/google";

type Props = {
  restaurant: Prisma.RestaurantGetPayload<{
    include: {
      meals: {
        where: { isInactive: false; outdatedAt: null };
        orderBy: { price: "asc" };
        include: { items: true };
      };
      googleMapPlaceInfo: { select: { url: true } };
      paymentOptions: true;
      menuImages: { orderBy: { menuNumber: "asc" } };
    };
  }>;
  inProgressOrderId?: string;
  userId?: string;
};

export const OrderNewPage: FC<Props> = ({ restaurant, inProgressOrderId, userId }) => {
  const router = useRouter();
  const [isVisitRequesting, setIsVisitRequesting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<{ title: string; description: string }>();
  const {
    isOpen: isVisitConfirmModalOpen,
    onOpen: onVisitConfirmModalOpen,
    onClose: onVisitConfirmModalClose
  } = useDisclosure();
  const [peopleCount, setPeopleCount] = useState<1 | 2>();
  const [currentOrders, setCurrentOrders] = useState<{ meal: Meal; quantity: number }[]>([]);
  const [selectedMealDetail, setSelectedMealDetail] = useState<ComponentProps<typeof MealDetailModal>["meal"]>();
  const isValid = useMemo(() => peopleCount !== undefined, [peopleCount]);
  const totalPrice = useMemo(
    () => currentOrders.reduce((acc, meal) => acc + meal.meal.price * meal.quantity, 0),
    [currentOrders]
  );

  if (!restaurant.isAvailable) {
    return (
      <Alert status="warning" borderRadius={4}>
        <AlertIcon />
        現在こちらのお店は入店できません
      </Alert>
    );
  }

  if (inProgressOrderId) {
    return (
      <Alert status="warning" as={NextLink} href={`/orders/${inProgressOrderId}`}>
        <AlertIcon />
        現在空き状況確認中です
      </Alert>
    );
  }

  const handlePeopleCountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const convertedValue = Number(e.target.value);
    if (convertedValue === 1 || convertedValue === 2) {
      setPeopleCount(convertedValue);
    } else {
      setPeopleCount(undefined);
    }
  };

  const handleVisitingClick = async () => {
    if (!userId) return;

    onVisitConfirmModalOpen();
  };

  const handleVisitingConfirm = async () => {
    if (!userId || !peopleCount) return;

    setIsVisitRequesting(true);

    sendGAEvent("event", "order");

    try {
      const { data, error } = await visitRestaurant({
        userId,
        restaurantId: restaurant.id,
        mealOrders: currentOrders.map((currentOrder) => {
          return { mealId: currentOrder.meal.id, quantity: currentOrder.quantity };
        }),
        peopleCount
      });

      if (error) {
        setIsVisitRequesting(false);
        onVisitConfirmModalClose();
        setErrorMessage({
          title: "お店の空き情報が変更されました",
          description: "お店の空き情報が変更されました。"
        });
        return;
      }

      router.push(`/orders/${data.id}`);
    } catch (e) {
      setIsVisitRequesting(false);
      onVisitConfirmModalClose();
      setErrorMessage({
        title: "エラー",
        description: "エラーが発生しました。もう一度お試しください。"
      });
    }
  };

  return (
    <>
      <Flex w="full" flexDir="column" justifyContent="space-between" maxH="full" minH="full" position="relative">
        <Box w="full">
          <Box w="full" position="sticky" top={0} bgColor="white">
            <HeaderSection title="来店情報を入力する" />
          </Box>
          <VStack w="full" spacing={4} alignItems="start" p={4}>
            <VStack>
              <Heading size="md">来店人数を選択</Heading>
              <Select value={peopleCount} onChange={handlePeopleCountChange} placeholder="人数を選択">
                <option value="1">1人</option>
                <option value="2">2人</option>
              </Select>
            </VStack>
            {peopleCount !== undefined && (
              <>
                <VStack w="full" alignItems="start">
                  <Box>
                    <Heading size="md">Watt限定セットを選択</Heading>
                    <Text fontSize="xs">店内で注文する場合はこちらのセットはご注文いただけません</Text>
                  </Box>
                  <VStack w="full">
                    {restaurant.meals.map((meal) => {
                      const currentCount = currentOrders.find((order) => order.meal.id === meal.id)?.quantity ?? 0;
                      return (
                        <Flex key={meal.id} w="full" gap={2}>
                          <MealPreviewImage src={meal.imagePath} alt={`meal-${meal.id}`} />
                          <Flex flexDir="column" w="full" justifyContent="space-between" py={2}>
                            <Flex w="full" justifyContent="space-between">
                              <Heading size="sm">{meal.title}</Heading>
                              <Button variant="outline" onClick={() => setSelectedMealDetail(meal)} ml={1}>
                                詳細
                              </Button>
                            </Flex>
                            <Flex justifyContent="space-between" alignItems="end" w="full">
                              <MealPrice meal={meal} />
                              <HStack>
                                <IconButton
                                  aria-label="decrement meal"
                                  icon={<MinusIcon />}
                                  variant="outline"
                                  isRound
                                  isDisabled={currentCount === 0}
                                  onClick={() => {
                                    const index = currentOrders.findIndex((order) => order.meal.id === meal.id);
                                    if (index === -1) return;
                                    const newOrders = [...currentOrders];
                                    if (newOrders[index].quantity === 1) {
                                      newOrders.splice(index, 1);
                                    } else {
                                      newOrders[index] = {
                                        ...newOrders[index],
                                        quantity: newOrders[index].quantity - 1
                                      };
                                    }
                                    setCurrentOrders(newOrders);
                                  }}
                                />
                                <Text>{currentCount}</Text>
                                <IconButton
                                  aria-label="increment meal"
                                  icon={<AddIcon />}
                                  variant="outline"
                                  isRound
                                  isDisabled={
                                    currentOrders.find((order) => order.meal.id === meal.id)?.quantity === peopleCount
                                  }
                                  onClick={() => {
                                    const index = currentOrders.findIndex((order) => order.meal.id === meal.id);
                                    if (index === -1) {
                                      setCurrentOrders([...currentOrders, { meal, quantity: 1 }]);
                                    } else {
                                      const newOrders = [...currentOrders];
                                      newOrders[index] = {
                                        ...newOrders[index],
                                        quantity: newOrders[index].quantity + 1
                                      };
                                      setCurrentOrders(newOrders);
                                    }
                                  }}
                                />
                              </HStack>
                            </Flex>
                          </Flex>
                        </Flex>
                      );
                    })}
                  </VStack>
                  {totalPrice > 0 && (
                    <>
                      <Divider borderColor="black" my={2} />
                      <Heading size="sm">
                        <Text as="span" mr="2">
                          合計
                        </Text>
                        <Heading as="span" size="lg">
                          {currentOrders
                            .reduce((acc, meal) => acc + meal.meal.price * meal.quantity, 0)
                            .toLocaleString("ja-JP")}
                        </Heading>
                        円
                      </Heading>
                    </>
                  )}
                </VStack>
              </>
            )}
          </VStack>
        </Box>
        <Box
          w="full"
          bgColor="white"
          position="sticky"
          bottom={0}
          boxShadow="0 -4px 15px 0px rgba(0, 0, 0, 0.2)"
          px={4}
          py={2}
        >
          <Text fontSize="xs">
            この内容でWattが自動的にお店の空き状況を確認します。
            <br />
            空き状況が確認後30分以内にお店に向かってください。
          </Text>
          <Button
            isLoading={isVisitRequesting}
            onClick={handleVisitingClick}
            w="full"
            maxW="full"
            size="md"
            isDisabled={!isValid}
            mt={1}
          >
            この内容でお店の空き状況を確認する
          </Button>
          {!isValid && (
            <Text fontSize="xs" color="red.400">
              空き状況を確認するには人数の選択が必要です
            </Text>
          )}
        </Box>
      </Flex>
      <ConfirmModal
        isOpen={isVisitConfirmModalOpen}
        onClose={onVisitConfirmModalClose}
        title="こちらの内容でよろしいですか？"
        confirmButton={{
          label: "お店の空き状況を確認する",
          onClick: handleVisitingConfirm,
          isLoading: isVisitRequesting
        }}
        cancelButton={{
          label: "キャンセル",
          isDisabled: isVisitRequesting
        }}
      >
        空き状況を確認し、
        <br />
        5分以内にSMSでお知らせします。
        <br />
        <br />
        確認後30分以内にお店に向かってください。
      </ConfirmModal>
      <ConfirmModal
        isOpen={errorMessage !== undefined}
        title={errorMessage?.title ?? ""}
        confirmButton={{
          label: "OK",
          onClick: () => {
            setErrorMessage(undefined);
            router.refresh();
          }
        }}
        onClose={() => undefined}
      >
        {errorMessage?.description ?? ""}
      </ConfirmModal>
      {selectedMealDetail && (
        <MealDetailModal isOpen onClose={() => setSelectedMealDetail(undefined)} meal={selectedMealDetail} />
      )}
    </>
  );
};
