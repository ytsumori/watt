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
  StepDescription,
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
} from "@chakra-ui/react";
import { useState } from "react";
import { FaInstagram } from "react-icons/fa";
import { TabelogIcon } from "./tabelog-icon";
import { useSession } from "next-auth/react";
import { LoginButton } from "./buttons";
import Stripe from "stripe";
import { Meal, Restaurant } from "@prisma/client";
import { createPaymentIntent } from "@/lib/stripe/payment-intent";

type Props = {
  selectedRestaurant: Restaurant;
  meal?: Meal;
  paymentMethods: Stripe.PaymentMethod[];
};

export default function RestaurantDetail({
  selectedRestaurant,
  meal,
  paymentMethods,
}: Props) {
  const { data: session } = useSession();
  const user = session?.user;

  const {
    isOpen: isVisitingModalOpen,
    onOpen: onVisitingModalOpen,
    onClose: onVisitingModalClose,
  } = useDisclosure();
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  const steps: {
    title: string;
    description?: string;
    completeDescription?: string;
    button?: { label: string; onClick: () => void };
    activeButton?: { label: string; onClick: () => void };
  }[] = [
    {
      title: "お店に移動",
      button: {
        label: "お店に向かう",
        onClick: () => {
          onVisitingModalOpen();
        },
      },
    },
    {
      title: "チェックイン",
      completeDescription: "チェックイン済みです",
      button: {
        label: "チェックインに進む",
        onClick: () => {
          setIsCheckingIn(true);
        },
      },
    },
    {
      title: "食事を楽しむ",
    },
    {
      title: "退店",
      description: "30分以上滞在する場合は、追加でご注文ください",
    },
  ];
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  return (
    <VStack px={6} alignItems="baseline" spacing={4}>
      <VStack h="fit-content" spacing={2} w="full">
        {meal ? (
          <Card variant="unstyled" direction="row">
            <Image
              objectFit="contain"
              alt="商品"
              src={meal.imageUrl}
              width="40%"
            />
            <VStack p={4}>
              <Text as="b" fontSize="md" w="full">
                {selectedRestaurant.name}
                <br />
                <Text as="span" fontSize="sm">
                  {meal.price}円(税込)
                </Text>
              </Text>
              <HStack w="full">
                <IconButton
                  size="sm"
                  as="a"
                  href="https://tabelog.com/osaka/A2701/A270106/27090650/"
                  target="_blank"
                  colorScheme="cyan"
                  textColor="white"
                  aria-label="tabelog"
                  fontSize="24px"
                  icon={<TabelogIcon />}
                />
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
        ) : (
          <Box w="full">
            <Heading as="h1" size="lg">
              {selectedRestaurant.name}
            </Heading>
            <Heading as="h2" size="md">
              推しメシが存在しません
            </Heading>
          </Box>
        )}
        <Box h="25vh" w="full">
          <iframe
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}&q=place_id:${selectedRestaurant.googleMapPlaceId}`}
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
                      {index >= activeStep && step.description && (
                        <StepDescription>{step.description}</StepDescription>
                      )}
                      {index < activeStep && step.completeDescription && (
                        <StepDescription>
                          {step.completeDescription}
                        </StepDescription>
                      )}
                      {index >= activeStep && step.button && (
                        <Button textColor="white" onClick={step.button.onClick}>
                          {step.button.label}
                        </Button>
                      )}
                      {index === activeStep && step.activeButton && (
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
                onClose={() => {
                  setIsCheckingIn(false);
                  setIsPaying(false);
                }}
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
