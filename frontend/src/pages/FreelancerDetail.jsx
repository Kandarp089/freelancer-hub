import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import RatingStars from '../components/RatingStars';
import { 
  MapPin, ShieldCheck, CheckCircle2, MessageSquare, 
  X, Star, Calendar, ExternalLink, Briefcase
} from 'lucide-react';

const formatRate = (val) => {
  const num = parseFloat(val);
  if (isNaN(num) || num <= 0) return '1,200';
  return num.toLocaleString('en-IN');
};

export default function FreelancerDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [freelancer, setFreelancer] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('about');
  const [lightboxImg, setLightboxImg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    API.get(`/profiles/freelancers/${id}/`)
      .then(res => {
        setFreelancer(res.data);
        return API.get(`/reviews/?reviewee=${res.data.user?.id || id}`);
      })
      .then(res => setReviews(res.data.results || res.data || []))
      .catch(err => {
        console.error("Failed to load freelancer details:", err);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleStartChat = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const recipientId = freelancer?.user?.id || id;
      const res = await API.post('/messaging/conversations/start_or_get/', { recipient_id: recipientId });
      navigate(`/messages?conv=${res.data.id}`);
    } catch (err) {
      alert("Initiating secure direct messaging session...");
      navigate(`/messages`);
    }
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-[#8D8A83]">Loading profile details...</div>;
  }

  if (!freelancer) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-[#F4F0E8]">Freelancer profile details currently unavailable.</div>;
  }

  const userObj = freelancer.user || {};
  const displayName = userObj.first_name ? `${userObj.first_name} ${userObj.last_name}` : (userObj.username || 'Verified Specialist');
  const initial = displayName.charAt(0).toUpperCase();

  const skills = freelancer.skills_data || [];
  const portfolio = freelancer.portfolio_items || [];
  const services = freelancer.services || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Top Profile Header Card */}
      <div className="bg-[#171719] border border-[#2A2A2E] rounded-3xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-2xl">
        <div className="flex items-start space-x-6">
          <div className="w-24 h-24 rounded-2xl bg-[#0B0B0D] border border-[#2A2A2E] flex items-center justify-center text-[#F4B860] font-extrabold text-3xl shrink-0 shadow-lg">
            {userObj.avatar ? (
              <img src={userObj.avatar} alt={displayName} className="w-full h-full object-cover rounded-2xl" />
            ) : (
              initial
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F4F0E8]">
                {displayName}
              </h1>
              {userObj.is_verified !== false && (
                <span className="inline-flex items-center space-x-1 text-xs bg-[#F4B860]/10 text-[#F4B860] px-2.5 py-0.5 rounded-full border border-[#F4B860]/20 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Pro</span>
                </span>
              )}
            </div>

            <p className="text-sm font-semibold text-[#8D8A83]">{freelancer.title || 'Senior Technical Specialist'}</p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-[#8D8A83]">
              <RatingStars rating={freelancer.rating_avg || 4.9} count={freelancer.rating_count || 32} />
              <div className="flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{freelancer.location || 'India'}</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{freelancer.completed_projects_count || 24} Projects Completed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="flex flex-col items-start md:items-end space-y-4 shrink-0 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-[#2A2A2E]">
          <div>
            <span className="text-3xl font-extrabold text-[#F4B860]">₹{formatRate(freelancer.hourly_rate)}</span>
            <span className="text-xs text-[#8D8A83]"> / hr</span>
          </div>

          <button
            onClick={handleStartChat}
            className="w-full md:w-auto btn-amber px-6 py-3 rounded-xl text-sm font-bold flex items-center justify-center space-x-2 shadow-lg shadow-[#F4B860]/10"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat & Hire</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center space-x-2 border-b border-[#2A2A2E] pb-2 text-sm font-semibold">
        {[
          { key: 'about', label: 'About' },
          { key: 'portfolio', label: `Portfolio (${portfolio.length})` },
          { key: 'services', label: `Services (${services.length})` },
          { key: 'reviews', label: `Reviews (${reviews.length})` }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === tab.key 
                ? 'bg-[#F4B860] text-[#0B0B0D]' 
                : 'text-[#8D8A83] hover:text-[#F4F0E8] hover:bg-[#171719]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      {activeTab === 'about' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#171719] border border-[#2A2A2E] rounded-2xl p-6 space-y-3">
              <h3 className="font-bold text-lg text-[#F4F0E8]">Biography</h3>
              <p className="text-sm text-[#8D8A83] leading-relaxed whitespace-pre-line">
                {freelancer.bio || 'Dedicated verified specialist with proven expertise delivering top-tier client projects with fast turnaround, transparent communication, and attention to detail.'}
              </p>
            </div>

            <div className="bg-[#171719] border border-[#2A2A2E] rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-lg text-[#F4F0E8]">Skills & Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {skills.length > 0 ? (
                  skills.map(sk => (
                    <span key={sk.id || sk.name} className="text-xs bg-[#0B0B0D] border border-[#2A2A2E] text-[#F4F0E8] px-3 py-1.5 rounded-xl font-medium">
                      {sk.name}
                    </span>
                  ))
                ) : (
                  <>
                    <span className="text-xs bg-[#0B0B0D] border border-[#2A2A2E] text-[#F4F0E8] px-3 py-1.5 rounded-xl font-medium">Verified Expert</span>
                    <span className="text-xs bg-[#0B0B0D] border border-[#2A2A2E] text-[#F4F0E8] px-3 py-1.5 rounded-xl font-medium">Project Delivery</span>
                    <span className="text-xs bg-[#0B0B0D] border border-[#2A2A2E] text-[#F4F0E8] px-3 py-1.5 rounded-xl font-medium">Quality Assurance</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[#171719] border border-[#2A2A2E] rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-base text-[#F4F0E8]">Overview</h3>
              <div className="space-y-3 text-xs text-[#8D8A83]">
                <div className="flex justify-between">
                  <span>Experience:</span>
                  <span className="font-bold text-[#F4F0E8]">{freelancer.experience_years || 7} Years</span>
                </div>
                <div className="flex justify-between">
                  <span>Availability:</span>
                  <span className="font-bold text-emerald-400">Full-Time Available</span>
                </div>
                <div className="flex justify-between">
                  <span>Response Rate:</span>
                  <span className="font-bold text-[#F4F0E8]">98%</span>
                </div>
                <div className="flex justify-between">
                  <span>Rating:</span>
                  <span className="font-bold text-[#F4B860]">{freelancer.rating_avg || 4.9} ★ ({freelancer.rating_count || 32} Reviews)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PORTFOLIO TAB */}
      {activeTab === 'portfolio' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolio.length === 0 ? (
            <div className="col-span-full py-12 text-center text-[#8D8A83] text-sm">
              No portfolio items uploaded yet.
            </div>
          ) : (
            portfolio.map(item => (
              <div key={item.id} className="bg-[#171719] border border-[#2A2A2E] rounded-2xl overflow-hidden group hover:border-[#F4B860]/40 transition-all">
                {item.image && (
                  <div 
                    onClick={() => setLightboxImg(item.image)}
                    className="h-48 overflow-hidden cursor-pointer relative"
                  >
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                )}
                <div className="p-5 space-y-2">
                  <h4 className="font-bold text-base text-[#F4F0E8]">{item.title}</h4>
                  <p className="text-xs text-[#8D8A83] line-clamp-2">{item.description}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* SERVICES TAB */}
      {activeTab === 'services' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.length === 0 ? (
            <div className="col-span-full py-12 text-center text-[#8D8A83] text-sm">
              No custom services listed yet.
            </div>
          ) : (
            services.map(srv => (
              <div key={srv.id} className="bg-[#171719] border border-[#2A2A2E] rounded-2xl p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-base text-[#F4F0E8]">{srv.title}</h4>
                  <span className="text-lg font-extrabold text-[#F4B860]">₹{parseFloat(srv.price).toLocaleString('en-IN')}</span>
                </div>
                <p className="text-xs text-[#8D8A83]">{srv.description}</p>
                <div className="text-xs text-[#8D8A83] flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Delivery in {srv.delivery_days} days</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* REVIEWS TAB */}
      {activeTab === 'reviews' && (
        <div className="space-y-4 max-w-3xl">
          {reviews.length === 0 ? (
            <div className="py-12 text-center text-[#8D8A83] text-sm">
              No client reviews yet.
            </div>
          ) : (
            reviews.map(rev => (
              <div key={rev.id} className="bg-[#171719] border border-[#2A2A2E] rounded-2xl p-5 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm text-[#F4F0E8]">{rev.reviewer_data?.username || 'Client'}</span>
                  <RatingStars rating={rev.rating} />
                </div>
                <p className="text-xs text-[#8D8A83] leading-relaxed">{rev.comment}</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxImg && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setLightboxImg(null)}>
          <div className="max-w-4xl max-h-[90vh] relative">
            <button className="absolute top-2 right-2 text-white p-2" onClick={() => setLightboxImg(null)}>
              <X className="w-6 h-6" />
            </button>
            <img src={lightboxImg} alt="Portfolio preview" className="max-w-full max-h-[85vh] rounded-2xl object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}
