// // // // import React, { useState } from "react";
// // // // import { Document, Page, pdfjs } from "react-pdf";
// // // // import "react-pdf/dist/Page/TextLayer.css";
// // // // import "react-pdf/dist/Page/AnnotationLayer.css";

// // // // import worker from "pdfjs-dist/build/pdf.worker.min?url";

// // // // pdfjs.GlobalWorkerOptions.workerSrc = worker;

// // // // function UploadPage() {
// // // //   const [file, setFile] = useState(null);
// // // //   const [numPages, setNumPages] = useState(null);

// // // //   const handleFileChange = (e) => {
// // // //     const selectedFile = e.target.files[0];

// // // //     if (selectedFile && selectedFile.type === "application/pdf") {
// // // //       setFile(selectedFile);
// // // //     } else {
// // // //       alert("Please upload a PDF file");
// // // //     }
// // // //   };

// // // //   const onDocumentLoadSuccess = ({ numPages }) => {
// // // //     setNumPages(numPages);
// // // //   };

// // // //   return (
// // // //     <div>
// // // //       <h2>Upload PDF</h2>

// // // //       <input type="file" accept="application/pdf" onChange={handleFileChange} />

// // // //       {file && (
// // // //         <>
// // // //           <p>File: {file.name}</p>

// // // //           <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
// // // //             <Page
// // // //               pageNumber={1}
// // // //               width={400}
// // // //               renderTextLayer={false}
// // // //               renderAnnotationLayer={false}
// // // //             />
// // // //           </Document>

// // // //           {numPages && <p>Total Pages: {numPages}</p>}
// // // //         </>
// // // //       )}
// // // //     </div>
// // // //   );
// // // // }

// // // // export default UploadPage;

// // // import React, { useState } from "react";
// // // import { Document, Page, pdfjs } from "react-pdf";
// // // import "react-pdf/dist/Page/TextLayer.css";
// // // import "react-pdf/dist/Page/AnnotationLayer.css";

// // // import worker from "pdfjs-dist/build/pdf.worker.min?url";

// // // pdfjs.GlobalWorkerOptions.workerSrc = worker;

// // // function UploadPage() {
// // //   const [file, setFile] = useState(null);
// // //   const [numPages, setNumPages] = useState(null);
// // //   const [orderId, setOrderId] = useState(null);

// // //   const handleFileChange = (e) => {
// // //     const selectedFile = e.target.files[0];

// // //     if (selectedFile && selectedFile.type === "application/pdf") {
// // //       setFile(selectedFile);
// // //     } else {
// // //       alert("Please upload a PDF file");
// // //     }
// // //   };

// // //   const onDocumentLoadSuccess = ({ numPages }) => {
// // //     setNumPages(numPages);
// // //   };

// // //   const uploadFile = async () => {
// // //     if (!file || !numPages) {
// // //       alert("Select file first");
// // //       return;
// // //     }

// // //     try {
// // //       /* STEP 1: Create order */
// // //       const orderRes = await fetch("http://localhost:3000/api/orders", {
// // //         method: "POST",
// // //       });

// // //       if (!orderRes.ok) {
// // //         throw new Error("Failed to create order");
// // //       }

// // //       const orderData = await orderRes.json();
// // //       const orderId = orderData.orderId;

// // //       setOrderId(orderId);

// // //       /* STEP 2: Get upload URL */
// // //       const uploadUrlRes = await fetch(
// // //         `http://localhost:3000/api/orders/${orderId}/upload-url`,
// // //         {
// // //           method: "POST",
// // //         },
// // //       );

// // //       const uploadData = await uploadUrlRes.json();

// // //       const { uploadUrl, storageKey } = uploadData;

// // //       /* STEP 3: Upload to MinIO/S3 */
// // //       await fetch(uploadUrl, {
// // //         method: "PUT",
// // //         body: file,
// // //         headers: {
// // //           "Content-Type": "application/pdf",
// // //         },
// // //       });

