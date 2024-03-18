"use server";

import prisma from "@/lib/prisma/client";
import { Prisma } from "@prisma/client";

export async function findRestaurant<T extends Prisma.RestaurantFindUniqueArgs>(
  args: Prisma.SelectSubset<T, Prisma.RestaurantFindUniqueArgs>
) {
  return await prisma.restaurant.findUnique<Prisma.SelectSubset<T, Prisma.RestaurantFindUniqueArgs>>({
    ...args!,
  });
}

export async function updateIsOpen({ id, isOpen }: { id: string; isOpen: boolean }) {
  return await prisma.restaurant.update({
    where: {
      id,
    },
    data: {
      isOpen,
      isOpenManuallyUpdated: true,
    },
  });
}

export async function createRestaurant({ name, googleMapPlaceId }: { name: string; googleMapPlaceId: string }) {
  return await prisma.restaurant.create({
    data: {
      name,
      googleMapPlaceId,
    },
  });
}
