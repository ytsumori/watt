import { Order } from "@prisma/client";

export type OrderStatus = "COMPLETE" | "CANCELED" | "IN PROGRESS" | "APPROVED";

export function getOrderStatus(order: Order): OrderStatus {
  if (order.completedAt) {
    return "COMPLETE";
  }
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
    case "COMPLETE":
      return "注文完了";
    case "CANCELED":
      return "キャンセル済み";
    case "APPROVED":
      return "承諾済み";
    case "IN PROGRESS":
      return "未完了";
    default:
      throw new Error("Invalid order status");
  }
};
