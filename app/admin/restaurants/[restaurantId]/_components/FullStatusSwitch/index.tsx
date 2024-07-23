"use client";

import { updateRestaurantFullStatusAvailability } from "@/actions/mutations/restaurant";
import { logger } from "@/utils/logger";
import { Switch, useToast } from "@chakra-ui/react";
import { useState } from "react";

type Props = {
  restaurantId: string;
  defaultIsFullStatusAvailable: boolean;
};

export function FullStatusSwitch({ restaurantId, defaultIsFullStatusAvailable }: Props) {
  const [isFullStatusAvailable, setIsFullStatusAvailable] = useState(defaultIsFullStatusAvailable);
  const toast = useToast();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateRestaurantFullStatusAvailability({ id: restaurantId, isFullStatusAvailable: event.target.checked })
      .then((restaurant) => {
        setIsFullStatusAvailable(restaurant.isFullStatusAvailable);
        toast({
          title: `混雑設定を${restaurant.isFullStatusAvailable ? "有効" : "無効"}にしました`,
          status: "success",
          duration: 9000,
          isClosable: true
        });
      })
      .catch((e) => {
        logger({
          severity: "ERROR",
          message: "公開状態の更新に失敗しました",
          payload: { error: JSON.stringify(e) }
        });
        toast({
          title: "エラーが発生しました",
          status: "error",
          duration: 9000,
          isClosable: true
        });
      });
  };

  return <Switch isChecked={isFullStatusAvailable} onChange={handleChange} />;
}
