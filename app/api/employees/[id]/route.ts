import { NextRequest, NextResponse } from "next/server";
import { updateEmployee, deleteEmployee } from "@/lib/data/queries";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const employee = await updateEmployee(id, body);
    if (!employee) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(employee);
  } catch (err) {
    console.error("[PUT /api/employees/[id]]", err);
    return NextResponse.json({ error: "Failed to update employee" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteEmployee(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/employees/[id]]", err);
    return NextResponse.json({ error: "Failed to delete employee" }, { status: 500 });
  }
}
