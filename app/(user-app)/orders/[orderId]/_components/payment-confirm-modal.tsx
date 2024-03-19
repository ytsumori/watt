"use client";

import { useState } from "react";

import { Checkbox, Text, VStack } from "@chakra-ui/react";
import { ConfirmModal } from "../../../../../components/confirm-modal";

type Props = {
  isOpen: boolean;
  isConfirming: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function PaymentConfirmModal({ isOpen, isConfirming, onClose, onConfirm }: Props) {
  const [isChecked, setIsChecked] = useState(false);
  const handleClose = () => {
    setIsChecked(false);
    onClose();
  };
  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={handleClose}
      title="決済を確定しますか？"
      confirmButton={{
        label: "決済を確定する",
        onClick: onConfirm,
        isDisabled: !isChecked,
        isLoading: isConfirming,
      }}
      cancelButton={{
        label: "戻る",
        isDisabled: isConfirming,
      }}
    >
      <VStack alignItems="start">
        <Text>決済を確定しますか？</Text>
        <Checkbox isChecked={isChecked} onChange={(e) => setIsChecked(e.target.checked)}>
          <Text fontSize="sm">お店に到着し、注文ページをお店の人に見せました。</Text>
        </Checkbox>
      </VStack>
    </ConfirmModal>
  );
}