// // //       /* STEP 4: Confirm upload */
// // //       await fetch(`http://localhost:3000/api/orders/${orderId}/file`, {
// // //         method: "POST",
// // //         headers: {
// // //           "Content-Type": "application/json",
// // //         },
// // //         body: JSON.stringify({
// // //           storageKey,
// // //           fileName: file.name,
// // //           fileSize: file.size,
// // //           pageCount: numPages,
// // //           mimeType: file.type,
// // //         }),
// // //       });

// // //       alert("Upload successful!");
// // //     } catch (err) {
// // //       console.error(err);
// // //       alert("Upload failed");
// // //     }
// // //   };

// // //   return (
// // //     <div>
// // //       <h2>Upload PDF</h2>

// // //       <input type="file" accept="application/pdf" onChange={handleFileChange} />

// // //       {file && (
// // //         <>
// // //           <p>File: {file.name}</p>

// // //           <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
// // //             <Page
// // //               pageNumber={1}
// // //               width={400}
// // //               renderTextLayer={false}
// // //               renderAnnotationLayer={false}
// // //             />
// // //           </Document>

// // //           {numPages && <p>Total Pages: {numPages}</p>}

// // //           <button onClick={uploadFile}>Upload</button>
// // //         </>
// // //       )}

// // //       {orderId && <p>Order ID: {orderId}</p>}
// // //     </div>
// // //   );
// // // }

// // // export default UploadPage;

// // // import React, { useState } from "react";
// // // import { Document, Page, pdfjs } from "react-pdf";
// // // import "react-pdf/dist/Page/TextLayer.css";
// // // import "react-pdf/dist/Page/AnnotationLayer.css";

// // // import worker from "pdfjs-dist/build/pdf.worker.min?url";

// // // pdfjs.GlobalWorkerOptions.workerSrc = worker;

// // // function UploadPage() {
// // //   const [file, setFile] = useState(null);
// // //   const [numPages, setNumPages] = useState(null);
// // //   const [orderId, setOrderId] = useState(null);

// // //   const handleFileChange = (e) => {
// // //     const selectedFile = e.target.files[0];

// // //     if (selectedFile && selectedFile.type === "application/pdf") {
// // //       setFile(selectedFile);
// // //     } else {
// // //       alert("Please upload a PDF file");
// // //     }
// // //   };

// // //   const removeFile = () => {
// // //     setFile(null);
// // //     setNumPages(null);
// // //     setOrderId(null);
// // //   };

// // //   const onDocumentLoadSuccess = ({ numPages }) => {
// // //     setNumPages(numPages);
// // //   };

// // //   const uploadFile = async () => {
// // //     if (!file || !numPages) {
// // //       alert("Select file first");
// // //       return;
// // //     }

// // //     try {
// // //       const orderRes = await fetch("http://localhost:3000/api/orders", {
// // //         method: "POST",
// // //       });

// // //       if (!orderRes.ok) {
// // //         throw new Error("Failed to create order");
// // //       }

// // //       const orderData = await orderRes.json();
// // //       const orderId = orderData.orderId;

// // //       setOrderId(orderId);

// // //       const uploadUrlRes = await fetch(
// // //         `http://localhost:3000/api/orders/${orderId}/upload-url`,
// // //         { method: "POST" }
// // //       );

// // //       const uploadData = await uploadUrlRes.json();
// // //       const { uploadUrl, storageKey } = uploadData;

// // //       await fetch(uploadUrl, {
// // //         method: "PUT",
// // //         body: file,
// // //         headers: {
// // //           "Content-Type": "application/pdf",
// // //         },
// // //       });

// // //       await fetch(`http://localhost:3000/api/orders/${orderId}/file`, {
// // //         method: "POST",
// // //         headers: {
// // //           "Content-Type": "application/json",
// // //         },
// // //         body: JSON.stringify({
// // //           storageKey,
// // //           fileName: file.name,
// // //           fileSize: file.size,
// // //           pageCount: numPages,
// // //           mimeType: file.type,
// // //         }),
// // //       });

// // //       alert("Upload successful!");
// // //     } catch (err) {
// // //       console.error(err);
// // //       alert("Upload failed");
// // //     }
// // //   };

// // //   return (
// // //     <div style={styles.container}>
// // //       <h2 style={styles.title}>Upload PDF</h2>

