// // // import React from "react";
// // // import { useLocation, useNavigate } from "react-router-dom";
// // // import { SignInButton, useUser } from "@clerk/react";
// // // import { useEffect } from "react";

// // // export default function SuccessPage() {
// // //   const { state } = useLocation();
// // //   const navigate = useNavigate();
// // //   const orderId = state?.orderData?.orderId;

// // //   const orderData = state?.orderData;
// // //   const { isSignedIn } = useUser();

// // //   useEffect(() => {
// // //     if (isSignedIn && orderId) {
// // //       api.post(`/api/orders/${orderId}/attach-user`, null, {
// // //         method: "POST",
// // //         credentials: "include", // 🔥 REQUIRED
// // //       });
// // //     }
// // //   }, [isSignedIn, orderId]);

// // //   /* ---------- SAFETY (refresh / direct access) ---------- */
// // //   if (!orderData) {
// // //     return (
// // //       <div className="min-h-screen flex items-center justify-center text-gray-600">
// // //         Invalid access. Please start again.
// // //       </div>
// // //     );
// // //   }

// // //   const otp = orderData.otp;

// // //   return (
// // //     <div className="bg-gray-100 py-6 sm:py-10 px-4 w-full">
// // //       <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md mx-auto text-center">
// // //         {/* SUCCESS */}
// // //         <h2 className="text-2xl font-semibold text-green-600 mb-2">
// // //           Payment Successful
// // //         </h2>

// // //         <p className="text-gray-600 mb-6">
// // //           Your order has been confirmed. Use the OTP below to collect your
// // //           print.
// // //         </p>

// // //         {/* OTP */}
// // //         <div className="mb-6">
// // //           <p className="text-sm text-gray-500 mb-2">Collection OTP</p>

// // //           <div className="flex justify-center gap-3">
// // //             {otp.split("").map((digit, i) => (
// // //               <div
// // //                 key={i}
// // //                 className="w-12 h-14 flex items-center justify-center text-2xl font-bold border rounded-lg bg-blue-50 text-blue-600"
// // //               >
// // //                 {digit}
// // //               </div>
// // //             ))}
// // //           </div>

// // //           <p className="text-xs text-gray-400 mt-2">Valid for 10 minutes</p>
// // //         </div>

// // //         {/* ORDER SUMMARY */}
// // //         <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 mb-6">
// // //           <p>
// // //             <b>Order ID:</b> {orderData.orderId}
// // //           </p>
// // //           <p>
// // //             <b>Pages:</b> {orderData?.printOptions?.selectedPages}
// // //           </p>
// // //           <p>
// // //             <b>Copies:</b> {orderData?.printOptions?.copies}
// // //           </p>
// // //           <p>
// // //             <b>Total Paid:</b> ₹{orderData?.price?.total}
// // //           </p>
// // //         </div>

// // //         {/* INSTRUCTION */}
// // //         <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700 mb-6">
// // //           Show this OTP at the print shop to collect your documents.
// // //         </div>

// // //         {/* ACTION */}
// // //         <button
// // //           onClick={() => navigate("/")}
// // //           className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
// // //         >
// // //           Print Another Document
// // //         </button>
// // //       </div>
// // //       {!isSignedIn && (
// // //         <div className="mt-6 p-4 border rounded-xl bg-blue-50">
// // //           <p className="text-sm text-gray-700 mb-2">
// // //             Login to get refund if not printed within 24 hours
// // //           </p>

// // //           <SignInButton mode="modal">
// // //             <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
// // //               Login & Save Order
// // //             </button>
// // //           </SignInButton>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // }

// // import React, { useEffect } from "react";
// // import { useLocation, useNavigate, useParams } from "react-router-dom";
// // import { SignInButton, Show, useUser, useAuth } from "@clerk/react";

// // export default function SuccessPage() {
// //   const { getToken } = useAuth();

// //   const navigate = useNavigate();

// //   const { orderId } = useParams();

// //   const { isSignedIn, user } = useUser();

// //   /* ---------- ATTACH ORDER AFTER LOGIN ---------- */

// //   useEffect(() => {
// //     const attachUser = async () => {
// //       if (isSignedIn && user && orderId) {
// //         const token = await getToken();

// //         await api.post(`/api/orders/${orderId}/attach-user`, null, {
// //           method: "POST",
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //           },
// //         });
// //       }
// //     };

// //     attachUser();
// //   }, [isSignedIn, user, orderId]);
// //   /* ---------- SAFETY (refresh / direct access) ---------- */
// //   if (!orderId) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center text-gray-600">
// //         Invalid access. Please start again.
// //       </div>
// //     );
// //   }

// //   const otp = orderData.otp;

