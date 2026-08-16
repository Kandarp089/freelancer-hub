import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { 
  Search, Bell, MessageSquare, ChevronDown, User, LogOut, 
  Briefcase, PlusCircle, Bookmark, ShieldCheck, Menu, X, Settings 
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  const [catOpen, setCatOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [unreadNotifs, setUnreadNotifs] = useState(0);

  useEffect(() => {
    API.get('/categories/')
      .then(res => setCategories(res.data.results || res.data))
      .catch(err => console.error(err));

    if (user) {
      API.get('/notifications/')
        .then(res => {
          const unread = (res.data.results || res.data).filter(n => !n.is_read).length;
          setUnreadNotifs(unread);
        })
        .catch(err => console.error(err));
    }
  }, [user]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/freelancers?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#F4B860] to-[#E9A84C] flex items-center justify-center text-[#0B0B0D] font-bold text-xl shadow-lg shadow-[#F4B860]/20 group-hover:scale-105 transition-transform">
              FH
            </div>
            <span className="font-extrabold text-xl tracking-tight text-[#F4F0E8] group-hover:text-[#F4B860] transition-colors">
              Freelancer<span className="text-[#F4B860]">Hub</span>
            </span>
          </Link>

          {/* Category Dropdown */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setCatOpen(!catOpen)}
              className="flex items-center space-x-2 text-sm font-medium text-[#8D8A83] hover:text-[#F4F0E8] transition-colors px-3 py-2 rounded-lg hover:bg-[#171719]"
            >
              <span>Categories</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${catOpen ? 'rotate-180' : ''}`} />
            </button>

            {catOpen && (
              <div 
                className="absolute top-full left-0 mt-2 w-72 bg-[#171719] border border-[#2A2A2E] rounded-xl shadow-2xl p-2 z-50 max-h-96 overflow-y-auto"
                onMouseLeave={() => setCatOpen(false)}
              >
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/categories/${cat.slug}`}
                    onClick={() => setCatOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-[#F4F0E8] hover:bg-[#1D1D20] hover:text-[#F4B860] transition-colors"
                  >
                    <span>{cat.name}</span>
                    <span className="text-xs text-[#8D8A83] bg-[#0B0B0D] px-2 py-0.5 rounded-full">{cat.subcategory_count}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Global Search Bar */}
        <form onSubmit={handleSearch} className="hidden lg:flex items-center flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8D8A83]" />
            <input
              type="text"
              placeholder="Search freelancers, skills, services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#171719] border border-[#2A2A2E] rounded-xl pl-10 pr-4 py-2 text-sm text-[#F4F0E8] placeholder-[#8D8A83] focus:outline-none focus:border-[#F4B860] transition-all"
            />
          </div>
        </form>

        {/* Right Action Items */}
        <div className="flex items-center space-x-4">
          <Link to="/freelancers" className="hidden sm:inline-block text-sm font-medium text-[#8D8A83] hover:text-[#F4F0E8] transition-colors">
            Find Talent
          </Link>
          <Link to="/projects" className="hidden sm:inline-block text-sm font-medium text-[#8D8A83] hover:text-[#F4F0E8] transition-colors">
            Browse Projects
          </Link>

          {user && user.role === 'CLIENT' && (
            <Link
              to="/projects/post"
              className="hidden md:flex items-center space-x-2 bg-[#F4B860] text-[#0B0B0D] hover:bg-[#E9A84C] px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-md shadow-[#F4B860]/10"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post Project</span>
            </Link>
          )}

          {user ? (
            <div className="flex items-center space-x-3">
              <Link to="/messages" className="p-2 rounded-xl text-[#8D8A83] hover:text-[#F4F0E8] hover:bg-[#171719] transition-colors relative">
                <MessageSquare className="w-5 h-5" />
              </Link>

              <Link to="/notifications" className="p-2 rounded-xl text-[#8D8A83] hover:text-[#F4F0E8] hover:bg-[#171719] transition-colors relative">
                <Bell className="w-5 h-5" />
                {unreadNotifs > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F4B860] animate-pulse"></span>
                )}
              </Link>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center space-x-2 p-1 rounded-xl hover:bg-[#171719] border border-[#2A2A2E]"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#2A2A2E] flex items-center justify-center text-[#F4B860] font-bold text-sm">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                </button>

                {profileOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-[#171719] border border-[#2A2A2E] rounded-xl shadow-2xl p-2 z-50"
                    onMouseLeave={() => setProfileOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-[#2A2A2E] mb-1">
                      <p className="text-sm font-bold text-[#F4F0E8]">{user.first_name || user.username}</p>
                      <p className="text-xs text-[#8D8A83]">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#F4B860]/10 text-[#F4B860]">
                        {user.role}
                      </span>
                    </div>

                    <Link
                      to={user.role === 'CLIENT' ? '/dashboard/client' : user.role === 'FREELANCER' ? '/dashboard/freelancer' : '/dashboard/admin'}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm text-[#F4F0E8] hover:bg-[#1D1D20] hover:text-[#F4B860]"
                    >
                      <Briefcase className="w-4 h-4" />
                      <span>Dashboard</span>
                    </Link>

                    <Link
                      to="/settings"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm text-[#F4F0E8] hover:bg-[#1D1D20] hover:text-[#F4B860]"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Account Settings</span>
                    </Link>

                    <button
                      onClick={() => { logout(); setProfileOpen(false); navigate('/login'); }}
                      className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link to="/login" className="text-sm font-semibold text-[#F4F0E8] hover:text-[#F4B860] transition-colors px-3 py-2">
                Log In
              </Link>
              <Link to="/register" className="btn-amber px-4 py-2 rounded-xl text-sm font-semibold shadow-md">
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-[#8D8A83]">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>
      </div>
    </header>
  );
}
