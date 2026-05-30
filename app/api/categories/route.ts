import { NextRequest, NextResponse } from "next/server";
import { getAllCategories, createCategory, deleteCategory } from "@/lib/data/queries";

export async function GET() {
  try {
    const categories = await getAllCategories();
    return NextResponse.json(categories);
  } catch (err) {
    console.error("[GET /api/categories]", err);
    return NextResponse.json({ error: "Failed to load categories" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, imageUrl } = await req.json();
    const category = await createCategory(name, imageUrl);
    return NextResponse.json(category, { status: 201 });
  } catch (err) {
    console.error("[POST /api/categories]", err);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    await deleteCategory(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/categories]", err);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
