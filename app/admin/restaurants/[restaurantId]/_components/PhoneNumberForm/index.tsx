"use client";

import { formatPhoneNumber, isValidPhoneNumberInput } from "@/utils/phone-number";
import { Button, HStack, Input, InputGroup, InputLeftAddon, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { updatePhoneNumber } from "./action";

type Props = {
  restaurantId: string;
  defaultPhoneNumber: string | null;
};

export function PhoneNumberForm({ restaurantId, defaultPhoneNumber }: Props) {
  const toast = useToast();
  const [phoneNumber, setPhoneNumber] = useState<string>(defaultPhoneNumber ?? "");

  const handlePhoneNumberSubmit = () => {
    if (isValidPhoneNumberInput(phoneNumber)) {
      const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
      updatePhoneNumber({ restaurantId, phoneNumber: formattedPhoneNumber })
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
    <HStack>
      <InputGroup>
        <InputLeftAddon>+81</InputLeftAddon>
        <Input type="tel" placeholder="電話番号" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
      </InputGroup>
      <Button
        isDisabled={!isValidPhoneNumberInput(phoneNumber) || defaultPhoneNumber === phoneNumber}
        onClick={handlePhoneNumberSubmit}
      >
        保存する
      </Button>
    </HStack>
  );
}
