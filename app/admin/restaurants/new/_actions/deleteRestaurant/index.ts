"use server";

import prisma from "@/lib/prisma/client";

type Args = { restaurantId: string };

export const deleteRestaurant = async ({ restaurantId }: Args) => {
  await prisma.restaurant.delete({ where: { id: restaurantId } });
};
