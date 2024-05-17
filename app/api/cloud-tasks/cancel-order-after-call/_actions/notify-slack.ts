"use server";

import { sendSlackMessage } from "@/lib/slack";

export async function notifySlack({ restaurantName }: { restaurantName: string }) {
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
