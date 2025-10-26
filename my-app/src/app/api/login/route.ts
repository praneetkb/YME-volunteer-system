import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    console.log("🟢 Attempting login for:", username);

    // Fetch user from Supabase
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username);

    console.log("🟣 Supabase raw data:", data);
    console.log("🔴 Supabase error:", error);

    if (error || !data || data.length === 0) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 401 }
      );
    }

    const user = data[0];
    console.log("🟢 Matched user:", user.username);

    // Compare entered password with hashed password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return NextResponse.json(
        { success: false, error: "Incorrect password" },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { username: user.username, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    // Return success and set token in httpOnly cookie
    const response = NextResponse.json({ success: true, role: user.role });
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60,
      sameSite: "strict",
    });

    console.log("✅ Login successful for:", user.username);
    return response;

  } catch (err) {
    console.error("🔥 Server error:", err);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
