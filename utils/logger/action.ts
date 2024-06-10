"use server";

export const logAction = async ({ severity, isClient, message, payload }: LoggerArgs) => {
  const info = { ...payload, severity, message, isClient };
  console.error(JSON.stringify(info));
};
