"use client";

import {
  Box,
  Button,
  Card,
  Heading,
  Image,
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
  useToast,
} from "@chakra-ui/react";
import Map from "@/components/map";
import { RESTAURANTS } from "@/constants/restaurants";
import { useEffect, useState } from "react";

const today = new Date();
today.setMinutes(today.getMinutes() + 10);
const reservationTime = today.getHours() + ":" + today.getMinutes();

const steps: { title: string; description?: string; buttonLabel?: string }[] = [
  { title: "予約" },
  { title: "お店に移動", description: `予約時間：${reservationTime} (10分後)` },
  {
    title: "チェックイン",
    buttonLabel: "チェックインに進む",
  },
  { title: "食事を楽しむ" },
];

export default function Reserved() {
  const reservedRestaurant = RESTAURANTS[0];
  const { activeStep } = useSteps({
    index: 1,
    count: steps.length,
  });
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const toast = useToast();

  useEffect(() => {
    toast({
      title: "予約が完了しました。",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  });
  return (
    <VStack minH="100vh" px={6} py={4} alignItems="baseline" spacing={4}>
      <Heading as="h1" size="lg">
        予約内容
      </Heading>
      <VStack h="fit-content" spacing={2}>
        <Card variant="unstyled" direction="row">
          <Image
            objectFit="cover"
            alt="商品"
            src="https://tblg.k-img.com/resize/660x370c/restaurant/images/Rvw/108066/108066112.jpg?token=3e19a56&api=v2"
            width="40%"
          />
          <Box p={4}>
            <Text as="b" fontSize="md">
              {reservedRestaurant.name}
              <br />
              <Text as="span" fontSize="sm">
                黄金のTKG
              </Text>
            </Text>
          </Box>
        </Card>
        <Box h="25vh" w="full">
          <Map
            restaurants={[reservedRestaurant]}
            selectedRestaurantID={reservedRestaurant.id}
            defaultCenter={{
              lat: reservedRestaurant.latitude,
              lng: reservedRestaurant.longitude,
            }}
          />
        </Box>
      </VStack>
      <Heading as="h2" size="md">
        食事までの流れ
      </Heading>
      <Stepper
        index={activeStep}
        orientation="vertical"
        w="full"
        minH="25vh"
        colorScheme="teal"
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
              {step.description && (
                <StepDescription>{step.description}</StepDescription>
              )}
              {step.buttonLabel && (
                <Button size="sm" colorScheme="teal">
                  {step.buttonLabel}
                </Button>
              )}
            </VStack>

            <StepSeparator />
          </Step>
        ))}
      </Stepper>
    </VStack>
  );
}
