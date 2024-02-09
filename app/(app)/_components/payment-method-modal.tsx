"use client";

import { getMyId } from "@/actions/me";
import { isPaymentMethodRegistered } from "@/actions/user";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function PaymentMethodModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  useEffect(() => {
    getMyId().then((myId) => {
      if (!myId) return;
      isPaymentMethodRegistered(myId).then((isRegistered) => {
        if (!isRegistered) {
          onOpen();
        }
      });
    });
  }, [onOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>支払い方法の登録</ModalHeader>
        <ModalBody>
          会員登録ありがとうございます！以下から決済方法を登録してください！
        </ModalBody>
        <ModalFooter>
          <Button
            color="white"
            onClick={() => router.push("/payment-method/new")}
          >
            決済方法を登録
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
