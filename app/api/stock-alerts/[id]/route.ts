import { NextRequest, NextResponse } from "next/server";
import { markAlertNotified } from "@/lib/data/queries";

export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await markAlertNotified(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[PATCH /api/stock-alerts/[id]]", err);
    return NextResponse.json({ error: "Failed to update alert" }, { status: 500 });
  }
}
