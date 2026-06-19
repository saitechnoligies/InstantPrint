import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/react";
import { 
  ArrowLeft, LayoutDashboard, FileText, KeyRound, 
  MonitorSmartphone, Users, TrendingUp, Settings, Printer, Loader2 
} from "lucide-react";

// Import your modular tab components
import OverviewTab from "../components/admin/OverviewTab";
// import PrintJobsTab from "../components/admin/PrintJobsTab"; 
// import ActiveOTPsTab from "../components/admin/ActiveOTPsTab";

export default function AdminPage() {
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  const [activeTab, setActiveTab] = useState("overview");
if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0C0B0A]">
        <Loader2 className="animate-spin text-[#c9a66b]" size={32} />
      </div>
    );
  }
  // Protect the route
  if (user?.primaryEmailAddress?.emailAddress !== "pittalacharanchandu@gmail.com") {
    navigate("/");
    return null;
  }

  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "jobs", label: "Print Jobs", icon: FileText },
    { id: "otps", label: "Active OTPs", icon: KeyRound },
    { id: "kiosks", label: "Kiosks", icon: MonitorSmartphone },
    { id: "users", label: "Users", icon: Users },
    { id: "revenue", label: "Revenue", icon: TrendingUp },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[#0C0B0A] text-[#e8e6e3] overflow-hidden font-sans">
      
      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 flex flex-col bg-[#12110F] border-r border-white/5 h-full shrink-0">
        
        {/* Back to Home & Logo */}
        <div className="p-6 pb-2">
          <button 
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#a3a098] hover:text-white transition-colors mb-6"
          >
            <ArrowLeft size={14} /> Back to Home
          </button>
          
          <div className="flex items-center gap-3">
            <div className="grid place-items-center w-8 h-8 rounded-lg bg-[#c9a66b]">
              <Printer className="w-4 h-4 text-[#1C1C18]" strokeWidth={2.5} />
            </div>
            <div>
              <span className="font-serif text-lg text-white tracking-tight leading-none block">PrintVault</span>
              <span className="text-[9px] uppercase tracking-widest text-[#a3a098]">Admin Console</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive 
                    ? "bg-[#c9a66b]/10 text-[#c9a66b] border border-[#c9a66b]/20" 
                    : "text-[#a3a098] hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <Icon size={18} className={isActive ? "text-[#c9a66b]" : "opacity-70"} />
                {item.label}
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#c9a66b]" />}
              </button>
            );
          })}
        </nav>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 p-2">
            <div className="w-8 h-8 rounded-full bg-[#c9a66b] text-[#1C1C18] flex items-center justify-center font-bold text-xs">
              AR
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-white leading-tight">Anya Rao</p>
              <p className="text-[10px] text-[#a3a098]">Super Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ================= MAIN CONTENT AREA ================= */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/4 w-[800px] h-[600px] bg-[#c9a66b]/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="flex-1 overflow-y-auto p-8 relative z-10 custom-scrollbar">
          {/* Top Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#a3a098] mb-1">Console</p>
              <h1 className="text-3xl font-serif text-white">
                {navItems.find(i => i.id === activeTab)?.label}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <input 
                  type="text" 
                  placeholder="Search jobs, users, kiosks..." 
                  className="bg-[#1e1c1a] border border-white/10 rounded-lg py-2 pl-4 pr-10 text-sm text-white focus:border-[#c9a66b]/50 focus:outline-none w-64"
                />
              </div>
              <button className="bg-[#c9a66b] text-[#1C1C18] px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-[#d9b96a] transition-colors">
                ↓ Export
              </button>
            </div>
          </div>

          {/* Dynamic Tab Rendering */}
          {activeTab === "overview" && <OverviewTab />}
          {activeTab === "jobs" && <div className="text-[#a3a098]">Print Jobs Component goes here...</div>}
          {/* Add other tabs here */}
        </div>
      </main>
    </div>
  );
}