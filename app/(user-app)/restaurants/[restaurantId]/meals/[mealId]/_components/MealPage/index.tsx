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
  HStack,
  Select,
  Center
} from "@chakra-ui/react";
import { useState } from "react";
import { Order, Prisma } from "@prisma/client";
import { signIn } from "next-auth/react";
import { CheckIcon } from "@chakra-ui/icons";
import { useRouter } from "next/navigation";
import NextLink from "next/link";
import Image from "next/image";
import { ConfirmModal } from "@/components/confirm-modal";
import { MealPreviewBox } from "@/components/meal/MealPreviewBox";
import { visitRestaurant } from "../../_actions/visit-restaurant";
import { RestaurantInfo } from "../../../../_components/RestaurantInfo";

type Props = {
  meal: Prisma.MealGetPayload<{
    include: {
      restaurant: { include: { meals: true; googleMapPlaceInfo: { select: { url: true } }; paymentOptions: true } };
      items: true;
    };
  }>;
  isRestaurantActive: boolean;
  preauthorizedOrder?: Order;
  userId?: string;
};

const NO_ORDER = "NO ORDER";

export default function MealPage({ meal, isRestaurantActive, preauthorizedOrder, userId }: Props) {
  const router = useRouter();
  const [isVisitRequesting, setIsVisitRequesting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<{ title: string; description: string }>();
  const {
    isOpen: isVisitConfirmModalOpen,
    onOpen: onVisitConfirmModalOpen,
    onClose: onVisitConfirmModalClose
  } = useDisclosure();
  const [peopleCount, setPeopleCount] = useState<"1" | "2">("1");
  const [secondPersonOrder, setSecondPersonOrder] = useState<string>();

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
        {peopleCount === "2" && <Heading size="sm">1人目の注文</Heading>}
        <HStack overflowX="auto" maxW="full" className="hidden-scrollbar">
          {meal.restaurant.meals.map((currentMeal) => (
            <MealPreviewBox
              key={currentMeal.id}
              meal={currentMeal}
              href={currentMeal.id}
              borderWidth={meal.id === currentMeal.id ? 4 : 0}
              borderColor="brand.400"
              isLabelHidden={meal.id === currentMeal.id}
            >
              {meal.id === currentMeal.id && (
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
            </MealPreviewBox>
          ))}
        </HStack>
        <Box w="full">
          <Heading size="md">{meal.title}</Heading>
          <Heading size="md">¥{meal.price.toLocaleString("ja-JP")}</Heading>
          <Text fontSize="sm" whiteSpace="pre-wrap" mt={2}>
            {meal.description}
          </Text>
        </Box>
        <Divider borderColor="black" />
        <Heading size="md">セット内容</Heading>
        <VStack alignItems="start" spacing={1} w="full">
          {meal.items.map((item) => (
            <Box key={item.id}>
              <Text fontSize="md" as="b">
                {item.title}
              </Text>
              <Text whiteSpace="pre-wrap" fontSize="xs" color="blackAlpha.700">
                {item.description}
              </Text>
            </Box>
          ))}
        </VStack>
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
                    <Heading size="md">来店人数を選択</Heading>
                    <Select value={peopleCount} onChange={(e) => setPeopleCount(e.target.value as "1" | "2")}>
                      <option value="1">1人</option>
                      <option value="2">2人</option>
                    </Select>
                    <Divider borderColor="black" />
                    {peopleCount === "2" && (
                      <>
                        <Heading size="sm">2人目の注文</Heading>
                        <HStack overflowX="auto" maxW="full" className="hidden-scrollbar">
                          {meal.restaurant.meals.map((currentMeal) => (
                            <MealPreviewBox
                              key={currentMeal.id}
                              meal={currentMeal}
                              onClick={() => setSecondPersonOrder(currentMeal.id)}
                              borderWidth={secondPersonOrder === currentMeal.id ? 4 : 0}
                              borderColor="brand.400"
                            >
                              {secondPersonOrder === currentMeal.id && (
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
                            </MealPreviewBox>
                          ))}
                          <Center
                            minW="150px"
                            w="150px"
                            h="150px"
                            borderRadius={12}
                            position="relative"
                            borderWidth={secondPersonOrder === NO_ORDER ? 4 : 0}
                            borderColor="brand.400"
                            backgroundColor="gray.100"
                            onClick={() => setSecondPersonOrder(NO_ORDER)}
                          >
                            <Text fontSize="xs" color="brand.400">
                              1人目の注文をシェアする
                            </Text>
                            {secondPersonOrder === NO_ORDER && (
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
                        </HStack>
                        <Divider borderColor="black" />
                      </>
                    )}
                    <Heading size="md">ご注文内容の確認</Heading>
                    <VStack w="full">
                      <Flex w="full">
                        <Text>{meal.title}</Text>
                      </Flex>
                      <Box width="full">
                        {meal.items.map((item) => (
                          <Flex w="full" alignItems="flex-start" fontSize="sm" key={item.id}>
                            <Text>{item.title}</Text>
                            <Spacer />
                            <Text>¥{item.price.toLocaleString("ja-JP")}</Text>
                          </Flex>
                        ))}
                      </Box>
                    </VStack>
                    <Divider borderColor="blackAlpha.400" />
                    <Box w="full">
                      <Flex>
                        <Spacer />
                        <Text as="p" fontSize="sm">
                          <Text as="span" mr="2">
                            単品合計価格
                          </Text>
                          <Text as="span" textDecorationLine="line-through">
                            ¥{meal.items.reduce((acc, item) => acc + item.price, 0).toLocaleString("ja-JP")}
                          </Text>
                        </Text>
                      </Flex>
                      <Flex fontWeight="bold" textColor="brand.400" mt={1}>
                        <Spacer />
                        <HStack spacing={0} mr={2}>
                          <Image src="/watt-logo.png" alt="Watt" width={40} height={31} />
                          <Text fontSize="sm" as="span" ml={1}>
                            価格
                          </Text>
                        </HStack>
                        <Text as="span">¥{meal.price.toLocaleString("ja-JP")}</Text>
                      </Flex>
                    </Box>
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
