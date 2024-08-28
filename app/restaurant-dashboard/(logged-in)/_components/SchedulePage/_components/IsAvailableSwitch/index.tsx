"use client";

import { updateRestaurantAvailability } from "@/actions/mutations/restaurant";
import { FormControl, FormHelperText, FormLabel, HStack, Switch, useToast } from "@chakra-ui/react";
import { ChangeEvent } from "react";

type Props = {
  restaurantId: string;
  isRestaurantAvailable: boolean;
  onChange: (isOpen: boolean) => void;
};

export function IsAvailableSwitch({ restaurantId, isRestaurantAvailable, onChange }: Props) {
  const toast = useToast();
  const handleOpenStatusChange = (event: ChangeEvent<HTMLInputElement>) => {
    const isAvailable = event.target.checked;
    updateRestaurantAvailability({ id: restaurantId, isAvailable: isAvailable, isInAdvance: true })
      .then(() => {
        onChange(isAvailable);
      })
      .catch(() =>
        toast({
          title: "エラー",
          description: "入店可否ステータスの変更に失敗しました",
          status: "error",
          isClosable: true
        })
      );
  };

  return (
    <FormControl>
      <HStack>
        <FormLabel mb={0}>現在入店可能</FormLabel>
        <Switch onChange={handleOpenStatusChange} isChecked={isRestaurantAvailable} />
      </HStack>
      <FormHelperText>お客さんを案内できない場合はオフにしてください</FormHelperText>
    </FormControl>
  );
}
