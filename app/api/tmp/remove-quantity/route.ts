import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/client";
import { createMiddlewareSupabase } from "@/lib/supabase/middleware";

export async function GET() {
  const supabase = createMiddlewareSupabase();
  const { data, error } = await supabase.auth.getUser();
  const isAuthedUser = !(error || !data?.user);
  if (!isAuthedUser) {
    return new NextResponse("Unauthorized", {
      status: 401
    });
  }

  const orderMeals = await prisma.orderMeal.findMany({
    where: {
      quantity: 2
    },
    select: {
      id: true,
      orderId: true,
      mealId: true,
      options: {
        select: {
          mealItemOptionId: true
        }
      }
    }
  });

  await Promise.all(
    orderMeals.map(async (orderMeal) => {
      await prisma.$transaction([
        prisma.orderMeal.create({
          data: {
            orderId: orderMeal.orderId,
            mealId: orderMeal.mealId,
            options: {
              createMany: {
                data: orderMeal.options.map((option) => {
                  return { mealItemOptionId: option.mealItemOptionId };
                })
              }
            }
          }
        }),
        prisma.orderMeal.update({ where: { id: orderMeal.id }, data: { quantity: null } })
      ]);
    })
  );

  return NextResponse.json({ success: true });
}
