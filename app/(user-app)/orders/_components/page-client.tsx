"use client";

import { translateOrderStatus } from "@/lib/prisma/translate-enum";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { Badge, Box, Heading, Text, VStack } from "@chakra-ui/react";
import { OrderStatus, Prisma } from "@prisma/client";
import Link from "next/link";

type Props = {
  orders: Prisma.OrderGetPayload<{
    include: { meal: { include: { restaurant: true } } };
  }>[];
};

export function OrdersPage({ orders }: Props) {
  return (
    <VStack alignItems="start" spacing={4} p={4}>
      <Heading>注文履歴</Heading>
      <VStack spacing={0} w="full">
        {orders.map((order) => (
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
              {order.createdAt.toLocaleString("ja-JP")}
            </Text>
            <Text fontSize="medium">{order.meal.restaurant.name}</Text>
            <Text fontSize="medium">{order.meal.title}</Text>
            <Text fontSize="small">
              合計 ¥
              <Text fontSize="medium" as="b">
                {order.price}
              </Text>
            </Text>
            <Badge
              position="absolute"
              top={0}
              right={0}
              m={2}
              colorScheme={getBadgeColor(order.status)}
            >
              {translateOrderStatus(order.status)}
            </Badge>
            <ChevronRightIcon
              position="absolute"
              right={0}
              top="50%"
              transform="translateY(-50%)"
              boxSize={8}
            />
          </VStack>
        ))}
      </VStack>
    </VStack>
  );
}

function getBadgeColor(status: OrderStatus) {
  switch (status) {
    case "PREAUTHORIZED":
      return "yellow";
    case "COMPLETE":
      return "green";
    case "CANCELLED":
      return "red";
    default:
      throw new Error("Invalid order status");
  }
}
