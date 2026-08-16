import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, AlertCircle, ArrowLeft } from 'lucide-react';

export default function PostProject() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [budgetType, setBudgetType] = useState('FIXED');
  const [minBudget, setMinBudget] = useState('100');
  const [maxBudget, setMaxBudget] = useState('500');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    API.get('/categories/').then(res => setCategories(res.data.results || res.data)).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await API.post('/projects/', {
        title,
        category,
        budget_type: budgetType,
        min_budget: minBudget,
        max_budget: maxBudget,
        description,
        status: 'OPEN'
      });
      navigate(`/projects/${res.data.id}`);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to post project. Make sure all required fields are filled.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-3xl font-extrabold text-[#F4F0E8]">Post a New Project</h1>
      <p className="text-sm text-[#8D8A83]">Describe your project requirements to receive competitive bids from verified talent.</p>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-[#171719] border border-[#2A2A2E] rounded-2xl p-6 space-y-6 text-xs">
        <div>
          <label className="block text-[#F4F0E8] font-bold mb-2">Project Title</label>
          <input
            type="text"
            required
            placeholder="e.g. Build a Modern E-Commerce Platform with React & Django"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-[#0B0B0D] border border-[#2A2A2E] text-[#F4F0E8] p-3 rounded-xl focus:border-[#F4B860] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[#F4F0E8] font-bold mb-2">Category</label>
          <select
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-[#0B0B0D] border border-[#2A2A2E] text-[#F4F0E8] p-3 rounded-xl focus:border-[#F4B860] focus:outline-none"
          >
            <option value="">Select a Category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[#F4F0E8] font-bold mb-2">Budget Type</label>
            <select
              value={budgetType}
              onChange={(e) => setBudgetType(e.target.value)}
              className="w-full bg-[#0B0B0D] border border-[#2A2A2E] text-[#F4F0E8] p-3 rounded-xl focus:border-[#F4B860] focus:outline-none"
            >
              <option value="FIXED">Fixed Price</option>
              <option value="HOURLY">Hourly Rate</option>
            </select>
          </div>
          <div>
            <label className="block text-[#F4F0E8] font-bold mb-2">Min Budget (₹)</label>
            <input
              type="number"
              required
              value={minBudget}
              onChange={(e) => setMinBudget(e.target.value)}
              className="w-full bg-[#0B0B0D] border border-[#2A2A2E] text-[#F4F0E8] p-3 rounded-xl focus:border-[#F4B860] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[#F4F0E8] font-bold mb-2">Max Budget (₹)</label>
            <input
              type="number"
              required
              value={maxBudget}
              onChange={(e) => setMaxBudget(e.target.value)}
              className="w-full bg-[#0B0B0D] border border-[#2A2A2E] text-[#F4F0E8] p-3 rounded-xl focus:border-[#F4B860] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-[#F4F0E8] font-bold mb-2">Detailed Project Description</label>
          <textarea
            required
            rows={7}
            placeholder="Describe deliverables, technologies required, milestones, and timeline..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-[#0B0B0D] border border-[#2A2A2E] text-[#F4F0E8] p-3 rounded-xl focus:border-[#F4B860] focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="btn-amber w-full py-3.5 rounded-xl font-bold text-sm shadow-lg"
        >
          {submitting ? 'Publishing Project...' : 'Publish Project Now'}
        </button>
      </form>
    </div>
  );
}
