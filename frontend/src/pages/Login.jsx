import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, AlertCircle, ArrowRight, UserCheck, ShieldCheck, Briefcase } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const executeLogin = async (userEmail, userPassword) => {
    setError('');
    setLoading(true);
    try {
      const userObj = await login(userEmail, userPassword);
      if (userObj.role === 'ADMIN') navigate('/dashboard/admin');
      else if (userObj.role === 'FREELANCER') navigate('/dashboard/freelancer');
      else navigate('/dashboard/client');
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid email or password credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    executeLogin(email, password);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="bg-[#171719] border border-[#2A2A2E] rounded-3xl max-w-md w-full p-8 space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#F4B860] to-[#E9A84C] flex items-center justify-center text-[#0B0B0D] font-bold text-xl mx-auto shadow-lg shadow-[#F4B860]/20">
            FH
          </div>
          <h1 className="text-2xl font-extrabold text-[#F4F0E8]">Welcome Back</h1>
          <p className="text-xs text-[#8D8A83]">Log in to your Freelancer Hub account.</p>
        </div>

        {/* 1-Click Fast Demo Login Buttons */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-[#F4B860] text-center">1-Click Quick Demo Logins:</p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => { setEmail('client@freelancerhub.com'); setPassword('client123'); executeLogin('client@freelancerhub.com', 'client123'); }}
              className="bg-[#0B0B0D] border border-[#2A2A2E] hover:border-[#F4B860] text-[#F4F0E8] p-2.5 rounded-xl text-xs font-bold transition-all text-center flex flex-col items-center justify-center space-y-1 group"
            >
              <UserCheck className="w-4 h-4 text-[#F4B860] group-hover:scale-110 transition-transform" />
              <span>Client</span>
            </button>
            <button
              type="button"
              onClick={() => { setEmail('freelancer@freelancerhub.com'); setPassword('freelancer123'); executeLogin('freelancer@freelancerhub.com', 'freelancer123'); }}
              className="bg-[#0B0B0D] border border-[#2A2A2E] hover:border-[#F4B860] text-[#F4F0E8] p-2.5 rounded-xl text-xs font-bold transition-all text-center flex flex-col items-center justify-center space-y-1 group"
            >
              <Briefcase className="w-4 h-4 text-[#F4B860] group-hover:scale-110 transition-transform" />
              <span>Freelancer</span>
            </button>
            <button
              type="button"
              onClick={() => { setEmail('admin@freelancerhub.com'); setPassword('admin123'); executeLogin('admin@freelancerhub.com', 'admin123'); }}
              className="bg-[#0B0B0D] border border-[#2A2A2E] hover:border-[#F4B860] text-[#F4F0E8] p-2.5 rounded-xl text-xs font-bold transition-all text-center flex flex-col items-center justify-center space-y-1 group"
            >
              <ShieldCheck className="w-4 h-4 text-[#F4B860] group-hover:scale-110 transition-transform" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-[#2A2A2E]"></div>
          <span className="flex-shrink mx-4 text-xs text-[#8D8A83]">or enter credentials</span>
          <div className="flex-grow border-t border-[#2A2A2E]"></div>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#8D8A83] font-semibold mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8D8A83]" />
              <input
                type="email"
                required
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0B0B0D] border border-[#2A2A2E] text-[#F4F0E8] pl-10 pr-4 py-3 rounded-xl focus:border-[#F4B860] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#8D8A83] font-semibold mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8D8A83]" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0B0B0D] border border-[#2A2A2E] text-[#F4F0E8] pl-10 pr-4 py-3 rounded-xl focus:border-[#F4B860] focus:outline-none"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-amber w-full py-3.5 rounded-xl font-bold text-sm shadow-lg flex items-center justify-center space-x-2">
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-[#8D8A83]">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#F4B860] font-semibold hover:underline">
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
}
