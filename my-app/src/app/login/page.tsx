// main login page

"use client";
import { useState } from "react"; 
import Image from "next/image";

export default function LoginPage() {

  // State variables 
  const [loginId, setLoginId] = useState(""); // stores the ID
  const [password, setPassword] = useState(""); // stores password

  return (
    <div className="flex min-h-screen font-sans">
      {/* Left side for logo and name */}
      <div className="w-1/2 flex items-center justify-center bg-gray-100">
        <Image
          src="/logo.png"      // file from public/
          alt="YME Logo"       // accessibility text
          width={950}          
          height={950}        
          priority             // ensures it loads sharp/fast
          className="object-contain w-full h-auto"
        />
      </div>

      {/* Right side login section */}
      <div className="w-1/2 flex flex-col items-center justify-center p-8 bg-purple-100">
        
        {/* Title */}
        <h2 className="text-3xl font-serif font-semibold mb-8 text-purple-900">
          Welcome to Young Mind&apos;s Eye!
        </h2>

        {/* Login ID */}
        <label className="w-full mb-2 font-medium text-gray-700">Log in ID</label>
        <input
          type="text"
          placeholder="Enter your ID"
          value={loginId}
          onChange={(e) => setLoginId(e.target.value)}
          className="w-full border border-gray-400 rounded-xl p-3 mb-4 
                     text-gray-900 placeholder-gray-500 caret-purple-900
                     focus:outline-none focus:ring-2 focus:ring-purple-400"
        />

        {/* Password */}
        <label className="w-full mb-2 font-medium text-gray-700">Your Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-400 rounded-xl p-3 mb-6 
                     text-gray-900 placeholder-gray-500 caret-purple-900
                     focus:outline-none focus:ring-2 focus:ring-purple-400"
        />

        {/* Get Started Button */}
        <button className="w-full bg-purple-900 text-white p-3 rounded-lg hover:bg-purple-800 transition">
          Get Started
        </button>
      </div>
    </div>
  );
}
