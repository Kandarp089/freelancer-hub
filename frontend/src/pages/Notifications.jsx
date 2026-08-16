import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Bell, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/notifications/')
      .then(res => setNotifications(res.data.results || res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const markAllRead = () => {
    API.post('/notifications/mark_all_read/').then(() => {
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-[#F4F0E8]">Notifications</h1>
          <p className="text-sm text-[#8D8A83]">Stay updated on project proposals, contract offers, and messages.</p>
        </div>
        <button onClick={markAllRead} className="text-xs font-semibold text-[#F4B860] hover:underline">
          Mark All as Read
        </button>
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="bg-[#171719] border border-[#2A2A2E] p-8 rounded-2xl text-center text-[#8D8A83] text-sm">
            No notifications yet.
          </div>
        ) : (
          notifications.map(n => (
            <div key={n.id} className={`p-4 rounded-xl border transition-colors flex items-center justify-between ${
              n.is_read ? 'bg-[#171719]/40 border-[#2A2A2E]' : 'bg-[#171719] border-[#F4B860]/40'
            }`}>
              <div className="space-y-1">
                <p className="font-bold text-sm text-[#F4F0E8]">{n.title}</p>
                <p className="text-xs text-[#8D8A83]">{n.message}</p>
                <p className="text-[10px] text-[#8D8A83]">{new Date(n.created_at).toLocaleString()}</p>
              </div>

              {n.link && (
                <Link to={n.link} className="btn-amber px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1 shrink-0">
                  <span>View</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
