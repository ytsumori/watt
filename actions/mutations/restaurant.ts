"use server";

import prisma from "@/lib/prisma/client";
import { createServiceRoleClient } from "@/lib/supabase/createServiceRoleClient";
import { randomUUID } from "crypto";

export async function updateIsOpen({ id, isOpen }: { id: string; isOpen: boolean }) {
  return await prisma.restaurant.update({
    where: {
      id
    },
    data: {
      isOpen,
      closedAlerts: {
        ...(isOpen
          ? {
              updateMany: {
                where: {
                  openAt: null
                },
                data: {
                  openAt: new Date()
                }
              }
            }
          : { create: {} })
      }
    }
  });
}

export async function uploadInteriorImage(restaurantId: string, formData: FormData) {
  const restaurant = await prisma.restaurant.findUnique({ where: { id: restaurantId } });
  if (!restaurant) throw new Error("restaurant not found");

  const file = formData.get("image") as File | null;
  if (!file) throw new Error("file not found");

  const supabase = createServiceRoleClient();
  const { data, error } = await supabase.storage
    .from("restaurant-interiors")
    .upload(`${restaurantId}/${randomUUID()}`, file);
  if (error) {
    console.error("fail to upload image", error);
    throw new Error("fail to upload image", error);
  }

  await prisma.restaurant.update({ where: { id: restaurantId }, data: { interiorImagePath: data.path } });

  return data.path;
}

export async function updateRestaurantPublishment({ id, isPublished }: { id: string; isPublished: boolean }) {
  return await prisma.restaurant.update({
    where: { id },
    data: { isPublished }
  });
}
