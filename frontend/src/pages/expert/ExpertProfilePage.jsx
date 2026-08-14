import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
  Award,
  Star,
  Clock,
  MapPin,
  ShieldCheck,
  ArrowLeft,
  MessageSquare,
  Upload,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
} from 'lucide-react';

const ExpertProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [expert, setExpert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');
  const [success, setSuccess] = useState('');

  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [cropImage, setCropImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchExpert = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/experts/${id}`);
        if (res.data.success) {
          setExpert(res.data.expert);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load expert profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchExpert();
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setModalError('Crop photo must be less than 5MB.');
        return;
      }
      setCropImage(file);
      setImagePreview(URL.createObjectURL(file));
      setModalError('');
    }
  };

  const handleConsultationSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    if (!subject.trim() || !description.trim()) {
      setModalError('Please provide subject and consultation request description.');
      return;
    }

    setSubmitting(true);
    setModalError('');

    try {
      const formData = new FormData();
      formData.append('expertId', id);
      formData.append('subject', subject);
      formData.append('description', description);
      if (cropImage) {
        formData.append('cropImage', cropImage);
      }

      const res = await api.post('/consultations', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        setSuccess('Consultation request sent successfully to Expert!');
        setShowModal(false);
        setSubject('');
        setDescription('');
        setCropImage(null);
        setImagePreview(null);
        setTimeout(() => setSuccess(''), 5000);
      }
    } catch (err) {
      setModalError(err.response?.data?.message || 'Failed to submit consultation request.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400 flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
        <p className="text-xs font-medium">Loading Agriculture Expert Profile...</p>
      </div>
    );
  }

  if (error || !expert) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center space-y-4">
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4" /> {error || 'Expert profile not found.'}
        </div>
        <Link
          to="/experts"
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-200 text-xs font-semibold rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Experts Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Link
        to="/experts"
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Experts Directory
      </Link>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {success}
          </div>
          <Link to="/consultations" className="text-xs font-bold text-emerald-400 underline">
            View My Consultations
          </Link>
        </div>
      )}

      {/* Main Profile Header */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <img
            src={expert.profileImage || expert.avatar}
            alt={expert.name}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-2 border-amber-500/40 shadow-xl"
          />
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white">{expert.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Verified Expert
              </span>
            </div>
            <p className="text-sm text-amber-300 font-semibold">{expert.specialization}</p>
            <p className="text-xs text-slate-400">{expert.qualification}</p>

            <div className="flex items-center gap-4 text-xs pt-1">
              <div className="flex items-center gap-1 text-amber-400 font-bold">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{expert.rating?.toFixed(1) || '5.0'}</span>
                <span className="text-slate-500 font-normal text-[11px]">({expert.ratingCount || 1} reviews)</span>
              </div>
              <span className="text-slate-400 font-medium">{expert.experience} Years Experience</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-2xl text-xs shadow-xl shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
        >
          <MessageSquare className="w-4 h-4" /> Request 1-on-1 Advice
        </button>
      </div>

      {/* Profile Biography & Qualifications */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-400" /> Expert Background & Specializations
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
          {expert.bio}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-500 block">District & Region</span>
            <span className="font-semibold text-white">
              {expert.district ? `${expert.district}, ${expert.state}` : 'Pan-India Agriculture'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-500 block">Academic Qualification</span>
            <span className="font-semibold text-white">{expert.qualification}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-500 block">Consultation Fee</span>
            <span className="font-semibold text-emerald-400">
              {expert.consultationFee > 0 ? `₹${expert.consultationFee}` : 'Free Farmer Advisory'}
            </span>
          </div>
        </div>
      </div>

      {/* Consultation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 max-w-xl w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-amber-400" /> Request 1-on-1 Consultation
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 bg-slate-800 rounded-lg"
              >
                Close
              </button>
            </div>

            {modalError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> {modalError}
              </div>
            )}

            <form onSubmit={handleConsultationSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Subject / Problem Title *</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Fungal spot outbreak on tomato leaves"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Describe Crop Symptoms & Field Context *</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide sowing date, soil type, recent sprays, and visible crop symptoms..."
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Upload Crop Photo (Optional)</label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl cursor-pointer border border-slate-700 transition-colors">
                    <Upload className="w-4 h-4 text-amber-400" /> Choose Photo
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                  {imagePreview && (
                    <img src={imagePreview} alt="Preview" className="w-10 h-10 rounded-lg object-cover border border-amber-500/40" />
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-800">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send Request to Expert'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
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

export default ExpertProfilePage;
