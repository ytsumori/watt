import { NextRequest, NextResponse } from "next/server";
import { getPlaceDetail } from "@/lib/places-api";
import { createServiceRoleClient } from "@/lib/supabase/createServiceRoleClient";
import { logger } from "@/utils/logger";
import { Database } from "@/types/supabase";

type Restaurant = Database["public"]["Tables"]["Restaurant"]["Row"] & {
  RestaurantCoordinates: Database["public"]["Tables"]["RestaurantCoordinates"]["Row"][];
};

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) return new NextResponse("Unauthorized", { status: 401 });

  const supabase = createServiceRoleClient();
  const { data: restaurants, error: restaurantError } = await supabase
    .from("Restaurant")
    .select(`*, RestaurantCoordinates!inner (*)`);

  if (restaurantError) {
    logger({ severity: "ERROR", message: "Failed to fetch Restaurant", payload: { ...restaurantError } });
    return NextResponse.json({ success: false }, { status: Number(restaurantError.code) });
  }

  const upsertData = await Promise.all(
    restaurants.map(async (restaurant: Restaurant) => {
      const result = await getPlaceDetail({ placeId: restaurant.googleMapPlaceId });
      return {
        id: restaurant.RestaurantCoordinates[0].id,
        restaurantId: restaurant.id,
        point: `SRID=4326;POINT(${result.location.latitude} ${result.location.longitude})`,
        updatedAt: new Date().toISOString()
      };
    })
  );

  const { error: coordinatesError } = await supabase
    .from("RestaurantCoordinates")
    .upsert(upsertData, { onConflict: "restaurantId" });

  if (coordinatesError) {
    logger({ severity: "ERROR", message: "Failed to create RestaurantGeometry", payload: { ...coordinatesError } });
    return NextResponse.json({ success: false }, { status: Number(coordinatesError.code) });
  }

  return NextResponse.json({ success: true });
}
