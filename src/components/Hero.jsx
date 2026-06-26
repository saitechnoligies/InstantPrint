import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, MapPin, UploadCloud, KeyRound, Printer, CheckCircle2, FileText, Loader2, Lock, AlertCircle } from "lucide-react";
import { useUser, useClerk } from "@clerk/react";

// 🔥 Import real backend & PDF dependencies
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min?url";
import api from "../lib/api";

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

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
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");

  const { user, isSignedIn } = useUser();
  const { openSignIn } = useClerk();

  // 🔥 REAL API UPLOAD LOGIC
  const handleFileUpload = async (f) => {
    if (!isSignedIn) {
      openSignIn();
      return;
    }

    if (!f || f.type !== "application/pdf") {
      setError("Only PDF files are allowed");
      return;
    }

    setSelectedFile(f);
    setUploading(true);
    setError("");
    setProgress(10); // Start progress

    try {
      // 0️⃣ Read PDF page count locally
      const buffer = await f.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
      const pageCount = pdf.numPages;

      // 1️⃣ Create order row structures
      const orderRes = await api.post("/api/orders", {
        userId: user?.id || null,
      });
      const { orderId } = orderRes.data;
      setProgress(30);

      // 2️⃣ Request cloud stream pathways
      const uploadUrlRes = await api.post(`/api/orders/${orderId}/upload-url`);
      const { uploadUrl, storageKey } = uploadUrlRes.data;
      if (!uploadUrl || !storageKey) throw new Error("Invalid pipeline response format");
      setProgress(50);

      // 3️⃣ Stream document securely
      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        body: f,
      });
      if (!uploadRes.ok) throw new Error("Secure transmission channel failed");
      setProgress(80);

      // 4️⃣ Index system tracking metadata records
      await api.post(`/api/orders/${orderId}/file`, {
        storageKey,
        fileName: f.name,
        fileSize: f.size,
        pageCount,
        mimeType: f.type,
      });
      setProgress(100);

      // Successfully pass the REAL orderId to the options page
      setTimeout(() => {
        navigate("/options", {
          state: { file: f, orderId, numPages: pageCount },
        });
      }, 800);

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.message || "Failed to upload document");
      setUploading(false);
      setSelectedFile(null);
      setProgress(0);
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
    if (isSignedIn) setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (!isSignedIn) {
      openSignIn();
      return;
    }

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  return (
    <section id="home" className="relative overflow-hidden pt-36 pb-24 lg:pt-44 lg:pb-32" style={heroGradientStyle}>
      <div className="absolute inset-0 z-0" style={noiseOverlayStyle} />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-[radial-gradient(circle,rgba(200,162,77,0.18),transparent_60%)] pointer-events-none z-0" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center text-center"
        >
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-[88px] leading-[1.02] max-w-5xl text-white">
            Upload Once. <br />
            <span className="italic font-medium bg-[linear-gradient(180deg,#F0DCA0_0%,#C8A24D_100%)] bg-clip-text text-transparent">
              Print Anywhere.
            </span>
          </h1>

          <p className="mt-7 text-base sm:text-lg text-[#a3a098] max-w-xl leading-relaxed">
           Send your documents to the vault, walk to any PrintNow kiosk, enter your code — done.
          </p>

          {/* ================= UPLOAD ZONE ================= */}
          {uploading && selectedFile ? (
            // Active Upload State
            <div className="mt-10 w-full max-w-xl mx-auto rounded-3xl border border-white/10 bg-[#1e1c1a]/80 backdrop-blur-xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#c9a66b]/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-[#c9a66b]" />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="text-white font-medium truncate">{selectedFile.name}</div>
                  <div className="text-[#a3a098] text-sm">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</div>
                </div>
                {progress === 100 ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                ) : (
                  <Loader2 className="w-6 h-6 text-[#c9a66b] animate-spin" />
                )}
              </div>

              <div className="w-full bg-white/5 rounded-full h-2 mb-2 overflow-hidden">
                <div
                  className="bg-[linear-gradient(90deg,#D9B96A_0%,#C8A24D_100%)] h-full rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-[#a3a098] font-mono">
                <span>{progress === 100 ? "Redirecting to options..." : "Securing Vault..."}</span>
                <span>{progress}%</span>
              </div>
            </div>
          ) : (
            // Drag & Drop State
            <div className="w-full max-w-xl mx-auto mt-10">
              <div
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                className={`relative rounded-3xl border-2 border-dashed transition-all duration-300 p-8 sm:p-10 ${
                  isDragging
                    ? "border-[#c9a66b] bg-[#c9a66b]/10 scale-[1.02]"
                    : "border-[#c9a66b]/30 bg-[#1e1c1a]/40 hover:bg-[#1e1c1a]/60 hover:border-[#c9a66b]/50"
                } backdrop-blur-xl shadow-lg`}
              >
                <input
                  type="file"
                  id="hero-file-upload"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e.target.files[0])}
                  disabled={!isSignedIn}
                />
                <label 
                  htmlFor="hero-file-upload" 
                  className="cursor-pointer flex flex-col items-center"
                  onClick={(e) => {
                    if (!isSignedIn) {
                      e.preventDefault(); 
                      openSignIn();
                    }
                  }}
                >
                  <div className="w-16 h-16 rounded-full bg-[#c9a66b]/10 flex items-center justify-center mb-5 transition-transform group-hover:scale-110">
                    <UploadCloud className="w-8 h-8 text-[#c9a66b]" />
                  </div>
                  <h3 className="text-xl font-serif text-white mb-2">Drag & Drop your document</h3>
                  <p className="text-[#a3a098] text-sm mb-7">Supports PDF only (Max 50MB)</p>

                  <div className="group inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#D9B96A_0%,#C8A24D_50%,#A8842F_100%)] px-8 py-3.5 text-sm font-bold tracking-[0.05em] text-[#1C1C18] shadow-[0_10px_40px_-10px_rgba(200,162,77,0.6)] hover:shadow-[0_15px_50px_-10px_rgba(200,162,77,0.8)] transition-all hover:-translate-y-0.5">
                    {!isSignedIn ? (
                      <>
                        <Lock className="w-4 h-4" />
                        LOGIN TO UPLOAD
                      </>
                    ) : (
                      <>
                        BROWSE FILES
                        <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </>
                    )}
                  </div>
                </label>
              </div>

              {/* Error display under the box */}
              {error && (
                <div className="mt-4 flex items-center justify-center gap-2 text-red-400 text-sm bg-red-500/10 py-2 px-4 rounded-full">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}
              
             
            </div>
          )}

          <FlowDiagram />
        </motion.div>
      </div>
    </section>
  );
}