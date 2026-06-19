import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SignInButton, Show, useUser, useAuth } from "@clerk/react";
import { motion } from "framer-motion";
import { CheckCircle2, ShieldCheck, FileText, Layers, Loader2, Sparkles, AlertCircle } from "lucide-react";
import api from "../lib/api";
import OrderTimeline from "../components/OrderTimeline";
const pageBackgroundStyle = {
  background: `
    radial-gradient(ellipse 80% 60% at 50% -10%, rgba(200, 162, 77, 0.15), transparent 60%),
    linear-gradient(180deg, #0C0B0A 0%, #16160F 100%)
  `
};

export default function SuccessPage() {
  const navigate = useNavigate();
  const { orderId } = useParams();

  const { isSignedIn, user } = useUser();
  const { getToken } = useAuth();

  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [attached, setAttached] = useState(false);
  const [attachStatus, setAttachStatus] = useState(null);

  /* ---------- FETCH ORDER ---------- */
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/api/orders/${orderId}`);
        setOrderData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchOrder();
  }, [orderId]);

  /* ---------- ATTACH ORDER AFTER LOGIN ---------- */
  useEffect(() => {
    const attachUser = async () => {
      if (
        isSignedIn &&
        user?.id &&
        orderId &&
        !attached &&
        !orderData?.isLinked
      ) {
        try {
          const token = await getToken();

          const { data } = await api.post(
            `/api/orders/${orderId}/attach-user`,
            null,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          if (data.isNewlyLinked) {
            setAttachStatus("Order saved to your account profile ✅");
          }
          if (data.attached) {
            setAttached(true);
          }
        } catch (err) {
          console.error("Attach user payload reference failed:", err);
        }
      }
    };

    attachUser();
  }, [isSignedIn, user?.id, orderId, attached, orderData, getToken]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0C0B0A] text-[#a3a098] font-serif gap-3">
        <Loader2 className="animate-spin text-[#c9a66b]" size={28} />
        <p className="text-xs tracking-wider">Verifying clearing data structures...</p>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0C0B0A] text-[#a3a098] p-4">
        <div className="bg-[#1e1c1a]/60 border border-white/5 rounded-2xl p-6 max-w-sm w-full text-center space-y-4 shadow-xl">
          <AlertCircle className="mx-auto text-red-400" size={32} />
          <p className="text-sm leading-relaxed">Order record not identified or session token has expired.</p>
          <button 
            onClick={() => navigate("/")}
            className="text-xs font-semibold px-4 py-2 border border-white/10 rounded-full text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  const otp = orderData.otp || "------";

  return (
    <div className="min-h-screen pt-32 pb-12 px-4 sm:px-6 text-[#e8e6e3] flex flex-col items-center justify-center relative overflow-hidden" style={pageBackgroundStyle}>
      
      {/* Absolute Geometric Background Visuals */}
      <svg className="absolute inset-0 w-full h-full opacity-5 pointer-events-none z-0" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="successGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#c9a66b" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#successGrid)" />
      </svg>

      {/* ================= TIMELINE INDICATOR ================= */}
      <div className="relative z-10 w-full max-w-4xl flex flex-col mb-8">
        <OrderTimeline currentStep={4} />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 bg-[#1e1c1a]/50 backdrop-blur-xl border border-white/5 p-6 sm:p-8 w-full max-w-md rounded-[32px] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.9)] text-center"
      >
        {/* Glowing visual indicator anchor points */}
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-5 shadow-inner">
          <CheckCircle2 size={28} />
        </div>

        <h2 className="text-2xl font-serif font-bold text-white tracking-wide">
          Payment Successful
        </h2>
        
        <p className="text-xs sm:text-sm text-[#a3a098] mt-2 leading-relaxed max-w-xs mx-auto">
          Your allocation clearance has been verified. Use the secure OTP grid below at any physical kiosk station to collect prints.
        </p>

        {/* ================= OPT DISPLAY MATRIX ================= */}
       <div className="my-8 bg-[#0f0e0c]/40 border border-white/5 rounded-2xl p-6 shadow-inner">
  <p className="text-[10px] uppercase tracking-[0.22em] text-[#c9a66b] font-semibold mb-5">
    Collection Pass Key
  </p>

  <div className="flex justify-center items-center gap-2 sm:gap-3">
    {otp.split("").map((digit, index) => (
      <div
        key={index}
        className="w-12 h-16 sm:w-14 sm:h-17 rounded-xl bg-[#141311] border border-[#c9a66b]/20 flex items-center justify-center shadow-[0_10px_30px_-15px_rgba(201,166,107,0.25)]"
      >
        <span className="text-3xl sm:text-4xl font-black leading-none bg-gradient-to-b from-[#f8efdc] via-[#e8d099] to-[#c9a66b] bg-clip-text text-transparent">
          {digit}
        </span>
      </div>
    ))}
  </div>

  <p className="text-[10px] text-[#a3a098] opacity-60 mt-5 tracking-wide">
    Enter this code at the kiosk to release your prints
  </p>
</div>
        {/* ================= ACCOUNT ACQUISITION ALERT AREA ================= */}
        <div className="bg-[#0f0e0c]/70 border border-white/5 rounded-xl p-4 text-left text-xs space-y-2 text-[#a3a098] shadow-inner mb-6">
          <div className="flex justify-between items-center pb-2 border-b border-white/[0.04]">
            <span className="flex items-center gap-2"><ShieldCheck size={13} className="text-[#c9a66b]" /> Token ID</span>
            <span className="text-white font-medium truncate max-w-[180px]">#{orderData.orderId}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2"><Layers size={13} className="text-[#c9a66b]" /> Sheets Parsed</span>
            <span className="text-white font-medium">{orderData.printOptions?.selectedPages || "All"}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2"><FileText size={13} className="text-[#c9a66b]" /> Volume Copies</span>
            <span className="text-white font-medium">× {orderData.printOptions?.copies || 1}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-white/[0.04]">
            <span className="text-white font-medium">Settled Amount</span>
            <span className="text-sm font-bold text-white">₹{orderData.price?.total}</span>
          </div>
        </div>

        {/* ================= CLERK AUTH LAYER ATTACH BUTTONS ================= */}
        <Show when="signed-out">
          <div className="mt-4 mb-2 p-4 border border-[#c9a66b]/20 bg-[#c9a66b]/5 rounded-2xl text-left space-y-3">
            <p className="text-xs text-[#e8d099] leading-relaxed">
              Log into your cloud account now to append this print file to your historical summary dashboard and enable instantaneous cancellation paths.
            </p>

            <SignInButton mode="modal">
              <button className="w-full py-2.5 rounded-xl text-xs font-bold tracking-wide bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer">
                Login & Persist Record
              </button>
            </SignInButton>
          </div>
        </Show>

        {/* Dynamic User Record Binding Confirmation Messages */}
        {attachStatus && (
          <div className="my-3 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 py-2 px-3 rounded-xl animate-in fade-in duration-300">
            {attachStatus}
          </div>
        )}

        {/* Core Control Button Triggers */}
        <button
          onClick={() => navigate("/upload")}
          className="mt-2 w-full py-4 rounded-2xl font-bold tracking-wide text-sm flex items-center justify-center gap-2 bg-[linear-gradient(135deg,#D9B96A_0%,#C8A24D_50%,#A8842F_100%)] text-[#1C1C18] shadow-[0_10px_30px_-10px_rgba(201,166,107,0.4)] hover:shadow-[0_15px_40px_-10px_rgba(201,166,107,0.6)] hover:scale-[1.01] transition-all duration-300 cursor-pointer"
        >
          <Sparkles size={16} />
          PRINT ANOTHER DOCUMENT
        </button>
      </motion.div>
    </div>
  );
}