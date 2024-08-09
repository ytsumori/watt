import prisma from "@/lib/prisma/client";
import { options } from "@/lib/next-auth/options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { MealDetailModalPage } from "./_components/MealDetailModalPage";

type Params = { params: { mealId: string } };

export default async function MealDetail({ params }: Params) {
  const meal = await prisma.meal.findUnique({
    where: { id: params.mealId, isInactive: false, outdatedAt: null },
    include: {
      restaurant: true,
      items: { include: { options: true } }
    }
  });

  if (!meal) redirect("/");

  const session = await getServerSession(options);
  const isLogined = !!session;

  return <MealDetailModalPage meal={meal} isLogined={isLogined} />;
}
