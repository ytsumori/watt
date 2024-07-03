import { getSupabaseImageUrl } from "../getSupabaseImageUrl";

export const getRestaurantInteriorImageUrl = (path: string) => {
  return getSupabaseImageUrl("restaurant-interiors", path);
};
