import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
  HelpCircle,
  ArrowLeft,
  MessageSquare,
  Award,
  CheckCircle2,
  Send,
  Loader2,
  AlertCircle,
  Clock,
  User,
} from 'lucide-react';

const QuestionDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const isExpertOrAdmin = user?.role === 'expert' || user?.role === 'admin';

  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [answerText, setAnswerText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchQuestion = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/questions/${id}`);
      if (res.data.success) {
        setQuestion(res.data.question);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load question details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, [id]);

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    if (!answerText.trim()) return;

    setSubmitting(true);
    try {
      const res = await api.post(`/questions/${id}/answer`, { answerText });
      if (res.data.success) {
        setAnswerText('');
        fetchQuestion();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit expert answer.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400 flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        <p className="text-xs font-medium">Loading question details...</p>
      </div>
    );
  }

  if (error || !question) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center space-y-4">
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4" /> {error || 'Question not found.'}
        </div>
        <Link
          to="/questions"
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-200 text-xs font-semibold rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Q&A Forum
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Link
        to="/questions"
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Q&A Forum
      </Link>

      {/* Main Question Card */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Crop: {question.crop}
          </span>
          <span className="text-xs text-slate-400">
            Asked on {new Date(question.createdAt).toLocaleDateString()}
          </span>
        </div>

        <h1 className="text-2xl font-black text-white">{question.title}</h1>

        <div className="flex items-center gap-3 pt-1 text-xs text-slate-300">
          <img
            src={question.farmerId?.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde'}
            alt="Farmer"
            className="w-8 h-8 rounded-full border border-slate-700 object-cover"
          />
          <div>
            <span className="font-semibold text-white">{question.farmerId?.name || 'Farmer'}</span>
            <span className="block text-[10px] text-slate-500">
              {question.farmerId?.district ? `${question.farmerId.district}, ${question.farmerId.state}` : 'Farmer'}
            </span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
          {question.description}
        </p>

        {question.image && (
          <div className="pt-2">
            <span className="text-xs font-bold text-slate-400 block mb-2">Attached Crop Diagnostic Photo:</span>
            <img
              src={question.image}
              alt="Crop symptom"
              className="max-h-80 rounded-2xl object-cover border border-slate-700 shadow-xl"
            />
          </div>
        )}
      </div>

      {/* Expert Answers Section */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-emerald-400" />
          Verified Expert Diagnostic Answers ({question.answers?.length || 0})
        </h3>

        {question.answers?.length === 0 ? (
          <div className="glass-card p-6 rounded-2xl border border-slate-800 text-center text-xs text-slate-400">
            No expert answers submitted yet. Certified Agriculture Experts will respond shortly.
          </div>
        ) : (
          <div className="space-y-4">
            {question.answers.map((ans, idx) => (
              <div key={idx} className="glass-card p-6 rounded-3xl border border-emerald-500/20 bg-emerald-950/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        {ans.expertName} <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      </h4>
                      <span className="text-[11px] text-amber-400 font-medium">{ans.expertSpecialization}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {new Date(ans.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed bg-slate-900/80 p-4 rounded-2xl border border-slate-800/80">
                  {ans.answerText}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Expert Diagnostic Answer Submission Box */}
      {isExpertOrAdmin && (
        <div className="glass-card p-6 rounded-3xl border border-amber-500/30 space-y-4 bg-amber-950/10">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" /> Submit Expert Diagnostic Advice
          </h4>

          <form onSubmit={handleAnswerSubmit} className="space-y-3">
            <textarea
              rows={4}
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              placeholder="Provide expert diagnosis, recommended spray/chemical doses, and cultural practices..."
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-amber-500 focus:outline-none"
              required
            />

            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Submit Verified Expert Answer
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default QuestionDetailsPage;
