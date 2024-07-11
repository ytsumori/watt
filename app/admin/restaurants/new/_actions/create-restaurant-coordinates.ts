"use server";

import { createServiceRoleClient } from "@/lib/supabase/createServiceRoleClient";
import { logger } from "@/utils/logger";
import { createId } from "@paralleldrive/cuid2";

type Args = {
  restaurantId: string;
  lat: number;
  lng: number;
};

export const createRestaurantCoordinate = async ({ restaurantId, lat, lng }: Args) => {
  const supabase = createServiceRoleClient();
  const { error } = await supabase.from("RestaurantCoordinate").insert({
    id: createId(),
    restaurantId,
    point: `SRID=4326;POINT(${lng} ${lat})`
  });

  if (error) {
    logger({ severity: "ERROR", message: "Failed to create RestaurantCoordinate", payload: { error } });
    throw new Error("Failed to create RestaurantCoordinate");
  }
};
