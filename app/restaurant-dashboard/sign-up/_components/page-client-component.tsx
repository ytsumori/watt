"use client";

import { createStaff } from "@/actions/staff";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import { LineIdTokenContext } from "../../_components/layout-client-component";
import { useRouter } from "next/router";

export function SignUpPage() {
  const idToken = useContext(LineIdTokenContext);
  const [restaurantId, setRestaurantId] = useState<string>();
  const router = useRouter();
  const toast = useToast();

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRestaurantId(e.target.value);
  };

  const handleSubmit = () => {
    if (!restaurantId) return;
    createStaff({ idToken, restaurantId })
      .then(() => {
        router.push("/restaurant-dashboard");
      })
      .catch(() => {
        toast({
          title: "登録に失敗しました",
          status: "error",
        });
      });
  };

  return (
    <VStack>
      <FormControl isRequired>
        <FormLabel>レストランID</FormLabel>
        <Input min={0} onChange={handlePriceChange} value={restaurantId} />
      </FormControl>
      <Button textColor="white" disabled={!restaurantId} onClick={handleSubmit}>
        登録する
      </Button>
    </VStack>
  );
}
