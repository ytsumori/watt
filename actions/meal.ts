"use server";

import prisma from "@/lib/prisma";

export async function createMeal(price: number, imageUrl: string) {
  const restaurantId = "clqyruucj0000zcz3w2yhk6oa";
  await prisma.meal.create({
    data: {
      restaurantId,
      price,
      imageUrl,
    },
  });
}
