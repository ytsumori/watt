"use client";

import {
  Heading,
  VStack,
  Select,
  useToast,
  CheckboxGroup,
  Checkbox,
  HStack,
  Input,
  InputGroup,
  InputLeftAddon,
  Button,
  Text
} from "@chakra-ui/react";
import { PaymentOption, Prisma, SmokingOption } from "@prisma/client";
import { MealList } from "@/components/meal/MealList";
import { RestaurantBankAccount } from "./restaurant-bank-account";
import { translatePaymentOption, translateSmokingOption } from "@/lib/prisma/translate-enum";
import { useState } from "react";
import { formatPhoneNumber, isValidPhoneNumberInput } from "@/utils/phone-number";
import { updatePhoneNumber } from "../_actions/update-phone-number";
import { updatePaymentOptions } from "../_actions/update-payment-options";
import { updateSmokingOptions } from "../_actions/update-smoking-option";

type Props = {
  restaurant: Prisma.RestaurantGetPayload<{
    select: {
      id: true;
      name: true;
      bankAccount: true;
      meals: true;
      smokingOption: true;
      paymentOptions: true;
      phoneNumber: true;
    };
  }>;
};

export function RestaurantDetailPage({ restaurant }: Props) {
  const [smokingOption, setSmokingOption] = useState<SmokingOption | undefined>(restaurant.smokingOption ?? undefined);
  const [paymentOptions, setPaymentOptions] = useState<PaymentOption[]>(
    restaurant.paymentOptions.map((option) => option.option)
  );
  const [phoneNumber, setPhoneNumber] = useState<string>(restaurant.phoneNumber ?? "");
  const toast = useToast();

  const handleSmokingOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const option = event.target.value as SmokingOption;
    updateSmokingOptions({ restaurantId: restaurant.id, option })
      .then((restaurant) => {
        toast({ title: "喫煙情報を更新しました", status: "success", duration: 3000 });
        setSmokingOption(restaurant.smokingOption ?? undefined);
      })
      .catch(() => {
        toast({ title: "喫煙情報の更新に失敗しました", status: "error", duration: 3000 });
      });
  };

  const handlePaymentOptionChange = (options: PaymentOption[]) => {
    updatePaymentOptions({ restaurantId: restaurant.id, options })
      .then((restaurant) => {
        toast({ title: "決済方法を更新しました", status: "success", duration: 3000 });
        setPaymentOptions(restaurant.paymentOptions.map((option) => option.option));
      })
      .catch(() => {
        toast({ title: "決済方法の更新に失敗しました", status: "error", duration: 3000 });
      });
  };

  const handlePhoneNumberSubmit = () => {
    if (isValidPhoneNumberInput(phoneNumber)) {
      const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
      updatePhoneNumber({ restaurantId: restaurant.id, phoneNumber: formattedPhoneNumber })
        .then((restaurant) => {
          toast({ title: "電話番号を更新しました", status: "success", duration: 3000 });
          setPhoneNumber(restaurant.phoneNumber ?? "");
        })
        .catch(() => {
          toast({ title: "電話番号の更新に失敗しました", status: "error", duration: 3000 });
        });
    }
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
      <VStack alignItems="start">
        <Heading size="md">電話番号</Heading>
        <Text fontSize="xs">数字のみで入力してください</Text>
        <HStack>
          <InputGroup>
            <InputLeftAddon>+81</InputLeftAddon>
            <Input
              type="tel"
              placeholder="電話番号"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </InputGroup>
          <Button
            isDisabled={!isValidPhoneNumberInput(phoneNumber) || restaurant.phoneNumber === phoneNumber}
            onClick={handlePhoneNumberSubmit}
          >
            保存する
          </Button>
        </HStack>
      </VStack>
      <MealList restaurantId={restaurant.id} defaultMeals={restaurant.meals} />
    </VStack>
  );
}
