"use client";

import { Heading, Divider, Text, Flex, Spacer } from "@chakra-ui/react";
import { MealPrice } from "../MealPrice";
import { Prisma } from "@prisma/client";

type Props = {
  firstPersonMeal: Prisma.MealGetPayload<{ include: { items: true } }>;
  secondPersonMeal?: Prisma.MealGetPayload<{ include: { items: true } }>;
};

export function PriceSection({ firstPersonMeal, secondPersonMeal }: Props) {
  return (
    <>
      <Heading size="lg">ご注文内容の確認</Heading>
      <MealPrice meal={firstPersonMeal} titlePrefix={secondPersonMeal ? "1人目: " : undefined} />
      {secondPersonMeal && <MealPrice meal={secondPersonMeal} titlePrefix="2人目: " />}
      <Divider borderColor="blackAlpha.400" />
      <Flex w="full">
        <Spacer />
        <Text as="p" fontSize="lg" fontWeight="bold">
          <Text as="span" mr="2">
            合計金額
          </Text>
          <Text as="span">¥{(firstPersonMeal.price + (secondPersonMeal?.price ?? 0)).toLocaleString("ja-JP")}</Text>
        </Text>
      </Flex>
    </>
  );
}
