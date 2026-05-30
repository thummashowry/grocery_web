import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const normalized = (email as string).toLowerCase().trim();
    const db = getDb();

    // 1. Check employees table first (staff / admin)
    const empResult = await db.query(
      `SELECT id, name, email, role, active
       FROM employees
       WHERE LOWER(email) = $1
         AND active = TRUE
         AND password_hash IS NOT NULL
         AND password_hash = crypt($2, password_hash)`,
      [normalized, password]
    );

    if (empResult.rows.length > 0) {
      const emp = empResult.rows[0];
      return NextResponse.json({
        id:    emp.id,
        name:  emp.name,
        email: emp.email,
        role:  emp.role as "staff" | "admin",
      });
    }

    // 2. Check customers table
    const custResult = await db.query(
      `SELECT id, name, email
       FROM customers
       WHERE LOWER(email) = $1
         AND password_hash IS NOT NULL
         AND password_hash = crypt($2, password_hash)`,
      [normalized, password]
    );

    if (custResult.rows.length > 0) {
      const cust = custResult.rows[0];
      return NextResponse.json({
        id:    cust.id,
        name:  cust.name,
        email: cust.email,
        role:  "customer" as const,
      });
    }

    // No match — but we don't reveal whether the email exists
    return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
  } catch (err) {
    console.error("[POST /api/auth/login]", err);
    return NextResponse.json({ error: "Login failed. Please try again." }, { status: 500 });
  }
}
