import "dotenv/config";
import scheduler from "@google-cloud/scheduler";
import { jobs } from "./jobs";
import { logger } from "@/utils/logger";

const createCloudSchedulerJob = async () => {
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
    jobs.filter((job) => !existJobNames.includes(job.name)).map(async (job) => client.createJob({ parent, job }));

  const deleteJob = () =>
    existJobs[0]
      .filter((existJob) => !jobNames.includes(existJob.name))
      .map((job) => client.deleteJob({ name: job.name }));

  Promise.all([...updateJob(), ...createJob(), ...deleteJob()]);
};

(async () => {
  try {
    await createCloudSchedulerJob();
  } catch (error) {
    logger({
      severity: "ERROR",
      message: "CLOUD SCHEDULERのジョブ作成に失敗しました",
      payload: { error: JSON.stringify(error) }
    });
  }
})();
