import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShieldCheck, FileText, Printer, Layers, CreditCard, Loader2, AlertCircle, Sparkles } from "lucide-react";
import api from "../lib/api";
import OrderTimeline from "../components/OrderTimeline";
const pageBackgroundStyle = {
  background: `
    radial-gradient(ellipse 80% 60% at 50% -10%, rgba(200, 162, 77, 0.12), transparent 60%),
    linear-gradient(180deg, #0C0B0A 0%, #16160F 100%)
  `
};

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
        const { data } = await api.get(`/api/orders/${orderId}/checkout`);
        setOrder(data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch order details");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchOrder();
  }, [orderId]);

  const verifyPayment = async (response) => {
    try {
      const { data } = await api.post("/api/verify-payment", {
        orderId,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_signature: response.razorpay_signature,
      });
      return data;
    } catch (err) {
      throw new Error(
        err.response?.data?.error || "Payment verification failed"
      );
    }
  };

  const handlePayment = async () => {
    if (processing) return;

    try {
      setError(null);
      setProcessing(true);

      if (!window.Razorpay) {
        throw new Error("Razorpay SDK checkout could not be loaded");
      }

      let paymentData;
      try {
        const { data } = await api.post("/api/create-order", { orderId });
        paymentData = data;
      } catch (err) {
        throw new Error(
          err.response?.data?.error || "Failed to initiate transaction order"
        );
      }

      const razorpay = new window.Razorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || paymentData.keyId,
        amount: paymentData.amount,
        currency: paymentData.currency,
        name: "PrintNow Kiosks",
        description: "Secure printing clearance fee",
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
            setError("Payment cancelled by client");
          },
        },
        theme: {
          color: "#c9a66b", // Balanced brand gold color for Razorpay window interface
        },
      });

      razorpay.on("payment.failed", (response) => {
        setProcessing(false);
        setError(response.error?.description || "Gateway authorization failed");
      });

      razorpay.open();
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      setProcessing(false);
    }
  };

  // Helper row component for structured clean summaries
  const SummaryRow = ({ label, value, icon: Icon }) => (
    <div className="flex justify-between items-center py-2 text-xs border-b border-white/[0.03] last:border-0">
      <span className="text-[#a3a098] flex items-center gap-2">
        {Icon && <Icon size={14} className="text-[#c9a66b]/70" />}
        {label}
      </span>
      <span className="text-white font-medium tracking-wide">{value}</span>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0C0B0A] text-[#a3a098] font-serif gap-3">
        <Loader2 className="animate-spin text-[#c9a66b]" size={28} />
        <p className="text-xs tracking-wider">Syncing order invoices...</p>
      </div>
    );
  }

  if (!order && error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0C0B0A] text-[#a3a098] p-4">
        <div className="bg-[#1e1c1a]/60 border border-red-500/20 rounded-2xl p-6 max-w-sm w-full text-center space-y-4 shadow-xl">
          <AlertCircle className="mx-auto text-red-400" size={32} />
          <p className="text-sm text-red-400 leading-relaxed">{error}</p>
          <button 
            onClick={() => navigate("/")}
            className="text-xs font-semibold px-4 py-2 border border-white/10 rounded-full text-white hover:bg-white/5 transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen pt-32 pb-12 px-4 sm:px-6 text-[#e8e6e3] flex flex-col items-center justify-center relative" style={pageBackgroundStyle}>
      
      {/* ================= TIMELINE INDICATOR ================= */}
      <div className="relative z-10 w-full max-w-4xl flex flex-col mb-8">
        <OrderTimeline currentStep={3} />
      </div>

      <div className="w-full max-w-xl bg-[#1e1c1a]/50 backdrop-blur-xl border border-white/5 rounded-[32px] p-6 sm:p-8 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.9)] relative z-10">
        
        {/* Dynamic decorative backdrop orb glow */}
        <div className="absolute -top-12 -right-12 w-48 h-44 rounded-full bg-[radial-gradient(circle,rgba(201,166,107,0.1),transparent_70%)] pointer-events-none" />

        {/* Module Segment Header Header */}
        <div className="mb-6 border-b border-white/5 pb-4 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#c9a66b]">Checkout</div>
            <h2 className="text-xl font-serif font-bold text-white mt-1">Order Summary</h2>
          </div>
          <CreditCard size={18} className="text-[#a3a098]" />
        </div>

        {/* --- SECTION 1: SPECIFICATION METRICS --- */}
        <div className="bg-[#0f0e0c]/80 border border-white/5 rounded-2xl p-4 shadow-inner space-y-1">
          <SummaryRow label="Invoice Token" value={`#${order?.orderId}`} icon={ShieldCheck} />
          <SummaryRow label="Configured Range" value={`${order?.printOptions?.selectedPages || "All"} sheets`} icon={Layers} />
          <SummaryRow label="Volume Multiplier" value={`× ${order?.printOptions?.copies || 1}`} icon={FileText} />
          <SummaryRow 
            label="Chromatic Value" 
            value={order?.printOptions?.printType === "bw" ? "Monochrome (B&W)" : "Full Color"} 
            icon={Printer} 
          />
          <SummaryRow label="Dimension Standard" value={order?.printOptions?.paperSize?.toUpperCase()} />
          <SummaryRow label="Duplex Alignment" value={`${order?.printOptions?.sides} sided`} />
        </div>

        {/* --- SECTION 2: COST MATRIX AUDIT --- */}
        <div className="mt-6 border-t border-white/5 pt-4 space-y-2.5 text-xs text-[#a3a098] px-1">
          <div className="flex justify-between items-center">
            <span>Baseline Unit Matrix</span>
            <span className="text-white font-medium">Rs. {order?.price?.unitPrice}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Subtotal Accumulation</span>
            <span className="text-white font-medium">Rs. {order?.price?.subtotal}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Surcharge & Tariffs (Tax)</span>
            <span className="text-white font-medium">Rs. {order?.price?.tax}</span>
          </div>
          
          <div className="pt-3 border-t border-white/5 flex justify-between items-end">
            <span className="text-sm font-medium text-white">Gross Total</span>
           <span className="text-4xl sm:text-3xl font-black tracking-tight bg-gradient-to-r from-[#c9a66b] via-[#e8d099] to-[#c9a66b] bg-clip-text text-transparent">
              Rs. {order?.price?.total}
            </span>
          </div>
        </div>

        {/* Runtime API Error Notice Intercept */}
        {error && (
          <div className="mt-5 flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-xs text-red-400">
            <AlertCircle className="shrink-0 mt-0.5" size={14} />
            <p className="leading-relaxed">{error}</p>
          </div>
        )}

        {/* --- ACTIONS CTA CONTROLS --- */}
        <button
          onClick={handlePayment}
          disabled={processing}
          className={`group w-full mt-6 py-4 rounded-2xl font-bold tracking-wide text-sm flex items-center justify-center gap-2 transition-all duration-300
          ${processing 
            ? "bg-white/5 text-gray-500 border border-white/5 cursor-not-allowed" 
            : "bg-[linear-gradient(135deg,#D9B96A_0%,#C8A24D_50%,#A8842F_100%)] text-[#1C1C18] shadow-[0_10px_30px_-10px_rgba(201,166,107,0.4)] hover:shadow-[0_15px_40px_-10px_rgba(201,166,107,0.6)] hover:scale-[1.01] cursor-pointer"
          }`}
        >
          {processing ? (
            <>
              <Loader2 className="animate-spin text-gray-500" size={16} />
              Spawning secure checkout...
            </>
          ) : (
            <>
              <Sparkles size={16} />
              AUTHORIZE & PAY NOW
            </>
          )}
        </button>

      </div>
    </div>
  );
}