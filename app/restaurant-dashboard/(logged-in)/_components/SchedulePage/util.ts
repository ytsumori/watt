import { RestaurantStatus } from "./type";

export function getStatus({ isOpen, isFull }: { isOpen: boolean; isFull: boolean }): RestaurantStatus {
  if (!isOpen) return "close";
  if (isFull) return "full";
  return "open";
}
