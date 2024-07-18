"use server";

import prisma from "@/lib/prisma/client";

export async function checkOneTimePassword({ phoneNumber, code }: { phoneNumber: string; code: string }) {
  const onTimePassword = await prisma.oneTimePassword.findFirst({
    where: {
      phoneNumber,
      code
    }
  });
  return !!onTimePassword;
}
