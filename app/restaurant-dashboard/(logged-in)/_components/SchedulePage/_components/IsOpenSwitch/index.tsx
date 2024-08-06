"use client";

import { updateRestaurantStatus } from "@/actions/mutations/restaurant";
import { FormControl, FormHelperText, FormLabel, HStack, Switch, useToast } from "@chakra-ui/react";
import { ChangeEvent } from "react";

type Props = {
  restaurantId: string;
  isRestaurantOpen: boolean;
  onChange: (isOpen: boolean) => void;
};

export function IsOpenSwitch({ restaurantId, isRestaurantOpen, onChange }: Props) {
  const toast = useToast();
  const handleOpenStatusChange = (event: ChangeEvent<HTMLInputElement>) => {
    const isOpen = event.target.checked;
    updateRestaurantStatus({ id: restaurantId, status: isOpen ? "OPEN" : "CLOSED" })
      .then(() => {
        onChange(isOpen);
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
        <Switch onChange={handleOpenStatusChange} isChecked={isRestaurantOpen} />
      </HStack>
      <FormHelperText>お客さんを案内できない場合はオフにしてください</FormHelperText>
    </FormControl>
  );
}
