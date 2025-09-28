// dashboard or home page to navigate after logging in

"use client";

import Link from "next/link";
import { useState } from "react";

export default function HomePage() {
  // For now, hardcode role until we connect login → session
  const [role] = useState("Volunteer"); // change to "Exec" to test

  return (
    <div className="min-h-screen bg-purple-100 flex flex-col">
      {/* Top bar */}
      <header className="flex justify-between items-center bg-purple-200 px-6 py-4 shadow">
        <span className="text-gray-800 font-medium">
          Logged in as <span className="font-bold">{role}</span>
        </span>
        <button className="text-red-600 hover:text-red-800 font-medium">
          Logout
        </button>
      </header>

      {/* Centered card */}
      <main className="flex flex-1 items-center justify-center">
        <div className="bg-white shadow-lg rounded-2xl p-10 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Welcome to YME Feedback System!
          </h1>
          <p className="text-gray-800 mb-8">Please choose an option below:</p>

          <div className="space-y-4">
            <Link
              href="/responses"
              className="block w-full bg-purple-900 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition"
            >
              Submit a New Feedback
            </Link>

            <Link
              href="/past-responses"
              className="block w-full border border-purple-900 text-purple-900 py-3 rounded-lg font-medium hover:bg-purple-100 transition"
            >
              View Past Responses
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
