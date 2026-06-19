import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import { useForm, useWatch } from "react-hook-form";
import { FileText, Sliders, Layers, Settings2, Sparkles, AlertCircle } from "lucide-react";
import api from "../lib/api";
import OrderTimeline from "../components/OrderTimeline";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

import worker from "pdfjs-dist/build/pdf.worker.min?url";

pdfjs.GlobalWorkerOptions.workerSrc = worker;

const pageBackgroundStyle = {
  background: `
    radial-gradient(ellipse 80% 60% at 50% -10%, rgba(200, 162, 77, 0.12), transparent 60%),
    linear-gradient(180deg, #0C0B0A 0%, #16160F 100%)
  `
};

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
              ? "border-[#c9a66b] ring-2 ring-[#c9a66b]/30 scale-[1.02]"
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

/* ---------------- MAIN COMPONENT ---------------- */

export default function OptionsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { file, orderId, numPages } = location.state || {};

  const { register, control, setValue, getValues } = useForm({
    defaultValues: {
      color: "bw",
      sides: "single",
      paperSize: "A4",
      copies: 1,
      pagesType: "all",
      customPages: "",
    },
  });

  const color = useWatch({ control, name: "color" });
  const copies = useWatch({ control, name: "copies" });
  const pagesType = useWatch({ control, name: "pagesType" });
  const customPages = useWatch({ control, name: "customPages" });

  const [selectedPages, setSelectedPages] = useState([]);
  const [pageError, setPageError] = useState(null);

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    if (pagesType === "custom") {
      const { pages, error } = parsePageInput(customPages, numPages);
      setSelectedPages(pages);
      setPageError(error);
    }
  }, [customPages, pagesType, numPages]);

  const togglePage = useCallback(
    (page) => {
      setSelectedPages((prevSelectedPages) => {
        let updated;
        if (prevSelectedPages.includes(page)) {
          updated = prevSelectedPages.filter((p) => p !== page);
        } else {
          updated = [...prevSelectedPages, page];
        }
        updated.sort((a, b) => a - b);
        setValue("customPages", pagesToRange(updated));
        return updated;
      });
    },
    [setValue],
  );

  const selectedPagesSet = useMemo(() => new Set(selectedPages), [selectedPages]);

  const pageCount = useMemo(() => {
    if (pagesType === "all") return numPages;
    return selectedPages.length;
  }, [pagesType, selectedPages, numPages]);

  const price = useMemo(() => {
    const rate = color === "bw" ? 2 : 10;
    const safeCopies = Math.max(1, copies || 1);
    const safePages = Math.max(0, pageCount || 0);
    return safePages * safeCopies * rate;
  }, [pageCount, copies, color]);

  const handleContinue = async () => {
    try {
      setLoading(true);
      setApiError(null);
      const values = getValues();

      const payload = {
        printType: values.color,
        sides: values.sides,
        paperSize: values.paperSize,
        copies: values.copies,
        pageRangeMode: values.pagesType,
        pageRangeList: values.pagesType === "all" ? [] : selectedPages || [],
      };

      const { data } = await api.post(`/api/orders/${orderId}/options`, payload);
      navigate(`/payment/${data.orderId}`);
    } catch (err) {
      console.error(err);
      setApiError(err.response?.data?.error || "Failed to update layout metrics");
    } finally {
      setLoading(false);
    }
  };

  if (!file) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0C0B0A] text-[#a3a098] font-serif">
        <div className="text-center space-y-4">
          <AlertCircle className="mx-auto text-[#c9a66b]" size={32} />
          <p>Please upload a valid document stream payload first</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-12 px-4 sm:px-6 text-[#e8e6e3]" style={pageBackgroundStyle}>
      <OrderTimeline currentStep={2} />
      <div className="max-w-6xl mx-auto flex flex-col pt-10 lg:flex-row gap-6 items-start">
        
        {/* ================= LEFT SIDE: DOCUMENT CANVAS PREVIEW ================= */}
        <div className="w-full lg:w-[45%] flex flex-col gap-4 lg:sticky lg:top-32">
          <div className="bg-[#1e1c1a]/50 backdrop-blur-xl border border-white/5 rounded-3xl p-5 shadow-2xl flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2.5 h-2.5 rounded-full bg-[#c9a66b]" />
              <h2 className="text-sm font-semibold tracking-wider text-white uppercase font-serif">Document Sheet 1 Overview</h2>
            </div>

            <div className={`border border-white/5 rounded-2xl bg-[#0f0e0c]/60 flex justify-center items-center p-4 min-h-[380px] shadow-inner transition-all duration-300 ${
              color === "bw" ? "grayscale contrast-[1.15] opacity-80" : ""
            }`}>
              <Document file={file} loading={
                <div className="flex items-center gap-2 text-xs text-[#a3a098] font-serif">
                  <span className="w-2 h-2 rounded-full bg-[#c9a66b] animate-ping" /> Parsing blocks...
                </div>
              }>
                <Page pageNumber={1} width={280} renderTextLayer={false} renderAnnotationLayer={false} />
              </Document>
            </div>

            <div className="mt-4 flex items-center gap-3 bg-black/20 border border-white/5 rounded-xl p-3">
              <FileText size={18} className="text-[#c9a66b]" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-white truncate">{file.name}</p>
                <p className="text-[11px] text-[#a3a098] mt-0.5">Total capacity · {numPages} pages</p>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT SIDE: PRINT CONSOLE CONFIGURATION ================= */}
        <div className="w-full lg:w-[55%]">
          <div className="bg-[#1e1c1a]/50 backdrop-blur-xl border border-white/5 rounded-3xl p-5 sm:p-7 flex flex-col shadow-2xl">
            
            {/* Form Segment Header Header */}
            <div className="mb-6 border-b border-white/5 pb-4 flex justify-between items-center">
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#c9a66b]">Parameters</div>
                <h2 className="text-xl font-serif font-bold text-white mt-1">Layout Settings</h2>
              </div>
              <Settings2 size={18} className="text-[#a3a098]" />
            </div>

            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                {/* COLOR MULTIPLEX GROUP */}
                <div className="space-y-2">
                  <p className="text-[11px] uppercase tracking-wider font-semibold text-[#a3a098]">Color Mode</p>
                  <div className="grid grid-cols-2 gap-2 bg-[#0f0e0c]/80 border border-white/5 p-1.5 rounded-xl shadow-inner h-[46px]">
                    {["bw", "color"].map((val) => (
                      <label key={val} className="w-full relative cursor-pointer">
                        <input type="radio" value={val} {...register("color")} className="hidden peer" />
                        <div className="text-center py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider text-[#a3a098] transition-all duration-200
                          peer-checked:bg-[#c9a66b] peer-checked:text-[#1C1C18] peer-checked:shadow-md h-full flex items-center justify-center">
                          {val === "bw" ? "B & W" : "Color"}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* DUPLEX LAYER SELECTION */}
                <div className="space-y-2">
                  <p className="text-[11px] uppercase tracking-wider font-semibold text-[#a3a098]">Sides</p>
                  <div className="grid grid-cols-2 gap-2 bg-[#0f0e0c]/80 border border-white/5 p-1.5 rounded-xl shadow-inner h-[46px]">
                    {["single", "double"].map((val) => (
                      <label key={val} className="w-full relative cursor-pointer">
                        <input type="radio" value={val} {...register("sides")} className="hidden peer" />
                        <div className="text-center py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider text-[#a3a098] transition-all duration-200
                          peer-checked:bg-[#c9a66b] peer-checked:text-[#1C1C18] peer-checked:shadow-md h-full flex items-center justify-center">
                          {val}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* SHEET FORMAT SPECIFICATIONS */}
                <div className="space-y-2">
                  <p className="text-[11px] uppercase tracking-wider font-semibold text-[#a3a098]">Paper Size</p>
                  <div className="grid grid-cols-2 gap-2 bg-[#0f0e0c]/80 border border-white/5 p-1.5 rounded-xl shadow-inner h-[46px]">
                    {["A4", "Letter"].map((val) => (
                      <label key={val} className="w-full relative cursor-pointer">
                        <input type="radio" value={val} {...register("paperSize")} className="hidden peer" />
                        <div className="text-center py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider text-[#a3a098] transition-all duration-200
                          peer-checked:bg-[#c9a66b] peer-checked:text-[#1C1C18] peer-checked:shadow-md h-full flex items-center justify-center">
                          {val}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* VOLUME MULTIPLIER (COPIES) */}
                <div className="space-y-2">
                  <p className="text-[11px] uppercase tracking-wider font-semibold text-[#a3a098]">Copies</p>
                  <input
                    type="number"
                    min={1}
                    {...register("copies", { valueAsNumber: true })}
                    className="w-full bg-[#0f0e0c]/80 border border-white/5 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#c9a66b]/50 h-[46px] shadow-inner transition-colors"
                  />
                </div>

                {/* SHEET RANGE CONFIGURATOR (PAGES) */}
                <div className="md:col-span-2 space-y-3 pt-2 border-t border-white/5">
                  <p className="text-[11px] uppercase tracking-wider font-semibold text-[#a3a098]">Page Boundaries</p>

                  <div className="grid grid-cols-2 gap-2 bg-[#0f0e0c]/80 border border-white/5 p-1.5 rounded-xl shadow-inner w-56 h-[46px]">
                    {["all", "custom"].map((val) => (
                      <label key={val} className="w-full relative cursor-pointer">
                        <input type="radio" value={val} {...register("pagesType")} className="hidden peer" />
                        <div className="text-center py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider text-[#a3a098] transition-all duration-200
                          peer-checked:bg-[#c9a66b] peer-checked:text-[#1C1C18] peer-checked:shadow-md h-full flex items-center justify-center">
                          {val}
                        </div>
                      </label>
                    ))}
                  </div>

                  {pagesType === "custom" && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                      <input
                        type="text"
                        placeholder="e.g. 1-5, 8, 11-14"
                        {...register("customPages")}
                        className="w-full md:w-2/3 bg-[#0f0e0c]/80 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-[#a3a098]/30 focus:outline-none focus:border-[#c9a66b]/50 shadow-inner transition-colors"
                      />

                      {/* VIRTUALIZED CHRONOLOGICAL SHEET MATRIX */}
                      <div className="bg-[#0f0e0c]/40 border border-white/5 rounded-2xl p-4 max-h-[260px] overflow-y-auto custom-scrollbar shadow-inner">
                        <Document file={file}>
                          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                            {Array.from({ length: numPages }, (_, i) => i + 1).map((pageNumber) => (
                              <Thumbnail
                                key={pageNumber}
                                pageNumber={pageNumber}
                                selected={selectedPagesSet.has(pageNumber)}
                                onClick={togglePage}
                              />
                            ))}
                          </div>
                        </Document>
                      </div>
                    </div>
                  )}

                  {pageError && (
                    <div className="flex items-center gap-2 text-xs text-red-400 mt-1">
                      <AlertCircle size={12} />
                      <p>{pageError}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* OPERATIONAL CHECKOUT FINANCIAL METRICS SUMMARY */}
              <div className="pt-5 border-t border-white/5 mt-2 space-y-4">
                <div className="space-y-2 text-xs text-[#a3a098]">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5"><Layers size={12} /> Computed Sheets</span>
                    <span className="text-white font-medium">{pageCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5"><Sliders size={12} /> Volume Copies</span>
                    <span className="text-white font-medium">× {copies || 1}</span>
                  </div>
                </div>

                <div className="flex justify-between items-end pt-2 border-t border-white/5">
                  <span className="text-[#a3a098] text-sm">Estimated Cost</span>
                  <span className="text-4xl sm:text-3xl font-black tracking-tight bg-gradient-to-r from-[#c9a66b] via-[#e8d099] to-[#c9a66b] bg-clip-text text-transparent">
  ₹{price}
</span>
                </div>

                <button
                  onClick={handleContinue}
                  disabled={pageError || pageCount === 0 || loading}
                  className={`group w-full py-4 rounded-2xl font-bold tracking-wide text-sm flex items-center justify-center gap-2 transition-all duration-300 mt-2
                    ${
                      pageError || pageCount === 0 || loading
                        ? "bg-white/5 text-gray-500 border border-white/5 cursor-not-allowed"
                        : "bg-[linear-gradient(135deg,#D9B96A_0%,#C8A24D_50%,#A8842F_100%)] text-[#1C1C18] shadow-[0_10px_30px_-10px_rgba(201,166,107,0.4)] hover:shadow-[0_15px_40px_-10px_rgba(201,166,107,0.6)] hover:scale-[1.01] cursor-pointer"
                    }`}
                >
                  {loading ? (
                    "Syncing Layout Preferences..."
                  ) : (
                    <>
                      <Sparkles size={16} />
                      CONTINUE TO SUMMARY →
                    </>
                  )}
                </button>

                {apiError && (
                  <div className="mt-3 flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-xs text-red-400">
                    <AlertCircle className="shrink-0 mt-0.5" size={14} />
                    <p>{apiError}</p>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
} 