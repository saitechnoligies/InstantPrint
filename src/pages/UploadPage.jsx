import { useState, useRef, useCallback } from "react";
// import * as pdfjsLib from "pdfjs-dist";
// import pdfWorker from "pdfjs-dist/build/pdf.worker.min?url";

// pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

// pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

import * as pdfjsLib from "pdfjs-dist";
import workerSrc from "pdfjs-dist/build/pdf.worker.min?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;
export default function UploadPage({ onContinue }) {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [pageCount, setPageCount] = useState(null);
  const inputRef = useRef();

  //   const handleFile = async (f) => {
  //   if (!f || f.type !== "application/pdf") return;

  //   try {
  //     const arrayBuffer = await f.arrayBuffer();
  //     const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  //     const numPages = pdf.numPages;

  //     setFile(f);
  //     setPageCount(numPages);
  //   } catch (err) {
  //     console.error("Error reading PDF:", err);
  //   }
  // };

  const handleFile = async (f) => {
    if (!f) return;

    // ✅ FIX: mobile-safe validation
    const isPDF =
      f.type === "application/pdf" || f.name?.toLowerCase().endsWith(".pdf");

    if (!isPDF) {
      alert("Please upload a valid PDF file");
      return;
    }

    // ✅ FIX: prevent mobile crashes
    if (f.size > 20 * 1024 * 1024) {
      alert("File must be under 20MB");
      return;
    }

    try {
      const arrayBuffer = await f.arrayBuffer();

      const pdf = await pdfjsLib.getDocument({
        data: arrayBuffer,
      }).promise;

      setFile(f);
      setPageCount(pdf.numPages);
    } catch (err) {
      console.error("Error reading PDF:", err);
      alert("Failed to read PDF. Try another file.");
    }
  };
  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }, []);

  const onDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };
  const onDragLeave = () => setDragging(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Outfit:wght@300;400;500;600&display=swap');

        .upload-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 74px 1.25rem 1.25rem;
          background: #f0ede8;
          position: relative;
          overflow: hidden;
          font-family: 'Outfit', sans-serif;
        }

        .upload-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 600px 400px at 70% 20%, rgba(37,99,235,0.07) 0%, transparent 70%),
            radial-gradient(ellipse 400px 350px at 10% 80%, rgba(16,185,129,0.05) 0%, transparent 60%);
          pointer-events: none;
        }

        .deco-circle-1 {
          position: absolute;
          width: 340px; height: 340px;
          border-radius: 50%;
          border: 1px solid rgba(37,99,235,0.09);
          top: -80px; right: -100px;
          pointer-events: none;
        }
        .deco-circle-2 {
          position: absolute;
          width: 180px; height: 180px;
          border-radius: 50%;
          border: 1px solid rgba(37,99,235,0.06);
          bottom: 40px; left: -50px;
          pointer-events: none;
        }
        .deco-dot-grid {
          position: absolute;
          top: 80px; left: 36px;
          width: 90px; height: 90px;
          background-image: radial-gradient(circle, rgba(37,99,235,0.14) 1.5px, transparent 1.5px);
          background-size: 16px 16px;
          pointer-events: none;
        }

        .card {
          position: relative;
          z-index: 1;
          background: #ffffff;
          border-radius: 24px;
          padding: 1.75rem 2rem 1.6rem;
          width: 100%;
          max-width: 440px;
          box-shadow:
            0 4px 6px rgba(0,0,0,0.03),
            0 16px 40px rgba(0,0,0,0.07),
            0 0 0 1px rgba(0,0,0,0.04);
          animation: cardIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes cardIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: #eff6ff;
          color: #2563eb;
          border-radius: 100px;
          padding: 4px 11px;
          font-size: 0.67rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 0.8rem;
        }

        .badge-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #2563eb;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.75); }
        }

        .headline {
          font-family: 'Playfair Display', serif;
          font-size: 1.65rem;
          line-height: 1.2;
          color: #0f172a;
          margin: 0 0 0.35rem;
          letter-spacing: -0.01em;
        }

        .subtext {
          color: #64748b;
          font-size: 0.85rem;
          line-height: 1.5;
          font-weight: 400;
          margin-bottom: 1.1rem;
        }

        .divider {
          height: 1px;
          background: linear-gradient(to right, transparent, #e2e8f0, transparent);
          margin-bottom: 1.1rem;
        }

        .drop-zone {
          border-radius: 14px;
          border: 2px dashed #cbd5e1;
          background: #f8fafc;
          padding: 1.5rem 1.25rem;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s, transform 0.2s;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .drop-zone::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 50% 0%, rgba(37,99,235,0.06), transparent 70%);
          opacity: 0;
          transition: opacity 0.3s;
          pointer-events: none;
        }

        .drop-zone:hover              { border-color: #93c5fd; background: #f0f7ff; box-shadow: 0 0 0 4px rgba(37,99,235,0.06); }
        .drop-zone:hover::after       { opacity: 1; }
        .drop-zone.dragging           { border-color: #2563eb; background: #eff6ff; box-shadow: 0 0 0 5px rgba(37,99,235,0.1); transform: scale(1.01); }
        .drop-zone.dragging::after    { opacity: 1; }
        .drop-zone.has-file           { border-style: solid; border-color: #6ee7b7; background: #f0fdf4; cursor: default; }

        .icon-wrap {
          width: 44px; height: 44px;
          border-radius: 13px;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 0.65rem;
          transition: background 0.2s, transform 0.2s;
        }

        .icon-wrap.idle    { background: #e2e8f0; }
        .icon-wrap.active  { background: #dbeafe; transform: scale(1.08); }
        .icon-wrap.success { background: #d1fae5; }

        .upload-icon { width: 20px; height: 20px; color: #94a3b8; transition: color 0.2s; }
        .icon-wrap.active .upload-icon { color: #2563eb; }
        .check-icon  { width: 20px; height: 20px; color: #10b981; }

        .drop-label  { font-weight: 600; color: #1e293b; font-size: 0.85rem; margin-bottom: 3px; }
        .drop-hint   { font-size: 0.73rem; color: #94a3b8; }

        .file-name {
          font-weight: 600;
          color: #0f172a;
          font-size: 0.85rem;
          margin-bottom: 6px;
          word-break: break-all;
          padding: 0 0.5rem;
        }

        .file-meta {
          font-size: 0.73rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .file-meta-tag {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: #f1f5f9;
          border-radius: 100px;
          padding: 2px 9px;
          font-size: 0.7rem;
          font-weight: 500;
          color: #475569;
        }

        .remove-btn {
          margin-top: 0.5rem;
          background: none;
          border: none;
          font-size: 0.7rem;
          color: #94a3b8;
          cursor: pointer;
          padding: 3px 8px;
          border-radius: 6px;
          transition: color 0.15s, background 0.15s;
          font-family: inherit;
        }

        .remove-btn:hover { color: #ef4444; background: #fef2f2; }

        /* Step trail — compact */
        .steps {
          display: flex;
          margin: 1rem 0 0;
        }

        .step {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          position: relative;
        }

        .step:not(:last-child)::after {
          content: '';
          position: absolute;
          top: 10px; left: calc(50% + 12px);
          width: calc(100% - 24px);
          height: 1px;
          background: #e2e8f0;
        }

        .step-num {
          width: 20px; height: 20px;
          border-radius: 50%;
          background: #f1f5f9;
          border: 1.5px solid #e2e8f0;
          font-size: 0.6rem;
          font-weight: 700;
          color: #94a3b8;
          display: flex; align-items: center; justify-content: center;
          position: relative;
          z-index: 1;
        }

        .step-num.active {
          background: #2563eb;
          border-color: #2563eb;
          color: white;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.15);
        }

        .step-label {
          font-size: 0.6rem;
          color: #94a3b8;
          font-weight: 500;
          text-align: center;
        }

        .step-label.active { color: #2563eb; }

        /* CTA */
        .cta-btn {
          margin-top: 1.1rem;
          width: 100%;
          padding: 0.8rem 1rem;
          border-radius: 13px;
          border: none;
          font-family: 'Outfit', sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          letter-spacing: 0.01em;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.22, 1, 0.36, 1);
          position: relative;
          overflow: hidden;
        }

        .cta-btn.enabled {
          background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 60%, #3b82f6 100%);
          color: white;
          box-shadow: 0 4px 14px rgba(37,99,235,0.28);
        }

        .cta-btn.enabled:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 22px rgba(37,99,235,0.35);
        }

        .cta-btn.enabled:active { transform: translateY(0); }

        .cta-btn.enabled::after {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
          transform: skewX(-20deg);
          transition: left 0.5s;
        }

        .cta-btn.enabled:hover::after { left: 150%; }

        .cta-btn.disabled {
          background: #f1f5f9;
          color: #cbd5e1;
          cursor: not-allowed;
        }

        .cta-inner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
        }

        .arrow { display: inline-flex; transition: transform 0.2s; }
        .cta-btn.enabled:hover .arrow { transform: translateX(4px); }
      `}</style>

      <div className="upload-root">
        <div className="deco-circle-1" />
        <div className="deco-circle-2" />
        <div className="deco-dot-grid" />

        <div className="card">
          <div className="badge">
            <span className="badge-dot" />
            Print on demand
          </div>

          <h1 className="headline">
            Print smarter,
            <br />
            not harder.
          </h1>
          <p className="subtext">
            Upload your PDF — we handle the rest. Pay online, collect in store.
          </p>

          <div className="divider" />

          <div
            className={`drop-zone${dragging ? " dragging" : ""}${file ? " has-file" : ""}`}
            onClick={() => {
              if (!file && inputRef.current) {
                inputRef.current.value = null; // allows re-upload same file
                inputRef.current.click();
              }
            }}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
          >
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf,.pdf"
              style={{ display: "none" }}
              onChange={(e) => handleFile(e.target.files?.[0])}
            />

            {!file ? (
              <>
                <div className={`icon-wrap${dragging ? " active" : " idle"}`}>
                  <svg
                    className="upload-icon"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.75}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                    />
                  </svg>
                </div>
                <p className="drop-label">
                  {dragging ? "Release to upload" : "Drop your PDF here"}
                </p>
                <p className="drop-hint">
                  or click to browse · PDF only · max 20MB
                </p>
              </>
            ) : (
              <>
                <div className="icon-wrap success">
                  <svg
                    className="check-icon"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                </div>
                <p className="file-name">{file.name}</p>
                <div className="file-meta">
                  <span className="file-meta-tag">
                    <svg
                      width="10"
                      height="10"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-11.625H4.5"
                      />
                    </svg>
                    PDF
                  </span>
                  <span className="file-meta-tag">
                    {pageCount} {pageCount === 1 ? "page" : "pages"}
                  </span>
                </div>
                <button
                  className="remove-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    setPageCount(null);
                  }}
                >
                  × Remove file
                </button>
              </>
            )}
          </div>

          <div className="steps">
            {["Upload", "Options", "Pay", "Collect"].map((label, i) => (
              <div className="step" key={label}>
                <div className={`step-num${i === 0 ? " active" : ""}`}>
                  {i + 1}
                </div>
                <span className={`step-label${i === 0 ? " active" : ""}`}>
                  {label}
                </span>
              </div>
            ))}
          </div>

          <button
            className={`cta-btn ${file ? "enabled" : "disabled"}`}
            disabled={!file}
            onClick={() => file && onContinue({ file, pageCount })}
          >
            <span className="cta-inner">
              Continue to Print Options
              <span className="arrow">
                <svg
                  width="15"
                  height="15"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </span>
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
