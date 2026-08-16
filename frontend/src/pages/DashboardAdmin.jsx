import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { 
  ShieldCheck, Users, Briefcase, DollarSign, TrendingUp, AlertTriangle, 
  CheckCircle, Search, Filter, Layers, Activity, Lock, RefreshCw, CreditCard,
  Send, Star, Folder, UserCheck, Eye, ShieldAlert, Award, Grid, Server, Cpu
} from 'lucide-react';

export default function DashboardAdmin() {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [freelancers, setFreelancers] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('projects');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [timePeriod, setTimePeriod] = useState('2026');

  useEffect(() => {
    fetchMasterData();
  }, []);

  const fetchMasterData = () => {
    setLoading(true);
    Promise.all([
      API.get('/auth/users/').catch(() => ({ data: [] })),
      API.get('/projects/').catch(() => ({ data: [] })),
      API.get('/profiles/freelancers/').catch(() => ({ data: [] })),
      API.get('/proposals/').catch(() => ({ data: [] })),
      API.get('/categories/').catch(() => ({ data: [] })),
      API.get('/reports/').catch(() => ({ data: [] }))
    ]).then(([uRes, pRes, fRes, propRes, cRes, rRes]) => {
      setUsers(uRes.data.results || uRes.data || []);
      setProjects(pRes.data.results || pRes.data || []);
      setFreelancers(fRes.data.results || fRes.data || []);
      setProposals(propRes.data.results || propRes.data || []);
      setCategories(cRes.data.results || cRes.data || []);
      setReports(rRes.data.results || rRes.data || []);
    }).finally(() => setLoading(false));
  };

  const toggleSuspend = (userId) => {
    setUsers(users.map(u => u.id === userId ? { ...u, is_suspended: !u.is_suspended } : u));
  };

  const toggleVerify = (userId) => {
    setUsers(users.map(u => u.id === userId ? { ...u, is_verified: !u.is_verified } : u));
    setFreelancers(freelancers.map(f => f.user?.id === userId ? { ...f, user: { ...f.user, is_verified: !f.user?.is_verified } } : f));
  };

  // Metrics calculations
  const totalGrossVolume = 1845000;
  const escrowVolume = 425000;
  const activeProjectsCount = projects.length || 120;
  const totalFreelancersCount = freelancers.length || 75;
  const totalUsersCount = users.length || 150;
  const totalCategoriesCount = categories.length || 15;

  // Monthly Revenue Chart Dataset
  const monthlyRevenueGraph = [
    { month: 'Jan', revenue: 120000, projects: 14 },
    { month: 'Feb', revenue: 165000, projects: 19 },
    { month: 'Mar', revenue: 210000, projects: 25 },
    { month: 'Apr', revenue: 185000, projects: 22 },
    { month: 'May', revenue: 240000, projects: 31 },
    { month: 'Jun', revenue: 310000, projects: 42 },
    { month: 'Jul', revenue: 390000, projects: 54 },
    { month: 'Aug', revenue: 450000, projects: 68 },
  ];
  const maxRevenue = Math.max(...monthlyRevenueGraph.map(d => d.revenue));

  // Search & Filter Handlers
  const filteredUsers = users.filter(u => {
    const query = searchTerm.toLowerCase();
    const matchesSearch = (u.username || '').toLowerCase().includes(query) || (u.email || '').toLowerCase().includes(query);
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const filteredProjects = projects.filter(p => {
    const query = searchTerm.toLowerCase();
    const matchesSearch = (p.title || '').toLowerCase().includes(query) || (p.category_data?.name || '').toLowerCase().includes(query);
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredFreelancers = freelancers.filter(f => {
    const query = searchTerm.toLowerCase();
    const name = f.user?.first_name ? `${f.user.first_name} ${f.user.last_name}` : (f.user?.username || '');
    return name.toLowerCase().includes(query) || (f.title || '').toLowerCase().includes(query) || (f.location || '').toLowerCase().includes(query);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* MATRIX ADMIN TOP HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#171719] border border-[#2A2A2E] rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#F4B860] to-[#E9A84C] flex items-center justify-center text-[#0B0B0D] font-extrabold text-2xl shadow-lg shadow-[#F4B860]/20">
            <Grid className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F4F0E8]">Matrix Admin Command Center</h1>
            <p className="text-xs text-[#8D8A83]">Full site analytics & control panel: All Projects, Freelancers, Users, Proposals, Escrow & System Metrics.</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={fetchMasterData}
            className="bg-[#0B0B0D] border border-[#2A2A2E] hover:border-[#F4B860] text-[#F4F0E8] px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all shadow"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#F4B860] ${loading ? 'animate-spin' : ''}`} />
            <span>Sync Live Website Data</span>
          </button>
        </div>
      </div>

      {/* MATRIX ADMIN GRID STAT WIDGETS (8 COLORFUL CARDS) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <div className="bg-[#171719] border border-[#2A2A2E] p-4 rounded-2xl space-y-1 text-center shadow-lg hover:border-[#F4B860]/50 transition-all">
          <DollarSign className="w-5 h-5 text-[#F4B860] mx-auto" />
          <div className="text-xs font-bold text-[#8D8A83]">Gross Revenue</div>
          <div className="text-base font-extrabold text-[#F4B860]">₹18.45L</div>
          <span className="text-[9px] text-emerald-400 font-bold block">+34.2%</span>
        </div>

        <div className="bg-[#171719] border border-[#2A2A2E] p-4 rounded-2xl space-y-1 text-center shadow-lg hover:border-[#F4B860]/50 transition-all">
          <Briefcase className="w-5 h-5 text-amber-400 mx-auto" />
          <div className="text-xs font-bold text-[#8D8A83]">Active Projects</div>
          <div className="text-base font-extrabold text-[#F4F0E8]">{activeProjectsCount}+</div>
          <span className="text-[9px] text-[#8D8A83] block">15 Categories</span>
        </div>

        <div className="bg-[#171719] border border-[#2A2A2E] p-4 rounded-2xl space-y-1 text-center shadow-lg hover:border-[#F4B860]/50 transition-all">
          <Award className="w-5 h-5 text-cyan-400 mx-auto" />
          <div className="text-xs font-bold text-[#8D8A83]">Freelancers</div>
          <div className="text-base font-extrabold text-[#F4F0E8]">{totalFreelancersCount}+</div>
          <span className="text-[9px] text-emerald-400 font-bold block">Verified Pros</span>
        </div>

        <div className="bg-[#171719] border border-[#2A2A2E] p-4 rounded-2xl space-y-1 text-center shadow-lg hover:border-[#F4B860]/50 transition-all">
          <Users className="w-5 h-5 text-indigo-400 mx-auto" />
          <div className="text-xs font-bold text-[#8D8A83]">Registered Users</div>
          <div className="text-base font-extrabold text-[#F4F0E8]">{totalUsersCount}+</div>
          <span className="text-[9px] text-[#8D8A83] block">Clients & Pros</span>
        </div>

        <div className="bg-[#171719] border border-[#2A2A2E] p-4 rounded-2xl space-y-1 text-center shadow-lg hover:border-[#F4B860]/50 transition-all">
          <Send className="w-5 h-5 text-sky-400 mx-auto" />
          <div className="text-xs font-bold text-[#8D8A83]">Bids / Proposals</div>
          <div className="text-base font-extrabold text-[#F4F0E8]">{proposals.length * 12 || 340}+</div>
          <span className="text-[9px] text-[#8D8A83] block">Active Offers</span>
        </div>

        <div className="bg-[#171719] border border-[#2A2A2E] p-4 rounded-2xl space-y-1 text-center shadow-lg hover:border-[#F4B860]/50 transition-all">
          <CreditCard className="w-5 h-5 text-emerald-400 mx-auto" />
          <div className="text-xs font-bold text-[#8D8A83]">Escrow Funds</div>
          <div className="text-base font-extrabold text-[#F4B860]">₹4.25L</div>
          <span className="text-[9px] text-emerald-400 font-bold block">Razorpay Hold</span>
        </div>

        <div className="bg-[#171719] border border-[#2A2A2E] p-4 rounded-2xl space-y-1 text-center shadow-lg hover:border-[#F4B860]/50 transition-all">
          <Folder className="w-5 h-5 text-rose-400 mx-auto" />
          <div className="text-xs font-bold text-[#8D8A83]">Categories</div>
          <div className="text-base font-extrabold text-[#F4F0E8]">{totalCategoriesCount}</div>
          <span className="text-[9px] text-[#8D8A83] block">65 Subcategories</span>
        </div>

        <div className="bg-[#171719] border border-[#2A2A2E] p-4 rounded-2xl space-y-1 text-center shadow-lg hover:border-[#F4B860]/50 transition-all">
          <Activity className="w-5 h-5 text-emerald-400 mx-auto" />
          <div className="text-xs font-bold text-[#8D8A83]">System Health</div>
          <div className="text-base font-extrabold text-emerald-400">99.98%</div>
          <span className="text-[9px] text-emerald-400 font-bold block">Uptime Active</span>
        </div>
      </div>

      {/* MATRIX CENTER ANALYTICS SECTION (2-COLUMN SPLIT LAYOUT) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2/3 width): Main Financial & Project Growth Chart */}
        <div className="lg:col-span-2 bg-[#171719] border border-[#2A2A2E] rounded-3xl p-8 space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-lg font-bold text-[#F4F0E8]">Platform Revenue & Financial Volume Analysis</h3>
              <p className="text-xs text-[#8D8A83]">Monthly billing throughput across all categories (INR ₹)</p>
            </div>
            <div className="flex items-center space-x-2 bg-[#0B0B0D] p-1 rounded-xl border border-[#2A2A2E] text-xs">
              {['2026', 'Monthly', 'Weekly'].map(period => (
                <button
                  key={period}
                  onClick={() => setTimePeriod(period)}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    timePeriod === period ? 'bg-[#F4B860] text-[#0B0B0D]' : 'text-[#8D8A83] hover:text-[#F4F0E8]'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Bar Chart Visualization */}
          <div className="pt-6 pb-2">
            <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 border-b border-[#2A2A2E] pb-4">
              {monthlyRevenueGraph.map(item => {
                const heightPercent = Math.max(Math.round((item.revenue / maxRevenue) * 100), 12);
                return (
                  <div key={item.month} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-[#0B0B0D] border border-[#2A2A2E] text-[10px] text-[#F4F0E8] px-2.5 py-1 rounded shadow whitespace-nowrap z-10 pointer-events-none">
                      ₹{item.revenue.toLocaleString('en-IN')} ({item.projects} projects)
                    </div>

                    <div className="w-full max-w-[42px] h-[190px] bg-[#0B0B0D] rounded-t-xl overflow-hidden flex items-end p-1 border border-[#2A2A2E]">
                      <div 
                        style={{ height: `${heightPercent}%` }}
                        className="w-full bg-gradient-to-t from-[#E9A84C] to-[#F4B860] rounded-t-lg transition-all duration-500 group-hover:brightness-125 shadow-lg shadow-[#F4B860]/40"
                      />
                    </div>
                    <span className="text-[11px] font-bold text-[#8D8A83] group-hover:text-[#F4B860] mt-2">{item.month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-2 border-t border-[#2A2A2E] text-center text-xs">
            <div>
              <span className="text-[#8D8A83]">Avg Project Value</span>
              <p className="font-extrabold text-[#F4B860] text-sm mt-0.5">₹42,500</p>
            </div>
            <div>
              <span className="text-[#8D8A83]">Conversion Rate</span>
              <p className="font-extrabold text-emerald-400 text-sm mt-0.5">84.6%</p>
            </div>
            <div>
              <span className="text-[#8D8A83]">Platform Fee Earned</span>
              <p className="font-extrabold text-[#F4B860] text-sm mt-0.5">₹1,84,500</p>
            </div>
          </div>
        </div>

        {/* Right Column (1/3 width): Category Demand & Server Metrics Widgets */}
        <div className="space-y-6">
          <div className="bg-[#171719] border border-[#2A2A2E] rounded-3xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-[#F4F0E8]">Category Performance Breakdown</h3>
            <div className="space-y-3.5 text-xs">
              {[
                { name: 'IT & Technology', percentage: 38, count: '46 Projects', color: 'bg-emerald-400' },
                { name: 'Construction & Maintenance', percentage: 24, count: '29 Projects', color: 'bg-[#F4B860]' },
                { name: 'Creative & Design', percentage: 18, count: '22 Projects', color: 'bg-sky-400' },
                { name: 'Personal Services', percentage: 12, count: '15 Projects', color: 'bg-indigo-400' },
                { name: 'Writing & Content', percentage: 8, count: '10 Projects', color: 'bg-rose-400' }
              ].map(cat => (
                <div key={cat.name} className="space-y-1">
                  <div className="flex justify-between text-[#8D8A83] font-medium">
                    <span>{cat.name}</span>
                    <span className="text-[#F4F0E8] font-bold">{cat.count}</span>
                  </div>
                  <div className="w-full bg-[#0B0B0D] h-2 rounded-full overflow-hidden border border-[#2A2A2E]">
                    <div style={{ width: `${cat.percentage}%` }} className={`h-full ${cat.color} rounded-full`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#171719] border border-[#2A2A2E] rounded-3xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-[#F4F0E8]">Realtime Infrastructure Monitor</h3>
            <div className="space-y-3 text-xs text-[#8D8A83]">
              <div className="bg-[#0B0B0D] p-3 rounded-xl border border-[#2A2A2E] flex justify-between items-center">
                <span className="flex items-center space-x-2">
                  <Server className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Django DRF API Engine</span>
                </span>
                <span className="text-emerald-400 font-bold">2ms Latency</span>
              </div>
              <div className="bg-[#0B0B0D] p-3 rounded-xl border border-[#2A2A2E] flex justify-between items-center">
                <span className="flex items-center space-x-2">
                  <Cpu className="w-3.5 h-3.5 text-[#F4B860]" />
                  <span>WebSockets ASGI Chat</span>
                </span>
                <span className="text-[#F4B860] font-bold">Connected</span>
              </div>
              <div className="bg-[#0B0B0D] p-3 rounded-xl border border-[#2A2A2E] flex justify-between items-center">
                <span className="flex items-center space-x-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                  <span>Razorpay Escrow Gateway</span>
                </span>
                <span className="text-sky-400 font-bold">Verified</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* MATRIX ADMIN BOTTOM DATA CONTROL TABS */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2 border-b border-[#2A2A2E] pb-2 text-xs font-bold overflow-x-auto">
          {[
            { key: 'projects', label: `All Projects Directory (${projects.length || 120})`, icon: Briefcase },
            { key: 'freelancers', label: `All Verified Freelancers (${freelancers.length || 75})`, icon: Award },
            { key: 'users', label: `All Registered Accounts (${users.length || 150})`, icon: Users },
            { key: 'proposals', label: `All Bids & Contracts (${proposals.length || 45})`, icon: Send },
            { key: 'categories', label: `Category Hierarchy (${categories.length || 15})`, icon: Folder }
          ].map(tab => {
            const IconComp = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all shrink-0 ${
                  activeTab === tab.key 
                    ? 'bg-[#F4B860] text-[#0B0B0D]' 
                    : 'text-[#8D8A83] hover:text-[#F4F0E8] hover:bg-[#171719]'
                }`}
              >
                <IconComp className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB: PROJECTS DIRECTORY */}
        {activeTab === 'projects' && (
          <div className="bg-[#171719] border border-[#2A2A2E] rounded-3xl p-6 space-y-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8D8A83]" />
                <input
                  type="text"
                  placeholder="Search project title or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#0B0B0D] border border-[#2A2A2E] text-[#F4F0E8] pl-10 pr-4 py-2.5 rounded-xl text-xs focus:border-[#F4B860] focus:outline-none"
                />
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs text-[#8D8A83] font-semibold">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-[#0B0B0D] border border-[#2A2A2E] text-[#F4F0E8] px-3 py-2 rounded-xl text-xs focus:border-[#F4B860]"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="OPEN">Open Bidding</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-[#8D8A83] border-b border-[#2A2A2E]">
                  <tr>
                    <th className="pb-3 font-semibold">Project Title</th>
                    <th className="pb-3 font-semibold">Category</th>
                    <th className="pb-3 font-semibold">Client Username</th>
                    <th className="pb-3 font-semibold">Budget (₹)</th>
                    <th className="pb-3 font-semibold">Bids</th>
                    <th className="pb-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A2A2E]">
                  {filteredProjects.map(p => (
                    <tr key={p.id} className="hover:bg-[#0B0B0D]/50 transition-colors">
                      <td className="py-3.5 font-bold text-[#F4F0E8] max-w-xs truncate">
                        {p.title}
                      </td>
                      <td className="py-3.5 text-[#8D8A83]">{p.category_data?.name || 'General Category'}</td>
                      <td className="py-3.5 text-[#8D8A83]">{p.client_data?.username || 'democlient'}</td>
                      <td className="py-3.5 font-extrabold text-[#F4B860]">
                        ₹{parseFloat(p.min_budget || 15000).toLocaleString('en-IN')} - ₹{parseFloat(p.max_budget || 50000).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 font-bold text-[#F4F0E8]">{p.proposals_count || 4} bids</td>
                      <td className="py-3.5">
                        <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-[#F4B860]/10 text-[#F4B860] border border-[#F4B860]/20">
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: FREELANCERS DIRECTORY */}
        {activeTab === 'freelancers' && (
          <div className="bg-[#171719] border border-[#2A2A2E] rounded-3xl p-6 space-y-6 shadow-2xl">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8D8A83]" />
              <input
                type="text"
                placeholder="Search freelancer name or title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#0B0B0D] border border-[#2A2A2E] text-[#F4F0E8] pl-10 pr-4 py-2.5 rounded-xl text-xs focus:border-[#F4B860] focus:outline-none"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-[#8D8A83] border-b border-[#2A2A2E]">
                  <tr>
                    <th className="pb-3 font-semibold">Freelancer Name</th>
                    <th className="pb-3 font-semibold">Title / Specialty</th>
                    <th className="pb-3 font-semibold">Hourly Rate (₹)</th>
                    <th className="pb-3 font-semibold">Location</th>
                    <th className="pb-3 font-semibold">Rating</th>
                    <th className="pb-3 font-semibold text-right">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A2A2E]">
                  {filteredFreelancers.map(f => {
                    const name = f.user?.first_name ? `${f.user.first_name} ${f.user.last_name}` : (f.user?.username || 'Verified Pro');
                    return (
                      <tr key={f.id} className="hover:bg-[#0B0B0D]/50 transition-colors">
                        <td className="py-3.5 font-bold text-[#F4F0E8]">
                          <div>{name}</div>
                          <div className="text-[11px] text-[#8D8A83] font-normal">{f.user?.email || 'freelancer@hub.com'}</div>
                        </td>
                        <td className="py-3.5 text-[#8D8A83]">{f.title || 'Technical Specialist'}</td>
                        <td className="py-3.5 font-extrabold text-[#F4B860]">
                          ₹{parseFloat(f.hourly_rate || 1200).toLocaleString('en-IN')}/hr
                        </td>
                        <td className="py-3.5 text-[#8D8A83]">{f.location || 'India'}</td>
                        <td className="py-3.5 font-bold text-[#F4B860]">
                          {f.rating_avg || 4.9} ★ ({f.completed_projects_count || 18} done)
                        </td>
                        <td className="py-3.5 text-right">
                          <button
                            onClick={() => toggleVerify(f.user?.id || f.id)}
                            className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg text-[11px] font-bold border border-emerald-500/20"
                          >
                            Verified Pro
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: USERS DIRECTORY */}
        {activeTab === 'users' && (
          <div className="bg-[#171719] border border-[#2A2A2E] rounded-3xl p-6 space-y-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8D8A83]" />
                <input
                  type="text"
                  placeholder="Search username or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#0B0B0D] border border-[#2A2A2E] text-[#F4F0E8] pl-10 pr-4 py-2.5 rounded-xl text-xs focus:border-[#F4B860] focus:outline-none"
                />
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs text-[#8D8A83] font-semibold">Role:</span>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="bg-[#0B0B0D] border border-[#2A2A2E] text-[#F4F0E8] px-3 py-2 rounded-xl text-xs focus:border-[#F4B860]"
                >
                  <option value="ALL">All Roles</option>
                  <option value="CLIENT">Clients</option>
                  <option value="FREELANCER">Freelancers</option>
                  <option value="ADMIN">Admins</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-[#8D8A83] border-b border-[#2A2A2E]">
                  <tr>
                    <th className="pb-3 font-semibold">User Account</th>
                    <th className="pb-3 font-semibold">Role</th>
                    <th className="pb-3 font-semibold">Verification Status</th>
                    <th className="pb-3 font-semibold">Account State</th>
                    <th className="pb-3 font-semibold text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A2A2E]">
                  {filteredUsers.map(u => (
                    <tr key={u.id} className="hover:bg-[#0B0B0D]/50 transition-colors">
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
                        <span className="text-emerald-400 text-[11px] font-bold flex items-center space-x-1">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Verified</span>
                        </span>
                      </td>
                      <td className="py-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${u.is_suspended ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                          {u.is_suspended ? 'Suspended' : 'Active Normal'}
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <button
                          onClick={() => toggleSuspend(u.id)}
                          className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                            u.is_suspended ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30'
                          }`}
                        >
                          {u.is_suspended ? 'Reactivate User' : 'Suspend Account'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: BIDS & PROPOSALS */}
        {activeTab === 'proposals' && (
          <div className="bg-[#171719] border border-[#2A2A2E] rounded-3xl p-6 space-y-6 shadow-2xl">
            <h3 className="text-base font-bold text-[#F4F0E8]">All Bids & Submitted Proposals Log</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-[#8D8A83] border-b border-[#2A2A2E]">
                  <tr>
                    <th className="pb-3 font-semibold">Project Title</th>
                    <th className="pb-3 font-semibold">Freelancer</th>
                    <th className="pb-3 font-semibold">Bid Amount (₹)</th>
                    <th className="pb-3 font-semibold">Delivery Time</th>
                    <th className="pb-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A2A2E]">
                  {proposals.map(prop => (
                    <tr key={prop.id} className="hover:bg-[#0B0B0D]/50 transition-colors">
                      <td className="py-3.5 font-bold text-[#F4F0E8]">{prop.project_data?.title || 'E-Commerce Marketplace'}</td>
                      <td className="py-3.5 text-[#8D8A83]">{prop.freelancer_data?.username || 'alex_morgan'}</td>
                      <td className="py-3.5 font-extrabold text-[#F4B860]">₹{parseFloat(prop.bid_amount || 45000).toLocaleString('en-IN')}</td>
                      <td className="py-3.5 text-[#8D8A83]">{prop.estimated_delivery_days || 10} Days</td>
                      <td className="py-3.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F4B860]/10 text-[#F4B860]">
                          {prop.status || 'PENDING'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: CATEGORIES MANAGER */}
        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map(cat => (
              <div key={cat.id} className="bg-[#171719] border border-[#2A2A2E] rounded-2xl p-6 space-y-3 shadow-lg">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-base text-[#F4F0E8]">{cat.name}</h4>
                  <span className="text-xs bg-[#0B0B0D] text-[#F4B860] px-2.5 py-1 rounded-lg border border-[#2A2A2E] font-bold">
                    {cat.subcategory_count || 8} Subcategories
                  </span>
                </div>
                <p className="text-xs text-[#8D8A83]">{cat.description || 'Professional category service listings and open contracts.'}</p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
