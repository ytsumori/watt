import { protos } from "@google-cloud/scheduler";

type Args = { name: string; description: string; schedule: string; path: string };

export const createJob = ({ name, description, schedule, path }: Args): protos.google.cloud.scheduler.v1.IJob => {
  return {
    name:
      "projects/" + process.env.GCP_PROJECT_ID + "/locations/" + process.env.CLOUD_SCHEDULER_LOCATION + "/jobs/" + name,
    description,
    schedule,
    timeZone: "Asia/Tokyo",
    httpTarget: {
      httpMethod: "GET",
      uri: process.env.NEXT_PUBLIC_HOST_URL + "/api/cron" + path,
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${process.env.CRON_SECRET}`
      }
    }
  };
};
