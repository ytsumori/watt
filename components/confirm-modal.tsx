"use client";

import { ReactNode } from "react";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
} from "@chakra-ui/react";

type Props = {
  isOpen: boolean;
  children?: ReactNode;
  title: string;
  confirmButton: {
    label: string;
    onClick: () => void;
    isDisabled?: boolean;
    isLoading?: boolean;
  };
  cancelButton?: {
    label: string;
    isDisabled?: boolean;
  };
  onClose: () => void;
};

export function ConfirmModal({
  isOpen,
  children,
  title,
  confirmButton,
  cancelButton,
  onClose,
}: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        {children && <ModalBody>{children}</ModalBody>}
        <ModalFooter>
          <VStack w="full">
            <Button
              size="md"
              w="full"
              maxW="full"
              color="white"
              {...confirmButton}
            >
              {confirmButton.label}
            </Button>
            {cancelButton && (
              <Button
                size="md"
                colorScheme="gray"
                w="full"
                maxW="full"
                onClick={onClose}
                isDisabled={cancelButton.isDisabled}
              >
                {cancelButton.label}
              </Button>
            )}
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
