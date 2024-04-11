import { encodeSignUpToken } from "@/actions/restaurant-sign-up";

export async function copySignUpURL({ id, password }: { id: string; password: string }) {
  const token = await encodeSignUpToken({ restaurantId: id, password });
  navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_LIFF_URL}?signUpToken=${token}`);
}
