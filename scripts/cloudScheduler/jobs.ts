import { protos } from "@google-cloud/scheduler";
import { createJob } from "./utils";

export const jobs: protos.google.cloud.scheduler.v1.IJob[] = [
  createJob({ name: "sample-job-1", description: "サンプルジョブ", schedule: "*/45 * * * *", path: "/sample-job-1" })
];
