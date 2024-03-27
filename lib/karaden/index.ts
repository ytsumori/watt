"use server";

import { Config, MessageCreateParams, Message } from "karaden-prg-node";

Config.apiKey = process.env.KARADEN_TOKEN;
Config.apiVersion = "2024-03-01";
Config.tenantId = "05d86b14-559b-489c-9290-5d31a829e0a5";

export async function sendMessage(to: string, body: string) {
  const params = MessageCreateParams.newBuilder().withServiceId(1).withTo(to).withBody(body).build();
  const requestOptions = Config.asRequestOptions();
  const message = await Message.create(params, requestOptions);
  return message.status;
}

export async function sendOtpCode(to: string, code: string) {
  const params = MessageCreateParams.newBuilder()
    .withServiceId(1)
    .withTo(to)
    .withBody(`あなたの Watt 認証コード: ${code}`)
    .build();
  const requestOptions = Config.asRequestOptions();
  const message = await Message.create(params, requestOptions).catch((e) => {
    throw e.error;
  });
  return message.status;
}
