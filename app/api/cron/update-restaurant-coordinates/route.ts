import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/createServiceRoleClient";
import { logger } from "@/utils/logger";
import prisma from "@/lib/prisma/client";
import { createId } from "@paralleldrive/cuid2";
import { getPlaceDetail } from "@/lib/places-api/actions";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) return new NextResponse("Unauthorized", { status: 401 });

  const supabase = createServiceRoleClient();
  const restaurants = await prisma.restaurant.findMany({
    select: {
      id: true,
      googleMapPlaceId: true,
      coordinate: {
        select: {
          id: true
        }
      }
    }
  });

  const upsertData = await Promise.all(
    restaurants
      .filter((restaurant) => restaurant.coordinate)
      .map(async (restaurant) => {
        const result = await getPlaceDetail({ placeId: restaurant.googleMapPlaceId });
        return {
          id: restaurant.coordinate!.id,
          restaurantId: restaurant.id,
          point: `SRID=4326;POINT(${result.location.longitude} ${result.location.latitude})`,
          updatedAt: new Date().toISOString()
        };
      })
  );

  const insertData = await Promise.all(
    restaurants
      .filter((restaurant) => restaurant.coordinate === null)
      .map(async (restaurant) => {
        const result = await getPlaceDetail({ placeId: restaurant.googleMapPlaceId });

        return {
          id: createId(),
          restaurantId: restaurant.id,
          point: `SRID=4326;POINT(${result.location.longitude} ${result.location.latitude})`
        };
      })
  );

  const { error: coordinatesError } = await supabase
    .from("RestaurantCoordinate")
    .upsert(upsertData, { onConflict: "restaurantId" });
  const { error: insertError } = await supabase.from("RestaurantCoordinate").insert(insertData);

  if (coordinatesError) {
    logger({ severity: "ERROR", message: "Failed to create RestaurantGeometry", payload: { ...coordinatesError } });
    return NextResponse.json({ success: false }, { status: Number(coordinatesError.code) });
  }

  if (insertError) {
    logger({ severity: "ERROR", message: "Failed to create RestaurantGeometry", payload: { ...insertError } });
    return NextResponse.json({ success: false }, { status: Number(insertError.code) });
  }

  return NextResponse.json({ success: true });
}
