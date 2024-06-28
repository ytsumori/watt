import "dotenv/config";
import scheduler from "@google-cloud/scheduler";
import { protos } from "@google-cloud/scheduler";
import { jobs } from "./jobs";
import { logger } from "@/utils/logger";

(async () => {
  const client = new scheduler.CloudSchedulerClient({
    credentials: {
      client_email: process.env.CLOUD_SCHEDULER_AUTH_EMAIL,
      private_key: process.env.CLOUD_SCHEDULER_AUTH_SECRET
    }
  });

  if (!process.env.GCP_PROJECT_ID || !process.env.CLOUD_SCHEDULER_LOCATION) {
    logger({ severity: "ERROR", message: "CLOUD SCHEDULERの環境変数がありません" });
    return;
  }

  const parent = client.locationPath(process.env.GCP_PROJECT_ID, process.env.CLOUD_SCHEDULER_LOCATION);
  const existJobs = await client.listJobs({ parent });

  const jobNames = jobs.map((job) => job.name);
  const existJobNames = existJobs[0].map((job) => job.name);

  const updateJob = () =>
    jobs.filter((job) => existJobNames.includes(job.name)).map((job) => client.updateJob({ job }));

  const createJob = () =>
    jobs.filter((job) => !existJobNames.includes(job.name)).map((job) => client.createJob({ parent, job }));

  const deleteJob = () =>
    existJobs[0]
      .filter((existJob) => !jobNames.includes(existJob.name))
      .map((job) => client.deleteJob({ name: job.name }));

  const results = await Promise.allSettled([...updateJob(), ...createJob(), ...deleteJob()]);

  results?.forEach((result) => {
    if (result.status === "fulfilled") {
      const value = result.value[0] as protos.google.cloud.scheduler.v1.IJob;
      logger({
        severity: "INFO",
        message: "Cloud Schedulerの(更新/作成/削除)に成功しました",
        payload: { name: value.name, desciption: value.description }
      });
    } else {
      logger({
        severity: "ERROR",
        message: "Cloud Schedulerのジョブの(更新/作成/削除)に失敗しました",
        payload: {
          details: result.reason["details"],
          reason: result.reason["reason"],
          errorInfoMetadata: result.reason["errorInfoMetadata"]
        }
      });
    }
  });
})();
