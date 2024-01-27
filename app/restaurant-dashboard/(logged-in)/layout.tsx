import { LoggedInLayout } from "./_components/layout-client";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <LoggedInLayout>{children}</LoggedInLayout>;
}
