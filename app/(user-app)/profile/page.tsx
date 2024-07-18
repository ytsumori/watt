import prisma from "@/lib/prisma/client";
import { redirect } from "next/navigation";
import { ProfilePage } from "./_components/ProfilePage";
import { signOut } from "next-auth/react";
import { options } from "@/lib/next-auth/options";
import { getServerSession } from "next-auth/next";

type Props = {
  searchParams: {
    redirectedFrom?: string;
  };
};

export default async function Profile({ searchParams }: Props) {
  const session = await getServerSession(options);
  const myId = session?.user.id;
  if (!myId) redirect("/");

  const me = await prisma.user.findUnique({
    where: {
      id: myId
    }
  });
  if (!me) {
    await signOut();
    redirect("/");
  }
  return <ProfilePage me={me} redirectedFrom={searchParams.redirectedFrom} />;
}
