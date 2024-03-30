import { AdminDashboardLayout } from "./_components/layout-client";

export const metadata = {
  title: "管理画面 | Watt",
  description: "管理画面 | Watt",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminDashboardLayout>{children}</AdminDashboardLayout>;
}
