import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Briefcase, DollarSign, Users, MessageSquare, CheckCircle, PlusCircle } from 'lucide-react';

export default function DashboardClient() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get('/projects/?my_projects=true'),
      API.get('/profiles/clients/me/')
    ]).then(([projRes, profRes]) => {
      setProjects(projRes.data.results || projRes.data);
      setProfile(profRes.data);
    }).catch(err => console.error(err))
    .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#F4F0E8]">Client Dashboard</h1>
          <p className="text-sm text-[#8D8A83]">Welcome back, {user?.first_name || user?.username}. Manage your posted projects and hired talent.</p>
        </div>
        <Link to="/projects/post" className="btn-amber px-5 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2">
          <PlusCircle className="w-4 h-4" />
          <span>Post New Project</span>
        </Link>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-[#171719] border border-[#2A2A2E] p-6 rounded-2xl">
          <p className="text-xs font-medium text-[#8D8A83]">Total Projects Posted</p>
          <p className="text-3xl font-extrabold text-[#F4B860] mt-2">{projects.length}</p>
        </div>
        <div className="bg-[#171719] border border-[#2A2A2E] p-6 rounded-2xl">
          <p className="text-xs font-medium text-[#8D8A83]">Total Spent (₹)</p>
          <p className="text-3xl font-extrabold text-[#F4B860] mt-2">₹{parseFloat(profile?.total_spent || 0).toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-[#171719] border border-[#2A2A2E] p-6 rounded-2xl">
          <p className="text-xs font-medium text-[#8D8A83]">Active Contracts</p>
          <p className="text-3xl font-extrabold text-[#F4B860] mt-2">{projects.filter(p => p.status === 'ASSIGNED' || p.status === 'IN_PROGRESS').length}</p>
        </div>
      </div>

      {/* Posted Projects Table */}
      <div className="bg-[#171719] border border-[#2A2A2E] rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-[#F4F0E8]">My Posted Projects</h2>
        {projects.length === 0 ? (
          <p className="text-xs text-[#8D8A83]">No projects posted yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[#8D8A83] border-b border-[#2A2A2E]">
                <tr>
                  <th className="pb-3 font-semibold">Title</th>
                  <th className="pb-3 font-semibold">Budget</th>
                  <th className="pb-3 font-semibold">Bids</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2A2E]">
                {projects.map(p => (
                  <tr key={p.id}>
                    <td className="py-4 font-bold text-[#F4F0E8]">{p.title}</td>
                    <td className="py-4 text-[#F4B860]">₹{parseFloat(p.min_budget).toLocaleString('en-IN')} - ₹{parseFloat(p.max_budget).toLocaleString('en-IN')}</td>
                    <td className="py-4 text-[#8D8A83]">{p.proposals_count} proposals</td>
                    <td className="py-4">
                      <span className="bg-[#0B0B0D] border border-[#2A2A2E] text-[#F4B860] px-2.5 py-1 rounded-md text-[11px]">
                        {p.status}
                      </span>
                    </td>
                    <td className="py-4">
                      <Link to={`/projects/${p.id}`} className="text-[#F4B860] hover:underline font-semibold">
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
