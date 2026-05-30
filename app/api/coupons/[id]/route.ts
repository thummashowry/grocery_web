import { NextRequest, NextResponse } from "next/server";
import { updateCoupon, deleteCoupon } from "@/lib/data/queries";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const coupon = await updateCoupon(id, body);
    if (!coupon) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(coupon);
  } catch (err) {
    console.error("[PUT /api/coupons/[id]]", err);
    return NextResponse.json({ error: "Failed to update coupon" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteCoupon(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/coupons/[id]]", err);
    return NextResponse.json({ error: "Failed to delete coupon" }, { status: 500 });
  }
}
