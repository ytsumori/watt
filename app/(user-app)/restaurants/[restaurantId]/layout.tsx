export default function Restaurant({
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
    </>
  );
}
