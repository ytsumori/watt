import HomePage from "@/app/(app)/_components/page-client";
import prisma from "@/lib/prisma";
import { PaymentMethodModal } from "./_components/payment-method-modal";

export default async function Home() {
  const meals = await prisma.meal.findMany({
    include: {
      restaurant: true,
    },
    where: {
      isDiscarded: false,
    },
  });
  return (
    <>
      <HomePage meals={meals} />
      <PaymentMethodModal />
    </>
  );
}
