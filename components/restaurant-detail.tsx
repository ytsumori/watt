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
} from "@chakra-ui/react";
import Map from "@/components/map";
import { RESTAURANTS } from "@/constants/restaurants";
import { useState } from "react";
import { QrReader } from "react-qr-reader";
import ViewFinder from "@/components/view-finder";
import { FaInstagram } from "react-icons/fa";
import { TabelogIcon } from "./tabelog-icon";

export default function RestaurantDetail() {
  const reservedRestaurant = RESTAURANTS[0];
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const steps: {
    title: string;
    description?: string;
    completeDescription?: string;
    button?: { label: string; onClick: () => void };
  }[] = [
    {
      title: "お店に移動",
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
    { title: "食事を楽しむ" },
    { title: "退店" },
  ];
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  return (
    <VStack px={6} alignItems="baseline" spacing={4}>
      <VStack h="fit-content" spacing={2}>
        <Card variant="unstyled" direction="row">
          <Image
            objectFit="contain"
            alt="商品"
            src="https://tblg.k-img.com/resize/660x370c/restaurant/images/Rvw/108066/108066112.jpg?token=3e19a56&api=v2"
            width="40%"
          />
          <VStack p={4}>
            <Text as="b" fontSize="md" w="full">
              {reservedRestaurant.name}
              <br />
              <Text as="span" fontSize="sm">
                黄金のTKG
              </Text>
            </Text>
            <HStack w="full">
              <IconButton
                as="a"
                href="https://tabelog.com/osaka/A2701/A270106/27090650/"
                target="_blank"
                colorScheme="teal"
                aria-label="tabelog"
                fontSize="30px"
                icon={<TabelogIcon />}
              />
              <IconButton
                as="a"
                href="https://www.instagram.com/menyayu0303/"
                target="_blank"
                colorScheme="teal"
                aria-label="instagram"
                fontSize="30px"
                icon={<FaInstagram />}
              />
            </HStack>
          </VStack>
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
              {index >= activeStep && step.description && (
                <StepDescription>{step.description}</StepDescription>
              )}
              {index < activeStep && step.completeDescription && (
                <StepDescription>{step.completeDescription}</StepDescription>
              )}
              {index >= activeStep && step.button && (
                <Button
                  size="sm"
                  colorScheme="teal"
                  onClick={step.button.onClick}
                >
                  {step.button.label}
                </Button>
              )}
            </VStack>

            <StepSeparator />
          </Step>
        ))}
      </Stepper>
      <Modal
        isOpen={isCheckingIn}
        onClose={() => setIsCheckingIn(false)}
        closeOnOverlayClick={false}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>チェックイン</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              店に到着でき次第、店員の指示に従いチェックインQRコードを読み取ってください
            </Text>
            <QrReader
              ViewFinder={ViewFinder}
              constraints={{
                facingMode: "environment",
              }}
              onResult={(result) => {
                if (!!result) {
                  setActiveStep(3);
                  setIsCheckingIn(false);
                }
              }}
              containerStyle={{ width: "100%" }}
              videoStyle={{ width: "100%" }}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </VStack>
  );
}
