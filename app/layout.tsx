import { GoogleAnalytics } from "@next/third-parties/google";
import { Providers } from "./_components/providers";
import "./global.css";

export const metadata = {
  metadataBase: new URL("https://watt-kiizan-kiizan.vercel.app/"),
  title: "Watt",
  description: "今入れるお店が見つかる！"
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
