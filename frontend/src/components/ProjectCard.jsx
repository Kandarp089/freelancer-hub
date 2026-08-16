import React from 'react';
import { Link } from 'react-router-dom';
import { Users, ArrowUpRight, Image as ImageIcon } from 'lucide-react';

export default function ProjectCard({ project }) {
  const category = project.category_data || {};
  const skills = project.skills_required_data || [];
  const imageUrl = project.image_url || (project.attachments && project.attachments[0]?.file_url);

  return (
    <div className="obsidian-card rounded-2xl overflow-hidden flex flex-col justify-between h-full group border border-[#2A2A2E] hover:border-[#F4B860]/40 transition-all shadow-lg hover:shadow-2xl hover:shadow-[#F4B860]/5">
      <div>
        {/* Project Thumbnail Image */}
        <div className="relative h-44 w-full bg-[#111113] overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-[#8D8A83] bg-gradient-to-br from-[#171719] to-[#0B0B0D]">
              <ImageIcon className="w-8 h-8 text-[#F4B860]/40 mb-1" />
              <span className="text-[11px] font-medium">Project Opportunity</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#171719] via-transparent to-black/30" />

          {/* Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-[#0B0B0D]/80 backdrop-blur-md text-[#F4B860] border border-[#F4B860]/30 shadow-md">
              {category.name || 'General'}
            </span>
            <span className="text-[11px] font-bold px-2 py-1 rounded-lg bg-[#0B0B0D]/80 backdrop-blur-md text-[#F4F0E8] border border-[#2A2A2E]">
              {project.budget_type === 'FIXED' ? 'Fixed Price' : 'Hourly Rate'}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6">
          <Link to={`/projects/${project.id}?apply=true`}>
            <h3 className="font-bold text-base text-[#F4F0E8] group-hover:text-[#F4B860] transition-colors mb-2 line-clamp-2 leading-snug">
              {project.title}
            </h3>
          </Link>

          <p className="text-xs text-[#8D8A83] line-clamp-2 leading-relaxed mb-4">
            {project.description}
          </p>

          {/* Budget */}
          <div className="mb-4">
            <span className="text-[11px] text-[#8D8A83] block mb-0.5">Budget Range</span>
            <span className="font-extrabold text-lg text-[#F4B860]">
              ₹{parseFloat(project.min_budget).toLocaleString('en-IN')} - ₹{parseFloat(project.max_budget).toLocaleString('en-IN')}
            </span>
          </div>

          {/* Skills Required */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {skills.slice(0, 3).map((sk) => (
              <span key={sk.id} className="text-[10px] font-semibold bg-[#111113] border border-[#2A2A2E] text-[#8D8A83] px-2 py-0.5 rounded-md">
                {sk.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer details */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-[#2A2A2E] bg-[#111113]/50 text-xs text-[#8D8A83]">
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1 font-medium">
            <Users className="w-3.5 h-3.5 text-[#F4B860]" />
            <span>{project.proposals_count} bids</span>
          </span>
          <span>• {project.location_type || 'Remote'}</span>
        </div>

        <Link
          to={`/projects/${project.id}?apply=true`}
          className="flex items-center space-x-1 btn-amber px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-md hover:scale-105 transition-transform"
        >
          <span>Apply Now</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
