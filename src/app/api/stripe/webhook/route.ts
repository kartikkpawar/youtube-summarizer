import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // const body = await req.json();
  return NextResponse.json(
    { message: "Webhook Received", path: req.nextUrl.origin },
    { status: 200 }
  );
}
