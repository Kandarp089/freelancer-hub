import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Bookmark, Star } from 'lucide-react';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/favorites/')
      .then(res => setFavorites(res.data.results || res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-[#F4F0E8]">Saved Favorites</h1>
        <p className="text-sm text-[#8D8A83]">Quick access to saved freelancer profiles and projects.</p>
      </div>

      <div className="space-y-3">
        {favorites.length === 0 ? (
          <div className="bg-[#171719] border border-[#2A2A2E] p-8 rounded-2xl text-center text-[#8D8A83] text-sm">
            No saved items in your favorites list yet.
          </div>
        ) : (
          favorites.map(fav => (
            <div key={fav.id} className="bg-[#171719] border border-[#2A2A2E] p-4 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#F4B860] uppercase">{fav.target_type}</span>
                <p className="font-bold text-sm text-[#F4F0E8] mt-1">Target ID #{fav.target_id}</p>
              </div>
              <span className="text-xs text-[#8D8A83]">Saved on {new Date(fav.created_at).toLocaleDateString()}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
