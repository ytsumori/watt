"use server";

import { PaymentOption } from "@prisma/client";
import prisma from "@/lib/prisma/client";

export async function updatePaymentOptions({
  restaurantId,
  options
}: {
  restaurantId: string;
  options: PaymentOption[];
}) {
  await prisma.restaurant.update({
    where: { id: restaurantId },
    data: {
      paymentOptions: {
        deleteMany: {
          option: { notIn: options }
        }
      }
    }
  });
  await Promise.all(
    options.map((option) =>
      prisma.restaurantPaymentOption.upsert({
        where: { restaurantId_option: { restaurantId, option } },
        update: {},
        create: { restaurantId, option }
      })
    )
  );
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: restaurantId },
    select: { id: true, paymentOptions: true }
  });
  if (!restaurant) throw new Error("Restaurant not found");
  return restaurant;
}
