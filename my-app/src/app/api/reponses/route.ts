import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin"; // service role client

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("responses_view")
    .select("*")
    .order("session_date", { ascending: false });

  if (error) {
    return NextResponse.json({ success: false, error: error.message });
  }

  return NextResponse.json({ success: true, responses: data });
}
