import { LineLoginProvider } from "./_components/line-login-provider";

export const metadata = {
  title: "飲食店向け管理画面",
  description: "飲食店向け管理画面"
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  return <LineLoginProvider>{children}</LineLoginProvider>;
}
