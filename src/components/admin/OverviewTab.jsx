import React, { useEffect, useState } from "react";
import { ArrowUpRight, ArrowDownRight, Loader2 } from "lucide-react";
import { useAuth } from "@clerk/react";
import api from "../../lib/api";

export default function OverviewTab() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  
  const { getToken, isLoaded, isSignedIn } = useAuth(); 

useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // No need to pass headers! The interceptor does it automatically.
        const { data } = await api.get("/api/admin/overview");
        
        setData(data);
        setErrorMsg("");
      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
        setErrorMsg(err.response?.data?.error || "Failed to load metrics");
      } finally {
        setLoading(false);
      }
    };
    
    // Only fetch if Clerk is loaded
    if (isLoaded) fetchDashboardData();
  }, [isLoaded]); // Dependencies minimized

  // --- UI RENDERING ---

  if (loading) {
    return (
      <div className="h-64 flex flex-col gap-4 items-center justify-center text-[#c9a66b]">
        <Loader2 className="animate-spin w-8 h-8" />
        <p className="text-xs text-[#a3a098] tracking-widest uppercase">Securing Connection...</p>
      </div>
    );
  }

  if (errorMsg || !data) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-400 font-mono text-sm">
        Backend Error: {errorMsg || "No data returned"}
      </div>
    );
  }

  const { metrics, liveActivity } = data;

  const MetricCard = ({ title, value, growth, prefix = "", suffix = "", isPositive }) => (
    <div className="bg-[#1e1c1a]/60 backdrop-blur-md border border-white/5 rounded-2xl p-6 flex flex-col justify-between shadow-lg">
      <h3 className="text-xs font-semibold tracking-wider uppercase text-[#a3a098] mb-2">{title}</h3>
      <p className="text-3xl font-serif text-white mb-4">
        {prefix}{value.toLocaleString()}{suffix}
      </p>
      <div className="flex items-center gap-2 text-xs">
        <div className={`flex items-center gap-1 px-2 py-1 rounded-md font-medium ${
          isPositive ? "bg-emerald-500/10 text-emerald-400" : "bg-yellow-500/10 text-yellow-400"
        }`}>
          {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {growth}%
        </div>
        <span className="text-[#a3a098] opacity-70">vs yesterday</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      
      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Jobs Today" 
          value={metrics.jobsToday.value} 
          growth={metrics.jobsToday.growth} 
          isPositive={metrics.jobsToday.growth >= 0} 
        />
        <MetricCard 
          title="Revenue (24H)" 
          value={metrics.revenueToday.value} 
          prefix="₹"
          growth={metrics.revenueToday.growth} 
          isPositive={metrics.revenueToday.growth >= 0} 
        />
        <div className="bg-[#1e1c1a]/60 backdrop-blur-md border border-white/5 rounded-2xl p-6 flex flex-col justify-between shadow-lg">
          <h3 className="text-xs font-semibold tracking-wider uppercase text-[#a3a098] mb-2">Active OTPs</h3>
          <p className="text-3xl font-serif text-white mb-4">{metrics.activeOtps.value}</p>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-yellow-400 bg-yellow-500/10 px-2 py-1 rounded-md font-medium">Monitoring</span>
          </div>
        </div>
        <div className="bg-[#1e1c1a]/60 backdrop-blur-md border border-white/5 rounded-2xl p-6 flex flex-col justify-between shadow-lg">
          <h3 className="text-xs font-semibold tracking-wider uppercase text-[#a3a098] mb-2">Kiosks Online</h3>
          <p className="text-3xl font-serif text-white mb-4">
            {metrics.kiosksOnline.online} <span className="text-[#a3a098] text-xl">/ {metrics.kiosksOnline.total}</span>
          </p>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md font-medium flex items-center gap-1">
              <ArrowUpRight size={12} /> {metrics.kiosksOnline.uptime}%
            </span>
            <span className="text-[#a3a098] opacity-70">uptime SLA</span>
          </div>
        </div>
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[400px]">
        
        {/* Chart Area */}
        <div className="lg:col-span-2 bg-[#1e1c1a]/60 backdrop-blur-md border border-white/5 rounded-2xl p-6 flex flex-col shadow-lg">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-serif text-white">Print throughput</h3>
              <p className="text-xs text-[#a3a098]">Pages printed across all kiosks · last 14 days</p>
            </div>
            <div className="flex gap-2 text-xs font-medium">
              <button className="text-[#a3a098] hover:text-white transition-colors">24h</button>
              <button className="text-[#a3a098] hover:text-white transition-colors">7d</button>
              <button className="bg-[#c9a66b]/10 text-[#c9a66b] px-2 py-1 rounded border border-[#c9a66b]/20">14d</button>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center border border-dashed border-white/10 rounded-xl bg-white/[0.02]">
            <span className="text-[#a3a098] text-sm">Chart Data Visualization Area</span>
          </div>
        </div>

        {/* Live Activity Feed */}
        <div className="bg-[#1e1c1a]/60 backdrop-blur-md border border-white/5 rounded-2xl p-6 overflow-hidden flex flex-col shadow-lg">
          <div className="mb-6">
            <h3 className="text-lg font-serif text-white">Live activity</h3>
            <p className="text-xs text-[#a3a098]">Latest events across the network</p>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-5">
            {liveActivity.map((event, i) => (
              <div key={i} className="flex gap-3 relative">
                {i !== liveActivity.length - 1 && (
                  <div className="absolute top-5 left-1.5 w-px h-full bg-white/10" />
                )}
                <div className="w-3 h-3 mt-1 rounded-full bg-emerald-500/20 border border-emerald-500 flex-shrink-0 z-10" />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-medium text-white capitalize">{event.type.replace(/_/g, ' ')}</p>
                    <span className="text-[10px] text-[#a3a098] font-mono">
                      {new Date(event.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-[#a3a098] mt-1 leading-relaxed">
                    Order <span className="font-mono text-white/70">#{event.details?.gatewayOrderId || event.id.slice(-6).toUpperCase()}</span>
                  </p>
                </div>
              </div>
            ))}
            {liveActivity.length === 0 && (
              <p className="text-sm text-[#a3a098] text-center mt-10">No recent network activity.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}