"use server";

import prisma from "@/lib/prisma/client";
import { createServiceRoleClient } from "@/lib/supabase/createServiceRoleClient";
import { RestaurantMenuImage } from "@prisma/client";
import { randomUUID } from "crypto";

export const uploadMenuImage = async (restaurantId: string, maxNum: number, formData: FormData) => {
  const restaurant = await prisma.restaurant.findUnique({ where: { id: restaurantId } });
  if (!restaurant) throw new Error("restaurant not found");

  const files = formData.getAll("image") as File[] | null;

  if (!files) throw new Error("file not found");

  const supabase = createServiceRoleClient();

  const createMenuImages = async (file: File, menuNumber: number) => {
    const { data, error } = await supabase.storage.from("menus").upload(`${restaurantId}/${randomUUID()}`, file);
    if (error) throw new Error("fail to upload image", error);

    const menuImage = await prisma.restaurantMenuImage.create({
      data: { restaurantId, menuNumber, imagePath: data.path }
    });
    return menuImage;
  };

  return await Promise.all(files.map((file, idx) => createMenuImages(file, maxNum + idx + 1)));
};

type MoveImageProps = { restaurantId: string; currentPosition: number };

export const moveImageNext = async ({ restaurantId, currentPosition }: MoveImageProps) => {
  return await prisma.restaurantMenuImage.update({
    where: { id: restaurantId },
    data: { menuNumber: currentPosition + 1 }
  });
};

export const moveImagePrevious = async ({ restaurantId, currentPosition }: MoveImageProps) => {
  return await prisma.restaurantMenuImage.update({
    where: { id: restaurantId },
    data: { menuNumber: currentPosition - 1 }
  });
};
