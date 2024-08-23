import { Order, Prisma } from "@prisma/client";

export type OrderStatus = "CANCELED" | "IN PROGRESS" | "APPROVED";

export function getOrderStatus(
  order: Prisma.OrderGetPayload<{ select: { canceledAt: true; approvedByRestaurantAt: true } }>
): OrderStatus {
  if (order.canceledAt) {
    return "CANCELED";
  }
  if (order.approvedByRestaurantAt) {
    return "APPROVED";
  }
  return "IN PROGRESS";
}

export const translateOrderStatus = (order: OrderStatus): string => {
  switch (order) {
    case "CANCELED":
      return "キャンセル済み";
    case "APPROVED":
      return "注文完了";
    case "IN PROGRESS":
      return "未完了";
    default:
      throw new Error("Invalid order status");
  }
};
