import prisma from "@/lib/prisma/client";
import { PaymentsPageClient } from "./_components/page-client";

export default async function PaymentsPage() {
  const payments = await prisma.payment.findMany({
    include: {
      order: {
        include: {
          meal: {
            include: { restaurant: true },
          },
          user: true,
        },
      },
    },
  });
  return <PaymentsPageClient payments={payments} />;
}
