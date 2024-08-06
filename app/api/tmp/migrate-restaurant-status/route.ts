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

  const restaurants = await prisma.restaurant.findMany({ select: { id: true, isOpen: true } });

  await Promise.all(
    restaurants.map(async (restaurant) => {
      await prisma.restaurant.update({
        where: {
          id: restaurant.id
        },
        data: {
          status: restaurant.isOpen ? "OPEN" : "CLOSED"
        }
      });
    })
  );

  return NextResponse.json({ success: true });
}
