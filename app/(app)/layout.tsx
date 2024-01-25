import BaseLayout from "@/components/base-layout";

export const metadata = {
  title: "Senbero",
  description: "My very first senbero app",
};

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <BaseLayout>
      {children}
      {modal}
    </BaseLayout>
  );
}
