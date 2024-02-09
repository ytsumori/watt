import { findPreauthorizedPayment } from "@/actions/payment";
import BaseLayout from "@/app/(app)/_components/layout-client";
import { options } from "@/lib/next-auth/options";
import { getServerSession } from "next-auth";

export default async function App({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(options);
  if (!session) {
    return <BaseLayout>{children}</BaseLayout>;
  }

  const user = session.user;
  const preauthorizedPayment = await findPreauthorizedPayment(user.id);
  return (
    <BaseLayout
      preauthorizedPayment={preauthorizedPayment ?? undefined}
      user={user}
    >
      {children}
    </BaseLayout>
  );
}
