// viewing past responses for all students 

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Response {
    session_id: string;
    session_date: string;
    facilitator_name: string;
    students_name: string;
    student_absent?: string | null;
    topic?: string | null;
    session_summary?: string | null;
    tech_issues?: string | null;
    student_struggles?: string | null;
    student_strengths?: string | null;
    strategies_used?: string | null;
    next_session_notes?: string | null;
    created_at?: string | null;
}

function getStudentGroupKey(studentsName: string) {
    return studentsName
        .split(",")
        .map((name) => name.trim().toLowerCase())
        .filter(Boolean)
        .sort()
        .join(",");
}

// Format a date-only value without shifting it between timezones.
function formatSessionDate(date: string) {
    const [year, month, day] = date.split("-");

    if (!year || !month || !day) {
        return date;
    }

    return new Date(
        Number(year),
        Number(month) - 1,
        Number(day)
    ).toLocaleDateString("en-GB");
}

// created_at is a timestamp, so display it in the viewer's local timezone.
function formatCreatedAt(date?: string | null) {
    if (!date) return "Not available";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "Not available";
    }

    return parsedDate.toLocaleString();
}

export default function PastResponsesPage() {
    const [responses, setResponses] = useState<Response[]>([]);
    const [role, setRole] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isAuthorized, setIsAuthorized] = useState(false);

    const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
    
    const [selectedResponse, setSelectedResponse] = useState<Response | null>(null);

    const router = useRouter();

    useEffect(() => {
        const fetchResponses = async () => {
            try {
                const res = await fetch("/api/responses", {
                    method: "GET",
                    cache: "no-store",
                });

                const data = await res.json();

                if (res.status === 401) {
                    router.replace("/login");
                    return;
                }

                setIsAuthorized(true);

                if (!res.ok || !data.success) {
                    setError(data.error || "Could not load past responses.");
                    return;
                }

                setResponses(data.responses || []);
                setRole(data.role);

            } catch (err) {
                console.error("Error fetching past responses:", err);
                setError("Something went wrong while loading responses.");
            } finally {
                setLoading(false);
            }
        };

        fetchResponses();
    }, [router]);

    // Group responses by the student combination.
    const groupedResponses = responses.reduce<Record<string, Response[]>>(
        (groups, response) => {
            const groupKey = getStudentGroupKey(response.students_name || "");

             if (!groups[groupKey]) {
                groups[groupKey] = [];
             }

             groups[groupKey].push(response);
             return groups;
        },
        {}
    );

    const groupKeys = Object.keys(groupedResponses);

    const selectedGroupResponses = selectedGroup
        ? groupedResponses[selectedGroup] || []
        : [];

    const detailFields = [
        { label: "Session Date", value: selectedResponse ? formatSessionDate(selectedResponse.session_date) : "" },
        { label: "Facilitator", value: selectedResponse?.facilitator_name },
        { label: "Student(s)", value: selectedResponse?.students_name },
        { label: "Student(s) Absent", value: selectedResponse?.student_absent },
        { label: "Topic", value: selectedResponse?.topic },
        { label: "Session Summary", value: selectedResponse?.session_summary },
        { label: "Technical Issues", value: selectedResponse?.tech_issues },
        { label: "Student Struggles", value: selectedResponse?.student_struggles },
        { label: "Student Strengths", value: selectedResponse?.student_strengths },
        { label: "Strategies Used", value: selectedResponse?.strategies_used },
        { label: "Notes for Next Session", value: selectedResponse?.next_session_notes },
        { label: "Submitted At", value: selectedResponse ? formatCreatedAt(selectedResponse.created_at) : "" },
    ];

    if (loading || !isAuthorized) {
    return (
        <div className="min-h-screen bg-purple-100 flex items-center justify-center">
            <p className="text-gray-600 text-lg">
                Checking your session...
            </p>
        </div>
        );
    }

    return (
        <div className="min-h-screen bg-purple-100 p-8">
            <div className="max-w-4xl mx-auto">

                <h1 className="text-3xl font-bold mb-3 text-center text-gray-800">
                    Past Responses
                </h1>

                {role === "exec" && (
                    <p className="text-center text-purple-900 mb-6">
                        Viewing past responses for all students.
                    </p>
                )}

                {role === "volunteer" && (
                    <p className="text-center text-purple-900 mb-6">
                        Viewing the 5 most recent responses per student.
                    </p>
                )}

                {loading ? (
                    <p className="text-center text-gray-600">Loading...</p>
                ) : error ? (
                    <p className="text-center text-red-600">{error}</p>
                ) : selectedResponse ? (
                    <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200">
                        <button
                            onClick={() => setSelectedResponse(null)}
                            className="text-purple-700 hover:text-purple-900 font-semibold mb-6"
                        >
                            ← Back to responses
                        </button>

                        <h2 className="text-2xl font-bold text-gray-800 mb-6">
                            {selectedResponse.students_name}
                        </h2>

                        <div className="grid gap-5">
                            {detailFields.map((field) => (
                                <div key={field.label}>
                                    <h3 className="font-semibold text-gray-800 mb-1">
                                        {field.label}
                                    </h3>
                                    <p className="text-gray-700 whitespace-pre-wrap">
                                        {field.value?.trim() || "Not provided"}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : selectedGroup ? (
                    <div>
                        <button
                            onClick={() => setSelectedGroup(null)}
                            className="text-purple-700 hover:text-purple-900 font-semibold mb-5"
                        >
                            ← Back to folders
                        </button>

                        <h2 className="text-2xl font-bold text-gray-800 mb-5">
                            {groupedResponses[selectedGroup]?.[0]?.students_name}
                        </h2>

                        <div className="grid gap-4">
                            {selectedGroupResponses.map((response) => (
                                <button
                                    key={response.session_id}
                                    onClick={() => setSelectedResponse(response)}
                                    className="w-full text-left bg-white shadow-md rounded-xl p-5 border border-gray-200 hover:border-purple-400 hover:shadow-lg transition"
                                >
                                    <div className="flex justify-between items-center gap-4">
                                        <div>
                                            <h3 className="font-semibold text-gray-800">
                                                {formatSessionDate(response.session_date)}
                                            </h3>
                                            <p className="text-gray-600 text-sm mt-1">
                                                Facilitator: {response.facilitator_name}
                                            </p>
                                        </div>
                                        <span className="text-purple-700 font-semibold">
                                            View details →
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : responses.length === 0 ? (
                    <p className="text-center text-gray-600">
                        No responses found.
                    </p>
                ) : (
                    <div className="grid gap-4">
                        {groupKeys.map((groupKey) => {
                            const group = groupedResponses[groupKey];

                            return (
                                <button
                                    key={groupKey}
                                    onClick={() => setSelectedGroup(groupKey)}
                                    className="w-full text-left bg-white shadow-md rounded-xl p-6 border border-gray-200 hover:border-purple-400 hover:shadow-lg transition"
                                >
                                    <div className="flex justify-between items-center gap-4">
                                        <div>
                                            <h2 className="text-xl font-semibold text-gray-800">
                                                {group[0].students_name}
                                            </h2>
                                            <p className="text-gray-500 text-sm mt-1">
                                                {group.length} {group.length === 1 ? "response" : "responses"}
                                            </p>
                                        </div>
                                        <span className="text-purple-700 font-semibold">
                                            Open folder →
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}