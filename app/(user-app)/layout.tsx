import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import { InProgressOrderModal } from "./_components/InProgressOrderModal";

export default function UserApp({ children }: { children: React.ReactNode; homeModal: React.ReactNode }) {
  return (
    <>
      {children}
      {process.env.GOOGLE_ANALYTICS_MEASUREMENT_ID && (
        <GoogleAnalytics gaId={process.env.GOOGLE_ANALYTICS_MEASUREMENT_ID} />
      )}
      {process.env.GOOGLE_TAG_MANAGER_ID && <GoogleTagManager gtmId={process.env.GOOGLE_TAG_MANAGER_ID} />}
      <InProgressOrderModal />
    </>
  );
}
