"use server";

import { cancelPaymentIntent } from "@/actions/payment-intent";
import { updateIsOpen } from "@/actions/restaurant";
import { notifyStaffCancellation, notifyStaffFullCancellation } from "./notify-staff-cancellation";

export async function cancelOrder({
  orderId,
  restaurantId,
  isFull
}: {
  orderId: string;
  restaurantId: string;
  isFull: boolean;
}) {
  const paymentStatus = await cancelPaymentIntent({
    orderId,
    cancelledBy: "USER",
    reason: isFull ? "FULL" : "USER_DEMAND"
  });

  if (paymentStatus === "canceled") {
    if (isFull) {
      await updateIsOpen({ id: restaurantId, isOpen: false });
      try {
        await notifyStaffFullCancellation({ orderId: orderId });
      } catch (e) {
        console.error("Error notifying staff", e);
      }
    } else {
      try {
        await notifyStaffCancellation({ orderId: orderId });
      } catch (e) {
        console.error("Error notifying staff", e);
      }
    }
  } else {
    throw new Error("Failed to cancel payment intent");
  }
}
