"use server";

import { options } from "@/lib/next-auth/options";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma/client";
import { findInProgressOrder } from "@/app/(user-app)/_actions/findInProgressOrder";

export async function getInProgressOrder() {
  const session = await getServerSession(options);
  if (!session) return null;

  const sessionUser = session.user;
  const user = await prisma.user.findUnique({ where: { id: sessionUser.id } });
  if (!user) return null;

  return await findInProgressOrder(user.id);
}
