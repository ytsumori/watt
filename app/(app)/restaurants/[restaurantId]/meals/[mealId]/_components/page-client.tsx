"use client";

import {
  Button,
  Heading,
  VStack,
  Alert,
  AlertIcon,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
} from "@chakra-ui/react";
import { useState } from "react";
import Stripe from "stripe";
import { Meal, Payment } from "@prisma/client";
import { createPaymentIntent } from "@/actions/payment-intent";
import { findPreauthorizedPayment } from "@/actions/payment";
import { signIn } from "next-auth/react";
import { CheckIcon } from "@chakra-ui/icons";
import { useRouter } from "next/navigation";

type Props = {
  meal: Meal;
  paymentMethods: Stripe.PaymentMethod[];
  isRestaurantActive: boolean;
  preauthorizedPayment?: Payment;
  userId?: string;
};

export default function MealPage({
  meal,
  paymentMethods,
  isRestaurantActive,
  preauthorizedPayment,
  userId,
}: Props) {
  const router = useRouter();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | undefined
  >(paymentMethods.length === 1 ? paymentMethods[0].id : undefined);

  const handleVisitingClick = async () => {
    if (!userId || !selectedPaymentMethod) return;

    createPaymentIntent({
      mealId: meal.id,
      userId,
      paymentMethodId: selectedPaymentMethod,
    }).then((status) => {
      if (status === "requires_capture") {
        findPreauthorizedPayment(userId).then((payment) => {
          if (payment) {
            router.push(`/payments/${payment.id}`);
          }
        });
      } else {
        console.error("status", status);
        console.error("Failed to create payment intent");
      }
    });
  };

  return (
    <VStack alignItems="baseline" spacing={4} w="full">
      {isRestaurantActive ? (
        preauthorizedPayment ? (
          <Alert
            status="warning"
            onClick={() => router.push(`/payments/${preauthorizedPayment.id}`)}
          >
            <AlertIcon />
            既に選択済みの推しメシがあります
          </Alert>
        ) : (
          <>
            <Heading size="sm">
              {userId ? "支払い方法" : "ログインして食事に進む"}
            </Heading>
            {userId ? (
              <>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th></Th>
                        <Th>ブランド</Th>
                        <Th>カード番号</Th>
                        <Th>有効期限</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {paymentMethods.map((paymentMethod) => (
                        <Tr
                          key={paymentMethod.id}
                          onClick={() =>
                            setSelectedPaymentMethod(paymentMethod.id)
                          }
                        >
                          <Th>
                            {selectedPaymentMethod === paymentMethod.id && (
                              <CheckIcon color="cyan.400" />
                            )}
                          </Th>
                          <Th>{paymentMethod.card?.brand}</Th>
                          <Th>**** **** **** {paymentMethod.card?.last4}</Th>
                          <Th>
                            {paymentMethod.card?.exp_month}/
                            {paymentMethod.card?.exp_year}
                          </Th>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
                <Button
                  variant="outline"
                  onClick={() => router.push("/payment-method/new")}
                >
                  決済方法を登録
                </Button>
                <Button
                  onClick={handleVisitingClick}
                  color="white"
                  w="full"
                  maxW="full"
                  isDisabled={selectedPaymentMethod === undefined}
                  size="md"
                >
                  お店に向かう
                </Button>
              </>
            ) : (
              <>
                <Alert borderRadius={4}>
                  <AlertIcon />
                  以下からLINEでログインすることでお食事に進めます
                </Alert>
                <Button
                  onClick={() => signIn()}
                  color="white"
                  w="full"
                  maxW="full"
                >
                  ログインする
                </Button>
              </>
            )}
          </>
        )
      ) : (
        <Alert status="warning" borderRadius={4}>
          <AlertIcon />
          現在こちらのお店は準備中です
        </Alert>
      )}
    </VStack>
  );
}
