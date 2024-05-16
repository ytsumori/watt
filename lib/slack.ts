import { KnownBlock, WebClient, Block } from "@slack/web-api";

const token = process.env.SLACK_BOT_TOKEN;

const slackClient = new WebClient(token);

const SLACK_CHANNELS = {
  partnerSuccess: process.env.SLACK_PARTNER_SUCCESS_CHANNEL_ID!
} as const;

export async function sendSlackMessage({
  channel,
  text,
  blocks = []
}: {
  channel: keyof typeof SLACK_CHANNELS;
  text?: string;
  blocks?: (Block | KnownBlock)[];
}) {
  return await slackClient.chat.postMessage({
    channel: SLACK_CHANNELS[channel],
    text,
    blocks
  });
}
