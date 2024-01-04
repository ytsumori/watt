import BaseLayout from "@/components/base-layout";
import { Providers } from "../provider";

export const metadata = {
  metadataBase: new URL("https://postgres-prisma.vercel.app"),
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
    <html lang="jp">
      <body>
        <Providers>
          <BaseLayout>
            {children}
            {modal}
          </BaseLayout>
        </Providers>
      </body>
    </html>
  );
}
