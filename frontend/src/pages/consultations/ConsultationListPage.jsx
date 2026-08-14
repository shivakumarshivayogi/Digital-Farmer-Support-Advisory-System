import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
  MessageSquare,
  Clock,
  CheckCircle2,
  XCircle,
  Star,
  Send,
  Loader2,
  AlertCircle,
  User,
  Award,
  Calendar,
} from 'lucide-react';

const ConsultationListPage = () => {
  const { user } = useAuth();
  const isExpert = user?.role === 'expert';

  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  // Completion modal state for Expert
  const [expertNotes, setExpertNotes] = useState('');

  // Rating modal state for Farmer
  const [ratingVal, setRatingVal] = useState(5);
  const [reviewVal, setReviewVal] = useState('');
  const [ratingConsultationId, setRatingConsultationId] = useState(null);

  const fetchConsultations = async () => {
    setLoading(true);
    try {
      let query = '/consultations';
      if (statusFilter) query += `?status=${statusFilter}`;

      const res = await api.get(query);
      if (res.data.success) {
        setConsultations(res.data.consultations);
      }
    } catch (err) {
      console.error('Failed to fetch consultations', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, [statusFilter]);

  const handleStatusUpdate = async (id, newStatus, notes = '') => {
    setUpdatingId(id);
    try {
      const res = await api.put(`/consultations/${id}/status`, {
        status: newStatus,
        expertNotes: notes,
      });

      if (res.data.success) {
        fetchConsultations();
        setExpertNotes('');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update consultation status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    if (!ratingConsultationId) return;

    setUpdatingId(ratingConsultationId);
    try {
      const res = await api.post(`/consultations/${ratingConsultationId}/rate`, {
        rating: ratingVal,
        review: reviewVal,
      });

      if (res.data.success) {
        setRatingConsultationId(null);
        setReviewVal('');
        fetchConsultations();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit rating.');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACCEPTED':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Accepted - Active Consultation
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Completed
          </span>
        );
      case 'REJECTED':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" /> Rejected
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Pending Expert Review
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-amber-500/20 relative overflow-hidden bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold">
            <MessageSquare className="w-3.5 h-3.5" /> 1-on-1 Expert Advisory
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Consultations Dashboard</h1>
          <p className="text-xs text-slate-300">
            {isExpert
              ? 'Manage consultation requests from farmers, provide diagnostic notes, and complete sessions.'
              : 'Track consultation status, receive expert advice, and rate certified specialists.'}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {['', 'PENDING', 'ACCEPTED', 'COMPLETED', 'REJECTED'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              statusFilter === st
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/10'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {st === '' ? 'All Consultations' : st}
          </button>
        ))}
      </div>

      {/* Consultations List */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
          <p className="text-xs font-medium">Fetching consultation requests...</p>
        </div>
      ) : consultations.length === 0 ? (
        <div className="glass-card p-12 rounded-3xl border border-slate-800 text-center space-y-3">
          <MessageSquare className="w-8 h-8 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No Consultations Found</h3>
          <p className="text-xs text-slate-400">No consultation requests match this filter.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {consultations.map((c) => (
            <div
              key={c._id}
              className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4 hover:border-amber-500/30 transition-all"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-lg font-bold text-white">{c.subject}</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    Requested on {new Date(c.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {getStatusBadge(c.status)}
              </div>

              {/* Counterpart Info */}
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <img
                  src={
                    isExpert
                      ? c.farmerId?.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde'
                      : c.expertId?.profileImage || c.expertId?.avatar
                  }
                  alt="Avatar"
                  className="w-10 h-10 rounded-full border border-amber-500/40 object-cover"
                />
                <div className="text-xs">
                  <span className="text-[10px] text-slate-500 block">
                    {isExpert ? 'Farmer Client' : 'Agriculture Expert'}
                  </span>
                  <span className="font-bold text-white">
                    {isExpert ? c.farmerId?.name : c.expertId?.name}
                  </span>
                  {!isExpert && (
                    <span className="text-amber-400 font-medium ml-2">({c.expertId?.specialization})</span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 block">Problem Description:</span>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/40 p-4 rounded-2xl border border-slate-800">
                  {c.description}
                </p>
              </div>

              {c.cropImage && (
                <div>
                  <span className="text-xs font-bold text-slate-400 block mb-1">Crop Diagnostic Photo:</span>
                  <img src={c.cropImage} alt="Crop symptom" className="h-36 rounded-xl object-cover border border-slate-700" />
                </div>
              )}

              {/* Expert Advice / Notes Output */}
              {c.expertNotes && (
                <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-1 text-xs">
                  <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <Award className="w-4 h-4" /> Verified Expert Advisory & Solution
                  </span>
                  <p className="text-slate-200 leading-relaxed">{c.expertNotes}</p>
                </div>
              )}

              {/* Expert Action Controls */}
              {isExpert && c.status === 'PENDING' && (
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => handleStatusUpdate(c._id, 'ACCEPTED')}
                    disabled={updatingId === c._id}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5"
                  >
                    {updatingId === c._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                    Accept Consultation Request
                  </button>

                  <button
                    onClick={() => handleStatusUpdate(c._id, 'REJECTED')}
                    disabled={updatingId === c._id}
                    className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold rounded-xl text-xs flex items-center gap-1.5"
                  >
                    Decline Request
                  </button>
                </div>
              )}

              {isExpert && c.status === 'ACCEPTED' && (
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <label className="block text-xs font-bold text-white">Provide Diagnostic Solution & Complete Consultation</label>
                  <textarea
                    rows={3}
                    value={expertNotes}
                    onChange={(e) => setExpertNotes(e.target.value)}
                    placeholder="Enter diagnostic advice, spray recommendations, and care instructions..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-emerald-500"
                  />
                  <button
                    onClick={() => handleStatusUpdate(c._id, 'COMPLETED', expertNotes)}
                    disabled={updatingId === c._id || !expertNotes.trim()}
                    className="px-5 py-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5"
                  >
                    {updatingId === c._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    Submit Solution & Complete
                  </button>
                </div>
              )}

              {/* Farmer Rating Controls */}
              {!isExpert && c.status === 'COMPLETED' && !c.rating && (
                <div className="pt-2 border-t border-slate-800">
                  <button
                    onClick={() => setRatingConsultationId(c._id)}
                    className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5"
                  >
                    <Star className="w-3.5 h-3.5 fill-slate-950" /> Rate Expert Advisor
                  </button>
                </div>
              )}

              {c.rating && (
                <div className="flex items-center gap-2 pt-2 text-xs text-amber-400 font-bold">
                  <Star className="w-4 h-4 fill-amber-400" /> Rated {c.rating} / 5 Stars
                  {c.review && <span className="text-slate-300 font-normal">("{c.review}")</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Farmer Rating Modal */}
      {ratingConsultationId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-card p-6 rounded-3xl border border-slate-800 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" /> Rate Agriculture Expert
            </h3>

            <form onSubmit={handleRatingSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Select Star Rating (1 to 5)</label>
                <select
                  value={ratingVal}
                  onChange={(e) => setRatingVal(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-amber-500"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5 - Outstanding Advice)</option>
                  <option value={4}>⭐⭐⭐⭐ (4 - Very Helpful)</option>
                  <option value={3}>⭐⭐⭐ (3 - Average)</option>
                  <option value={2}>⭐⭐ (2 - Needs Improvement)</option>
                  <option value={1}>⭐ (1 - Unsatisfactory)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Written Feedback / Review</label>
                <textarea
                  rows={3}
                  value={reviewVal}
                  onChange={(e) => setReviewVal(e.target.value)}
                  placeholder="Share feedback regarding the diagnostic advice provided..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-amber-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs"
                >
                  Submit Rating
                </button>
                <button
                  type="button"
                  onClick={() => setRatingConsultationId(null)}
                  className="px-4 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultationListPage;
