import { redirect } from "next/navigation";

type Params = { params: { restaurantId: string } };

export default function Meal({ params }: Params) {
  redirect(`/restaurants/${params.restaurantId}`);
}
