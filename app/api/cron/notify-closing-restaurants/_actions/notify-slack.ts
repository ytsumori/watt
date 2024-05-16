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
            text: `報告されたお店:\n*${restaurantNames.join("\n")}*`
          }
        ]
      },
      {
        type: "divider"
      },
      {
        type: "section",
        text: {
          type: "plain_text",
          text: "担当者"
        },
        accessory: {
          type: "users_select",
          placeholder: {
            type: "plain_text",
            emoji: true,
            text: "担当者を選択"
          }
        }
      },
      {
        type: "section",
        text: {
          type: "plain_text",
          text: "対応状況"
        },
        accessory: {
          type: "static_select",
          placeholder: {
            type: "plain_text",
            emoji: true,
            text: "対応状況"
          },
          initial_option: {
            text: {
              type: "plain_text",
              emoji: true,
              text: ":fire: 未対応"
            },
            value: "value-0"
          },
          options: [
            {
              text: {
                type: "plain_text",
                emoji: true,
                text: ":fire: 未対応"
              },
              value: "value-0"
            },
            {
              text: {
                type: "plain_text",
                emoji: true,
                text: ":eyes: 対応中"
              },
              value: "value-1"
            },
            {
              text: {
                type: "plain_text",
                emoji: true,
                text: ":white_check_mark: 対応済み"
              },
              value: "value-2"
            }
          ]
        }
      }
    ]
  });
}
