"use client";

import {
  Box,
  Button,
  Card,
  HStack,
  Heading,
  IconButton,
  Image,
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
} from "@chakra-ui/react";
import { useRef } from "react";
import { FaInstagram } from "react-icons/fa";
import { useSession } from "next-auth/react";
import Stripe from "stripe";
import { Prisma } from "@prisma/client";
import { createPaymentIntent } from "@/actions/payment-intent";
import { LoginButton } from "@/components/buttons";

type Props = {
  meal: Prisma.MealGetPayload<{ include: { restaurant: true } }>;
  paymentMethods: Stripe.PaymentMethod[];
};

export default function MealPage({ meal, paymentMethods }: Props) {
  const { data: session } = useSession();
  const user = session?.user;

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

  const ref = useRef<HTMLDivElement>(null);
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
    index: 0,
    count: steps.length,
  });

  return (
    <VStack px={6} alignItems="baseline" spacing={4}>
      <VStack h="fit-content" spacing={2} w="full">
        <Card variant="unstyled" direction="row">
          <Image
            objectFit="contain"
            alt="商品"
            src={meal.imageUrl}
            width="40%"
          />
          <VStack p={4}>
            <Text as="b" fontSize="md" w="full">
              {meal.restaurant.name}
              <br />
              <Text as="span" fontSize="sm">
                {meal.price}円(税込)
              </Text>
            </Text>
            <HStack w="full">
              <IconButton
                size="sm"
                as="a"
                href="https://www.instagram.com/menyayu0303/"
                target="_blank"
                colorScheme="cyan"
                textColor="white"
                aria-label="instagram"
                fontSize="24px"
                icon={<FaInstagram />}
              />
            </HStack>
          </VStack>
        </Card>
        <Box h="25vh" w="full">
          <iframe
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}&q=place_id:${meal.restaurant.googleMapPlaceId}`}
          />
        </Box>
      </VStack>
      {meal ? (
        <>
          <Heading as="h2" size="md">
            お食事の流れ
          </Heading>
          {user ? (
            <>
              <Stepper
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
                          onClick={() =>
                            createPaymentIntent({
                              mealId: meal.id,
                              userId: user.id,
                              paymentMethodId: paymentMethod.id,
                            }).then((status) => {
                              console.log(status);
                              setActiveStep(1);
                              onVisitingModalClose();
                            })
                          }
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
                      <Button
                        textColor="white"
                        onClick={() => {
                          console.log("TODO: confirm payment");
                          setActiveStep(2);
                          onPaymentConfirmClose();
                        }}
                      >
                        確定する
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialogOverlay>
              </AlertDialog>
            </>
          ) : (
            <LoginButton />
          )}
        </>
      ) : (
        <>
          <Text>推しメシが登録されていれば食事ができません</Text>
        </>
      )}
    </VStack>
  );
}
