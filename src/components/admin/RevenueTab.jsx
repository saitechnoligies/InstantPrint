import React, { useState } from "react";
import { Search, Filter, DollarSign, TrendingUp, CreditCard, Download, ArrowUpRight, ArrowDownRight, Calendar, ArrowRightLeft } from "lucide-react";

// --- STATIC MOCK DATA ---
const MOCK_TRANSACTIONS = [
  {
    id: "TXN-9982A",
    orderId: "ORD-7A9B2",
    customer: "Alex Chen",
    amount: "₹144.00",
    method: "UPI",
    status: "successful",
    date: "Today, 10:42 AM"
  },
  {
    id: "TXN-3341B",
    orderId: "ORD-9C1X4",
    customer: "Sarah Jenkins",
    amount: "₹36.00",
    method: "Credit Card",
    status: "successful",
    date: "Today, 10:38 AM"
  },
  {
    id: "TXN-7729C",
    orderId: "ORD-3M8P1",
    customer: "Michael Ross",
    amount: "₹45.00",
    method: "Wallet",
    status: "pending",
    date: "Today, 10:15 AM"
  },
  {
    id: "TXN-1104D",
    orderId: "ORD-2K4N9",
    customer: "Priya Patel",
    amount: "₹126.00",
    method: "UPI",
    status: "refunded",
    date: "Yesterday, 09:12 AM"
  },
  {
    id: "TXN-5592E",
    orderId: "ORD-5V7B3",
    customer: "David Kim",
    amount: "₹30.00",
    method: "Debit Card",
    status: "successful",
    date: "Yesterday, 04:30 PM"
  }
];

// Mock data for the CSS bar chart
const CHART_DATA = [
  { day: "Mon", value: 40 },
  { day: "Tue", value: 65 },
  { day: "Wed", value: 45 },
  { day: "Thu", value: 80 },
  { day: "Fri", value: 55 },
  { day: "Sat", value: 95 },
  { day: "Sun", value: 70 },
];

