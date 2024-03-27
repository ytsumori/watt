"use server";

import { sendOtpCode } from "@/lib/karaden";
import prisma from "@/lib/prisma/client";

function generateOtpCode() {
  let digits = "0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += digits[Math.floor(Math.random() * digits.length)];
  }
  return code;
}

export async function generateOneTimePassword(phoneNumber: string) {
  const code = generateOtpCode();

  await prisma.oneTimePassword.upsert({
    where: {
      phoneNumber,
    },
    update: {
      code,
    },
    create: {
      phoneNumber,
      code,
    },
  });

  const status = await sendOtpCode(phoneNumber, code);

  return status;
}

export async function checkOneTimePassword({ phoneNumber, code }: { phoneNumber: string; code: string }) {
  const onTimePassword = await prisma.oneTimePassword.findFirst({
    where: {
      phoneNumber,
      code,
    },
  });
  return !!onTimePassword;
}
