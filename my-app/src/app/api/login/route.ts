import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    // Get login data from request
    const { username, password } = await req.json();
    console.log("Attempting login for:", username);

    // Fetch user from Supabase
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .single(); // should return one user

    if (error || !user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 401 });
    }

    // Compare password with hashed password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return NextResponse.json({ success: false, error: "Incorrect password" }, { status: 401 });
    }

    // Generate JWT token
    const token = jwt.sign(
      { username: user.username, role: user.role }, // payload
      process.env.JWT_SECRET!, 
      { expiresIn: "1h" } // token expires in 1 hour
    );

    // Set token in httpOnly cookie
    const response = NextResponse.json({ success: true, role: user.role });
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true, // secure cookie
      path: "/",       // cookie accessible on all pages
      maxAge: 60 * 60, // 1 hour
      sameSite: "strict"
    });

    return response;
  } catch (err) {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
