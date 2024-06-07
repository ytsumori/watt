"use server";

import { createServiceRoleClient } from "@/lib/supabase/createServiceRoleClient";
import { logger } from "@/utils/logger";
import cuid from "cuid";

type Args = {
  restaurantId: string;
  lat: number;
  lng: number;
};

export const createRestaurantCoordinates = async ({ restaurantId, lat, lng }: Args) => {
  const supabase = createServiceRoleClient();
  const { error } = await supabase.from("RestaurantCoordinates").insert({
    id: cuid(),
    restaurantId,
    point: `SRID=4326;POINT(${lat} ${lng})`
  });

  if (error) {
    logger({ severity: "ERROR", message: "Failed to create RestaurantCoordinates", payload: { error } });
    throw new Error("Failed to create RestaurantCoordinates");
  }
};
