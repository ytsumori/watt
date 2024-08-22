"use server";

import * as line from "@line/bot-sdk";
import { MulticastRequest, PushMessageRequest } from "@line/bot-sdk/dist/messaging-api/api";
import retry from "async-retry";

line.middleware({
  channelAccessToken: process.env.LINE_MESSAGING_API_ACCESS_TOKEN!,
  channelSecret: process.env.LINE_MESSAGING_API_CHANNEL_SECRET!
});

const client = new line.messagingApi.MessagingApiClient({
  channelAccessToken: process.env.LINE_MESSAGING_API_ACCESS_TOKEN!
});

export async function pushMessage(request: PushMessageRequest) {
  const retryKey = crypto.randomUUID();
  await retry(
    async () => {
      await client.pushMessage(request, retryKey);
    },
    {
      retries: 3,
      onRetry: (e, attempt) =>
        console.error(`Error pushing message to ${request.to} (attempt ${attempt}): ${e.message}`)
    }
  );
}

export async function multicastMessage(request: MulticastRequest) {
  const retryKey = crypto.randomUUID();
  await retry(
    async () => {
      await client.multicast(request, retryKey);
    },
    {
      retries: 3,
      onRetry: (e, attempt) =>
        console.error(`Error multicasting message to ${request.to} (attempt ${attempt}): ${e.message}`)
    }
  );
}
