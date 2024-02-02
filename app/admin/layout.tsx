import { FirebaseLoginProvider } from "./_components/firebase-login-provider";

export const metadata = {
  title: "管理画面 | Watt",
  description: "管理画面 | Watt",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <FirebaseLoginProvider>{children}</FirebaseLoginProvider>;
}
