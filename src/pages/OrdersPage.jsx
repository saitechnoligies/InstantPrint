import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useAuth } from "@clerk/react";
import { motion } from "framer-motion";
import { 
  Package, ChevronRight, FileText, CheckCircle2, 
  Clock, XCircle, AlertCircle, Loader2, KeyRound 
} from "lucide-react";
import api from "../lib/api";

const pageBackgroundStyle = {
  background: `
    radial-gradient(ellipse 80% 60% at 50% -10%, rgba(200, 162, 77, 0.12), transparent 60%),
    linear-gradient(180deg, #0C0B0A 0%, #16160F 100%)
  `
};

export default function OrdersPage() {
  const navigate = useNavigate();
  const { isSignedIn, isLoaded } = useUser();
  const { getToken } = useAuth();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      navigate("/");
      return;
    }

    const fetchOrders = async () => {
      try {
        const token = await getToken();
        const { data } = await api.get("/api/orders", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const sortedOrders = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(sortedOrders);
      } catch (err) {
        console.error("Vault fetch error:", err);
        const serverError = err.response?.data?.error || err.response?.data?.message || err.message;
        setError(`Server said: ${serverError}`);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isSignedIn, isLoaded, getToken, navigate]);

  // Isolate the most recent order that is paid but not yet collected/expired
  const activeOrder = orders.find(o => o.new_status === "paid");

  // Status Badge Configuration Mapper
  const getStatusConfig = (status) => {
    switch (status) {
      case "paid":
        return { label: "Ready", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", icon: CheckCircle2 };
      case "pending_payment":
        return { label: "Pending", color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20", icon: Clock };
      case "collected":
        return { label: "Collected", color: "text-[#a3a098]", bg: "bg-white/5", border: "border-white/10", icon: Package };
      case "expired":
        return { label: "Expired", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", icon: XCircle };
      case "cancelled":
        return { label: "Cancelled", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", icon: XCircle };
      case "draft":
      default:
        return { label: "Draft", color: "text-[#a3a098]", bg: "bg-[#0f0e0c]", border: "border-white/5", icon: FileText };
    }
  };

  const handleViewOrder = (order) => {
    if (order.new_status === "pending_payment" || order.new_status === "draft") {
      navigate(`/payment/${order.orderId}`);
    } else {
      navigate(`/success/${order.orderId}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0C0B0A] text-[#a3a098] font-serif gap-3">
        <Loader2 className="animate-spin text-[#c9a66b]" size={28} />
        <p className="text-xs tracking-wider">Accessing Vault History...</p>
      </div>
    );
  }

  return (
    <section className="relative min-h-screen pt-32 pb-12 px-4 sm:px-6 text-[#e8e6e3]" style={pageBackgroundStyle}>
      
      {/* Background SVG Grid */}
      <svg className="absolute inset-0 w-full h-full opacity-5 pointer-events-none z-0 fixed" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="ordersGrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#c9a66b" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#ordersGrid)" />
      </svg>

      <div className="relative z-10 max-w-3xl mx-auto">
        
        {/* Page Header */}
        <div className="mb-8 sm:mb-12 text-center sm:text-left">
          <div className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[#c9a66b] mb-3">
            Your Vault
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-white leading-tight">
            Order History
          </h1>
        </div>

        {/* Error Handling */}
        {error && (
          <div className="mb-8 flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-sm text-red-400">
            <AlertCircle className="shrink-0 mt-0.5" size={16} />
            <p>{error}</p>
          </div>
        )}

        {/* ================= ACTIVE ORDER BANNER ================= */}
        {activeOrder && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 bg-[linear-gradient(135deg,rgba(217,185,106,0.1)_0%,rgba(200,162,77,0.05)_100%)] border border-[#c9a66b]/30 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_15px_40px_-15px_rgba(201,166,107,0.2)]"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#c9a66b]/20 flex items-center justify-center shrink-0 border border-[#c9a66b]/40">
                <KeyRound className="text-[#c9a66b]" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-white mb-1">Ready for pickup</h3>
                <p className="text-sm text-[#a3a098] max-w-sm leading-relaxed">
                  Your last order is active. Show the passcode below at any kiosk to securely release your documents.
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <span className="text-[10px] uppercase tracking-wider text-[#c9a66b] font-semibold">Pass Key</span>
                  <div className="bg-[#0f0e0c]/80 border border-[#c9a66b]/30 px-4 py-1.5 rounded-lg shadow-inner">
                    <span className="font-mono text-2xl font-bold tracking-[0.25em] tabular-nums bg-gradient-to-r from-white to-[#e8d099] bg-clip-text text-transparent">
                      {activeOrder.otp || "------"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="shrink-0 w-full sm:w-auto">
              <button 
                onClick={() => handleViewOrder(activeOrder)}
                className="w-full sm:w-auto bg-[#c9a66b] text-[#1C1C18] px-6 py-3 rounded-xl font-bold tracking-wide text-sm shadow-[0_10px_30px_-10px_rgba(201,166,107,0.4)] hover:shadow-[0_15px_40px_-10px_rgba(201,166,107,0.6)] hover:scale-[1.02] transition-all"
              >
                VIEW DETAILS
              </button>
            </div>
          </motion.div>
        )}

        {/* ================= RECENT ORDERS LIST ================= */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[#a3a098] border-b border-white/10 pb-3 mb-6">
            Recent Orders
          </h3>

          {orders.length === 0 && !error ? (
            <div className="text-center py-12 bg-[#1e1c1a]/50 border border-white/5 rounded-3xl backdrop-blur-sm">
              <Package className="mx-auto text-[#a3a098] mb-4 opacity-50" size={32} />
              <p className="text-[#a3a098] text-sm">No documents found in your vault.</p>
            </div>
          ) : (
            orders.map((order, index) => {
              const status = getStatusConfig(order.new_status);
              const StatusIcon = status.icon;
              
              // Determine if we should display the OTP inline
              const showOtp = order.new_status === "paid" && order.otp;
              
              const pages = order.printOptions?.selectedPages 
                ? order.printOptions.selectedPages.split(',').length 
                : (order.file?.pageCount || 0);
              const copies = order.printOptions?.copies || 1;

              return (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={order.orderId}
                  className="group bg-[#1e1c1a]/60 backdrop-blur-md border border-white/5 hover:border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
                >
                  {/* Left: Info */}
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${status.bg} ${status.border} ${status.color}`}>
                      <StatusIcon size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-[#a3a098]">
                          Order <span className="font-bold text-white tracking-wide tabular-nums">#{order.orderId.slice(-6).toUpperCase()}</span>
                        </span>
                        <span className="text-[10px] font-semibold text-[#a3a098]/70 tracking-wider tabular-nums">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-xs text-[#a3a098] flex items-center gap-2">
                        <FileText size={12} />
                        <span><span className="font-bold text-[#e8d099] tabular-nums">{pages}</span> {pages === 1 ? 'page' : 'pages'}</span>
                        <span className="opacity-50">•</span>
                        <span><span className="font-bold text-[#e8d099] tabular-nums">{copies}</span> {copies === 1 ? 'copy' : 'copies'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: OTP, Status & Action */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between sm:justify-end gap-4 w-full sm:w-auto border-t border-white/5 sm:border-0 pt-4 sm:pt-0 mt-2 sm:mt-0">
                    
                    <div className="flex items-center gap-3">
                      {showOtp && (
                        <div className="flex items-center gap-2 bg-[#0f0e0c]/80 border border-white/10 px-3 py-1 rounded-lg">
                          <span className="text-[9px] uppercase tracking-wider text-[#a3a098]">OTP</span>
                          <span className="font-mono font-bold text-white tracking-widest tabular-nums">{order.otp}</span>
                        </div>
                      )}
                      
                      <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${status.bg} ${status.border} ${status.color}`}>
                        {status.label}
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleViewOrder(order)}
                      className="flex items-center gap-1 text-xs font-semibold text-[#a3a098] hover:text-[#c9a66b] transition-colors"
                    >
                      VIEW
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

      </div>
    </section>
  );
}