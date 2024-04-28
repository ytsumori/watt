import { CloudTasksClient } from "@google-cloud/tasks";
import { findOrder } from "@/actions/order";
import { credentials } from "@grpc/grpc-js";

export const deleteHttpTask = async (orderId: string) => {
  const order = await findOrder({ where: { id: orderId } });
  if (!order) throw new Error("Order not found");

  const client =
    process.env.NODE_ENV === "development"
      ? new CloudTasksClient({ port: 8000, servicePath: "localhost", sslCreds: credentials.createInsecure() })
      : new CloudTasksClient({
          credentials: {
            client_email: process.env.CLOUD_TASKS_AUTH_EMAIL,
            private_key: process.env.CLOUD_TASKS_AUTH_SECRET
          }
        });

  try {
    await client.deleteTask({ name: order.taskId });
  } catch (e) {
    console.log("ERROR on deleteProdHttpTask", e);
  }
};
