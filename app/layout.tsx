import { Providers } from "./_components/providers";
import "./global.css";

export const metadata = {
  metadataBase: new URL("https://https://senbero.vercel.app"),
  title: "Watt",
  description: "My very first watt app",
};

export const revalidate = 0;

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
