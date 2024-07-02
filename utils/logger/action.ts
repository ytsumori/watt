"use server";

export const logAction = async ({ severity, isClient, message, payload }: LoggerArgs) => {
  const info = { ...payload, severity, message, isClient };
  switch (severity) {
    case "ALERT":
    case "ERROR":
      console.error(JSON.stringify(info));
      break;
    case "WARNING":
    case "DEBUG":
      console.warn(JSON.stringify(info));
      break;
    case "INFO":
      console.info(JSON.stringify(info));
      break;
  }
};
