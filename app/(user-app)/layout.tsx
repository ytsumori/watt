import UserAppLayout from "@/app/(user-app)/_components/UserAppLayout";
import { options } from "@/lib/next-auth/options";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma/client";

export default async function UserApp({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(options);
  if (!session) return <UserAppLayout>{children}</UserAppLayout>;

  const sessionUser = session.user;
  const user = await prisma.user.findUnique({ where: { id: sessionUser.id } });
  if (!user) return <UserAppLayout>{children}</UserAppLayout>;

  return <UserAppLayout user={user}>{children}</UserAppLayout>;
}
