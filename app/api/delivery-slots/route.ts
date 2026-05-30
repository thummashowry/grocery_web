import { NextResponse } from "next/server";
import { getDeliverySlots } from "@/lib/data/queries";

export async function GET() {
  try {
    const slots = await getDeliverySlots();
    return NextResponse.json(slots);
  } catch (err) {
    console.error("[GET /api/delivery-slots]", err);
    return NextResponse.json({ error: "Failed to load delivery slots" }, { status: 500 });
  }
}
