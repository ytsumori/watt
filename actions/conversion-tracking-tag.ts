"use server";

import prisma from "@/lib/prisma/client";

export async function createConversionTrackingTag(title: string) {
  return await prisma.conversionTrackingTag.create({
    data: {
      title,
    },
  });
}
