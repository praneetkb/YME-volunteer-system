// api route only for reading the httpOnly JWT cookie and return the user role

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET() {
  const cookieStore = await cookies(); // required because it returns a Promise
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ role: "unknown" });
  }

  try {
    const secret = process.env.JWT_SECRET!;
    const decoded = jwt.verify(token, secret) as { username: string; role: string };
    return NextResponse.json({ role: decoded.role });
  } catch (error) {
    return NextResponse.json({ role: "unknown" });
  }
}
