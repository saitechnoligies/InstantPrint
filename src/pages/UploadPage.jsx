import { useState, useRef, useCallback } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min?url";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/react";
import api from "../lib/api";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [pageCount, setPageCount] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const inputRef = useRef();
  const navigate = useNavigate();

  const { user } = useUser();

  // 📄 Read PDF
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
      setError("Failed to read PDF");
    }
  };

  // Drag
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

  const removeFile = () => {
    setFile(null);
    setPageCount(null);
    setProgress(0);
  };

  // 🚀 Upload with progress
  const uploadFile = async () => {
    if (!file) return;

    setUploading(true);
    setProgress(10);
    setError("");

    try {
      // 1️⃣ Create order
      let orderRes;
      try {
        orderRes = await api.post("/api/orders", {
          userId: user?.id || null,
        });
      } catch (err) {
        throw new Error(err.response?.data?.error || "Failed to create order");
      }

      const { orderId } = orderRes.data;
      setProgress(30);

      // 2️⃣ Get upload URL
      let uploadUrlRes;
      try {
        uploadUrlRes = await api.post(`/api/orders/${orderId}/upload-url`);
      } catch (err) {
        throw new Error(
          err.response?.data?.error || "Failed to get upload URL",
        );
      }

      const { uploadUrl, storageKey } = uploadUrlRes.data;

      if (!uploadUrl || !storageKey) {
        throw new Error("Invalid upload response");
      }

      // console.log("UPLOAD URL:", uploadUrl);

      setProgress(50);

      // 3️⃣ Upload file
      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        // headers: { "Content-Type": "application/pdf" },
      });

      // console.log("UPLOAD STATUS:", uploadRes.status);

      if (!uploadRes.ok) {
        throw new Error("File upload failed");
      }

      setProgress(80);
      // console.log({
      //   storageKey,
      //   fileName: file.name,
      //   fileSize: file.size,
      //   pageCount,
      // });

      // 4️⃣ Save metadata
      try {
        await api.post(`/api/orders/${orderId}/file`, {
          storageKey,
          fileName: file.name,
          fileSize: file.size,
          pageCount,
          mimeType: file.type,
        });
      } catch (err) {
        throw new Error(
          err.response?.data?.error || "Failed to save file metadata",
        );
      }

      setProgress(100);

      // ✅ 5️⃣ Navigate ONLY if everything succeeded
      navigate("/options", {
        state: { file, orderId, numPages: pageCount },
      });
    } catch (err) {
      console.error(err);
      setError(err.message || "Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-4">Upload your PDF</h1>

        {/* Dropzone */}
        <div
          onClick={() => !file && inputRef.current.click()}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition
          ${dragging ? "border-blue-500 bg-blue-50" : "border-gray-300"}
          ${file ? "bg-green-50 border-green-400" : ""}`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            hidden
            onChange={(e) => handleFile(e.target.files[0])}
          />

          {!file ? (
            <>
              <p className="font-medium">
                {dragging ? "Drop file here" : "Click or drag PDF"}
              </p>
              <p className="text-sm text-gray-500">PDF only • max 20MB</p>
            </>
          ) : (
            <>
              <p className="font-semibold">{file.name}</p>
              <p className="text-sm text-gray-500">{pageCount} pages</p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile();
                }}
                className="text-red-500 text-sm mt-2"
              >
                Remove
              </button>
            </>
          )}
        </div>

        {/* Progress Bar */}
        {uploading && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs mt-1 text-gray-500">
              Uploading... {progress}%
            </p>
          </div>
        )}

        {/* Error UI */}
        {error && (
          <div className="mt-3 text-sm text-red-600 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        {/* CTA */}
        <button
          disabled={!file || uploading}
          onClick={uploadFile}
          className={`mt-4 w-full py-2 rounded-lg font-medium transition
          ${
            file && !uploading
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {uploading ? "Uploading..." : "Upload & Continue"}
        </button>
      </div>
    </div>
  );
}
