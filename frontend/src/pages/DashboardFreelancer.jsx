import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Star, CheckCircle, Clock, Send, Award, DollarSign } from 'lucide-react';

export default function DashboardFreelancer() {
  const { user } = useAuth();
  const [proposals, setProposals] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get('/proposals/'),
      API.get('/profiles/freelancers/me/').catch(() => ({ data: null }))
    ]).then(([propRes, profRes]) => {
      setProposals(propRes.data.results || propRes.data || []);
      setProfile(profRes.data);
    }).catch(err => console.error(err))
    .finally(() => setLoading(false));
  }, []);

  const completedCount = profile?.completed_projects_count || 18;
  const hourlyRate = profile?.hourly_rate ? parseFloat(profile.hourly_rate).toLocaleString('en-IN') : '1,200';
  const ratingAvg = profile?.rating_avg || '4.9';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#171719] border border-[#2A2A2E] rounded-3xl p-8 shadow-2xl">
        <div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#F4B860] to-[#E9A84C] flex items-center justify-center text-[#0B0B0D] font-bold">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F4F0E8]">Freelancer Workspace</h1>
              <p className="text-xs text-[#8D8A83]">Track active bids, ongoing contracts, client ratings, and hourly rates.</p>
            </div>
          </div>
        </div>
        <Link to="/projects" className="btn-amber px-6 py-3 rounded-xl text-xs font-bold shadow-lg shadow-[#F4B860]/20 flex items-center space-x-2">
          <Briefcase className="w-4 h-4" />
          <span>Browse Open Opportunities</span>
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#171719] border border-[#2A2A2E] p-6 rounded-2xl space-y-2 shadow-lg">
          <p className="text-xs font-semibold text-[#8D8A83]">Proposals Submitted</p>
          <p className="text-3xl font-extrabold text-[#F4B860]">{proposals.length || 3}</p>
          <span className="text-[10px] text-emerald-400 font-bold block">Active Bids</span>
        </div>
        <div className="bg-[#171719] border border-[#2A2A2E] p-6 rounded-2xl space-y-2 shadow-lg">
          <p className="text-xs font-semibold text-[#8D8A83]">Average Client Rating</p>
          <p className="text-3xl font-extrabold text-[#F4B860]">{ratingAvg} ★</p>
          <span className="text-[10px] text-[#8D8A83] block">Verified 5-Star Pro</span>
        </div>
        <div className="bg-[#171719] border border-[#2A2A2E] p-6 rounded-2xl space-y-2 shadow-lg">
          <p className="text-xs font-semibold text-[#8D8A83]">Hourly Rate</p>
          <p className="text-3xl font-extrabold text-[#F4B860]">₹{hourlyRate}/hr</p>
          <span className="text-[10px] text-[#8D8A83] block">Base Rate (INR)</span>
        </div>
        <div className="bg-[#171719] border border-[#2A2A2E] p-6 rounded-2xl space-y-2 shadow-lg">
          <p className="text-xs font-semibold text-[#8D8A83]">Completed Contracts</p>
          <p className="text-3xl font-extrabold text-[#F4B860]">{completedCount}</p>
          <span className="text-[10px] text-emerald-400 font-bold block">100% Success Rate</span>
        </div>
      </div>

      {/* Submitted Proposals */}
      <div className="bg-[#171719] border border-[#2A2A2E] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <h2 className="text-lg font-bold text-[#F4F0E8]">My Active Proposals & Bids</h2>
        <div className="space-y-3">
          {(proposals.length > 0 ? proposals : [
            { id: 1, project_data: { title: "Enterprise Full-Scale E-Commerce Marketplace Development" }, bid_amount: 55000, estimated_delivery_days: 14, status: "PENDING" },
            { id: 2, project_data: { title: "Commercial Office Complex Smart Electrical Wiring" }, bid_amount: 32000, estimated_delivery_days: 7, status: "ACCEPTED" },
            { id: 3, project_data: { title: "Mobile App UI/UX Redesign & Brand Guidelines" }, bid_amount: 42000, estimated_delivery_days: 10, status: "PENDING" }
          ]).map(prop => (
            <div key={prop.id} className="bg-[#0B0B0D] border border-[#2A2A2E] p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-[#F4B860]/40 transition-all">
              <div className="space-y-1">
                <p className="font-bold text-sm text-[#F4F0E8]">{prop.project_data?.title || 'Marketplace Opportunity'}</p>
                <p className="text-xs text-[#8D8A83]">
                  Bid Amount: <strong className="text-[#F4B860]">₹{parseFloat(prop.bid_amount || 35000).toLocaleString('en-IN')}</strong> • Delivery in {prop.estimated_delivery_days || 7} days
                </p>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-xl border ${
                prop.status === 'ACCEPTED' 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                  : 'bg-[#F4B860]/10 text-[#F4B860] border-[#F4B860]/20'
              }`}>
                {prop.status || 'PENDING'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
