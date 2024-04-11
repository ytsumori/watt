"use server";

export async function verifyIdToken({ idToken }: { idToken: string }) {
  const body = new URLSearchParams();
  body.append("id_token", idToken);
  body.append("client_id", process.env.LINE_CLIENT_ID ?? "");
  const response = await fetch("https://api.line.me/oauth2/v2.1/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: body
  });
  return response.json() as Promise<{ sub: string }>;
}
