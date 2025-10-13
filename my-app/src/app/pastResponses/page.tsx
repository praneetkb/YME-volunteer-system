// viewing past responses for all students 

"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient"; // regular (not admin) client

interface Response {
    session_id: number;
    session_date: string;
    facilitator_name: string;
    students_name: string;
}

export default function PastResponsesPage() {
    const [responses, setResponses] = useState<Response[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResponses = async () => {
            const { data, error } = await supabase
                .from("responses")
                .select("session_id, session_date, facilitator_name, students_name, session_summary")
                .order("session_date", { ascending: false })
                .limit(5);

            if (error) console.error("Error fetching responses:", error);
            else setResponses(data || []);
            setLoading(false);
        };

        fetchResponses();
    }, []);

    return (
        <div className="min-h-screen bg-purple-100 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
                    Past Responses
                </h1>

                {loading ? (
                    <p className="text-center text-gray-600">Loading...</p>
                ) : responses.length === 0 ? (
                    <p className="text-center text-gray-600">No responses found.</p>
                ) : (
                    <div className="grid gap-6">
                        {responses.map((r) => (
                            <div
                                key={r.session_id}
                                className="bg-white shadow-md rounded-xl p-6 border border-gray-200"
                            >
                                <div className="flex justify-between items-center mb-3">
                                    <h2 className="text-xl font-semibold text-gray-800">
                                        {r.students_name}
                                    </h2>
                                    <p className="text-gray-500 text-sm">
                                        {new Date(r.session_date).toLocaleDateString("en-GB")}
                                    </p>
                                </div>
                                <p className="text-gray-700 mb-2">
                                    <span className="font-semibold">Facilitator:</span>{" "}
                                    {r.facilitator_name}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
