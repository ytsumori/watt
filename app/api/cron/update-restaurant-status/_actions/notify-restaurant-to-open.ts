"use server";

import { pushMessage } from "@/lib/line-messaging-api";
import prisma from "@/lib/prisma/client";

export async function notifyRestaurantToOpen({ restaurantId }: { restaurantId: string }) {
  const staffs = await prisma.staff.findMany({
    where: {
      restaurantId
    }
  });

  const notify = async (staffLineId: string) => {
    pushMessage({ to: staffLineId, messages: [{ type: "text", text: "Please open the restaurant" }] });
  };
  await Promise.all(staffs.map((staff) => notify(staff.lineId)));
}
