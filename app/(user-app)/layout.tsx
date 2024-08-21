import { InProgressOrderModal } from "./_components/InProgressOrderModal";

export default function UserApp({
  children,
  restaurantMealModal,
  homeModal
}: {
  children: React.ReactNode;
  restaurantMealModal: React.ReactNode;
  homeModal: React.ReactNode;
}) {
  return (
    <>
      {children}
      {restaurantMealModal}
      {homeModal}
      <InProgressOrderModal />
    </>
  );
}
