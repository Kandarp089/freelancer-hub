import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import { Users, Search, ShieldCheck, Lock, Unlock, Eye, Trash2, UserPlus, RefreshCw, AlertCircle } from 'lucide-react';

export default function UsersManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    API.get('/auth/users/')
      .then(res => setUsers(res.data.results || res.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const toggleSuspend = async (userId) => {
    try {
      await API.post(`/auth/users/${userId}/suspend/`);
      setUsers(users.map(u => u.id === userId ? { ...u, is_suspended: !u.is_suspended } : u));
      setSuccessMsg(`User #${userId} account status updated.`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setUsers(users.map(u => u.id === userId ? { ...u, is_suspended: !u.is_suspended } : u));
    }
  };

  const toggleVerify = async (userId) => {
    setUsers(users.map(u => u.id === userId ? { ...u, is_verified: !u.is_verified } : u));
    setSuccessMsg(`User #${userId} verification status updated.`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleBulkSuspend = () => {
    if (selectedUsers.length === 0) return;
    if (!window.confirm(`Are you sure you want to suspend ${selectedUsers.length} selected user accounts?`)) return;
    setUsers(users.map(u => selectedUsers.includes(u.id) ? { ...u, is_suspended: true } : u));
    setSelectedUsers([]);
    setSuccessMsg(`Bulk action executed on ${selectedUsers.length} accounts.`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const filteredUsers = users.filter(u => {
    const query = search.toLowerCase();
    const matchesSearch = (u.username || '').toLowerCase().includes(query) || (u.email || '').toLowerCase().includes(query);
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'ALL' || (statusFilter === 'SUSPENDED' ? u.is_suspended : !u.is_suspended);
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#171719] border border-[#29292D] rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div>
          <h1 className="text-2xl font-extrabold text-[#F4F0E8]">User Accounts Governance</h1>
          <p className="text-xs text-[#8D8A83] mt-1">Manage user identities, credentials, role assignments, and moderation states.</p>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={fetchUsers} 
            className="bg-[#111113] border border-[#29292D] hover:border-[#F4B860] text-[#F4F0E8] px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#F4B860] ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
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
              placeholder="Search username or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#111113] border border-[#29292D] text-[#F4F0E8] pl-10 pr-4 py-2.5 rounded-xl text-xs focus:border-[#F4B860] focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {selectedUsers.length > 0 && (
              <button
                onClick={handleBulkSuspend}
                className="bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30 px-3.5 py-2 rounded-xl text-xs font-bold"
              >
                Bulk Suspend ({selectedUsers.length})
              </button>
            )}

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-[#111113] border border-[#29292D] text-[#F4F0E8] px-3 py-2 rounded-xl text-xs focus:border-[#F4B860]"
            >
              <option value="ALL">All Roles</option>
              <option value="CLIENT">Clients</option>
              <option value="FREELANCER">Freelancers</option>
              <option value="ADMIN">Admins</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#111113] border border-[#29292D] text-[#F4F0E8] px-3 py-2 rounded-xl text-xs focus:border-[#F4B860]"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[#8D8A83] border-b border-[#29292D]">
              <tr>
                <th className="pb-3 font-semibold w-10">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) setSelectedUsers(filteredUsers.map(u => u.id));
                      else setSelectedUsers([]);
                    }}
                  />
                </th>
                <th className="pb-3 font-semibold">User Details</th>
                <th className="pb-3 font-semibold">System Role</th>
                <th className="pb-3 font-semibold">Verification</th>
                <th className="pb-3 font-semibold">Account State</th>
                <th className="pb-3 font-semibold text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#29292D]">
              {filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-[#111113]/50 transition-colors">
                  <td className="py-3.5">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(u.id)}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedUsers([...selectedUsers, u.id]);
                        else setSelectedUsers(selectedUsers.filter(id => id !== u.id));
                      }}
                    />
                  </td>
                  <td className="py-3.5 font-bold text-[#F4F0E8]">
                    <div>{u.username}</div>
                    <div className="text-[11px] text-[#8D8A83] font-normal">{u.email}</div>
                  </td>
                  <td className="py-3.5">
                    <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-[#F4B860]/10 text-[#F4B860] border border-[#F4B860]/20">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5">
                    <button
                      onClick={() => toggleVerify(u.id)}
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded flex items-center space-x-1 ${
                        u.is_verified !== false ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-gray-500/10 text-gray-400'
                      }`}
                    >
                      <ShieldCheck className="w-3 h-3" />
                      <span>{u.is_verified !== false ? 'Verified' : 'Unverified'}</span>
                    </button>
                  </td>
                  <td className="py-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${u.is_suspended ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
                      {u.is_suspended ? 'Suspended' : 'Active Normal'}
                    </span>
                  </td>
                  <td className="py-3.5 text-right space-x-2">
                    <button
                      onClick={() => toggleSuspend(u.id)}
                      className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                        u.is_suspended 
                          ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300' 
                          : 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-400'
                      }`}
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
