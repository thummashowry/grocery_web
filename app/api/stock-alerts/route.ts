import { NextRequest, NextResponse } from "next/server";
import { getAllStockAlerts, createStockAlert } from "@/lib/data/queries";

export async function GET() {
  try {
    const alerts = await getAllStockAlerts();
    return NextResponse.json(alerts);
  } catch (err) {
    console.error("[GET /api/stock-alerts]", err);
    return NextResponse.json({ error: "Failed to load stock alerts" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const alert = await createStockAlert(body);
    return NextResponse.json(alert, { status: 201 });
  } catch (err) {
    console.error("[POST /api/stock-alerts]", err);
    return NextResponse.json({ error: "Failed to create stock alert" }, { status: 500 });
  }
}
