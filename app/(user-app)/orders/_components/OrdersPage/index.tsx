"use client";

import { OrderStatus, getOrderStatus, translateOrderStatus } from "@/lib/prisma/order-status";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { Badge, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import { Prisma } from "@prisma/client";
import Link from "next/link";

type Props = {
  orders: Prisma.OrderGetPayload<{
    include: {
      restaurant: { select: { name: true } };
    };
  }>[];
};

export function OrdersPage({ orders }: Props) {
  return (
    <VStack spacing={0} w="full" p={4} alignItems="start">
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
                  case "IN PROGRESS":
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
            <Flex w="full" justifyContent="space-between" fontSize="medium">
              <Text>{order.restaurant.name}</Text>
              <ChevronRightIcon boxSize={6} />
            </Flex>
            <Badge position="absolute" top={0} right={0} m={2} colorScheme={getBadgeColor(status)}>
              {translateOrderStatus(status)}
            </Badge>
          </VStack>
        );
      })}
    </VStack>
  );
}

function getBadgeColor(status: OrderStatus) {
  switch (status) {
    case "IN PROGRESS":
      return "yellow";
    case "COMPLETE":
      return "green";
    case "CANCELED":
      return "red";
    default:
      throw new Error(`Unknown status: ${status}`);
  }
}
