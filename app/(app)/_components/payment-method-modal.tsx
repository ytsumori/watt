"use client";

import StripeForm from "@/components/stripe/stripe-form";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@chakra-ui/react";

type Props = {
  isOpen: boolean;
};

export function PaymentMethodModal({ isOpen }: Props) {
  return (
    <Modal isOpen={isOpen} size="full" onClose={() => undefined}>
      <ModalContent>
        <ModalHeader>支払い方法の登録</ModalHeader>
        <ModalBody>
          会員登録ありがとうございます！以下から決済方法を登録してください！
          <StripeForm />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
