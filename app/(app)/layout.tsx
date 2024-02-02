import BaseLayout from "@/app/(app)/_components/layout-client";

export default async function App({ children }: { children: React.ReactNode }) {
  return <BaseLayout>{children}</BaseLayout>;
}
