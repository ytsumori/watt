"use client";

import { LoginButton, LogoutButton } from "@/components/buttons";
import { Avatar, Center, VStack, Text, Button } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Profile() {
  const { data: session } = useSession();
  const router = useRouter();
  const user = session?.user;
  return (
    <Center width="full" height="full">
      <VStack>
        {user ? (
          <VStack>
            <Avatar src={user.image ?? ""} />
            <Text>{user.name}</Text>
            <LogoutButton />
          </VStack>
        ) : (
          <LoginButton />
        )}
        <Button onClick={() => router.push("payment-method/new")} color="white">
          決済方法を追加
        </Button>
      </VStack>
    </Center>
  );
}
