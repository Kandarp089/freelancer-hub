import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';

export default function AdminLayout() {
  const { user, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0B0D] flex items-center justify-center text-[#8D8A83] text-xs font-semibold">
        Authenticating Super Admin Session...
      </div>
    );
  }

  // Enforce ADMIN role security
  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#0B0B0D] text-[#F4F0E8] flex overflow-x-hidden selection:bg-[#F4B860] selection:text-[#0B0B0D]">
      {/* Sidebar */}
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Administrative Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar setMobileOpen={setMobileOpen} />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 overflow-y-auto">
          <Outlet />
        </main>

        <footer className="border-t border-[#29292D] p-4 text-center text-xs text-[#8D8A83] bg-[#111113]">
          Freelancer Hub — Super Admin Platform Control Center & Governance Panel
        </footer>
      </div>
    </div>
  );
}
