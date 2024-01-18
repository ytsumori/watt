import { DashboardLayout } from "./_components/dashboard-layout";

export const metadata = {
  title: "Watt(飲食店向けページ)",
  description: "Watt(飲食店向けページ)",
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
