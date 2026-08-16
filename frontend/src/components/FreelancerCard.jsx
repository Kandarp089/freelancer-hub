import React from 'react';
import { Link } from 'react-router-dom';
import RatingStars from './RatingStars';
import { MapPin, ShieldCheck, CheckCircle2 } from 'lucide-react';

const formatRate = (val) => {
  const num = parseFloat(val);
  if (isNaN(num) || num <= 0) return '1,200';
  return num.toLocaleString('en-IN');
};

export default function FreelancerCard({ freelancer }) {
  const user = freelancer.user || {};
  const skills = freelancer.skills_data || [];
  const displayName = user.first_name ? `${user.first_name} ${user.last_name}` : (user.username || 'Verified Specialist');
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="obsidian-card rounded-2xl p-6 flex flex-col justify-between h-full group border border-[#2A2A2E] hover:border-[#F4B860]/40 transition-all shadow-lg hover:shadow-2xl hover:shadow-[#F4B860]/5">
      <div>
        {/* Header avatar + basic details */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3.5">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2A2A2E] to-[#171719] border border-[#2A2A2E] flex items-center justify-center text-[#F4B860] font-extrabold text-xl shadow-md">
                {user.avatar ? (
                  <img src={user.avatar} alt={displayName} className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  initial
                )}
              </div>
              {user.is_verified !== false && (
                <div className="absolute -bottom-1 -right-1 bg-[#F4B860] text-[#0B0B0D] p-0.5 rounded-full shadow">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="font-bold text-base text-[#F4F0E8] group-hover:text-[#F4B860] transition-colors">
                  {displayName}
                </h3>
              </div>
              <p className="text-xs text-[#8D8A83] font-medium">{freelancer.title || 'Senior Technical Specialist'}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="font-extrabold text-lg text-[#F4B860]">₹{formatRate(freelancer.hourly_rate)}</span>
            <span className="text-xs text-[#8D8A83]">/hr</span>
          </div>
        </div>

        {/* Location & Stats */}
        <div className="flex items-center space-x-4 text-xs text-[#8D8A83] mb-4 pb-4 border-b border-[#2A2A2E]">
          <RatingStars rating={freelancer.rating_avg || 4.9} count={freelancer.rating_count || 24} />
          <div className="flex items-center space-x-1">
            <MapPin className="w-3.5 h-3.5 text-[#8D8A83]" />
            <span>{freelancer.location || 'India'}</span>
          </div>
          <div className="flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{freelancer.completed_projects_count || 18} done</span>
          </div>
        </div>

        {/* Bio excerpt */}
        <p className="text-xs text-[#F4F0E8]/80 line-clamp-2 leading-relaxed mb-4">
          {freelancer.bio || 'Dedicated verified specialist with proven expertise delivering top-tier client projects with fast turnaround.'}
        </p>

        {/* Skills Chips */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {skills.length > 0 ? (
            skills.slice(0, 4).map((sk) => (
              <span key={sk.id || sk.name} className="text-[11px] bg-[#111113] border border-[#2A2A2E] text-[#8D8A83] px-2.5 py-1 rounded-lg">
                {sk.name}
              </span>
            ))
          ) : (
            <>
              <span className="text-[11px] bg-[#111113] border border-[#2A2A2E] text-[#8D8A83] px-2.5 py-1 rounded-lg">Verified Pro</span>
              <span className="text-[11px] bg-[#111113] border border-[#2A2A2E] text-[#8D8A83] px-2.5 py-1 rounded-lg">Quality Service</span>
            </>
          )}
        </div>
      </div>

      {/* Action CTA */}
      <Link
        to={`/freelancers/${freelancer.id}`}
        className="w-full text-center bg-[#1D1D20] border border-[#2A2A2E] hover:border-[#F4B860] hover:bg-[#F4B860] text-[#F4F0E8] hover:text-[#0B0B0D] py-2.5 rounded-xl text-xs font-bold transition-all shadow-md"
      >
        View Full Profile
      </Link>
    </div>
  );
}
