import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const normalized = (email as string).toLowerCase().trim();
    const db = getDb();

    // Reject if the email is already an employee
    const empCheck = await db.query(
      `SELECT id FROM employees WHERE LOWER(email) = $1`,
      [normalized]
    );
    if (empCheck.rows.length > 0) {
      return NextResponse.json({ error: "This email is reserved for staff." }, { status: 409 });
    }

    // Check if customer already exists
    const existing = await db.query(
      `SELECT id FROM customers WHERE LOWER(email) = $1`,
      [normalized]
    );
    if (existing.rows.length > 0) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    const id = randomUUID();
    await db.query(
      `INSERT INTO customers (id, name, email, password_hash)
       VALUES ($1, $2, $3, crypt($4, gen_salt('bf')))`,
      [id, (name as string).trim(), normalized, password]
    );

    return NextResponse.json({
      id,
      name:  (name as string).trim(),
      email: normalized,
      role:  "customer" as const,
    }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/auth/register]", err);
    return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 });
  }
}
