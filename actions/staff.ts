"use server";

import { verifyIdToken } from "@/lib/line-login";
import prisma from "@/lib/prisma/client";

export async function getStaffs({ lineId }: { lineId: string }) {
  return await prisma.staff.findMany({
    where: {
      lineId,
    },
  });
}

export async function createStaff({
  idToken,
  restaurantId,
  staffRegistrationToken,
}: {
  idToken: string;
  restaurantId: string;
  staffRegistrationToken: string;
}) {
  const registrationToken = await prisma.staffRegistrationToken.findUnique({
    where: {
      token: staffRegistrationToken,
      restaurantId,
    },
  });
  if (!registrationToken) {
    throw new Error("Invalid token");
  }
  const response = await verifyIdToken({ idToken });
  return await prisma.staff.create({
    data: {
      lineId: response.sub,
      restaurantId,
    },
  });
}
