import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  ShieldCheck, LayoutDashboard, TrendingUp, Users, Award, UserCheck, 
  Briefcase, Send, Folder, Wrench, Layers, Image, Star, DollarSign, 
  CreditCard, AlertTriangle, ShieldAlert, Bell, FileText, Settings, 
  Activity, ScrollText, X, ChevronRight
} from 'lucide-react';

export default function AdminSidebar({ mobileOpen, setMobileOpen }) {
  const location = useLocation();

  const menuGroups = [
    {
      title: 'CORE PLATFORM',
      items: [
        { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { label: 'Analytics & Growth', path: '/admin/analytics', icon: TrendingUp }
      ]
    },
    {
      title: 'MARKETPLACE CONTROL',
      items: [
        { label: 'Projects Directory', path: '/admin/projects', icon: Briefcase },
        { label: 'Bids & Proposals', path: '/admin/proposals', icon: Send },
        { label: 'Categories Manager', path: '/admin/categories', icon: Folder },
        { label: 'Skills & Taxonomy', path: '/admin/skills', icon: Wrench },
        { label: 'Service Listings', path: '/admin/services', icon: Layers },
        { label: 'Portfolio Items', path: '/admin/portfolio', icon: Image },
        { label: 'Review Moderation', path: '/admin/reviews', icon: Star }
      ]
    },
    {
      title: 'USER OVERSIGHT',
      items: [
        { label: 'Users Directory', path: '/admin/users', icon: Users },
        { label: 'Freelancers & Verification', path: '/admin/freelancers', icon: Award },
        { label: 'Clients Directory', path: '/admin/clients', icon: UserCheck }
      ]
    },
    {
      title: 'FINANCIAL OPERATIONS',
      items: [
        { label: 'Escrow & Payments', path: '/admin/payments', icon: DollarSign },
        { label: 'Transactions Audit', path: '/admin/transactions', icon: CreditCard }
      ]
    },
    {
      title: 'MODERATION & DISPUTES',
      items: [
        { label: 'Flagged Reports', path: '/admin/reports', icon: AlertTriangle },
        { label: 'Contract Disputes', path: '/admin/disputes', icon: ShieldAlert },
        { label: 'Announcements', path: '/admin/notifications', icon: Bell },
        { label: 'Content CMS', path: '/admin/content', icon: FileText }
      ]
    },
    {
      title: 'GOVERNANCE & SYSTEM',
      items: [
        { label: 'Marketplace Settings', path: '/admin/settings', icon: Settings },
        { label: 'Immutable Audit Logs', path: '/admin/audit-logs', icon: ScrollText },
        { label: 'System Health Status', path: '/admin/system', icon: Activity }
      ]
    }
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#111113] text-[#F4F0E8] border-r border-[#29292D] w-64 shrink-0">
      
      {/* Brand Header */}
      <div className="p-5 border-b border-[#29292D] flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#F4B860] to-[#E9A84C] flex items-center justify-center text-[#0B0B0D] font-extrabold text-base shadow-md">
            FH
          </div>
          <div>
            <h2 className="font-extrabold text-sm text-[#F4F0E8] leading-none">Freelancer Hub</h2>
            <span className="text-[10px] text-[#F4B860] font-bold tracking-wider uppercase">Super Admin Portal</span>
          </div>
        </div>

        {setMobileOpen && (
          <button 
            onClick={() => setMobileOpen(false)}
            className="md:hidden text-[#8D8A83] hover:text-[#F4F0E8]"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin">
        {menuGroups.map((group, idx) => (
          <div key={idx} className="space-y-2">
            <h3 className="text-[10px] font-extrabold text-[#8D8A83] tracking-wider uppercase px-3">
              {group.title}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => {
                const IconComponent = item.icon;
                const isActive = location.pathname === item.path || (item.path !== '/admin/dashboard' && location.pathname.startsWith(item.path));
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen && setMobileOpen(false)}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive 
                        ? 'bg-[#F4B860] text-[#0B0B0D] font-bold shadow-md shadow-[#F4B860]/10' 
                        : 'text-[#8D8A83] hover:text-[#F4F0E8] hover:bg-[#171719]'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <IconComponent className={`w-4 h-4 ${isActive ? 'text-[#0B0B0D]' : 'text-[#8D8A83]'}`} />
                      <span>{item.label}</span>
                    </div>
                    {isActive && <ChevronRight className="w-3.5 h-3.5" />}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer User Info */}
      <div className="p-4 border-t border-[#29292D] bg-[#0B0B0D]">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-[#171719] border border-[#29292D] flex items-center justify-center text-[#F4B860] font-bold text-xs">
            SA
          </div>
          <div className="overflow-hidden text-xs">
            <p className="font-bold text-[#F4F0E8] truncate">Super Administrator</p>
            <p className="text-[10px] text-emerald-400 font-semibold truncate">Role: SUPER_ADMIN</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:block h-screen sticky top-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Overlay Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div 
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />
          <div className="relative z-10">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
}
