import { NextRequest, NextResponse } from "next/server";
import { toggleOrderItemPicked } from "@/lib/data/queries";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  try {
    const { itemId } = await params;
    const { picked } = await req.json();
    await toggleOrderItemPicked(parseInt(itemId), picked);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[PATCH /api/orders/[id]/items/[itemId]]", err);
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}
