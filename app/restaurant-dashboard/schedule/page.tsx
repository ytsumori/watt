import { DashboardSchedule } from "./_components/page-client-component";

export default async function Dashboard() {
  const restaurantId = "clqyruucj0000zcz3w2yhk6oa";
  return (
    <DashboardSchedule
      restaurantId={restaurantId}
      defaultOpenHours={[
        { id: "a", day: 1, start: "10:00", end: "15:00" },
        { id: "b", day: 2, start: "18:00", end: "20:00" },
        { id: "c", day: 3, start: "10:00", end: "15:00" },
      ]}
    />
  );
}
