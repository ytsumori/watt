"use server";

import { sendSlackMessage } from "@/lib/slack";

export async function notifySlack({ restaurantNames }: { restaurantNames: string[] }) {
  await sendSlackMessage({
    channel: "partnerSuccess",
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: ":warning:2日以上閉まり続けているお店があります:warning:"
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
            text: `閉まり続けているお店:\n*${restaurantNames.join("*\n")}*`
          }
        ]
      }
    ]
  });
}
