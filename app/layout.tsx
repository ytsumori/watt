import "./globals.css";
import { Inter } from "next/font/google";
import { Providers } from "./provider";

export const metadata = {
  metadataBase: new URL("https://postgres-prisma.vercel.app"),
  title: "Senbero",
  description: "My very first senbero app",
};

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="jp">
      <body className={inter.variable}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