// // //       {!file && (
// // //         <input
// // //           type="file"
// // //           accept="application/pdf"
// // //           onChange={handleFileChange}
// // //           style={styles.input}
// // //         />
// // //       )}

// // //       {file && (
// // //         <div style={styles.previewBox}>
// // //           <p style={styles.fileName}>📄 {file.name}</p>

// // //           <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
// // //             <Page
// // //               pageNumber={1}
// // //               width={350}
// // //               renderTextLayer={false}
// // //               renderAnnotationLayer={false}
// // //             />
// // //           </Document>

// // //           {numPages && <p>Total Pages: {numPages}</p>}

// // //           <div style={styles.buttonRow}>
// // //             <button style={styles.uploadBtn} onClick={uploadFile}>
// // //               Upload
// // //             </button>

// // //             <button style={styles.removeBtn} onClick={removeFile}>
// // //               Remove
// // //             </button>
// // //           </div>
// // //         </div>
// // //       )}

// // //       {orderId && <p style={styles.order}>Order ID: {orderId}</p>}
// // //     </div>
// // //   );
// // // }

// // // const styles = {
// // //   container: {
// // //     maxWidth: "500px",
// // //     margin: "40px auto",
// // //     padding: "25px",
// // //     border: "1px solid #ddd",
// // //     borderRadius: "10px",
// // //     textAlign: "center",
// // //     fontFamily: "Arial",
// // //   },
// // //   title: {
// // //     marginBottom: "20px",
// // //   },
// // //   input: {
// // //     marginBottom: "20px",
// // //   },
// // //   previewBox: {
// // //     border: "1px solid #eee",
// // //     padding: "15px",
// // //     borderRadius: "8px",
// // //     background: "#fafafa",
// // //   },
// // //   fileName: {
// // //     fontWeight: "bold",
// // //     marginBottom: "10px",
// // //   },
// // //   buttonRow: {
// // //     marginTop: "15px",
// // //     display: "flex",
// // //     justifyContent: "center",
// // //     gap: "10px",
// // //   },
// // //   uploadBtn: {
// // //     background: "#4CAF50",
// // //     color: "white",
// // //     border: "none",
// // //     padding: "10px 18px",
// // //     borderRadius: "6px",
// // //     cursor: "pointer",
// // //   },
// // //   removeBtn: {
// // //     background: "#f44336",
// // //     color: "white",
// // //     border: "none",
// // //     padding: "10px 18px",
// // //     borderRadius: "6px",
// // //     cursor: "pointer",
// // //   },
// // //   order: {
// // //     marginTop: "15px",
// // //     fontWeight: "bold",
// // //   },
// // // };

// // // export default UploadPage;

// // import React, { useState } from "react";
// // import { Document, Page, pdfjs } from "react-pdf";
// // import { useNavigate } from "react-router-dom";
// // import "react-pdf/dist/Page/TextLayer.css";
// // import "react-pdf/dist/Page/AnnotationLayer.css";

// // import worker from "pdfjs-dist/build/pdf.worker.min?url";

// // pdfjs.GlobalWorkerOptions.workerSrc = worker;

// // function UploadPage() {
// //   const [file, setFile] = useState(null);
// //   const [numPages, setNumPages] = useState(null);
// //   const [orderId, setOrderId] = useState(null);

// //   const navigate = useNavigate();

// //   const handleFileChange = (e) => {
// //     const selectedFile = e.target.files[0];

// //     if (selectedFile && selectedFile.type === "application/pdf") {
// //       setFile(selectedFile);
// //     } else {
// //       alert("Please upload a PDF file");
// //     }
// //   };

// //   const removeFile = () => {
// //     setFile(null);
// //     setNumPages(null);
// //     setOrderId(null);
// //   };

// //   const onDocumentLoadSuccess = ({ numPages }) => {
// //     setNumPages(numPages);
// //   };

// //   const uploadFile = async () => {
// //     if (!file || !numPages) {
// //       alert("Select file first");
// //       return;
// //     }

