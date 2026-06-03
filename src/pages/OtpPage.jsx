// pages/OtpPage.jsx

import React, { useState } from "react";
import api from "../lib/api";

export default function OtpPage() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const { data } = await api.post("/api/orders/verify-otp", { otp });

      // 🔥 DOWNLOAD FILE
      window.open(data.fileUrl, "_blank");

    } catch (err) {
      alert(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-md w-80 text-center">

        <h2 className="text-xl font-semibold mb-4">
          Enter OTP
        </h2>

        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
          className="w-full border p-2 rounded mb-4 text-center text-lg tracking-widest"
          placeholder="Enter OTP"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg"
        >
          {loading ? "Verifying..." : "Download File"}
        </button>

      </div>
    </div>
  );
}
