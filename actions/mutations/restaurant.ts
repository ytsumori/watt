"use server";

import prisma from "@/lib/prisma/client";
import { createServiceRoleClient } from "@/lib/supabase/createServiceRoleClient";
import { RestaurantStatus } from "@prisma/client";
import { randomUUID } from "crypto";

export async function updateRestaurantStatusAutomatically({
  id,
  status
}: {
  id: string;
  status: Exclude<RestaurantStatus, "PACKED">;
}) {
  return await prisma.restaurant.update({
    where: { id },
    data: { status }
  });
}

export async function updateRestaurantStatus({
  id,
  status,
  isInAdvance
}: {
  id: string;
  status: RestaurantStatus;
  isInAdvance?: boolean;
}) {
  const restaurant = await prisma.restaurant.findUnique({ where: { id } });
  if (!restaurant) throw new Error("restaurant not found");

  const previousStatus = restaurant.status;
  return await prisma.restaurant.update({
    where: {
      id
    },
    data: {
      status,
      ...(isInAdvance
        ? {
            statusChanges: {
              create: {
                from: previousStatus,
                to: status
              }
            }
          }
        : {}),
      closedAlerts: {
        ...(status === "OPEN"
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

export async function updateRestaurantFullStatusAvailability({
  id,
  isFullStatusAvailable
}: {
  id: string;
  isFullStatusAvailable: boolean;
}) {
  return await prisma.restaurant.update({
    where: { id },
    data: { isFullStatusAvailable }
  });
}
