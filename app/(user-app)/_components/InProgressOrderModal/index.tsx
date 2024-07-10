"use client";

import { useDisclosure, Text } from "@chakra-ui/react";
import { ConfirmModal } from "@/components/confirm-modal";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

type Props = {
  inProgressOrderId?: string;
};

export function InProgressOrderModal({ inProgressOrderId }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (inProgressOrderId && !pathname.startsWith("/orders")) {
      onOpen();
    }
  }, [inProgressOrderId, onOpen, pathname]);

  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      title="すでにお店に向かっている注文があります"
      confirmButton={{
        label: "注文ページに移動する",
        onClick: () => {
          router.push(`/orders/${inProgressOrderId}`);
          onClose();
        }
      }}
    >
      <Text>
        既にお店に向かってる注文があります。
        <br />
        お店に向かってください。
      </Text>
    </ConfirmModal>
  );
}
