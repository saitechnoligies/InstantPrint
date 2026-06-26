import React, { useState } from "react";
import { Search, Filter, Shield, User, UserPlus, Mail, Edit, Trash2, X, Ban, CheckCircle2, MoreVertical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- INITIAL MOCK DATA ---
const INITIAL_USERS = [
  {
    id: "usr_2bJ8x1",
    name: "Alex Chen",
    email: "alex.c@example.com",
    role: "admin",
    status: "active",
    totalOrders: 142,
    joinedAt: "Jan 12, 2026"
  },
  {
    id: "usr_9xP4v2",
    name: "Sarah Jenkins",
    email: "sarah.j@example.com",
    role: "user",
    status: "active",
    totalOrders: 12,
    joinedAt: "Feb 03, 2026"
  },
  {
    id: "usr_7mK9q3",
    name: "Michael Ross",
    email: "m.ross@example.com",
    role: "user",
    status: "active",
    totalOrders: 4,
    joinedAt: "Mar 15, 2026"
  },
  {
    id: "usr_3nB2z8",
    name: "John Doe",
    email: "j.doe_susp@example.com",
    role: "user",
    status: "suspended",
    totalOrders: 0,
    joinedAt: "Apr 01, 2026"
  }
];

export default function UsersTab() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // --- CRUD MODAL STATES ---
  const [modalState, setModalState] = useState({ isOpen: false, type: null, data: null });

  const openModal = (type, data = null) => setModalState({ isOpen: true, type, data });
  const closeModal = () => setModalState({ isOpen: false, type: null, data: null });

  // --- CRUD OPERATIONS (Simulated) ---
  const handleCreate = (e) => {
    e.preventDefault();
    const newUser = {
      id: `usr_${Math.random().toString(36).substr(2, 6)}`,
      name: e.target.name.value,
      email: e.target.email.value,
      role: e.target.role.value,
      status: "active",
      totalOrders: 0,
      joinedAt: "Just now"
    };
    setUsers([newUser, ...users]);
    closeModal();
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const updatedUsers = users.map(u => 
      u.id === modalState.data.id 
        ? { ...u, role: e.target.role.value, status: e.target.status.value } 
        : u
    );
    setUsers(updatedUsers);
    closeModal();
  };

  const handleDelete = (id) => {
    setUsers(users.filter(u => u.id !== id));
    closeModal();
  };

  // --- FILTERING ---
  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // --- HELPERS ---
  const RoleBadge = ({ role }) => {
    const isAdmin = role === "admin";
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${
        isAdmin ? "bg-purple-500/10 text-purple-400 border-purple-500/20" : "bg-white/5 text-[#a3a098] border-white/10"
      }`}>
        {isAdmin ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
        <span className="capitalize">{role}</span>
      </div>
    );
  };

  const StatusBadge = ({ status }) => {
    const isActive = status === "active";
    return (
      <div className={`inline-flex items-center gap-1 text-xs font-medium ${
        isActive ? "text-emerald-400" : "text-red-400"
      }`}>
        {isActive ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />}
        <span className="capitalize">{status}</span>
      </div>
    );
  };

  // Helper to get initials for avatar
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6 relative">
      
      {/* --- HEADER & CONTROLS --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-serif text-white">User Management</h2>
          <p className="text-sm text-[#a3a098]">Manage access, roles, and view user activity.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a3a098]" />
            <input 
              type="text"
              placeholder="Search Name, Email or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#1e1c1a]/60 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder:text-[#a3a098]/50 focus:outline-none focus:border-[#c9a66b]/50 transition-colors"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-[#1e1c1a]/60 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#c9a66b]/50 transition-colors cursor-pointer"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admins</option>
            <option value="user">Standard Users</option>
          </select>

          {/* CREATE BUTTON */}
          <button 
            onClick={() => openModal("create")}
            className="flex items-center gap-2 bg-[linear-gradient(135deg,#D9B96A_0%,#C8A24D_50%,#A8842F_100%)] text-[#1C1C18] px-4 py-2 rounded-xl text-sm font-bold shadow-lg hover:shadow-[#c9a66b]/20 transition-all hover:-translate-y-0.5"
          >
            <UserPlus className="w-4 h-4" />
            Invite User
          </button>
        </div>
      </div>

      {/* --- TABLE AREA --- */}
      <div className="bg-[#1e1c1a]/60 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5 text-xs uppercase tracking-wider text-[#a3a098]">
                <th className="px-6 py-4 font-medium">User Details</th>
                <th className="px-6 py-4 font-medium hidden md:table-cell">Role</th>
                <th className="px-6 py-4 font-medium text-center">Status</th>
                <th className="px-6 py-4 font-medium hidden lg:table-cell text-right">Activity</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-[#a3a098]">
                    No users found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-white/[0.02] transition-colors group">
                    
                    {/* User Details */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#c9a66b]/10 border border-[#c9a66b]/30 flex items-center justify-center shrink-0 text-[#c9a66b] font-bold text-sm">
                          {getInitials(u.name)}
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm tracking-wide">{u.name}</div>
                          <div className="flex items-center gap-1 text-xs text-[#a3a098] mt-0.5">
                            <Mail className="w-3 h-3" />
                            {u.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4 hidden md:table-cell">
                      <RoleBadge role={u.role} />
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 text-center">
                      <StatusBadge status={u.status} />
                    </td>

                    {/* Activity */}
                    <td className="px-6 py-4 hidden lg:table-cell text-right">
                      <div className="text-sm text-white font-mono">{u.totalOrders} <span className="font-sans text-[#a3a098] text-xs">orders</span></div>
                      <div className="text-[11px] text-[#a3a098] mt-1">Joined {u.joinedAt}</div>
                    </td>

                    {/* CRUD Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openModal("edit", u)} className="p-1.5 rounded-lg text-yellow-400 hover:bg-yellow-400/10 transition-colors" title="Edit User">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => openModal("delete", u)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors" title={u.id === 'usr_2bJ8x1' ? "Cannot delete main admin" : "Remove User"} disabled={u.id === 'usr_2bJ8x1'}>
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
                  {modalState.type === 'create' ? 'Invite New User' : `${modalState.type} User Access`}
                </h3>
                <button onClick={closeModal} className="text-[#a3a098] hover:text-white transition-colors"><X className="w-5 h-5" /></button>
              </div>

              {/* Modal Body: CREATE */}
              {modalState.type === 'create' && (
                <form onSubmit={handleCreate} className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-[#a3a098] mb-1">Full Name</label>
                    <input name="name" required className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#c9a66b]/50" placeholder="e.g. Jane Smith" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#a3a098] mb-1">Email Address</label>
                    <input name="email" type="email" required className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#c9a66b]/50" placeholder="jane@example.com" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#a3a098] mb-1">System Role</label>
                    <select name="role" defaultValue="user" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#c9a66b]/50">
                      <option value="user">Standard User</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>
                  <div className="p-4 bg-[#c9a66b]/10 border border-[#c9a66b]/20 rounded-xl mt-2">
                    <p className="text-xs text-[#c9a66b]">An invitation email will be sent to this address. They will be prompted to set up their account via Clerk.</p>
                  </div>
                  <div className="pt-4 flex justify-end gap-3">
                    <button type="button" onClick={closeModal} className="px-4 py-2 rounded-lg text-sm text-[#a3a098] hover:text-white transition-colors">Cancel</button>
                    <button type="submit" className="px-4 py-2 rounded-lg text-sm font-bold bg-[#c9a66b] text-[#1C1C18] hover:bg-[#D9B96A] transition-colors">Send Invite</button>
                  </div>
                </form>
              )}

              {/* Modal Body: EDIT */}
              {modalState.type === 'edit' && (
                <form onSubmit={handleUpdate} className="p-6 space-y-4">
                  <div className="flex items-center gap-3 mb-6">
                     <div className="w-12 h-12 rounded-full bg-[#c9a66b]/10 border border-[#c9a66b]/30 flex items-center justify-center text-[#c9a66b] font-bold">
                        {getInitials(modalState.data.name)}
                     </div>
                     <div>
                       <div className="text-white font-medium">{modalState.data.name}</div>
                       <div className="text-xs text-[#a3a098]">{modalState.data.email}</div>
                     </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#a3a098] mb-1">System Role</label>
                    <select name="role" defaultValue={modalState.data.role} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#c9a66b]/50">
                      <option value="admin">Administrator</option>
                      <option value="user">Standard User</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#a3a098] mb-1">Account Status</label>
                    <select name="status" defaultValue={modalState.data.status} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#c9a66b]/50">
                      <option value="active">Active</option>
                      <option value="suspended">Suspended (Cannot Login)</option>
                    </select>
                  </div>
                  <div className="pt-4 flex justify-end gap-3">
                    <button type="button" onClick={closeModal} className="px-4 py-2 rounded-lg text-sm text-[#a3a098] hover:text-white transition-colors">Cancel</button>
                    <button type="submit" className="px-4 py-2 rounded-lg text-sm font-bold bg-yellow-500 text-black hover:bg-yellow-400 transition-colors">Save Permissions</button>
                  </div>
                </form>
              )}

              {/* Modal Body: DELETE */}
              {modalState.type === 'delete' && (
                <div className="p-6">
                  <div className="flex items-start gap-3 text-red-400 bg-red-500/10 p-4 rounded-xl border border-red-500/20 mb-6">
                    <Trash2 className="w-6 h-6 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold mb-1">Delete User Data?</p>
                      <p className="text-xs leading-relaxed text-red-400/80">Are you sure you want to permanently delete <strong className="text-white">{modalState.data.name}</strong>? This will wipe their order history and immediately revoke authentication access.</p>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <button onClick={closeModal} className="px-4 py-2 rounded-lg text-sm text-[#a3a098] hover:text-white transition-colors">Cancel</button>
                    <button onClick={() => handleDelete(modalState.data.id)} className="px-4 py-2 rounded-lg text-sm font-bold bg-red-500 text-white hover:bg-red-400 transition-colors">Confirm Deletion</button>
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