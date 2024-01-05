import { getMeals } from "@/actions/meal";
import { DashboardClientComponent } from "./_components/page-client-component";

export default async function Dashboard() {
  const restaurantId = "clqyruucj0000zcz3w2yhk6oa";
  const meals = await getMeals({ restaurantId });
  const discardedMeals = await getMeals({ restaurantId, isDiscarded: true });
  return (
    <DashboardClientComponent
      restaurantId={restaurantId}
      defaultMeals={meals}
      defaultDiscardedMeals={discardedMeals}
    />
  );
}
