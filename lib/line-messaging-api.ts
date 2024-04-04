"use server";

import * as line from "@line/bot-sdk";

line.middleware({
  channelAccessToken: process.env.LINE_MESSAGING_API_ACCESS_TOKEN!,
  channelSecret: process.env.LINE_MESSAGING_API_CHANNEL_SECRET!,
});

const client = new line.messagingApi.MessagingApiClient({
  channelAccessToken: process.env.LINE_MESSAGING_API_ACCESS_TOKEN!,
});

export async function pushMessage({ to, messages }: { to: string; messages: line.Message[] }) {
  await client.pushMessage({ to, messages });
}
