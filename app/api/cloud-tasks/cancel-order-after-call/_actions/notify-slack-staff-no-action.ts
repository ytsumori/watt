"use server";

import { sendSlackMessage } from "@/lib/slack";

export async function notifySlackStaffNoAction({ restaurantName }: { restaurantName: string }) {
  await sendSlackMessage({
    channel: "partnerSuccess",
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: ":rotating_light:電話通知後に対応がなくキャンセルになった注文がありました:rotating_light:"
        }
      },
      {
        type: "divider"
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `対応しなかったお店:\n*${restaurantName}*`
          }
        ]
      }
    ]
  });
}
