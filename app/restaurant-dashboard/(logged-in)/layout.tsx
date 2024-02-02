import { RestaurantIdProvider } from "./_components/restaurant-id-provider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <RestaurantIdProvider>{children}</RestaurantIdProvider>;
}
