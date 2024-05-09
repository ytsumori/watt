import { findPreorder } from "@/actions/order";
import UserAppLayout from "@/app/(user-app)/_components/UserAppLayout";
import { options } from "@/lib/next-auth/options";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma/client";

export default async function App({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(options);
  if (!session) return <UserAppLayout>{children}</UserAppLayout>;

  const sessionUser = session.user;
  const user = await prisma.user.findUnique({ where: { id: sessionUser.id } });
  if (!user) return <UserAppLayout>{children}</UserAppLayout>;

  const preauthorizedOrder = await findPreorder(user.id);

  return (
    <UserAppLayout defaultPreauthorizedOrderId={preauthorizedOrder?.id ?? undefined} user={user}>
      {children}
    </UserAppLayout>
  );
}
