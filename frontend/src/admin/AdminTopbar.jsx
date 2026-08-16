import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Menu, Search, Bell, Plus, LogOut, ShieldCheck, 
  User, Layers, AlertCircle, ChevronDown, Check, X, Sparkles
} from 'lucide-react';

export default function AdminTopbar({ setMobileOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [quickOpen, setQuickOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleQuickAction = (route) => {
    setQuickOpen(false);
    navigate(route);
  };

  return (
    <header className="bg-[#111113] border-b border-[#29292D] px-4 sm:px-6 py-3 sticky top-0 z-20 flex items-center justify-between">
      
      {/* Left: Mobile Menu Button & Search Input */}
      <div className="flex items-center space-x-3 flex-1 max-w-xl">
        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden text-[#8D8A83] hover:text-[#F4F0E8] p-2 rounded-xl bg-[#171719] border border-[#29292D]"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Bar */}
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8D8A83]" />
          <input
            type="text"
            placeholder="Global search (Users, Projects, Categories, Reviews, Payments)..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSearchOpen(e.target.value.trim().length > 0);
            }}
            className="w-full bg-[#171719] border border-[#29292D] text-[#F4F0E8] pl-10 pr-4 py-2 rounded-xl text-xs focus:border-[#F4B860] focus:outline-none transition-all placeholder:text-[#8D8A83]"
          />

          {/* Quick Search Modal Dropdown */}
          {searchOpen && (
            <div className="absolute top-12 left-0 right-0 bg-[#171719] border border-[#29292D] rounded-2xl p-4 shadow-2xl z-30 space-y-3">
              <div className="flex justify-between items-center text-xs text-[#8D8A83]">
                <span>Search results for "{searchQuery}":</span>
                <button onClick={() => setSearchOpen(false)} className="hover:text-[#F4F0E8]">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <Link 
                  to={`/admin/users?search=${searchQuery}`} 
                  onClick={() => setSearchOpen(false)}
                  className="p-2.5 bg-[#0B0B0D] border border-[#29292D] rounded-xl flex justify-between items-center hover:border-[#F4B860]"
                >
                  <span className="font-bold text-[#F4F0E8]">Search in Users Directory</span>
                  <span className="text-[10px] text-[#F4B860]">Users →</span>
                </Link>
                <Link 
                  to={`/admin/projects?search=${searchQuery}`} 
                  onClick={() => setSearchOpen(false)}
                  className="p-2.5 bg-[#0B0B0D] border border-[#29292D] rounded-xl flex justify-between items-center hover:border-[#F4B860]"
                >
                  <span className="font-bold text-[#F4F0E8]">Search in Projects Marketplace</span>
                  <span className="text-[10px] text-[#F4B860]">Projects →</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Controls: Quick Actions, Notifications, Profile */}
      <div className="flex items-center space-x-3 pl-4">
        
        {/* Quick Actions Dropdown */}
        <div className="relative">
          <button
            onClick={() => setQuickOpen(!quickOpen)}
            className="btn-amber px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-[#F4B860]/10"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Quick Action</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {quickOpen && (
            <div className="absolute right-0 top-11 w-48 bg-[#171719] border border-[#29292D] rounded-2xl p-2 shadow-2xl z-30 space-y-1 text-xs font-semibold">
              <button 
                onClick={() => handleQuickAction('/admin/users?action=new')}
                className="w-full text-left px-3 py-2 rounded-xl text-[#F4F0E8] hover:bg-[#0B0B0D] hover:text-[#F4B860]"
              >
                + Add User Account
              </button>
              <button 
                onClick={() => handleQuickAction('/admin/categories?action=new')}
                className="w-full text-left px-3 py-2 rounded-xl text-[#F4F0E8] hover:bg-[#0B0B0D] hover:text-[#F4B860]"
              >
                + Add Category
              </button>
              <button 
                onClick={() => handleQuickAction('/admin/notifications?action=announcement')}
                className="w-full text-left px-3 py-2 rounded-xl text-[#F4F0E8] hover:bg-[#0B0B0D] hover:text-[#F4B860]"
              >
                + Send Announcement
              </button>
              <button 
                onClick={() => handleQuickAction('/admin/freelancers?tab=verification')}
                className="w-full text-left px-3 py-2 rounded-xl text-[#F4F0E8] hover:bg-[#0B0B0D] hover:text-[#F4B860]"
              >
                + Verification Queue
              </button>
            </div>
          )}
        </div>

        {/* Notifications Bell */}
        <Link 
          to="/admin/reports"
          className="relative p-2 text-[#8D8A83] hover:text-[#F4F0E8] bg-[#171719] border border-[#29292D] rounded-xl transition-all"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-extrabold flex items-center justify-center">
            2
          </span>
        </Link>

        {/* Admin Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center space-x-2 p-1.5 rounded-xl bg-[#171719] border border-[#29292D] hover:border-[#F4B860]"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#F4B860] to-[#E9A84C] text-[#0B0B0D] font-bold text-xs flex items-center justify-center">
              SA
            </div>
            <span className="hidden md:inline text-xs font-bold text-[#F4F0E8]">Super Admin</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#8D8A83]" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-12 w-48 bg-[#171719] border border-[#29292D] rounded-2xl p-2 shadow-2xl z-30 space-y-1 text-xs">
              <div className="p-3 border-b border-[#29292D] text-[#8D8A83]">
                <p className="font-bold text-[#F4F0E8]">{user?.email || 'admin@freelancerhub.com'}</p>
                <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">Role: SUPER_ADMIN</p>
              </div>

              <Link
                to="/admin/settings"
                onClick={() => setProfileOpen(false)}
                className="block px-3 py-2 rounded-xl text-[#F4F0E8] hover:bg-[#0B0B0D]"
              >
                Marketplace Settings
              </Link>
              <Link
                to="/admin/audit-logs"
                onClick={() => setProfileOpen(false)}
                className="block px-3 py-2 rounded-xl text-[#F4F0E8] hover:bg-[#0B0B0D]"
              >
                Audit Logs
              </Link>

              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-xl text-rose-400 font-bold hover:bg-rose-500/10 flex items-center space-x-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout Admin</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
