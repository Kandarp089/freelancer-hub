import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Clock, DollarSign, MapPin, Users, Calendar, ArrowLeft, 
  Send, CheckCircle, ShieldCheck, X, AlertCircle, LogIn, UserCheck
} from 'lucide-react';

export default function ProjectDetail() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Proposal modal
  const [modalOpen, setModalOpen] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [deliveryDays, setDeliveryDays] = useState('7');
  const [coverLetter, setCoverLetter] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const shouldAutoApply = searchParams.get('apply') === 'true';

  useEffect(() => {
    fetchProjectData();
  }, [id]);

  useEffect(() => {
    if (project && shouldAutoApply) {
      if (user && user.role === 'FREELANCER') {
        setBidAmount(project.min_budget);
        setModalOpen(true);
      }
    }
  }, [project, shouldAutoApply, user]);

  const fetchProjectData = () => {
    setLoading(true);
    API.get(`/projects/${id}/`)
      .then(res => {
        setProject(res.data);
        if (user && (user.id === res.data.client || user.role === 'CLIENT' || user.role === 'ADMIN')) {
          return API.get(`/proposals/?project=${id}`);
        }
        return Promise.resolve({ data: [] });
      })
      .then(res => setProposals(res.data.results || res.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleProposalSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await API.post('/proposals/', {
        project: project.id,
        bid_amount: bidAmount,
        estimated_delivery_days: deliveryDays,
        cover_letter: coverLetter
      });
      setSuccessMsg("Proposal submitted successfully!");
      setModalOpen(false);
      fetchProjectData();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to submit proposal. Make sure you are registered as a freelancer.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAcceptProposal = async (propId) => {
    if (!window.confirm("Are you sure you want to accept this proposal and hire this freelancer?")) return;
    try {
      await API.post(`/proposals/${propId}/accept/`);
      fetchProjectData();
      alert("Proposal accepted! Project has been assigned.");
    } catch (err) {
      alert("Failed to accept proposal.");
    }
  };

  const handleQuickDemoFreelancerLogin = async () => {
    try {
      await login('freelancer@freelancerhub.com', 'freelancer123');
      setBidAmount(project.min_budget);
      setModalOpen(true);
    } catch (err) {
      alert("Failed demo login");
    }
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-[#8D8A83]">Loading project details...</div>;
  }

  if (!project) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-[#F4F0E8]">Project not found.</div>;
  }

  const clientObj = project.client_data || {};
  const isOwner = user && user.id === project.client;
  const isFreelancer = user && user.role === 'FREELANCER';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <Link to="/projects" className="inline-flex items-center space-x-2 text-xs text-[#8D8A83] hover:text-[#F4B860] font-medium">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Projects</span>
      </Link>

      {/* Main Project Card Header */}
      <div className="bg-[#171719] border border-[#2A2A2E] rounded-3xl overflow-hidden shadow-2xl">
        {project.image_url && (
          <div className="w-full h-64 sm:h-80 overflow-hidden relative">
            <img src={project.image_url} alt={project.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#171719] via-transparent to-black/30" />
          </div>
        )}

        <div className="p-8 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-2">
              <span className="text-xs font-semibold px-3 py-1 rounded-md bg-[#F4B860]/10 text-[#F4B860] border border-[#F4B860]/20">
                {project.category_data?.name || 'Category'}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F4F0E8]">{project.title}</h1>
              <p className="text-xs text-[#8D8A83]">Posted by {clientObj.username || 'Client'} • {new Date(project.created_at).toLocaleDateString()}</p>
            </div>

            <div className="text-left md:text-right">
              <div className="text-2xl font-extrabold text-[#F4B860]">
                ₹{parseFloat(project.min_budget).toLocaleString('en-IN')} - ₹{parseFloat(project.max_budget).toLocaleString('en-IN')}
              </div>
              <span className="text-xs text-[#8D8A83]">{project.budget_type === 'FIXED' ? 'Fixed Price' : 'Hourly Rate'}</span>
            </div>
          </div>

          {/* Status Pill & Apply CTA */}
          <div className="flex flex-wrap items-center justify-between pt-6 border-t border-[#2A2A2E] gap-4">
            <div className="flex items-center space-x-4 text-xs text-[#8D8A83]">
              <span className="bg-[#0B0B0D] px-3 py-1.5 rounded-lg border border-[#2A2A2E]">Status: <strong className="text-[#F4B860]">{project.status}</strong></span>
              <span>{project.proposals_count} Bids Received</span>
              <span>Location: {project.location_type}</span>
            </div>

            {/* Application CTAs */}
            {project.status === 'OPEN' && (
              <div>
                {isFreelancer ? (
                  <button
                    onClick={() => { setBidAmount(project.min_budget); setModalOpen(true); }}
                    className="btn-amber px-6 py-3 rounded-xl text-sm font-bold shadow-lg shadow-[#F4B860]/20 flex items-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Proposal Now</span>
                  </button>
                ) : !user ? (
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleQuickDemoFreelancerLogin}
                      className="btn-amber px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg flex items-center space-x-1.5"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Apply as Demo Freelancer</span>
                    </button>
                    <Link
                      to={`/login?redirect=/projects/${id}?apply=true`}
                      className="bg-[#1D1D20] border border-[#2A2A2E] hover:border-[#F4B860] text-[#F4F0E8] px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-1"
                    >
                      <LogIn className="w-3.5 h-3.5 text-[#F4B860]" />
                      <span>Log In to Apply</span>
                    </Link>
                  </div>
                ) : (
                  <button
                    onClick={handleQuickDemoFreelancerLogin}
                    className="btn-amber px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg flex items-center space-x-1.5"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Switch to Freelancer to Apply</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl text-xs flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Description & Requirements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#171719] border border-[#2A2A2E] rounded-2xl p-6 space-y-3">
            <h3 className="font-bold text-lg text-[#F4F0E8]">Project Description</h3>
            <p className="text-sm text-[#8D8A83] leading-relaxed whitespace-pre-line">{project.description}</p>
          </div>

          <div className="bg-[#171719] border border-[#2A2A2E] rounded-2xl p-6 space-y-3">
            <h3 className="font-bold text-lg text-[#F4F0E8]">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {(project.skills_required_data || []).map(sk => (
                <span key={sk.id} className="text-xs bg-[#0B0B0D] border border-[#2A2A2E] text-[#F4F0E8] px-3 py-1.5 rounded-xl font-medium">
                  {sk.name}
                </span>
              ))}
            </div>
          </div>

          {/* Owner View: Proposals Submitted */}
          {(isOwner || user?.role === 'ADMIN') && (
            <div className="bg-[#171719] border border-[#2A2A2E] rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-lg text-[#F4F0E8]">Proposals Received ({proposals.length})</h3>
              {proposals.length === 0 ? (
                <p className="text-xs text-[#8D8A83]">No proposals submitted yet.</p>
              ) : (
                <div className="space-y-3">
                  {proposals.map(prop => (
                    <div key={prop.id} className="bg-[#0B0B0D] border border-[#2A2A2E] p-4 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-sm text-[#F4F0E8]">{prop.freelancer_data?.username}</p>
                          <p className="text-xs text-[#8D8A83]">Bid: ₹{parseFloat(prop.bid_amount).toLocaleString('en-IN')} • Delivery: {prop.estimated_delivery_days} Days</p>
                        </div>
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#F4B860]/10 text-[#F4B860]">{prop.status}</span>
                      </div>
                      <p className="text-xs text-[#8D8A83] italic">{prop.cover_letter}</p>
                      
                      {project.status === 'OPEN' && prop.status === 'PENDING' && (
                        <button
                          onClick={() => handleAcceptProposal(prop.id)}
                          className="btn-amber px-4 py-1.5 rounded-lg text-xs font-bold shadow"
                        >
                          Accept Proposal & Hire
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar details */}
        <div className="space-y-6">
          <div className="bg-[#171719] border border-[#2A2A2E] rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-sm text-[#F4F0E8] border-b border-[#2A2A2E] pb-3">About the Client</h3>
            <div className="space-y-3 text-xs text-[#8D8A83]">
              <div className="flex items-center justify-between">
                <span>Client Name:</span>
                <strong className="text-[#F4F0E8]">{clientObj.username || 'Client'}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Verification:</span>
                <span className="text-emerald-400 font-semibold flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 inline mr-1" />
                  Verified
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PROPOSAL SUBMISSION MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#171719] border border-[#2A2A2E] rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl relative">
            <button 
              onClick={() => setModalOpen(false)}
              className="absolute top-6 right-6 text-[#8D8A83] hover:text-[#F4F0E8]"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-xl font-bold text-[#F4F0E8]">Submit Your Proposal</h3>
              <p className="text-xs text-[#8D8A83] mt-1">Submit your bid for "{project.title}"</p>
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-3 rounded-xl text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleProposalSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#8D8A83] mb-1 font-semibold">Bid Amount (₹)</label>
                <input
                  type="number"
                  required
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="w-full bg-[#0B0B0D] border border-[#2A2A2E] text-[#F4F0E8] p-3 rounded-xl focus:border-[#F4B860] focus:outline-none"
                  placeholder="Enter bid amount in ₹"
                />
              </div>

              <div>
                <label className="block text-[#8D8A83] mb-1 font-semibold">Estimated Delivery (Days)</label>
                <input
                  type="number"
                  required
                  value={deliveryDays}
                  onChange={(e) => setDeliveryDays(e.target.value)}
                  className="w-full bg-[#0B0B0D] border border-[#2A2A2E] text-[#F4F0E8] p-3 rounded-xl focus:border-[#F4B860] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#8D8A83] mb-1 font-semibold">Cover Letter / Proposal Pitch</label>
                <textarea
                  rows={4}
                  required
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="w-full bg-[#0B0B0D] border border-[#2A2A2E] text-[#F4F0E8] p-3 rounded-xl focus:border-[#F4B860] focus:outline-none"
                  placeholder="Explain why you are the best fit for this project..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 bg-[#0B0B0D] text-[#8D8A83] rounded-xl hover:text-[#F4F0E8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-amber px-6 py-2.5 rounded-xl font-bold"
                >
                  {submitting ? 'Submitting...' : 'Submit Proposal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
