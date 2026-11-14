import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";

// Verify the user's login token and return their role.
async function getAuthenticatedUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
        return null;
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET is not configured.");
    }

    const payload = jwt.verify(token, secret) as {
        username: string;
        role: string;
    };

    const role = payload.role?.toLowerCase();

    if (role !== "exec" && role !== "volunteer") {
        return null;
    }

    return { username: payload.username, role };
}

// Convert dd/mm/yyyy into yyyy-mm-dd for PostgreSQL.
function convertSessionDate(date: string) {
    const match = date.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

    if (!match) {
        return null;
    }

    const [, day, month, year] = match;
    const parsedDate = new Date(
        Number(year),
        Number(month) - 1,
        Number(day)
    );

    // Reject invalid dates such as 31/02/2026.
    if (
        parsedDate.getFullYear() !== Number(year) ||
        parsedDate.getMonth() !== Number(month) - 1 ||
        parsedDate.getDate() !== Number(day)
    ) {
        return null;
    }

    return `${year}-${month}-${day}`;
}

// Create a grouping key that treats "Denise, Isabelle"
// and "Isabelle, Denise" as the same student combination.
function getStudentGroupKey(studentsName: string) {
    return studentsName
        .split(",")
        .map((name) => name.trim().toLowerCase())
        .filter(Boolean)
        .sort()
        .join(",");
}

// POST: Save a new feedback form.
export async function POST(req: NextRequest) {
    try {
        const user = await getAuthenticatedUser();

        if (!user) {
            return NextResponse.json(
                { success: false, error: "Not authenticated" },
                { status: 401 }
            );
        }

        const formData = await req.json();

        const requiredFields = [
            "session_date",
            "facilitator_name",
            "students_name",
            "session_summary",
            "tech_issues",
            "student_struggles",
            "student_strengths",
        ];

        for (const field of requiredFields) {
            if (
                typeof formData[field] !== "string" ||
                !formData[field].trim()
            ) {
                return NextResponse.json(
                    { success: false, error: `${field} is required.` },
                    { status: 400 }
                );
            }
        }

        const sessionDate = convertSessionDate(formData.session_date);

        if (!sessionDate) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Please enter the session date in dd/mm/yyyy format.",
                },
                { status: 400 }
            );
        }

        const { data, error } = await supabaseAdmin
            .from("responses")
            .insert({
                session_id: randomUUID(),
                session_date: sessionDate,
                facilitator_name: formData.facilitator_name.trim(),
                students_name: formData.students_name.trim(),
                student_absent: formData.student_absent?.trim() || "",
                topic: formData.topic?.trim() || "",
                session_summary: formData.session_summary.trim(),
                tech_issues: formData.tech_issues.trim(),
                student_struggles: formData.student_struggles.trim(),
                student_strengths: formData.student_strengths.trim(),
                strategies_used: formData.strategies_used?.trim() || "",
                next_session_notes: formData.next_session_notes?.trim() || "",
            })
            .select()
            .single();

        if (error) {
            console.error("Error saving response:", error);

            return NextResponse.json(
                { success: false, error: "Could not save the response." },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { success: true, message: "Response submitted successfully." },
            { status: 201 }
        );
    } catch (error) {
        console.error("Submit response API error:", error);

        return NextResponse.json(
            { success: false, error: "Authentication or server error." },
            { status: 401 }
        );
    }
}

// GET: Retrieve past responses.
export async function GET() {
    try {
        const user = await getAuthenticatedUser();

        if (!user) {
            return NextResponse.json(
                { success: false, error: "Not authenticated" },
                { status: 401 }
            );
        }

        // Fetch records in batches to avoid Supabase's default row limit.
        const allResponses = [];
        const batchSize = 1000;
        let offset = 0;

        while (true) {
            const { data, error } = await supabaseAdmin
                .from("responses_view")
                .select("*")
                .order("created_at", { ascending: false })
                .order("session_id", { ascending: false })
                .range(offset, offset + batchSize - 1);

            if (error) {
                console.error("Error fetching past responses:", error);

                return NextResponse.json(
                    { success: false, error: "Could not retrieve responses." },
                    { status: 500 }
                );
            }

            allResponses.push(...(data || []));

            if (!data || data.length < batchSize) {
                break;
            }

            offset += batchSize;
        }

        let responses = allResponses;

        // Volunteers can see only the five latest responses
        // for each exact student combination.
        if (user.role === "volunteer") {
            const groupCounts: Record<string, number> = {};

            responses = allResponses.filter((response) => {
                const groupKey = getStudentGroupKey(
                    response.students_name || ""
                );

                groupCounts[groupKey] = (groupCounts[groupKey] || 0) + 1;

                return groupCounts[groupKey] <= 5;
            });
        }

        return NextResponse.json(
            {
                success: true,
                role: user.role,
                responses,
            },
            {
                headers: {
                    "Cache-Control": "no-store",
                },
            }
        );
    } catch (error) {
        console.error("Past responses API error:", error);

        return NextResponse.json(
            { success: false, error: "Authentication or server error." },
            { status: 401 }
        );
    }
}