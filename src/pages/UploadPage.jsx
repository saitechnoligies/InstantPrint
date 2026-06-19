import { useState, useRef, useCallback, useMemo } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min?url";
import { useNavigate } from "react-router-dom";
import { useUser, useClerk } from "@clerk/react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  UploadCloud, FileText, X, AlertCircle, Sparkles, 
  CheckCircle2, Loader2, ShieldCheck, Database, KeyRound, Lock
} from "lucide-react";
import api from "../lib/api";
import OrderTimeline from "../components/OrderTimeline";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

// Custom design language tokens implemented completely without App.css dependencies
const pageBackgroundStyle = {
  background: `
    radial-gradient(ellipse 80% 60% at 50% -10%, rgba(200, 162, 77, 0.15), transparent 60%),
    radial-gradient(circle at 90% 80%, rgba(217, 185, 106, 0.04), transparent 40%),
    linear-gradient(180deg, #0C0B0A 0%, #16160F 100%)
  `
};

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [pageCount, setPageCount] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const inputRef = useRef();
  const navigate = useNavigate();
  
  // --- AUTHENTICATION STATE ---
  const { user, isSignedIn } = useUser();
  const { openSignIn } = useClerk();

  // 📄 Read PDF structures via binary buffers
  const handleFile = async (f) => {
    if (!f || f.type !== "application/pdf") {
      setError("Only PDF files are allowed");
      return;
    }

    try {
      const buffer = await f.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

      setFile(f);
      setPageCount(pdf.numPages);
      setError("");
    } catch (err) {
      setError("Failed to read PDF format properly");
    }
  };

  // Drag and Drop Event Callbacks
  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    if (isSignedIn) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [isSignedIn]);

  const onDragOver = (e) => {
    e.preventDefault();
    if (isSignedIn) setDragging(true);
  };

  const onDragLeave = () => setDragging(false);

  const removeFile = () => {
    setFile(null);
    setPageCount(null);
    setProgress(0);
  };

  // Map progress values into precise pipeline checkpoints
  const checkpoints = useMemo(() => [
    { label: "Initializing security workspace", value: 10, icon: ShieldCheck },
    { label: "Requesting server vault access", value: 30, icon: KeyRound },
    { label: "Streaming encrypted data packets", value: 50, icon: UploadCloud },
    { label: "Indexing global system metadata", value: 80, icon: Database }
  ], []);

  // Determine current active pipeline phase
  const currentStepIndex = useMemo(() => {
    if (progress >= 100) return 4;
    if (progress >= 80) return 3;
    if (progress >= 50) return 2;
    if (progress >= 30) return 1;
    if (progress >= 10) return 0;
    return -1;
  }, [progress]);

  // 🚀 Secured Processing Stream
  const uploadFile = async () => {
    if (!file) return;

    setUploading(true);
    setProgress(10);
    setError("");

    try {
      // 1️⃣ Create order row structures
      let orderRes;
      try {
        orderRes = await api.post("/api/orders", {
          userId: user?.id || null,
        });
      } catch (err) {
        throw new Error(err.response?.data?.error || "Failed to create security payload");
      }

      const { orderId } = orderRes.data;
      setProgress(30);

      // 2️⃣ Request cloud stream pathways
      let uploadUrlRes;
      try {
        uploadUrlRes = await api.post(`/api/orders/${orderId}/upload-url`);
      } catch (err) {
        throw new Error(err.response?.data?.error || "Failed to acquire stream permissions");
      }

      const { uploadUrl, storageKey } = uploadUrlRes.data;
      if (!uploadUrl || !storageKey) {
        throw new Error("Acquired invalid pipeline response format");
      }

      setProgress(50);

      // 3️⃣ Stream document stream blocks
      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
      });

      if (!uploadRes.ok) {
        throw new Error("Secure transmission channel failed");
      }

      setProgress(80);

      // 4️⃣ Index system tracking metadata records
      try {
        await api.post(`/api/orders/${orderId}/file`, {
          storageKey,
          fileName: file.name,
          fileSize: file.size,
          pageCount,
          mimeType: file.type,
        });
      } catch (err) {
        throw new Error(err.response?.data?.error || "Failed to catalog payload layout parameters");
      }

      setProgress(100);

      // Artificial buffer delay to let users view successful verification checks
      setTimeout(() => {
        navigate("/options", {
          state: { file, orderId, numPages: pageCount },
        });
      }, 800);

    } catch (err) {
      console.error(err);
      setError(err.message || "Pipeline processing error experienced.");
      setProgress(0);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center pt-24 pb-12 px-4 text-[#e8e6e3] relative overflow-hidden" style={pageBackgroundStyle}>
      
      {/* Absolute Geometric SVG Grid Overlay Pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none z-0" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="uploadGrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#c9a66b" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#uploadGrid)" />
      </svg>
    
      <div className="relative z-10 w-full max-w-4xl flex flex-col mt-8 mb-4">
        
        {/* ================= ORDER TIMELINE ================= */}
        <OrderTimeline currentStep={1} />

        <div className="w-full grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center mt-8">
          
          {/* ================= LEFT COLUMN: INFO & BRANDING ================= */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 hidden lg:block"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1e1c1a]/60 border border-white/10 text-[11px] tracking-[0.18em] uppercase text-[#a3a098] backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              End-To-End Encrypted
            </div>
            <h1 className="font-serif text-4xl xl:text-5xl leading-[1.15] text-white">
              Deposit document <br />
              into your secure <span className="italic bg-[linear-gradient(180deg,#F0DCA0_0%,#C8A24D_100%)] bg-clip-text text-transparent font-medium">Vault.</span>
            </h1>
            <p className="text-sm text-[#a3a098] leading-relaxed max-w-md">
              Your file parameters are checked locally, isolated through private temporary buffers, and shredded from cloud networks immediately following physical collection.
            </p>
          </motion.div>

          {/* ================= RIGHT COLUMN: CONSOLE BOX ================= */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-[#1e1c1a]/50 backdrop-blur-xl border border-white/5 rounded-[32px] p-6 sm:p-8 w-full shadow-[0_30px_70px_-15px_rgba(0,0,0,0.9)]"
          >
            <AnimatePresence mode="wait">
              {!uploading ? (
                // --- STAGE 1: SELECTION & DROP DESIGN ---
                <motion.div 
                  key="dropzone-view"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="space-y-6"
                >
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#c9a66b]">Console</div>
                    <h2 className="text-xl font-serif font-bold text-white mt-1">Select Document</h2>
                  </div>

                  <div
                    onClick={() => isSignedIn && !file && inputRef.current.click()}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center transition-all duration-300
                    ${dragging 
                      ? "border-[#c9a66b] bg-[#c9a66b]/10 scale-[1.01]" 
                      : "border-white/10 bg-[#0f0e0c]/40 hover:bg-[#1e1c1a]/40 hover:border-[#c9a66b]/30"
                    }
                    ${file ? "border-emerald-500/30 bg-emerald-500/[0.01]" : ""}
                    ${!isSignedIn ? "cursor-default" : "cursor-pointer group"}`}
                  >
                    <input
                      ref={inputRef}
                      type="file"
                      accept="application/pdf"
                      hidden
                      onChange={(e) => handleFile(e.target.files[0])}
                    />

                    {!isSignedIn ? (
                      // --- LOGGED OUT STATE ---
                      <div className="flex flex-col items-center py-4">
                        <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4 text-red-400">
                          <Lock size={24} />
                        </div>
                        <p className="font-serif text-xl text-white mb-2">Authentication Required</p>
                        <p className="text-sm text-[#a3a098] max-w-sm mb-6 leading-relaxed">
                          You must be logged into your account to securely upload documents to the vault.
                        </p>
                        <button 
                          onClick={(e) => { e.stopPropagation(); openSignIn(); }}
                          className="bg-[linear-gradient(135deg,#D9B96A_0%,#C8A24D_50%,#A8842F_100%)] text-[#1C1C18] px-8 py-3 rounded-xl font-bold tracking-wide text-sm shadow-[0_10px_30px_-10px_rgba(201,166,107,0.4)] hover:shadow-[0_15px_40px_-10px_rgba(201,166,107,0.6)] hover:scale-[1.02] transition-all cursor-pointer"
                        >
                          LOGIN TO UPLOAD
                        </button>
                      </div>
                    ) : !file ? (
                      // --- LOGGED IN, NO FILE STATE ---
                      <div className="flex flex-col items-center">
                        <div className="w-14 h-14 rounded-2xl bg-[#c9a66b]/10 border border-[#c9a66b]/20 flex items-center justify-center mb-4 text-[#c9a66b] group-hover:scale-105 transition-transform">
                          <UploadCloud size={24} />
                        </div>
                        <p className="font-serif text-lg text-white font-medium">Drag & drop document</p>
                        <p className="text-xs text-[#a3a098] mt-1">or browse machine files — PDF up to 20MB</p>
                      </div>
                    ) : (
                      // --- LOGGED IN, FILE UPLOADED STATE ---
                      <div className="flex items-center gap-4 text-left bg-[#0f0e0c]/60 border border-white/5 p-4 rounded-xl relative">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-white text-sm truncate pr-6">{file.name}</p>
                          <p className="text-xs text-[#a3a098] mt-0.5">{pageCount} {pageCount === 1 ? 'page' : 'pages'} · Locally verified</p>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); removeFile(); }}
                          className="absolute top-4 right-4 text-[#a3a098] hover:text-white p-1 hover:bg-white/5 rounded-lg transition-colors cursor-pointer z-10"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </div>

                  {error && (
                    <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-sm text-red-400">
                      <AlertCircle className="shrink-0 mt-0.5" size={16} />
                      <p className="leading-relaxed">{error}</p>
                    </div>
                  )}

                  {/* Hide upload button if not signed in */}
                  {isSignedIn && (
                    <motion.button
                      whileHover={{ scale: file ? 1.01 : 1 }}
                      whileTap={{ scale: file ? 0.99 : 1 }}
                      disabled={!file}
                      onClick={uploadFile}
                      className={`w-full py-4 rounded-2xl font-bold tracking-wide text-sm flex items-center justify-center gap-2 transition-all duration-300
                      ${file 
                        ? "bg-[linear-gradient(135deg,#D9B96A_0%,#C8A24D_50%,#A8842F_100%)] text-[#1C1C18] shadow-[0_15px_40px_-10px_rgba(200,162,77,0.5)] cursor-pointer" 
                        : "bg-white/5 text-gray-500 border border-white/5 cursor-not-allowed"
                      }`}
                    >
                      <Sparkles size={16} />
                      UPLOAD TO VAULT
                    </motion.button>
                  )}
                </motion.div>
              ) : (
                // --- STAGE 2: PROCESSING & DYNAMIC TRACKING ROADMAP ---
                <motion.div 
                  key="uploading-view"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="space-y-6"
                >
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#c9a66b]">Syncing Pipeline</div>
                    <h2 className="text-xl font-serif font-bold text-white mt-1">Processing Vault Payload</h2>
                  </div>

                  {/* Micro-Progress Percentage Metrics */}
                  <div className="flex items-end justify-between border-b border-white/5 pb-4">
                    <div className="flex items-center gap-3">
                      <Loader2 className="animate-spin text-[#c9a66b]" size={18} />
                      <span className="text-sm font-medium text-white">Transmitting blocks...</span>
                    </div>
                    <span className="font-serif text-2xl font-bold text-[#c9a66b]">{progress}%</span>
                  </div>

                  {/* Vertical Dynamic Processing Timeline */}
                  <div className="space-y-4 py-2">
                    {checkpoints.map((step, idx) => {
                      const isCompleted = progress > step.value || progress === 100;
                      const isActive = currentStepIndex === idx;
                      
                      return (
                        <div 
                          key={step.value}
                          className={`flex items-center gap-4 transition-all duration-300 ${
                            isCompleted || isActive ? "opacity-100" : "opacity-25"
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all duration-300 ${
                            isCompleted 
                              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                              : isActive 
                              ? "bg-[#c9a66b]/10 border-[#c9a66b]/50 text-[#c9a66b]"
                              : "bg-[#0f0e0c]/40 border-white/5 text-[#a3a098]"
                          }`}>
                            {isCompleted ? <CheckCircle2 size={16} /> : <step.icon size={16} />}
                          </div>
                          <span className={`text-xs tracking-wide transition-colors ${
                            isActive ? "text-[#c9a66b] font-semibold" : "text-white"
                          }`}>
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Unified Baseline Loading Tracker Fill Container */}
                  <div className="w-full bg-[#0f0e0c]/60 border border-white/5 p-1 rounded-full overflow-hidden">
                    <div
                      className="bg-[linear-gradient(90deg,#c9a66b_0%,#e8d099_100%)] h-1.5 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}