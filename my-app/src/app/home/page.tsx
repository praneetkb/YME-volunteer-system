// dashboard or home page to navigate after logging in

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type UserRole = "exec" | "volunteer";

export default function HomePage() {
    const router = useRouter();

    const [role, setRole] = useState<UserRole | null>(null);
    const [loading, setLoading] = useState(true);
    const [loggingOut, setLoggingOut] = useState(false);

    // Verify authentication and retrieve account role
    useEffect(() => {
        let active = true;

        const checkSession = async () => {
            try {
                const res = await fetch("/api/getSession", {
                    cache: "no-store",
                });

                if (!res.ok) {
                    router.replace("/login");
                    return;
                }

                const data = await res.json();

                if (!data.authenticated || !data.role) {
                    router.replace("/login");
                    return;
                }

                if (active) {
                    setRole(data.role);
                    setLoading(false);
                }

            } catch (err) {
                console.error("Session verification failed:", err);
                router.replace("/login");
            }
        };

        checkSession();

        return () => {
            active = false;
        };
    }, [router]);

    // Logout
    const handleLogout = async () => {
        setLoggingOut(true);

        try {
            const res = await fetch("/api/logout", {
                method: "POST",
            });

            if (!res.ok) {
                throw new Error("Logout failed");
            }

            router.replace("/login");
            router.refresh();

        } catch (err) {
            console.error("Logout error:", err);
            setLoggingOut(false);
        }
    };

    // Display loading screen while verifying session
    if (loading || !role) {
        return (
            <div className="min-h-screen bg-purple-100 flex items-center justify-center">
                <p className="text-purple-900">Loading your dashboard...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-purple-100 flex flex-col">

            {/* Top bar */}
            <header className="flex justify-between items-center bg-purple-200 px-6 py-4 shadow">

                <span className="text-gray-800 font-medium">
                    Logged in as{" "}
                    <span className="font-bold">
                        {role === "exec" ? "Exec" : "Volunteer"}
                    </span>
                </span>

                <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="text-red-600 hover:text-red-800 font-medium disabled:opacity-50"
                >
                    {loggingOut ? "Logging out..." : "Logout"}
                </button>

            </header>

            {/* Main dashboard */}
            <main className="flex flex-1 items-center justify-center">

                <div className="bg-white shadow-lg rounded-2xl p-10 max-w-md w-full text-center">

                    <h1 className="text-2xl font-bold text-gray-900 mb-6">
                        Welcome to the YME <br /> Volunteer System!
                    </h1>

                    <p className="text-gray-800 mb-8">
                        Please choose an option below:
                    </p>

                    <div className="space-y-4">

                        <Link
                            href="/responses"
                            className="block w-full bg-purple-900 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition"
                        >
                            Submit New Feedback
                        </Link>

                        <Link
                            href="/pastResponses"
                            className="block w-full bg-purple-900 text-white py-3 rounded-lg font-medium hover:bg-purple-800 transition"
                        >
                            View Past Responses
                        </Link>

                    </div>
                </div>
            </main>
        </div>
    );
}