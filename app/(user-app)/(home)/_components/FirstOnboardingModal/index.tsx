"use client";

import { useDisclosure } from "@chakra-ui/react";
import { useEffect } from "react";
import { OnboardingModal } from "../../../_components/OnboardingModal";

const ONBOARDING_MODAL_SHOWN_KEY = "onboardingModalShown";

export function FirstOnboardingModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const onboardingModalShown = localStorage.getItem(ONBOARDING_MODAL_SHOWN_KEY);
    if (!onboardingModalShown || onboardingModalShown !== "24-08-08") {
      onOpen();
    }
  }, [onOpen]);

  const handleClose = () => {
    localStorage.setItem(ONBOARDING_MODAL_SHOWN_KEY, "24-08-08");
    onClose();
  };

  return <OnboardingModal isOpen={isOpen} onClose={handleClose} />;
}
