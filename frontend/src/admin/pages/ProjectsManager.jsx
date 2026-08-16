import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { Briefcase, Search, Filter, ShieldCheck, Trash2, Eye, Star, AlertCircle } from 'lucide-react';

export default function ProjectsManager() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = () => {
    setLoading(true);
    API.get('/projects/')
      .then(res => setProjects(res.data.results || res.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleApproveProject = (projId) => {
    setProjects(projects.map(p => p.id === projId ? { ...p, status: 'OPEN' } : p));
    setSuccessMsg(`Project #${projId} approved & published.`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleToggleFeature = (projId) => {
    setProjects(projects.map(p => p.id === projId ? { ...p, is_featured: !p.is_featured } : p));
    setSuccessMsg(`Project #${projId} featured status updated.`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleDeleteProject = (projId) => {
    if (!window.confirm("Are you sure you want to remove this project contract?")) return;
    setProjects(projects.filter(p => p.id !== projId));
    setSuccessMsg(`Project #${projId} deleted.`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const filtered = projects.filter(p => {
    const query = search.toLowerCase();
    const matchesSearch = (p.title || '').toLowerCase().includes(query) || (p.category_data?.name || '').toLowerCase().includes(query);
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#171719] border border-[#29292D] rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div>
          <h1 className="text-2xl font-extrabold text-[#F4F0E8]">Projects Marketplace Oversight</h1>
          <p className="text-xs text-[#8D8A83] mt-1">Audit, approve, feature, and moderate all open and active contracts across 15 categories.</p>
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
              placeholder="Search project title or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#111113] border border-[#29292D] text-[#F4F0E8] pl-10 pr-4 py-2.5 rounded-xl text-xs focus:border-[#F4B860] focus:outline-none"
            />
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-[#8D8A83] font-semibold">Filter Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#111113] border border-[#29292D] text-[#F4F0E8] px-3 py-2 rounded-xl text-xs focus:border-[#F4B860]"
            >
              <option value="ALL">All Statuses</option>
              <option value="OPEN">Open Bidding</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[#8D8A83] border-b border-[#29292D]">
              <tr>
                <th className="pb-3 font-semibold">Project Title</th>
                <th className="pb-3 font-semibold">Category</th>
                <th className="pb-3 font-semibold">Client Username</th>
                <th className="pb-3 font-semibold">Budget Range (₹)</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#29292D]">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-[#111113]/50 transition-colors">
                  <td className="py-3.5 font-bold text-[#F4F0E8] max-w-xs truncate">
                    {p.title}
                  </td>
                  <td className="py-3.5 text-[#8D8A83]">{p.category_data?.name || 'General'}</td>
                  <td className="py-3.5 text-[#8D8A83]">{p.client_data?.username || 'Client User'}</td>
                  <td className="py-3.5 font-extrabold text-[#F4B860]">
                    ₹{parseFloat(p.min_budget || 15000).toLocaleString('en-IN')} - ₹{parseFloat(p.max_budget || 50000).toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5">
                    <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-[#F4B860]/10 text-[#F4B860] border border-[#F4B860]/20">
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right space-x-2">
                    <button
                      onClick={() => handleToggleFeature(p.id)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                        p.is_featured ? 'bg-amber-500/20 text-amber-300' : 'bg-[#111113] text-[#8D8A83] hover:text-[#F4F0E8]'
                      }`}
                    >
                      {p.is_featured ? '★ Featured' : 'Feature'}
                    </button>
                    <button
                      onClick={() => handleDeleteProject(p.id)}
                      className="px-2.5 py-1 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 rounded-lg font-bold"
                    >
                      Delete
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
