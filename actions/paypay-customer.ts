"use server";

import prisma from "@/lib/prisma/client";
import { getMyId } from "./me";

export async function createPaypayCustomer(paypayUserAuthorizationId: string) {
  const userId = await getMyId();

  if (!userId) throw new Error("User not found");

  return await prisma.paypayCustomer.create({
    data: { userId, paypayUserAuthorizationId },
  });
}
