// main login page

"use client";
import { useState } from "react"; 

export default function LoginPage() {

    // State variables 
    const [loginId, setLoginId] = useState(""); // stores the ID
    const [password, setPassword] = useState(""); // stores password

    return (
        <div className="flex min-h-screen">
      {/* Left side for logo and name */}
      <div className="w-1/2 flex items-center justify-center bg-gray-100">
        {/* Placeholder for logo */}
        <h1 className="text-3xl font-bold">YME Logo</h1>
      </div>

      {/* Right side to login */}
      <div className="w-1/2 flex flex-col items-center justify-center p-8">
        {/* Title */}
        <h2 className="text-2xl font-bold mb-6">Talk Buddies Feedback Form</h2>

        {/* Login ID */}
        <label className="w-full mb-2">Log in ID</label>
        <input
          type="text"
          placeholder="Enter your ID"
          value={loginId} // binds state to input 
          onChange={(e) => setLoginId(e.target.value)} // updates state on typing 
          className="w-full border rounded p-2 mb-4"
        />

        {/* Password */}
        <label className="w-full mb-2">Your Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password} // binds state to input 
          onChange={(e) => setPassword(e.target.value)} // updates state on typing
          className="w-full border rounded p-2 mb-6"
        />

        {/* Get Started Button */}
        <button className="w-full bg-purple-900 text-white p-3 rounded">
          Get Started
        </button>
      </div>
    </div>
  );
}