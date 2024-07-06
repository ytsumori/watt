"use client";

import { Box, Button, Divider, Text } from "@chakra-ui/react";

type Props = {
  isLoading: boolean;
  onClick: () => void;
};

export function VisitingSection({ isLoading, onClick }: Props) {
  return (
    <>
      <Divider borderColor="black" my={6} />
      <Text fontSize="xs">
        お店に到着後に次の画面で注文を確定するまで、調理は開始されません。
        <br />
        30分以内にお店に向かってください。
      </Text>
      <Box>
        <Button isLoading={isLoading} onClick={onClick} w="full" maxW="full" size="md">
          お店に向かう
        </Button>
      </Box>
    </>
  );
}
