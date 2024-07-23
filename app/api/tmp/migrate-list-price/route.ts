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

  const meals = await prisma.meal.findMany({
    where: {
      items: {
        some: {
          NOT: {
            price: null
          }
        }
      }
    },
    select: {
      id: true,
      items: {
        select: {
          price: true
        }
      }
    }
  });

  await Promise.all(
    meals.map(async (meal) => {
      const listPrice = meal.items.reduce((acc, item) => acc + (item.price ?? 0), 0);
      await prisma.meal.update({
        where: {
          id: meal.id
        },
        data: {
          listPrice
        }
      });
    })
  );

  return NextResponse.json({ success: true });
}
