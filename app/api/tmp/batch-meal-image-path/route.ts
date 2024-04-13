import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/client";
import { createServerSupabase } from "@/lib/supabase/server";
import { Meal } from "@prisma/client";

export async function GET() {
  // 完全に画像移行が完了するまでは残しておく
  // const supabase = createServerSupabase();
  // const { data, error } = await supabase.auth.getUser();
  // const isAuthedUser = !(error || !data?.user);
  // const isValidMailAddress =
  //   data?.user?.email &&
  //   (data.user.email.endsWith("@kiizan-kiizan.co.jp") || data.user.email === "miso.devel@gmail.com");

  // if (!isAuthedUser || !isValidMailAddress) {
  //   return NextResponse.json({ error: "Unauthorized" });
  // }

  // const meals = await prisma.meal.findMany();

  // const updateMealImagePath = async (meal: Meal) => {
  //   const imagePath = meal.imageUrl.split("/meals/")[1];
  //   await prisma.meal.update({ where: { id: meal.id }, data: { imagePath: imagePath ?? null } });
  // };

  // await Promise.all(meals.map(updateMealImagePath));

  return NextResponse.json({ status: "ok" });
}
