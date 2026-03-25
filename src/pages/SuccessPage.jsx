import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function SuccessPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const orderData = state?.orderData;

  /* ---------- SAFETY (refresh / direct access) ---------- */
  if (!orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Invalid access. Please start again.
      </div>
    );
  }

  const otp = orderData.otp;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md text-center">
        {/* SUCCESS */}
        <h2 className="text-2xl font-semibold text-green-600 mb-2">
          Payment Successful
        </h2>

        <p className="text-gray-600 mb-6">
          Your order has been confirmed. Use the OTP below to collect your
          print.
        </p>

        {/* OTP */}
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-2">Collection OTP</p>

          <div className="flex justify-center gap-3">
            {otp.split("").map((digit, i) => (
              <div
                key={i}
                className="w-12 h-14 flex items-center justify-center text-2xl font-bold border rounded-lg bg-blue-50 text-blue-600"
              >
                {digit}
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-400 mt-2">Valid for 10 minutes</p>
        </div>

        {/* ORDER SUMMARY */}
        <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 mb-6">
          <p>
            <b>Order ID:</b> {orderData.orderId}
          </p>
          <p>
            <b>Pages:</b> {orderData?.printOptions?.selectedPages}
          </p>
          <p>
            <b>Copies:</b> {orderData?.printOptions?.copies}
          </p>
          <p>
            <b>Total Paid:</b> ₹{orderData?.price?.total}
          </p>
        </div>

        {/* INSTRUCTION */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700 mb-6">
          Show this OTP at the print shop to collect your documents.
        </div>

        {/* ACTION */}
        <button
          onClick={() => navigate("/")}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
        >
          Print Another Document
        </button>
      </div>
    </div>
  );
}
