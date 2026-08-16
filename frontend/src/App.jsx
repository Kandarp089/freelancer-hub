import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
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

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen bg-[#0B0B0D] text-[#F4F0E8] flex flex-col justify-between selection:bg-[#F4B860] selection:text-[#0B0B0D]">
          <Navbar />
          <main className="flex-1">
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
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
