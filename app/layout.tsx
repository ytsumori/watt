import { Providers } from "./provider";
import "./global.css";

export const metadata = {
  metadataBase: new URL("https://https://senbero.vercel.app"),
  title: "Senbero",
  description: "My very first senbero app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="jp">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
