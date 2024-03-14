"use server";

import prisma from "@/lib/prisma/client";
import { Prisma } from "@prisma/client";

export async function findMeal(id: string) {
  return await prisma.meal.findUnique({
    where: {
      id,
    },
  });
}

export async function getMeals(args: Prisma.MealFindManyArgs) {
  return await prisma.meal.findMany(args);
}

export async function createMeal({
  restaurantId,
  price,
  imageUrl,
  title,
  description,
}: {
  restaurantId: string;
  price: number;
  imageUrl: string;
  title: string;
  description?: string;
}) {
  await prisma.meal.create({
    data: {
      restaurantId,
      price,
      imageUrl,
      title,
      description,
    },
  });
}

export async function discardMeal({ id }: { id: string }) {
  return await prisma.meal.update({
    where: {
      id,
    },
    data: {
      isDiscarded: true,
    },
  });
}

export async function activateMeal({ id }: { id: string }) {
  return await prisma.meal.update({
    where: {
      id,
    },
    data: {
      isDiscarded: false,
    },
  });
}
