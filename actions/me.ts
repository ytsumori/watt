"use server";

import { options } from "@/lib/next-auth/options";
import { getServerSession } from "next-auth/next";

export async function getMyId() {
  const session = await getServerSession(options);
  if (!session) {
    throw new Error("Unauthorized");
  }

  return session.user.id;
}
