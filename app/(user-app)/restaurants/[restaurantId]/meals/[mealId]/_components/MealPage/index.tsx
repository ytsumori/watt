"use client";

import {
  Button,
  Heading,
  VStack,
  Alert,
  AlertIcon,
  Divider,
  Text,
  Flex,
  Spacer,
  Box,
  useDisclosure,
  HStack
} from "@chakra-ui/react";
import { useState } from "react";
import { Order, Prisma } from "@prisma/client";
import { signIn } from "next-auth/react";
import { CheckIcon } from "@chakra-ui/icons";
import { useRouter } from "next/navigation";
import NextLink from "next/link";
import { ConfirmModal } from "@/components/confirm-modal";
import { MealPreviewBox } from "@/components/meal/MealPreviewBox";
import { visitRestaurant } from "../../_actions/visit-restaurant";
import { RestaurantInfo } from "../../../../_components/RestaurantInfo";

type Props = {
  meal: Prisma.MealGetPayload<{
    include: {
      restaurant: { include: { meals: true; googleMapPlaceInfo: { select: { url: true } }; paymentOptions: true } };
    };
  }>;
  isRestaurantActive: boolean;
  preauthorizedOrder?: Order;
  userId?: string;
};

export default function MealPage({ meal, isRestaurantActive, preauthorizedOrder, userId }: Props) {
  const router = useRouter();
  const [isVisitRequesting, setIsVisitRequesting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<{ title: string; description: string }>();
  const {
    isOpen: isVisitConfirmModalOpen,
    onOpen: onVisitConfirmModalOpen,
    onClose: onVisitConfirmModalClose
  } = useDisclosure();

  const handleVisitingClick = async () => {
    if (!userId) return;

    onVisitConfirmModalOpen();
  };

  const handleVisitingConfirm = async () => {
    if (!userId) return;

    setIsVisitRequesting(true);

    visitRestaurant({ mealId: meal.id, userId })
      .then((order) => {
        router.push(`/orders/${order.id}`);
      })
      .catch(() => {
        setErrorMessage({
          title: "エラー",
          description: "エラーが発生しました。もう一度お試しください。"
        });
      });
  };

  return (
    <>
      <VStack w="full" p={4} alignItems="start" spacing={4}>
        <RestaurantInfo restaurant={meal.restaurant} />
        <Divider borderColor="black" />
        <Box>
          <Heading size="md">推しメシ</Heading>
          <Text fontSize="xs">食べたい推しメシを選択してください</Text>
        </Box>
        <HStack overflowX="auto" maxW="full" className="hidden-scrollbar">
          <MealPreviewBox key={meal.id} meal={meal} borderWidth={4} borderColor="orange.400">
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
            <MealPreviewBox key={currentMeal.id} meal={currentMeal} href={`${currentMeal.id}`} />
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
                    <Heading size="md">ご注文内容の確認</Heading>
                    <Flex w="full">
                      <Text>{meal.title}</Text>
                      <Spacer />
                      <Text as="p" fontSize="sm" fontWeight="bold" mr={1}>
                        ¥{meal.price.toLocaleString("ja-JP")}
                      </Text>
                    </Flex>
                    <Divider />
                    <Heading size="sm" alignSelf="self-end">
                      合計 ¥{meal.price.toLocaleString("ja-JP")}
                    </Heading>
                    <Divider borderColor="black" />
                    <Text fontSize="xs">
                      お店に到着後に次の画面で注文を確定するまで、調理は開始されません。
                      <br />
                      30分以内にお店に向かってください。
                    </Text>
                    <Button isLoading={isVisitRequesting} onClick={handleVisitingClick} w="full" maxW="full" size="md">
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
        </VStack>
      </VStack>
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
}
