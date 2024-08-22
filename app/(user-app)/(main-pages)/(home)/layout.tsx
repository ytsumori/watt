export default function Home({
  children,
  restaurantModal
}: {
  children: React.ReactNode;
  restaurantModal: React.ReactNode;
}) {
  return (
    <>
      {children}
      {restaurantModal}
    </>
  );
}
