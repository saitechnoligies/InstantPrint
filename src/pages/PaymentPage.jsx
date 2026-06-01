// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";

// export default function PaymentPage() {
//   const { orderId } = useParams();
//   const navigate = useNavigate();

//   const [order, setOrder] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [processing, setProcessing] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(false);

//   /* ---------------- FETCH ORDER ---------------- */

//   useEffect(() => {
//     const fetchOrder = async () => {
//       try {
//         const res = await fetch(
//           `http://localhost:3000/api/orders/${orderId}/checkout`,
//         );

//         if (!res.ok) {
//           throw new Error("Failed to fetch order");
//         }

//         const data = await res.json();
//         console.log("Checkout response:", data);

//         setOrder(data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrder();
//   }, [orderId]);

//   /* ---------------- HANDLE PAYMENT ---------------- */

//   // const handlePayment = async () => {
//   //   try {
//   //     setProcessing(true);

//   //     const res = await fetch(
//   //       `http://localhost:3000/api/orders/${orderId}/payment`,
//   //       {
//   //         method: "POST",
//   //       },
//   //     );

//   //     if (!res.ok) {
//   //       throw new Error("Payment failed");
//   //     }

//   //     setSuccess(true);
//   //   } catch (err) {
//   //     alert(err.message);
//   //   } finally {
//   //     setProcessing(false);
//   //   }
//   // };

// const handlePayment = async () => {
//   try {
//     setProcessing(true);

//     // Step 1: create payment
//     const res = await fetch(`/api/orders/${orderId}/payment`, {
//       method: "POST"
//     });

//     const paymentData = await res.json();

//     // Step 2: simulate gateway delay
//     await new Promise((r) => setTimeout(r, 2000));

//     // Step 3: simulate success
//     const simulateRes = await fetch(
//       `/api/payments/${paymentData.paymentId}/simulate`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ success: true })
//       }
//     );

//     const result = await simulateRes.json();

//     setOtp(result.otp); // 🔥 REAL OTP from backend
//     setSuccess(true);

//   } catch (err) {
//     alert(err.message);
//   } finally {
//     setProcessing(false);
//   }
// };

//   /* ---------------- LOADING ---------------- */

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-gray-600">
//         Loading order...
//       </div>
//     );
//   }

//   /* ---------------- ERROR ---------------- */

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-red-500">
//         {error}
//       </div>
//     );
//   }

//   /* ---------------- SUCCESS SCREEN ---------------- */

//   if (success) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-100">
//         <div className="bg-white shadow-lg rounded-xl p-8 text-center max-w-md">
//           <h2 className="text-2xl font-semibold text-green-600 mb-4">
//             Payment Successful
//           </h2>

//           <p className="text-gray-600 mb-6">
//             Your order has been paid successfully.
//           </p>

//           <p className="text-sm text-gray-500 mb-6">Order ID: {orderId}</p>

//           <button
//             onClick={() => navigate("/")}
//             className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
//           >
//             Go Home
//           </button>
//         </div>
//       </div>
//     );
//   }

//   /* ---------------- PAYMENT PAGE ---------------- */

//   return (
//     <div className="min-h-screen bg-gray-100 flex justify-center py-10 px-4">
//       <div className="w-full max-w-xl bg-white shadow-md rounded-xl p-6">
//         <h2 className="text-xl font-semibold border-b pb-3 mb-4">Payment</h2>

//         {/* Order Info */}

//         <div className="space-y-2 text-gray-700">
//           <p>
//             <b>Order ID:</b> {order?.orderId}
//           </p>

//           <p>
//             <b>Pages:</b> {order?.printOptions?.selectedPages}
//           </p>

//           <p>
//             <b>Copies:</b> {order?.printOptions?.copies}
//           </p>

//           <p>
//             <b>Print Type:</b>{" "}
//             {order?.printOptions?.printType === "bw"
//               ? "Black & White"
//               : "Color"}
//           </p>

//           <p>
//             <b>Paper:</b> {order?.printOptions?.paperSize?.toUpperCase()}
//           </p>

//           <p>
//             <b>Sides:</b> {order?.printOptions?.sides}
//           </p>
//         </div>

//         {/* Price */}

