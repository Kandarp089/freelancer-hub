import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';
import FreelancerCard from '../components/FreelancerCard';
import ProjectCard from '../components/ProjectCard';
import { Briefcase, ArrowLeft, Filter, PlusCircle, CheckCircle } from 'lucide-react';

const CATEGORY_BANNERS = {
  "Personal Services": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&q=80",
  "Construction & Maintenance": "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&q=80",
  "IT & Technology": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80",
  "Creative & Design": "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&q=80",
  "Writing & Content": "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&q=80",
  "Marketing": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
  "Business": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80",
  "Video & Audio": "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&q=80",
  "Engineering & Manufacturing": "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&q=80",
  "Healthcare & Wellness": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&q=80",
  "Agriculture": "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1200&q=80",
  "Household": "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&q=80",
  "Transportation": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&q=80",
  "Retail & Sales": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80",
  "Security": "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=1200&q=80"
};

export default function CategoryDetail() {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [freelancers, setFreelancers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [activeSubcategory, setActiveSubcategory] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setActiveSubcategory('ALL');
    API.get(`/categories/${slug}/`)
      .then(res => {
        setCategory(res.data);
        return Promise.all([
          API.get(`/profiles/freelancers/?category=${slug}`),
          API.get(`/projects/?category=${slug}`)
        ]);
      })
      .then(([freeRes, projRes]) => {
        setFreelancers(freeRes.data.results || freeRes.data);
        setProjects(projRes.data.results || projRes.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleSubcategoryFilter = (subSlug) => {
    setActiveSubcategory(subSlug);
    setLoading(true);

    const freeUrl = subSlug === 'ALL' 
      ? `/profiles/freelancers/?category=${slug}` 
      : `/profiles/freelancers/?category=${slug}&subcategory=${subSlug}`;

    const projUrl = subSlug === 'ALL'
      ? `/projects/?category=${slug}`
      : `/projects/?subcategory=${subSlug}`;

    Promise.all([API.get(freeUrl), API.get(projUrl)])
      .then(([freeRes, projRes]) => {
        setFreelancers(freeRes.data.results || freeRes.data);
        setProjects(projRes.data.results || projRes.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  if (loading && !category) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-[#8D8A83]">Loading category details...</div>;
  }

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-[#F4F0E8]">Category Not Found</h2>
        <Link to="/categories" className="text-[#F4B860] hover:underline text-sm">Back to Categories</Link>
      </div>
    );
  }

  const bannerImg = CATEGORY_BANNERS[category.name] || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <Link to="/categories" className="inline-flex items-center space-x-2 text-xs text-[#8D8A83] hover:text-[#F4B860] font-medium">
        <ArrowLeft className="w-4 h-4" />
        <span>All Categories</span>
      </Link>

      {/* Category Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-[#2A2A2E] shadow-2xl bg-[#171719]">
        <div className="h-64 sm:h-80 w-full relative overflow-hidden">
          <img src={bannerImg} alt={category.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#171719] via-[#171719]/80 to-transparent" />
        </div>

        <div className="p-8 sm:p-12 relative z-10 -mt-24">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-[#0B0B0D] border border-[#F4B860]/40 flex items-center justify-center text-[#F4B860] shadow-xl">
              <Briefcase className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-[#F4F0E8]">{category.name}</h1>
              <p className="text-xs text-[#F4B860] font-semibold mt-1">
                {category.subcategory_count} Subcategories • Verified Professional Marketplace
              </p>
            </div>
          </div>

          <p className="text-sm text-[#8D8A83] max-w-3xl leading-relaxed mt-2">{category.description}</p>

          {/* Subcategory Interactive Pills */}
          <div className="mt-8 space-y-2">
            <span className="text-xs font-bold text-[#F4F0E8] flex items-center space-x-1.5">
              <Filter className="w-3.5 h-3.5 text-[#F4B860]" />
              <span>Filter by Subcategory:</span>
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleSubcategoryFilter('ALL')}
                className={`text-xs font-bold px-4 py-2 rounded-xl transition-all border ${
                  activeSubcategory === 'ALL'
                    ? 'bg-[#F4B860] text-[#0B0B0D] border-[#F4B860] shadow-lg shadow-[#F4B860]/20'
                    : 'bg-[#0B0B0D] text-[#8D8A83] border-[#2A2A2E] hover:text-[#F4F0E8] hover:border-[#F4B860]'
                }`}
              >
                All Subcategories
              </button>

              {(category.subcategories || []).map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => handleSubcategoryFilter(sub.slug)}
                  className={`text-xs font-bold px-4 py-2 rounded-xl transition-all border ${
                    activeSubcategory === sub.slug
                      ? 'bg-[#F4B860] text-[#0B0B0D] border-[#F4B860] shadow-lg shadow-[#F4B860]/20'
                      : 'bg-[#0B0B0D] text-[#8D8A83] border-[#2A2A2E] hover:text-[#F4F0E8] hover:border-[#F4B860]'
                  }`}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Freelancers in this Category */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-[#F4F0E8]">Top Specialists in {category.name}</h2>
            <p className="text-xs text-[#8D8A83] mt-1">Verified professionals ready for hire in Indian Rupees (₹).</p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#171719] border border-[#2A2A2E] text-[#F4B860]">
            {freelancers.length} Specialists Available
          </span>
        </div>

        {freelancers.length === 0 ? (
          <div className="bg-[#171719] border border-[#2A2A2E] rounded-3xl p-12 text-center space-y-4">
            <p className="text-sm text-[#8D8A83]">No freelancers listed under this subcategory filter yet.</p>
            <button
              onClick={() => handleSubcategoryFilter('ALL')}
              className="text-xs font-bold text-[#F4B860] hover:underline"
            >
              Show all freelancers in {category.name}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {freelancers.map(f => <FreelancerCard key={f.id} freelancer={f} />)}
          </div>
        )}
      </div>

      {/* Open Projects in this Category */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-[#F4F0E8]">Open Projects in {category.name}</h2>
            <p className="text-xs text-[#8D8A83] mt-1">Active project postings with budget ranges and attachments.</p>
          </div>
          <Link
            to="/projects/post"
            className="inline-flex items-center space-x-2 btn-amber px-4 py-2 rounded-xl text-xs font-bold shadow-lg"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post a Project</span>
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="bg-[#171719] border border-[#2A2A2E] rounded-3xl p-12 text-center space-y-4">
            <p className="text-sm text-[#8D8A83]">No active project posts matching this subcategory filter.</p>
            <button
              onClick={() => handleSubcategoryFilter('ALL')}
              className="text-xs font-bold text-[#F4B860] hover:underline"
            >
              Show all open projects in {category.name}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map(p => <ProjectCard key={p.id} project={p} />)}
          </div>
        )}
      </div>

    </div>
  );
}
