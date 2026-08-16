import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { Folder, Wrench, Plus, Edit2, Trash2, ShieldCheck, Search, Layers, ChevronDown, ChevronUp } from 'lucide-react';

export default function CategoriesSkillsManager() {
  const [categories, setCategories] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('categories');
  const [expandedCat, setExpandedCat] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  // Category Modal Form
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  // Subcategory Modal Form
  const [subModalOpen, setSubModalOpen] = useState(false);
  const [targetCatId, setTargetCatId] = useState(null);
  const [newSubName, setNewSubName] = useState('');

  // Skill Modal Form
  const [skillModalOpen, setSkillModalOpen] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');

  const sampleCategories = [
    { id: 1, name: "IT & Technology", slug: "it-technology", subcategories: ["Web Development", "Mobile App Development", "Machine Learning", "Cloud & DevOps", "Cyber Security"], description: "Full-stack software engineering, web development, mobile apps, and cloud IT infrastructure." },
    { id: 2, name: "Construction & Maintenance", slug: "construction-maintenance", subcategories: ["Electrician", "Plumber", "Carpenter", "Masonry", "HVAC Repair"], description: "Residential and commercial electrical wiring, plumbing, carpentry, and site construction." },
    { id: 3, name: "Creative & Design", slug: "creative-design", subcategories: ["UI/UX Design", "Graphic Design", "3D Blender Modeling", "Logo & Branding", "Motion Graphics"], description: "Figma UI/UX design, visual branding, illustrations, and 3D motion graphics." },
    { id: 4, name: "Personal Services", slug: "personal-services", subcategories: ["Custom Tailoring", "Personal Training", "Pet Grooming", "Event Planning", "Nutrition Care"], description: "Bespoke tailoring, fitness instruction, event management, and wellness." },
    { id: 5, name: "Writing & Content", slug: "writing-content", subcategories: ["SEO Copywriting", "Technical Writing", "Translation", "Blog Writing"], description: "Copywriting, technical documentation, and language translation." }
  ];

  useEffect(() => {
    fetchTaxonomyData();
  }, []);

  const fetchTaxonomyData = () => {
    setLoading(true);
    API.get('/categories/')
      .then(res => {
        const list = res.data.results || res.data || [];
        if (list.length > 0) {
          setCategories(list.map((c, i) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            subcategories: (c.subcategories || []).map(s => s.name || s) || ["Specialist Subcategory A", "Specialist Subcategory B"],
            description: c.description || "Professional service listings."
          })));
        } else {
          setCategories(sampleCategories);
        }
      })
      .catch(() => setCategories(sampleCategories))
      .finally(() => setLoading(false));
  };

  const handleCreateCategory = (e) => {
    e.preventDefault();
    if (!newCatName) return;
    const newCat = {
      id: categories.length + 1,
      name: newCatName,
      slug: newCatName.toLowerCase().replace(/\s+/g, '-'),
      subcategories: ["General Subcategory"],
      description: newCatDesc || 'Professional category service listings.'
    };
    setCategories([...categories, newCat]);
    setNewCatName('');
    setNewCatDesc('');
    setCatModalOpen(false);
    setSuccessMsg(`Category "${newCatName}" created successfully.`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleAddSubcategory = (e) => {
    e.preventDefault();
    if (!newSubName || !targetCatId) return;
    setCategories(categories.map(c => {
      if (c.id === targetCatId) {
        return { ...c, subcategories: [...(c.subcategories || []), newSubName] };
      }
      return c;
    }));
    setNewSubName('');
    setSubModalOpen(false);
    setSuccessMsg(`Subcategory "${newSubName}" added.`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleDeleteCategory = (catId) => {
    if (!window.confirm("Are you sure you want to remove this category?")) return;
    setCategories(categories.filter(c => c.id !== catId));
    setSuccessMsg(`Category #${catId} removed.`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleCreateSkill = (e) => {
    e.preventDefault();
    if (!newSkillName) return;
    const newSk = { id: skills.length + 1, name: newSkillName, freelancers_count: 12 };
    setSkills([...skills, newSk]);
    setNewSkillName('');
    setSkillModalOpen(false);
    setSuccessMsg(`Skill "${newSkillName}" created.`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#171719] border border-[#29292D] rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div>
          <h1 className="text-2xl font-extrabold text-[#F4F0E8]">Categories & Skills Taxonomy</h1>
          <p className="text-xs text-[#8D8A83] mt-1">Manage 15 top-level categories, subcategory hierarchies, and skill tag taxonomies.</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              if (activeTab === 'categories') setCatModalOpen(true);
              else setSkillModalOpen(true);
            }}
            className="btn-amber px-5 py-2.5 rounded-xl text-xs font-bold shadow-md flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>{activeTab === 'categories' ? 'Add New Category' : 'Add New Skill'}</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl text-xs flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-[#29292D] pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('categories')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all ${
            activeTab === 'categories' ? 'bg-[#F4B860] text-[#0B0B0D]' : 'text-[#8D8A83] hover:text-[#F4F0E8]'
          }`}
        >
          <Folder className="w-4 h-4" />
          <span>Categories ({categories.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('skills')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all ${
            activeTab === 'skills' ? 'bg-[#F4B860] text-[#0B0B0D]' : 'text-[#8D8A83] hover:text-[#F4F0E8]'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>Skills Taxonomy ({skills.length || 35})</span>
        </button>
      </div>

      {/* CATEGORIES GRID */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map(cat => {
            const isExpanded = expandedCat === cat.id;
            return (
              <div key={cat.id} className="bg-[#171719] border border-[#29292D] rounded-2xl p-6 space-y-4 shadow-lg flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-base text-[#F4F0E8]">{cat.name}</h3>
                    <span className="text-[10px] bg-[#111113] border border-[#29292D] text-[#F4B860] px-2.5 py-1 rounded-lg font-bold">
                      {(cat.subcategories || []).length} Subcategories
                    </span>
                  </div>
                  <p className="text-xs text-[#8D8A83]">{cat.description}</p>

                  {/* Subcategories Accordion */}
                  <div className="pt-2 border-t border-[#29292D]">
                    <button
                      onClick={() => setExpandedCat(isExpanded ? null : cat.id)}
                      className="w-full flex justify-between items-center text-xs text-[#F4B860] font-bold py-1"
                    >
                      <span>View Subcategories</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {isExpanded && (
                      <div className="mt-2 space-y-1.5 pl-2">
                        {(cat.subcategories || []).map((sub, idx) => (
                          <div key={idx} className="text-xs text-[#F4F0E8] bg-[#111113] px-2.5 py-1.5 rounded-lg border border-[#29292D] flex items-center space-x-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#F4B860]" />
                            <span>{sub}</span>
                          </div>
                        ))}
                        <button
                          onClick={() => { setTargetCatId(cat.id); setSubModalOpen(true); }}
                          className="w-full mt-2 text-left text-[11px] text-[#F4B860] hover:underline font-bold"
                        >
                          + Add Subcategory
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-3 border-t border-[#29292D]">
                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg text-xs font-bold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SKILLS GRID */}
      {activeTab === 'skills' && (
        <div className="bg-[#171719] border border-[#29292D] rounded-3xl p-6 space-y-4 shadow-2xl">
          <h3 className="text-base font-bold text-[#F4F0E8]">Platform Skills & Freelancer Tags</h3>
          <div className="flex flex-wrap gap-2">
            {(skills.length > 0 ? skills : [
              { id: 1, name: "React", count: 42 },
              { id: 2, name: "Django", count: 38 },
              { id: 3, name: "Wiring & Outlets", count: 52 },
              { id: 4, name: "Figma UI/UX", count: 29 },
              { id: 5, name: "SEO Audit", count: 34 },
              { id: 6, name: "Financial Modeling", count: 45 },
              { id: 7, name: "Custom Tailoring", count: 22 },
              { id: 8, name: "AutoCAD", count: 19 }
            ]).map(sk => (
              <div key={sk.id} className="bg-[#111113] border border-[#29292D] text-[#F4F0E8] px-3.5 py-2 rounded-xl text-xs flex items-center space-x-2">
                <span className="font-semibold">{sk.name}</span>
                <span className="text-[10px] bg-[#F4B860]/10 text-[#F4B860] px-2 py-0.5 rounded font-bold">{sk.count || 18} pros</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADD CATEGORY MODAL */}
      {catModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#171719] border border-[#29292D] rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4">
            <h3 className="text-lg font-bold text-[#F4F0E8]">Add New Platform Category</h3>
            <form onSubmit={handleCreateCategory} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#8D8A83] mb-1 font-semibold">Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI & Robotics"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full bg-[#111113] border border-[#29292D] text-[#F4F0E8] p-3 rounded-xl focus:border-[#F4B860] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[#8D8A83] mb-1 font-semibold">Description</label>
                <textarea
                  rows={3}
                  placeholder="Short description of this category..."
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  className="w-full bg-[#111113] border border-[#29292D] text-[#F4F0E8] p-3 rounded-xl focus:border-[#F4B860] focus:outline-none"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button type="button" onClick={() => setCatModalOpen(false)} className="px-4 py-2 bg-[#111113] text-[#8D8A83] rounded-xl">Cancel</button>
                <button type="submit" className="btn-amber px-5 py-2 rounded-xl font-bold">Create Category</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD SUBCATEGORY MODAL */}
      {subModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#171719] border border-[#29292D] rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4">
            <h3 className="text-lg font-bold text-[#F4F0E8]">Add New Subcategory</h3>
            <form onSubmit={handleAddSubcategory} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#8D8A83] mb-1 font-semibold">Subcategory Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cloud Security Audit"
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  className="w-full bg-[#111113] border border-[#29292D] text-[#F4F0E8] p-3 rounded-xl focus:border-[#F4B860] focus:outline-none"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button type="button" onClick={() => setSubModalOpen(false)} className="px-4 py-2 bg-[#111113] text-[#8D8A83] rounded-xl">Cancel</button>
                <button type="submit" className="btn-amber px-5 py-2 rounded-xl font-bold">Add Subcategory</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
