"use client";

import { createStaff } from "@/actions/staff";
import {
  Alert,
  AlertIcon,
  Button,
  Center,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import { LineIdTokenContext } from "../../_components/line-login-provider";
import { useRouter } from "next/navigation";

export function SignUpPage() {
  const idToken = useContext(LineIdTokenContext);
  const [restaurantId, setRestaurantId] = useState<string>();
  const [password, setPassword] = useState<string>();
  const router = useRouter();
  const toast = useToast();

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRestaurantId(e.target.value);
  };

  const handleSubmit = () => {
    if (!restaurantId || !password) return;
    createStaff({ idToken, restaurantId, staffRegistrationToken: password })
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
    <Center height="100vh">
      <VStack spacing={4}>
        <Alert status="info">
          <AlertIcon />
          IDとパスワードは株式会社KiizanKiizanからお渡ししたものを入力してください
        </Alert>
        <FormControl isRequired>
          <FormLabel>ID</FormLabel>
          <Input onChange={handleIdChange} value={restaurantId ?? ""} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>パスワード</FormLabel>
          <Input
            type="password"
            onChange={handlePasswordChange}
            value={password ?? ""}
          />
        </FormControl>
        <Button
          textColor="white"
          isDisabled={!restaurantId || !password}
          onClick={handleSubmit}
          mt={4}
        >
          登録する
        </Button>
      </VStack>
    </Center>
  );
}
