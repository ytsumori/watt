import { FirebaseLoginLayout } from "./_components/layout-client";

export const metadata = {
  title: "管理画面 | Watt",
  description: "管理画面 | Watt",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <FirebaseLoginLayout>{children}</FirebaseLoginLayout>;
}
