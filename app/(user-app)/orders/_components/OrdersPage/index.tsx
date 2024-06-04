"use client";

import { OrderStatus, getOrderStatus, translateOrderStatus } from "@/lib/prisma/order-status";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { Badge, Heading, Text, VStack } from "@chakra-ui/react";
import { Prisma } from "@prisma/client";
import Link from "next/link";

type Props = {
  orders: Prisma.OrderGetPayload<{
    include: {
      restaurant: { select: { name: true } };
      payment: { select: { totalAmount: true } };
    };
  }>[];
};

export function OrdersPage({ orders }: Props) {
  return (
    <VStack alignItems="start" spacing={4} p={4} h="full" overflowY="auto">
      <Heading>注文履歴</Heading>
      <VStack spacing={0} w="full">
        {orders.map((order) => {
          const status = getOrderStatus(order);
          return (
            <VStack
              key={order.id}
              spacing={2}
              alignItems="start"
              w="full"
              borderBottomWidth="1px"
              py={2}
              as={Link}
              href={`/orders/${order.id}`}
              position="relative"
            >
              <Text fontSize="x-small">
                {(() => {
                  switch (status) {
                    case "PENDING":
                      return `作成日時: ${order.createdAt.toLocaleString("ja-JP")}`;
                    case "COMPLETE":
                      return `完了日時: ${order.completedAt?.toLocaleString("ja-JP")}`;
                    case "CANCELED":
                      return `キャンセル日時: ${order.canceledAt?.toLocaleString("ja-JP")}`;
                    default:
                      return "";
                  }
                })()}
              </Text>
              <Text fontSize="medium">{order.restaurant.name}</Text>
              {order.payment && (
                <Text fontSize="small">
                  合計 ¥
                  <Text fontSize="medium" as="b">
                    {order.payment.totalAmount.toLocaleString("ja-JP")}
                  </Text>
                </Text>
              )}
              <Badge position="absolute" top={0} right={0} m={2} colorScheme={getBadgeColor(status)}>
                {translateOrderStatus(status)}
              </Badge>
              <ChevronRightIcon position="absolute" right={0} top="50%" transform="translateY(-50%)" boxSize={8} />
            </VStack>
          );
        })}
      </VStack>
    </VStack>
  );
}

function getBadgeColor(status: OrderStatus) {
  switch (status) {
    case "PENDING":
      return "yellow";
    case "COMPLETE":
      return "green";
    case "CANCELED":
      return "red";
    default:
      throw new Error(`Unknown status: ${status}`);
  }
}
