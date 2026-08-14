import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
  Award,
  HelpCircle,
  MessageSquare,
  Star,
  CheckCircle2,
  Clock,
  ArrowRight,
  Loader2,
  User,
} from 'lucide-react';

const ExpertDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpertStats = async () => {
      setLoading(true);
      try {
        const res = await api.get('/dashboard/expert');
        if (res.data.success) {
          setStats(res.data.stats);
        }
      } catch (err) {
        console.error('Failed to load expert dashboard', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExpertStats();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400 flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
        <p className="text-xs font-medium">Loading Agriculture Expert Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-amber-500/20 relative overflow-hidden bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold">
              <Award className="w-3.5 h-3.5" /> Certified Agriculture Specialist
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Expert Advisory Workstation</h1>
            <p className="text-xs text-slate-300">
              Welcome {user?.name} ({user?.specialization || 'Agronomist'}). Respond to farmer Q&A diagnostics and manage 1-on-1 consultations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/questions"
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5"
            >
              Browse Q&A Forum <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-semibold">Total Q&A Questions</span>
          <p className="text-3xl font-black text-white">{stats?.totalQuestions || 0}</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-xs text-amber-400 font-semibold">Awaiting Expert Answer</span>
          <p className="text-3xl font-black text-amber-400">{stats?.pendingQuestions || 0}</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-xs text-emerald-400 font-semibold">Answered Diagnostics</span>
          <p className="text-3xl font-black text-emerald-400">{stats?.answeredQuestions || 0}</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-xs text-sky-400 font-semibold">1-on-1 Consultations</span>
          <p className="text-3xl font-black text-sky-400">{stats?.totalConsultations || 0}</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-1 bg-gradient-to-br from-slate-900 to-amber-950/20">
          <span className="text-xs text-slate-400 font-semibold">Overall Rating</span>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-black text-amber-400">{stats?.rating?.toFixed(1) || '5.0'}</span>
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
          </div>
          <span className="text-[10px] text-slate-500 block">Based on {stats?.ratingCount || 1} farmer reviews</span>
        </div>
      </div>

      {/* Main Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Unanswered Questions Feed */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-400" /> Pending Questions Needing Expert Answer
            </h3>
            <Link to="/questions" className="text-xs font-semibold text-amber-400 hover:underline">
              View All
            </Link>
          </div>

          {stats?.unansweredList?.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">All farmer questions have been answered!</p>
          ) : (
            <div className="space-y-3">
              {stats?.unansweredList?.map((q) => (
                <div key={q._id} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-400">Crop: {q.crop}</span>
                    <span className="text-slate-500">{new Date(q.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white">{q.title}</h4>
                  <p className="text-xs text-slate-300 line-clamp-2">{q.description}</p>
                  <Link
                    to={`/questions/${q._id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 hover:underline pt-1"
                  >
                    Submit Expert Answer <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Consultations Requests */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-sky-400" /> Recent 1-on-1 Consultation Requests
            </h3>
            <Link to="/consultations" className="text-xs font-semibold text-sky-400 hover:underline">
              Manage Consultations
            </Link>
          </div>

          {stats?.recentConsultations?.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">No consultation requests assigned.</p>
          ) : (
            <div className="space-y-3">
              {stats?.recentConsultations?.map((c) => (
                <div key={c._id} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{c.farmerId?.name || 'Farmer'}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      {c.status}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-200">{c.subject}</h4>
                  <Link
                    to="/consultations"
                    className="inline-flex items-center gap-1 text-xs font-bold text-sky-400 hover:underline pt-1"
                  >
                    Manage Request <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpertDashboard;
