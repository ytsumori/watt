"use server";

import prisma from "@/lib/prisma";
import { getMyId } from "./me";

export async function createPaypayCustomer(paypayUserAuthorizationId: string) {
  const userId = await getMyId();

  return await prisma.paypayCustomer.create({
    data: { userId, paypayUserAuthorizationId },
  });
}
