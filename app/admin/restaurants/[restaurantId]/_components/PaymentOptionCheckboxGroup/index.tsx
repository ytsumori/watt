"use client";

import { Checkbox, CheckboxGroup, HStack, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { PaymentOption } from "@prisma/client";
import { translatePaymentOption } from "@/lib/prisma/translate-enum";
import { updatePaymentOptions } from "./action";

type Props = {
  restaurantId: string;
  defaultPaymentOptions: PaymentOption[];
};

export function PaymentOptionCheckboxGroup({ restaurantId, defaultPaymentOptions }: Props) {
  const toast = useToast();
  const [paymentOptions, setPaymentOptions] = useState<PaymentOption[]>(defaultPaymentOptions);

  const handlePaymentOptionChange = (options: PaymentOption[]) => {
    updatePaymentOptions({ restaurantId, options })
      .then((restaurant) => {
        toast({ title: "決済方法を更新しました", status: "success", duration: 3000 });
        setPaymentOptions(restaurant.paymentOptions.map((option) => option.option));
      })
      .catch(() => {
        toast({ title: "決済方法の更新に失敗しました", status: "error", duration: 3000 });
      });
  };

  return (
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
  );
}
