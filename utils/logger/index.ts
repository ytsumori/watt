import { logAction } from "./action";

export const logger = async ({ severity, message, payload }: Omit<LoggerArgs, "isClient">) => {
  const isClient = typeof window !== "undefined";
  logAction({ severity, message, isClient, payload });
};
