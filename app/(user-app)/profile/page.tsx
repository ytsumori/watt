import { getMyId } from "@/actions/me";
import prisma from "@/lib/prisma/client";
import { redirect } from "next/navigation";
import { ProfilePage } from "./_components/ProfilePage";
import { signOut } from "next-auth/react";

type Props = {
  searchParams: {
    redirectedFrom?: string;
  };
};

export default async function Profile({ searchParams }: Props) {
  const myId = await getMyId();
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
