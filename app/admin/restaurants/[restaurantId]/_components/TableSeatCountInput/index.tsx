"use client";
import { updateRestaurantTableSeatCount } from "@/actions/mutations/restaurant";
import { Button, HStack, Input, InputGroup, Text, useToast, VStack } from "@chakra-ui/react";
import { useState } from "react";

type Props = { restaurantId: string; tableSeatCount: number | null };
export function TableSeatCountInput({ restaurantId, tableSeatCount }: Props) {
  const toast = useToast();
  const [seatCount, setSeatCount] = useState<number>(tableSeatCount || 0);
  const [isSaved, setIsSaved] = useState<boolean>(true);

  const handleCounterSeatCountSubmit = () => {
    updateRestaurantTableSeatCount({ id: restaurantId, tableSeatCount: seatCount })
      .then(() => {
        toast({ title: "テーブル席数を更新しました", status: "success" });
        setIsSaved(true);
      })
      .catch(() => toast({ title: "テーブル席数の更新に失敗しました", status: "error" }));
  };
  return (
    <VStack>
      <HStack>
        <InputGroup>
          <Input
            type="number"
            placeholder="テーブル座席"
            value={seatCount}
            onChange={(e) => {
              setSeatCount(Number(e.target.value));
              setIsSaved(false);
            }}
            min={0}
          />
        </InputGroup>
        <Button onClick={handleCounterSeatCountSubmit}>保存する</Button>
      </HStack>
      {!isSaved && (
        <Text mr="auto" textColor="red" fontSize="small">
          まだ保存されていません
        </Text>
      )}
    </VStack>
  );
}
