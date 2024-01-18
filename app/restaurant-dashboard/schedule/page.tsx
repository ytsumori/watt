import { findRestaurant } from "@/actions/restaurant";
import { DashboardSchedule } from "./_components/page-client-component";
import { getOpenHours } from "@/actions/restaurantOpenHour";

export default async function Dashboard() {
  const restaurantId = "clqyruucj0000zcz3w2yhk6oa";
  const restaurant = await findRestaurant(restaurantId);
  if (!restaurant) {
    throw new Error("Restaurant not found");
  }
  const openHours = await getOpenHours({ restaurantId });

  return (
    <DashboardSchedule
      restaurantId={restaurant.id}
      defaultIsOpen={restaurant.isOpen}
      defaultOpenHours={openHours}
    />
  );
}
