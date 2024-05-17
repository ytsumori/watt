import { NextRequest, NextResponse } from "next/server";
import querystring from "querystring";
import { approveOrder } from "./_actions/approve-order";

export async function POST(request: NextRequest) {
  const crypto = require("crypto");
  const requestBodyText = await request.text();
  const signature = crypto
    .createHmac("sha256", process.env.LINE_MESSAGING_API_CHANNEL_SECRET)
    .update(requestBodyText)
    .digest("base64");
  if (request.headers.get("x-line-signature") !== signature)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body: { events: { source: { userId?: string }; postback?: { data: string; params: any } }[] } =
    JSON.parse(requestBodyText);

  if (body.events.length > 0) {
    const postback = body.events[0].postback;
    if (!postback) return NextResponse.json({ message: "Unsupported Request" });

    const postbackData = querystring.parse(postback.data);
    const lineId = body.events[0].source.userId;
    if (!lineId) return NextResponse.json({ message: "lineId not found" }, { status: 404 });

    if (postbackData.action === "approve-order") {
      const orderId = postbackData.orderId;
      if (typeof orderId !== "string") return NextResponse.json({ message: "orderId not specified" }, { status: 400 });
      try {
        await approveOrder({ orderId, lineId });
      } catch (e) {
        return NextResponse.json({ message: (e as Error).message }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ message: "success" });
}
