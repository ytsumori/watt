import { Providers } from "./provider";

export const metadata = {
  metadataBase: new URL("https://postgres-prisma.vercel.app"),
  title: "Senbero",
  description: "My very first senbero app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="jp">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
