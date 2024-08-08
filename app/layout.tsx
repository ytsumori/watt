import { GoogleAnalytics } from "@next/third-parties/google";
import { Providers } from "./_components/providers";
import "./global.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://watt.jp.net/"),
  title: {
    default: "Watt",
    template: "%s | Watt"
  },
  description: "今すぐ入れるお店が見つかる！"
};

export const revalidate = 0;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="jp">
      <body>
        <Providers>{children}</Providers>
      </body>
      {process.env.GOOGLE_ANALYTICS_MEASUREMENT_ID && (
        <GoogleAnalytics gaId={process.env.GOOGLE_ANALYTICS_MEASUREMENT_ID} />
      )}
    </html>
  );
}
