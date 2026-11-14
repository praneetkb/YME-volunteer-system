// Dashboard or home page to navigate after logging in

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
    ClipboardList,
    CalendarCheck,
    Clock,
    Users,
} from "lucide-react";

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
                <p className="text-purple-900">
                    Loading your dashboard...
                </p>
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
            <main className="flex flex-1 items-center justify-center p-6">

                <div className="max-w-4xl w-full">

                    {/* Welcome section */}
                    <div className="bg-white shadow-lg rounded-2xl p-8 mb-6 text-center">

                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                            Welcome to the YME Volunteer System!
                        </h1>

                        <p className="text-gray-600">
                            Young Minds Eye Volunteer Management Dashboard
                        </p>

                    </div>

                    {/* Feature cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                        {/* Feedback System */}
                        <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200 flex flex-col">

                            <div className="text-purple-800 mb-3">
                                <ClipboardList />
                            </div>

                            <h2 className="text-xl font-semibold text-gray-800 mb-2">
                                Feedback System
                            </h2>

                            <p className="text-gray-600 text-sm mb-4">
                                Submit and review session feedback.
                            </p>

                            <div className="space-y-3 mt-auto">

                                <Link
                                    href="/responses"
                                    className="block w-full text-center bg-purple-900 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition"
                                >
                                    Submit New Feedback 
                                </Link>

                                <Link
                                    href="/pastResponses"
                                    className="block w-full text-center bg-purple-900 text-white py-3 rounded-lg font-medium hover:bg-purple-800 transition"
                                >
                                    View Past Responses 
                                </Link>

                            </div>

                            <span className="inline-block self-start mt-4 bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                                Available
                            </span>

                        </div>

                        {/* Session Matching */}
                        <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200 flex flex-col">

                            <div className="text-purple-800 mb-3">
                                <CalendarCheck />
                            </div>

                            <h2 className="text-xl font-semibold text-gray-800 mb-2">
                                Session Matching
                            </h2>

                            <p className="text-gray-600 text-sm mb-4">
                                Match facilitator and student availability to find suitable session times.
                            </p>

                            <div className="mt-auto">
                                <span className="inline-block bg-purple-100 text-purple-800 text-xs font-semibold px-3 py-1 rounded-full">
                                    Coming Soon
                                </span>
                            </div>

                        </div>

                        {/* Volunteer Hours */}
                        <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200 flex flex-col">

                            <div className="text-purple-800 mb-3">
                                <Clock />
                            </div>

                            <h2 className="text-xl font-semibold text-gray-800 mb-2">
                                Volunteer Hours
                            </h2>

                            <p className="text-gray-600 text-sm mb-4">
                                Track and manage volunteer hours and contributions.
                            </p>

                            <div className="mt-auto">
                                <span className="inline-block bg-purple-100 text-purple-800 text-xs font-semibold px-3 py-1 rounded-full">
                                    Coming Soon
                                </span>
                            </div>

                        </div>

                        {/* Volunteer Directory */}
                        <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200 flex flex-col">

                            <div className="text-purple-800 mb-3">
                                <Users />
                            </div>

                            <h2 className="text-xl font-semibold text-gray-800 mb-2">
                                Volunteer Directory
                            </h2>

                            <p className="text-gray-600 text-sm mb-4">
                                View volunteer profiles, roles, assigned students, and team information.
                            </p>

                            <div className="mt-auto">
                                <span className="inline-block bg-purple-100 text-purple-800 text-xs font-semibold px-3 py-1 rounded-full">
                                    Coming Soon
                                </span>
                            </div>

                        </div>

                    </div>
                </div>

            </main>
        </div>
    );
}