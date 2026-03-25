// import React, { useMemo } from "react";
// import { useLocation } from "react-router-dom";
// import { Document, Page, pdfjs } from "react-pdf";
// import { useForm, useWatch } from "react-hook-form";

// import "react-pdf/dist/Page/TextLayer.css";
// import "react-pdf/dist/Page/AnnotationLayer.css";

// import worker from "pdfjs-dist/build/pdf.worker.min?url";

// pdfjs.GlobalWorkerOptions.workerSrc = worker;

// export default function OptionsPage() {
//   const location = useLocation();
//   const { file, orderId, numPages } = location.state || {};

//   const { register, control } = useForm({
//     defaultValues: {
//       color: "bw",
//       copies: 1,
//       pagesType: "all",
//       customPages: "",
//     },
//   });

//   const color = useWatch({ control, name: "color" });
//   const copies = useWatch({ control, name: "copies" });
//   const pagesType = useWatch({ control, name: "pagesType" });
//   const customPages = useWatch({ control, name: "customPages" });

//   if (!file) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p className="text-gray-500">
//           No document loaded. Please upload a file first.
//         </p>
//       </div>
//     );
//   }

//   // Parse custom page range
//   const pageCount = useMemo(() => {
//     if (pagesType === "all") return numPages;

//     if (!customPages) return 0;

//     let total = 0;

//     const parts = customPages.split(",");

//     parts.forEach((part) => {
//       if (part.includes("-")) {
//         const [start, end] = part.split("-").map(Number);

//         if (!isNaN(start) && !isNaN(end) && end >= start) {
//           total += end - start + 1;
//         }
//       } else {
//         if (!isNaN(Number(part))) total += 1;
//       }
//     });

//     return total;
//   }, [pagesType, customPages, numPages]);

//   // Price calculation
//   const price = useMemo(() => {
//     const perPage = color === "bw" ? 2 : 10;
//     return pageCount * copies * perPage;
//   }, [color, copies, pageCount]);

//   return (
//     <div className="min-h-screen bg-gray-100 flex justify-center py-10 px-4">
//       <div className="w-full max-w-4xl space-y-6">

//         {/* Document */}
//         <div className="bg-white shadow-md rounded-xl p-6">
//           <h2 className="text-xl font-semibold border-b pb-3 mb-4">
//             Document
//           </h2>

//           <div className="space-y-1 text-gray-700">
//             <p>
//               <span className="font-medium">File:</span> {file.name}
//             </p>

//             <p>
//               <span className="font-medium">Pages:</span> {numPages}
//             </p>

//             <p className="text-sm text-gray-400">
//               Order ID: {orderId}
//             </p>
//           </div>

//           <div className="mt-6">
//             <h3 className="font-medium mb-2 text-gray-700">
//               Preview
//             </h3>

//             <div
//               className={`border rounded-lg bg-gray-50 flex justify-center py-6 transition ${
//                 color === "bw" ? "grayscale" : ""
//               }`}
//             >
//               <Document file={file}>
//                 <Page
//                   pageNumber={1}
//                   width={350}
//                   renderTextLayer={false}
//                   renderAnnotationLayer={false}
//                 />
//               </Document>
//             </div>
//           </div>
//         </div>

//         {/* Print Settings */}
//         <div className="bg-white shadow-md rounded-xl p-6">
//           <h2 className="text-xl font-semibold border-b pb-3 mb-6">
//             Print Settings
//           </h2>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

//             {/* Color */}
//             <div>
//               <p className="font-medium mb-2">Color</p>

//               <div className="flex gap-4">
//                 <label className="flex items-center gap-2">
//                   <input
//                     type="radio"
//                     value="bw"
//                     {...register("color")}
//                   />
//                   BW
//                 </label>

//                 <label className="flex items-center gap-2">
//                   <input
//                     type="radio"
//                     value="color"
//                     {...register("color")}
//                   />
//                   Color
//                 </label>
//               </div>
//             </div>

//             {/* Copies */}
//             <div>
//               <p className="font-medium mb-2">Copies</p>

//               <input
//                 type="number"
//                 min={1}
//                 {...register("copies", { valueAsNumber: true })}
//                 className="border rounded-lg px-3 py-2 w-24"
//               />
//             </div>

//             {/* Pages */}
//             <div className="md:col-span-2">
//               <p className="font-medium mb-2">Pages</p>

//               <div className="flex items-center gap-6">

//                 <label className="flex items-center gap-2">
//                   <input
//                     type="radio"
//                     value="all"
//                     {...register("pagesType")}
//                   />
//                   All
//                 </label>

//                 <label className="flex items-center gap-2">
//                   <input
//                     type="radio"
//                     value="custom"
//                     {...register("pagesType")}
//                   />
//                   Custom
//                 </label>

//                 <input
//                   type="text"
//                   placeholder="1-5,8,10"
//                   {...register("customPages")}
//                   className="border rounded-lg px-3 py-2 w-32"
//                 />
//               </div>
//             </div>

//           </div>
//         </div>

//         {/* Price Summary */}
//         <div className="bg-white shadow-md rounded-xl p-6">
//           <h2 className="text-xl font-semibold border-b pb-3 mb-4">
//             Price Summary
//           </h2>