// //   return (
// //     <div className="bg-gray-100 py-6 sm:py-10 px-4 w-full">
// //       <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md mx-auto text-center">
// //         {/* SUCCESS */}
// //         <h2 className="text-2xl font-semibold text-green-600 mb-2">
// //           Payment Successful
// //         </h2>

// //         <p className="text-gray-600 mb-6">
// //           Your order has been confirmed. Use the OTP below to collect your
// //           print.
// //         </p>

// //         {/* OTP */}
// //         <div className="mb-6">
// //           <p className="text-sm text-gray-500 mb-2">Collection OTP</p>

// //           <div className="flex justify-center gap-3">
// //             {otp.split("").map((digit, i) => (
// //               <div
// //                 key={i}
// //                 className="w-12 h-14 flex items-center justify-center text-2xl font-bold border rounded-lg bg-blue-50 text-blue-600"
// //               >
// //                 {digit}
// //               </div>
// //             ))}
// //           </div>

// //           <p className="text-xs text-gray-400 mt-2">Valid for 10 minutes</p>
// //         </div>

// //         {/* ORDER SUMMARY */}
// //         <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 mb-6">
// //           <p>
// //             <b>Order ID:</b> {orderData.orderId}
// //           </p>
// //           <p>
// //             <b>Pages:</b> {orderData?.printOptions?.selectedPages}
// //           </p>
// //           <p>
// //             <b>Copies:</b> {orderData?.printOptions?.copies}
// //           </p>
// //           <p>
// //             <b>Total Paid:</b> ₹{orderData?.price?.total}
// //           </p>
// //         </div>

// //         {/* INSTRUCTION */}
// //         <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700 mb-6">
// //           Show this OTP at the print shop to collect your documents.
// //         </div>

// //         {/* 🔥 LOGIN CTA (FIXED) */}
// //         <Show when="signed-out">
// //           <div className="mt-6 p-4 border rounded-xl bg-blue-50">
// //             <p className="text-sm text-gray-700 mb-2">
// //               Login to get refund if not printed within 24 hours
// //             </p>

// //             <SignInButton mode="modal">
// //               <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
// //                 Login & Save Order
// //               </button>
// //             </SignInButton>
// //           </div>
// //         </Show>

// //         {/* ACTION */}
// //         <button
// //           onClick={() => navigate("/")}
// //           className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
// //         >
// //           Print Another Document
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }

// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { SignInButton, Show, useUser, useAuth } from "@clerk/react";

// export default function SuccessPage() {
//   const navigate = useNavigate();
//   const { orderId } = useParams();

//   const { isSignedIn, user } = useUser();
//   const { getToken } = useAuth();

//   const [orderData, setOrderData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   /* ---------- FETCH ORDER ---------- */
//   useEffect(() => {
//     const fetchOrder = async () => {
//       try {
//         const res = await api.get(`/api/orders/${orderId}`);

//         const data = await res.json();

//         if (!res.ok) throw new Error(data.error);

//         setOrderData(data);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (orderId) fetchOrder();
//   }, [orderId]);

//   /* ---------- ATTACH ORDER AFTER LOGIN ---------- */
//   useEffect(() => {
//     const attachUser = async () => {
//       if (isSignedIn && user && orderId) {
//         try {
//           const token = await getToken();

//           await api.post(
//             `/api/orders/${orderId}/attach-user`,
//             {
//               method: "POST",
//               headers: {
//                 Authorization: `Bearer ${token}`,
//               },
//             },
//           );
//         } catch (err) {
//           console.error("Attach failed:", err);
//         }
//       }
//     };

//     attachUser();
//   }, [isSignedIn, user, orderId]);

//   /* ---------- STATES ---------- */

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         Loading order...
//       </div>
//     );
//   }

//   if (!orderData) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-red-500">
//         Order not found or expired
//       </div>
//     );
//   }

//   const otp = orderData.otp || "------";

//   /* ---------- UI ---------- */

//   return (
//     <div className="bg-gray-100 py-6 sm:py-10 px-4 w-full">
//       <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md mx-auto text-center">
//         <h2 className="text-2xl font-semibold text-green-600 mb-2">
//           Payment Successful
//         </h2>

//         <p className="text-gray-600 mb-6">
//           Your order has been confirmed. Use the OTP below to collect your
//           print.
//         </p>

//         {/* OTP */}
//         <div className="mb-6">
//           <p className="text-sm text-gray-500 mb-2">Collection OTP</p>

//           <div className="flex justify-center gap-3">
//             {otp.split("").map((digit, i) => (
//               <div
//                 key={i}
//                 className="w-12 h-14 flex items-center justify-center text-2xl font-bold border rounded-lg bg-blue-50 text-blue-600"
//               >
//                 {digit}
//               </div>
//             ))}
//           </div>

