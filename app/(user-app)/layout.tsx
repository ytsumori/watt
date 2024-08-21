import { InProgressOrderModal } from "./_components/InProgressOrderModal";

export default function UserAppLayout({
  children,
  restaurantMealModal
}: {
  children: React.ReactNode;
  restaurantMealModal: React.ReactNode;
}) {
  return (
    <>
      {children}
      {restaurantMealModal}
      <InProgressOrderModal />
    </>
  );
}
