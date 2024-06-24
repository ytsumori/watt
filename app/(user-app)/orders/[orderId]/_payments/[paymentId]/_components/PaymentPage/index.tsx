"use client";

import { capturePaymentIntent } from "@/actions/payment-intent";
import { ConfirmModal } from "@/components/confirm-modal";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { Badge, Box, Button, Center, Flex, Heading, Text, VStack, useDisclosure } from "@chakra-ui/react";
import { Prisma } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  payment: Prisma.PaymentGetPayload<{
    select: {
      id: true;
      completedAt: true;
      totalAmount: true;
      order: { select: { restaurant: { select: { name: true } } } };
    };
  }>;
};

export function PaymentPage({ payment }: Props) {
  const router = useRouter();
  const [isPriceFlipped, setIsPriceFlipped] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const { isOpen: isErrorMessageOpen, onOpen: onErrorMessageOpen, onClose: onErrorMessageClose } = useDisclosure();

  useEffect(() => {
    if (!isPriceFlipped) {
      setTimeout(() => setIsPriceFlipped(true), 500);
    }
  }, [isPriceFlipped]);

  const handlePay = () => {
    setIsPosting(true);
    capturePaymentIntent({ paymentId: payment.id })
      .then((status) => {
        if (status === "succeeded") {
          router.refresh();
          setIsPosting(false);
        }
      })
      .catch((error) => {
        setIsPosting(false);
        onErrorMessageOpen();
      });
  };

  if (payment.completedAt !== null) {
    return (
      <Center h="full" p={4} flexDirection="column">
        <VStack my="auto">
          <Heading size="md">{payment.order.restaurant.name}に支払い</Heading>
          <Text>{payment.completedAt.toLocaleString("ja-JP")}</Text>
          <Heading fontSize="80px">
            {payment.totalAmount.toLocaleString("ja-JP")}
            <Text as="span" fontSize="20px">
              円
            </Text>
          </Heading>
          <Badge colorScheme="brand" variant="solid" borderRadius={16} fontSize="1em" p={2}>
            支払い完了
          </Badge>
        </VStack>
        <Button mt={6} size="lg" w="full" variant="outline" onClick={() => router.push("/")}>
          ホーム画面に戻る
        </Button>
      </Center>
    );
  }

  return (
    <>
      <Button leftIcon={<ArrowBackIcon />} onClick={router.back} variant="ghost" alignSelf="baseline" size="md">
        金額を変更する
      </Button>
      <Flex direction="column" h="full" p={4}>
        <Box h="40%" transform={isPriceFlipped ? "rotateZ(180deg)" : ""} transitionDuration="0.5s">
          <Heading size="md">{payment.order.restaurant.name}</Heading>
          <Center h="full">
            <Heading fontSize="80px">
              {payment.totalAmount.toLocaleString("ja-JP")}
              <Text as="span" fontSize="20px">
                円
              </Text>
            </Heading>
          </Center>
        </Box>
        <Button mt={6} size="lg" w="full" onClick={handlePay} isLoading={isPosting}>
          支払う
        </Button>
      </Flex>
      <ConfirmModal
        isOpen={isErrorMessageOpen}
        title="エラーが発生しました"
        confirmButton={{
          label: "OK",
          onClick: onErrorMessageClose
        }}
        onClose={onErrorMessageClose}
      />
    </>
  );
}
