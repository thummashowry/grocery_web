import { NextRequest, NextResponse } from "next/server";
import { getTrackingEvents } from "@/lib/data/queries";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const events = await getTrackingEvents(id);
    return NextResponse.json(events);
  } catch (err) {
    console.error("[GET /api/orders/[id]/tracking]", err);
    return NextResponse.json({ error: "Failed to load tracking events" }, { status: 500 });
  }
}
