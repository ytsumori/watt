"use server";

import { sendSlackMessage } from "@/lib/slack";

export async function notifySlackOrderRejection({ restaurantName }: { restaurantName: string }) {
  await sendSlackMessage({
    channel: "partnerSuccess",
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: ":full_moon:お店が満席のため、LINEから注文をキャンセルしました:full_moon:"
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
            text: `キャンセルしたお店:\n*${restaurantName}*`
          }
        ]
      }
    ]
  });
}
