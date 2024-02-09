"use client";

import {
  Button,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Step,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  Text,
  VStack,
  useSteps,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Link,
  Box,
  Alert,
  AlertIcon,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import Stripe from "stripe";
import { Meal, Prisma } from "@prisma/client";
import {
  capturePaymentIntent,
  createPaymentIntent,
} from "@/actions/payment-intent";
import { Session } from "next-auth";
import { findPreauthorizedPayment } from "@/actions/payment";
import NextLink from "next/link";
import { signIn } from "next-auth/react";
import { CheckIcon } from "@chakra-ui/icons";

type Props = {
  meal: Meal;
  paymentMethods: Stripe.PaymentMethod[];
  defaultPreauthorizedPayment?: Prisma.PaymentGetPayload<{
    include: { order: { include: { meal: true } } };
  }>;
  user?: Session["user"];
};

export default function MealPage({
  meal,
  paymentMethods,
  defaultPreauthorizedPayment,
  user,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [preauthorizedPayment, setPreauthorizedPayment] = useState(
    defaultPreauthorizedPayment
  );
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | undefined
  >(paymentMethods.length === 1 ? paymentMethods[0].id : undefined);

  const {
    isOpen: isVisitingModalOpen,
    onOpen: onVisitingModalOpen,
    onClose: onVisitingModalClose,
  } = useDisclosure();
  const {
    isOpen: isPaymentConfirmOpen,
    onOpen: onPaymentConfirmOpen,
    onClose: onPaymentConfirmClose,
  } = useDisclosure();

  const steps: {
    title: string;
    activeButton?: { label: string; onClick: () => void };
  }[] = [
    {
      title: "お店に移動",
      activeButton: { label: "お店に向かう", onClick: onVisitingModalOpen },
    },
    {
      title: "店に到着",
      activeButton: { label: "支払いをする", onClick: onPaymentConfirmOpen },
    },
    { title: "食事を楽しむ" },
  ];
  const { activeStep, setActiveStep } = useSteps({
    index: preauthorizedPayment ? 1 : 0,
    count: steps.length,
  });
  const isDifferentMealOrdered = !!(
    preauthorizedPayment && preauthorizedPayment.order.mealId !== meal.id
  );

  const handleVisitingClick = async () => {
    if (!user || !selectedPaymentMethod) return;
    createPaymentIntent({
      mealId: meal.id,
      userId: user.id,
      paymentMethodId: selectedPaymentMethod,
    }).then((status) => {
      if (status === "requires_capture") {
        findPreauthorizedPayment(user.id).then((payment) => {
          console.log("payment", payment);
          if (payment) {
            setPreauthorizedPayment({
              ...payment,
              order: {
                ...payment.order,
                meal,
              },
            });
            setActiveStep(1);
          }
        });
        onVisitingModalClose();
      } else {
        console.error("status", status);
        console.error("Failed to create payment intent");
      }
    });
  };

  const handlePaymentConfirm = () => {
    if (!preauthorizedPayment) return;

    capturePaymentIntent(preauthorizedPayment.id).then((paymentIntent) => {
      if (paymentIntent === "succeeded") {
        setActiveStep(2);
        onPaymentConfirmClose();
      } else {
        console.error("Failed to capture payment intent");
      }
    });
  };

  return (
    <VStack alignItems="baseline" spacing={4} w="full">
      {isDifferentMealOrdered ? (
        <Text>
          <Link
            as={NextLink}
            href={`/restaurants/${preauthorizedPayment.order.meal.restaurantId}/meals/${preauthorizedPayment.order.mealId}`}
            color="teal.500"
          >
            <b>他の推しメシ</b>
          </Link>
          を選択中です
        </Text>
      ) : (
        <>
          <Heading size="sm">
            {user ? "支払い方法" : "ログインして食事に進む"}
          </Heading>
          {user ? (
            <>
              {/* <Stepper
                index={activeStep}
                orientation="vertical"
                w="full"
                minH="25vh"
                colorScheme="cyan"
              >
                {steps.map((step, index) => (
                  <Step key={index}>
                    <StepIndicator>
                      <StepStatus
                        complete={<StepIcon />}
                        incomplete={<StepNumber />}
                        active={<StepNumber />}
                      />
                    </StepIndicator>
                    <VStack alignItems="baseline">
                      <StepTitle>{step.title}</StepTitle>
                      {activeStep === index && step.activeButton && (
                        <Button
                          textColor="white"
                          onClick={step.activeButton.onClick}
                        >
                          {step.activeButton.label}
                        </Button>
                      )}
                    </VStack>
                    <StepSeparator />
                  </Step>
                ))}
              </Stepper>
              <Modal
                isOpen={isVisitingModalOpen}
                onClose={onVisitingModalClose}
                closeOnOverlayClick={false}
                isCentered
              >
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>決済方法を選ぶ</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <VStack>
                      <Button onClick={() => console.log("pay with paypay")}>
                        PayPayで支払い
                      </Button>
                      {paymentMethods.map((paymentMethod) => (
                        <Button
                          key={paymentMethod.id}
                          onClick={() => handleStripePayment(paymentMethod.id)}
                        >
                          {paymentMethod.card?.exp_month}/
                          {paymentMethod.card?.exp_year}
                          <br />
                          **** **** **** {paymentMethod.card?.last4}
                        </Button>
                      ))}
                    </VStack>
                  </ModalBody>
                </ModalContent>
              </Modal>
              <AlertDialog
                isOpen={isPaymentConfirmOpen}
                onClose={onPaymentConfirmClose}
                leastDestructiveRef={ref}
              >
                <AlertDialogOverlay>
                  <AlertDialogContent>
                    <AlertDialogHeader>決済を確定します</AlertDialogHeader>
                    <AlertDialogBody>
                      お支払いを確定しますがよろしいですか？
                    </AlertDialogBody>
                    <AlertDialogFooter>
                      <Button
                        colorScheme="gray"
                        onClick={onPaymentConfirmClose}
                      >
                        キャンセル
                      </Button>
                      <Button textColor="white" onClick={handlePaymentConfirm}>
                        確定する
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialogOverlay>
              </AlertDialog> */}
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
                      <Tr key={paymentMethod.id}>
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
                onClick={handleVisitingClick}
                color="white"
                w="full"
                maxW="full"
                isDisabled={selectedPaymentMethod === undefined}
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
      )}
    </VStack>
  );
}