export default function RevenueTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // --- FILTERING ---
  const filteredTxns = MOCK_TRANSACTIONS.filter(txn => {
    const matchesSearch = 
      txn.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      txn.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.customer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || txn.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // --- HELPERS ---
  const StatusBadge = ({ status }) => {
    const styles = {
      successful: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
      refunded: "bg-red-500/10 text-red-400 border-red-500/20",
    };

    return (
      <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${styles[status]}`}>
        {status}
      </div>
    );
  };

  const MetricCard = ({ title, value, growth, icon: Icon, isPositive }) => (
    <div className="bg-[#1e1c1a]/60 backdrop-blur-md border border-white/5 rounded-2xl p-6 flex flex-col justify-between shadow-lg relative overflow-hidden">
      {/* Decorative background icon */}
      <Icon className="absolute -right-4 -bottom-4 w-24 h-24 text-white/[0.02] pointer-events-none" />
      
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xs font-semibold tracking-wider uppercase text-[#a3a098]">{title}</h3>
        <div className="w-8 h-8 rounded-lg bg-[#c9a66b]/10 flex items-center justify-center text-[#c9a66b]">
          <Icon className="w-4 h-4" />
        </div>
      </div>
      
      <p className="text-3xl font-serif text-white mb-4 tracking-tight">{value}</p>
      
      <div className="flex items-center gap-2 text-xs">
        <div className={`flex items-center gap-1 px-2 py-1 rounded-md font-medium ${
          isPositive ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
        }`}>
          {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {growth}%
        </div>
        <span className="text-[#a3a098] opacity-70">vs last month</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      
      {/* --- HEADER & CONTROLS --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-serif text-white">Financial Hub</h2>
          <p className="text-sm text-[#a3a098]">Track revenue, payouts, and transaction history.</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex items-center gap-2 bg-[#1e1c1a]/60 backdrop-blur-md border border-white/10 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/5 transition-colors">
            <Calendar className="w-4 h-4 text-[#a3a098]" />
            Last 30 Days
          </button>
          <button className="flex items-center gap-2 bg-[linear-gradient(135deg,#D9B96A_0%,#C8A24D_50%,#A8842F_100%)] text-[#1C1C18] px-4 py-2 rounded-xl text-sm font-bold shadow-lg hover:shadow-[#c9a66b]/20 transition-all hover:-translate-y-0.5">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* --- 4 METRIC CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Gross Revenue" value="₹42,500" growth="12.5" isPositive={true} icon={DollarSign} />
        <MetricCard title="Net Earnings" value="₹38,250" growth="14.2" isPositive={true} icon={TrendingUp} />
        <MetricCard title="Avg. Order Value" value="₹85.50" growth="2.1" isPositive={true} icon={CreditCard} />
        <MetricCard title="Refund Rate" value="1.2%" growth="0.4" isPositive={false} icon={ArrowRightLeft} />
      </div>

      {/* --- MIDDLE SPLIT: CHART & PAYOUTS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[300px]">
        
        {/* Weekly Revenue Chart */}
        <div className="lg:col-span-2 bg-[#1e1c1a]/60 backdrop-blur-md border border-white/5 rounded-2xl p-6 flex flex-col shadow-lg">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-serif text-white">Revenue Trend</h3>
              <p className="text-xs text-[#a3a098]">Daily volume over the past 7 days</p>
            </div>
            <div className="text-2xl font-serif text-[#c9a66b]">₹4,250</div>
          </div>
          
          {/* Simulated CSS Bar Chart */}
          <div className="flex-1 flex items-end justify-between gap-2 pt-4">
            {CHART_DATA.map((data, i) => (
              <div key={i} className="flex flex-col items-center gap-2 flex-1 group">
                <div className="w-full relative bg-white/5 rounded-t-sm overflow-hidden flex items-end h-[150px]">
                  <div 
                    className="w-full bg-[linear-gradient(180deg,#c9a66b_0%,rgba(201,166,107,0.2)_100%)] rounded-t-sm transition-all duration-700 group-hover:opacity-80"
                    style={{ height: `${data.value}%` }}
                  />
                  {/* Tooltip on hover */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#0C0B0A] border border-[#c9a66b]/30 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    ₹{data.value * 10}
                  </div>
                </div>
                <span className="text-[11px] font-medium text-[#a3a098] uppercase">{data.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Payouts Card */}
        <div className="bg-[#1e1c1a]/60 backdrop-blur-md border border-white/5 rounded-2xl p-6 flex flex-col shadow-lg">
          <h3 className="text-lg font-serif text-white mb-1">Next Payout</h3>
          <p className="text-xs text-[#a3a098] mb-6">Scheduled for Friday, 12th</p>
          
          <div className="flex-1 flex flex-col justify-center items-center text-center p-6 border border-dashed border-white/10 rounded-xl bg-white/[0.02]">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
              <DollarSign className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="text-3xl font-serif text-white mb-2">₹12,450</div>
            <div className="text-xs text-[#a3a098]">Routing to bank ending in •••• 4492</div>
          </div>
        </div>
      </div>

      {/* --- TRANSACTION TABLE AREA --- */}
      <div className="bg-[#1e1c1a]/60 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden shadow-lg">
        {/* Table Header Controls */}
        <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/[0.01]">
          <h3 className="text-md font-serif text-white">Recent Transactions</h3>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-56">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a3a098]" />
              <input 
                type="text"
                placeholder="Search TXN or User..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#0C0B0A]/50 border border-white/10 rounded-lg pl-9 pr-4 py-1.5 text-sm text-white placeholder:text-[#a3a098]/50 focus:outline-none focus:border-[#c9a66b]/50 transition-colors"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#0C0B0A]/50 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[#c9a66b]/50 cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="successful">Successful</option>
              <option value="pending">Pending</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5 text-xs uppercase tracking-wider text-[#a3a098]">
                <th className="px-6 py-4 font-medium">Transaction ID</th>
                <th className="px-6 py-4 font-medium hidden md:table-cell">Customer</th>
                <th className="px-6 py-4 font-medium">Method</th>
                <th className="px-6 py-4 font-medium text-center">Status</th>
                <th className="px-6 py-4 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredTxns.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-[#a3a098]">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                filteredTxns.map((txn) => (
                  <tr key={txn.id} className="hover:bg-white/[0.02] transition-colors group">
                    
                    {/* ID & Date */}
                    <td className="px-6 py-4">
                      <div className="font-mono text-sm font-medium text-white">{txn.id}</div>
                      <div className="text-xs text-[#a3a098] mt-0.5">{txn.date}</div>
                    </td>

                    {/* Customer */}
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="text-sm text-white">{txn.customer}</div>
                      <div className="text-xs text-[#a3a098] font-mono mt-0.5">{txn.orderId}</div>
                    </td>

                    {/* Method */}
                    <td className="px-6 py-4">
                      <div className="text-sm text-[#a3a098]">{txn.method}</div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 text-center">
                      <StatusBadge status={txn.status} />
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-4 text-right">
                      <div className={`text-sm font-mono font-medium ${txn.status === 'refunded' ? 'text-red-400 line-through opacity-70' : 'text-white'}`}>
                        {txn.amount}
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}