"use server";

import prisma from "@/lib/prisma";
import { BankAccountType } from "@prisma/client";

export async function createRestaurantBankAccount({
  restaurantId,
  bankCode,
  branchCode,
  accountType,
  accountNo,
  holderName,
}: {
  restaurantId: string;
  bankCode: string;
  branchCode: string;
  accountType: BankAccountType;
  accountNo: string;
  holderName: string;
}) {
  return await prisma.restaurantBankAccount.create({
    data: {
      restaurantId: restaurantId,
      bankCode,
      branchCode,
      accountType,
      accountNo,
      holderName,
    },
  });
}
