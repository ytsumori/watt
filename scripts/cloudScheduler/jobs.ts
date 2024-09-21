import { protos } from "@google-cloud/scheduler";
import { createJob } from "./utils";

export const jobs: protos.google.cloud.scheduler.v1.IJob[] = [
  createJob({
    name: "update-restaurant-status",
    description: "レストランのステータスを更新するジョブ",
    schedule: "*/30 * * * *",
    path: "/update-restaurant-status"
  }),
  createJob({
    name: "update-opening-hours",
    description: "営業時間を更新するジョブ",
    schedule: "0 21 * * *",
    path: "/update-opening-hours"
  }),
  createJob({
    name: "update-map-place-detail",
    description: "'レストランの場所を更新するジョブ",
    schedule: "15 21 1 * *",
    path: "/update-map-place-detail"
  }),
  createJob({
    name: "update-restaurant-coordinates",
    description: "レストランの座標を更新するジョブ",
    schedule: "15 21 1 * *",
    path: "/update-restaurant-coordinates"
  }),
  createJob({
    name: "verify-order-price",
    description: "注文金額を検証するジョブ",
    schedule: "0 15 * * *",
    path: "/verify-order-price"
  })
];
