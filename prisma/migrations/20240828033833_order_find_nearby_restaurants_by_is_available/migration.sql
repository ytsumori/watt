create or replace function find_nearby_restaurants(lat float, long float)
  RETURNS TABLE (
    id TEXT,
    distance FLOAT
  )
  language sql
  as $$
select
  "Restaurant".id,
  st_distance(
    "RestaurantCoordinate".point,
    st_setsrid(st_point(long, lat), 4326)
  ) as distance
from "Restaurant"
join "RestaurantCoordinate" ON "Restaurant".id = "RestaurantCoordinate"."restaurantId"
order by "Restaurant"."isAvailable" desc, point <-> st_setsrid(st_point(long, lat)::geography, 4326)
  $$;