"use server";

export const logAction = ({ severity, isClient, message, payload }: LoggerArgs) => {
  const info = { ...payload, severity, message, isClient };
  console.log(JSON.stringify(info));
};
