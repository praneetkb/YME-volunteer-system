
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'; 


export async function POST(req: NextRequest) {
  // get JSON body from request
  const { username, password } = await req.json();

  // query the users table 
  const { data: users, error } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("username", username)
    .single(); // returns a single row

  if (error || !users) {
    return NextResponse.json({ success: false, error: "User not found" });
  }

  const payload = { username: users.username, role: users.role }; 
  const secret = process.env.JWT_SECRET || "supersecretkey"; 
  const token = jwt.sign(payload, secret, { expiresIn: "1h" }); 

  // compare password
  const isValid = await bcrypt.compare(password, users.password_hash);
  if (!isValid) {
    return NextResponse.json({ success: false, error: "Invalid password" });
  }

  // generate session token 
  const sessionToken = token;

  return NextResponse.json({
    success: true,
    user: {
      username: users.username,
      role: users.role,
    },
    token: sessionToken,
  });
} 