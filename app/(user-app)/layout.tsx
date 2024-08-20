import { InProgressOrderModal } from "./_components/InProgressOrderModal";

export default function UserAppLayout({
  children,
  mealModal
}: {
  children: React.ReactNode;
  mealModal: React.ReactNode;
}) {
  return (
    <>
      {children}
      {mealModal}
      <InProgressOrderModal />
    </>
  );
}
