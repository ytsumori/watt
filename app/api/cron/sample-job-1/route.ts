import { NextRequest, NextResponse } from "next/server";

import { logger } from "@/utils/logger";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) return new NextResponse("Unauthorized", { status: 401 });

  logger({ message: "cron移行用のサンプルAPI発火", severity: "INFO" });

  return NextResponse.json({ success: true });
}
