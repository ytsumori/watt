"use server";

import { cancelPaymentIntent } from "@/actions/payment-intent";
import { updateIsOpen } from "@/actions/restaurant";
import { notifyStaffCancellation, notifyStaffFullCancellation } from "./notify-staff-cancellation";
import { deleteHttpTask } from "@/lib/googleTasks/deleteHttpTask";

type Args = { orderId: string; restaurantId: string; isFull: boolean };

export const cancelOrder = async ({ orderId, restaurantId, isFull }: Args) => {
  const paymentStatus = await cancelPaymentIntent({
    orderId,
    cancelledBy: "USER",
    reason: isFull ? "FULL" : "USER_DEMAND"
  });

  if (paymentStatus === "canceled") {
    await deleteHttpTask(orderId);
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
};