// //     try {
// //       const orderRes = await fetch("http://localhost:3000/api/orders", {
// //         method: "POST",
// //       });

// //       if (!orderRes.ok) {
// //         throw new Error("Failed to create order");
// //       }

// //       const orderData = await orderRes.json();
// //       const createdOrderId = orderData.orderId;

// //       setOrderId(createdOrderId);

// //       const uploadUrlRes = await fetch(
// //         `http://localhost:3000/api/orders/${createdOrderId}/upload-url`,
// //         { method: "POST" }
// //       );

// //       const uploadData = await uploadUrlRes.json();
// //       const { uploadUrl, storageKey } = uploadData;

// //       await fetch(uploadUrl, {
// //         method: "PUT",
// //         body: file,
// //         headers: {
// //           "Content-Type": "application/pdf",
// //         },
// //       });

// //       await fetch(`http://localhost:3000/api/orders/${createdOrderId}/file`, {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify({
// //           storageKey,
// //           fileName: file.name,
// //           fileSize: file.size,
// //           pageCount: numPages,
// //           mimeType: file.type,
// //         }),
// //       });

// //       // Navigate to options page with data
// //       navigate("/options", {
// //         state: {
// //           file,
// //           orderId: createdOrderId,
// //           numPages,
// //         },
// //       });

// //     } catch (err) {
// //       console.error(err);
// //       alert("Upload failed");
// //     }
// //   };

// //   return (
// //     <div style={styles.container}>
// //       <h2 style={styles.title}>Upload PDF</h2>

// //       {!file && (
// //         <input
// //           type="file"
// //           accept="application/pdf"
// //           onChange={handleFileChange}
// //           style={styles.input}
// //         />
// //       )}

// //       {file && (
// //         <div style={styles.previewBox}>
// //           <p style={styles.fileName}>📄 {file.name}</p>

// //           <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
// //             <Page
// //               pageNumber={1}
// //               width={350}
// //               renderTextLayer={false}
// //               renderAnnotationLayer={false}
// //             />
// //           </Document>

// //           {numPages && <p>Total Pages: {numPages}</p>}

// //           <div style={styles.buttonRow}>
// //             <button style={styles.uploadBtn} onClick={uploadFile}>
// //               Upload
// //             </button>

// //             <button style={styles.removeBtn} onClick={removeFile}>
// //               Remove
// //             </button>
// //           </div>
// //         </div>
// //       )}

// //       {orderId && <p style={styles.order}>Order ID: {orderId}</p>}
// //     </div>
// //   );
// // }

// // const styles = {
// //   container: {
// //     maxWidth: "500px",
// //     margin: "40px auto",
// //     padding: "25px",
// //     border: "1px solid #ddd",
// //     borderRadius: "10px",
// //     textAlign: "center",
// //     fontFamily: "Arial",
// //   },
// //   title: {
// //     marginBottom: "20px",
// //   },
// //   input: {
// //     marginBottom: "20px",
// //   },
// //   previewBox: {
// //     border: "1px solid #eee",
// //     padding: "15px",
// //     borderRadius: "8px",
// //     background: "#fafafa",
// //   },
// //   fileName: {
// //     fontWeight: "bold",
// //     marginBottom: "10px",
// //   },
// //   buttonRow: {
// //     marginTop: "15px",
// //     display: "flex",
// //     justifyContent: "center",
// //     gap: "10px",
// //   },
// //   uploadBtn: {
// //     background: "#4CAF50",
// //     color: "white",
// //     border: "none",
// //     padding: "10px 18px",
// //     borderRadius: "6px",
// //     cursor: "pointer",
// //   },
// //   removeBtn: {
// //     background: "#f44336",
// //     color: "white",
// //     border: "none",
// //     padding: "10px 18px",
// //     borderRadius: "6px",
// //     cursor: "pointer",
// //   },
// //   order: {
// //     marginTop: "15px",
// //     fontWeight: "bold",
// //   },
// // };

// // export default UploadPage;

// import { useState, useRef, useCallback } from "react";
// import * as pdfjsLib from "pdfjs-dist";
// import pdfWorker from "pdfjs-dist/build/pdf.worker.min?url";
// import { useNavigate } from "react-router-dom";

// pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

// export default function UploadPage() {
//   const [dragging, setDragging] = useState(false);
//   const [file, setFile] = useState(null);
//   const [pageCount, setPageCount] = useState(null);
//   const [orderId, setOrderId] = useState(null);

//   const inputRef = useRef();
//   const navigate = useNavigate();

//   // 📄 Handle file + extract pages
//   const handleFile = async (f) => {
//     if (!f || f.type !== "application/pdf") {
//       alert("Only PDF allowed");
//       return;
//     }

//     try {
//       const arrayBuffer = await f.arrayBuffer();
//       const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

//       setFile(f);
//       setPageCount(pdf.numPages);
//     } catch (err) {
//       console.error("PDF read error:", err);
//     }
//   };

//   // 🎯 Drag & drop
//   const onDrop = useCallback((e) => {
//     e.preventDefault();
//     setDragging(false);
//     handleFile(e.dataTransfer.files[0]);
//   }, []);

//   const onDragOver = (e) => {
//     e.preventDefault();
//     setDragging(true);
//   };

//   const onDragLeave = () => setDragging(false);

//   // ❌ Remove file
//   const removeFile = () => {
//     setFile(null);
//     setPageCount(null);
//     setOrderId(null);
//   };

//   // 🚀 Upload logic (from first code)
//   const uploadFile = async () => {
//     if (!file || !pageCount) {
//       alert("Select file first");
//       return;
//     }

//     try {
//       // 1️⃣ Create order
//       const orderRes = await fetch("http://localhost:3000/api/orders", {
//         method: "POST",
//       });

//       if (!orderRes.ok) throw new Error("Order creation failed");

//       const orderData = await orderRes.json();
//       const createdOrderId = orderData.orderId;
//       setOrderId(createdOrderId);

//       // 2️⃣ Get upload URL
//       const uploadUrlRes = await fetch(
//         `http://localhost:3000/api/orders/${createdOrderId}/upload-url`,
//         { method: "POST" },
//       );

//       const { uploadUrl, storageKey } = await uploadUrlRes.json();

//       // 3️⃣ Upload file to storage (S3 etc.)
//       await fetch(uploadUrl, {
//         method: "PUT",
//         body: file,
//         headers: {
//           "Content-Type": "application/pdf",
//         },
//       });

//       // 4️⃣ Save metadata
//       await fetch(`http://localhost:3000/api/orders/${createdOrderId}/file`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           storageKey,
//           fileName: file.name,
//           fileSize: file.size,
//           pageCount,
//           mimeType: file.type,
//         }),
//       });

//       // 5️⃣ Navigate
//       navigate("/options", {
//         state: {
//           file,
//           orderId: createdOrderId,
//           numPages: pageCount,
//         },
//       });
//     } catch (err) {
//       console.error(err);
//       alert("Upload failed");
//     }
//   };

//   return (
//     <>
//       {/* KEEP YOUR EXISTING CSS FROM SECOND FILE HERE (unchanged) */}
//       <style>{`
// @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Outfit:wght@300;400;500;600&display=swap');

// .upload-root {
//   min-height: 100vh;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   padding: 74px 1.25rem;
//   background: #f0ede8;
//   font-family: 'Outfit', sans-serif;
// }

// .card {
//   background: #fff;
//   border-radius: 24px;
//   padding: 1.75rem 2rem;
//   width: 100%;
//   max-width: 440px;
//   box-shadow: 0 16px 40px rgba(0,0,0,0.07);
// }

// .headline {
//   font-family: 'Playfair Display', serif;
//   font-size: 1.6rem;
//   margin-bottom: 1rem;
// }

// .drop-zone {
//   border-radius: 14px;
//   border: 2px dashed #cbd5e1;
//   background: #f8fafc;
//   padding: 1.5rem;
//   text-align: center;
//   cursor: pointer;
//   transition: 0.2s;
// }

// .drop-zone.dragging {
//   border-color: #2563eb;
//   background: #eff6ff;
// }

