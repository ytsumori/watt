export default function OrderDetail({
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
    </>
  );
}
