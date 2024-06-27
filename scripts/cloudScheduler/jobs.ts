import { protos } from "@google-cloud/scheduler";

const base = {
  name: "projects/" + process.env.GCP_PROJECT_ID + "/locations/" + process.env.CLOUD_SCHEDULER_LOCATION + "/jobs/",
  timeZone: "Asia/Tokyo",
  url: process.env.NEXT_PUBLIC_HOST_URL + "/api/cron",
  "Content-Type": "application/json",
  authorization: `Bearer ${process.env.CRON_SECRET}`
};

export const jobs: protos.google.cloud.scheduler.v1.IJob[] = [
  {
    name: base.name + "sample-job-1",
    schedule: "*/5 * * * *",
    description: "サンプルジョブ",
    timeZone: base.timeZone,
    httpTarget: {
      uri: base.url + "/sample-job-1",
      httpMethod: "GET",
      headers: {
        "Content-Type": base["Content-Type"],
        Authorization: base.authorization
      }
    }
  }
];
