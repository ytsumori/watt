"use server";

import prisma from "@/lib/prisma/client";
import { Prisma } from "@prisma/client";

export async function updateUser({ id, data }: { id: string; data: Prisma.UserUpdateInput }) {
  return prisma.user.update({
    where: {
      id
    },
    data
  });
}
