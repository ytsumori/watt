import { Flex } from "@chakra-ui/react";
import { GoogleLoginButton } from "../_components/GoogleLoginButton";

export default async function LoginPage() {
  return (
    <Flex h="100vh" justify="center" align="center">
      <GoogleLoginButton />
    </Flex>
  );
}
