import React, { useState } from "react";
import { KeyRound, ShieldCheck, Loader2, ArrowLeft, Printer } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../lib/api";

const pageBackgroundStyle = {
  background: `
    radial-gradient(ellipse 80% 60% at 50% -10%, rgba(200, 162, 77, 0.12), transparent 60%),
    linear-gradient(180deg, #0C0B0A 0%, #16160F 100%)
  `
};

export default function OtpPage() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (otp.length !== 6) {
      setError("Please enter a complete 6-digit code");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const { data } = await api.post("/api/orders/verify-otp", { otp });

      // 🔥 DOWNLOAD FILE
      window.open(data.fileUrl, "_blank");

    } catch (err) {
      setError(err.response?.data?.error || err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // Restrict entry entirely to numerical values
    if (value.length <= 6) {
      setOtp(value);
      if (error) setError("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-[#e8e6e3] select-none relative" style={pageBackgroundStyle}>
      
      {/* Absolute Geometric SVG Grid Overlay Pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-5 pointer-events-none z-0" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="otpGrid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#c9a66b" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#otpGrid)" />
      </svg>

      {/* Return Quick link Navigation anchor element */}
      <button 
        onClick={() => navigate("/")} 
        className="absolute top-8 left-4 sm:left-8 flex items-center gap-2 text-xs font-semibold tracking-wider text-[#a3a098] hover:text-white transition-colors cursor-pointer group z-10"
      >
        <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
        RETURN BACK
      </button>

      {/* Main Glassmorphic Card Panel container block */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 bg-[#1e1c1a]/50 backdrop-blur-xl border border-white/5 p-8 w-full max-w-md rounded-[32px] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.9)] text-center"
      >
        {/* Ambient background decoration glowing node */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#c9a66b]/10 blur-2xl rounded-full pointer-events-none" />

        {/* Security Pad Header Sections */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#c9a66b]/10 border border-[#c9a66b]/20 flex items-center justify-center text-[#c9a66b] mb-4 shadow-inner">
            <KeyRound size={24} />
          </div>
          <div className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#c9a66b]">Kiosk Authorization</div>
          <h2 className="text-2xl font-serif font-bold text-white mt-1">Enter Verification Code</h2>
          <p className="text-xs text-[#a3a098] mt-2 max-w-xs leading-relaxed">
            Provide the 6-digit secure code generated during your transaction to release document binaries.
          </p>
        </div>

        {/* Secured Input Form Matrix Node */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="text"
              value={otp}
              onChange={handleOtpChange}
              maxLength={6}
              disabled={loading}
              className="w-full bg-[#0f0e0c]/80 border border-white/5 rounded-2xl py-4 pl-3 text-center font-mono tabular-nums text-3xl sm:text-4xl tracking-[0.5em] font-bold text-white placeholder:text-white/5 focus:outline-none focus:border-[#c9a66b]/50 shadow-inner transition-colors h-[80px]"
              placeholder="000000"
              autoFocus
            />
            
            {/* Visual bottom placeholder line highlights when content is incomplete */}
            <div className="absolute bottom-4 inset-x-8 flex justify-between pointer-events-none opacity-20">
              {Array.from({ length: 6 }).map((_, i) => (
                <div 
                  key={i} 
                  className={`w-4 h-0.5 transition-colors duration-300 ${
                    otp.length > i ? "bg-[#c9a66b]" : "bg-white"
                  }`} 
                />
              ))}
            </div>
          </div>

          {/* Real-time Dynamic Status Intercept Interface */}
          {error && (
            <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/20 rounded-xl p-3.5 text-xs text-red-400 text-left animate-in fade-in slide-in-from-top-1 duration-200">
              <AlertCircle className="shrink-0 mt-0.5" size={14} />
              <p className="leading-relaxed">{error}</p>
            </div>
          )}

          {/* Trigger Control Form Button element */}
          <button
            type="submit"
            disabled={otp.length !== 6 || loading}
            className={`group w-full py-4 rounded-2xl font-bold tracking-wide text-sm flex items-center justify-center gap-2 transition-all duration-300
            ${otp.length === 6 && !loading
                ? "bg-[linear-gradient(135deg,#D9B96A_0%,#C8A24D_50%,#A8842F_100%)] text-[#1C1C18] shadow-[0_10px_30px_-10px_rgba(201,166,107,0.4)] hover:shadow-[0_15px_40px_-10px_rgba(201,166,107,0.6)] hover:scale-[1.01] cursor-pointer"
                : "bg-white/5 text-gray-500 border border-white/5 cursor-not-allowed"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin text-gray-500" size={16} />
                VERIFYING SECURE KEY...
              </>
            ) : (
              <>
                <ShieldCheck size={16} />
                RELEASE & DOWNLOAD FILE
              </>
            )}
          </button>
        </form>

        {/* Footer Brand Verification Label */}
        <div className="mt-8 pt-5 border-t border-white/[0.04] flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest text-[#a3a098]">
          <Printer size={12} className="text-[#c9a66b]/60" />
          <span>PrintNow Secure Kiosk Nodes</span>
        </div>

      </motion.div>
    </div>
  );
}