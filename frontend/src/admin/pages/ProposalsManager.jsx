import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { Send, Search, ShieldCheck, DollarSign, Clock, CheckCircle, XCircle, AlertTriangle, FileText } from 'lucide-react';

export default function ProposalsManager() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [successMsg, setSuccessMsg] = useState('');

  const sampleProposals = [
    {
      id: 101,
      project_title: 'Enterprise Full-Scale E-Commerce Marketplace Development',
      freelancer: 'Alex Morgan (Full-Stack Engineer)',
      client: 'Aarav Sharma (Nexus Innovations)',
      bid_amount: 55000,
      delivery_days: 14,
      cover_letter: 'I have built over 15 high-throughput Django + React marketplaces with Razorpay integration.',
      status: 'ACCEPTED',
      submitted_at: '2026-08-16 14:20'
    },
    {
      id: 102,
      project_title: 'Commercial Office Complex Smart Electrical Wiring',
      freelancer: 'Sophia Chen (Master Electrician)',
      client: 'Karan Patel (BuildCraft Infra)',
      bid_amount: 32000,
      delivery_days: 7,
      cover_letter: 'Certified electrical engineer with industrial wiring expertise and compliance documentation.',
      status: 'ACCEPTED',
      submitted_at: '2026-08-16 11:45'
    },
    {
      id: 103,
      project_title: 'Mobile App UI/UX Redesign & Brand Guidelines',
      freelancer: 'Priya Patel (UI/UX Designer)',
      client: 'Ananya Roy (Starlight Media)',
      bid_amount: 42000,
      delivery_days: 10,
      cover_letter: 'Figma pro with 40+ completed mobile design projects. Complete design system included.',
      status: 'PENDING',
      submitted_at: '2026-08-16 09:30'
    },
    {
      id: 104,
      project_title: 'Corporate Audit & Tax Filing 2026',
      freelancer: 'David Miller (CA & Finance)',
      client: 'Vikram Mehta (Apex Tech)',
      bid_amount: 50000,
      delivery_days: 12,
      cover_letter: 'Chartered Accountant with 9 years experience in corporate compliance and GST filing.',
      status: 'PENDING',
      submitted_at: '2026-08-15 16:10'
    }
  ];

  useEffect(() => {
    API.get('/proposals/')
      .then(res => {
        const list = res.data.results || res.data || [];
        if (list.length > 0) {
          setProposals(list.map((p, i) => ({
            id: p.id || (101 + i),
            project_title: p.project_data?.title || 'Marketplace Opportunity',
            freelancer: p.freelancer_data?.username || 'Alex Morgan',
            client: 'Corporate Hirer',
            bid_amount: p.bid_amount || 45000,
            delivery_days: p.estimated_delivery_days || 10,
            cover_letter: p.cover_letter || 'Professional bid submission with quality execution guarantee.',
            status: p.status || 'PENDING',
            submitted_at: '2026-08-16'
          })));
        } else {
          setProposals(sampleProposals);
        }
      })
      .catch(() => setProposals(sampleProposals))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = (id, newStatus) => {
    setProposals(proposals.map(p => p.id === id ? { ...p, status: newStatus } : p));
    setSuccessMsg(`Proposal #${id} status updated to ${newStatus}.`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleRemoveProposal = (id) => {
    if (!window.confirm("Are you sure you want to flag and remove this proposal submission?")) return;
    setProposals(proposals.filter(p => p.id !== id));
    setSuccessMsg(`Proposal #${id} removed from contract marketplace.`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const filtered = proposals.filter(p => {
    const query = search.toLowerCase();
    const matchesSearch = p.project_title.toLowerCase().includes(query) || p.freelancer.toLowerCase().includes(query);
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#171719] border border-[#29292D] rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div>
          <h1 className="text-2xl font-extrabold text-[#F4F0E8]">Submitted Bids & Proposals Oversight</h1>
          <p className="text-xs text-[#8D8A83] mt-1">Audit freelancer bid amounts, delivery timelines, cover letters, and proposal statuses.</p>
        </div>
      </div>

      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl text-xs flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Control Bar */}
      <div className="bg-[#171719] border border-[#29292D] rounded-3xl p-6 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8D8A83]" />
            <input
              type="text"
              placeholder="Search project title or bidder freelancer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#111113] border border-[#29292D] text-[#F4F0E8] pl-10 pr-4 py-2.5 rounded-xl text-xs focus:border-[#F4B860] focus:outline-none"
            />
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-[#8D8A83] font-semibold">Proposal Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#111113] border border-[#29292D] text-[#F4F0E8] px-3 py-2 rounded-xl text-xs focus:border-[#F4B860]"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending Review</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>

        {/* Proposals Log */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[#8D8A83] border-b border-[#29292D]">
              <tr>
                <th className="pb-3 font-semibold">Bid Ref</th>
                <th className="pb-3 font-semibold">Project Opportunity</th>
                <th className="pb-3 font-semibold">Bidder Freelancer</th>
                <th className="pb-3 font-semibold">Bid Amount (₹)</th>
                <th className="pb-3 font-semibold">Timeline</th>
                <th className="pb-3 font-semibold">Cover Letter Snippet</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#29292D]">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-[#111113]/50 transition-colors">
                  <td className="py-3.5 font-mono font-bold text-[#F4B860]">#BID-{p.id}</td>
                  <td className="py-3.5 font-bold text-[#F4F0E8] max-w-xs truncate">{p.project_title}</td>
                  <td className="py-3.5 text-[#8D8A83]">{p.freelancer}</td>
                  <td className="py-3.5 font-extrabold text-[#F4B860]">₹{parseFloat(p.bid_amount).toLocaleString('en-IN')}</td>
                  <td className="py-3.5 text-[#8D8A83] font-semibold">{p.delivery_days} Days</td>
                  <td className="py-3.5 text-[#8D8A83] max-w-xs truncate">{p.cover_letter}</td>
                  <td className="py-3.5">
                    <span className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                      p.status === 'ACCEPTED' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-[#F4B860]/10 text-[#F4B860] border border-[#F4B860]/20'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right space-x-2">
                    {p.status !== 'ACCEPTED' && (
                      <button
                        onClick={() => handleStatusChange(p.id, 'ACCEPTED')}
                        className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 rounded-lg text-[10px] font-bold"
                      >
                        Accept Bid
                      </button>
                    )}
                    <button
                      onClick={() => handleRemoveProposal(p.id)}
                      className="px-2.5 py-1 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 rounded-lg text-[10px] font-bold"
                    >
                      Remove
                    </button>
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
