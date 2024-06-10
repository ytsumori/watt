"use client";

import {
  Button,
  Heading,
  VStack,
  Alert,
  AlertIcon,
  Divider,
  Text,
  Box,
  useDisclosure,
  Select,
  Center
} from "@chakra-ui/react";
import { Prisma } from "@prisma/client";
import { RestaurantInfo } from "../RestaurantInfo";
import { useState } from "react";
import { CheckIcon } from "@chakra-ui/icons";
import { signIn } from "next-auth/react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { MealInfo } from "../MealInfo";
import { MealCarousel } from "../MealCarousel";
import { PriceSection } from "../PriceSection";
import { VisitingSection } from "../VisitingSection";
import { ConfirmModal } from "@/components/confirm-modal";
import { visitRestaurant } from "../../_actions/visit-restaurant";
import { MealWithItems } from "../../_types/MealWithItems";

type Props = {
  restaurant: Prisma.RestaurantGetPayload<{
    include: {
      meals: { include: { items: { include: { options: true } } } };
      googleMapPlaceInfo: { select: { url: true } };
      paymentOptions: true;
    };
  }>;
  inProgressOrderId?: string;
  userId?: string;
  defaultMeal?: MealWithItems;
};

export function RestaurantPage({ restaurant, inProgressOrderId, userId, defaultMeal }: Props) {
  const router = useRouter();
  const [isVisitRequesting, setIsVisitRequesting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<{ title: string; description: string }>();
  const {
    isOpen: isVisitConfirmModalOpen,
    onOpen: onVisitConfirmModalOpen,
    onClose: onVisitConfirmModalClose
  } = useDisclosure();
  const [peopleCount, setPeopleCount] = useState<1 | 2>(1);
  const [firstPersonMeal, setFirstPersonMeal] = useState<MealWithItems | undefined>(defaultMeal);
  const [firstMealSelectedOptions, setFirstMealSelectedOptions] = useState<(string | null)[]>(
    defaultMeal ? new Array(defaultMeal.items.length).fill(null) : []
  );
  const [secondPersonMeal, setSecondPersonMeal] = useState<MealWithItems | null>();
  const [secondMealSelectedOptions, setSecondMealSelectedOptions] = useState<(string | null)[]>([]);

  const handleFirstMealSelected = (selectedMeal: MealWithItems) => {
    setFirstMealSelectedOptions(new Array(selectedMeal.items.length).fill(null));
    setFirstPersonMeal(selectedMeal);
  };

  const handleSecondMealSelected = (selectedMeal: MealWithItems) => {
    setSecondMealSelectedOptions(new Array(selectedMeal.items.length).fill(null));
    setSecondPersonMeal(selectedMeal);
  };

  const handleFirstMealOptionChange = (index: number, value: string) => {
    const newOptions = [...firstMealSelectedOptions];
    newOptions[index] = value;
    setFirstMealSelectedOptions(newOptions);
  };

  const handleSecondMealOptionChange = (index: number, value: string) => {
    const newOptions = [...secondMealSelectedOptions];
    newOptions[index] = value;
    setSecondMealSelectedOptions(newOptions);
  };

  const handleVisitingClick = async () => {
    if (!userId) return;

    onVisitConfirmModalOpen();
  };

  const handleVisitingConfirm = async () => {
    if (!userId || !firstPersonMeal) return;

    setIsVisitRequesting(true);

    visitRestaurant({
      userId,
      restaurantId: restaurant.id,
      firstMealId: firstPersonMeal.id,
      secondMealId: secondPersonMeal?.id,
      peopleCount
    })
      .then((order) => {
        router.push(`/orders/${order.id}`);
      })
      .catch(() => {
        setIsVisitRequesting(false);
        setErrorMessage({
          title: "エラー",
          description: "エラーが発生しました。もう一度お試しください。"
        });
      });
  };

  return (
    <>
      <VStack w="full" p={4} alignItems="start" spacing={4}>
        <RestaurantInfo restaurant={restaurant} />
        <Divider borderColor="black" my={6} />
        <Box>
          <Heading size="lg">メニューを選択</Heading>
          <Text fontSize="xs">食べたいセットを選択してください</Text>
        </Box>
        {peopleCount === 2 && <Heading size="md">1人目の注文を選択</Heading>}
        <MealCarousel
          meals={restaurant.meals}
          selectedMealId={firstPersonMeal?.id}
          onSelectMeal={handleFirstMealSelected}
        />
        {firstPersonMeal && (
          <>
            <MealInfo
              meal={firstPersonMeal}
              selectedOptions={firstMealSelectedOptions}
              onOptionChange={handleFirstMealOptionChange}
            />
            {restaurant.isOpen ? (
              inProgressOrderId ? (
                <Alert status="warning" as={NextLink} href={`/orders/${inProgressOrderId}`}>
                  <AlertIcon />
                  既にお店に向かっているの注文があります
                </Alert>
              ) : (
                <>
                  {userId ? (
                    firstPersonMeal.items.every(
                      (item, index) => item.options.length === 0 || firstMealSelectedOptions[index] !== null
                    ) ? (
                      <>
                        <Divider borderColor="blackAlpha.400" />
                        <Heading size="md">来店人数を選択</Heading>
                        <Select
                          value={peopleCount}
                          onChange={(e) => {
                            const convertedValue = Number(e.target.value);
                            switch (convertedValue) {
                              case 2:
                                setPeopleCount(2);
                                break;
                              case 1:
                                setSecondPersonMeal(undefined);
                                setPeopleCount(1);
                                break;
                            }
                          }}
                        >
                          <option value="1">1人</option>
                          <option value="2">2人</option>
                        </Select>
                        {peopleCount === 1 ? (
                          <>
                            <Divider borderColor="black" my={6} />
                            <PriceSection
                              firstPersonMeal={firstPersonMeal}
                              firstSelectedOptions={firstMealSelectedOptions}
                            />
                            <VisitingSection isLoading={isVisitRequesting} onClick={handleVisitingClick} />
                          </>
                        ) : (
                          <>
                            <Divider borderColor="blackAlpha.400" />
                            <Heading size="md">2人目の注文を選択</Heading>
                            <MealCarousel
                              meals={restaurant.meals}
                              selectedMealId={secondPersonMeal?.id}
                              onSelectMeal={handleSecondMealSelected}
                              additionalBox={
                                <Center
                                  minW="150px"
                                  w="150px"
                                  h="150px"
                                  borderRadius={12}
                                  position="relative"
                                  borderWidth={secondPersonMeal === null ? 4 : 0}
                                  borderColor="brand.400"
                                  backgroundColor="gray.100"
                                  onClick={() => setSecondPersonMeal(null)}
                                >
                                  <Text fontSize="sm" as="b" color="brand.400">
                                    1人目の注文を
                                    <br />
                                    シェアする
                                  </Text>
                                  {secondPersonMeal === null && (
                                    <CheckIcon
                                      position="absolute"
                                      top={0}
                                      right={0}
                                      backgroundColor="brand.400"
                                      color="white"
                                      boxSize={6}
                                      borderRadius={6}
                                      m={1}
                                      p={1}
                                      aria-label="checked"
                                    />
                                  )}
                                </Center>
                              }
                            />
                            {secondPersonMeal !== undefined ? (
                              <>
                                {secondPersonMeal !== null ? (
                                  <>
                                    <MealInfo
                                      meal={secondPersonMeal}
                                      selectedOptions={secondMealSelectedOptions}
                                      onOptionChange={handleSecondMealOptionChange}
                                    />
                                    {secondPersonMeal.items.every(
                                      (item, index) =>
                                        item.options.length === 0 || secondMealSelectedOptions[index] !== null
                                    ) ? (
                                      <>
                                        <Divider borderColor="black" my={6} />
                                        <PriceSection
                                          firstPersonMeal={firstPersonMeal}
                                          firstSelectedOptions={firstMealSelectedOptions}
                                          secondPersonMeal={secondPersonMeal ?? undefined}
                                          secondSelectedOptions={secondMealSelectedOptions}
                                        />
                                        <VisitingSection isLoading={isVisitRequesting} onClick={handleVisitingClick} />
                                      </>
                                    ) : (
                                      <Box h="80px" />
                                    )}
                                  </>
                                ) : (
                                  <>
                                    <PriceSection
                                      firstPersonMeal={firstPersonMeal}
                                      firstSelectedOptions={firstMealSelectedOptions}
                                    />
                                    <VisitingSection isLoading={isVisitRequesting} onClick={handleVisitingClick} />
                                  </>
                                )}
                              </>
                            ) : (
                              <Box h="80px" />
                            )}
                          </>
                        )}
                      </>
                    ) : (
                      <Box h="80px" />
                    )
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
          </>
        )}
      </VStack>
      <ConfirmModal
        isOpen={isVisitConfirmModalOpen}
        onClose={onVisitConfirmModalClose}
        title="お店に向かいますか？"
        confirmButton={{
          label: "お店に向かう",
          onClick: handleVisitingConfirm,
          isLoading: isVisitRequesting
        }}
        cancelButton={{
          label: "キャンセル",
          isDisabled: isVisitRequesting
        }}
      >
        向かっていることをお店に通知します。30分以内にお店に向かってください。
        <br />
        注文を確定するまで調理は開始されません。
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
    </>
  );
}
