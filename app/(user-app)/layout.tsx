import { findPreauthorizedOrder } from "@/actions/order";
import BaseLayout from "@/app/(user-app)/_components/layout-client";
import { options } from "@/lib/next-auth/options";
import { getServerSession } from "next-auth";

export default async function App({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(options);
  if (!session) {
    return <BaseLayout>{children}</BaseLayout>;
  }

  const user = session.user;
  const preauthorizedOrder = await findPreauthorizedOrder(user.id);
  return (
    <BaseLayout defaultPreauthorizedOrderId={preauthorizedOrder?.id ?? undefined} user={user}>
      {children}
    </BaseLayout>
  );
}
