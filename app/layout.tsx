import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://watt.jp.net"),
  title: {
    default: "Watt",
    template: "%s | Watt"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="jp">
      <body>{children}</body>
    </html>
  );
}
