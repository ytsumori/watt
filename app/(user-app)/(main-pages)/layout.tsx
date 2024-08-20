import { options } from "@/lib/next-auth/options";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma/client";
import { MainPageLayout } from "./_components/MainPageLayout";

export default async function MainPages({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(options);
  if (!session) return <MainPageLayout>{children}</MainPageLayout>;

  const sessionUser = session.user;
  const user = await prisma.user.findUnique({ where: { id: sessionUser.id } });
  if (!user) {
    return <MainPageLayout>{children}</MainPageLayout>;
  }

  return <MainPageLayout user={user}>{children}</MainPageLayout>;
}
