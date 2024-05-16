"use server";

import { formatPhoneNumber, isValidPhoneNumber } from "@/utils/phone-number";
import prisma from "@/lib/prisma/client";

export async function updatePhoneNumber({ restaurantId, phoneNumber }: { restaurantId: string; phoneNumber: string }) {
  if (!isValidPhoneNumber(phoneNumber)) {
    throw new Error("Invalid phone number");
  }
  const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
  return await prisma.restaurant.update({
    where: { id: restaurantId },
    data: { phoneNumber: formattedPhoneNumber }
  });
}
