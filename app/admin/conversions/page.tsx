import prisma from "@/lib/prisma/client";
import { ConversionsPage } from "./_components/page-client";

export default async function Conversions() {
  const conversionTags = await prisma.conversionTrackingTag.findMany();

  return <ConversionsPage conversionTags={conversionTags} />;
}
