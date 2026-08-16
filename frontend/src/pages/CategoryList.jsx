import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { Briefcase, ArrowRight, Layers, Sparkles } from 'lucide-react';

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/categories/')
      .then(res => setCategories(res.data.results || res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#F4F0E8] tracking-tight">
          Explore All Categories
        </h1>
        <p className="text-base text-[#8D8A83]">
          Browse our extensive database of categories spanning personal, technical, construction, and creative disciplines.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-48 bg-[#171719] rounded-2xl animate-pulse border border-[#2A2A2E]"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div key={cat.id} className="obsidian-card p-6 rounded-2xl flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#0B0B0D] border border-[#2A2A2E] flex items-center justify-center text-[#F4B860]">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <span className="text-xs bg-[#111113] border border-[#2A2A2E] text-[#8D8A83] px-2.5 py-1 rounded-full font-medium">
                    {cat.subcategory_count} subcategories
                  </span>
                </div>
                <h3 className="font-bold text-xl text-[#F4F0E8] group-hover:text-[#F4B860] transition-colors mb-2">
                  {cat.name}
                </h3>
                <p className="text-xs text-[#8D8A83] line-clamp-2 leading-relaxed mb-4">
                  {cat.description || `Connect with professionals specializing in ${cat.name}.`}
                </p>

                {/* Subcategories preview */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {(cat.subcategories || []).slice(0, 4).map((sub) => (
                    <span key={sub.id} className="text-[11px] bg-[#0B0B0D] text-[#8D8A83] px-2 py-0.5 rounded">
                      {sub.name}
                    </span>
                  ))}
                </div>
              </div>

              <Link
                to={`/categories/${cat.slug}`}
                className="w-full text-center bg-[#1D1D20] border border-[#2A2A2E] hover:border-[#F4B860] hover:bg-[#F4B860] text-[#F4F0E8] hover:text-[#0B0B0D] py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2"
              >
                <span>Browse {cat.name}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
