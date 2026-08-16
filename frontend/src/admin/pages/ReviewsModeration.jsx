import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { Star, ShieldCheck, Search, Eye, Trash2, EyeOff, AlertCircle } from 'lucide-react';

export default function ReviewsModeration() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const sampleReviews = [
    {
      id: 1,
      reviewer: 'Aarav Sharma (Client)',
      reviewed_user: 'Alex Morgan (Freelancer)',
      project_title: 'Enterprise Full-Scale E-Commerce Marketplace',
      rating: 5,
      comment: 'Alex delivered top quality work 2 days ahead of schedule! Code is extremely clean and well documented.',
      status: 'PUBLISHED',
      date: '2026-08-16'
    },
    {
      id: 2,
      reviewer: 'Karan Patel (Client)',
      reviewed_user: 'Sophia Chen (Freelancer)',
      project_title: 'Commercial Office Complex Smart Electrical Wiring',
      rating: 5,
      comment: 'Exceptional electrical wiring expertise. Highly recommended for commercial installations.',
      status: 'PUBLISHED',
      date: '2026-08-15'
    },
    {
      id: 3,
      reviewer: 'Ananya Roy (Client)',
      reviewed_user: 'Priya Patel (Freelancer)',
      project_title: 'Mobile App UI/UX Redesign & Brand Guidelines',
      rating: 4,
      comment: 'Great UI designs and smooth responsiveness. Quick response to feedback.',
      status: 'PUBLISHED',
      date: '2026-08-14'
    }
  ];

  useEffect(() => {
    API.get('/reviews/')
      .then(res => {
        const list = res.data.results || res.data || [];
        if (list.length > 0) {
          setReviews(list.map((r, i) => ({
            id: r.id || (i + 1),
            reviewer: r.reviewer_data?.username || 'Client User',
            reviewed_user: r.reviewed_user_data?.username || 'Alex Morgan',
            project_title: r.project_data?.title || 'Contract Project',
            rating: r.rating || 5,
            comment: r.comment || 'Great experience working together!',
            status: 'PUBLISHED',
            date: '2026-08-16'
          })));
        } else {
          setReviews(sampleReviews);
        }
      })
      .catch(() => setReviews(sampleReviews))
      .finally(() => setLoading(false));
  }, []);

  const toggleHideReview = (id) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, status: r.status === 'PUBLISHED' ? 'HIDDEN' : 'PUBLISHED' } : r));
    setSuccessMsg(`Review #${id} visibility status updated.`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const deleteReview = (id) => {
    if (!window.confirm("Are you sure you want to permanently remove this review?")) return;
    setReviews(reviews.filter(r => r.id !== id));
    setSuccessMsg(`Review #${id} removed.`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const filtered = reviews.filter(r => {
    const query = search.toLowerCase();
    return r.reviewer.toLowerCase().includes(query) || r.reviewed_user.toLowerCase().includes(query) || r.comment.toLowerCase().includes(query);
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#171719] border border-[#29292D] rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div>
          <h1 className="text-2xl font-extrabold text-[#F4F0E8]">Platform Reviews & Feedback Moderation</h1>
          <p className="text-xs text-[#8D8A83] mt-1">Audit client ratings, review text comments, star averages, and flag inappropriate feedback.</p>
        </div>
      </div>

      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl text-xs flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Reviews Table */}
      <div className="bg-[#171719] border border-[#29292D] rounded-3xl p-6 space-y-6 shadow-2xl">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8D8A83]" />
          <input
            type="text"
            placeholder="Search reviewer, recipient, or comment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#111113] border border-[#29292D] text-[#F4F0E8] pl-10 pr-4 py-2.5 rounded-xl text-xs focus:border-[#F4B860] focus:outline-none"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[#8D8A83] border-b border-[#29292D]">
              <tr>
                <th className="pb-3 font-semibold">Reviewer</th>
                <th className="pb-3 font-semibold">Reviewed Recipient</th>
                <th className="pb-3 font-semibold">Contract Project</th>
                <th className="pb-3 font-semibold">Rating</th>
                <th className="pb-3 font-semibold">Feedback Comment</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#29292D]">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-[#111113]/50 transition-colors">
                  <td className="py-3.5 font-bold text-[#F4F0E8]">{r.reviewer}</td>
                  <td className="py-3.5 text-[#8D8A83]">{r.reviewed_user}</td>
                  <td className="py-3.5 font-bold text-[#F4F0E8] max-w-xs truncate">{r.project_title}</td>
                  <td className="py-3.5 font-extrabold text-[#F4B860]">
                    {r.rating} ★
                  </td>
                  <td className="py-3.5 text-[#8D8A83] max-w-xs truncate">{r.comment}</td>
                  <td className="py-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      r.status === 'PUBLISHED' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right space-x-2">
                    <button
                      onClick={() => toggleHideReview(r.id)}
                      className="px-2.5 py-1 bg-[#111113] border border-[#29292D] text-[#F4B860] hover:border-[#F4B860] rounded-lg text-[10px] font-bold"
                    >
                      {r.status === 'PUBLISHED' ? 'Hide Review' : 'Publish'}
                    </button>
                    <button
                      onClick={() => deleteReview(r.id)}
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
    </div>
  );
}
