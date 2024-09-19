"use client";

import {
  Box,
  Button,
  HStack,
  ListItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  OrderedList,
  Step,
  StepIndicator,
  StepSeparator,
  StepStatus,
  Stepper,
  Text,
  VStack
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { CheckIcon } from "@chakra-ui/icons";
import Image from "next/image";
import onboardingImage from "@/public/onboarding.png";
import { EmblaCarouselType } from "embla-carousel";
import { StatusBadge } from "../StatusBadge";

const ONBOARDING_STEPS = [
  {
    title: "Wattとは？",
    content: (
      <VStack alignItems="start" fontSize="sm">
        <Text>
          <Image
            src="/watt-logo.png"
            alt="Watt"
            width="45"
            height="24"
            style={{ display: "inline", verticalAlign: "bottom", marginRight: "0.2rem" }}
          />
          は、気になるお店の空席状況を来店せずに確認できるグルメサービスです！
          <br />
          <br />
          1人または2人でのお客様向けにWatt限定の特別メニューをお得な値段で提供しています！
        </Text>
        <Box w="full">
          <Image src={onboardingImage} alt="Wattとは？" width={200} style={{ margin: "auto" }} />
        </Box>
      </VStack>
    )
  },
  {
    title: "空き確認ステータスについて",
    content: (
      <VStack alignItems="start" fontSize="sm">
        <Text>お店の空き確認ステータスのいずれかに設定されています。</Text>
        <Box>
          <StatusBadge isAvailable isWorkingHour />
          <Text>Wattによるお店の空き状況の確認ができる状態です。</Text>
        </Box>
        <Box>
          <HStack>
            <StatusBadge isAvailable={false} isWorkingHour />
            <StatusBadge isAvailable={false} isWorkingHour={false} />
          </HStack>
          <Text>Wattによる店の空き状況の確認ができない状態です。</Text>
        </Box>
      </VStack>
    )
  },
  {
    title: "ご利用ステップ",
    content: (
      <VStack alignItems="start" fontSize="sm">
        <Text>以下の手順でWattをご利用ください。</Text>
        <OrderedList spacing={2} fontWeight="bold">
          <ListItem>
            行きたいお店を選ぶ
            <br />
            <Text fontWeight="normal" fontSize="xs">
              どんな食事がどれくらいの値段で注文できるか簡単に確認できます！
            </Text>
          </ListItem>
          <ListItem>
            Watt限定メニューを選ぶ
            <br />
            <Text fontWeight="normal" fontSize="xs">
              お店の方が用意したお得なメニューを提供しています！
            </Text>
          </ListItem>
          <ListItem>
            お店の空き状況を確認する
            <br />
            <Text fontWeight="normal" fontSize="xs">
              5分以内に自動的にお店の空き状況の確認を取り、SMSでお知らせします！
            </Text>
          </ListItem>
          <ListItem>
            お店に向かう
            <Text fontWeight="normal" fontSize="xs">
              空き状況が確認できてから30分以内にお店に入店してください！
            </Text>
          </ListItem>
          <ListItem>注文番号をお店スタッフに伝えてお食事をお楽しみください！！</ListItem>
        </OrderedList>
        <Text fontSize="xs" color="gray.500">
          ※Watt限定メニュー以外の注文は、お店の注文方法に従って注文してください。
        </Text>
      </VStack>
    )
  }
];

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export function OnboardingModal({ isOpen, onClose }: Props) {
  const [isRead, setIsRead] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel();

  const detectStepChange = useCallback((emblaApi: EmblaCarouselType) => {
    const selectedIndex = emblaApi.selectedScrollSnap();
    setCurrentStep(selectedIndex);
    if (selectedIndex === ONBOARDING_STEPS.length - 1) setIsRead(true);
  }, []);

  useEffect(() => {
    if (emblaApi) {
      emblaApi.on("select", detectStepChange);
      return () => {
        emblaApi.off("select", detectStepChange);
      };
    }
  }, [detectStepChange, emblaApi]);

  const handleNextClick = () => {
    if (isRead) {
      onClose();
      setCurrentStep(0);
      setIsRead(false);
    } else {
      if (emblaApi) emblaApi.scrollNext();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={isRead ? onClose : () => undefined} isCentered>
      <ModalOverlay />
      <ModalContent>
        <Box overflow="hidden">
          <Box ref={emblaRef}>
            <Box display="flex">
              {ONBOARDING_STEPS.map(({ title, content }, index) => (
                <Box key={index} flex="0 0 100%" minW={0}>
                  <ModalHeader>{title}</ModalHeader>
                  <ModalBody>{content}</ModalBody>
                </Box>
              ))}
            </Box>
          </Box>
          <ModalFooter alignSelf="center" flexDirection="column" gap={2}>
            <Stepper index={currentStep} size="sm" gap="0" mx="auto">
              {ONBOARDING_STEPS.map((_, index) => (
                <Step key={index}>
                  <StepIndicator
                    sx={{
                      "[data-status=complete] &": {
                        borderColor: "gray.200",
                        borderWidth: "2px",
                        bg: "transparent"
                      },
                      "[data-status=active] &": {
                        color: "brand.500"
                      }
                    }}
                  >
                    <StepStatus active={<CheckIcon />} />
                  </StepIndicator>
                  <StepSeparator />
                </Step>
              ))}
            </Stepper>
            <Button className="embla__next" onClick={handleNextClick}>
              {isRead ? "閉じる" : "次へ"}
            </Button>
          </ModalFooter>
        </Box>
      </ModalContent>
    </Modal>
  );
}
