// main login page

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
    const [loginId, setLoginId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [checkingSession, setCheckingSession] = useState(true);

    const router = useRouter();

    // If already authenticated, redirect to home
    useEffect(() => {
        const checkSession = async () => {
            try {
                const res = await fetch("/api/getSession", {
                    cache: "no-store",
                });

                if (res.ok) {
                    const data = await res.json();

                    if (data.authenticated) {
                        router.replace("/home");
                        return;
                    }
                }
            } catch (err) {
                console.error("Session check failed:", err);
            }

            setCheckingSession(false);
        };

        checkSession();
    }, [router]);

    // Handle login
    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: loginId,
                    password: password,
                }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                router.replace("/home");
                router.refresh();
            } else {
                setError(data.error || "Login failed.");
            }

        } catch (err) {
            console.error("Login error:", err);
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Avoid briefly displaying the login form to authenticated users
    if (checkingSession) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-purple-100">
                <p className="text-purple-900">Checking session...</p>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen font-sans">

            {/* Left side: YME logo */}
            <div className="w-1/2 flex items-center justify-center bg-gray-100">
                <Image
                    src="/logo.png"
                    alt="YME Logo"
                    width={950}
                    height={950}
                    priority
                    className="object-contain w-full h-auto"
                />
            </div>

            {/* Right side: Login form */}
            <div className="w-1/2 flex flex-col items-center justify-center p-8 bg-purple-100">

                <h2 className="text-3xl font-serif font-semibold mb-8 text-purple-900">
                    Welcome to Young Minds Eye!
                </h2>

                <form onSubmit={handleLogin} className="w-full">

                    <label className="block w-full mb-2 font-medium text-gray-700">
                        Username
                    </label>

                    <input
                        type="text"
                        placeholder="Enter your username"
                        value={loginId}
                        onChange={(e) => setLoginId(e.target.value)}
                        required
                        autoComplete="username"
                        className="w-full border border-gray-400 rounded-xl p-3 mb-4
                        text-gray-900 placeholder-gray-500 caret-purple-900
                        focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />

                    <label className="block w-full mb-2 font-medium text-gray-700">
                        Your Password
                    </label>

                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                        className="w-full border border-gray-400 rounded-xl p-3 mb-6
                        text-gray-900 placeholder-gray-500 caret-purple-900
                        focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />

                    {error && (
                        <p className="text-red-600 text-sm mb-4" role="alert">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-purple-900 text-white p-3 rounded-lg
                        hover:bg-purple-800 transition disabled:opacity-60"
                    >
                        {loading ? "Logging in..." : "Get Started"}
                    </button>

                </form>
            </div>
        </div>
    );
}