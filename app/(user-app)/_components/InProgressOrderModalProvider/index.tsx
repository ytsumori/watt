"use client";

import { useDisclosure, Text } from "@chakra-ui/react";
import { ConfirmModal } from "@/components/confirm-modal";
import { usePathname, useRouter } from "next/navigation";

type Props = {
  children: React.ReactNode;
  inProgressOrderId?: string;
};

export function InProgressOrderModalProvider({ children, inProgressOrderId }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: !!inProgressOrderId && !pathname.startsWith("/orders") });

  return (
    <>
      {children}
      <ConfirmModal
        isOpen={isOpen}
        onClose={onClose}
        title="すでに注文した推しメシがあります"
        confirmButton={{
          label: "注文ページに移動する",
          onClick: () => {
            router.push(`/orders/${inProgressOrderId}`);
            onClose();
          }
        }}
      >
        <Text>
          注文した推しメシがあります。
          <br />
          お店に向かってください。
        </Text>
      </ConfirmModal>
    </>
  );
}
