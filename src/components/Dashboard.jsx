import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  UploadCloud, FileText, Minus, Plus, Sparkles, X, 
  AlertCircle, Loader2, Layers, Lock 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser, useClerk } from "@clerk/react";
import { Document, Page, pdfjs } from "react-pdf";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min?url";
import api from "../lib/api";

import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

/* ---------------- PAGE RANGE UTILITIES ---------------- */
function parsePageInput(input, maxPages) {
  if (!input) return { pages: [], error: null };

  const pages = new Set();
  let error = null;
  const parts = input.split(",");

  for (let part of parts) {
    part = part.trim();
    if (part.includes("-")) {
      const [start, end] = part.split("-").map(Number);
      if (isNaN(start) || isNaN(end)) {
        error = "Invalid page range format";
        continue;
      }
      if (start > end) {
        error = "Start page cannot exceed end page";
        continue;
      }
      for (let i = start; i <= end; i++) {
        if (i < 1 || i > maxPages) {
          error = `Pages must fall between 1 and ${maxPages}`;
          continue;
        }
        pages.add(i);
      }
    } else {
      const num = Number(part);
      if (isNaN(num)) {
        error = "Invalid page number";
        continue;
      }
      if (num < 1 || num > maxPages) {
        error = `Pages must fall between 1 and ${maxPages}`;
        continue;
      }
      pages.add(num);
    }
  }

  return {
    pages: Array.from(pages).sort((a, b) => a - b),
    error,
  };
}

function pagesToRange(pages) {
  if (!pages.length) return "";
  const sorted = [...pages].sort((a, b) => a - b);
  const ranges = [];
  let start = sorted[0];
  let prev = sorted[0];

  for (let i = 1; i <= sorted.length; i++) {
    if (sorted[i] === prev + 1) {
      prev = sorted[i];
      continue;
    }
    if (start === prev) ranges.push(start);
    else ranges.push(`${start}-${prev}`);
    start = sorted[i];
    prev = sorted[i];
  }
  return ranges.join(",");
}

/* ---------------- THUMBNAIL COMPONENT ---------------- */
const Thumbnail = React.memo(
  function Thumbnail({ pageNumber, selected, onClick }) {
    const handleClick = useCallback(() => {
      onClick(pageNumber);
    }, [onClick, pageNumber]);

    return (
      <div
        onClick={handleClick}
        className={`h-32 cursor-pointer border rounded-xl p-1.5 bg-[#0f0e0c]/60 flex flex-col justify-between transition-all duration-200 select-none
          ${
            selected
              ? "border-[#c9a66b] ring-2 ring-[#c9a66b]/30 scale-[1.02] bg-[#c9a66b]/5"
              : "border-white/5 hover:border-white/20"
          }`}
      >
        <div className="h-[92px] overflow-hidden flex justify-center items-center rounded-lg bg-black/20 p-1">
          <Page
            pageNumber={pageNumber}
            width={65}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        </div>
        <p className={`text-[10px] text-center font-serif font-medium mt-1 transition-colors ${selected ? "text-[#c9a66b]" : "text-[#a3a098]"}`}>
          {pageNumber}
        </p>
      </div>
    );
  },
  (prevProps, nextProps) =>
    prevProps.pageNumber === nextProps.pageNumber &&
    prevProps.selected === nextProps.selected &&
    prevProps.onClick === nextProps.onClick,
);

/* ---------------- HELPER COMPONENTS ---------------- */
function Field({ label, children }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wider text-[#a3a098] mb-2">{label}</div>
      {children}
    </div>
  );
}

function Row({ k, v }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[#a3a098]">{k}</span>
      <span className="text-white font-medium">{v}</span>
    </div>
  );
}

