import { DashboardLayout } from "./_components/dashboard-layout";

export const metadata = {
  metadataBase: new URL("https://https://senbero.vercel.app"),
  title: "Senbero",
  description: "My very first senbero app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
