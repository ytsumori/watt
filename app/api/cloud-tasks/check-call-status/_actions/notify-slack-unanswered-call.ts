"use server";

import { sendSlackMessage } from "@/lib/slack";

export async function notifySlackUnansweredCall({ restaurantName }: { restaurantName: string }) {
  await sendSlackMessage({
    channel: "partnerSuccess",
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: ":no_mobile_phones:電話の応答がなく、キャンセルになった注文がありました:no_mobile_phones:"
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
            text: `応答がなかったお店:\n*${restaurantName}*`
          }
        ]
      }
    ]
  });
}
