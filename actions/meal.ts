"use server";

import prisma from "@/lib/prisma/client";
import { Prisma } from "@prisma/client";

export async function findMeal(id: string) {
  return await prisma.meal.findUnique({
    where: {
      id
    }
  });
}

export async function getMeals(args: Prisma.MealFindManyArgs) {
  return await prisma.meal.findMany(args);
}

type MealCreateInput = Pick<Prisma.MealCreateInput, "title" | "description" | "imageUrl" | "imagePath" | "price"> & {
  restaurantId: string;
};

export async function createMeal({ restaurantId, price, imageUrl, imagePath, title, description }: MealCreateInput) {
  await prisma.meal.create({ data: { restaurantId, price, imageUrl, imagePath, title, description } });
}

export async function discardMeal({ id }: { id: string }) {
  return await prisma.meal.update({
    where: {
      id
    },
    data: {
      isDiscarded: true
    }
  });
}

export async function activateMeal({ id }: { id: string }) {
  return await prisma.meal.update({
    where: {
      id
    },
    data: {
      isDiscarded: false
    }
  });
}
