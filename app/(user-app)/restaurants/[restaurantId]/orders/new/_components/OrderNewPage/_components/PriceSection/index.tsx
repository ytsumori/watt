"use client";

import { Heading, Divider, Text, Flex, Spacer } from "@chakra-ui/react";
import { MealPrice } from "../MealPrice";
import { MealWithItems } from "../../types/MealWithItems";

type Props = {
  firstPersonMeal: MealWithItems;
  firstSelectedOptions: (string | null)[];
  secondPersonMeal?: MealWithItems;
  secondSelectedOptions?: (string | null)[];
  isDiscounted: boolean;
};

export function PriceSection({
  firstPersonMeal,
  firstSelectedOptions,
  secondPersonMeal,
  secondSelectedOptions,
  isDiscounted
}: Props) {
  const firstMealExtraPrice = firstPersonMeal.items.reduce((acc, item, itemIndex) => {
    const selectedOption = item.options.find((option) => option.id === firstSelectedOptions[itemIndex]);
    return acc + (selectedOption?.extraPrice ?? 0);
  }, 0);
  const firstMealPrice = isDiscounted
    ? firstPersonMeal.price + firstMealExtraPrice
    : firstPersonMeal.listPrice! + firstMealExtraPrice;
  let secondMealPrice: number = 0;
  if (secondPersonMeal && secondSelectedOptions) {
    const secondMealExtraPrice = secondPersonMeal.items.reduce((acc, item, itemIndex) => {
      const selectedOption = item.options.find((option) => option.id === secondSelectedOptions[itemIndex]);
      return acc + (selectedOption?.extraPrice ?? 0);
    }, 0);
    secondMealPrice = isDiscounted
      ? secondPersonMeal.price + secondMealExtraPrice
      : secondPersonMeal.listPrice! + secondMealExtraPrice;
  }
  return (
    <>
      <Heading size="sm">ご注文内容の確認</Heading>
      <MealPrice
        meal={firstPersonMeal}
        titlePrefix={secondPersonMeal ? "1人目: " : undefined}
        selectedOptions={firstSelectedOptions}
        isDiscounted={isDiscounted}
      />
      {secondPersonMeal && secondSelectedOptions && (
        <MealPrice
          meal={secondPersonMeal}
          titlePrefix="2人目: "
          selectedOptions={secondSelectedOptions}
          isDiscounted={isDiscounted}
        />
      )}
      <Divider borderColor="blackAlpha.400" />
      <Flex w="full">
        <Spacer />
        <Text as="p" fontSize="lg" fontWeight="bold">
          <Text as="span" mr="2">
            合計金額
          </Text>
          <Text as="span">{(firstMealPrice + secondMealPrice).toLocaleString("ja-JP")}円</Text>
        </Text>
      </Flex>
    </>
  );
}
