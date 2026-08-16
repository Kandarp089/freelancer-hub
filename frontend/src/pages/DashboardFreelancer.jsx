import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Star, CheckCircle, Clock } from 'lucide-react';

export default function DashboardFreelancer() {
  const { user } = useAuth();
  const [proposals, setProposals] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get('/proposals/'),
      API.get('/profiles/freelancers/me/')
    ]).then(([propRes, profRes]) => {
      setProposals(propRes.data.results || propRes.data);
      setProfile(profRes.data);
    }).catch(err => console.error(err))
    .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-[#F4F0E8]">Freelancer Dashboard</h1>
          <p className="text-sm text-[#8D8A83]">Manage your bids, active contracts, and profile reputation.</p>
        </div>
        <Link to="/projects" className="btn-amber px-5 py-2.5 rounded-xl text-xs font-bold">
          Find New Projects
        </Link>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="bg-[#171719] border border-[#2A2A2E] p-6 rounded-2xl">
          <p className="text-xs font-medium text-[#8D8A83]">Proposals Submitted</p>
          <p className="text-3xl font-extrabold text-[#F4B860] mt-2">{proposals.length}</p>
        </div>
        <div className="bg-[#171719] border border-[#2A2A2E] p-6 rounded-2xl">
          <p className="text-xs font-medium text-[#8D8A83]">Average Rating</p>
          <p className="text-3xl font-extrabold text-[#F4B860] mt-2">{profile?.rating_avg || '5.0'} ★</p>
        </div>
        <div className="bg-[#171719] border border-[#2A2A2E] p-6 rounded-2xl">
          <p className="text-xs font-medium text-[#8D8A83]">Hourly Rate</p>
          <p className="text-3xl font-extrabold text-[#F4B860] mt-2">₹{parseFloat(profile?.hourly_rate || 500).toLocaleString('en-IN')}/hr</p>
        </div>
        <div className="bg-[#171719] border border-[#2A2A2E] p-6 rounded-2xl">
          <p className="text-xs font-medium text-[#8D8A83]">Completed Work</p>
          <p className="text-3xl font-extrabold text-[#F4B860] mt-2">{profile?.completed_projects_count || 0}</p>
        </div>
      </div>

      {/* Submitted Proposals */}
      <div className="bg-[#171719] border border-[#2A2A2E] rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-[#F4F0E8]">My Submitted Proposals</h2>
        {proposals.length === 0 ? (
          <p className="text-xs text-[#8D8A83]">No active proposals yet.</p>
        ) : (
          <div className="space-y-3">
            {proposals.map(prop => (
              <div key={prop.id} className="bg-[#0B0B0D] border border-[#2A2A2E] p-4 rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm text-[#F4F0E8]">{prop.project_data?.title}</p>
                  <p className="text-xs text-[#8D8A83]">Bid: ₹{parseFloat(prop.bid_amount).toLocaleString('en-IN')} • Delivery: {prop.estimated_delivery_days} days</p>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded bg-[#F4B860]/10 text-[#F4B860] border border-[#F4B860]/20">
                  {prop.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
