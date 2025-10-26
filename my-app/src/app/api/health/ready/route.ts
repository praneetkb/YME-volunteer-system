import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET() {
  try {
    // simple query on users table
    const { data, error } = await supabase.from("users").select("username").limit(1);

    if (error) {
      console.error("Supabase error:", error.message);
      return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
    }

    console.log("Supabase health check OK:", data);
    return NextResponse.json({ status: "ok", data });
  } catch (err: any) {
    console.error("Health check failed:", err);
    return NextResponse.json({ status: "error", message: err.message }, { status: 500 });
  }
}
