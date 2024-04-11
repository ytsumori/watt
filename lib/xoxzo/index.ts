"use server";

export async function sendOtpCode(to: string, code: string) {
  const message = Buffer.from(`あなたの Watt 認証コード: ${code}`).toString("utf-8");
  const data = {
    message,
    recipient: `+81${to}`,
    sender: "Watt",
  };
  try {
    const response = await fetch("https://api.xoxzo.com/sms/messages/", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${btoa(`${process.env.XOXZO_API_SID}:${process.env.XOXZO_API_TOKEN}`)}`,
      },
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.status;
  } catch (e) {
    console.error(e);
    return 500;
  }
}

export async function sendMessage(to: string, message: string) {
  const data = {
    message,
    recipient: `+81${to}`,
    sender: "Watt",
  };
  try {
    const response = await fetch("https://api.xoxzo.com/sms/messages/", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${btoa(`${process.env.XOXZO_API_SID}:${process.env.XOXZO_API_TOKEN}`)}`,
      },
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.status;
  } catch (e) {
    console.error(e);
    return 500;
  }
}
