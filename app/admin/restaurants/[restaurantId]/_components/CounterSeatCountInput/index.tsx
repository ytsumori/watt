"use client";
import { updateRestaurantCounterSeatCount } from "@/actions/mutations/restaurant";
import { Button, HStack, Input, InputGroup, useToast, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";

type Props = { restaurantId: string; counterSeatCount: number | null };
export function CounterSeatCountInput({ restaurantId, counterSeatCount }: Props) {
  const toast = useToast();
  const [seatCount, setSeatCount] = useState<number>(counterSeatCount || 0);
  const [isSaved, setIsSaved] = useState<boolean>(true);

  const handleCounterSeatCountSubmit = () => {
    updateRestaurantCounterSeatCount({ id: restaurantId, counterSeatCount: seatCount })
      .then(() => {
        toast({ title: "カウンター席数を更新しました", status: "success", duration: 3000 });
        setIsSaved(true);
      })
      .catch(() => toast({ title: "カウンター席数の更新に失敗しました", status: "error", duration: 3000 }));
  };
  return (
    <VStack>
      <HStack>
        <InputGroup>
          <Input
            type="number"
            placeholder="カウンター座席"
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
