import { NextRequest, NextResponse } from "next/server";
import { getAllEmployees, createEmployee } from "@/lib/data/queries";

export async function GET() {
  try {
    const employees = await getAllEmployees();
    return NextResponse.json(employees);
  } catch (err) {
    console.error("[GET /api/employees]", err);
    return NextResponse.json({ error: "Failed to load employees" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const employee = await createEmployee(body);
    return NextResponse.json(employee, { status: 201 });
  } catch (err) {
    console.error("[POST /api/employees]", err);
    return NextResponse.json({ error: "Failed to create employee" }, { status: 500 });
  }
}
