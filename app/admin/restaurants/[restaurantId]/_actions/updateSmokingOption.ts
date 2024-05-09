"use server";

import { SmokingOption } from "@prisma/client";
import prisma from "@/lib/prisma/client";

export async function updateSmokingOptions({ restaurantId, option }: { restaurantId: string; option: SmokingOption }) {
  return await prisma.restaurant.update({
    where: { id: restaurantId },
    data: { smokingOption: option }
  });
}
