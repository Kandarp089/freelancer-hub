import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../services/api';
import FreelancerCard from '../components/FreelancerCard';
import { Search, Filter, SlidersHorizontal, Star } from 'lucide-react';

export default function FreelancerList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [freelancers, setFreelancers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const search = searchParams.get('search') || '';
  const selectedCat = searchParams.get('category') || '';
  const minRate = searchParams.get('min_rate') || '';
  const maxRate = searchParams.get('max_rate') || '';
  const minRating = searchParams.get('min_rating') || '';

  useEffect(() => {
    API.get('/categories/').then(res => setCategories(res.data.results || res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    let query = `/profiles/freelancers/?search=${encodeURIComponent(search)}`;
    if (selectedCat) query += `&category=${encodeURIComponent(selectedCat)}`;
    if (minRate) query += `&min_rate=${minRate}`;
    if (maxRate) query += `&max_rate=${maxRate}`;
    if (minRating) query += `&min_rating=${minRating}`;

    API.get(query)
      .then(res => setFreelancers(res.data.results || res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [search, selectedCat, minRate, maxRate, minRating]);

  const updateParam = (key, val) => {
    const nextParams = new URLSearchParams(searchParams);
    if (val) {
      nextParams.set(key, val);
    } else {
      nextParams.delete(key);
    }
    setSearchParams(nextParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#F4F0E8]">Find Top Freelancers</h1>
        <p className="text-sm text-[#8D8A83] mt-1">Discover verified experts across engineering, design, maintenance, and consulting.</p>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-[#171719] border border-[#2A2A2E] p-4 rounded-2xl flex flex-wrap items-center gap-4">
        {/* Keyword Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8D8A83]" />
          <input
            type="text"
            placeholder="Search by name, skill, or title..."
            value={search}
            onChange={(e) => updateParam('search', e.target.value)}
            className="w-full bg-[#0B0B0D] border border-[#2A2A2E] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#F4F0E8] placeholder-[#8D8A83] focus:outline-none focus:border-[#F4B860]"
          />
        </div>

        {/* Category Select */}
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

        {/* Hourly Rate Min/Max */}
        <div className="flex items-center space-x-2">
          <input
            type="number"
            placeholder="Min ₹/hr"
            value={minRate}
            onChange={(e) => updateParam('min_rate', e.target.value)}
            className="w-24 bg-[#0B0B0D] border border-[#2A2A2E] text-xs text-[#F4F0E8] px-3 py-2.5 rounded-xl focus:outline-none focus:border-[#F4B860]"
          />
          <span className="text-[#8D8A83] text-xs">-</span>
          <input
            type="number"
            placeholder="Max ₹/hr"
            value={maxRate}
            onChange={(e) => updateParam('max_rate', e.target.value)}
            className="w-24 bg-[#0B0B0D] border border-[#2A2A2E] text-xs text-[#F4F0E8] px-3 py-2.5 rounded-xl focus:outline-none focus:border-[#F4B860]"
          />
        </div>

        {/* Minimum Rating */}
        <select
          value={minRating}
          onChange={(e) => updateParam('min_rating', e.target.value)}
          className="bg-[#0B0B0D] border border-[#2A2A2E] text-xs text-[#F4F0E8] px-3 py-2.5 rounded-xl focus:outline-none focus:border-[#F4B860]"
        >
          <option value="">Any Rating</option>
          <option value="4.5">4.5★ & Above</option>
          <option value="4.8">4.8★ & Above</option>
        </select>
      </div>

      {/* Freelancers Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-72 bg-[#171719] rounded-2xl animate-pulse border border-[#2A2A2E]"></div>
          ))}
        </div>
      ) : freelancers.length === 0 ? (
        <div className="bg-[#171719] border border-[#2A2A2E] rounded-2xl p-12 text-center text-[#8D8A83] space-y-2">
          <p className="text-lg font-bold text-[#F4F0E8]">No freelancers found</p>
          <p className="text-xs">Try clearing or adjusting your search filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {freelancers.map(free => (
            <FreelancerCard key={free.id} freelancer={free} />
          ))}
        </div>
      )}
    </div>
  );
}
