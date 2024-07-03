import { getSupabaseImageUrl } from "../getSupabaseImageUrl";

export const getMealImageUrl = (path: string) => {
  return getSupabaseImageUrl("meals", path);
};
