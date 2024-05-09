"use client";
import { Box, Text, Button, Flex } from "@chakra-ui/react";
import Image from "next/image";
import { LineLoginButton } from "../LineLoginButton";
import { FC } from "react";

type Props = { callbackUrl: string };

export const SigninForm: FC<Props> = ({ callbackUrl }) => {
  return (
    <Flex height="100vh" justify="center" alignItems="center">
      <Box>
        <Image src="/watt-logo.png" alt="Watt" width={80} height={31} style={{ margin: "0px auto 20px" }} />
        <LineLoginButton callbackUrl={callbackUrl} />
      </Box>
    </Flex>
  );
};
