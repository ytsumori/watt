import { CloudTasksClient } from "@google-cloud/tasks";
import { findOrder } from "@/actions/order";

/**
 * @todo await client.deleteTask({ name: "taskName" });の中身をマイグレーションを使ってorder.taskIdに変更する
 */
const deleteProdHttpTask = async (orderId: string) => {
  const order = await findOrder({ where: { id: orderId } });
  if (!order) throw new Error("Order not found");

  const client = new CloudTasksClient({
    credentials: { client_email: process.env.CLOUD_TASKS_AUTH_EMAIL, private_key: process.env.CLOUD_TASKS_AUTH_SECRET }
  });
  try {
    await client.deleteTask({ name: "taskName" });
  } catch (e) {
    console.log("ERROR on deleteProdHttpTask", e);
  }
};

/**
 * @todo clearTimeout(order.id)の中身をマイグレーションを使ってorder.taskIdに変更する
 */
export const deleteLocalHttpTask = async (orderId: string) => {
  const order = await findOrder({ where: { id: orderId } });
  if (!order) throw new Error("Order not found");
  // timeoutIdをorderTaskIdみたいなカラムに保存しておく
  clearTimeout(order.id);
};

export const deleteHttpTask = async (orderId: string) => {
  process.env.NODE_ENV === "development" ? await deleteLocalHttpTask(orderId) : await deleteProdHttpTask(orderId);
};
