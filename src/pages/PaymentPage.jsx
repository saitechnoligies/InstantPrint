import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const BASE = "http://localhost:3000";

export default function PaymentPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`${BASE}/api/orders/${orderId}/checkout`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch order");
        }

        setOrder(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const verifyPayment = async (response) => {
    const res = await fetch(`${BASE}/api/verify-payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_signature: response.razorpay_signature,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Payment verification failed");
    }

    return data;
  };

  const handlePayment = async () => {
    if (processing) return;

    try {
      setError(null);
      setProcessing(true);

      if (!window.Razorpay) {
        throw new Error("Razorpay checkout could not be loaded");
      }

      const res = await fetch(`${BASE}/api/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId }),
      });

      const paymentData = await res.json();

      if (!res.ok) {
        throw new Error(paymentData.error || "Failed to create payment order");
      }

      const razorpay = new window.Razorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || paymentData.keyId,
        amount: paymentData.amount,
        currency: paymentData.currency,
        name: "ATP Prints",
        description: "Print order payment",
        order_id: paymentData.razorpayOrderId,
        handler: async (response) => {
          try {
            await verifyPayment(response);
            navigate(`/success/${orderId}`, { replace: true });
          } catch (err) {
            setError(err.message);
          } finally {
            setProcessing(false);
          }
        },
        modal: {
          ondismiss: () => {
            setProcessing(false);
            setError("Payment cancelled");
          },
        },
        theme: {
          color: "#16a34a",
        },
      });

      razorpay.on("payment.failed", (response) => {
        setProcessing(false);
        setError(response.error?.description || "Payment failed");
      });

      razorpay.open();
    } catch (err) {
      setError(err.message);
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading order...
      </div>
    );
  }

  if (!order && error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-gray-100 py-10 px-4 w-full">
      <div className="w-full max-w-xl mx-auto bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-semibold border-b pb-3 mb-4">Payment</h2>

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

        <div className="border-t mt-6 pt-4 space-y-2 text-gray-700">
          <p>Unit Price: Rs. {order?.price?.unitPrice}</p>
          <p>Subtotal: Rs. {order?.price?.subtotal}</p>
          <p>Tax: Rs. {order?.price?.tax}</p>
          <p className="text-lg font-semibold">
            Total: Rs. {order?.price?.total}
          </p>
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          onClick={handlePayment}
          disabled={processing}
          className={`mt-6 w-full py-3 rounded-lg text-white ${
            processing ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {processing ? "Opening checkout..." : "Pay Now"}
        </button>
      </div>
    </div>
  );
}
