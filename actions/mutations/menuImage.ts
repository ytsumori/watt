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

export const updateMenuImages = async (defaultMenuImages: RestaurantMenuImage[], menuImages: RestaurantMenuImage[]) => {
  const menuImageDiff = defaultMenuImages.filter((defaultMenuImage) => {
    const menuImage = menuImages.find((menuImage) => menuImage.id === defaultMenuImage.id);
    return menuImage && defaultMenuImage.menuNumber !== menuImage.menuNumber;
  });
  if (menuImageDiff.length === 0) return;
  return await Promise.all(
    menuImages.map(
      async (menuImage) => await prisma.restaurantMenuImage.update({ data: menuImage, where: { id: menuImage.id } })
    )
  );
};
