import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { Award, ShieldCheck, Search, Filter, CheckCircle, XCircle, FileText, Star, MapPin } from 'lucide-react';

export default function FreelancersManager() {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeSubTab, setActiveSubTab] = useState('all');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchFreelancers();
  }, []);

  const fetchFreelancers = () => {
    setLoading(true);
    API.get('/profiles/freelancers/')
      .then(res => setFreelancers(res.data.results || res.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const approveVerification = (freelancerId) => {
    setFreelancers(freelancers.map(f => f.id === freelancerId ? { ...f, user: { ...f.user, is_verified: true } } : f));
    setSuccessMsg(`Verification approved for Freelancer #${freelancerId}`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const rejectVerification = (freelancerId) => {
    setFreelancers(freelancers.map(f => f.id === freelancerId ? { ...f, user: { ...f.user, is_verified: false } } : f));
    setSuccessMsg(`Verification rejected for Freelancer #${freelancerId}`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const filtered = freelancers.filter(f => {
    const name = f.user?.first_name ? `${f.user.first_name} ${f.user.last_name}` : (f.user?.username || '');
    const matchesSearch = name.toLowerCase().includes(search.toLowerCase()) || (f.title || '').toLowerCase().includes(search.toLowerCase());
    if (activeSubTab === 'verification') return matchesSearch && f.user?.is_verified !== true;
    return matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#171719] border border-[#29292D] rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div>
          <h1 className="text-2xl font-extrabold text-[#F4F0E8]">Freelancers & Identity Verification</h1>
          <p className="text-xs text-[#8D8A83] mt-1">Manage verified freelancer talent, review identity documentation, and approve pro credentials.</p>
        </div>

        <div className="flex items-center space-x-2 bg-[#111113] p-1 rounded-2xl border border-[#29292D] text-xs font-bold">
          <button
            onClick={() => setActiveSubTab('all')}
            className={`px-4 py-2 rounded-xl transition-all ${activeSubTab === 'all' ? 'bg-[#F4B860] text-[#0B0B0D]' : 'text-[#8D8A83]'}`}
          >
            All Freelancers ({freelancers.length})
          </button>
          <button
            onClick={() => setActiveSubTab('verification')}
            className={`px-4 py-2 rounded-xl transition-all ${activeSubTab === 'verification' ? 'bg-[#F4B860] text-[#0B0B0D]' : 'text-[#8D8A83]'}`}
          >
            Verification Queue ({freelancers.filter(f => f.user?.is_verified !== true).length})
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl text-xs flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Control & Search */}
      <div className="bg-[#171719] border border-[#29292D] rounded-3xl p-6 space-y-6 shadow-2xl">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8D8A83]" />
          <input
            type="text"
            placeholder="Search freelancer name or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#111113] border border-[#29292D] text-[#F4F0E8] pl-10 pr-4 py-2.5 rounded-xl text-xs focus:border-[#F4B860] focus:outline-none"
          />
        </div>

        {/* Freelancers Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[#8D8A83] border-b border-[#29292D]">
              <tr>
                <th className="pb-3 font-semibold">Freelancer Details</th>
                <th className="pb-3 font-semibold">Specialization</th>
                <th className="pb-3 font-semibold">Hourly Rate (₹)</th>
                <th className="pb-3 font-semibold">Location</th>
                <th className="pb-3 font-semibold">Verification Badge</th>
                <th className="pb-3 font-semibold text-right">Verification Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#29292D]">
              {filtered.map(f => {
                const name = f.user?.first_name ? `${f.user.first_name} ${f.user.last_name}` : (f.user?.username || 'Verified Pro');
                const isVerified = f.user?.is_verified !== false;

                return (
                  <tr key={f.id} className="hover:bg-[#111113]/50 transition-colors">
                    <td className="py-3.5 font-bold text-[#F4F0E8]">
                      <div>{name}</div>
                      <div className="text-[11px] text-[#8D8A83] font-normal">{f.user?.email || 'freelancer@hub.com'}</div>
                    </td>
                    <td className="py-3.5 text-[#8D8A83]">{f.title || 'Technical Specialist'}</td>
                    <td className="py-3.5 font-extrabold text-[#F4B860]">
                      ₹{parseFloat(f.hourly_rate || 1200).toLocaleString('en-IN')}/hr
                    </td>
                    <td className="py-3.5 text-[#8D8A83]">{f.location || 'India'}</td>
                    <td className="py-3.5">
                      <span className={`px-2.5 py-1 rounded text-[10px] font-bold ${isVerified ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                        {isVerified ? 'Verified Pro' : 'Pending Verification'}
                      </span>
                    </td>
                    <td className="py-3.5 text-right space-x-2">
                      {!isVerified ? (
                        <button
                          onClick={() => approveVerification(f.id)}
                          className="px-3 py-1 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 rounded-lg font-bold"
                        >
                          Approve Identity
                        </button>
                      ) : (
                        <button
                          onClick={() => rejectVerification(f.id)}
                          className="px-3 py-1 bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 rounded-lg font-bold"
                        >
                          Revoke Badge
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
