import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, MapPin, UploadCloud, KeyRound, Printer, CheckCircle2 } from "lucide-react";

// The complex Lovable Hero Gradient
const heroGradientStyle = {
  background: `
    radial-gradient(ellipse 80% 60% at 50% -10%, rgba(200, 162, 77, 0.22), transparent 60%),
    radial-gradient(ellipse 60% 50% at 90% 20%, rgba(217, 185, 106, 0.12), transparent 60%),
    radial-gradient(ellipse 70% 60% at 10% 80%, rgba(200, 162, 77, 0.10), transparent 60%),
    linear-gradient(180deg, #1C1C18 0%, #16160F 100%)
  `
};

// The raw SVG noise filter overlay
const noiseOverlayStyle = {
  backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/><feColorMatrix values='0 0 0 0 0.78 0 0 0 0 0.64 0 0 0 0 0.30 0 0 0 0.18 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`,
  opacity: 0.06,
  mixBlendMode: "overlay",
  pointerEvents: "none"
};

function FlowDiagram() {
  const steps = [
    { icon: UploadCloud, title: "Upload File", sub: "PDF · DOCX · IMG" },
    { icon: KeyRound, title: "OTP Generated", sub: "6-digit secure" },
    { icon: Printer, title: "Printer Kiosk", sub: "Enter your code" },
    { icon: CheckCircle2, title: "Collected", sub: "Receipt issued" },
  ];

  return (
    <div className="relative mt-16 w-full max-w-5xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 relative z-10">
        {steps.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + i * 0.12, duration: 0.6 }}
            className="bg-[#1e1c1a]/60 backdrop-blur-md border border-white/5 rounded-2xl p-5 flex flex-col items-center text-center shadow-lg"
          >
            <div className="w-12 h-12 rounded-xl bg-[#c9a66b]/10 border border-[#c9a66b]/30 grid place-items-center mb-3">
              <s.icon className="w-5 h-5 text-[#c9a66b]" />
            </div>
            <div className="text-sm font-medium text-white">{s.title}</div>
            <div className="text-[11px] uppercase tracking-wider text-[#a3a098] mt-1">{s.sub}</div>
          </motion.div>
        ))}
      </div>
      
      {/* Animated connector line (desktop only) */}
      <svg className="hidden md:block absolute top-11 left-0 right-0 w-full h-2 z-0" preserveAspectRatio="none" viewBox="0 0 100 2">
        <line x1="12" y1="1" x2="88" y2="1" stroke="rgba(201,166,107,0.3)" strokeWidth="0.3" strokeDasharray="6 6" className="animate-[pulse_3s_ease-in-out_infinite]" />
      </svg>
    </div>
  );
}

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section id="home" className="relative overflow-hidden pt-36 pb-24 lg:pt-44 lg:pb-32" style={heroGradientStyle}>
      {/* Noise filter layer */}
      <div className="absolute inset-0 z-0" style={noiseOverlayStyle} />
      
      {/* Center gold orb glow */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-[radial-gradient(circle,rgba(200,162,77,0.18),transparent_60%)] pointer-events-none z-0" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center text-center"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1e1c1a]/60 backdrop-blur-xl border border-white/10 text-[11px] tracking-[0.18em] uppercase text-[#a3a098] mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Now live across 240+ kiosks
          </div>

          <h1 className="font-serif text-5xl sm:text-6xl lg:text-[88px] leading-[1.02] max-w-5xl text-white">
            Upload Once. <br />
            {/* Inline text gradient replacing the CSS class */}
            <span className="italic font-medium bg-[linear-gradient(180deg,#F0DCA0_0%,#C8A24D_100%)] bg-clip-text text-transparent">
              Print Anywhere.
            </span>
          </h1>

          <p className="mt-7 text-base sm:text-lg text-[#a3a098] max-w-xl leading-relaxed">
            Secure cloud printing powered by OTP verification. Send your documents to the vault, walk to any PrintNow kiosk, enter your code — done.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={() => navigate("/upload")}
              className="group inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#D9B96A_0%,#C8A24D_50%,#A8842F_100%)] px-8 py-3.5 text-sm font-bold tracking-[0.05em] text-[#1C1C18] shadow-[0_10px_40px_-10px_rgba(200,162,77,0.6)] hover:shadow-[0_15px_50px_-10px_rgba(200,162,77,0.8)] transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" />
              UPLOAD DOCUMENT
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
            
            <button className="inline-flex items-center gap-2 rounded-full bg-[#1e1c1a]/40 backdrop-blur-xl border border-white/10 px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/5 transition-all cursor-pointer">
              <MapPin className="w-4 h-4 text-[#c9a66b]" />
              Find Printer
            </button>
          </div>

          <FlowDiagram />
        </motion.div>
      </div>
    </section>
  );
}