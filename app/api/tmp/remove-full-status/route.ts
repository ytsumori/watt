import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/client";
import { createMiddlewareSupabase } from "@/lib/supabase/middleware";

export async function GET() {
  const supabase = createMiddlewareSupabase();
  const { data, error } = await supabase.auth.getUser();
  const isAuthorized = !(error || !data?.user);

  if (!isAuthorized) {
    return new NextResponse("Unauthorized", {
      status: 401
    });
  }

  const restaurants = await prisma.restaurant.findMany({
    where: {
      status: {
        not: null
      }
    }
  });

  Promise.all(
    restaurants.map(async (restaurant) => {
      await prisma.restaurant.update({
        where: { id: restaurant.id },
        data: {
          isAvailable: restaurant.status === "OPEN"
        }
      });
    })
  );

  return NextResponse.json({ success: true });
}
