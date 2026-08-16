import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, ArrowUpRight, Globe, Share2, ExternalLink } from 'lucide-react';

export default function Footer() {
  const CATEGORIES = [
    { name: "Personal Services", slug: "personal-services" },
    { name: "Construction & Maintenance", slug: "construction-maintenance" },
    { name: "IT & Technology", slug: "it-technology" },
    { name: "Creative & Design", slug: "creative-design" },
    { name: "Writing & Content", slug: "writing-content" },
    { name: "Marketing & Sales", slug: "marketing" },
    { name: "Business Consulting", slug: "business" },
    { name: "Video & Audio", slug: "video-audio" },
    { name: "Healthcare & Wellness", slug: "healthcare-wellness" }
  ];

  return (
    <footer className="bg-[#0B0B0D] border-t border-[#2A2A2E] pt-16 pb-12 text-[#8D8A83]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
          
          {/* Col 1: Brand */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#F4B860] to-[#E9A84C] flex items-center justify-center text-[#0B0B0D] font-bold text-xl">
                FH
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-[#F4F0E8]">
                Freelancer<span className="text-[#F4B860]">Hub</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-sm">
              The premier marketplace connecting forward-thinking clients with extraordinary freelancers across technology, design, construction, and personal services.
            </p>
            <div className="flex items-center space-x-4 pt-2">
              <a href="#" className="w-9 h-9 rounded-lg bg-[#171719] border border-[#2A2A2E] flex items-center justify-center text-[#8D8A83] hover:text-[#F4B860] hover:border-[#F4B860] transition-colors">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-[#171719] border border-[#2A2A2E] flex items-center justify-center text-[#8D8A83] hover:text-[#F4B860] hover:border-[#F4B860] transition-colors">
                <Share2 className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-[#171719] border border-[#2A2A2E] flex items-center justify-center text-[#8D8A83] hover:text-[#F4B860] hover:border-[#F4B860] transition-colors">
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Top Categories */}
          <div>
            <h4 className="text-[#F4F0E8] font-semibold text-sm tracking-wider uppercase mb-4">Categories</h4>
            <ul className="space-y-2.5 text-sm">
              {CATEGORIES.slice(0, 5).map((cat) => (
                <li key={cat.slug}>
                  <Link to={`/categories/${cat.slug}`} className="hover:text-[#F4B860] transition-colors flex items-center group">
                    <span>{cat.name}</span>
                    <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: For Clients & Freelancers */}
          <div>
            <h4 className="text-[#F4F0E8] font-semibold text-sm tracking-wider uppercase mb-4">Marketplace</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/freelancers" className="hover:text-[#F4B860] transition-colors">Browse Freelancers</Link></li>
              <li><Link to="/projects" className="hover:text-[#F4B860] transition-colors">Browse Open Projects</Link></li>
              <li><Link to="/projects/post" className="hover:text-[#F4B860] transition-colors">Post a Project</Link></li>
              <li><Link to="/register?role=FREELANCER" className="hover:text-[#F4B860] transition-colors">Become a Freelancer</Link></li>
            </ul>
          </div>

          {/* Col 4: Trust & Support */}
          <div>
            <h4 className="text-[#F4F0E8] font-semibold text-sm tracking-wider uppercase mb-4">Trust & Legal</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#" className="hover:text-[#F4B860] transition-colors">Trust & Safety Guarantee</a></li>
              <li><a href="#" className="hover:text-[#F4B860] transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-[#F4B860] transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-[#F4B860] transition-colors">Help Center & Support</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#2A2A2E] pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8D8A83]">
          <p>© {new Date().getFullYear()} Freelancer Hub Inc. All rights reserved.</p>
          <div className="flex items-center space-x-1 mt-4 sm:mt-0">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
            <span>for human craftsmanship.</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
