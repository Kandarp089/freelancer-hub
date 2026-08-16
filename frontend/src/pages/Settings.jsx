import React, { useState } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { User, CheckCircle, ShieldCheck } from 'lucide-react';

export default function Settings() {
  const { user, setUser } = useAuth();
  const [firstName, setFirstName] = useState(user?.first_name || '');
  const [lastName, setLastName] = useState(user?.last_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    try {
      const res = await API.patch('/auth/me/', {
        first_name: firstName,
        last_name: lastName,
        phone: phone,
        bio: bio
      });
      setUser(res.data);
      localStorage.setItem('user_data', JSON.stringify(res.data));
      setMsg("Settings updated successfully!");
    } catch (err) {
      alert("Failed to update profile settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-[#F4F0E8]">Account Settings</h1>
        <p className="text-sm text-[#8D8A83]">Update your personal profile details and security settings.</p>
      </div>

      {msg && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center space-x-2">
          <CheckCircle className="w-4 h-4" />
          <span>{msg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-[#171719] border border-[#2A2A2E] rounded-2xl p-6 space-y-4 text-xs">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[#8D8A83] font-semibold mb-1">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full bg-[#0B0B0D] border border-[#2A2A2E] text-[#F4F0E8] p-3 rounded-xl focus:border-[#F4B860] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[#8D8A83] font-semibold mb-1">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full bg-[#0B0B0D] border border-[#2A2A2E] text-[#F4F0E8] p-3 rounded-xl focus:border-[#F4B860] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-[#8D8A83] font-semibold mb-1">Phone Number</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full bg-[#0B0B0D] border border-[#2A2A2E] text-[#F4F0E8] p-3 rounded-xl focus:border-[#F4B860] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[#8D8A83] font-semibold mb-1">Bio Excerpt</label>
          <textarea
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full bg-[#0B0B0D] border border-[#2A2A2E] text-[#F4F0E8] p-3 rounded-xl focus:border-[#F4B860] focus:outline-none"
          />
        </div>

        <button type="submit" disabled={saving} className="btn-amber w-full py-3 rounded-xl font-bold text-sm">
          {saving ? 'Saving Changes...' : 'Save Profile Settings'}
        </button>
      </form>
    </div>
  );
}
