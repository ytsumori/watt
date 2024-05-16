"use server";

import * as line from "@line/bot-sdk";
import retry from "async-retry";

line.middleware({
  channelAccessToken: process.env.LINE_MESSAGING_API_ACCESS_TOKEN!,
  channelSecret: process.env.LINE_MESSAGING_API_CHANNEL_SECRET!
});

const client = new line.messagingApi.MessagingApiClient({
  channelAccessToken: process.env.LINE_MESSAGING_API_ACCESS_TOKEN!
});

export async function pushMessage({ to, messages }: { to: string; messages: line.Message[] }) {
  const retryKey = crypto.randomUUID();
  await retry(
    async () => {
      await client.pushMessage({ to, messages }, retryKey);
    },
    {
      retries: 3,
      onRetry: (e, attempt) => console.error(`Error pushing message to ${to} (attempt ${attempt}): ${e.message}`)
    }
  );
}

export async function multicastMessage({ to, messages }: { to: string[]; messages: line.Message[] }) {
  const retryKey = crypto.randomUUID();
  await retry(
    async () => {
      await client.multicast({ to, messages }, retryKey);
    },
    {
      retries: 3,
      onRetry: (e, attempt) => console.error(`Error multicasting message to ${to} (attempt ${attempt}): ${e.message}`)
    }
  );
}
