"use server";

import prisma from "@/lib/prisma/client";
import { Prisma } from "@prisma/client";

export async function findRestaurant<T extends Prisma.RestaurantFindUniqueArgs>(
  args: Prisma.SelectSubset<T, Prisma.RestaurantFindUniqueArgs>
) {
  return await prisma.restaurant.findUnique<Prisma.SelectSubset<T, Prisma.RestaurantFindUniqueArgs>>({
    ...args!
  });
}
