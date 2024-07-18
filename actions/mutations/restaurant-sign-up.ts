"use server";

import { createStaff } from "./staff";

type Payload = {
  restaurantId: string;
  password: string;
};

export async function signUpRestaurant({ lineIdToken, signUpToken }: { lineIdToken: string; signUpToken: string }) {
  const jwt = require("jsonwebtoken");
  const { restaurantId, password } = (await jwt.verify(
    signUpToken,
    process.env.RESTAURANT_SIGN_UP_TOKEN_SECRET!
  )) as Partial<Payload>;
  if (restaurantId === undefined || password === undefined) {
    throw new Error("Invalid token");
  }

  return createStaff({ restaurantId, password, lineIdToken });
}

export async function encodeSignUpToken(payload: Payload): Promise<string> {
  const jwt = require("jsonwebtoken");
  return jwt.sign(payload, process.env.RESTAURANT_SIGN_UP_TOKEN_SECRET);
}
