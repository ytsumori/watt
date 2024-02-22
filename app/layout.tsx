import { GoogleAnalytics } from "@next/third-parties/google";
import { ChakraProviders } from "./_components/providers";
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
      <body style={{ overscrollBehavior: "none" }}>
        <ChakraProviders>{children}</ChakraProviders>
      </body>
      {process.env.GOOGLE_ANALYTICS_MEASUREMENT_ID && (
        <GoogleAnalytics gaId={process.env.GOOGLE_ANALYTICS_MEASUREMENT_ID} />
      )}
    </html>
  );
}
