import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma/client";
import { Restaurant } from "@prisma/client";
import cuid from "cuid";
import { getPlaceDetail } from "@/lib/places-api";
import { createServiceRoleClient } from "@/lib/supabase/createServiceRoleClient";
import { logger } from "@/utils/logger";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) return new NextResponse("Unauthorized", { status: 401 });

  const supabase = createServiceRoleClient();

  const restaurants = await prisma.restaurant.findMany();

  const createRestaurantCoordinates = async (restaurant: Restaurant) => {
    const result = await getPlaceDetail({ placeId: restaurant.googleMapPlaceId });

    // cuid()は非推奨だが、prismaは内部でcuidを使っているので、(https://github.com/prisma/prisma/issues/17102)
    const { error } = await supabase.from("RestaurantCoordinates").insert({
      id: cuid(),
      restaurantId: restaurant.id,
      point: `SRID=4326;POINT(${result.location.longitude} ${result.location.latitude})`
    });
    if (error) logger({ severity: "ERROR", message: "RestaurantCoordinatesの作成に失敗しました", payload: { error } });
  };

  await Promise.all(restaurants.map(createRestaurantCoordinates));

  return NextResponse.json({ success: true });
}
