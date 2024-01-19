import { LineLoginLayout } from "./_components/layout-client";

export const metadata = {
  title: "飲食店向け管理画面 | Watt",
  description: "飲食店向け管理画面 | Watt",
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LineLoginLayout>{children}</LineLoginLayout>;
}
