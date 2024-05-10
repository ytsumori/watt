"use server";

export async function sendOtpCode(to: string, code: string) {
  const message = Buffer.from(`あなたの Watt 認証コード: ${code}`).toString("utf-8");
  const data = {
    message,
    recipient: `+81${to}`,
    sender: "Watt"
  };
  try {
    const response = await fetch("https://api.xoxzo.com/sms/messages/", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${btoa(`${process.env.XOXZO_API_SID}:${process.env.XOXZO_API_TOKEN}`)}`
      },
      method: "POST",
      body: JSON.stringify(data)
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
    sender: "Watt"
  };
  try {
    const response = await fetch("https://api.xoxzo.com/sms/messages/", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${btoa(`${process.env.XOXZO_API_SID}:${process.env.XOXZO_API_TOKEN}`)}`
      },
      method: "POST",
      body: JSON.stringify(data)
    });
    return response.status;
  } catch (e) {
    console.error(e);
    return 500;
  }
}

export async function sendVoiceCall(to: string, audioUrl: string) {
  const data = {
    caller: "+81665332030",
    recipient: `+81${to}`,
    recording_url: audioUrl
  };
  try {
    const response = await fetch("https://api.xoxzo.com/voice/simple/playbacks/", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${btoa(`${process.env.XOXZO_API_SID}:${process.env.XOXZO_API_TOKEN}`)}`
      },
      method: "POST",
      body: JSON.stringify(data)
    });
    console.log(await response.json());
    return response.status;
  } catch (e) {
    console.log("call missed");
    console.error(e);
    return 500;
  }
}
