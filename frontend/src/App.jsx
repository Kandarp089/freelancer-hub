import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Public Pages
import Home from './pages/Home';
import CategoryList from './pages/CategoryList';
import CategoryDetail from './pages/CategoryDetail';
import FreelancerList from './pages/FreelancerList';
import FreelancerDetail from './pages/FreelancerDetail';
import ProjectList from './pages/ProjectList';
import ProjectDetail from './pages/ProjectDetail';
import PostProject from './pages/PostProject';
import DashboardClient from './pages/DashboardClient';
import DashboardFreelancer from './pages/DashboardFreelancer';
import DashboardAdmin from './pages/DashboardAdmin';
import Chat from './pages/Chat';
import Notifications from './pages/Notifications';
import Favorites from './pages/Favorites';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';

// Admin Panel Components & Pages
import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import DashboardOverview from './admin/pages/DashboardOverview';
import UsersManager from './admin/pages/UsersManager';
import FreelancersManager from './admin/pages/FreelancersManager';
import ProjectsManager from './admin/pages/ProjectsManager';
import CategoriesSkillsManager from './admin/pages/CategoriesSkillsManager';
import FinancialsManager from './admin/pages/FinancialsManager';
import AuditLogsSystem from './admin/pages/AuditLogsSystem';

// Automatic Scroll To Top on Route Change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-[#0B0B0D] flex items-center justify-center text-[#8D8A83]">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

// Public Layout Component
const PublicLayout = ({ children }) => (
  <div className="min-h-screen bg-[#0B0B0D] text-[#F4F0E8] flex flex-col justify-between selection:bg-[#F4B860] selection:text-[#0B0B0D]">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* DEDICATED SUPER ADMIN ROUTES */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardOverview />} />
            <Route path="analytics" element={<DashboardOverview />} />
            
            <Route path="users" element={<UsersManager />} />
            <Route path="clients" element={<UsersManager />} />
            
            <Route path="freelancers" element={<FreelancersManager />} />
            <Route path="verification" element={<FreelancersManager />} />
            
            <Route path="projects" element={<ProjectsManager />} />
            <Route path="proposals" element={<ProjectsManager />} />
            <Route path="reviews" element={<ProjectsManager />} />
            
            <Route path="categories" element={<CategoriesSkillsManager />} />
            <Route path="skills" element={<CategoriesSkillsManager />} />
            <Route path="services" element={<CategoriesSkillsManager />} />
            <Route path="portfolio" element={<CategoriesSkillsManager />} />
            
            <Route path="payments" element={<FinancialsManager />} />
            <Route path="transactions" element={<FinancialsManager />} />
            <Route path="reports" element={<FinancialsManager />} />
            <Route path="disputes" element={<FinancialsManager />} />
            
            <Route path="notifications" element={<AuditLogsSystem />} />
            <Route path="content" element={<AuditLogsSystem />} />
            <Route path="settings" element={<AuditLogsSystem />} />
            <Route path="audit-logs" element={<AuditLogsSystem />} />
            <Route path="system" element={<AuditLogsSystem />} />
          </Route>

          {/* PUBLIC & MARKETPLACE ROUTES */}
          <Route path="*" element={
            <PublicLayout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/categories" element={<CategoryList />} />
                <Route path="/categories/:slug" element={<CategoryDetail />} />
                
                <Route path="/freelancers" element={<FreelancerList />} />
                <Route path="/freelancers/:id" element={<FreelancerDetail />} />

                <Route path="/projects" element={<ProjectList />} />
                <Route path="/projects/:id" element={<ProjectDetail />} />
                
                <Route path="/projects/post" element={
                  <ProtectedRoute allowedRoles={['CLIENT', 'ADMIN']}>
                    <PostProject />
                  </ProtectedRoute>
                } />

                <Route path="/dashboard/client" element={
                  <ProtectedRoute allowedRoles={['CLIENT', 'ADMIN']}>
                    <DashboardClient />
                  </ProtectedRoute>
                } />

                <Route path="/dashboard/freelancer" element={
                  <ProtectedRoute allowedRoles={['FREELANCER', 'ADMIN']}>
                    <DashboardFreelancer />
                  </ProtectedRoute>
                } />

                <Route path="/dashboard/admin" element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <DashboardAdmin />
                  </ProtectedRoute>
                } />

                <Route path="/messages" element={
                  <ProtectedRoute>
                    <Chat />
                  </ProtectedRoute>
                } />

                <Route path="/notifications" element={
                  <ProtectedRoute>
                    <Notifications />
                  </ProtectedRoute>
                } />

                <Route path="/favorites" element={
                  <ProtectedRoute>
                    <Favorites />
                  </ProtectedRoute>
                } />

                <Route path="/settings" element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } />

                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </PublicLayout>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
