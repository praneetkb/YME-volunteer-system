import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
    try {
        const { username, password } = await req.json();

        if (
            typeof username !== "string" ||
            typeof password !== "string" ||
            !username.trim() ||
            !password
        ) {
            return NextResponse.json(
                { success: false, error: "Username and password are required." },
                { status: 400 }
            );
        }

        // Find the account in Supabase
        const { data: user, error } = await supabaseAdmin
            .from("users")
            .select("username, password_hash, role")
            .eq("username", username.trim())
            .maybeSingle();

        if (error) {
            console.error("Login database error:", error.message);
            return NextResponse.json(
                { success: false, error: "Unable to verify account." },
                { status: 500 }
            );
        }

        if (!user) {
            return NextResponse.json(
                { success: false, error: "Invalid username or password." },
                { status: 401 }
            );
        }

        // Validate the account role
        const role = String(user.role).trim().toLowerCase();

        if (role !== "exec" && role !== "volunteer") {
            console.error("Invalid account role:", user.role);

            return NextResponse.json(
                { success: false, error: "Account has an invalid role." },
                { status: 403 }
            );
        }

        // Compare entered password with the stored bcrypt hash
        if (!user.password_hash) {
            return NextResponse.json(
                { success: false, error: "Account password is not configured." },
                { status: 500 }
            );
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!passwordMatch) {
            return NextResponse.json(
                { success: false, error: "Invalid username or password." },
                { status: 401 }
            );
        }

        // Check that JWT secret exists
        const secret = process.env.JWT_SECRET;

        if (!secret) {
            throw new Error("JWT_SECRET is not configured.");
        }

        // Generate authentication token
        const token = jwt.sign(
            {
                username: user.username,
                role: role,
            },
            secret,
            { expiresIn: "1h" }
        );

        // Create response and set secure HttpOnly cookie
        const response = NextResponse.json({
            success: true,
            role: role,
        });

        response.cookies.set({
            name: "token",
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60,
        });

        return response;

    } catch (err) {
        console.error("Login server error:", err);

        return NextResponse.json(
            { success: false, error: "Something went wrong. Please try again." },
            { status: 500 }
        );
    }
}