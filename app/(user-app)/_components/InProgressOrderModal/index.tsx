"use client";

import { Text } from "@chakra-ui/react";
import { ConfirmModal } from "@/components/confirm-modal";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getInProgressOrder } from "./actions/getInProgressOrder";

export function InProgressOrderModal() {
  const router = useRouter();
  const pathname = usePathname();
  const [inProgressOrderId, setInProgressOrderId] = useState<string>();

  useEffect(() => {
    if (!pathname.startsWith("/order")) {
      getInProgressOrder().then((order) => {
        if (order) {
          setInProgressOrderId(order.id);
        }
      });
    }
  }, [pathname]);

  return (
    <ConfirmModal
      isOpen={inProgressOrderId !== undefined}
      onClose={() => setInProgressOrderId(undefined)}
      title="すでにお店に向かっている注文があります"
      confirmButton={{
        label: "注文ページに移動する",
        onClick: () => {
          router.push(`/orders/${inProgressOrderId}`);
          setInProgressOrderId(undefined);
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
