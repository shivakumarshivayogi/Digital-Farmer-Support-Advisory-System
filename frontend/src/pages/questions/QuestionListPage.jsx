import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
  HelpCircle,
  Search,
  Plus,
  MessageSquare,
  CheckCircle2,
  Clock,
  Loader2,
  Sprout,
  Image as ImageIcon,
} from 'lucide-react';

const QuestionListPage = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      let query = `/questions?search=${encodeURIComponent(searchTerm)}`;
      if (statusFilter) query += `&status=${encodeURIComponent(statusFilter)}`;

      const res = await api.get(query);
      if (res.data.success) {
        setQuestions(res.data.questions);
      }
    } catch (err) {
      console.error('Failed to load questions', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [searchTerm, statusFilter]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ANSWERED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Answered by Expert
          </span>
        );
      case 'CLOSED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/20 text-slate-300">
            Closed
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Awaiting Answer
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-emerald-500/20 relative overflow-hidden bg-gradient-to-r from-slate-900 via-emerald-950/30 to-slate-900">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
              <HelpCircle className="w-3.5 h-3.5" /> Farmer Q&A Forum
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Ask Crop Diagnostics & Advice</h1>
            <p className="text-xs text-slate-300">
              Post questions, upload crop photos, and receive diagnostic advice from certified agriculture experts.
            </p>
          </div>

          <Link
            to="/questions/new"
            className="flex items-center gap-2 px-5 py-3 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
          >
            <Plus className="w-4 h-4" /> Ask Question
          </Link>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search questions by crop name or symptoms..."
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="">All Statuses</option>
            <option value="ANSWERED">Answered Only</option>
            <option value="PENDING">Awaiting Answer</option>
          </select>
        </div>
      </div>

      {/* Questions List */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          <p className="text-xs font-medium">Fetching advisory questions...</p>
        </div>
      ) : questions.length === 0 ? (
        <div className="glass-card p-12 rounded-3xl border border-slate-800 text-center space-y-3">
          <HelpCircle className="w-8 h-8 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No Questions Posted Yet</h3>
          <p className="text-xs text-slate-400">Be the first farmer to post a crop question!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((q) => (
            <Link
              key={q._id}
              to={`/questions/${q._id}`}
              className="glass-card p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-start justify-between gap-4 hover:border-emerald-500/30 transition-all block"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-emerald-400 border border-slate-700">
                    Crop: {q.crop}
                  </span>
                  {getStatusBadge(q.status)}
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                  {q.title}
                </h3>
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{q.description}</p>

                <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                  <span>Asked by {q.farmerId?.name || 'Farmer'}</span>
                  <span>•</span>
                  <span>{new Date(q.createdAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                    <MessageSquare className="w-3.5 h-3.5" /> {q.answers?.length || 0} Expert Answers
                  </span>
                </div>
              </div>

              {q.image && (
                <img
                  src={q.image}
                  alt={q.title}
                  className="w-20 h-20 rounded-2xl object-cover border border-slate-700 shrink-0"
                />
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionListPage;
