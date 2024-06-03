"use server";

import prisma from "@/lib/prisma/client";

export async function findMeal(id: string) {
  return await prisma.meal.findUnique({
    where: {
      id
    }
  });
}
