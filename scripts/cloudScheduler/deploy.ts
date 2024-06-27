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

  // すでにジョブが存在する場合は更新、存在しない場合は作成
  // ジョブの名前を変えた場合のみ、ない扱いになり新規作成になるため手動で古いジョブを削除する必要がある
  await Promise.all(
    jobs.map(async (job) =>
      existJobs[0].some((existJob) => job.name === existJob.name)
        ? client.updateJob({ job })
        : client.createJob({ parent, job })
    )
  );
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
