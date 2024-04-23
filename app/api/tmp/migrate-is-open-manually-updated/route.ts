import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/client";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createServerSupabase();
  const { data, error } = await supabase.auth.getUser();
  const isAuthUser = !(error || !data?.user);
  const isMailAddressValid = data?.user?.email && data.user.email.endsWith("@kiizan-kiizan.co.jp");

  if (!isAuthUser || !isMailAddressValid) {
    return new NextResponse("Unauthorized", {
      status: 401
    });
  }

  const restaurants = await prisma.restaurant.findMany({
    select: {
      id: true
    },
    where: {
      isOpen: false,
      isOpenManuallyUpdated: true
    }
  });

  await prisma.restaurantClosedAlert.createMany({
    data: restaurants.map((restaurant) => ({
      restaurantId: restaurant.id
    }))
  });

  return NextResponse.json({ success: true });
}