// .drop-zone.has-file {
//   border-style: solid;
//   border-color: #6ee7b7;
//   background: #f0fdf4;
// }

// .drop-label {
//   font-weight: 600;
//   color: #1e293b;
// }

// .drop-hint {
//   font-size: 0.75rem;
//   color: #94a3b8;
// }

// .file-name {
//   font-weight: 600;
//   margin-bottom: 6px;
// }

// .file-meta {
//   display: flex;
//   justify-content: center;
//   gap: 8px;
//   font-size: 0.75rem;
// }

// .file-meta-tag {
//   background: #f1f5f9;
//   border-radius: 100px;
//   padding: 3px 10px;
// }

// .remove-btn {
//   margin-top: 8px;
//   background: none;
//   border: none;
//   font-size: 0.75rem;
//   color: #ef4444;
//   cursor: pointer;
// }

// .cta-btn {
//   margin-top: 1rem;
//   width: 100%;
//   padding: 0.8rem;
//   border-radius: 12px;
//   border: none;
//   font-weight: 600;
//   cursor: pointer;
// }

// .cta-btn.enabled {
//   background: #2563eb;
//   color: white;
// }

// .cta-btn.disabled {
//   background: #e5e7eb;
//   color: #9ca3af;
//   cursor: not-allowed;
// }
// `}</style>

//       <div className="upload-root">
//         <div className="card">
//           <h1 className="headline">Upload your PDF</h1>

//           <div
//             className={`drop-zone${dragging ? " dragging" : ""}${
//               file ? " has-file" : ""
//             }`}
//             onClick={() => !file && inputRef.current.click()}
//             onDrop={onDrop}
//             onDragOver={onDragOver}
//             onDragLeave={onDragLeave}
//           >
//             <input
//               ref={inputRef}
//               type="file"
//               accept="application/pdf"
//               style={{ display: "none" }}
//               onChange={(e) => handleFile(e.target.files[0])}
//             />

//             {!file ? (
//               <>
//                 <p className="drop-label">
//                   {dragging ? "Release to upload" : "Drop your PDF here"}
//                 </p>
//                 <p className="drop-hint">or click to browse</p>
//               </>
//             ) : (
//               <>
//                 <p className="file-name">{file.name}</p>

//                 <div className="file-meta">
//                   <span className="file-meta-tag">PDF</span>
//                   <span className="file-meta-tag">{pageCount} pages</span>
//                 </div>

//                 <button
//                   className="remove-btn"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     removeFile();
//                   }}
//                 >
//                   × Remove file
//                 </button>
//               </>
//             )}
//           </div>

//           {/* 🔥 Upload Button replaces onContinue */}
//           <button
//             className={`cta-btn ${file ? "enabled" : "disabled"}`}
//             disabled={!file}
//             onClick={uploadFile}
//           >
//             Upload & Continue
//           </button>

//           {orderId && (
//             <p style={{ marginTop: "10px", fontWeight: "bold" }}>
//               Order ID: {orderId}
//             </p>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }

import { useState, useRef, useCallback } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min?url";
import { useNavigate } from "react-router-dom";

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
      const orderRes = await fetch("http://localhost:3000/api/orders", {
        method: "POST",
      });
      const { orderId } = await orderRes.json();

      setProgress(30);

      // 2️⃣ Get upload URL
      const uploadUrlRes = await fetch(
        `http://localhost:3000/api/orders/${orderId}/upload-url`,
        { method: "POST" },
      );

      const { uploadUrl, storageKey } = await uploadUrlRes.json();

      setProgress(50);

      // 3️⃣ Upload file (simulate progress chunks)
      await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": "application/pdf" },
      });

      setProgress(80);

      // 4️⃣ Save metadata
      await fetch(`http://localhost:3000/api/orders/${orderId}/file`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storageKey,
          fileName: file.name,
          fileSize: file.size,
          pageCount,
          mimeType: file.type,
        }),
      });

      setProgress(100);

      // 5️⃣ Navigate
      setTimeout(() => {
        navigate("/options", {
          state: { file, orderId, numPages: pageCount },
        });
      }, 500);
    } catch (err) {
      console.error(err);
      setError("Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
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
