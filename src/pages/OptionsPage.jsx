import { useState, useEffect, useRef } from "react";
import { PAGES_RATE_BW, PAGES_RATE_COLOR } from "../lib/constants";

export default function OptionsPage({ fileData, onProceed }) {
  const [printType, setPrintType] = useState("bw");
  const [copies, setCopies] = useState(1);
  const [sides, setSides] = useState("single");
  const [size, setSize] = useState("a4");

  // Page range
  const [rangeMode, setRangeMode] = useState("all"); // "all" | "custom"
  const [rangeInput, setRangeInput] = useState("");
  const [rangeError, setRangeError] = useState("");

  // Parse "1-5, 8, 11-13" style input into a sorted unique set of page numbers
  const parseRangeInput = (str) => {
    const total = fileData.pageCount;
    const pages = new Set();
    const parts = str.split(",").map(s => s.trim()).filter(Boolean);
    for (const part of parts) {
      if (/^\d+$/.test(part)) {
        const n = parseInt(part);
        if (n >= 1 && n <= total) pages.add(n);
        else return null; // out of range
      } else if (/^\d+\s*-\s*\d+$/.test(part)) {
        const [a, b] = part.split("-").map(s => parseInt(s.trim()));
        if (a > b || a < 1 || b > total) return null;
        for (let i = a; i <= b; i++) pages.add(i);
      } else {
        return null; // invalid token
      }
    }
    return pages.size > 0 ? [...pages].sort((a, b) => a - b) : null;
  };

  const parsedPages = rangeMode === "custom" ? parseRangeInput(rangeInput) : null;

  const handleRangeInput = (val) => {
    setRangeInput(val);
    if (!val.trim()) { setRangeError(""); return; }
    const result = parseRangeInput(val);
    
    if (result === null) {
  setRangeError(
    `Invalid range — use format: 1-5, 8, 11-13 (max page: ${fileData.pageCount})`
  );
} else {
  setRangeError("");
}
  };

  const selectedPages = rangeMode === "all"
    ? fileData.pageCount
    : (parsedPages ? parsedPages.length : 0);

  const rate = printType === "bw" ? PAGES_RATE_BW : PAGES_RATE_COLOR;
  const sidesMultiplier = sides === "double" ? 0.9 : 1;
  const total = (selectedPages * copies * rate * sidesMultiplier).toFixed(2);

  // PDF.js rendering
  const canvasRef = useRef(null);
  const [pdfLoading, setPdfLoading] = useState(true);
  const [pdfError, setPdfError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function renderPDF() {
      setPdfLoading(true);
      setPdfError(false);
      try {
        if (!window.pdfjsLib) {
          await new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
          window.pdfjsLib.GlobalWorkerOptions.workerSrc =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        }

        const arrayBuffer = await fileData.file.arrayBuffer();
        const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        if (cancelled) return;

        const page = await pdf.getPage(1);
        if (cancelled) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const wrap = canvas.parentElement;
        const wrapWidth = wrap?.clientWidth || 400;

        // Use devicePixelRatio for crisp rendering on retina screens
        const dpr = window.devicePixelRatio || 1;
        const viewport = page.getViewport({ scale: 1 });
        const scale = (wrapWidth / viewport.width) * dpr;
        const scaled = page.getViewport({ scale });

        // Set actual canvas pixel dimensions (high-res)
        canvas.width = scaled.width;
        canvas.height = scaled.height;

        // CSS size stays at container width — browser scales down cleanly
        canvas.style.width = wrapWidth + "px";
        canvas.style.height = (scaled.height / dpr) + "px";

        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        await page.render({ canvasContext: ctx, viewport: scaled }).promise;
        if (!cancelled) setPdfLoading(false);
      } catch (e) {
        console.error("PDF render error:", e);
        if (!cancelled) { setPdfLoading(false); setPdfError(true); }
      }
    }

    // Small delay to let layout settle so clientWidth is accurate
    const t = setTimeout(renderPDF, 60);
    return () => { cancelled = true; clearTimeout(t); };
  }, [fileData.file]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Outfit:wght@300;400;500;600&display=swap');

        .opts-root {
          min-height: 100vh;
          background: #f0ede8;
          padding: 2.5rem 1.5rem;
          font-family: 'Outfit', sans-serif;
          position: relative;
          overflow: hidden;
        }

        .opts-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 700px 500px at 80% 10%, rgba(37,99,235,0.06) 0%, transparent 70%),
            radial-gradient(ellipse 500px 400px at 5% 90%, rgba(16,185,129,0.04) 0%, transparent 60%);
          pointer-events: none;
        }

        .deco-ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(37,99,235,0.08);
          pointer-events: none;
        }

        .deco-dot-grid {
          position: absolute;
          width: 100px; height: 100px;
          background-image: radial-gradient(circle, rgba(37,99,235,0.13) 1.5px, transparent 1.5px);
          background-size: 16px 16px;
          pointer-events: none;
          bottom: 60px; right: 50px;
        }

        .opts-inner {
          position: relative;
          z-index: 1;
          max-width: 960px;
          margin: 0 auto;
          animation: fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .page-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(37,99,235,0.08);
          color: #2563eb;
          border-radius: 100px;
          padding: 5px 14px;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 1rem;
        }

        .step-trail {
          display: flex;
          align-items: center;
          gap: 0;
          margin-bottom: 2rem;
        }

        .step-t {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .step-t-num {
          width: 22px; height: 22px;
          border-radius: 50%;
          font-size: 0.66rem;
          font-weight: 700;
          display: flex; align-items: center; justify-content: center;
        }

        .step-t-num.done { background: #10b981; color: white; }
        .step-t-num.active { background: #2563eb; color: white; box-shadow: 0 0 0 3px rgba(37,99,235,0.15); }
        .step-t-num.upcoming { background: #e2e8f0; color: #94a3b8; }

        .step-t-label { font-size: 0.72rem; font-weight: 600; }
        .step-t-label.done { color: #10b981; }
        .step-t-label.active { color: #2563eb; }
        .step-t-label.upcoming { color: #94a3b8; }

        .step-connector {
          flex: 1;
          height: 1px;
          background: #e2e8f0;
          margin: 0 10px;
          min-width: 20px;
        }

        /* Layout */
        .layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          align-items: start;
        }

        @media (max-width: 768px) {
          .layout { grid-template-columns: 1fr; }
        }

        /* Cards */
        .card {
          background: #ffffff;
          border-radius: 24px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.03), 0 16px 40px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04);
          overflow: hidden;
        }

        /* Preview card */
        .preview-header {
          padding: 1.1rem 1.4rem;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .preview-filename {
          font-weight: 600;
          color: #0f172a;
          font-size: 0.88rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 220px;
        }

        .preview-meta { font-size: 0.75rem; color: #94a3b8; margin-top: 2px; }

        .pdf-chip {
          background: #eff6ff;
          color: #2563eb;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          padding: 3px 10px;
          border-radius: 100px;
          flex-shrink: 0;
        }

        .preview-body {
          background: #e8edf2;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          padding: 1.5rem;
          gap: 1rem;
          min-height: 480px;
          position: relative;
          overflow-y: auto;
        }

        /* Subtle grid background for the preview area */
        .preview-body::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(148,163,184,0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148,163,184,0.12) 1px, transparent 1px);
          background-size: 24px 24px;
          pointer-events: none;
        }

        .preview-note {
          font-size: 0.73rem;
          color: #64748b;
          font-weight: 500;
          position: relative;
          z-index: 1;
          background: white;
          padding: 3px 10px;
          border-radius: 100px;
          border: 1px solid #e2e8f0;
          flex-shrink: 0;
        }

        .preview-type-badge {
          position: absolute;
          top: 12px; right: 12px;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          padding: 3px 9px;
          border-radius: 100px;
          z-index: 2;
          transition: all 0.3s;
        }

        .preview-type-badge.bw {
          background: #1e293b;
          color: white;
        }

        .preview-type-badge.color {
          background: linear-gradient(135deg, #f59e0b, #ef4444, #8b5cf6);
          color: white;
        }

        /* PDF Canvas wrapper — like a sheet of paper on a desk */
        .pdf-canvas-wrap {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 100%;
          box-shadow:
            0 2px 4px rgba(0,0,0,0.06),
            0 8px 20px rgba(0,0,0,0.12),
            0 20px 48px rgba(0,0,0,0.1);
          border-radius: 2px;
          overflow: hidden;
          background: white;
          /* Slight tilt for depth — removed for cleaner look */
        }

        .pdf-canvas-wrap canvas {
          display: block;
          width: 100% !important;
          height: auto !important;
        }

        .pdf-skeleton {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 1.414; /* A4 ratio */
          background: #f1f5f9;
          overflow: hidden;
          border-radius: 2px;
        }

        .pdf-shimmer {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.7) 50%, transparent 100%);
          background-size: 200% 100%;
          animation: shimmer 1.4s ease-in-out infinite;
        }

        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        /* Options card */
        .opts-card { padding: 1.6rem; }

        .section-label {
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #94a3b8;
          margin-bottom: 0.75rem;
        }

        .opts-section { margin-bottom: 1.5rem; }
        .opts-section:last-of-type { margin-bottom: 0; }

        /* Toggle group */
        .toggle-group {
          display: flex;
          background: #f1f5f9;
          border-radius: 14px;
          padding: 4px;
          gap: 4px;
        }

        .toggle-btn {
          flex: 1;
          padding: 0.6rem 0.5rem;
          border-radius: 10px;
          border: none;
          font-family: 'Outfit', sans-serif;
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.18s cubic-bezier(0.22,1,0.36,1);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .toggle-btn.active {
          background: white;
          color: #1e293b;
          box-shadow: 0 1px 4px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.04);
        }

        .toggle-btn.inactive {
          background: transparent;
          color: #94a3b8;
        }

        .toggle-btn.inactive:hover { color: #64748b; background: rgba(255,255,255,0.5); }

        .toggle-icon { font-size: 1.1rem; }
        .toggle-sub { font-size: 0.65rem; font-weight: 500; opacity: 0.65; }

        /* Copies stepper */
        .stepper {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .stepper-btn {
          width: 38px; height: 38px;
          border-radius: 12px;
          border: 1.5px solid #e2e8f0;
          background: white;
          color: #475569;
          font-size: 1.1rem;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.15s;
          font-family: inherit;
          font-weight: 600;
          flex-shrink: 0;
        }

        .stepper-btn:hover { border-color: #93c5fd; color: #2563eb; background: #eff6ff; }
        .stepper-btn:active { transform: scale(0.94); }
        .stepper-btn:disabled { opacity: 0.35; cursor: not-allowed; }

        .stepper-val {
          font-family: 'Playfair Display', serif;
          font-size: 1.8rem;
          color: #0f172a;
          min-width: 2rem;
          text-align: center;
          line-height: 1;
        }

        .stepper-hint { font-size: 0.75rem; color: #94a3b8; margin-left: auto; }

        /* Price card */
        .price-card {
          background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 60%, #3b82f6 100%);
          border-radius: 18px;
          padding: 1.25rem 1.4rem;
          margin-top: 1.5rem;
          position: relative;
          overflow: hidden;
        }

        .price-card::before {
          content: '';
          position: absolute;
          top: -30px; right: -30px;
          width: 120px; height: 120px;
          border-radius: 50%;
          background: rgba(255,255,255,0.06);
        }

        .price-card::after {
          content: '';
          position: absolute;
          bottom: -20px; left: 20px;
          width: 80px; height: 80px;
          border-radius: 50%;
          background: rgba(255,255,255,0.04);
        }

        .price-rows { margin-bottom: 0.75rem; }

        .price-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.78rem;
          color: rgba(255,255,255,0.7);
          margin-bottom: 4px;
        }

        .price-divider { height: 1px; background: rgba(255,255,255,0.15); margin: 0.75rem 0; }

        .price-total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          z-index: 1;
        }

        .price-total-label { font-size: 0.85rem; color: rgba(255,255,255,0.8); font-weight: 500; }

        .price-total-val {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          color: white;
          line-height: 1;
        }

        .savings-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: rgba(255,255,255,0.15);
          border-radius: 100px;
          padding: 2px 8px;
          font-size: 0.68rem;
          font-weight: 600;
          color: rgba(255,255,255,0.9);
          margin-top: 4px;
        }

        /* CTA */
        .cta-btn {
          margin-top: 1.25rem;
          width: 100%;
          padding: 1rem;
          border-radius: 16px;
          border: none;
          font-family: 'Outfit', sans-serif;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 60%, #3b82f6 100%);
          color: white;
          box-shadow: 0 4px 16px rgba(37,99,235,0.3);
          transition: all 0.2s cubic-bezier(0.22,1,0.36,1);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          position: relative;
          overflow: hidden;
        }

        .cta-btn::after {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
          transform: skewX(-20deg);
          transition: left 0.5s;
        }

        .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(37,99,235,0.35); }
        .cta-btn:hover::after { left: 150%; }
        .cta-btn:active { transform: translateY(0); }

        .cta-arrow { transition: transform 0.2s; }
        .cta-btn:hover .cta-arrow { transform: translateX(4px); }

        .trust-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-top: 0.75rem;
          font-size: 0.72rem;
          color: #94a3b8;
        }

        .trust-dot { width: 3px; height: 3px; border-radius: 50%; background: #cbd5e1; }

        /* Page Range */
        .range-mode-row {
          display: flex;
          gap: 8px;
          margin-bottom: 0.9rem;
        }

        .range-mode-btn {
          flex: 1;
          padding: 0.55rem 0.5rem;
          border-radius: 10px;
          border: 1.5px solid #e2e8f0;
          background: white;
          font-family: "Outfit", sans-serif;
          font-size: 0.8rem;
          font-weight: 600;
          color: #94a3b8;
          cursor: pointer;
          transition: all 0.18s cubic-bezier(0.22,1,0.36,1);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .range-mode-btn.active {
          border-color: #2563eb;
          background: #eff6ff;
          color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.08);
        }

        .range-mode-btn:not(.active):hover {
          border-color: #93c5fd;
          color: #64748b;
        }

        /* Single text input */
        .range-text-wrap {
          position: relative;
          animation: fadeUp 0.22s cubic-bezier(0.22,1,0.36,1) both;
        }

        .range-text-input {
          width: 100%;
          padding: 0.7rem 1rem;
          border-radius: 10px;
          border: 1.5px solid #2563eb;
          background: white;
          font-family: "Outfit", sans-serif;
          font-size: 0.88rem;
          font-weight: 500;
          color: #0f172a;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
          box-sizing: border-box;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
        }

        .range-text-input::placeholder {
          color: #94a3b8;
          font-weight: 400;
          font-style: italic;
        }

        .range-text-input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
        }

        .range-text-input.error {
          border-color: #ef4444;
          box-shadow: 0 0 0 3px rgba(239,68,68,0.1);
        }

        .range-error {
          font-size: 0.72rem;
          color: #ef4444;
          font-weight: 500;
          margin-top: 6px;
          display: flex;
          align-items: flex-start;
          gap: 4px;
          line-height: 1.4;
        }

        .range-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
          margin-top: 8px;
        }

        .range-tag {
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          color: #2563eb;
          font-size: 0.7rem;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 100px;
        }

        .range-summary {
          margin-top: 8px;
          font-size: 0.75rem;
          color: #64748b;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .range-summary-count {
          font-weight: 700;
          color: #2563eb;
        }
      `}</style>

      <div className="opts-root">
        <div className="deco-ring" style={{ width: 360, height: 360, top: -100, left: -100 }} />
        <div className="deco-ring" style={{ width: 200, height: 200, bottom: 40, right: 80 }} />
        <div className="deco-dot-grid" />

        <div className="opts-inner">
          {/* Badge + Step trail */}
          <div className="page-badge">Step 2 of 4 — Configure</div>

          <div className="step-trail">
            {[
              { label: "Upload", state: "done" },
              { label: "Options", state: "active" },
              { label: "Pay", state: "upcoming" },
              { label: "Collect", state: "upcoming" },
            ].map(({ label, state }, i, arr) => (
              <div key={label} style={{ display: "flex", alignItems: "center", flex: i < arr.length - 1 ? 1 : undefined }}>
                <div className="step-t">
                  <div className={`step-t-num ${state}`}>
                    {state === "done" ? (
                      <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    ) : i + 1}
                  </div>
                  <span className={`step-t-label ${state}`}>{label}</span>
                </div>
                {i < arr.length - 1 && <div className="step-connector" />}
              </div>
            ))}
          </div>

          {/* Main grid */}
          <div className="layout">
            {/* Preview card */}
            <div className="card">
              <div className="preview-header">
                <div>
                  <p className="preview-filename">{fileData.file.name}</p>
                  <p className="preview-meta">{fileData.pageCount} pages detected</p>
                </div>
                <span className="pdf-chip">PDF</span>
              </div>
              <div className="preview-body">
                {/* Print type badge */}
                <div className={`preview-type-badge ${printType}`}>
                  {printType === "bw" ? "B&W" : "COLOR"}
                </div>

                {/* Real PDF canvas */}
                <div className="pdf-canvas-wrap" style={{
                  filter: printType === "bw" ? "grayscale(100%)" : "grayscale(0%)",
                  transition: "filter 0.4s ease",
                }}>
                  {pdfLoading && (
                    <div className="pdf-skeleton">
                      <div className="pdf-shimmer" />
                      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth={1.5} style={{ animation: "spin 1s linear infinite" }}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                        <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 500 }}>Rendering PDF…</span>
                      </div>
                    </div>
                  )}
                  {pdfError && (
                    <div className="pdf-skeleton" style={{ background: "#fff1f2" }}>
                      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
                        <span style={{ fontSize: "1.5rem" }}>⚠️</span>
                        <span style={{ fontSize: "0.75rem", color: "#f43f5e", fontWeight: 500 }}>Preview unavailable</span>
                      </div>
                    </div>
                  )}
                  <canvas
                    ref={canvasRef}
                    style={{ display: pdfLoading || pdfError ? "none" : "block" }}
                  />
                </div>

                <p className="preview-note">Page 1 of {fileData.pageCount}</p>
              </div>
            </div>

            {/* Options card */}
            <div className="card opts-card">

              {/* Print type */}
              <div className="opts-section">
                <p className="section-label">Print Type</p>
                <div className="toggle-group">
                  {[
                    { id: "bw", icon: "◑", label: "Black & White", sub: `$${PAGES_RATE_BW}/pg` },
                    { id: "color", icon: "🎨", label: "Color", sub: `$${PAGES_RATE_COLOR}/pg` },
                  ].map(({ id, icon, label, sub }) => (
                    <button
                      key={id}
                      className={`toggle-btn ${printType === id ? "active" : "inactive"}`}
                      onClick={() => setPrintType(id)}
                    >
                      <span className="toggle-icon">{icon}</span>
                      {label}
                      <span className="toggle-sub">{sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sides */}
              <div className="opts-section">
                <p className="section-label">Sides</p>
                <div className="toggle-group">
                  {[
                    { id: "single", icon: "▭", label: "Single-sided", sub: "Standard" },
                    { id: "double", icon: "▬", label: "Double-sided", sub: "Save 10%" },
                  ].map(({ id, icon, label, sub }) => (
                    <button
                      key={id}
                      className={`toggle-btn ${sides === id ? "active" : "inactive"}`}
                      onClick={() => setSides(id)}
                    >
                      <span className="toggle-icon">{icon}</span>
                      {label}
                      <span className="toggle-sub" style={{ color: id === "double" && sides === id ? "#10b981" : undefined }}>{sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Paper size */}
              <div className="opts-section">
                <p className="section-label">Paper Size</p>
                <div className="toggle-group">
                  {[
                    { id: "a4", label: "A4", sub: "210×297mm" },
                    { id: "letter", label: "Letter", sub: "8.5×11in" },
                    { id: "a3", label: "A3", sub: "297×420mm" },
                  ].map(({ id, label, sub }) => (
                    <button
                      key={id}
                      className={`toggle-btn ${size === id ? "active" : "inactive"}`}
                      onClick={() => setSize(id)}
                    >
                      {label}
                      <span className="toggle-sub">{sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Page Range */}
              <div className="opts-section">
                <p className="section-label">Pages to Print</p>

                <div className="range-mode-row">
                  <button
                    className={`range-mode-btn ${rangeMode === "all" ? "active" : ""}`}
                    onClick={() => { setRangeMode("all"); setRangeError(""); setRangeInput(""); }}
                  >
                    <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                    </svg>
                    All Pages
                  </button>
                  <button
                    className={`range-mode-btn ${rangeMode === "custom" ? "active" : ""}`}
                    onClick={() => setRangeMode("custom")}
                  >
                    <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                    </svg>
                    Custom Range
                  </button>
                </div>

                {rangeMode === "all" && (
                  <p className="range-summary">
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="#10b981" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    All{" "}<span className="range-summary-count">{fileData.pageCount}</span>{" "}pages selected
                  </p>
                )}

                {rangeMode === "custom" && (
                  <div className="range-text-wrap">
                    <input
                      type="text"
                      className={`range-text-input${rangeError ? " error" : ""}`}
                      placeholder="e.g. 1-5, 8, 11-13"
                      value={rangeInput}
                      onChange={(e) => handleRangeInput(e.target.value)}
                      autoFocus
                    />

                    {!rangeInput.trim() && (
                      <p style={{ fontSize: "0.71rem", color: "#94a3b8", marginTop: 6, lineHeight: 1.5 }}>
                        Separate pages or ranges with commas. Max page:{" "}
                        <strong style={{ color: "#64748b" }}>{fileData.pageCount}</strong>
                      </p>
                    )}

                    {rangeInput.trim() && rangeError && (
                      <p className="range-error">
                        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} style={{ flexShrink: 0, marginTop: 1 }}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                        </svg>
                        {rangeError}
                      </p>
                    )}

                    {rangeInput.trim() && !rangeError && parsedPages && parsedPages.length > 0 && (
                      <div>
                        <div className="range-tags">
                          {(() => {
                            const segs = [];
                            let segStart = parsedPages[0];
                            let segPrev = parsedPages[0];
                            for (let i = 1; i <= parsedPages.length; i++) {
                              if (i === parsedPages.length || parsedPages[i] !== segPrev + 1) {
                                segs.push(segStart === segPrev ? String(segStart) : segStart + "–" + segPrev);
                                segStart = parsedPages[i];
                                segPrev = parsedPages[i];
                              } else {
                                segPrev = parsedPages[i];
                              }
                            }
                            return segs.map((seg) => (
                              <span key={seg} className="range-tag">{seg}</span>
                            ));
                          })()}
                        </div>
                        <p className="range-summary" style={{ marginTop: 6 }}>
                          <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="#10b981" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                          <span className="range-summary-count">{selectedPages}</span>
                          {selectedPages === 1 ? " page" : " pages"} selected (of {fileData.pageCount})
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Copies */}
              <div className="opts-section">
                <p className="section-label">Copies</p>
                <div className="stepper">
                  <button className="stepper-btn" disabled={copies <= 1} onClick={() => setCopies(c => Math.max(1, c - 1))}>−</button>
                  <span className="stepper-val">{copies}</span>
                  <button className="stepper-btn" onClick={() => setCopies(c => c + 1)}>+</button>
                  <span className="stepper-hint">{copies * selectedPages} sheets total</span>
                </div>
              </div>

              {/* Price */}
              <div className="price-card">
                <div className="price-rows">
                  <div className="price-row">
                    <span>{selectedPages} pages × {copies} {copies === 1 ? "copy" : "copies"}</span>
                    <span>₹{(selectedPages * copies * rate).toFixed(2)}</span>
                  </div>
                  {sides === "double" && (
                    <div className="price-row">
                      <span>Double-sided discount</span>
                      <span style={{ color: "#6ee7b7" }}>−10%</span>
                    </div>
                  )}
                </div>
                <div className="price-divider" />
                <div className="price-total-row">
                  <div>
                    <div className="price-total-label">Total due</div>
                    {sides === "double" && <div className="savings-badge">💚 You saved ₹{(selectedPages * copies * rate * 0.1).toFixed(2)}</div>}
                  </div>
                  <span className="price-total-val">₹{total}</span>
                </div>
              </div>

              {/* CTA */}
              <button
                className="cta-btn"
                disabled={!!rangeError || (rangeMode === "custom" && selectedPages === 0)}
                onClick={() => onProceed({
                    printType, copies, sides, size, total, fileData,
                    pageRange: rangeMode === "all"
                      ? { mode: "all", pages: fileData.pageCount, list: null }
                      : { mode: "custom", pages: selectedPages, list: parsedPages }
                  })}
              >
                Proceed to Payment
                <svg className="cta-arrow" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>

              <div className="trust-row">
                <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                Secure checkout
                <div className="trust-dot" />
                Cancel anytime
                <div className="trust-dot" />
                Instant confirmation
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
