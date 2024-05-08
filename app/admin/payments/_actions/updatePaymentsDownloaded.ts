"use server";

import prisma from "@/lib/prisma/client";

export async function updatePaymentsDownloaded({ paymentIds }: { paymentIds: string[] }) {
  return await prisma.payment.updateMany({
    where: {
      id: { in: paymentIds }
    },
    data: {
      isCsvDownloaded: true
    }
  });
}
