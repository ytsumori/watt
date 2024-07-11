"use server";

import { CloudTasksClient } from "@google-cloud/tasks";
import { credentials } from "@grpc/grpc-js";
import prisma from "@/lib/prisma/client";

export const deleteHttpTask = async (orderId: string) => {
  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { automaticCancellation: true } });
  if (!order) throw new Error("Order not found");

  const project = process.env.GCP_PROJECT_ID;
  const location = process.env.CLOUD_TASKS_LOCATION;
  const queue = process.env.CLOUD_TASKS_QUEUE_NAME;

  if (!project || !queue || !location) throw new Error("Environment variables are required");

  const client =
    process.env.NODE_ENV === "development"
      ? new CloudTasksClient({ port: 8000, servicePath: "localhost", sslCreds: credentials.createInsecure() })
      : new CloudTasksClient({
          credentials: {
            client_email: process.env.CLOUD_TASKS_AUTH_EMAIL,
            private_key: process.env.CLOUD_TASKS_AUTH_SECRET!!.split(String.raw`\n`).join("\n")
          }
        });

  if (!order.automaticCancellation?.googleCloudTaskId) return console.error("No task to delete");

  try {
    await client.deleteTask({
      name: `${client.queuePath(project, location, queue)}/tasks/${order.automaticCancellation.googleCloudTaskId}`
    });
  } catch (e) {
    console.log("ERROR on deleteHttpTask", e);
  }
};
