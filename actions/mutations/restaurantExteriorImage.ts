"use server";

import prisma from "@/lib/prisma/client";
import { createServiceRoleClient } from "@/lib/supabase/createServiceRoleClient";
import { randomUUID } from "crypto";

export const uploadExteriorImage = async (restaurantId: string, formData: FormData) => {
  const restaurant = await prisma.restaurant.findUnique({ where: { id: restaurantId } });
  if (!restaurant) throw new Error("restaurant not found");

  const file = formData.get("image") as File | null;
  if (!file) throw new Error("file not found");

  const supabase = createServiceRoleClient();
  const { data, error } = await supabase.storage
    .from("restaurant-exteriors")
    .upload(`${restaurantId}/${randomUUID()}`, file);
  if (error) {
    console.error("fail to upload image", error);
    throw new Error("fail to upload image", error);
  }

  await prisma.restaurantExteriorImage.upsert({
    where: { restaurantId },
    update: { imagePath: data.path },
    create: { restaurantId, imagePath: data.path }
  });

  return data.path;
};
