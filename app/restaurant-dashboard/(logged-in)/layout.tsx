import { RestaurantIdProvider } from "./_components/RestaurantIdProvider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <RestaurantIdProvider>{children}</RestaurantIdProvider>;
}
