import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../services/api';
import ProjectCard from '../components/ProjectCard';
import { Search, Filter } from 'lucide-react';

export default function ProjectList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const search = searchParams.get('search') || '';
  const selectedCat = searchParams.get('category') || '';
  const budgetType = searchParams.get('budget_type') || '';

  useEffect(() => {
    API.get('/categories/').then(res => setCategories(res.data.results || res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    let query = `/projects/?search=${encodeURIComponent(search)}`;
    if (selectedCat) query += `&category=${encodeURIComponent(selectedCat)}`;
    if (budgetType) query += `&budget_type=${budgetType}`;

    API.get(query)
      .then(res => setProjects(res.data.results || res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [search, selectedCat, budgetType]);

  const updateParam = (key, val) => {
    const nextParams = new URLSearchParams(searchParams);
    if (val) nextParams.set(key, val);
    else nextParams.delete(key);
    setSearchParams(nextParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-[#F4F0E8]">Browse Open Projects</h1>
        <p className="text-sm text-[#8D8A83] mt-1">Submit proposals and get hired for freelance contracts worldwide.</p>
      </div>

      {/* Toolbar */}
      <div className="bg-[#171719] border border-[#2A2A2E] p-4 rounded-2xl flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8D8A83]" />
          <input
            type="text"
            placeholder="Search projects by title or keyword..."
            value={search}
            onChange={(e) => updateParam('search', e.target.value)}
            className="w-full bg-[#0B0B0D] border border-[#2A2A2E] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#F4F0E8] placeholder-[#8D8A83] focus:outline-none focus:border-[#F4B860]"
          />
        </div>

        <select
          value={selectedCat}
          onChange={(e) => updateParam('category', e.target.value)}
          className="bg-[#0B0B0D] border border-[#2A2A2E] text-xs text-[#F4F0E8] px-3 py-2.5 rounded-xl focus:outline-none focus:border-[#F4B860]"
        >
          <option value="">All Categories</option>
          {categories.map(c => (
            <option key={c.id} value={c.slug}>{c.name}</option>
          ))}
        </select>

        <select
          value={budgetType}
          onChange={(e) => updateParam('budget_type', e.target.value)}
          className="bg-[#0B0B0D] border border-[#2A2A2E] text-xs text-[#F4F0E8] px-3 py-2.5 rounded-xl focus:outline-none focus:border-[#F4B860]"
        >
          <option value="">All Budget Types</option>
          <option value="FIXED">Fixed Price</option>
          <option value="HOURLY">Hourly Rate</option>
        </select>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-64 bg-[#171719] rounded-2xl animate-pulse border border-[#2A2A2E]"></div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-[#171719] border border-[#2A2A2E] rounded-2xl p-12 text-center text-[#8D8A83] space-y-2">
          <p className="text-lg font-bold text-[#F4F0E8]">No projects match your query</p>
          <p className="text-xs">Try adjusting your category or search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map(proj => (
            <ProjectCard key={proj.id} project={proj} />
          ))}
        </div>
      )}
    </div>
  );
}
