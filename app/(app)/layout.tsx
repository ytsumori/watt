import { isPaymentMethodRegistered } from "@/actions/me";
import BaseLayout from "@/app/(app)/_components/layout-client";
import { PaymentMethodModal } from "./_components/payment-method-modal";

export const metadata = {
  title: "Senbero",
  description: "My very first senbero app",
};

export default async function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      <BaseLayout>
        {children}
        {modal}
      </BaseLayout>
      <PaymentMethodModal isOpen={!(await isPaymentMethodRegistered())} />
    </>
  );
}
