"use client";

import {
  Box,
  Button,
  Center,
  HStack,
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Step,
  StepIcon,
  StepIndicator,
  StepSeparator,
  StepStatus,
  Stepper,
  VStack
} from "@chakra-ui/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import onboarding1Image from "@/public/onboarding/1.png";
import onboarding2Image from "@/public/onboarding/2.png";
import onboarding3Image from "@/public/onboarding/3.png";
import onboarding4Image from "@/public/onboarding/4.png";

const ONBOARDING_STEPS = [
  {
    text: "今すぐ入れるお店から\n行きたいお店を探す",
    imageSrc: onboarding1Image
  },
  {
    text: "「お店に向かうボタン」を\n押してお店に来店",
    imageSrc: onboarding2Image
  },
  {
    text: "お得なセットで\n食事をする",
    imageSrc: onboarding3Image
  },
  {
    text: "Wattでカード決済\n現金支払いも可能",
    imageSrc: onboarding4Image
  }
];

export function OnboardingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const isModalShown = localStorage.getItem("onboardingModalShown");
    if (!isModalShown) {
      setIsOpen(true);
    }
  }, []);

  const handleOnSubmit = () => {
    localStorage.setItem("onboardingModalShown", "true");
    setIsOpen(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={() => undefined} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader alignSelf="center">
          <HStack spacing={1}>
            <Image src="/watt-logo.png" alt="Watt" width="50" height="24" />
            <Heading size="md" alignSelf="end">
              の使い方
            </Heading>
          </HStack>
        </ModalHeader>
        <ModalBody>
          <Center>
            <VStack>
              <Heading whiteSpace="pre-line" textAlign="center">
                {ONBOARDING_STEPS[currentStep].text}
              </Heading>
              <Image
                src={ONBOARDING_STEPS[currentStep].imageSrc}
                alt={`ステップ${currentStep + 1}`}
                width="400"
                height="400"
              />
            </VStack>
          </Center>
        </ModalBody>
        <ModalFooter as={VStack} spacing={10}>
          <Box w="full" position="relative" display="flex" h="32px">
            <Button
              onClick={() => setCurrentStep(currentStep - 1)}
              position="absolute"
              left={0}
              variant="outline"
              isDisabled={currentStep === 0}
            >
              前へ
            </Button>
            <Stepper index={currentStep + 1} size="sm" gap="0" mx="auto">
              {ONBOARDING_STEPS.map((_, index) => (
                <Step key={index}>
                  <StepIndicator
                    sx={{
                      "[data-status=active] &": {
                        borderColor: "gray.200"
                      }
                    }}
                  >
                    <StepStatus active={<></>} complete={<StepIcon />} />
                  </StepIndicator>
                  <StepSeparator />
                </Step>
              ))}
            </Stepper>
            <Button
              onClick={() => setCurrentStep(currentStep + 1)}
              position="absolute"
              right={0}
              isDisabled={currentStep === ONBOARDING_STEPS.length - 1}
            >
              次へ
            </Button>
          </Box>
          {currentStep === ONBOARDING_STEPS.length - 1 && (
            <Button onClick={handleOnSubmit} size="lg" mx="auto">
              使い始める
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
