import { NextRequest, NextResponse } from "next/server";
import { getOrderItems } from "@/lib/data/queries";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const items = await getOrderItems(id);
    return NextResponse.json(items);
  } catch (err) {
    console.error("[GET /api/orders/[id]/items]", err);
    return NextResponse.json({ error: "Failed to load order items" }, { status: 500 });
  }
}
