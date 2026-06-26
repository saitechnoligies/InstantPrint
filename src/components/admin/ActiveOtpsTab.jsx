import React, { useState } from "react";
import { Search, Filter, KeyRound, Clock, ShieldAlert, CheckCircle2, MoreVertical, Plus, Edit, Trash2, X, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- INITIAL MOCK DATA ---
const INITIAL_OTPS = [
  {
    id: "OTP-88A1",
    orderId: "ORD-7A9B2",
    user: "Alex Chen",
    fileName: "Q3_Financial_Report.pdf",
    code: "482910",
    status: "active",
    expiresAt: "Today, 14:00 PM"
  },
  {
    id: "OTP-3B9C",
    orderId: "ORD-3M8P1",
    user: "Michael Ross",
    fileName: "Contract_Agreement.pdf",
    code: "193847",
    status: "active",
    expiresAt: "Today, 18:30 PM"
  },
  {
    id: "OTP-9X2V",
    orderId: "ORD-9C1X4",
    user: "Sarah Jenkins",
    fileName: "Design_Thesis_Final.pdf",
    code: "558201",
    status: "used",
    expiresAt: "Today, 11:00 AM"
  },
  {
    id: "OTP-4N1L",
    orderId: "ORD-2K4N9",
    user: "Priya Patel",
    fileName: "Lecture_Notes_Ch4.pdf",
    code: "902114",
    status: "revoked",
    expiresAt: "Yesterday, 15:00 PM"
  }
];

export default function ActiveOtpsTab() {
  const [otps, setOtps] = useState(INITIAL_OTPS);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // --- CRUD MODAL STATES ---
  const [modalState, setModalState] = useState({ isOpen: false, type: null, data: null });

  const openModal = (type, data = null) => setModalState({ isOpen: true, type, data });
  const closeModal = () => setModalState({ isOpen: false, type: null, data: null });

  // --- CRUD OPERATIONS (Simulated in memory) ---
  const handleCreate = (e) => {
    e.preventDefault();
    const newOtp = {
      id: `OTP-${Math.floor(Math.random() * 10000).toString(16).toUpperCase()}`,
      orderId: `ORD-MANUAL-${Math.floor(Math.random() * 1000)}`,
      user: e.target.user.value,
      fileName: e.target.fileName.value,
      code: Math.floor(100000 + Math.random() * 900000).toString(),
      status: "active",
      expiresAt: "Tomorrow, 12:00 PM" // Simulated expiry
    };
    setOtps([newOtp, ...otps]);
    closeModal();
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const updatedOtps = otps.map(otp => 
      otp.id === modalState.data.id 
        ? { ...otp, status: e.target.status.value, expiresAt: e.target.expiresAt.value } 
        : otp
    );
    setOtps(updatedOtps);
    closeModal();
  };

  const handleDelete = (id) => {
    setOtps(otps.filter(otp => otp.id !== id));
    closeModal();
  };

  // --- FILTERING ---
  const filteredOtps = otps.filter(otp => {
    const matchesSearch = 
      otp.code.includes(searchTerm) || 
      otp.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      otp.fileName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || otp.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // --- HELPERS ---
  const StatusBadge = ({ status }) => {
    const styles = {
      active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      used: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      revoked: "bg-red-500/10 text-red-400 border-red-500/20",
    };
    return (
      <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${styles[status]}`}>
        {status}
      </div>
    );
  };

  return (
    <div className="space-y-6 relative">
      
      {/* --- HEADER & CONTROLS --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-serif text-white">Active OTPs</h2>
          <p className="text-sm text-[#a3a098]">Manage secure vault access codes.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a3a098]" />
            <input 
              type="text"
              placeholder="Search Code or User..."
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
            <option value="active">Active</option>
            <option value="used">Used</option>
            <option value="revoked">Revoked</option>
          </select>

          {/* CREATE BUTTON */}
          <button 
            onClick={() => openModal("create")}
            className="flex items-center gap-2 bg-[linear-gradient(135deg,#D9B96A_0%,#C8A24D_50%,#A8842F_100%)] text-[#1C1C18] px-4 py-2 rounded-xl text-sm font-bold shadow-lg hover:shadow-[#c9a66b]/20 transition-all hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            Generate OTP
          </button>
        </div>
      </div>

      {/* --- TABLE AREA --- */}
      <div className="bg-[#1e1c1a]/60 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5 text-xs uppercase tracking-wider text-[#a3a098]">
                <th className="px-6 py-4 font-medium">Access Code</th>
                <th className="px-6 py-4 font-medium">Document / Order</th>
                <th className="px-6 py-4 font-medium hidden md:table-cell">User</th>
                <th className="px-6 py-4 font-medium text-center">Status</th>
                <th className="px-6 py-4 font-medium hidden sm:table-cell">Expires</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredOtps.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-[#a3a098]">
                    No OTPs found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredOtps.map((otp) => (
                  <tr key={otp.id} className="hover:bg-white/[0.02] transition-colors group">
                    
                    {/* Access Code */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                          otp.status === 'active' ? 'bg-[#c9a66b]/10 border border-[#c9a66b]/30' : 'bg-white/5 border border-white/10'
                        }`}>
                          <KeyRound className={`w-5 h-5 ${otp.status === 'active' ? 'text-[#c9a66b]' : 'text-[#a3a098]'}`} />
                        </div>
                        <div className="font-mono text-xl tracking-[0.2em] font-bold text-white">
                          {otp.code.slice(0,3)}<span className="text-[#a3a098]/40">-</span>{otp.code.slice(3)}
                        </div>
                      </div>
                    </td>

                    {/* Document Info */}
                    <td className="px-6 py-4">
                      <div className="font-medium text-white text-sm truncate max-w-[180px]">{otp.fileName}</div>
                      <div className="text-xs text-[#a3a098] mt-0.5 font-mono">{otp.orderId}</div>
                    </td>

                    {/* User */}
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="text-sm text-white">{otp.user}</div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 text-center">
                      <StatusBadge status={otp.status} />
                    </td>

                    {/* Expiry */}
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <div className="flex items-center gap-1.5 text-sm text-[#a3a098]">
                        <Clock className="w-3.5 h-3.5" />
                        {otp.expiresAt}
                      </div>
                    </td>

                    {/* CRUD Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openModal("view", otp)} className="p-1.5 rounded-lg text-blue-400 hover:bg-blue-400/10 transition-colors" title="View Details">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => openModal("edit", otp)} className="p-1.5 rounded-lg text-yellow-400 hover:bg-yellow-400/10 transition-colors" title="Edit OTP">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => openModal("delete", otp)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors" title="Revoke OTP">
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
                  {modalState.type === 'create' ? 'Generate Manual OTP' : `${modalState.type} OTP Record`}
                </h3>
                <button onClick={closeModal} className="text-[#a3a098] hover:text-white transition-colors"><X className="w-5 h-5" /></button>
              </div>

              {/* Modal Body: CREATE */}
              {modalState.type === 'create' && (
                <form onSubmit={handleCreate} className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-[#a3a098] mb-1">User Name</label>
                    <input name="user" required className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#c9a66b]/50" placeholder="e.g. John Doe" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#a3a098] mb-1">Document Name</label>
                    <input name="fileName" required className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#c9a66b]/50" placeholder="e.g. bypass_doc.pdf" />
                  </div>
                  <div className="pt-4 flex justify-end gap-3">
                    <button type="button" onClick={closeModal} className="px-4 py-2 rounded-lg text-sm text-[#a3a098] hover:text-white transition-colors">Cancel</button>
                    <button type="submit" className="px-4 py-2 rounded-lg text-sm font-bold bg-[#c9a66b] text-[#1C1C18] hover:bg-[#D9B96A] transition-colors">Generate & Save</button>
                  </div>
                </form>
              )}

              {/* Modal Body: EDIT */}
              {modalState.type === 'edit' && (
                <form onSubmit={handleUpdate} className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-[#a3a098] mb-1">Status</label>
                    <select name="status" defaultValue={modalState.data.status} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#c9a66b]/50">
                      <option value="active">Active</option>
                      <option value="used">Used</option>
                      <option value="revoked">Revoked</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#a3a098] mb-1">Expiry Date String</label>
                    <input name="expiresAt" defaultValue={modalState.data.expiresAt} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#c9a66b]/50" />
                  </div>
                  <div className="pt-4 flex justify-end gap-3">
                    <button type="button" onClick={closeModal} className="px-4 py-2 rounded-lg text-sm text-[#a3a098] hover:text-white transition-colors">Cancel</button>
                    <button type="submit" className="px-4 py-2 rounded-lg text-sm font-bold bg-yellow-500 text-black hover:bg-yellow-400 transition-colors">Save Changes</button>
                  </div>
                </form>
              )}

              {/* Modal Body: DELETE */}
              {modalState.type === 'delete' && (
                <div className="p-6">
                  <div className="flex items-center gap-3 text-red-400 bg-red-500/10 p-4 rounded-xl border border-red-500/20 mb-6">
                    <ShieldAlert className="w-6 h-6 shrink-0" />
                    <p className="text-sm leading-relaxed">Are you sure you want to revoke OTP <strong className="text-white tracking-widest">{modalState.data.code}</strong>? This action will instantly lock the document at the kiosk.</p>
                  </div>
                  <div className="flex justify-end gap-3">
                    <button onClick={closeModal} className="px-4 py-2 rounded-lg text-sm text-[#a3a098] hover:text-white transition-colors">Cancel</button>
                    <button onClick={() => handleDelete(modalState.data.id)} className="px-4 py-2 rounded-lg text-sm font-bold bg-red-500 text-white hover:bg-red-400 transition-colors">Yes, Revoke Access</button>
                  </div>
                </div>
              )}

              {/* Modal Body: VIEW */}
              {modalState.type === 'view' && (
                <div className="p-6 space-y-3 text-sm">
                  <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-[#a3a098]">OTP Code:</span> <strong className="text-white tracking-widest text-lg">{modalState.data.code}</strong></div>
                  <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-[#a3a098]">Order ID:</span> <span className="text-white font-mono">{modalState.data.orderId}</span></div>
                  <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-[#a3a098]">User:</span> <span className="text-white">{modalState.data.user}</span></div>
                  <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-[#a3a098]">Document:</span> <span className="text-white">{modalState.data.fileName}</span></div>
                  <div className="flex justify-between"><span className="text-[#a3a098]">Expires:</span> <span className="text-white">{modalState.data.expiresAt}</span></div>
                  <div className="pt-4 flex justify-end">
                    <button onClick={closeModal} className="px-4 py-2 rounded-lg text-sm bg-white/10 text-white hover:bg-white/20 transition-colors">Close</button>
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