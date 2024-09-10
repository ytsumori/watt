import prisma from "@/lib/prisma/client";
import { redirect } from "next/navigation";
import { MealDetailModalPage } from "./_components/MealDetailModalPage";

type Params = { params: { mealId: string } };

export default async function Restaurant({ params }: Params) {
  const meal = await prisma.meal.findUnique({
    where: { id: params.mealId, isInactive: false, outdatedAt: null },
    include: {
      restaurant: true,
      items: { include: { options: true } }
    }
  });

  if (!meal) redirect("/");

  return <MealDetailModalPage meal={meal} />;
}
