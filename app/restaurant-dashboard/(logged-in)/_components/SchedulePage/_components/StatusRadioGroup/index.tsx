"use client";

import { HStack, Heading, Text, VStack, useRadioGroup, useToast } from "@chakra-ui/react";
import { updateIsOpen } from "@/actions/mutations/restaurant";
import { createFullStatus } from "@/actions/mutations/restaurant-full-status";
import { StatusRadioButton } from "../StatusRadioButton";
import { RestaurantStatus } from "../../type";

type Props = {
  restaurantId: string;
  status: RestaurantStatus;
};

const STATUS_OPTIONS: { value: RestaurantStatus; label: string }[] = [
  { value: "open", label: "空席あり\n(入店可)" },
  { value: "full", label: "混雑中\n(入店可)" },
  { value: "close", label: "入店不可" }
];

export function StatusRadioGroup({ restaurantId, status }: Props) {
  const toast = useToast();

  const handleStatusChange = (value: string) => {
    const update = (() => {
      switch (value) {
        case "open":
          return async () => await updateIsOpen({ id: restaurantId, isOpen: true });
        case "full":
          return async () => await createFullStatus({ restaurantId });
        case "close":
          return async () => await updateIsOpen({ id: restaurantId, isOpen: false });
        default:
          throw new Error("Invalid status");
      }
    })();
    update()
      .then(() => {
        setStatus(value);
      })
      .catch(() =>
        toast({
          title: "エラー",
          description: "入店ステータスの変更に失敗しました",
          status: "error",
          isClosable: true
        })
      );
  };
  const {
    getRootProps,
    getRadioProps,
    setValue: setStatus
  } = useRadioGroup({ onChange: handleStatusChange, defaultValue: status });
  const group = getRootProps();

  return (
    <VStack alignItems="start">
      <Heading size="md">入店ステータス</Heading>
      <Text fontSize="xs">お店の状況に応じて変更してください</Text>
      <HStack {...group} alignItems="start">
        {STATUS_OPTIONS.map((option) => {
          const radio = getRadioProps({ value: option.value });
          return (
            <StatusRadioButton key={option.value} {...radio}>
              {option.label}
            </StatusRadioButton>
          );
        })}
      </HStack>
    </VStack>
  );
}
