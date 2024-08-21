"use client";

import NextLink from "next/link";
import { CheckIcon, ChevronLeftIcon } from "@chakra-ui/icons";
import {
  useDisclosure,
  VStack,
  Divider,
  Box,
  Heading,
  Alert,
  AlertIcon,
  Select,
  Center,
  Text,
  Button,
  Flex,
  Icon,
  IconButton
} from "@chakra-ui/react";
import { Prisma } from "@prisma/client";
import { ConfirmModal } from "@/components/confirm-modal";
import { FC, useState } from "react";
import { PriceSection } from "./_components/PriceSection";
import { MealWithItems } from "./types/MealWithItems";
import { visitRestaurant } from "./actions/visit-restaurant";
import { MealCarousel } from "./_components/MealCarousel";
import { MealInfo } from "./_components/MealInfo";
import { useRouter } from "next-nprogress-bar";
import { HeaderSection } from "@/app/(user-app)/_components/HeaderSection";

type Props = {
  restaurant: Prisma.RestaurantGetPayload<{
    include: {
      meals: {
        where: { isInactive: false; outdatedAt: null };
        orderBy: { price: "asc" };
        include: { items: { include: { options: true } } };
      };
      googleMapPlaceInfo: { select: { url: true } };
      paymentOptions: true;
      menuImages: { orderBy: { menuNumber: "asc" } };
    };
  }>;
  inProgressOrderId?: string;
  userId?: string;
  defaultMeal?: Prisma.MealGetPayload<{ include: { items: { include: { options: true } } } }>;
};

export const OrderNewPage: FC<Props> = ({ restaurant, inProgressOrderId, userId, defaultMeal }) => {
  const router = useRouter();
  const [isVisitRequesting, setIsVisitRequesting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<{ title: string; description: string }>();
  const {
    isOpen: isVisitConfirmModalOpen,
    onOpen: onVisitConfirmModalOpen,
    onClose: onVisitConfirmModalClose
  } = useDisclosure();
  const [peopleCount, setPeopleCount] = useState<1 | 2>();
  const [firstPersonMeal, setFirstPersonMeal] = useState<MealWithItems | undefined>(defaultMeal);
  const [firstMealSelectedOptions, setFirstMealSelectedOptions] = useState<(string | null)[]>(
    defaultMeal ? new Array(defaultMeal.items.length).fill(null) : []
  );
  const [secondPersonMeal, setSecondPersonMeal] = useState<MealWithItems | null>();
  const [secondMealSelectedOptions, setSecondMealSelectedOptions] = useState<(string | null)[]>([]);
  const isDiscounted = restaurant.status === "OPEN";

  if (restaurant.status === "CLOSED") {
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
        既にお店に向かっているの注文があります
      </Alert>
    );
  }

  const isValid =
    firstPersonMeal !== undefined &&
    firstPersonMeal.items.every((item, index) => item.options.length === 0 || !!firstMealSelectedOptions.at(index)) &&
    (peopleCount === 1 ||
      (peopleCount === 2 &&
        secondPersonMeal !== undefined &&
        (secondPersonMeal === null ||
          secondPersonMeal.items.every(
            (item, index) => item.options.length === 0 || !!secondMealSelectedOptions.at(index)
          ))));

  const handlePeopleCountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const convertedValue = Number(e.target.value);
    switch (convertedValue) {
      case 2:
        setPeopleCount(2);
        break;
      case 1:
        setSecondPersonMeal(undefined);
        setSecondMealSelectedOptions([]);
        setPeopleCount(1);
        break;
      default:
        setPeopleCount(undefined);
        setSecondPersonMeal(undefined);
        setSecondMealSelectedOptions([]);
        setFirstPersonMeal(undefined);
    }
  };

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
    if (secondMealSelectedOptions === undefined) return;
    const newOptions = [...secondMealSelectedOptions];
    newOptions[index] = value;
    setSecondMealSelectedOptions(newOptions);
  };

  const handleVisitingClick = async () => {
    if (!userId) return;

    onVisitConfirmModalOpen();
  };

  const handleVisitingConfirm = async () => {
    if (!userId || !firstPersonMeal || !peopleCount) return;

    setIsVisitRequesting(true);

    try {
      const { data, error } = await visitRestaurant({
        userId,
        restaurantId: restaurant.id,
        firstMealId: firstPersonMeal.id,
        firstOptionIds: firstMealSelectedOptions,
        secondMealId: secondPersonMeal?.id,
        secondOptionIds: secondMealSelectedOptions,
        peopleCount,
        isDiscounted
      });

      if (error) {
        setIsVisitRequesting(false);
        onVisitConfirmModalClose();
        setErrorMessage({
          title: "お店のステータスが更新されました",
          description: "お店のステータスが更新され、価格が変わりました。もう一度お試しください。"
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
      <HeaderSection title="セットメニューを注文する" />
      <VStack w="full" p={4} alignItems="start" spacing={4}>
        <Heading size="md">来店人数を選択</Heading>
        <Select value={peopleCount} onChange={handlePeopleCountChange} placeholder="人数を選択">
          <option value="1">1人</option>
          <option value="2">2人</option>
        </Select>
        {peopleCount !== undefined && (
          <>
            <Box>
              <Heading size="md">メニューを選択</Heading>
              <Text fontSize="xs">食べたいセットを選択してください</Text>
            </Box>
            {peopleCount === 2 && <Heading size="sm">1人目の注文</Heading>}
            <MealCarousel
              meals={restaurant.meals}
              selectedMealId={firstPersonMeal?.id}
              onSelectMeal={handleFirstMealSelected}
            />
            {firstPersonMeal && (
              <MealInfo
                meal={firstPersonMeal}
                selectedOptions={firstMealSelectedOptions}
                onOptionChange={handleFirstMealOptionChange}
                isDiscounted={isDiscounted}
              />
            )}
            {peopleCount === 2 && (
              <>
                <Heading size="sm">2人目の注文</Heading>
                <MealCarousel
                  meals={restaurant.meals}
                  selectedMealId={secondPersonMeal?.id}
                  onSelectMeal={handleSecondMealSelected}
                  additionalBox={
                    <Center
                      minW="130px"
                      w="130px"
                      h="130px"
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
                {secondPersonMeal && (
                  <MealInfo
                    meal={secondPersonMeal}
                    selectedOptions={secondMealSelectedOptions}
                    onOptionChange={handleSecondMealOptionChange}
                    isDiscounted={isDiscounted}
                  />
                )}
              </>
            )}
            {firstPersonMeal && (
              <>
                <Divider borderColor="black" my={6} />
                <PriceSection
                  firstPersonMeal={firstPersonMeal}
                  firstSelectedOptions={firstMealSelectedOptions}
                  secondPersonMeal={secondPersonMeal ?? undefined}
                  secondSelectedOptions={secondMealSelectedOptions}
                  isDiscounted={isDiscounted}
                />
                <Divider borderColor="black" my={6} />
                <Box>
                  <Text fontSize="xs">お店に到着後に次の画面で注文を確定するまで、調理は開始されません。</Text>
                  <Button
                    isLoading={isVisitRequesting}
                    onClick={handleVisitingClick}
                    w="full"
                    maxW="full"
                    size="md"
                    isDisabled={!isValid}
                    mt={1}
                  >
                    お店に向かう
                  </Button>
                  {!isValid && (
                    <Text fontSize="xs" color="red.400">
                      選択が必要な箇所が残っています。
                    </Text>
                  )}
                </Box>
              </>
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
        5分以内にお店の空席状況を確認します。
        <br />
        空席状況が確認でき次第お店に向かってください。
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
};
