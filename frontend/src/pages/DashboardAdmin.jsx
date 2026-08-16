import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { ShieldCheck, Users, Briefcase, AlertTriangle, CheckCircle } from 'lucide-react';

export default function DashboardAdmin() {
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get('/auth/users/'),
      API.get('/reports/')
    ]).then(([uRes, rRes]) => {
      setUsers(uRes.data.results || uRes.data);
      setReports(rRes.data.results || rRes.data);
    }).catch(err => console.error(err))
    .finally(() => setLoading(false));
  }, []);

  const toggleSuspend = async (userId) => {
    try {
      const res = await API.post(`/auth/users/${userId}/suspend/`);
      setUsers(users.map(u => u.id === userId ? { ...u, is_suspended: res.data.is_suspended } : u));
    } catch (err) {
      alert("Failed to update user status.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div>
        <h1 className="text-3xl font-extrabold text-[#F4F0E8]">Admin Control Panel</h1>
        <p className="text-sm text-[#8D8A83]">Platform oversight, user moderation, content reviews, and reporting analytics.</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-[#171719] border border-[#2A2A2E] p-6 rounded-2xl">
          <p className="text-xs font-medium text-[#8D8A83]">Registered Users</p>
          <p className="text-3xl font-extrabold text-[#F4B860] mt-2">{users.length}</p>
        </div>
        <div className="bg-[#171719] border border-[#2A2A2E] p-6 rounded-2xl">
          <p className="text-xs font-medium text-[#8D8A83]">Pending Reports</p>
          <p className="text-3xl font-extrabold text-red-400 mt-2">{reports.filter(r => r.status === 'PENDING').length}</p>
        </div>
        <div className="bg-[#171719] border border-[#2A2A2E] p-6 rounded-2xl">
          <p className="text-xs font-medium text-[#8D8A83]">Suspended Accounts</p>
          <p className="text-3xl font-extrabold text-[#F4B860] mt-2">{users.filter(u => u.is_suspended).length}</p>
        </div>
      </div>

      {/* User Management */}
      <div className="bg-[#171719] border border-[#2A2A2E] rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-[#F4F0E8]">User Accounts & Roles</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[#8D8A83] border-b border-[#2A2A2E]">
              <tr>
                <th className="pb-3 font-semibold">User</th>
                <th className="pb-3 font-semibold">Role</th>
                <th className="pb-3 font-semibold">Joined</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2E]">
              {users.map(u => (
                <tr key={u.id}>
                  <td className="py-3 font-bold text-[#F4F0E8]">{u.username} ({u.email})</td>
                  <td className="py-3 text-[#F4B860]">{u.role}</td>
                  <td className="py-3 text-[#8D8A83]">{new Date(u.date_joined).toLocaleDateString()}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${u.is_suspended ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                      {u.is_suspended ? 'Suspended' : 'Active'}
                    </span>
                  </td>
                  <td className="py-3">
                    <button
                      onClick={() => toggleSuspend(u.id)}
                      className={`px-3 py-1 rounded text-[11px] font-semibold ${u.is_suspended ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-400'}`}
                    >
                      {u.is_suspended ? 'Reactivate' : 'Suspend'}
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
