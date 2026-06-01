import React from "react";
import { SignInButton, UserButton, Show } from "@clerk/react";
import { useNavigate } from "react-router-dom";

export default function Nav() {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 px-6 flex items-center justify-between 
                    bg-white/80 backdrop-blur-md border-b border-gray-200">

      {/* LEFT: Logo */}
      <div
        onClick={() => navigate("/")}
        className="flex items-center gap-2 cursor-pointer select-none"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-400 
                        flex items-center justify-center text-white font-bold">
          P
        </div>
        <span className="text-lg font-semibold text-gray-800">
          PrintNow
        </span>
      </div>

      {/* CENTER: New Order Button */}
      <div className="hidden sm:block">
        <button
          onClick={() => navigate("/upload")}
          className="px-4 py-1.5 rounded-full text-sm font-medium 
                     bg-blue-600 text-white 
                     hover:bg-blue-700 transition"
        >
          New Print
        </button>
      </div>

      {/* RIGHT: Auth */}
      <div className="flex items-center gap-3">
        <Show when="signed-out">
          <SignInButton mode="modal">
            <button
              className="px-4 py-1.5 rounded-full text-sm font-medium 
                         border border-blue-500 text-blue-600 
                         hover:bg-blue-600 hover:text-white transition"
            >
              Login
            </button>
          </SignInButton>
        </Show>

        <Show when="signed-in">
          <UserButton />
        </Show>
      </div>
    </nav>
  );
}
