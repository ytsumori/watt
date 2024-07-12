import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma/client";
import { notifySlack } from "./_actions/notify-slack";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", {
      status: 401
    });
  }

  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  const restaurants = await prisma.restaurantClosedAlert.findMany({
    where: {
      openAt: null,
      notifiedAt: {
        lte: oneDayAgo,
        gte: twoDaysAgo
      }
    },
    select: { restaurant: { select: { name: true } } }
  });

  if (restaurants.length === 0) {
    return NextResponse.json({ success: true });
  }

  await notifySlack({ restaurantNames: restaurants.map((r) => r.restaurant.name) });

  return NextResponse.json({ success: true });
}
