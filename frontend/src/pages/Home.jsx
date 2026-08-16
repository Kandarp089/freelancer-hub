import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../services/api';
import FreelancerCard from '../components/FreelancerCard';
import ProjectCard from '../components/ProjectCard';
import { 
  Search, ShieldCheck, Zap, Award, CheckCircle, ArrowRight, 
  Sparkles, Briefcase, Star, Users, DollarSign, Layers, ChevronDown, 
  HelpCircle, Quote, TrendingUp, Lock, RefreshCw 
} from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [freelancers, setFreelancers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    API.get('/categories/').then(res => setCategories((res.data.results || res.data).slice(0, 8))).catch(() => {});
    API.get('/profiles/freelancers/').then(res => setFreelancers((res.data.results || res.data).slice(0, 6))).catch(() => {});
    API.get('/projects/').then(res => setProjects((res.data.results || res.data).slice(0, 6))).catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/freelancers?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const FAQS = [
    {
      q: "How does Freelancer Hub protect payments for clients and freelancers?",
      a: "All payments are processed securely with server-verified Razorpay escrow integration. Funds are held in escrow until the client reviews and approves completed project milestones."
    },
    {
      q: "Are freelancers on Freelancer Hub identity-verified?",
      a: "Yes. Every professional on Freelancer Hub completes identity verification, skills assessment, and portfolio validation before earning the Verified Pro badge."
    },
    {
      q: "Can I hire for local physical services like electricians and plumbers?",
      a: "Absolutely. Freelancer Hub supports 15+ industry domains including construction, plumbing, electrical maintenance, tailoring, and personal training alongside digital tech & design services."
    },
    {
      q: "What fees does the platform charge?",
      a: "Client registration and project posting are completely free. Freelancers pay a minimal 5% service fee only on successfully completed contracts."
    }
  ];

  const TESTIMONIALS = [
    {
      quote: "Freelancer Hub allowed us to hire a senior Django architect and a master electrician for our new office facility within 24 hours. The talent quality is unmatched.",
      author: "Rajesh Singhania",
      role: "CEO at TechVentures India",
      rating: 5.0
    },
    {
      quote: "As a full-stack engineer, I've secured 15+ long-term client contracts on Freelancer Hub. The WebSockets live chat and automated milestone payouts make working seamless.",
      author: "Priya Patel",
      role: "Senior Full-Stack Architect",
      rating: 5.0
    },
    {
      quote: "The Obsidian Atelier design and instant real-time proposal system make this marketplace feel like a high-end startup product rather than a generic SaaS script.",
      author: "Ananya Roy",
      role: "Product Strategist",
      rating: 5.0
    }
  ];

  return (
    <div className="space-y-28 pb-24">
      
      {/* HERO SECTION */}
      <section className="relative pt-16 pb-24 overflow-hidden border-b border-[#2A2A2E]/50">
        {/* Glowing Ambient Light Orbs */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-gradient-to-tr from-[#F4B860]/15 via-[#E9A84C]/8 to-transparent blur-[140px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-[#171719] border border-[#F4B860]/30 mb-8 shadow-lg shadow-[#F4B860]/5"
          >
            <Sparkles className="w-4 h-4 text-[#F4B860]" />
            <span className="text-xs font-semibold text-[#F4F0E8]">The Premier Marketplace for Verified Talent</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[#F4F0E8] tracking-tight max-w-5xl mx-auto leading-[1.1] mb-6"
          >
            Find people who make <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F4B860] via-[#E9A84C] to-[#F4F0E8]">great work happen.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-xl text-[#8D8A83] max-w-3xl mx-auto font-normal leading-relaxed mb-12"
          >
            Directly discover and hire verified software developers, UI designers, electricians, copywriters, plumbers, and business consultants across 50+ categories.
          </motion.p>

          {/* Interactive Search Bar */}
          <motion.form 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            onSubmit={handleSearch} 
            className="max-w-2xl mx-auto mb-10"
          >
            <div className="glass-panel p-2 rounded-2xl shadow-2xl flex items-center border border-[#2A2A2E] focus-within:border-[#F4B860] transition-all">
              <div className="pl-4 pr-2 text-[#8D8A83]">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="What do you need help with? e.g. Web Developer, Electrician, Designer"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-[#F4F0E8] placeholder-[#8D8A83] text-sm focus:outline-none py-3"
              />
              <button
                type="submit"
                className="btn-amber px-6 py-3.5 rounded-xl text-sm font-bold flex items-center space-x-2 shrink-0 shadow-lg shadow-[#F4B860]/20"
              >
                <span>Search</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.form>

          {/* Popular Searches */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-[#8D8A83]">
            <span className="font-semibold text-[#F4F0E8]">Trending Searches:</span>
            {['Web Development', 'UI/UX Design', 'Electrician', 'Copywriting', 'DevOps', 'Plumber'].map((tag) => (
              <button
                key={tag}
                onClick={() => navigate(`/freelancers?search=${encodeURIComponent(tag)}`)}
                className="px-3.5 py-1.5 rounded-lg bg-[#171719] border border-[#2A2A2E] text-[#8D8A83] hover:text-[#F4B860] hover:border-[#F4B860] transition-all"
              >
                {tag}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* STATS COUNTER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 sm:p-10 rounded-3xl bg-[#171719] border border-[#2A2A2E] text-center shadow-xl">
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-extrabold text-[#F4B860]">15,000+</p>
            <p className="text-xs text-[#8D8A83] font-medium">Verified Professionals</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-extrabold text-[#F4B860]">99.2%</p>
            <p className="text-xs text-[#8D8A83] font-medium">Client Satisfaction</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-extrabold text-[#F4B860]">₹25 Cr+</p>
            <p className="text-xs text-[#8D8A83] font-medium">Escrow Payouts</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-extrabold text-[#F4B860]">15</p>
            <p className="text-xs text-[#8D8A83] font-medium">Industry Domains</p>
          </div>
        </div>
      </section>

      {/* CATEGORIES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#F4F0E8] tracking-tight">Explore Categories</h2>
            <p className="text-sm text-[#8D8A83] mt-2">Discover curated talent across technical, construction, and personal services.</p>
          </div>
          <Link to="/categories" className="text-sm font-semibold text-[#F4B860] hover:underline flex items-center">
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              viewport={{ once: true }}
            >
              <Link
                to={`/categories/${cat.slug}`}
                className="obsidian-card p-6 rounded-2xl flex flex-col justify-between h-48 group block"
              >
                <div className="w-12 h-12 rounded-xl bg-[#0B0B0D] border border-[#2A2A2E] flex items-center justify-center text-[#F4B860] group-hover:scale-110 transition-transform">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#F4F0E8] group-hover:text-[#F4B860] transition-colors">{cat.name}</h3>
                  <p className="text-xs text-[#8D8A83] mt-1">{cat.subcategory_count} Subcategories Available</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURED FREELANCERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#F4F0E8] tracking-tight">Top-Rated Talent</h2>
            <p className="text-sm text-[#8D8A83] mt-2">Hand-picked, verified freelancers ready to start immediately.</p>
          </div>
          <Link to="/freelancers" className="text-sm font-semibold text-[#F4B860] hover:underline flex items-center">
            <span>Browse All Freelancers</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {freelancers.map((free) => (
            <FreelancerCard key={free.id} freelancer={free} />
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#F4F0E8]">How Freelancer Hub Works</h2>
          <p className="text-sm text-[#8D8A83] mt-2">A transparent, secure process designed for real results.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#171719] border border-[#2A2A2E] p-8 rounded-3xl relative hover:border-[#F4B860]/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#F4B860]/10 text-[#F4B860] font-bold text-xl flex items-center justify-center mb-6">1</div>
            <h3 className="font-bold text-lg text-[#F4F0E8] mb-2">Post Your Project</h3>
            <p className="text-xs text-[#8D8A83] leading-relaxed">
              Describe your project goals, required skills, timeline, and budget. Receive competitive proposals from top specialists within hours.
            </p>
          </div>

          <div className="bg-[#171719] border border-[#2A2A2E] p-8 rounded-3xl relative hover:border-[#F4B860]/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#F4B860]/10 text-[#F4B860] font-bold text-xl flex items-center justify-center mb-6">2</div>
            <h3 className="font-bold text-lg text-[#F4F0E8] mb-2">Compare & Hire</h3>
            <p className="text-xs text-[#8D8A83] leading-relaxed">
              Evaluate freelancer portfolios, verified client reviews, and custom proposals. Chat in real-time before awarding the contract.
            </p>
          </div>

          <div className="bg-[#171719] border border-[#2A2A2E] p-8 rounded-3xl relative hover:border-[#F4B860]/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#F4B860]/10 text-[#F4B860] font-bold text-xl flex items-center justify-center mb-6">3</div>
            <h3 className="font-bold text-lg text-[#F4F0E8] mb-2">Collaborate & Pay</h3>
            <p className="text-xs text-[#8D8A83] leading-relaxed">
              Track project milestones and chat seamlessly with WebSockets. Release payments safely through server-verified Razorpay escrow when work is approved.
            </p>
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#F4F0E8] tracking-tight">Recent Opportunities</h2>
            <p className="text-sm text-[#8D8A83] mt-2">Explore active project postings from verified clients.</p>
          </div>
          <Link to="/projects" className="text-sm font-semibold text-[#F4B860] hover:underline flex items-center">
            <span>Explore All Projects</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <ProjectCard key={proj.id} project={proj} />
          ))}
        </div>
      </section>

      {/* CLIENT TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#F4F0E8]">Trusted by Leaders</h2>
          <p className="text-sm text-[#8D8A83] mt-2">Hear from founders, clients, and top freelancers using Freelancer Hub.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((item, idx) => (
            <div key={idx} className="bg-[#171719] border border-[#2A2A2E] p-8 rounded-3xl space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <Quote className="w-8 h-8 text-[#F4B860]" />
                <p className="text-xs text-[#F4F0E8]/90 leading-relaxed italic">"{item.quote}"</p>
              </div>
              <div className="pt-4 border-t border-[#2A2A2E]">
                <p className="font-bold text-sm text-[#F4F0E8]">{item.author}</p>
                <p className="text-xs text-[#8D8A83]">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#F4F0E8]">Frequently Asked Questions</h2>
          <p className="text-sm text-[#8D8A83] mt-2">Everything you need to know about Freelancer Hub.</p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="bg-[#171719] border border-[#2A2A2E] rounded-2xl overflow-hidden">
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full text-left p-5 font-bold text-sm text-[#F4F0E8] flex justify-between items-center hover:bg-[#1D1D20]"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-[#F4B860] transition-transform ${activeFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              {activeFaq === idx && (
                <div className="p-5 pt-0 text-xs text-[#8D8A83] leading-relaxed border-t border-[#2A2A2E]/50">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* TRUST & SAFETY CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#171719] via-[#111113] to-[#171719] border border-[#2A2A2E] rounded-3xl p-8 sm:p-14 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="max-w-xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#F4B860]/10 flex items-center justify-center text-[#F4B860]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#F4F0E8]">Ready to make great work happen?</h2>
            <p className="text-sm text-[#8D8A83] leading-relaxed">
              Join thousands of businesses and verified professionals already working together on Freelancer Hub.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-4">
            <Link to="/register?role=CLIENT" className="btn-amber px-6 py-3.5 rounded-xl text-sm font-bold text-center shadow-xl">
              Post a Project Now
            </Link>
            <Link to="/register?role=FREELANCER" className="bg-[#1D1D20] border border-[#2A2A2E] hover:border-[#F4B860] text-[#F4F0E8] px-6 py-3.5 rounded-xl text-sm font-bold text-center">
              Become a Freelancer
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
