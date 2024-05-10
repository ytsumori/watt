"use client";

import { Heading, VStack, Select, useToast, CheckboxGroup, Checkbox, HStack } from "@chakra-ui/react";
import { PaymentOption, Prisma, SmokingOption } from "@prisma/client";

import { MealList } from "@/components/meal/MealList";
import { RestaurantBankAccount } from "./restaurant-bank-account";
import { translatePaymentOption, translateSmokingOption } from "@/lib/prisma/translate-enum";
import { updateSmokingOptions } from "../_actions/updateSmokingOption";
import { useState } from "react";
import { updatePaymentOptions } from "../_actions/updatePaymentOptions";

type Props = {
  restaurant: Prisma.RestaurantGetPayload<{
    select: { id: true; name: true; bankAccount: true; meals: true; smokingOption: true; paymentOptions: true };
  }>;
};

export function RestaurantDetailPage({ restaurant }: Props) {
  const [smokingOption, setSmokingOption] = useState<SmokingOption | undefined>(restaurant.smokingOption ?? undefined);
  const [paymentOptions, setPaymentOptions] = useState<PaymentOption[]>(
    restaurant.paymentOptions.map((option) => option.option)
  );
  const toast = useToast();
  const handleSmokingOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const option = event.target.value as SmokingOption;
    updateSmokingOptions({ restaurantId: restaurant.id, option }).then((restaurant) => {
      toast({ title: "喫煙情報を更新しました", status: "success", duration: 3000 });
      setSmokingOption(restaurant.smokingOption ?? undefined);
    });
  };
  const handlePaymentOptionChange = (options: PaymentOption[]) => {
    updatePaymentOptions({ restaurantId: restaurant.id, options }).then((restaurant) => {
      toast({ title: "決済方法を更新しました", status: "success", duration: 3000 });
      setPaymentOptions(restaurant.paymentOptions.map((option) => option.option));
    });
  };
  return (
    <VStack p={10} alignItems="start" spacing={5}>
      <Heading as="h1" size="lg">
        {restaurant.name}
      </Heading>
      {restaurant.bankAccount && <RestaurantBankAccount restaurantBankAccount={restaurant.bankAccount} />}
      <VStack alignItems="start">
        <Heading size="md">喫煙情報</Heading>
        <Select placeholder="喫煙情報を選択してください" value={smokingOption} onChange={handleSmokingOptionChange}>
          {Object.values(SmokingOption).map((option) => {
            return (
              <option key={option} value={option}>
                {translateSmokingOption(option as SmokingOption)}
              </option>
            );
          })}
        </Select>
      </VStack>
      <VStack alignItems="start">
        <Heading size="md">決済方法</Heading>
        <CheckboxGroup value={paymentOptions} onChange={handlePaymentOptionChange}>
          <HStack>
            {Object.values(PaymentOption).map((option) => {
              return (
                <Checkbox key={option} value={option}>
                  {translatePaymentOption(option as PaymentOption)}
                </Checkbox>
              );
            })}
          </HStack>
        </CheckboxGroup>
      </VStack>
      <MealList restaurantId={restaurant.id} defaultMeals={restaurant.meals} />
    </VStack>
  );
}
