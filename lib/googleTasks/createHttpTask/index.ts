"use server";

import { CloudTasksClient, type protos } from "@google-cloud/tasks";
import { credentials } from "@grpc/grpc-js";
import { TaskKind } from "../types";

type Args<T extends object> = { payload: T; name: TaskKind; delaySeconds: number };

export const createHttpTask = async <T extends object>({
  name,
  delaySeconds,
  payload
}: Args<T>): Promise<string | null | undefined> => {
  const client =
    process.env.NODE_ENV === "development"
      ? new CloudTasksClient({ port: 8000, servicePath: "localhost", sslCreds: credentials.createInsecure() })
      : new CloudTasksClient({
          credentials: {
            client_email: process.env.CLOUD_TASKS_AUTH_EMAIL,
            private_key: process.env.CLOUD_TASKS_AUTH_SECRET!!.split(String.raw`\n`).join("\n")
          }
        });

  const project = process.env.GCP_PROJECT_NAME;
  const location = process.env.CLOUD_TASKS_LOCATION;
  const queue = process.env.CLOUD_TASKS_QUEUE_NAME;

  if (!project || !queue || !location) throw new Error("Environment variables are required");

  if (Object.keys(payload).length === 0 || !payload) throw new Error("Arguments are required");

  const url = process.env.NEXT_PUBLIC_DOCKER_HOST_URL ?? process.env.NEXT_PUBLIC_HOST_URL + `/api/cloud-tasks/${name}`;

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
    const res = await client.createTask(request);
    return res[0].name?.split("/")[res[0].name?.split("/").length - 1];
  } catch (error) {
    console.log("ERROR on createHttpTask", error);
  }
};
