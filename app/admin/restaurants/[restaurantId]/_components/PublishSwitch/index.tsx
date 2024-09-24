"use client";

import { updateRestaurantPublishment } from "@/actions/mutations/restaurant";
import { logger } from "@/utils/logger";
import { CopyIcon } from "@chakra-ui/icons";
import { Button, Flex, FormControl, FormLabel, Switch, useToast } from "@chakra-ui/react";
import { useState } from "react";

type Props = {
  restaurantId: string;
  defaultIsPublished: boolean;
};

export function PublishSwitch({ restaurantId, defaultIsPublished }: Props) {
  const [isPublished, setIsPublished] = useState(defaultIsPublished);
  const toast = useToast();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateRestaurantPublishment({ id: restaurantId, isPublished: event.target.checked })
      .then((restaurant) => {
        setIsPublished(restaurant.isPublished);
        toast({
          title: "公開状態を更新しました",
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

  const handleCopyRestaurantUrlClick = () => {
    navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_HOST_URL}/?selectedRestaurantId=${restaurantId}`);
    toast({
      title: "URLをコピーしました",
      status: "success",
      duration: 9000,
      isClosable: true
    });
  };

  return (
    <Flex>
      <FormControl display="flex" alignItems="center">
        <Switch id="publish-switch" isChecked={isPublished} onChange={handleChange} />
        <FormLabel htmlFor="publish-switch" ml={2} mb={0}>
          {isPublished ? "公開中" : "非公開"}
        </FormLabel>
      </FormControl>
      <Button leftIcon={<CopyIcon />} onClick={handleCopyRestaurantUrlClick} minW="fit-content">
        お店のURL
      </Button>
    </Flex>
  );
}