/* ---------------- MAIN COMPONENT ---------------- */
export default function CreateJobPage() {
  // --- FILE STATE ---
  const [file, setFile] = useState(null);
  const [totalPdfPages, setTotalPdfPages] = useState(null);
  const [dragging, setDragging] = useState(false);
  
  // --- PRINT OPTIONS STATE ---
  const [copies, setCopies] = useState(1);
  const [color, setColor] = useState("bw");
  const [size, setSize] = useState("A4");
  const [sides, setSides] = useState("single");
  
  // Page Range States
  const [pagesType, setPagesType] = useState("all");
  const [customPages, setCustomPages] = useState("");
  const [selectedPages, setSelectedPages] = useState([]);
  const [pageError, setPageError] = useState(null);

  // --- PROCESSING STATE ---
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const inputRef = useRef();
  const navigate = useNavigate();
  
  // --- AUTHENTICATION STATE ---
  const { user, isSignedIn } = useUser();
  const { openSignIn } = useClerk();

  // Parse custom page input whenever it changes
  useEffect(() => {
    if (pagesType === "custom" && totalPdfPages) {
      const { pages, error } = parsePageInput(customPages, totalPdfPages);
      setSelectedPages(pages);
      setPageError(error);
    }
  }, [customPages, pagesType, totalPdfPages]);

  // Handle clicking a thumbnail to toggle it
  const togglePage = useCallback((page) => {
    setSelectedPages((prevSelectedPages) => {
      let updated;
      if (prevSelectedPages.includes(page)) {
        updated = prevSelectedPages.filter((p) => p !== page);
      } else {
        updated = [...prevSelectedPages, page];
      }
      updated.sort((a, b) => a - b);
      setCustomPages(pagesToRange(updated));
      return updated;
    });
  }, []);

  const selectedPagesSet = useMemo(() => new Set(selectedPages), [selectedPages]);

  // --- DYNAMIC PRICING ENGINE ---
  const effectivePageCount = useMemo(() => {
    if (!file) return 0;
    return pagesType === "all" ? totalPdfPages : selectedPages.length;
  }, [pagesType, totalPdfPages, selectedPages.length, file]);

  const perPageRate = color === "color" ? 10 : 2; // Rs 10 for Color, Rs 2 for B&W
  const totalPrice = effectivePageCount * copies * perPageRate;

  // --- FILE HANDLING ---
  const handleFile = async (f) => {
    if (!f || f.type !== "application/pdf") {
      setError("Only PDF files are allowed");
      return;
    }

    try {
      setError("");
      const buffer = await f.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
      setFile(f);
      setTotalPdfPages(pdf.numPages);
      
      // Reset page selections on new file
      setPagesType("all");
      setCustomPages("");
      setSelectedPages([]);
      setPageError(null);
    } catch (err) {
      setError("Failed to parse PDF document. File may be corrupted.");
    }
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    if (isSignedIn) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [isSignedIn]);

  const removeFile = () => {
    setFile(null);
    setTotalPdfPages(null);
    setProgress(0);
    setPagesType("all");
    setCustomPages("");
    setSelectedPages([]);
    setPageError(null);
  };

  // --- UNIFIED API PROCESSING PIPELINE ---
  const processOrder = async () => {
    if (!file) {
      setError("Please upload a document to proceed.");
      return;
    }
    if (pageError || effectivePageCount === 0) {
      setError("Please resolve page selection errors before proceeding.");
      return;
    }

    setProcessing(true);
    setProgress(10);
    setError("");

    try {
      // 1. Create Order Database Row
      const { data: orderData } = await api.post("/api/orders", { userId: user?.id || null });
      const orderId = orderData.orderId;
      setProgress(30);

      // 2. Fetch Secure S3/Cloud Upload URL
      const { data: uploadUrlData } = await api.post(`/api/orders/${orderId}/upload-url`);
      const { uploadUrl, storageKey } = uploadUrlData;
      setProgress(50);

      // 3. Transmit File Binary to Cloud
      const uploadRes = await fetch(uploadUrl, { method: "PUT", body: file });
      if (!uploadRes.ok) throw new Error("File transmission to cloud failed");
      setProgress(75);

      // 4. Save File Metadata
      await api.post(`/api/orders/${orderId}/file`, {
        storageKey, fileName: file.name, fileSize: file.size, pageCount: totalPdfPages, mimeType: file.type
      });
      setProgress(85);

      // 5. Save Print Layout Options (Including Custom Pages)
      await api.post(`/api/orders/${orderId}/options`, {
        printType: color,
        sides: sides,
        paperSize: size,
        copies: copies,
        pageRangeMode: pagesType,
        pageRangeList: pagesType === "all" ? [] : selectedPages
      });
      setProgress(100);

      // 6. Navigate to Payment Gateway
      navigate(`/payment/${orderId}`);

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.message || "An error occurred during processing.");
      setProgress(0);
      setProcessing(false);
    }
  };

  return (
    <section className="relative min-h-screen bg-[#0f0e0c] pt-24 pb-12 lg:pt-32 selection:bg-[#c9a66b]/30">
      <div className="absolute inset-x-0 top-1/4 -translate-y-1/2 h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(201,166,107,0.08),transparent_60%)] pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* ================= ORDER TIMELINE ================= */}
   
        {/* Page Header */}
        <div className="mb-12 mt-8 text-center sm:text-left">
          <div className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[#c9a66b] mb-3">
            The Dashboard
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl text-white leading-tight">
            A console that <br className="hidden sm:block" />
            <span className="italic bg-gradient-to-r from-[#c9a66b] to-[#e8d099] bg-clip-text text-transparent">
              respects your time.
            </span>
          </h1>
          <p className="mt-4 text-[#a3a098] max-w-lg mx-auto sm:mx-0">
            Upload your document, configure the layout, specify page ranges, and process payment securely. Your prints will be instantly available.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6 lg:gap-8 items-start">
          
          {/* ================= UPLOAD & OPTIONS AREA ================= */}
          <div className="bg-[#1e1c1a]/80 backdrop-blur-md border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-[#a3a098]">Workspace</div>
                <h3 className="font-serif text-2xl mt-1 text-white">New Print Job</h3>
              </div>
              <span className="text-[11px] uppercase tracking-wider text-[#c9a66b] border border-[#c9a66b]/40 bg-[#c9a66b]/10 rounded-full px-3 py-1">
                Draft Mode
              </span>
            </div>

            {/* Dropzone / Authentication Gate */}
            <div
              onClick={() => isSignedIn && !file && !processing && inputRef.current.click()}
              onDrop={onDrop}
              onDragOver={(e) => { e.preventDefault(); if(isSignedIn) setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              className={`relative rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition-all duration-300
                ${dragging 
                  ? "border-[#c9a66b] bg-[#c9a66b]/10" 
                  : "border-[#c9a66b]/30 bg-[#c9a66b]/5 hover:bg-[#c9a66b]/10"
                }
                ${file ? "border-emerald-500/30 bg-emerald-500/[0.02]" : ""}
                ${processing || !isSignedIn ? "cursor-default" : "cursor-pointer group"}
              `}
            >
              <input ref={inputRef} type="file" accept="application/pdf" hidden onChange={(e) => handleFile(e.target.files[0])} />

              {!isSignedIn ? (
                // --- LOGGED OUT STATE ---
                <div className="flex flex-col items-center py-4">
                  <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4 text-red-400">
                    <Lock size={24} />
                  </div>
                  <p className="font-serif text-xl text-white mb-2">Authentication Required</p>
                  <p className="text-sm text-[#a3a098] max-w-sm mb-8">
                    You must be logged into your account to securely upload documents to the vault.
                  </p>
                  <button 
                    onClick={() => openSignIn()}
                    className="bg-[linear-gradient(135deg,#D9B96A_0%,#C8A24D_50%,#A8842F_100%)] text-[#1C1C18] px-8 py-3 rounded-xl font-bold tracking-wide text-sm shadow-[0_10px_30px_-10px_rgba(201,166,107,0.4)] hover:shadow-[0_15px_40px_-10px_rgba(201,166,107,0.6)] hover:scale-[1.02] transition-all cursor-pointer"
                  >
                    LOGIN TO UPLOAD
                  </button>
                </div>
              ) : !file ? (
                // --- LOGGED IN, NO FILE STATE ---
                <div className="flex flex-col items-center">
                  <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} className="mx-auto w-14 h-14 rounded-2xl bg-[#c9a66b] grid place-items-center text-[#1C1C18] shadow-lg group-hover:scale-105 transition-transform">
                    <UploadCloud className="w-6 h-6" />
                  </motion.div>
                  <p className="mt-6 font-serif text-xl text-white">Drag & drop your PDF</p>
                  <p className="mt-2 text-sm text-[#a3a098]">or click to browse your machine files</p>
                </div>
              ) : (
                // --- LOGGED IN, FILE UPLOADED STATE ---
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl bg-[#0f0e0c]/80 border border-white/10 text-left relative">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 shrink-0 grid place-items-center">
                    <FileText className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate pr-6">{file.name}</div>
                    <div className="text-xs text-[#a3a098] mt-1">
                      {totalPdfPages} total pages · {(file.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                  {!processing && (
                    <button onClick={(e) => { e.stopPropagation(); removeFile(); }} className="absolute top-4 right-4 sm:static text-[#a3a098] hover:text-white p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer z-10">
                      <X size={18} />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Error Overlay */}
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <div className="mt-4 flex items-center gap-2.5 bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-xs text-red-400">
                    <AlertCircle size={14} className="shrink-0" />
                    <p>{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Print Options */}
            <div className={`mt-8 pt-8 border-t border-white/10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5 transition-opacity ${(!isSignedIn || processing) ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
              
              <Field label="Copies">
                <div className="flex items-center justify-between bg-[#0f0e0c]/80 border border-white/10 rounded-xl px-3 py-2.5 h-[46px]">
                  <button onClick={() => setCopies(Math.max(1, copies - 1))} className="text-[#a3a098] hover:text-white transition-colors p-1 cursor-pointer">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-serif text-lg text-white font-medium">{copies}</span>
                  <button onClick={() => setCopies(copies + 1)} className="text-[#a3a098] hover:text-white transition-colors p-1 cursor-pointer">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </Field>
              
              <Field label="Color">
                <div className="grid grid-cols-2 bg-[#0f0e0c]/80 border border-white/10 rounded-xl p-1 h-[46px]">
                  {["bw", "color"].map((v) => (
                    <button key={v} onClick={() => setColor(v)} className={`py-1 text-xs rounded-lg transition-all font-semibold uppercase tracking-wider ${color === v ? "bg-[#c9a66b] text-[#1C1C18] shadow-md" : "text-[#a3a098] hover:text-white cursor-pointer"}`}>
                      {v === "bw" ? "B&W" : "Color"}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Sides">
                <div className="grid grid-cols-2 bg-[#0f0e0c]/80 border border-white/10 rounded-xl p-1 h-[46px]">
                  {["single", "double"].map((v) => (
                    <button key={v} onClick={() => setSides(v)} className={`py-1 text-xs rounded-lg transition-all font-semibold uppercase tracking-wider ${sides === v ? "bg-[#c9a66b] text-[#1C1C18] shadow-md" : "text-[#a3a098] hover:text-white cursor-pointer"}`}>
                      {v}
                    </button>
                  ))}
                </div>
              </Field>
              
              <Field label="Paper">
                <select value={size} onChange={(e) => setSize(e.target.value)} className="w-full bg-[#0f0e0c]/80 text-white border border-white/10 rounded-xl px-3 text-sm font-medium focus:outline-none focus:border-[#c9a66b]/50 h-[46px] appearance-none cursor-pointer">
                  <option>A4</option>
                  <option>A3</option>
                  <option>Letter</option>
                  <option>Legal</option>
                </select>
              </Field>
            </div>

            {/* Custom Page Selection Grid */}
            <div className={`mt-6 pt-6 border-t border-white/10 transition-opacity ${(!isSignedIn || processing) ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="text-[11px] uppercase tracking-wider text-[#a3a098]">Page Boundaries</div>
                
                <div className="grid grid-cols-2 bg-[#0f0e0c]/80 border border-white/10 rounded-xl p-1 h-9 w-full sm:w-48 shrink-0">
                  {["all", "custom"].map((v) => (
                    <button key={v} onClick={() => setPagesType(v)} className={`py-1 text-[11px] rounded-lg transition-all font-semibold uppercase tracking-wider ${pagesType === v ? "bg-[#c9a66b] text-[#1C1C18] shadow-md" : "text-[#a3a098] hover:text-white cursor-pointer"}`}>
                      {v} Pages
                    </button>
                  ))}
                </div>
              </div>

              {pagesType === "custom" && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <input
                    type="text"
                    placeholder="e.g. 1-5, 8, 11-14"
                    value={customPages}
                    onChange={(e) => setCustomPages(e.target.value)}
                    className="w-full sm:w-2/3 bg-[#0f0e0c]/80 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-[#a3a098]/30 focus:outline-none focus:border-[#c9a66b]/50 shadow-inner transition-colors"
                  />

                  {/* VIRTUALIZED CHRONOLOGICAL SHEET MATRIX */}
                  {file && (
                    <div className="bg-[#0f0e0c]/40 border border-white/5 rounded-2xl p-4 max-h-[280px] overflow-y-auto custom-scrollbar shadow-inner">
                      <Document file={file} loading={<span className="text-xs text-[#a3a098]">Rendering preview...</span>}>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                          {Array.from({ length: totalPdfPages }, (_, i) => i + 1).map((pageNumber) => (
                            <Thumbnail key={pageNumber} pageNumber={pageNumber} selected={selectedPagesSet.has(pageNumber)} onClick={togglePage} />
                          ))}
                        </div>
                      </Document>
                    </div>
                  )}
                  
                  {pageError && (
                    <div className="flex items-center gap-2 text-xs text-red-400 mt-1">
                      <AlertCircle size={12} />
                      <p>{pageError}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>

          {/* ================= SUMMARY PANEL (Right Column) ================= */}
          <div className="space-y-6 lg:sticky lg:top-24">
            <div className="bg-[#1e1c1a]/80 backdrop-blur-md border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
              <div className="text-[11px] uppercase tracking-[0.18em] text-[#a3a098] flex items-center gap-2 mb-6">
                <Layers size={14} className="text-[#c9a66b]" />
                Job Summary
              </div>
              
              <div className="space-y-3.5 text-sm">
                <Row k="Computed Sheets" v={file ? `${effectivePageCount} pages` : "—"} />
                <Row k="Copies Requested" v={`× ${copies}`} />
                <Row k="Color Mode" v={color === "bw" ? "Monochrome" : "Full Color"} />
                <Row k="Rate per page" v={`₹${perPageRate}`} />
              </div>
              
              <div className="mt-6 flex items-end justify-between pt-6 border-t border-white/10">
                <span className="text-[#a3a098] text-sm">Estimated Total</span>
                <span className="font-serif text-4xl bg-gradient-to-r from-[#c9a66b] to-[#e8d099] bg-clip-text text-transparent font-bold">
                  ₹{totalPrice}
                </span>
              </div>
            </div>

            {/* Action Button & Processing Indicator */}
            <div className="relative">
              <button 
                onClick={processOrder}
                disabled={!isSignedIn || processing || !file || pageError || effectivePageCount === 0}
                className={`relative z-10 w-full rounded-2xl font-bold tracking-wide py-4 sm:py-5 flex items-center justify-center gap-2 transition-all duration-300 overflow-hidden
                  ${(!isSignedIn || processing || !file || pageError || effectivePageCount === 0) 
                    ? "bg-[#0f0e0c] text-gray-500 border border-white/10 cursor-not-allowed" 
                    : "bg-[#c9a66b] text-[#1C1C18] shadow-[0_10px_30px_-10px_rgba(201,166,107,0.4)] hover:shadow-[0_15px_40px_-10px_rgba(201,166,107,0.6)] hover:scale-[1.02] cursor-pointer"
                  }`}
              >
                {/* Dynamic Progress Fill Background */}
                {processing && (
                  <div className="absolute inset-y-0 left-0 bg-white/10 transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
                )}

                <div className="relative z-10 flex items-center gap-2">
                  {processing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      SYNCING WITH VAULT ({progress}%)
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      PROCEED TO SECURE CHECKOUT
                    </>
                  )}
                </div>
              </button>
            </div>
            
          </div>
        </div>

      </div>
    </section>
  );
}