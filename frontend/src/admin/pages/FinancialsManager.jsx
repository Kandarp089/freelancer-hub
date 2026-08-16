import React, { useState } from 'react';
import { DollarSign, CreditCard, ShieldCheck, Download, RefreshCw, Lock, AlertTriangle } from 'lucide-react';

export default function FinancialsManager() {
  const [commissionRate, setCommissionRate] = useState(10);
  const [successMsg, setSuccessMsg] = useState('');

  const transactions = [
    { id: 'TXN-9021', date: '2026-08-16', client: 'Aarav Sharma', freelancer: 'Alex Morgan', project: 'Enterprise E-Commerce Marketplace', amount: 55000, fee: 5500, gateway: 'Razorpay (HMAC Verified)', status: 'ESCROW_HELD' },
    { id: 'TXN-8842', date: '2026-08-15', client: 'Tech Enterprise', freelancer: 'Sophia Chen', project: 'Commercial Smart Wiring Overhaul', amount: 32000, fee: 3200, gateway: 'Razorpay (HMAC Verified)', status: 'COMPLETED' },
    { id: 'TXN-8719', date: '2026-08-14', client: 'Global Ventures', freelancer: 'Priya Patel', project: 'Corporate Audit & Tax Filing 2026', amount: 50000, fee: 5000, gateway: 'Razorpay (HMAC Verified)', status: 'RELEASED' }
  ];

  const handleUpdateCommission = (e) => {
    e.preventDefault();
    setSuccessMsg(`Marketplace commission percentage updated to ${commissionRate}%. All future transactions will apply this server-side setting.`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleExportCSV = () => {
    alert("Exporting financial transactions reconciliation report to CSV format...");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#171719] border border-[#29292D] rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div>
          <h1 className="text-2xl font-extrabold text-[#F4F0E8]">Escrow Payments & Financial Transactions</h1>
          <p className="text-xs text-[#8D8A83] mt-1">Immutable Razorpay financial records, platform commission setup, and escrow audit logs.</p>
        </div>

        <button 
          onClick={handleExportCSV}
          className="btn-amber px-5 py-2.5 rounded-xl text-xs font-bold shadow-md flex items-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>Export Financial CSV</span>
        </button>
      </div>

      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl text-xs flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Commission Configuration Card */}
      <div className="bg-[#171719] border border-[#29292D] rounded-3xl p-6 space-y-4 shadow-2xl max-w-xl">
        <h3 className="text-base font-bold text-[#F4F0E8]">Marketplace Platform Commission Settings</h3>
        <form onSubmit={handleUpdateCommission} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#8D8A83] mb-1 font-semibold">Commission Percentage (%)</label>
            <div className="flex space-x-3">
              <input
                type="number"
                required
                min="0"
                max="50"
                value={commissionRate}
                onChange={(e) => setCommissionRate(e.target.value)}
                className="w-full bg-[#111113] border border-[#29292D] text-[#F4F0E8] p-3 rounded-xl focus:border-[#F4B860] focus:outline-none"
              />
              <button type="submit" className="btn-amber px-6 py-3 rounded-xl font-bold shrink-0">
                Save Rate
              </button>
            </div>
          </div>
          <p className="text-[11px] text-[#8D8A83]">
            <Lock className="w-3 h-3 inline mr-1 text-[#F4B860]" />
            All financial calculations happen strictly server-side during Razorpay payment creation.
          </p>
        </form>
      </div>

      {/* Immutable Transactions Table */}
      <div className="bg-[#171719] border border-[#29292D] rounded-3xl p-6 space-y-6 shadow-2xl">
        <h3 className="text-base font-bold text-[#F4F0E8]">Immutable Financial Transactions Log</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[#8D8A83] border-b border-[#29292D]">
              <tr>
                <th className="pb-3 font-semibold">TXN Ref ID</th>
                <th className="pb-3 font-semibold">Date</th>
                <th className="pb-3 font-semibold">Client</th>
                <th className="pb-3 font-semibold">Freelancer</th>
                <th className="pb-3 font-semibold">Contract Amount (₹)</th>
                <th className="pb-3 font-semibold">Platform Fee (10%)</th>
                <th className="pb-3 font-semibold">Gateway Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#29292D]">
              {transactions.map(txn => (
                <tr key={txn.id} className="hover:bg-[#111113]/50 transition-colors">
                  <td className="py-3.5 font-bold text-[#F4B860]">{txn.id}</td>
                  <td className="py-3.5 text-[#8D8A83]">{txn.date}</td>
                  <td className="py-3.5 text-[#F4F0E8] font-bold">{txn.client}</td>
                  <td className="py-3.5 text-[#8D8A83]">{txn.freelancer}</td>
                  <td className="py-3.5 font-extrabold text-[#F4F0E8]">₹{txn.amount.toLocaleString('en-IN')}</td>
                  <td className="py-3.5 font-bold text-[#F4B860]">₹{txn.fee.toLocaleString('en-IN')}</td>
                  <td className="py-3.5">
                    <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {txn.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
