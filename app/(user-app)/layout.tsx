import { findPreauthorizedOrder } from "@/actions/order";
import UserAppLayout from "@/app/(user-app)/_components/UserAppLayout";
import { options } from "@/lib/next-auth/options";
import { getServerSession } from "next-auth";

export default async function App({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(options);
  if (!session) {
    return <UserAppLayout>{children}</UserAppLayout>;
  }

  const user = session.user;
  const preauthorizedOrder = await findPreauthorizedOrder(user.id);
  return (
    <UserAppLayout defaultPreauthorizedOrderId={preauthorizedOrder?.id ?? undefined} user={user}>
      {children}
    </UserAppLayout>
  );
}
