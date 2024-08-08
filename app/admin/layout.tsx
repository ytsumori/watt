import { AdminDashboardLayout } from "./_components/AdminLayout";

export const metadata = {
  title: "管理画面",
  description: "管理画面"
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminDashboardLayout>{children}</AdminDashboardLayout>;
}
