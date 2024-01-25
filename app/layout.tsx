import { Providers } from "./provider";
import "./global.css";

export const metadata = {
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
