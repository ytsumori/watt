import { OrderStatus } from "@/lib/prisma/order-status";

export function getOrderStatusColor(orderStatus: OrderStatus) {
  switch (orderStatus) {
    case "CANCELED":
      return "red.500";
    case "APPROVED":
      return "green.500";
    case "IN PROGRESS":
      return "yellow.500";
  }
}
