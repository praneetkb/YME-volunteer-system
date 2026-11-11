// api route for reading the httpOnly JWT cookie and return the user role and whether they are authenticated or not. 
// This is used by the home page to determine what to display and by the login page to redirect if already logged in.


import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { authenticated: false, role: null },
                { status: 401 }
            );
        }

        const secret = process.env.JWT_SECRET;

        if (!secret) {
            throw new Error("JWT_SECRET is not configured.");
        }

        const decoded = jwt.verify(token, secret) as {
            username: string;
            role: string;
        };

        const role = decoded.role?.toLowerCase();

        if (role !== "exec" && role !== "volunteer") {
            return NextResponse.json(
                { authenticated: false, role: null },
                { status: 401 }
            );
        }

        return NextResponse.json(
            {
                authenticated: true,
                username: decoded.username,
                role: role,
            },
            {
                headers: {
                    "Cache-Control": "no-store",
                },
            }
        );

    } catch {
        return NextResponse.json(
            { authenticated: false, role: null },
            { status: 401 }
        );
    }
}
