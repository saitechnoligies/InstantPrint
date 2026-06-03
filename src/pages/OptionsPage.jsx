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
import api from "../lib/api";

import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

import worker from "pdfjs-dist/build/pdf.worker.min?url";

pdfjs.GlobalWorkerOptions.workerSrc = worker;
// pdfjs.verbosity = pdfjs.VerbosityLevel.ERRORS;

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

const Thumbnail = React.memo(
  function Thumbnail({ pageNumber, selected, onClick }) {
    const handleClick = useCallback(() => {
      onClick(pageNumber);
    }, [onClick, pageNumber]);

    return (
      <div
        onClick={handleClick}
        className={`h-28 sm:h-32 cursor-pointer border rounded p-1
          ${
            selected
              ? "border-blue-500 ring-2 ring-blue-300"
              : "border-gray-200"
          }`}
      >
        <div className="h-[92px] overflow-hidden flex justify-center">
          <Page
            pageNumber={pageNumber}
            width={70}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        </div>
        <p className="text-[10px] text-center">{pageNumber}</p>
      </div>
    );
  },
  (prevProps, nextProps) =>
    prevProps.pageNumber === nextProps.pageNumber &&
    prevProps.selected === nextProps.selected &&
    prevProps.onClick === nextProps.onClick,
);

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
  const thumbnailsContainerRef = useRef(null);
  const thumbnailsScrollRafRef = useRef(null);
  const latestThumbnailsScrollTopRef = useRef(0);
  const [thumbnailsScrollTop, setThumbnailsScrollTop] = useState(0);
  const [thumbnailsViewportHeight, setThumbnailsViewportHeight] = useState(0);

  const THUMBNAIL_COLUMNS = 4;
  const THUMBNAIL_TILE_HEIGHT = 112;
  const THUMBNAIL_GRID_GAP = 8;
  const THUMBNAIL_ROW_HEIGHT = THUMBNAIL_TILE_HEIGHT + THUMBNAIL_GRID_GAP;
  const THUMBNAIL_OVERSCAN_ROWS = 1;

  /* Sync textbox → thumbnails */

  useEffect(() => {
    if (pagesType === "custom") {
      const { pages, error } = parsePageInput(customPages, numPages);

      setSelectedPages(pages);
      setPageError(error);
    }
  }, [customPages, pagesType, numPages]);

  useEffect(() => {
    if (pagesType !== "custom") return undefined;

    const container = thumbnailsContainerRef.current;
    if (!container) return undefined;

    const updateViewportHeight = () => {
      setThumbnailsViewportHeight(container.clientHeight);
    };

    updateViewportHeight();

    const observer = new ResizeObserver(updateViewportHeight);
    observer.observe(container);

    return () => observer.disconnect();
  }, [pagesType]);

  useEffect(() => {
    return () => {
      if (thumbnailsScrollRafRef.current !== null) {
        cancelAnimationFrame(thumbnailsScrollRafRef.current);
      }
    };
  }, []);

  /* Toggle thumbnails */

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

  const selectedPagesSet = useMemo(
    () => new Set(selectedPages),
    [selectedPages],
  );

  const handleThumbnailsScroll = useCallback((e) => {
    latestThumbnailsScrollTopRef.current = e.currentTarget.scrollTop;

    if (thumbnailsScrollRafRef.current !== null) return;

    thumbnailsScrollRafRef.current = requestAnimationFrame(() => {
      thumbnailsScrollRafRef.current = null;
      const next = latestThumbnailsScrollTopRef.current;
      setThumbnailsScrollTop((prev) => (prev === next ? prev : next));
    });
  }, []);

  /* Page count */

  const pageCount = useMemo(() => {
    if (pagesType === "all") return numPages;
    return selectedPages.length;
  }, [pagesType, selectedPages, numPages]);

  const virtualizedThumbnails = useMemo(() => {
    if (pagesType !== "custom") {
      return {
        topPadding: 0,
        bottomPadding: 0,
        visiblePages: [],
      };
    }

    const totalPages = numPages || 0;
    if (totalPages === 0) {
      return {
        topPadding: 0,
        bottomPadding: 0,
        visiblePages: [],
      };
    }

    const totalRows = Math.ceil(totalPages / THUMBNAIL_COLUMNS);
    const viewportBottom = thumbnailsScrollTop + thumbnailsViewportHeight;
    const startRow = Math.max(
      0,
      Math.floor(thumbnailsScrollTop / THUMBNAIL_ROW_HEIGHT) -
        THUMBNAIL_OVERSCAN_ROWS,
    );
    const lastVisibleRow = Math.max(
      0,
      Math.floor(Math.max(0, viewportBottom - 1) / THUMBNAIL_ROW_HEIGHT),
    );
    const endRow = Math.min(
      totalRows - 1,
      lastVisibleRow + THUMBNAIL_OVERSCAN_ROWS,
    );
    const startPage = startRow * THUMBNAIL_COLUMNS + 1;
    const endPage = Math.min(totalPages, (endRow + 1) * THUMBNAIL_COLUMNS);
    const visiblePages = Array.from(
      { length: Math.max(0, endPage - startPage + 1) },
      (_, i) => startPage + i,
    );

    return {
      topPadding: startRow * THUMBNAIL_ROW_HEIGHT,
      bottomPadding: Math.max(
        0,
        (totalRows - endRow - 1) * THUMBNAIL_ROW_HEIGHT,
      ),
      visiblePages,
    };
  }, [pagesType, numPages, thumbnailsScrollTop, thumbnailsViewportHeight]);

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

      // console.log(payload);

      const { data } = await api.post(
        `/api/orders/${orderId}/options`,
        payload,
      );

      // console.log("Order updated:", data);

      // later navigate to payment page
      navigate(`/payment/${data.orderId}`);
    } catch (err) {
      console.error(err);
      setApiError(err.response?.data?.error || "Failed to update options");
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
    // <div className="h-screen overflow-hidden bg-gray-100 p-4">
    <div className=" bg-gray-100 p-3 sm:p-4">
      {/* <div className="h-full max-w-7xl mx-auto flex gap-6"> */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-4">
        {/* ================= LEFT ================= */}
        {/* <div className="w-1/2 flex flex-col gap-4 h-full"> */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
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
        </div>
        {/* ================= RIGHT ================= */}
        {/* <div className="h-full"> */}
        <div className="w-full lg:w-1/2">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-4 sm:p-6 flex flex-col">
            {/* HEADER */}
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Print Settings
              </h2>
              <p className="text-xs text-gray-500">
                Configure your preferences
              </p>
            </div>

            {/* 🔥 MAIN CONTENT WRAPPER (VERY IMPORTANT) */}
            <div className="flex flex-col gap-5">
              {/* GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* COLOR */}
                <div className="space-y-2">
                  <p className="text-xs md:text-sm font-semibold text-gray-500">
                    COLOR
                  </p>
                  {/* <div className="flex flex-wrap gap-2 bg-gray-100/70 p-1.5 rounded-xl shadow-inner"> */}
                  <div className="grid grid-cols-2 gap-2 bg-gray-100/70 p-1.5 rounded-xl shadow-inner">
                    {["bw", "color"].map((val) => (
                      <label key={val} className="w-full">
                        <input
                          type="radio"
                          value={val}
                          {...register("color")}
                          className="hidden peer"
                        />
                        <div
                          className="text-center py-2 rounded-lg text-sm cursor-pointer 
            peer-checked:bg-white peer-checked:shadow-md transition"
                        >
                          {val.toUpperCase()}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* SIDES */}
                <div className="space-y-2">
                  <p className="text-xs md:text-sm font-semibold text-gray-500">
                    SIDES
                  </p>
                  <div className="flex flex-wrap gap-2 bg-gray-100/70 p-1.5 rounded-xl shadow-inner">
                    {["single", "double"].map((val) => (
                      <label key={val} className="flex-1 min-w-[100px]">
                        <input
                          type="radio"
                          value={val}
                          {...register("sides")}
                          className="hidden peer"
                        />
                        <div
                          className="text-center py-2 rounded-lg text-sm cursor-pointer 
  uppercase peer-checked:bg-white peer-checked:shadow-md transition"
                        >
                          {val}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* <p className="uppercase">test text</p> */}
                {/* PAPER */}
                <div className="space-y-2">
                  <p className="text-xs md:text-sm font-semibold text-gray-500">
                    PAPER
                  </p>
                  <div className="flex flex-wrap gap-2 bg-gray-100/70 p-1.5 rounded-xl shadow-inner">
                    {["A4", "Letter"].map((val) => (
                      <label key={val} className="flex-1 min-w-[90px]">
                        <input
                          type="radio"
                          value={val}
                          {...register("paperSize")}
                          className="hidden peer"
                        />
                        <div className="text-center py-2 rounded-lg text-sm cursor-pointer uppercase peer-checked:bg-white peer-checked:shadow-md transition">
                          {val}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* COPIES */}
                <div className="space-y-2">
                  <p className="text-xs md:text-sm font-semibold text-gray-500">
                    COPIES
                  </p>
                  <input
                    type="number"
                    min={1}
                    {...register("copies", { valueAsNumber: true })}
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 
        shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
                  />
                </div>

                {/* PAGES */}
                <div className="md:col-span-2 space-y-3">
                  <p className="text-xs md:text-sm font-semibold text-gray-500">
                    PAGES
                  </p>

                  {/* Toggle */}
                  <div className="flex flex-wrap gap-2 bg-gray-100/70 p-1.5 rounded-xl shadow-inner w-fit">
                    {["all", "custom"].map((val) => (
                      <label key={val}>
                        <input
                          type="radio"
                          value={val}
                          {...register("pagesType")}
                          className="hidden peer"
                        />
                        <div
                          className="px-4 py-2 rounded-lg text-sm cursor-pointer 
            peer-checked:bg-white peer-checked:shadow-md transition"
                        >
                          {val.charAt(0).toUpperCase() + val.slice(1)}
                        </div>
                      </label>
                    ))}
                  </div>

                  {pagesType === "custom" && (
                    <>
                      <input
                        type="text"
                        placeholder="1-5,8"
                        {...register("customPages")}
                        className="w-full md:w-1/2 bg-white border border-gray-200 rounded-xl px-3 py-2.5 
            shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
                      />

                      <div className="bg-gray-50 border rounded-xl p-3 max-h-[300px] overflow-y-auto">
                        <Document file={file}>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                            {Array.from(
                              { length: numPages },
                              (_, i) => i + 1,
                            ).map((pageNumber) => (
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
                    </>
                  )}

                  {pageError && (
                    <p className="text-red-500 text-xs">{pageError}</p>
                  )}
                </div>
              </div>

              {/* SUMMARY */}
              <div className="pt-4 border-t border-gray-200 bg-white">
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

// {pagesType === "custom" && (
//   <input
//     type="text"
//     placeholder="1-5,8"
//     {...register("customPages")}
//     className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
//   />
// )}

// {/* PAGE SELECTION (SCROLL ONLY HERE) */}
// {pagesType === "custom" && (
//   <div className="bg-white rounded-xl shadow p-4 flex-1 overflow-hidden flex flex-col">
//     <h3 className="font-medium mb-2">Select Pages</h3>

//     <div
//       ref={thumbnailsContainerRef}
//       onScroll={handleThumbnailsScroll}
//       className="flex-1 min-h-0 overflow-y-auto pr-2"
//     >
//       <Document file={file}>
//         {/* ✅ TOP PADDING (outside grid) */}
//         <div
//           style={{ height: virtualizedThumbnails.topPadding }}
//         />

//         {/* ✅ GRID CONTENT */}
//         <div className="grid grid-cols-4 gap-2">
//           {virtualizedThumbnails.visiblePages.map(
//             (pageNumber) => {
//               return (
//                 <Thumbnail
//                   key={pageNumber}
//                   pageNumber={pageNumber}
//                   selected={selectedPagesSet.has(pageNumber)}
//                   onClick={togglePage}
//                 />
//               );
//             },
//           )}
//         </div>

//         {/* ✅ BOTTOM PADDING (outside grid) */}
//         <div
//           style={{
//             height: virtualizedThumbnails.bottomPadding,
//           }}
//         />
//       </Document>
//     </div>
//   </div>
// )}

// right side part

// <div className="w-full lg:w-1/2">
//           {/* <div className="h-full bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 flex flex-col"> */}
//           <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-4 sm:p-6 flex flex-col">
//             {/* HEADER */}
//             <div className="mb-4">
//               <h2 className="text-lg font-semibold text-gray-800">
//                 Print Settings
//               </h2>
//               <p className="text-xs text-gray-500">
//                 Configure your preferences
//               </p>
//             </div>

//             {/* GRID SETTINGS (MULTI-COLUMN) */}
//             {/* <div className="grid grid-cols-2 gap-5 flex-1 content-start"> */}
//             {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 content-start"> */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               {/* COLOR */}
//               <div className="space-y-2">
//                 <p className="text-xs font-semibold text-gray-500">COLOR</p>
//                 {/* <div className="flex bg-gray-100/70 p-1 rounded-xl shadow-inner"> */}
//                 <div className="flex gap-2 bg-gray-100/70 p-1 rounded-xl shadow-inner">
//                   <label className="flex-1">
//                     <input
//                       type="radio"
//                       value="bw"
//                       {...register("color")}
//                       className="hidden peer"
//                     />
//                     <div className="text-center py-1.5 rounded-lg text-sm cursor-pointer peer-checked:bg-white peer-checked:shadow-md">
//                       BW
//                     </div>
//                   </label>
//                   <label className="flex-1">
//                     <input
//                       type="radio"
//                       value="color"
//                       {...register("color")}
//                       className="hidden peer"
//                     />
//                     <div className="text-center py-1.5 rounded-lg text-sm cursor-pointer peer-checked:bg-white peer-checked:shadow-md">
//                       Color
//                     </div>
//                   </label>
//                 </div>
//               </div>

//               {/* SIDES */}
//               <div className="space-y-2">
//                 <p className="text-xs font-semibold text-gray-500">SIDES</p>
//                 {/* <div className="flex bg-gray-100/70 p-1 rounded-xl shadow-inner"> */}
//                 <div className="flex gap-2 bg-gray-100/70 p-1 rounded-xl shadow-inner">
//                   <label className="flex-1">
//                     <input
//                       type="radio"
//                       value="single"
//                       {...register("sides")}
//                       className="hidden peer"
//                     />
//                     <div className="text-center py-1.5 rounded-lg text-sm cursor-pointer peer-checked:bg-white peer-checked:shadow-md">
//                       Single
//                     </div>
//                   </label>
//                   <label className="flex-1">
//                     <input
//                       type="radio"
//                       value="double"
//                       {...register("sides")}
//                       className="hidden peer"
//                     />
//                     <div className="text-center py-1.5 rounded-lg text-sm cursor-pointer peer-checked:bg-white peer-checked:shadow-md">
//                       Double
//                     </div>
//                   </label>
//                 </div>
//               </div>

//               {/* PAPER */}
//               <div className="space-y-2">
//                 <p className="text-xs font-semibold text-gray-500">PAPER</p>
//                 {/* <div className="flex bg-gray-100/70 p-1 rounded-xl shadow-inner"> */}
//                 <div className="flex gap-2 bg-gray-100/70 p-1 rounded-xl shadow-inner">
//                   <label className="flex-1">
//                     <input
//                       type="radio"
//                       value="A4"
//                       {...register("paperSize")}
//                       className="hidden peer"
//                     />
//                     <div className="text-center py-1.5 rounded-lg text-sm cursor-pointer peer-checked:bg-white peer-checked:shadow-md">
//                       A4
//                     </div>
//                   </label>
//                   <label className="flex-1">
//                     <input
//                       type="radio"
//                       value="Letter"
//                       {...register("paperSize")}
//                       className="hidden peer"
//                     />
//                     <div className="text-center py-1.5 rounded-lg text-sm cursor-pointer peer-checked:bg-white peer-checked:shadow-md">
//                       Letter
//                     </div>
//                   </label>
//                 </div>
//               </div>

//               {/* COPIES */}
//               <div className="space-y-2">
//                 <p className="text-xs font-semibold text-gray-500">COPIES</p>
//                 <input
//                   type="number"
//                   min={1}
//                   {...register("copies", { valueAsNumber: true })}
//                   className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
//                 />
//               </div>

//               {/* PAGES (FULL WIDTH) */}
//               <div className="col-span-2 space-y-2">
//                 <p className="text-xs font-semibold text-gray-500">PAGES</p>

//                 <div className="flex bg-gray-100/70 p-1 rounded-xl shadow-inner w-fit">
//                   <label>
//                     <input
//                       type="radio"
//                       value="all"
//                       {...register("pagesType")}
//                       className="hidden peer"
//                     />
//                     <div className="px-4 py-1.5 rounded-lg text-sm cursor-pointer peer-checked:bg-white peer-checked:shadow-md">
//                       All
//                     </div>
//                   </label>

//                   <label>
//                     <input
//                       type="radio"
//                       value="custom"
//                       {...register("pagesType")}
//                       className="hidden peer"
//                     />
//                     <div className="px-4 py-1.5 rounded-lg text-sm cursor-pointer peer-checked:bg-white peer-checked:shadow-md">
//                       Custom
//                     </div>
//                   </label>
//                 </div>

//                 {pagesType === "custom" && (
//                   <>
//                     {/* INPUT */}
//                     <input
//                       type="text"
//                       placeholder="1-5,8"
//                       {...register("customPages")}
//                       className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
//                     />

//                     {/* THUMBNAILS BELOW INPUT */}
//                     <div className="bg-gray-50 border rounded-xl p-3 max-h-64 sm:max-h-80 overflow-y-auto">
//                       <Document file={file}>
//                         <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
//                           {Array.from(
//                             { length: numPages },
//                             (_, i) => i + 1,
//                           ).map((pageNumber) => (
//                             <Thumbnail
//                               key={pageNumber}
//                               pageNumber={pageNumber}
//                               selected={selectedPagesSet.has(pageNumber)}
//                               onClick={togglePage}
//                             />
//                           ))}
//                         </div>
//                       </Document>
//                     </div>
//                   </>
//                 )}

//                 {pageError && (
//                   <p className="text-red-500 text-xs">{pageError}</p>
//                 )}
//               </div>
//             </div>

//             {/* SUMMARY */}
//             {/* <div className="mt-4 pt-4 border-t border-gray-200"> */}
//             <div className="mt-4 pt-4 border-t border-gray-200 stichky bottohm-0 bg-white">
//               <div className="flex justify-between text-sm text-gray-600">
//                 <span>Pages</span>
//                 <span>{pageCount}</span>
//               </div>

//               <div className="flex justify-between text-sm text-gray-600 mt-1">
//                 <span>Copies</span>
//                 <span>{copies}</span>
//               </div>

//               <div className="flex justify-between items-center mt-3">
//                 <span className="text-sm text-gray-500">Total</span>
//                 <span className="text-2xl font-bold text-blue-600">
//                   ₹{price}
//                 </span>
//               </div>

//               <button
//                 onClick={handleContinue}
//                 disabled={pageError || pageCount === 0 || loading}
//                 className={`mt-4 w-full py-3 rounded-xl font-semibold text-white transition-all
//               ${
//                 pageError || pageCount === 0
//                   ? "bg-gray-400"
//                   : "bg-linear-to-r from-blue-600 to-indigo-600 hover:opacity-95 active:scale-[0.98] shadow-lg"
//               }`}
//               >
//                 {loading ? "Processing..." : "Continue →"}
//               </button>
//               {apiError && (
//                 <p className="text-red-500 text-xs mt-2">{apiError}</p>
//               )}
//             </div>
//           </div>
//         </div>
