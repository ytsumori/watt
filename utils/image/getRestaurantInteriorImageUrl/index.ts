import { getSupabaseImageUrl } from "../getSupabaseImageUrl";

export const getRestaurantInteriorImageUrl = (path: string, size?: { width: number; height: number }) => {
  return getSupabaseImageUrl("restaurant-interiors", path, size);
};
