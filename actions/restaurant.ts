"use server";

import prisma from "@/lib/prisma/client";

export async function findRestaurant(id: string) {
  return await prisma.restaurant.findUnique({
    where: {
      id,
    },
  });
}

export async function updateIsOpen({
  id,
  isOpen,
}: {
  id: string;
  isOpen: boolean;
}) {
  return await prisma.restaurant.update({
    where: {
      id,
    },
    data: {
      isOpen,
    },
  });
}

export async function createRestaurant({
  name,
  googleMapPlaceId,
}: {
  name: string;
  googleMapPlaceId: string;
}) {
  return await prisma.restaurant.create({
    data: {
      name,
      googleMapPlaceId,
      tokens: {
        create: {},
      },
    },
    include: {
      tokens: true,
    },
  });
}
