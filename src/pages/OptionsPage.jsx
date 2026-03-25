import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import { useForm, useWatch } from "react-hook-form";

import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

import worker from "pdfjs-dist/build/pdf.worker.min?url";

pdfjs.GlobalWorkerOptions.workerSrc = worker;
pdfjs.verbosity = pdfjs.VerbosityLevel.ERRORS;

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
        error = "Start page cannot be greater than end page";
        continue;
      }

      for (let i = start; i <= end; i++) {
        if (i < 1 || i > maxPages) {
          error = `Pages must be between 1 and ${maxPages}`;
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
        error = `Pages must be between 1 and ${maxPages}`;
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

/* ---------------- COMPONENT ---------------- */

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

  /* Sync textbox → thumbnails */

  useEffect(() => {
    if (pagesType === "custom") {
      const { pages, error } = parsePageInput(customPages, numPages);

      setSelectedPages(pages);
      setPageError(error);
    }
  }, [customPages, pagesType, numPages]);

  /* Toggle thumbnails */

  const togglePage = (page) => {
    let updated;

    if (selectedPages.includes(page)) {
      updated = selectedPages.filter((p) => p !== page);
    } else {
      updated = [...selectedPages, page];
    }

    updated.sort((a, b) => a - b);

    setSelectedPages(updated);
    setValue("customPages", pagesToRange(updated));
  };

  /* Page count */

  const pageCount = useMemo(() => {
    if (pagesType === "all") return numPages;
    return selectedPages.length;
  }, [pagesType, selectedPages, numPages]);

  /* Price calculation (frontend preview only) */

  const price = useMemo(() => {
    const rate = color === "bw" ? 2 : 10;

    const safeCopies = Math.max(1, copies || 1);
    const safePages = Math.max(0, pageCount || 0);

    return safePages * safeCopies * rate;
  }, [pageCount, copies, color]);

  /* ---------------- API SUBMIT ---------------- */

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

      const res = await fetch(
        `http://localhost:3000/api/orders/${orderId}/options`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update options");
      }

      const data = await res.json();

      console.log("Order updated:", data);

      // later navigate to payment page
      navigate(`/payment/${data.orderId}`);
    } catch (err) {
      console.error(err);
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!file) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Upload a file first
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-gray-100 p-4">
      <div className="h-full max-w-7xl mx-auto flex gap-6">
        {/* ================= LEFT ================= */}
        <div className="w-1/2 flex flex-col gap-4 h-full">
          {/* PREVIEW */}
          <div className="bg-white rounded-xl shadow p-4 shrink-0">
            <h2 className="text-md font-semibold mb-2">Preview</h2>

            <div
              className={`border rounded-lg bg-gray-50 flex justify-center items-center p-4 ${
                color === "bw" ? "grayscale" : ""
              }`}
            >
              <Document file={file}>
                <Page pageNumber={1} width={280} />
              </Document>
            </div>

            <p className="text-xs text-gray-500 mt-2">
              {file.name} • {numPages} pages
            </p>
          </div>

          {/* PAGE SELECTION (SCROLL ONLY HERE) */}
          {pagesType === "custom" && (
            <div className="bg-white rounded-xl shadow p-4 flex-1 overflow-hidden">
              <h3 className="font-medium mb-2">Select Pages</h3>

              <div className="h-full overflow-y-auto pr-2">
                <Document file={file}>
                  <div className="grid grid-cols-4 gap-2">
                    {Array.from({ length: numPages }, (_, i) => {
                      const pageNumber = i + 1;
                      const selected = selectedPages.includes(pageNumber);

                      return (
                        <div
                          key={pageNumber}
                          onClick={() => togglePage(pageNumber)}
                          className={`cursor-pointer border rounded p-1
                        ${
                          selected
                            ? "border-blue-500 ring-2 ring-blue-300"
                            : "border-gray-200"
                        }`}
                        >
                          <Page
                            pageNumber={pageNumber}
                            width={70}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                          />
                          <p className="text-[10px] text-center">
                            {pageNumber}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </Document>
              </div>
            </div>
          )}
        </div>
        {/* ================= RIGHT ================= */}
        <div className="h-full">
          <div className="h-full bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 flex flex-col">
            {/* HEADER */}
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Print Settings
              </h2>
              <p className="text-xs text-gray-500">
                Configure your preferences
              </p>
            </div>

            {/* GRID SETTINGS (MULTI-COLUMN) */}
            <div className="grid grid-cols-2 gap-5 flex-1 content-start">
              {/* COLOR */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-500">COLOR</p>
                <div className="flex bg-gray-100/70 p-1 rounded-xl shadow-inner">
                  <label className="flex-1">
                    <input
                      type="radio"
                      value="bw"
                      {...register("color")}
                      className="hidden peer"
                    />
                    <div className="text-center py-1.5 rounded-lg text-sm cursor-pointer peer-checked:bg-white peer-checked:shadow-md">
                      BW
                    </div>
                  </label>
                  <label className="flex-1">
                    <input
                      type="radio"
                      value="color"
                      {...register("color")}
                      className="hidden peer"
                    />
                    <div className="text-center py-1.5 rounded-lg text-sm cursor-pointer peer-checked:bg-white peer-checked:shadow-md">
                      Color
                    </div>
                  </label>
                </div>
              </div>

              {/* SIDES */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-500">SIDES</p>
                <div className="flex bg-gray-100/70 p-1 rounded-xl shadow-inner">
                  <label className="flex-1">
                    <input
                      type="radio"
                      value="single"
                      {...register("sides")}
                      className="hidden peer"
                    />
                    <div className="text-center py-1.5 rounded-lg text-sm cursor-pointer peer-checked:bg-white peer-checked:shadow-md">
                      Single
                    </div>
                  </label>
                  <label className="flex-1">
                    <input
                      type="radio"
                      value="double"
                      {...register("sides")}
                      className="hidden peer"
                    />
                    <div className="text-center py-1.5 rounded-lg text-sm cursor-pointer peer-checked:bg-white peer-checked:shadow-md">
                      Double
                    </div>
                  </label>
                </div>
              </div>

              {/* PAPER */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-500">PAPER</p>
                <div className="flex bg-gray-100/70 p-1 rounded-xl shadow-inner">
                  <label className="flex-1">
                    <input
                      type="radio"
                      value="A4"
                      {...register("paperSize")}
                      className="hidden peer"
                    />
                    <div className="text-center py-1.5 rounded-lg text-sm cursor-pointer peer-checked:bg-white peer-checked:shadow-md">
                      A4
                    </div>
                  </label>
                  <label className="flex-1">
                    <input
                      type="radio"
                      value="Letter"
                      {...register("paperSize")}
                      className="hidden peer"
                    />
                    <div className="text-center py-1.5 rounded-lg text-sm cursor-pointer peer-checked:bg-white peer-checked:shadow-md">
                      Letter
                    </div>
                  </label>
                </div>
              </div>

              {/* COPIES */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-500">COPIES</p>
                <input
                  type="number"
                  min={1}
                  {...register("copies", { valueAsNumber: true })}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>

              {/* PAGES (FULL WIDTH) */}
              <div className="col-span-2 space-y-2">
                <p className="text-xs font-semibold text-gray-500">PAGES</p>

                <div className="flex bg-gray-100/70 p-1 rounded-xl shadow-inner w-fit">
                  <label>
                    <input
                      type="radio"
                      value="all"
                      {...register("pagesType")}
                      className="hidden peer"
                    />
                    <div className="px-4 py-1.5 rounded-lg text-sm cursor-pointer peer-checked:bg-white peer-checked:shadow-md">
                      All
                    </div>
                  </label>

                  <label>
                    <input
                      type="radio"
                      value="custom"
                      {...register("pagesType")}
                      className="hidden peer"
                    />
                    <div className="px-4 py-1.5 rounded-lg text-sm cursor-pointer peer-checked:bg-white peer-checked:shadow-md">
                      Custom
                    </div>
                  </label>
                </div>

                {pagesType === "custom" && (
                  <input
                    type="text"
                    placeholder="1-5,8"
                    {...register("customPages")}
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
                  />
                )}

                {pageError && (
                  <p className="text-red-500 text-xs">{pageError}</p>
                )}
              </div>
            </div>

            {/* SUMMARY */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Pages</span>
                <span>{pageCount}</span>
              </div>

              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>Copies</span>
                <span>{copies}</span>
              </div>

              <div className="flex justify-between items-center mt-3">
                <span className="text-sm text-gray-500">Total</span>
                <span className="text-2xl font-bold text-blue-600">
                  ₹{price}
                </span>
              </div>

              <button
                onClick={handleContinue}
                disabled={pageError || pageCount === 0 || loading}
                className={`mt-4 w-full py-3 rounded-xl font-semibold text-white transition-all
              ${
                pageError || pageCount === 0
                  ? "bg-gray-400"
                  : "bg-linear-to-r from-blue-600 to-indigo-600 hover:opacity-95 active:scale-[0.98] shadow-lg"
              }`}
              >
                {loading ? "Processing..." : "Continue →"}
              </button>
              {apiError && (
                <p className="text-red-500 text-xs mt-2">{apiError}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// {/* ================= RIGHT ================= */}
//         <div className="w-1/2 flex flex-col gap-4 h-full">
//           {/* SETTINGS */}
//           <div className="bg-white rounded-xl shadow p-5 flex-1 overflow-y-auto">
//             <h2 className="text-md font-semibold mb-4">Print Settings</h2>

//             <div className="space-y-5 text-sm">
//               <div>
//                 <p className="font-medium mb-1">Color</p>
//                 <label className="mr-4">
//                   <input type="radio" value="bw" {...register("color")} /> BW
//                 </label>
//                 <label>
//                   <input type="radio" value="color" {...register("color")} />{" "}
//                   Color
//                 </label>
//               </div>

//               <div>
//                 <p className="font-medium mb-1">Sides</p>
//                 <label className="mr-4">
//                   <input type="radio" value="single" {...register("sides")} />{" "}
//                   Single
//                 </label>
//                 <label>
//                   <input type="radio" value="double" {...register("sides")} />{" "}
//                   Double
//                 </label>
//               </div>

//               <div>
//                 <p className="font-medium mb-1">Paper</p>
//                 <label className="mr-4">
//                   <input type="radio" value="A4" {...register("paperSize")} />{" "}
//                   A4
//                 </label>
//                 <label>
//                   <input
//                     type="radio"
//                     value="Letter"
//                     {...register("paperSize")}
//                   />{" "}
//                   Letter
//                 </label>
//               </div>

//               <div>
//                 <p className="font-medium mb-1">Copies</p>
//                 <input
//                   type="number"
//                   min={1}
//                   {...register("copies", { valueAsNumber: true })}
//                   className="border px-2 py-1 rounded w-20"
//                 />
//               </div>

//               <div>
//                 <p className="font-medium mb-1">Pages</p>

//                 <label className="mr-4">
//                   <input type="radio" value="all" {...register("pagesType")} />{" "}
//                   All
//                 </label>

//                 <label>
//                   <input
//                     type="radio"
//                     value="custom"
//                     {...register("pagesType")}
//                   />{" "}
//                   Custom
//                 </label>

//                 {pagesType === "custom" && (
//                   <input
//                     type="text"
//                     placeholder="1-5,8"
//                     {...register("customPages")}
//                     className="border ml-3 px-2 py-1 rounded"
//                   />
//                 )}

//                 {pageError && (
//                   <p className="text-red-500 text-xs mt-1">{pageError}</p>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* PRICE (FIXED HEIGHT) */}
//           <div className="bg-white rounded-xl shadow p-5 flex-shrink-0">
//             <h2 className="text-md font-semibold mb-2">Summary</h2>

//             <p className="text-sm">Pages: {pageCount}</p>
//             <p className="text-sm">Copies: {copies}</p>

//             <p className="text-lg font-bold mt-2">₹{price}</p>

//             <button
//               onClick={handleContinue}
//               disabled={pageError || pageCount === 0 || loading}
//               className={`mt-4 w-full py-2 rounded text-white
//             ${
//               pageError || pageCount === 0
//                 ? "bg-gray-400"
//                 : "bg-blue-600 hover:bg-blue-700"
//             }`}
//             >
//               {loading ? "Saving..." : "Continue"}
//             </button>

//             {apiError && (
//               <p className="text-red-500 text-xs mt-2">{apiError}</p>
//             )}
//           </div>
//         </div>
