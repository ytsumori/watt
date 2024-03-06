"use client";

import {
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Switch,
} from "@chakra-ui/react";
import { ChangeEvent, useContext, useState } from "react";
import { updateIsOpen } from "@/actions/restaurant";
import { RestaurantIdContext } from "./restaurant-id-provider";

export function SchedulePage() {
  const restaurantId = useContext(RestaurantIdContext);
  const [isRestaurantOpen, setIsRestaurantOpen] = useState(false);

  const handleOpenStatusChange = (event: ChangeEvent<HTMLInputElement>) => {
    const isOpen = event.target.checked;
    updateIsOpen({ id: restaurantId, isOpen }).then(() => {
      setIsRestaurantOpen(isOpen);
    });
  };

  return (
    <>
      <FormControl>
        <HStack>
          <FormLabel mb={0}>営業中</FormLabel>
          <Switch
            onChange={handleOpenStatusChange}
            isChecked={isRestaurantOpen}
          />
        </HStack>
        <FormHelperText>
          お客さんを案内できない場合はオフにしてください
        </FormHelperText>
      </FormControl>
    </>
  );
}
