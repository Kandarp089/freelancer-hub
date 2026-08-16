import React, { useState } from 'react';
import { Layers, Image, ShieldCheck, Search, Star, ExternalLink, Trash2, Eye } from 'lucide-react';

export default function ServicesPortfolioManager() {
  const [activeTab, setActiveTab] = useState('services');
  const [successMsg, setSuccessMsg] = useState('');

  const [services, setServices] = useState([
    { id: 1, title: 'Complete Full-Stack E-Commerce Web App Package', category: 'IT & Technology', freelancer: 'Alex Morgan', price: 25000, delivery_days: 5, status: 'APPROVED', is_featured: true },
    { id: 2, title: 'Commercial Office Smart Wiring & Electrical Setup', category: 'Construction & Maintenance', freelancer: 'Sophia Chen', price: 18000, delivery_days: 3, status: 'APPROVED', is_featured: true },
    { id: 3, title: 'Corporate Identity & Figma Mobile UI/UX Design System', category: 'Creative & Design', freelancer: 'Priya Patel', price: 15000, delivery_days: 4, status: 'APPROVED', is_featured: false },
    { id: 4, title: 'German & English Corporate Translation Service', category: 'Writing & Content', freelancer: 'Elena Russo', price: 8000, delivery_days: 2, status: 'APPROVED', is_featured: false }
  ]);

  const [portfolios, setPortfolios] = useState([
    { id: 101, title: 'FinTech Investment Banking Dashboard', freelancer: 'Alex Morgan', tags: ['React', 'Tailwind', 'Django'], image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80', status: 'APPROVED' },
    { id: 102, title: 'Smart Industrial Solar Substation Wiring', freelancer: 'Sophia Chen', tags: ['Electrical', 'Industrial', 'Wiring'], image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80', status: 'APPROVED' },
    { id: 103, title: 'Luxury Hotel Mobile Booking App Design', freelancer: 'Priya Patel', tags: ['Figma', 'UI/UX', 'Mobile'], image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80', status: 'APPROVED' }
  ]);

  const toggleFeatureService = (id) => {
    setServices(services.map(s => s.id === id ? { ...s, is_featured: !s.is_featured } : s));
    setSuccessMsg(`Service #${id} featured status updated.`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const deleteService = (id) => {
    if (!window.confirm("Delete this fixed-price service package?")) return;
    setServices(services.filter(s => s.id !== id));
    setSuccessMsg(`Service #${id} deleted.`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const deletePortfolio = (id) => {
    if (!window.confirm("Remove this portfolio item from platform showcase?")) return;
    setPortfolios(portfolios.filter(p => p.id !== id));
    setSuccessMsg(`Portfolio item #${id} removed.`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#171719] border border-[#29292D] rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div>
          <h1 className="text-2xl font-extrabold text-[#F4F0E8]">Services & Portfolio Moderation</h1>
          <p className="text-xs text-[#8D8A83] mt-1">Audit fixed-price service packages offered by freelancers and moderate portfolio showcase items.</p>
        </div>

        <div className="flex items-center space-x-2 bg-[#111113] p-1 rounded-2xl border border-[#29292D] text-xs font-bold">
          <button
            onClick={() => setActiveTab('services')}
            className={`px-4 py-2 rounded-xl transition-all ${activeTab === 'services' ? 'bg-[#F4B860] text-[#0B0B0D]' : 'text-[#8D8A83]'}`}
          >
            Fixed Services ({services.length})
          </button>
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`px-4 py-2 rounded-xl transition-all ${activeTab === 'portfolio' ? 'bg-[#F4B860] text-[#0B0B0D]' : 'text-[#8D8A83]'}`}
          >
            Portfolio Items ({portfolios.length})
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl text-xs flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* SERVICES TAB */}
      {activeTab === 'services' && (
        <div className="bg-[#171719] border border-[#29292D] rounded-3xl p-6 space-y-6 shadow-2xl">
          <h3 className="text-base font-bold text-[#F4F0E8]">Freelancer Fixed-Price Pre-packaged Services</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[#8D8A83] border-b border-[#29292D]">
                <tr>
                  <th className="pb-3 font-semibold">Service Title</th>
                  <th className="pb-3 font-semibold">Category</th>
                  <th className="pb-3 font-semibold">Freelancer</th>
                  <th className="pb-3 font-semibold">Package Price (₹)</th>
                  <th className="pb-3 font-semibold">Delivery Time</th>
                  <th className="pb-3 font-semibold">Featured</th>
                  <th className="pb-3 font-semibold text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#29292D]">
                {services.map(s => (
                  <tr key={s.id} className="hover:bg-[#111113]/50 transition-colors">
                    <td className="py-3.5 font-bold text-[#F4F0E8]">{s.title}</td>
                    <td className="py-3.5 text-[#8D8A83]">{s.category}</td>
                    <td className="py-3.5 text-[#8D8A83]">{s.freelancer}</td>
                    <td className="py-3.5 font-extrabold text-[#F4B860]">₹{s.price.toLocaleString('en-IN')}</td>
                    <td className="py-3.5 text-[#8D8A83] font-semibold">{s.delivery_days} Days</td>
                    <td className="py-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${s.is_featured ? 'bg-amber-500/20 text-amber-300' : 'bg-gray-500/10 text-gray-400'}`}>
                        {s.is_featured ? '★ Featured' : 'Normal'}
                      </span>
                    </td>
                    <td className="py-3.5 text-right space-x-2">
                      <button
                        onClick={() => toggleFeatureService(s.id)}
                        className="px-2.5 py-1 bg-[#111113] border border-[#29292D] text-[#F4B860] hover:border-[#F4B860] rounded-lg text-[10px] font-bold"
                      >
                        Toggle Feature
                      </button>
                      <button
                        onClick={() => deleteService(s.id)}
                        className="px-2.5 py-1 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 rounded-lg text-[10px] font-bold"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PORTFOLIO TAB */}
      {activeTab === 'portfolio' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolios.map(p => (
            <div key={p.id} className="bg-[#171719] border border-[#29292D] rounded-2xl overflow-hidden shadow-lg space-y-3 p-4">
              <img src={p.image} alt={p.title} className="w-full h-40 object-cover rounded-xl border border-[#29292D]" />
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-[#F4F0E8]">{p.title}</h4>
                <p className="text-xs text-[#8D8A83]">By {p.freelancer}</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {p.tags.map(t => (
                    <span key={t} className="text-[10px] bg-[#111113] border border-[#29292D] text-[#F4B860] px-2 py-0.5 rounded font-bold">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="pt-2 border-t border-[#29292D] flex justify-end">
                <button
                  onClick={() => deletePortfolio(p.id)}
                  className="px-3 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg text-xs font-bold"
                >
                  Remove Portfolio
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
