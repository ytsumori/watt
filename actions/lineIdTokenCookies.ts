"use server";

import { cookies } from "next/headers";

export async function setCookie({ idToken }: { idToken: string }) {
  cookies().set("idToken", idToken);
}
