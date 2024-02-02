import BaseLayout from "@/app/(app)/_components/layout-client";

export const metadata = {
  title: "Senbero",
  description: "My very first senbero app",
};

export default async function App({ children }: { children: React.ReactNode }) {
  return <BaseLayout>{children}</BaseLayout>;
}
