"use server";
import { CloudTasksClient, type protos } from "@google-cloud/tasks";

type Args<T extends object> = { payload: T; url: string; delaySeconds: number };

export const createProdHttpTask = async <T extends object>({ url, delaySeconds, payload }: Args<T>) => {
  const client = new CloudTasksClient({
    credentials: { client_email: process.env.CLOUD_TASKS_AUTH_EMAIL, private_key: process.env.CLOUD_TASKS_AUTH_SECRET }
  });

  const project = process.env.GCP_PROJECT_NAME;
  const queue = process.env.CLOUD_TASKS_QUEUE_NAME;
  const location = process.env.CLOUD_TASKS_LOCATION;

  if (!project || !queue || !location) throw new Error("Environment variables are required");

  if (Object.keys(payload).length === 0 || !payload) throw new Error("Arguments are required");

  try {
    const request: protos.google.cloud.tasks.v2.ICreateTaskRequest = {
      parent: client.queuePath(project, location, queue),
      task: {
        httpRequest: {
          httpMethod: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${process.env.CLOUD_TASKS_API_SECRET}`
          },
          body: Buffer.from(JSON.stringify(payload)).toString("base64"),
          url
        },
        scheduleTime: { seconds: Math.floor(Date.now() / 1000) + delaySeconds }
      }
    };
    await client.createTask(request);
  } catch (error) {
    console.log("ERROR on createProdHttTask", error);
  }
};

export const createLocalHttpTask = async <T extends object>({ url, delaySeconds, payload }: Args<T>) => {
  const timeoutId = setTimeout(async () => {
    try {
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", authorization: `Bearer ${process.env.CLOUD_TASKS_API_SECRET}` },
        body: JSON.stringify(payload)
      });
    } catch (error) {
      clearTimeout(timeoutId);
    }
  }, delaySeconds * 1000);
};

export const createHttpTask = async <T extends object>({ url, delaySeconds, payload }: Args<T>) => {
  // httpタスクはcloud tasksを使っていて開発環境ではcloud tasksを再現できないため擬似的に実行している
  process.env.NODE_ENV === "development"
    ? await createLocalHttpTask({ url, delaySeconds, payload })
    : await createProdHttpTask({ url, delaySeconds, payload });
};
