"use client";

import { LoginButton, LogoutButton } from "@/components/buttons";
import { Avatar, Center, VStack, Text } from "@chakra-ui/react";
import { useSession } from "next-auth/react";

export default function Profile() {
  const { data: session } = useSession();
  const user = session?.user;
  return (
    <Center width="full" height="full">
      {user ? (
        <VStack>
          <Avatar src={user.image ?? ""} />
          <Text>{user.name}</Text>
          <LogoutButton />
        </VStack>
      ) : (
        <LoginButton />
      )}
    </Center>
  );
}
