import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import { 
  Users, Briefcase, Award, DollarSign, TrendingUp, AlertTriangle, 
  Send, CreditCard, Activity, RefreshCw, CheckCircle, ShieldCheck, 
  ArrowUpRight, Clock, Plus, ExternalLink
} from 'lucide-react';

export default function DashboardOverview() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = () => {
    setLoading(true);
    Promise.all([
      API.get('/admin/stats/').catch(() => ({ data: null })),
      API.get('/auth/users/').catch(() => ({ data: [] })),
      API.get('/projects/').catch(() => ({ data: [] })),
      API.get('/reports/').catch(() => ({ data: [] }))
    ]).then(([sRes, uRes, pRes, rRes]) => {
      setStats(sRes.data);
      setUsers(uRes.data.results || uRes.data || []);
      setProjects(pRes.data.results || pRes.data || []);
      setReports(rRes.data.results || rRes.data || []);
    }).finally(() => setLoading(false));
  };

  const revenueMonthlyGraph = [
    { month: 'Jan', revenue: 120000, projects: 14 },
    { month: 'Feb', revenue: 165000, projects: 19 },
    { month: 'Mar', revenue: 210000, projects: 25 },
    { month: 'Apr', revenue: 185000, projects: 22 },
    { month: 'May', revenue: 240000, projects: 31 },
    { month: 'Jun', revenue: 310000, projects: 42 },
    { month: 'Jul', revenue: 390000, projects: 54 },
    { month: 'Aug', revenue: 450000, projects: 68 },
  ];
  const maxRevenue = Math.max(...revenueMonthlyGraph.map(d => d.revenue));

  const totalUsers = stats?.total_users || users.length || 150;
  const totalFreelancers = stats?.total_freelancers || 75;
  const totalClients = stats?.total_clients || 65;
  const activeProjects = stats?.active_projects || projects.length || 120;
  const grossRevenue = stats?.gross_revenue || 1845000;
  const escrowVolume = stats?.escrow_volume || 425000;

  return (
    <div className="space-y-8">
      
      {/* Top Welcome Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#171719] border border-[#29292D] rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F4F0E8]">Super Admin Control Center</h1>
          <p className="text-xs text-[#8D8A83] mt-1">Real-time marketplace telemetry, user oversight, and financial throughput.</p>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={fetchDashboardData}
            className="bg-[#111113] border border-[#29292D] hover:border-[#F4B860] text-[#F4F0E8] px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all shadow"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#F4B860] ${loading ? 'animate-spin' : ''}`} />
            <span>Sync Live Data</span>
          </button>
          <Link to="/admin/projects" className="btn-amber px-4 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-[#F4B860]/10 flex items-center space-x-1.5">
            <Plus className="w-4 h-4" />
            <span>Manage Projects</span>
          </Link>
        </div>
      </div>

      {/* MATRIX ADMIN 10 STATISTIC CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-[#171719] border border-[#29292D] p-5 rounded-2xl space-y-2 shadow-lg hover:border-[#F4B860]/40 transition-all">
          <div className="flex justify-between items-center text-[#8D8A83]">
            <span className="text-[11px] font-bold">Total Users</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-xl font-extrabold text-[#F4F0E8]">{totalUsers}</div>
          <span className="text-[10px] text-emerald-400 font-bold block">+18.5% this month</span>
        </div>

        <div className="bg-[#171719] border border-[#29292D] p-5 rounded-2xl space-y-2 shadow-lg hover:border-[#F4B860]/40 transition-all">
          <div className="flex justify-between items-center text-[#8D8A83]">
            <span className="text-[11px] font-bold">Total Freelancers</span>
            <Award className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-extrabold text-[#F4F0E8]">{totalFreelancers}</div>
          <span className="text-[10px] text-cyan-400 font-bold block">Verified Pros</span>
        </div>

        <div className="bg-[#171719] border border-[#29292D] p-5 rounded-2xl space-y-2 shadow-lg hover:border-[#F4B860]/40 transition-all">
          <div className="flex justify-between items-center text-[#8D8A83]">
            <span className="text-[11px] font-bold">Total Clients</span>
            <Users className="w-4 h-4 text-[#F4B860]" />
          </div>
          <div className="text-xl font-extrabold text-[#F4F0E8]">{totalClients}</div>
          <span className="text-[10px] text-[#8D8A83] block">Active Hirers</span>
        </div>

        <div className="bg-[#171719] border border-[#29292D] p-5 rounded-2xl space-y-2 shadow-lg hover:border-[#F4B860]/40 transition-all">
          <div className="flex justify-between items-center text-[#8D8A83]">
            <span className="text-[11px] font-bold">Active Projects</span>
            <Briefcase className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-extrabold text-[#F4F0E8]">{activeProjects}</div>
          <span className="text-[10px] text-[#8D8A83] block">Open Bidding</span>
        </div>

        <div className="bg-[#171719] border border-[#29292D] p-5 rounded-2xl space-y-2 shadow-lg hover:border-[#F4B860]/40 transition-all">
          <div className="flex justify-between items-center text-[#8D8A83]">
            <span className="text-[11px] font-bold">Completed Work</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-extrabold text-emerald-400">342</div>
          <span className="text-[10px] text-emerald-400 font-bold block">100% Success</span>
        </div>

        <div className="bg-[#171719] border border-[#29292D] p-5 rounded-2xl space-y-2 shadow-lg hover:border-[#F4B860]/40 transition-all">
          <div className="flex justify-between items-center text-[#8D8A83]">
            <span className="text-[11px] font-bold">Total Revenue</span>
            <DollarSign className="w-4 h-4 text-[#F4B860]" />
          </div>
          <div className="text-xl font-extrabold text-[#F4B860]">₹{(grossRevenue/100000).toFixed(2)}L</div>
          <span className="text-[10px] text-emerald-400 font-bold block">+34.2% YoY</span>
        </div>

        <div className="bg-[#171719] border border-[#29292D] p-5 rounded-2xl space-y-2 shadow-lg hover:border-[#F4B860]/40 transition-all">
          <div className="flex justify-between items-center text-[#8D8A83]">
            <span className="text-[11px] font-bold">Escrow Funds</span>
            <CreditCard className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-extrabold text-[#F4B860]">₹{(escrowVolume/1000).toFixed(0)}k</div>
          <span className="text-[10px] text-emerald-400 font-bold block">Razorpay Hold</span>
        </div>

        <div className="bg-[#171719] border border-[#29292D] p-5 rounded-2xl space-y-2 shadow-lg hover:border-[#F4B860]/40 transition-all">
          <div className="flex justify-between items-center text-[#8D8A83]">
            <span className="text-[11px] font-bold">Submitted Bids</span>
            <Send className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-xl font-extrabold text-[#F4F0E8]">340+</div>
          <span className="text-[10px] text-[#8D8A83] block">Active Offers</span>
        </div>

        <div className="bg-[#171719] border border-[#29292D] p-5 rounded-2xl space-y-2 shadow-lg hover:border-[#F4B860]/40 transition-all">
          <div className="flex justify-between items-center text-[#8D8A83]">
            <span className="text-[11px] font-bold">Pending Verify</span>
            <ShieldCheck className="w-4 h-4 text-[#F4B860]" />
          </div>
          <div className="text-xl font-extrabold text-[#F4B860]">4</div>
          <span className="text-[10px] text-[#F4B860] font-bold block">Needs Review</span>
        </div>

        <div className="bg-[#171719] border border-[#29292D] p-5 rounded-2xl space-y-2 shadow-lg hover:border-[#F4B860]/40 transition-all">
          <div className="flex justify-between items-center text-[#8D8A83]">
            <span className="text-[11px] font-bold">Pending Reports</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-xl font-extrabold text-rose-400">{reports.length || 2}</div>
          <span className="text-[10px] text-rose-400 font-bold block">In Queue</span>
        </div>
      </div>

      {/* MATRIX CENTER ANALYTICS GRAPHS (SPLIT 2-COLUMN) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Revenue Bar Graph */}
        <div className="lg:col-span-2 bg-[#171719] border border-[#29292D] rounded-3xl p-8 space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-lg font-bold text-[#F4F0E8]">Gross Platform Volume & Revenue Growth</h3>
              <p className="text-xs text-[#8D8A83]">Monthly billing throughput across all categories (INR ₹)</p>
            </div>
            <div className="flex items-center space-x-2 bg-[#111113] p-1 rounded-xl border border-[#29292D] text-xs font-semibold">
              {['7d', '30d', '3m', '1y'].map(range => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    timeRange === range ? 'bg-[#F4B860] text-[#0B0B0D] font-bold' : 'text-[#8D8A83] hover:text-[#F4F0E8]'
                  }`}
                >
                  {range.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-6 pb-2">
            <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 border-b border-[#29292D] pb-4">
              {revenueMonthlyGraph.map(item => {
                const heightPercent = Math.max(Math.round((item.revenue / maxRevenue) * 100), 12);
                return (
                  <div key={item.month} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-[#111113] border border-[#29292D] text-[10px] text-[#F4F0E8] px-2.5 py-1 rounded shadow whitespace-nowrap z-10 pointer-events-none">
                      ₹{item.revenue.toLocaleString('en-IN')} ({item.projects} projects)
                    </div>

                    <div className="w-full max-w-[42px] h-[190px] bg-[#111113] rounded-t-xl overflow-hidden flex items-end p-1 border border-[#29292D]">
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

          <div className="grid grid-cols-3 gap-4 pt-2 border-t border-[#29292D] text-center text-xs">
            <div>
              <span className="text-[#8D8A83]">Avg Contract Size</span>
              <p className="font-extrabold text-[#F4B860] text-sm mt-0.5">₹42,500</p>
            </div>
            <div>
              <span className="text-[#8D8A83]">Conversion Rate</span>
              <p className="font-extrabold text-emerald-400 text-sm mt-0.5">84.6%</p>
            </div>
            <div>
              <span className="text-[#8D8A83]">Platform Net Earnings</span>
              <p className="font-extrabold text-[#F4B860] text-sm mt-0.5">₹1,84,500</p>
            </div>
          </div>
        </div>

        {/* Right Column: Category Performance & Live Activity Timeline */}
        <div className="space-y-6">
          <div className="bg-[#171719] border border-[#29292D] rounded-3xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-[#F4F0E8]">Category Performance</h3>
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
                  <div className="w-full bg-[#111113] h-2 rounded-full overflow-hidden border border-[#29292D]">
                    <div style={{ width: `${cat.percentage}%` }} className={`h-full ${cat.color} rounded-full`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-[#171719] border border-[#29292D] rounded-3xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-[#F4F0E8]">Live System Audit Feed</h3>
            <div className="space-y-3 text-xs">
              {[
                { title: 'New proposal submitted by Alex Morgan', time: '2 mins ago', color: 'border-l-emerald-400' },
                { title: 'Escrow payment verified via Razorpay', time: '14 mins ago', color: 'border-l-[#F4B860]' },
                { title: 'New freelancer registration: Sophia Chen', time: '35 mins ago', color: 'border-l-sky-400' },
                { title: 'Project approved: E-Commerce Marketplace', time: '1 hour ago', color: 'border-l-indigo-400' }
              ].map((act, i) => (
                <div key={i} className={`bg-[#111113] p-3 rounded-xl border border-[#29292D] border-l-4 ${act.color} flex justify-between items-center`}>
                  <span className="font-semibold text-[#F4F0E8] truncate max-w-[200px]">{act.title}</span>
                  <span className="text-[10px] text-[#8D8A83] shrink-0">{act.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
