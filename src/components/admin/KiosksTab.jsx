import React, { useState } from "react";
import { Search, Filter, MapPin, Server, Activity, Plus, Edit, Trash2, X, AlertTriangle, CheckCircle2, Droplet, FileBox, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- INITIAL MOCK DATA ---
const INITIAL_KIOSKS = [
  {
    id: "KSK-001",
    name: "Library Ground Floor",
    status: "online",
    paperLevel: 85,
    inkLevel: 60,
    totalPrints: 12450,
    lastPing: "Just now"
  },
  {
    id: "KSK-002",
    name: "Engineering Block B",
    status: "online",
    paperLevel: 15, // Low paper warning
    inkLevel: 88,
    totalPrints: 8230,
    lastPing: "2 mins ago"
  },
  {
    id: "KSK-003",
    name: "Student Union Hall",
    status: "maintenance",
    paperLevel: 100,
    inkLevel: 100,
    totalPrints: 4512,
    lastPing: "Offline (Maintenance)"
  },
  {
    id: "KSK-004",
    name: "Dormitory Lobby C",
    status: "offline",
    paperLevel: 0,
    inkLevel: 12,
    totalPrints: 19800,
    lastPing: "4 hours ago"
  }
];

export default function KiosksTab() {
  const [kiosks, setKiosks] = useState(INITIAL_KIOSKS);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // --- CRUD MODAL STATES ---
  const [modalState, setModalState] = useState({ isOpen: false, type: null, data: null });

  const openModal = (type, data = null) => setModalState({ isOpen: true, type, data });
  const closeModal = () => setModalState({ isOpen: false, type: null, data: null });

  // --- CRUD OPERATIONS (Simulated) ---
  const handleCreate = (e) => {
    e.preventDefault();
    const newKiosk = {
      id: `KSK-00${kiosks.length + 1}`,
      name: e.target.name.value,
      status: "online",
      paperLevel: 100,
      inkLevel: 100,
      totalPrints: 0,
      lastPing: "Just now"
    };
    setKiosks([newKiosk, ...kiosks]);
    closeModal();
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const updatedKiosks = kiosks.map(k => 
      k.id === modalState.data.id 
        ? { 
            ...k, 
            name: e.target.name.value,
            status: e.target.status.value, 
            paperLevel: parseInt(e.target.paperLevel.value),
            inkLevel: parseInt(e.target.inkLevel.value)
          } 
        : k
    );
    setKiosks(updatedKiosks);
    closeModal();
  };

  const handleDelete = (id) => {
    setKiosks(kiosks.filter(k => k.id !== id));
    closeModal();
  };

  // --- FILTERING ---
  const filteredKiosks = kiosks.filter(k => {
    const matchesSearch = 
      k.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      k.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || k.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // --- HELPERS ---
  const StatusBadge = ({ status }) => {
    const styles = {
      online: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      offline: "bg-red-500/10 text-red-400 border-red-500/20",
      maintenance: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    };
    const icons = {
      online: <CheckCircle2 className="w-3 h-3 mr-1" />,
      offline: <AlertTriangle className="w-3 h-3 mr-1" />,
      maintenance: <RefreshCw className="w-3 h-3 mr-1 animate-spin-slow" />,
    };
    return (
      <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
        {icons[status]}
        <span className="capitalize">{status}</span>
      </div>
    );
  };

  const ConsumableBar = ({ label, icon: Icon, percentage }) => {
    const isLow = percentage <= 20;
    return (
      <div className="flex items-center gap-3 w-full max-w-[140px]">
        <Icon className={`w-4 h-4 shrink-0 ${isLow ? 'text-red-400' : 'text-[#a3a098]'}`} />
        <div className="flex-1">
          <div className="flex justify-between text-[10px] mb-1">
            <span className="text-[#a3a098] uppercase tracking-wider">{label}</span>
            <span className={isLow ? 'text-red-400 font-bold' : 'text-white'}>{percentage}%</span>
          </div>
          <div className="w-full h-1.5 bg-[#0f0e0c] rounded-full overflow-hidden border border-white/5">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${isLow ? 'bg-red-500' : 'bg-[#c9a66b]'}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 relative">
      
      {/* --- HEADER & CONTROLS --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-serif text-white">Hardware Fleet</h2>
          <p className="text-sm text-[#a3a098]">Monitor kiosk health and consumable levels.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a3a098]" />
            <input 
              type="text"
              placeholder="Search Kiosk ID or Location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#1e1c1a]/60 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder:text-[#a3a098]/50 focus:outline-none focus:border-[#c9a66b]/50 transition-colors"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#1e1c1a]/60 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#c9a66b]/50 transition-colors cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="maintenance">Maintenance</option>
          </select>

          {/* CREATE BUTTON */}
          <button 
            onClick={() => openModal("create")}
            className="flex items-center gap-2 bg-[linear-gradient(135deg,#D9B96A_0%,#C8A24D_50%,#A8842F_100%)] text-[#1C1C18] px-4 py-2 rounded-xl text-sm font-bold shadow-lg hover:shadow-[#c9a66b]/20 transition-all hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            Add Kiosk
          </button>
        </div>
      </div>

      {/* --- TABLE AREA --- */}
      <div className="bg-[#1e1c1a]/60 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5 text-xs uppercase tracking-wider text-[#a3a098]">
                <th className="px-6 py-4 font-medium">Machine ID & Location</th>
                <th className="px-6 py-4 font-medium text-center">Status</th>
                <th className="px-6 py-4 font-medium hidden md:table-cell">Consumables</th>
                <th className="px-6 py-4 font-medium hidden lg:table-cell text-right">Network Ping</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredKiosks.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-[#a3a098]">
                    No hardware found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredKiosks.map((kiosk) => (
                  <tr key={kiosk.id} className="hover:bg-white/[0.02] transition-colors group">
                    
                    {/* Machine ID & Location */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                          kiosk.status === 'online' ? 'bg-[#c9a66b]/10 border-[#c9a66b]/30 text-[#c9a66b]' : 'bg-white/5 border-white/10 text-[#a3a098]'
                        }`}>
                          <Server className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm tracking-wide">{kiosk.id}</div>
                          <div className="flex items-center gap-1 text-xs text-[#a3a098] mt-0.5">
                            <MapPin className="w-3 h-3" />
                            {kiosk.name}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 text-center">
                      <StatusBadge status={kiosk.status} />
                    </td>

                    {/* Consumables (Paper & Ink) */}
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="flex flex-col gap-2">
                        <ConsumableBar label="Paper" icon={FileBox} percentage={kiosk.paperLevel} />
                        <ConsumableBar label="Ink" icon={Droplet} percentage={kiosk.inkLevel} />
                      </div>
                    </td>

                    {/* Network Ping */}
                    <td className="px-6 py-4 hidden lg:table-cell text-right">
                      <div className="flex items-center justify-end gap-1.5 text-sm text-white">
                        <Activity className={`w-4 h-4 ${kiosk.status === 'online' ? 'text-emerald-400' : 'text-[#a3a098]'}`} />
                        {kiosk.lastPing}
                      </div>
                      <div className="text-xs text-[#a3a098] mt-1">{kiosk.totalPrints.toLocaleString()} total prints</div>
                    </td>

                    {/* CRUD Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openModal("edit", kiosk)} className="p-1.5 rounded-lg text-yellow-400 hover:bg-yellow-400/10 transition-colors" title="Configure Kiosk">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => openModal("delete", kiosk)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors" title="Decommission Kiosk">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= CRUD MODALS OVERLAY ================= */}
      <AnimatePresence>
        {modalState.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#0C0B0A]/80 backdrop-blur-sm"
              onClick={closeModal}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-[#1e1c1a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                <h3 className="text-lg font-serif text-white capitalize">
                  {modalState.type === 'create' ? 'Provision New Hardware' : `${modalState.type} Kiosk Configuration`}
                </h3>
                <button onClick={closeModal} className="text-[#a3a098] hover:text-white transition-colors"><X className="w-5 h-5" /></button>
              </div>

              {/* Modal Body: CREATE */}
              {modalState.type === 'create' && (
                <form onSubmit={handleCreate} className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-[#a3a098] mb-1">Deployment Location</label>
                    <input name="name" required className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#c9a66b]/50" placeholder="e.g. Science Building Floor 2" />
                  </div>
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                    <p className="text-xs text-emerald-400">The kiosk will automatically be assigned an ID and marked as Online with 100% consumables upon creation.</p>
                  </div>
                  <div className="pt-4 flex justify-end gap-3">
                    <button type="button" onClick={closeModal} className="px-4 py-2 rounded-lg text-sm text-[#a3a098] hover:text-white transition-colors">Cancel</button>
                    <button type="submit" className="px-4 py-2 rounded-lg text-sm font-bold bg-[#c9a66b] text-[#1C1C18] hover:bg-[#D9B96A] transition-colors">Deploy Kiosk</button>
                  </div>
                </form>
              )}

              {/* Modal Body: EDIT */}
              {modalState.type === 'edit' && (
                <form onSubmit={handleUpdate} className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-[#a3a098] mb-1">Location Name</label>
                    <input name="name" defaultValue={modalState.data.name} required className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#c9a66b]/50" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#a3a098] mb-1">Operational Status</label>
                    <select name="status" defaultValue={modalState.data.status} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#c9a66b]/50">
                      <option value="online">Online</option>
                      <option value="maintenance">Maintenance Mode</option>
                      <option value="offline">Offline</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#a3a098] mb-1">Paper Level (%)</label>
                      <input name="paperLevel" type="number" min="0" max="100" defaultValue={modalState.data.paperLevel} required className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#c9a66b]/50" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#a3a098] mb-1">Ink Level (%)</label>
                      <input name="inkLevel" type="number" min="0" max="100" defaultValue={modalState.data.inkLevel} required className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#c9a66b]/50" />
                    </div>
                  </div>
                  <div className="pt-4 flex justify-end gap-3">
                    <button type="button" onClick={closeModal} className="px-4 py-2 rounded-lg text-sm text-[#a3a098] hover:text-white transition-colors">Cancel</button>
                    <button type="submit" className="px-4 py-2 rounded-lg text-sm font-bold bg-yellow-500 text-black hover:bg-yellow-400 transition-colors">Save Configuration</button>
                  </div>
                </form>
              )}

              {/* Modal Body: DELETE */}
              {modalState.type === 'delete' && (
                <div className="p-6">
                  <div className="flex items-center gap-3 text-red-400 bg-red-500/10 p-4 rounded-xl border border-red-500/20 mb-6">
                    <AlertTriangle className="w-6 h-6 shrink-0" />
                    <p className="text-sm leading-relaxed">Are you sure you want to decommission <strong className="text-white tracking-widest">{modalState.data.id}</strong>? It will no longer accept print jobs from the network.</p>
                  </div>
                  <div className="flex justify-end gap-3">
                    <button onClick={closeModal} className="px-4 py-2 rounded-lg text-sm text-[#a3a098] hover:text-white transition-colors">Cancel</button>
                    <button onClick={() => handleDelete(modalState.data.id)} className="px-4 py-2 rounded-lg text-sm font-bold bg-red-500 text-white hover:bg-red-400 transition-colors">Decommission</button>
                  </div>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}