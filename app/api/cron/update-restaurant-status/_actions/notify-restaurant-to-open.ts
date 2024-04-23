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
    pushMessage({
      to: staffLineId,
      messages: [
        {
          type: "text",
          text: `来店不可の状態が続いております。\n\n来店が可能な場合は設定画面よりステータスの更新をお願いいたします。\n${process.env.NEXT_PUBLIC_LIFF_URL}`
        }
      ]
    });
  };
  await Promise.all(staffs.map((staff) => notify(staff.lineId)));
}