//         <div className="border-t mt-6 pt-4 space-y-2 text-gray-700">
//           <p>Unit Price: ₹{order?.price?.unitPrice}</p>

//           <p>Subtotal: ₹{order?.price?.subtotal}</p>

//           <p>Tax: ₹{order?.price?.tax}</p>

//           <p className="text-lg font-semibold">Total: ₹{order?.price?.total}</p>
//         </div>

//         {/* Pay Button */}

//         <button
//           onClick={handlePayment}
//           disabled={processing}
//           className={`mt-6 w-full py-3 rounded-lg text-white ${
//             processing ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
//           }`}
//         >
//           {processing ? "Processing Payment..." : "Pay Now"}
//         </button>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function PaymentPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [otp, setOtp] = useState(null);

  const BASE = "http://localhost:3000";

  /* ---------------- FETCH ORDER ---------------- */

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`${BASE}/api/orders/${orderId}/checkout`);

        if (!res.ok) {
          throw new Error("Failed to fetch order");
        }

        const data = await res.json();
        setOrder(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  /* ---------------- HANDLE PAYMENT ---------------- */

  const handlePayment = async () => {
    if (processing) return;
    try {
      setProcessing(true);

      // 1. Create payment
      const res = await fetch(`${BASE}/api/orders/${orderId}/payment`, {
        method: "POST",
      });

      if (!res.ok) throw new Error("Failed to create payment");

      const paymentData = await res.json();

      // 2. Simulate delay
      await new Promise((r) => setTimeout(r, 2000));

      // 3. Simulate payment success
      const simulateRes = await fetch(
        `${BASE}/api/orders/payments/${paymentData.paymentId}/simulate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ success: true }),
        },
      );
      console.log("simulate status:", simulateRes.status);

      if (!simulateRes.ok) throw new Error("Payment failed");

      const result = await simulateRes.json();

      if (result.status !== "success") {
        throw new Error("Payment failed");
      }

      // // 4. Set OTP
      // setOtp(result.otp);
      // setSuccess(true);

      navigate(`/success/${orderId}`, {
        replace: true,
        state: {
          orderData: {
            ...order,
            otp: result.otp,
          },
        },
      });
    } catch (err) {
      alert(err.message);
    } finally {
      setProcessing(false);
    }
  };

  // const handlePayment = async () => {
  //   try {
  //     setProcessing(true);

  //     console.log("STEP 1: Creating payment...");

  //     const res = await fetch(`${BASE}/api/orders/${orderId}/payment`, {
  //       method: "POST",
  //     });

  //     console.log("STEP 2: Payment response received", res.status);

  //     if (!res.ok) throw new Error("Failed to create payment");

  //     const paymentData = await res.json();

  //     console.log("STEP 3: Payment data", paymentData);

  //     await new Promise((r) => setTimeout(r, 2000));

  //     console.log("STEP 4: Calling simulate...");

  //     const simulateRes = await fetch(
  //       `${BASE}/api/orders/payments/${paymentData.paymentId}/simulate`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ success: true }),
  //       },
  //     );

  //     console.log("STEP 5: Simulate response", simulateRes.status);

  //     const result = await simulateRes.json();

  //     console.log("STEP 6: Simulate result", result);

  //     navigate("/success", {
  //       state: {
  //         orderData: {
  //           ...order,
  //           otp: result.otp,
  //         },
  //       },
  //     });
  //   } catch (err) {
  //     console.error("ERROR:", err);
  //     alert(err.message);
  //   } finally {
  //     setProcessing(false);
  //   }
  // };

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading order...
      </div>
    );
  }

  /* ---------------- ERROR ---------------- */

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  /* ---------------- PROCESSING ---------------- */

  if (processing) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        <div className="text-center">
          <p className="text-lg font-semibold">Processing payment...</p>
          <p className="text-sm text-gray-500 mt-2">
            Please do not close this page
          </p>
        </div>
      </div>
    );
  }

  /* ---------------- SUCCESS ---------------- */

  // if (success) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-gray-100">
  //       <div className="bg-white shadow-lg rounded-xl p-8 text-center max-w-md">

  //         <h2 className="text-2xl font-semibold text-green-600 mb-4">
  //           Payment Successful
  //         </h2>

  //         <p className="text-gray-600 mb-4">
  //           Your order has been paid successfully.
  //         </p>

  //         <div className="mb-6">
  //           <p className="text-sm text-gray-500 mb-2">Your OTP</p>
  //           <div className="text-3xl font-bold tracking-widest text-blue-600">
  //             {otp}
  //           </div>
  //           <p className="text-xs text-gray-400 mt-2">
  //             Valid for 10 minutes
  //           </p>
  //         </div>

  //         <p className="text-sm text-gray-500 mb-6">
  //           Order ID: {orderId}
  //         </p>

  //         <button
  //           onClick={() => navigate("/")}
  //           className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
  //         >
  //           Go Home
  //         </button>

  //       </div>
  //     </div>
  //   );
  // }

  /* ---------------- PAYMENT PAGE ---------------- */

  // return (
  //   <div className="min-h-screen bg-gray-100 flex justify-center py-10 px-4">
  //     <div className="w-full max-w-xl bg-white shadow-md rounded-xl p-6">
  //       <h2 className="text-xl font-semibold border-b pb-3 mb-4">Payment</h2>

  //       {/* Order Info */}
  //       <div className="space-y-2 text-gray-700">
  //         <p>
  //           <b>Order ID:</b> {order?.orderId}
  //         </p>
  //         <p>
  //           <b>Pages:</b> {order?.printOptions?.selectedPages}
  //         </p>
  //         <p>
  //           <b>Copies:</b> {order?.printOptions?.copies}
  //         </p>
  //         <p>
  //           <b>Print Type:</b>{" "}
  //           {order?.printOptions?.printType === "bw"
  //             ? "Black & White"
  //             : "Color"}
  //         </p>
  //         <p>
  //           <b>Paper:</b> {order?.printOptions?.paperSize?.toUpperCase()}
  //         </p>
  //         <p>
  //           <b>Sides:</b> {order?.printOptions?.sides}
  //         </p>
  //       </div>

  //       {/* Price */}
  //       <div className="border-t mt-6 pt-4 space-y-2 text-gray-700">
  //         <p>Unit Price: ₹{order?.price?.unitPrice}</p>
  //         <p>Subtotal: ₹{order?.price?.subtotal}</p>
  //         <p>Tax: ₹{order?.price?.tax}</p>
  //         <p className="text-lg font-semibold">Total: ₹{order?.price?.total}</p>
  //       </div>

  //       {/* Pay Button */}
  //       <button
  //         onClick={handlePayment}
  //         disabled={processing}
  //         className={`mt-6 w-full py-3 rounded-lg text-white ${
  //           processing ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
  //         }`}
  //       >
  //         Pay Now
  //       </button>
  //     </div>
  //   </div>
  // );

  return (
    <div className="bg-gray-100 py-10 px-4 w-full">
      <div className="w-full max-w-xl mx-auto bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-semibold border-b pb-3 mb-4">Payment</h2>

        {/* Order Info */}
        <div className="space-y-2 text-gray-700">
          <p>
            <b>Order ID:</b> {order?.orderId}
          </p>
          <p>
            <b>Pages:</b> {order?.printOptions?.selectedPages}
          </p>
          <p>
            <b>Copies:</b> {order?.printOptions?.copies}
          </p>
          <p>
            <b>Print Type:</b>{" "}
            {order?.printOptions?.printType === "bw"
              ? "Black & White"
              : "Color"}
          </p>
          <p>
            <b>Paper:</b> {order?.printOptions?.paperSize?.toUpperCase()}
          </p>
          <p>
            <b>Sides:</b> {order?.printOptions?.sides}
          </p>
        </div>

        {/* Price */}
        <div className="border-t mt-6 pt-4 space-y-2 text-gray-700">
          <p>Unit Price: ₹{order?.price?.unitPrice}</p>
          <p>Subtotal: ₹{order?.price?.subtotal}</p>
          <p>Tax: ₹{order?.price?.tax}</p>
          <p className="text-lg font-semibold">Total: ₹{order?.price?.total}</p>
        </div>

        {/* Pay Button */}
        <button
          onClick={handlePayment}
          disabled={processing}
          className={`mt-6 w-full py-3 rounded-lg text-white ${
            processing ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          Pay Now
        </button>
      </div>
    </div>
  );
}
