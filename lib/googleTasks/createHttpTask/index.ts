"use server";
import { CloudTasksClient, type protos } from "@google-cloud/tasks";
import { credentials } from "@grpc/grpc-js";

type Args<T extends object> = { payload: T; url: string; delaySeconds: number };

export const createHttpTask = async <T extends object>({ url, delaySeconds, payload }: Args<T>) => {
  const client =
    process.env.NODE_ENV === "development"
      ? new CloudTasksClient({ port: 8000, servicePath: "localhost", sslCreds: credentials.createInsecure() })
      : new CloudTasksClient({
          credentials: {
            client_email: process.env.CLOUD_TASKS_AUTH_EMAIL,
            private_key: process.env.CLOUD_TASKS_AUTH_SECRET
          }
        });

  const project = process.env.GCP_PROJECT_NAME;
  const location = process.env.CLOUD_TASKS_LOCATION;
  const queue = process.env.CLOUD_TASKS_QUEUE_NAME;

  if (!project || !queue || !location) throw new Error("Environment variables are required");

  if (Object.keys(payload).length === 0 || !payload) throw new Error("Arguments are required");
  console.log("queuePath", client.queuePath(project, location, queue));
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
    console.log("ERROR on createHttpTask", error);
  }
};
