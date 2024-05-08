"use client";

import { useState } from "react";

import { Checkbox, Text } from "@chakra-ui/react";
import { ConfirmModal } from "@/components/confirm-modal";

type Props = {
  isOpen: boolean;
  isCancelling: boolean;
  onClose: () => void;
  onConfirm: (isFull: boolean) => void;
};

export function CancelConfirmModal({ isOpen, isCancelling, onClose, onConfirm }: Props) {
  const [isFull, setIsFull] = useState(false);
  const handleClose = () => {
    setIsFull(false);
    onClose();
  };
  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={handleClose}
      title="注文をキャンセルしますか？"
      confirmButton={{
        label: "注文をキャンセル",
        onClick: () => onConfirm(isFull),
        isLoading: isCancelling
      }}
      cancelButton={{
        label: "注文を続ける",
        isDisabled: isCancelling
      }}
    >
      <Checkbox isChecked={isFull} onChange={(e) => setIsFull(e.target.checked)}>
        <Text fontSize="sm">「満席だった」または「お店が閉まっていた」のでキャンセルする</Text>
      </Checkbox>
    </ConfirmModal>
  );
}
