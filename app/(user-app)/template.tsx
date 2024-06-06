import { options } from "@/lib/next-auth/options";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma/client";
import { findInProgressOrder } from "./_actions/findInProgressOrder";
import { InProgressOrderModal } from "./_components/InProgressOrderModal";
import { ProfileRedirect } from "./_components/ProfileRedirect";

export default async function UserApp({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(options);
  if (!session) return <>{children}</>;

  const sessionUser = session.user;
  const user = await prisma.user.findUnique({ where: { id: sessionUser.id } });
  if (!user) return <>{children}</>;

  const inProgressOrder = await findInProgressOrder(user.id);

  return (
    <>
      {children}
      <InProgressOrderModal inProgressOrderId={inProgressOrder?.id ?? undefined} />
      <ProfileRedirect isPhoneNumberNotRegistered={!user.phoneNumber} />
    </>
  );
}
