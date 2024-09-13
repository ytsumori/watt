"use client";

import { Text } from "@chakra-ui/react";
import { ConfirmModal } from "@/components/confirm-modal";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getInProgressOrder } from "./actions/getInProgressOrder";
import { useRouter } from "next-nprogress-bar";

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
      title="空き確認をしているお店があります"
      confirmButton={{
        label: "確認ページに移動する",
        onClick: () => {
          router.push(`/orders/${inProgressOrderId}`);
          setInProgressOrderId(undefined);
        }
      }}
    >
      <Text>
        現在、空き状況の確認を行っているお店があります。
        <br />
        空き状況の確認ができ次第、お店に向かってください。
      </Text>
    </ConfirmModal>
  );
}