//           <div className="space-y-2 text-gray-700">
//             <p>Pages: {pageCount}</p>
//             <p>Copies: {copies}</p>

//             <p className="text-lg font-semibold pt-2">
//               Total: ₹{price}
//             </p>
//           </div>

//           <button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition">
//             Continue to Payment
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// }

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
    <div className="min-h-screen bg-gray-100 flex justify-center py-10 px-4">
      <div className="w-full max-w-5xl space-y-6">
        {/* DOCUMENT */}

        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold border-b pb-3 mb-4">Document</h2>

          <p>
            <b>File:</b> {file.name}
          </p>
          <p>
            <b>Pages:</b> {numPages}
          </p>
          <p className="text-sm text-gray-400">Order ID: {orderId}</p>

          {/* Preview */}

          <div className="mt-6">
            <div
              className={`border rounded-lg bg-gray-50 flex justify-center py-6 ${
                color === "bw" ? "grayscale" : ""
              }`}
            >
              <Document file={file}>
                <Page pageNumber={1} width={350} />
              </Document>
            </div>
          </div>

          {/* THUMBNAILS */}

          {pagesType === "custom" && (
            <div className="mt-8">
              <h3 className="font-medium mb-3">Select Pages</h3>

              <Document file={file}>
                <div className="grid grid-cols-5 md:grid-cols-8 gap-3 max-h-72 overflow-y-auto">
                  {Array.from({ length: numPages }, (_, i) => {
                    const pageNumber = i + 1;
                    const selected = selectedPages.includes(pageNumber);

                    return (
                      <div
                        key={pageNumber}
                        onClick={() => togglePage(pageNumber)}
                        className={`cursor-pointer border rounded-lg p-1
                        ${
                          selected
                            ? "border-blue-500 ring-2 ring-blue-400"
                            : "border-gray-200"
                        }`}
                      >
                        <Page
                          pageNumber={pageNumber}
                          width={80}
                          renderTextLayer={false}
                          renderAnnotationLayer={false}
                        />

                        <p className="text-xs text-center">{pageNumber}</p>
                      </div>
                    );
                  })}
                </div>
              </Document>
            </div>
          )}
        </div>

        {/* PRINT SETTINGS */}

        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold border-b pb-3 mb-6">
            Print Settings
          </h2>

          <div className="grid grid-cols-2 gap-6">
            {/* COLOR */}

            <div>
              <p className="font-medium mb-2">Color</p>

              <label className="mr-4">
                <input type="radio" value="bw" {...register("color")} />
                BW
              </label>

              <label>
                <input type="radio" value="color" {...register("color")} />
                Color
              </label>
            </div>

            {/* SIDES */}

            <div>
              <p className="font-medium mb-2">Sides</p>

              <label className="mr-4">
                <input type="radio" value="single" {...register("sides")} />
                Single
              </label>

              <label>
                <input type="radio" value="double" {...register("sides")} />
                Double
              </label>
            </div>

            {/* PAPER SIZE */}

            <div>
              <p className="font-medium mb-2">Paper Size</p>

              <label className="mr-4">
                <input type="radio" value="A4" {...register("paperSize")} />
                A4
              </label>

              <label>
                <input type="radio" value="Letter" {...register("paperSize")} />
                Letter
              </label>
            </div>

            {/* COPIES */}

            <div>
              <p className="font-medium mb-2">Copies</p>

              <input
                type="number"
                min={1}
                {...register("copies", { valueAsNumber: true })}
                onBlur={(e) => {
                  if (!e.target.value || e.target.value < 1) {
                    setValue("copies", 1);
                  }
                }}
                className="border px-2 py-1 rounded"
              />
            </div>

            {/* PAGE TYPE */}

            <div className="col-span-2">
              <p className="font-medium mb-2">Pages</p>

              <label className="mr-4">
                <input type="radio" value="all" {...register("pagesType")} />
                All
              </label>

              <label>
                <input type="radio" value="custom" {...register("pagesType")} />
                Custom
              </label>

              {pagesType === "custom" && (
                <input
                  type="text"
                  placeholder="1-5,8"
                  {...register("customPages")}
                  className="border rounded px-2 py-1 ml-4"
                />
              )}

              {pageError && (
                <p className="text-red-500 text-sm mt-2">{pageError}</p>
              )}
            </div>
          </div>
        </div>

        {/* PRICE */}

        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold border-b pb-3 mb-4">
            Price Summary
          </h2>

          <p>Pages: {pageCount}</p>
          <p>Copies: {copies}</p>
          <p>Mode: {color === "bw" ? "BW" : "Color"}</p>

          <p className="text-lg font-semibold mt-2">Total: ₹{price}</p>

          <button
            onClick={handleContinue}
            disabled={pageError || pageCount === 0 || loading}
            className={`mt-6 w-full py-3 rounded-lg text-white
            ${
              pageError || pageCount === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Saving..." : "Continue to Payment"}
          </button>

          {apiError && <p className="text-red-500 text-sm mt-2">{apiError}</p>}
        </div>
      </div>
    </div>
  );
}
