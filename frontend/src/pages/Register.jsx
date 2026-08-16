import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Phone, AlertCircle, ArrowRight, ShieldCheck, Briefcase } from 'lucide-react';

export default function Register() {
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get('role') || 'CLIENT';
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState(defaultRole);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({
        username,
        email,
        password,
        role,
        first_name: firstName,
        last_name: lastName,
        phone
      });
      navigate('/login?registered=true');
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed. Username or email may already be taken.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="bg-[#171719] border border-[#2A2A2E] rounded-3xl max-w-lg w-full p-8 space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-extrabold text-[#F4F0E8]">Create Your Account</h1>
          <p className="text-xs text-[#8D8A83]">Join Freelancer Hub as a Client or Freelancer Specialist.</p>
        </div>

        {/* Role Toggle Selector */}
        <div className="grid grid-cols-2 gap-3 p-1 bg-[#0B0B0D] border border-[#2A2A2E] rounded-xl">
          <button
            type="button"
            onClick={() => setRole('CLIENT')}
            className={`py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
              role === 'CLIENT' ? 'bg-[#F4B860] text-[#0B0B0D] shadow' : 'text-[#8D8A83] hover:text-[#F4F0E8]'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>I Want to Hire</span>
          </button>
          <button
            type="button"
            onClick={() => setRole('FREELANCER')}
            className={`py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
              role === 'FREELANCER' ? 'bg-[#F4B860] text-[#0B0B0D] shadow' : 'text-[#8D8A83] hover:text-[#F4F0E8]'
            }`}
          >
            <User className="w-4 h-4" />
            <span>I Want to Work</span>
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#8D8A83] font-semibold mb-1">First Name</label>
              <input
                type="text"
                required
                placeholder="Aarav"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full bg-[#0B0B0D] border border-[#2A2A2E] text-[#F4F0E8] p-3 rounded-xl focus:border-[#F4B860] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[#8D8A83] font-semibold mb-1">Last Name</label>
              <input
                type="text"
                required
                placeholder="Sharma"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full bg-[#0B0B0D] border border-[#2A2A2E] text-[#F4F0E8] p-3 rounded-xl focus:border-[#F4B860] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#8D8A83] font-semibold mb-1">Username</label>
            <input
              type="text"
              required
              placeholder="aarav_dev"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#0B0B0D] border border-[#2A2A2E] text-[#F4F0E8] p-3 rounded-xl focus:border-[#F4B860] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[#8D8A83] font-semibold mb-1">Email Address</label>
            <input
              type="email"
              required
              placeholder="aarav@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0B0B0D] border border-[#2A2A2E] text-[#F4F0E8] p-3 rounded-xl focus:border-[#F4B860] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[#8D8A83] font-semibold mb-1">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0B0B0D] border border-[#2A2A2E] text-[#F4F0E8] p-3 rounded-xl focus:border-[#F4B860] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[#8D8A83] font-semibold mb-1">Phone Number (Optional)</label>
            <input
              type="text"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-[#0B0B0D] border border-[#2A2A2E] text-[#F4F0E8] p-3 rounded-xl focus:border-[#F4B860] focus:outline-none"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-amber w-full py-3.5 rounded-xl font-bold text-sm shadow-lg flex items-center justify-center space-x-2">
            <span>{loading ? 'Creating Account...' : `Register as ${role === 'CLIENT' ? 'Client' : 'Freelancer'}`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-[#8D8A83]">
          Already have an account?{' '}
          <Link to="/login" className="text-[#F4B860] font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
