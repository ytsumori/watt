export type RestaurantStatus = "open" | "close" | "full";

export function getRestaurantStatus({ isOpen, isFull }: { isOpen: boolean; isFull: boolean }): RestaurantStatus {
  if (!isOpen) return "close";
  if (isFull) return "full";
  return "open";
}
