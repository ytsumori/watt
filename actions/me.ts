"use server";

import { options } from "@/lib/next-auth/options";
import { getServerSession } from "next-auth/next";

export async function getMe() {
  const session = await getServerSession(options);
  if (!session) {
    return undefined;
  }
  return session.user;
}

export async function getMyId() {
  const session = await getServerSession(options);
  if (!session) {
    return undefined;
  }

  return session.user.id;
}
