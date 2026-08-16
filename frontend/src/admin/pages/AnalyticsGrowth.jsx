import React, { useState } from 'react';
import { TrendingUp, Users, DollarSign, Award, CheckCircle, ArrowUpRight, BarChart3, PieChart, Activity } from 'lucide-react';

export default function AnalyticsGrowth() {
  const [timeRange, setTimeRange] = useState('30d');

  const revenueGraph = [
    { month: 'Jan', revenue: 120000, clients: 12, freelancers: 18 },
    { month: 'Feb', revenue: 165000, clients: 15, freelancers: 22 },
    { month: 'Mar', revenue: 210000, clients: 19, freelancers: 28 },
    { month: 'Apr', revenue: 185000, clients: 16, freelancers: 25 },
    { month: 'May', revenue: 240000, clients: 24, freelancers: 34 },
    { month: 'Jun', revenue: 310000, clients: 32, freelancers: 45 },
    { month: 'Jul', revenue: 390000, clients: 41, freelancers: 58 },
    { month: 'Aug', revenue: 450000, clients: 52, freelancers: 72 },
  ];

  const maxRevenue = Math.max(...revenueGraph.map(d => d.revenue));
  const maxUserGrowth = Math.max(...revenueGraph.map(d => d.freelancers));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#171719] border border-[#29292D] rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div>
          <h1 className="text-2xl font-extrabold text-[#F4F0E8]">Analytics & Marketplace Growth Telemetry</h1>
          <p className="text-xs text-[#8D8A83] mt-1">Deep analysis of user registration trends, gross revenue billing growth, category market shares, and proposal conversions.</p>
        </div>

        <div className="flex items-center space-x-2 bg-[#111113] p-1 rounded-2xl border border-[#29292D] text-xs font-bold">
          {['7d', '30d', '3m', '1y'].map(r => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-3 py-1.5 rounded-xl transition-all ${timeRange === r ? 'bg-[#F4B860] text-[#0B0B0D]' : 'text-[#8D8A83]'}`}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#171719] border border-[#29292D] p-6 rounded-2xl space-y-2 shadow-lg">
          <div className="flex justify-between items-center text-[#8D8A83]">
            <span className="text-xs font-semibold">Gross Revenue Billing</span>
            <DollarSign className="w-4 h-4 text-[#F4B860]" />
          </div>
          <p className="text-3xl font-extrabold text-[#F4B860]">₹18.45L</p>
          <span className="text-[10px] text-emerald-400 font-bold block">+34.2% YoY Growth</span>
        </div>

        <div className="bg-[#171719] border border-[#29292D] p-6 rounded-2xl space-y-2 shadow-lg">
          <div className="flex justify-between items-center text-[#8D8A83]">
            <span className="text-xs font-semibold">User Acquisition Rate</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-3xl font-extrabold text-[#F4F0E8]">+124 Users</p>
          <span className="text-[10px] text-emerald-400 font-bold block">Clients & Verified Pros</span>
        </div>

        <div className="bg-[#171719] border border-[#29292D] p-6 rounded-2xl space-y-2 shadow-lg">
          <div className="flex justify-between items-center text-[#8D8A83]">
            <span className="text-xs font-semibold">Proposal Conversion</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-emerald-400">84.6%</p>
          <span className="text-[10px] text-[#8D8A83] block">Contract Bid Match</span>
        </div>

        <div className="bg-[#171719] border border-[#29292D] p-6 rounded-2xl space-y-2 shadow-lg">
          <div className="flex justify-between items-center text-[#8D8A83]">
            <span className="text-xs font-semibold">Escrow Retention</span>
            <Award className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-3xl font-extrabold text-cyan-400">99.4%</p>
          <span className="text-[10px] text-emerald-400 font-bold block">Zero Dispute Fraud</span>
        </div>
      </div>

      {/* GRAPH 1: Gross Billing & Revenue Graph */}
      <div className="bg-[#171719] border border-[#29292D] rounded-3xl p-8 space-y-6 shadow-2xl">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-[#F4F0E8]">Platform Financial Billing Volume (2026)</h3>
            <p className="text-xs text-[#8D8A83]">Monthly gross payments held and released across all 15 categories</p>
          </div>
          <div className="flex items-center space-x-4 text-xs">
            <span className="flex items-center space-x-1 text-[#F4B860]">
              <span className="w-3 h-3 rounded-full bg-[#F4B860] inline-block" />
              <span>Gross Volume (INR ₹)</span>
            </span>
          </div>
        </div>

        <div className="pt-6 pb-2">
          <div className="h-64 flex items-end justify-between gap-3 border-b border-[#29292D] pb-4">
            {revenueGraph.map(item => {
              const heightPercent = Math.max(Math.round((item.revenue / maxRevenue) * 100), 12);
              return (
                <div key={item.month} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-[#111113] border border-[#29292D] text-[10px] text-[#F4F0E8] px-2.5 py-1 rounded shadow whitespace-nowrap z-10 pointer-events-none">
                    ₹{item.revenue.toLocaleString('en-IN')}
                  </div>
                  <div className="w-full max-w-[48px] h-[190px] bg-[#111113] rounded-t-xl overflow-hidden flex items-end p-1 border border-[#29292D]">
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
      </div>

      {/* GRAPH 2: User Growth Line & Category Popularity Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* User Acquisition Graph */}
        <div className="bg-[#171719] border border-[#29292D] rounded-3xl p-8 space-y-6 shadow-2xl">
          <div>
            <h3 className="text-base font-bold text-[#F4F0E8]">User Registration & Talent Growth</h3>
            <p className="text-xs text-[#8D8A83]">New Client hirers vs new verified Freelancer pros</p>
          </div>

          <div className="pt-4">
            <div className="h-56 flex items-end justify-between gap-3 border-b border-[#29292D] pb-4">
              {revenueGraph.map(item => {
                const fHeight = Math.max(Math.round((item.freelancers / maxUserGrowth) * 100), 10);
                const cHeight = Math.max(Math.round((item.clients / maxUserGrowth) * 100), 10);
                return (
                  <div key={item.month} className="flex-1 flex flex-col items-center justify-end h-full">
                    <div className="w-full max-w-[40px] h-[160px] flex items-end justify-center gap-1.5">
                      <div className="w-full bg-[#111113] rounded-t overflow-hidden h-full flex items-end border border-[#29292D]">
                        <div style={{ height: `${fHeight}%` }} className="w-full bg-cyan-400 rounded-t transition-all duration-500" />
                      </div>
                      <div className="w-full bg-[#111113] rounded-t overflow-hidden h-full flex items-end border border-[#29292D]">
                        <div style={{ height: `${cHeight}%` }} className="w-full bg-indigo-400 rounded-t transition-all duration-500" />
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-[#8D8A83] mt-2">{item.month}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-center space-x-6 text-xs pt-4 font-semibold">
              <span className="flex items-center space-x-1 text-cyan-400">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" />
                <span>Freelancers</span>
              </span>
              <span className="flex items-center space-x-1 text-indigo-400">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 inline-block" />
                <span>Clients</span>
              </span>
            </div>
          </div>
        </div>

        {/* Category Market Breakdown */}
        <div className="bg-[#171719] border border-[#29292D] rounded-3xl p-8 space-y-6 shadow-2xl">
          <div>
            <h3 className="text-base font-bold text-[#F4F0E8]">Category Demand Breakdown</h3>
            <p className="text-xs text-[#8D8A83]">Market share volume across top categories</p>
          </div>

          <div className="space-y-4 text-xs">
            {[
              { name: 'IT & Technology', percentage: 38, count: '₹7.01 Lakhs', color: 'bg-emerald-400' },
              { name: 'Construction & Maintenance', percentage: 24, count: '₹4.42 Lakhs', color: 'bg-[#F4B860]' },
              { name: 'Creative & Design', percentage: 18, count: '₹3.32 Lakhs', color: 'bg-sky-400' },
              { name: 'Personal Services', percentage: 12, count: '₹2.21 Lakhs', color: 'bg-indigo-400' },
              { name: 'Writing & Content', percentage: 8, count: '₹1.47 Lakhs', color: 'bg-rose-400' }
            ].map(cat => (
              <div key={cat.name} className="space-y-1.5">
                <div className="flex justify-between text-[#8D8A83] font-semibold">
                  <span>{cat.name}</span>
                  <span className="text-[#F4F0E8] font-bold">{cat.count} ({cat.percentage}%)</span>
                </div>
                <div className="w-full bg-[#111113] h-2.5 rounded-full overflow-hidden border border-[#29292D]">
                  <div style={{ width: `${cat.percentage}%` }} className={`h-full ${cat.color} rounded-full`} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
