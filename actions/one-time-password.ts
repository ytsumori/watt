"use server";

import prisma from "@/lib/prisma/client";
import { sendOtpCode } from "@/lib/xoxzo";
import { formatPhoneNumber, isValidPhoneNumber } from "@/utils/phone-number";

function generateOtpCode() {
  let digits = "0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += digits[Math.floor(Math.random() * digits.length)];
  }
  return code;
}

export async function generateOneTimePassword(phoneNumber: string) {
  if (!isValidPhoneNumber(phoneNumber)) {
    throw new Error("Invalid phone number");
  }
  phoneNumber = formatPhoneNumber(phoneNumber);
  const code = generateOtpCode();

  await prisma.oneTimePassword.upsert({
    where: {
      phoneNumber
    },
    update: {
      code
    },
    create: {
      phoneNumber,
      code
    }
  });

  await sendOtpCode(phoneNumber, code);

  return phoneNumber;
}

export async function checkOneTimePassword({ phoneNumber, code }: { phoneNumber: string; code: string }) {
  const onTimePassword = await prisma.oneTimePassword.findFirst({
    where: {
      phoneNumber,
      code
    }
  });
  return !!onTimePassword;
}
