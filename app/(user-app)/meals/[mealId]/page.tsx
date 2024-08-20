import prisma from "@/lib/prisma/client";
import { options } from "@/lib/next-auth/options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { getMealImageUrl } from "@/utils/image/getMealImageUrl";
import { MealDetailPage } from "@/app/(user-app)/_components/MealDetailPage";
import { Box } from "@chakra-ui/react";

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
  const isLoggedIn = !!session;

  return (
    <Box p={4}>
      <MealDetailPage meal={meal} isLoggedIn={isLoggedIn} />
    </Box>
  );
}

export async function generateMetadata({ params }: Params): Promise<Metadata | undefined> {
  const meal = await prisma.meal.findUnique({ where: { id: params.mealId }, include: { restaurant: true } });
  return meal?.imagePath
    ? { title: `${meal.restaurant.name} | Watt`, openGraph: { images: [getMealImageUrl(meal.imagePath)] } }
    : undefined;
}
