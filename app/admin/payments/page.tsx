import prisma from "@/lib/prisma/client";

import { calculateDateRange } from "./_components/DateRangeEditor/util";
import { PaymentsPage } from "./_components/PaymentsPage";

export default async function Payments({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
  const dateRange = calculateDateRange(searchParams);

  const payments = await prisma.payment.findMany({
    where: {
      NOT: { completedAt: null },
      completedAt: { gt: dateRange.start, lte: dateRange.end }
    },
    include: {
      order: {
        include: {
          meal: {
            include: {
              restaurant: {
                include: {
                  bankAccount: true
                }
              }
            }
          }
        }
      }
    },
    orderBy: { completedAt: "asc" }
  });

  return <PaymentsPage payments={payments} dateRange={dateRange} />;
}
