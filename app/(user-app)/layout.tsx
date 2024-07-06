import UserAppLayout from "@/app/(user-app)/_components/UserAppLayout";
import { options } from "@/lib/next-auth/options";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma/client";

export default async function UserApp({ children, modal }: { children: React.ReactNode; modal: React.ReactNode }) {
  const session = await getServerSession(options);
  if (!session)
    return (
      <UserAppLayout>
        {children}
        {modal}
      </UserAppLayout>
    );

  const sessionUser = session.user;
  const user = await prisma.user.findUnique({ where: { id: sessionUser.id } });
  if (!user)
    return (
      <UserAppLayout>
        {children}
        {modal}
      </UserAppLayout>
    );

  return (
    <UserAppLayout user={user}>
      {children}
      {modal}
    </UserAppLayout>
  );
}
