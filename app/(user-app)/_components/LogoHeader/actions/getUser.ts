"use server";

import prisma from "@/lib/prisma/client";
import { options } from "@/lib/next-auth/options";
import { getServerSession } from "next-auth";

export async function getUser() {
  const session = await getServerSession(options);
  let user;
  if (session?.user) {
    user = await prisma.user.findUnique({ where: { id: session.user.id } });
  }
  return user ?? undefined;
}
