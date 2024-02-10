"use server";

import prisma from "@/lib/prisma/client";

export async function getMeals({
  restaurantId,
  isDiscarded = false,
}: {
  restaurantId: string;
  isDiscarded?: boolean;
}) {
  return await prisma.meal.findMany({
    where: {
      restaurantId,
      isDiscarded,
    },
  });
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
