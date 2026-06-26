import React, { useState } from "react";
import { Search, Filter, MoreVertical, FileText, CheckCircle2, Clock, AlertCircle, Printer } from "lucide-react";

// --- STATIC MOCK DATA ---
const MOCK_JOBS = [
  {
    id: "ORD-7A9B2",
    user: "Alex Chen",
    email: "alex.c@example.com",
    fileName: "Q3_Financial_Report.pdf",
    pages: 24,
    copies: 2,
    kiosk: "Library Ground Floor",
    status: "completed",
    amount: "₹144.00",
    date: "Today, 10:42 AM"
  },
  {
    id: "ORD-9C1X4",
    user: "Sarah Jenkins",
    email: "sarah.j@example.com",
    fileName: "Design_Thesis_Final.pdf",
    pages: 12,
    copies: 1,
    kiosk: "Engineering Block B",
    status: "printing",
    amount: "₹36.00",
    date: "Today, 10:38 AM"
  },
  {
    id: "ORD-3M8P1",
    user: "Michael Ross",
    email: "m.ross@example.com",
    fileName: "Contract_Agreement.pdf",
    pages: 5,
    copies: 3,
    kiosk: "Student Union",
    status: "pending",
    amount: "₹45.00",
    date: "Today, 10:15 AM"
  },
  {
    id: "ORD-2K4N9",
    user: "Priya Patel",
    email: "priya.p@example.com",
    fileName: "Lecture_Notes_Ch4.pdf",
    pages: 42,
    copies: 1,
    kiosk: "Library Ground Floor",
    status: "failed",
    amount: "₹126.00",
    date: "Today, 09:12 AM"
  },
  {
    id: "ORD-5V7B3",
    user: "David Kim",
    email: "dkim99@example.com",
    fileName: "Resume_Updated.pdf",
    pages: 1,
    copies: 10,
    kiosk: "Engineering Block A",
    status: "completed",
    amount: "₹30.00",
    date: "Yesterday, 04:30 PM"
  }
];

export default function PrintJobsTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // --- LOCAL FILTERING LOGIC ---
  const filteredJobs = MOCK_JOBS.filter(job => {
    const matchesSearch = 
      job.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      job.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.user.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || job.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // --- HELPER COMPONENTS ---
  const StatusBadge = ({ status }) => {
    const styles = {
      completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      printing: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
      failed: "bg-red-500/10 text-red-400 border-red-500/20",
    };

    const icons = {
      completed: <CheckCircle2 className="w-3 h-3 mr-1" />,
      printing: <Printer className="w-3 h-3 mr-1 animate-pulse" />,
      pending: <Clock className="w-3 h-3 mr-1" />,
      failed: <AlertCircle className="w-3 h-3 mr-1" />,
    };

    return (
      <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
        {icons[status]}
        <span className="capitalize">{status}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* --- HEADER & CONTROLS --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-serif text-white">Print Jobs</h2>
          <p className="text-sm text-[#a3a098]">Manage and monitor all kiosk printing activity.</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search Bar */}
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a3a098]" />
            <input 
              type="text"
              placeholder="Search ID, File, or User..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#1e1c1a]/60 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder:text-[#a3a098]/50 focus:outline-none focus:border-[#c9a66b]/50 transition-colors"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-[#1e1c1a]/60 border border-white/10 rounded-xl pl-4 pr-10 py-2 text-sm text-white focus:outline-none focus:border-[#c9a66b]/50 transition-colors cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="printing">Printing</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a3a098] pointer-events-none" />
          </div>
        </div>
      </div>

      {/* --- TABLE AREA --- */}
      <div className="bg-[#1e1c1a]/60 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5 text-xs uppercase tracking-wider text-[#a3a098]">
                <th className="px-6 py-4 font-medium">Job Details</th>
                <th className="px-6 py-4 font-medium hidden md:table-cell">User</th>
                <th className="px-6 py-4 font-medium">Location</th>
                <th className="px-6 py-4 font-medium text-center">Status</th>
                <th className="px-6 py-4 font-medium text-right">Amount</th>
                <th className="px-6 py-4 font-medium text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-[#a3a098]">
                    No print jobs found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-white/[0.02] transition-colors group">
                    
                    {/* Job Details Cell */}
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#c9a66b]/10 border border-[#c9a66b]/20 flex items-center justify-center shrink-0 mt-0.5">
                          <FileText className="w-5 h-5 text-[#c9a66b]" />
                        </div>
                        <div>
                          <div className="font-medium text-white text-sm truncate max-w-[180px] sm:max-w-xs" title={job.fileName}>
                            {job.fileName}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-[#a3a098] mt-1">
                            <span className="font-mono text-[#c9a66b]/80">{job.id}</span>
                            <span>•</span>
                            <span>{job.pages} pgs x {job.copies}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* User Cell */}
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="text-sm font-medium text-white">{job.user}</div>
                      <div className="text-xs text-[#a3a098] mt-0.5">{job.email}</div>
                    </td>

                    {/* Location Cell */}
                    <td className="px-6 py-4">
                      <div className="text-sm text-white">{job.kiosk}</div>
                      <div className="text-xs text-[#a3a098] mt-0.5">{job.date}</div>
                    </td>

                    {/* Status Cell */}
                    <td className="px-6 py-4 text-center">
                      <StatusBadge status={job.status} />
                    </td>

                    {/* Amount Cell */}
                    <td className="px-6 py-4 text-right">
                      <div className="text-sm font-mono font-medium text-white">{job.amount}</div>
                    </td>

                    {/* Actions Cell */}
                    <td className="px-6 py-4 text-center">
                      <button className="p-2 rounded-lg text-[#a3a098] hover:text-white hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer (Static for now) */}
        <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between text-xs text-[#a3a098]">
          <span>Showing {filteredJobs.length} of {MOCK_JOBS.length} jobs</span>
          <div className="flex gap-1">
            <button className="px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors disabled:opacity-50" disabled>Prev</button>
            <button className="px-3 py-1.5 rounded-lg bg-white/5 text-white">1</button>
            <button className="px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors">2</button>
            <button className="px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors">Next</button>
          </div>
        </div>
      </div>

    </div>
  );
}