//           <p className="text-xs text-gray-400 mt-2">Valid for 10 minutes</p>
//         </div>

//         {/* ORDER SUMMARY */}
//         <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 mb-6">
//           <p>
//             <b>Order ID:</b> {orderData.orderId}
//           </p>
//           <p>
//             <b>Pages:</b> {orderData.printOptions?.selectedPages}
//           </p>
//           <p>
//             <b>Copies:</b> {orderData.printOptions?.copies}
//           </p>
//           <p>
//             <b>Total Paid:</b> ₹{orderData.price?.total}
//           </p>
//         </div>

//         {/* LOGIN CTA */}
//         <Show when="signed-out">
//           <div className="mt-6 p-4 border rounded-xl bg-blue-50">
//             <p className="text-sm text-gray-700 mb-2">
//               Login to claim your order & enable refunds
//             </p>

//             <SignInButton mode="modal">
//               <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
//                 Login & Save Order
//               </button>
//             </SignInButton>
//           </div>
//         </Show>

//         {/* ACTION */}
//         <button
//           onClick={() => navigate("/")}
//           className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
//         >
//           Print Another Document
//         </button>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SignInButton, Show, useUser, useAuth } from "@clerk/react";
import api from "../lib/api";

export default function SuccessPage() {
  const navigate = useNavigate();
  const { orderId } = useParams();

  const { isSignedIn, user } = useUser();
  const { getToken } = useAuth();

  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [attached, setAttached] = useState(false);
  const [attachStatus, setAttachStatus] = useState(null);

  /* ---------- FETCH ORDER ---------- */
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/api/orders/${orderId}`);

        setOrderData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchOrder();
  }, [orderId]);

  /* ---------- ATTACH ORDER AFTER LOGIN ---------- */
  useEffect(() => {
    const attachUser = async () => {
      if (
        isSignedIn &&
        user?.id &&
        orderId &&
        !attached &&
        !orderData?.isLinked
      ) {
        try {
          const token = await getToken();

          const { data } = await api.post(
            `/api/orders/${orderId}/attach-user`,
            null,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          if (data.isNewlyLinked) {
            setAttachStatus("Order saved to your account ✅");
          }
          if (data.attached) {
            setAttached(true);
          }
        } catch (err) {
          console.error("Attach failed:", err);
        }
      }
    };

    attachUser();
  }, [isSignedIn, user?.id, orderId, attached, orderData, getToken]);
  /* ---------- STATES ---------- */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading order...
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Order not found or expired
      </div>
    );
  }

  const otp = orderData.otp || "------";

  /* ---------- UI ---------- */

  return (
    <div className="bg-gray-100 py-6 sm:py-10 px-4 w-full">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md mx-auto text-center">
        {/* SUCCESS */}
        <h2 className="text-2xl font-semibold text-green-600 mb-2">
          Payment Successful
        </h2>

        <p className="text-gray-600 mb-6">
          Your order has been confirmed. Use the OTP below to collect your
          print.
        </p>

        {/* OTP */}
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-2">Collection OTP</p>

          <div className="flex justify-center gap-3">
            {otp.split("").map((digit, i) => (
              <div
                key={i}
                className="w-12 h-14 flex items-center justify-center text-2xl font-bold border rounded-lg bg-blue-50 text-blue-600"
              >
                {digit}
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-400 mt-2">Valid for 10 minutes</p>
        </div>

        {/* ORDER SUMMARY */}
        <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 mb-6">
          <p>
            <b>Order ID:</b> {orderData.orderId}
          </p>
          <p>
            <b>Pages:</b> {orderData.printOptions?.selectedPages}
          </p>
          <p>
            <b>Copies:</b> {orderData.printOptions?.copies}
          </p>
          <p>
            <b>Total Paid:</b> ₹{orderData.price?.total}
          </p>
        </div>

        {/* LOGIN CTA */}
        <Show when="signed-out">
          <div className="mt-6 p-4 border rounded-xl bg-blue-50">
            <p className="text-sm text-gray-700 mb-2">
              Login to claim your order & enable refunds
            </p>

            <SignInButton mode="modal">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                Login & Save Order
              </button>
            </SignInButton>
          </div>
        </Show>

        {/* ATTACH STATUS */}
        {attachStatus && (
          <div className="mt-3 text-sm text-green-600 animate-fade-in">
            {attachStatus}
          </div>
        )}

        {/* ACTION */}
        <button
          onClick={() => navigate("/")}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
        >
          Print Another Document
        </button>
      </div>
    </div>
  );
}
