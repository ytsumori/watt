import prisma from "@/lib/prisma/client";
import { MealPage } from "./_components/MealPage";
import { redirect } from "next/navigation";

type Params = {
  mealId: string;
};

export default async function Meal({ params }: { params: Params }) {
  const meal = await prisma.meal.findUnique({
    where: { id: params.mealId }
  });
  if (!meal) {
    redirect("/");
  }

  return <MealPage meal={meal} />;
}
