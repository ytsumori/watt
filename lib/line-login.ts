"use server";

export async function verifyIdToken({ idToken }: { idToken: string }) {
  const response = await fetch("https://api.line.me/oauth2/v2.1/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: JSON.stringify({
      id_token: idToken,
      client_id: process.env.LINE_CLIENT_ID,
    }),
  });
  return response.json() as Promise<{ sub: string }>;
}
