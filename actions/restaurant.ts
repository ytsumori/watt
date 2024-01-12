"use server";

import prisma from "@/lib/prisma";

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
