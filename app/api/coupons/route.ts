import { NextRequest, NextResponse } from "next/server";
import { getAllCoupons, createCoupon } from "@/lib/data/queries";

export async function GET() {
  try {
    const coupons = await getAllCoupons();
    return NextResponse.json(coupons);
  } catch (err) {
    console.error("[GET /api/coupons]", err);
    return NextResponse.json({ error: "Failed to load coupons" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const coupon = await createCoupon(body);
    return NextResponse.json(coupon, { status: 201 });
  } catch (err) {
    console.error("[POST /api/coupons]", err);
    return NextResponse.json({ error: "Failed to create coupon" }, { status: 500 });
  }
}
