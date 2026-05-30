import { NextResponse } from "next/server";
import { getAllOrders } from "@/lib/data/queries";

export async function GET() {
  try {
    const orders = await getAllOrders();
    return NextResponse.json(orders);
  } catch (err) {
    console.error("[GET /api/orders]", err);
    return NextResponse.json({ error: "Failed to load orders" }, { status: 500 });
  }
}
