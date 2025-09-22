import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  try {
    // get token from HTTP-only cookie
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
      // status 401 means unauthorized access 
    }

    // verify JWT
    const payload = jwt.verify(token, process.env.JWT_SECRET || "supersecretkey") as {
      username: string;
      role: "volunteer" | "exec";
    };

    // supabase query
    let query = supabaseAdmin
      .from("responses_view")
      .select("*")
      .order("session_date", { ascending: false });

    // access based on role
    if (payload.role === "volunteer") {
      query = query.limit(5); 

    // if volunteer is trying to request more than 5 past sessions 
    const requestedLimit = Number(req.nextUrl.searchParams.get("limit") || 5);
    if (requestedLimit > 5) {
        return NextResponse.json({ success: false, error: "Access forbidden" }, { status: 403 });
        // status 403 means forbidden 
    }
 }

    // execute query
    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      // status 500 means server error 
    }

    // return JSON
    return NextResponse.json({ success: true, responses: data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Unknown error" }, { status: 500 });
  }
}
