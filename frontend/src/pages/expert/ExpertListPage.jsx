import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
  Award,
  Search,
  Filter,
  Star,
  Clock,
  ShieldCheck,
  ArrowRight,
  Loader2,
  MapPin,
  MessageSquare,
} from 'lucide-react';

const ExpertListPage = () => {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('');

  const fetchExperts = async () => {
    setLoading(true);
    try {
      let query = `/experts?search=${encodeURIComponent(searchTerm)}`;
      if (specializationFilter) query += `&specialization=${encodeURIComponent(specializationFilter)}`;

      const res = await api.get(query);
      if (res.data.success) {
        setExperts(res.data.experts);
      }
    } catch (err) {
      console.error('Failed to fetch experts', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperts();
  }, [searchTerm, specializationFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-amber-500/20 relative overflow-hidden bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900">
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold">
            <Award className="w-3.5 h-3.5" /> Certified Agricultural Advisory Specialists
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Find Agriculture Experts</h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Connect with verified agronomists, plant pathologists, soil scientists, and pest management experts for 1-on-1 tailored consultations.
          </p>
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
            placeholder="Search expert by name, specialization, or qualification..."
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={specializationFilter}
            onChange={(e) => setSpecializationFilter(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
          >
            <option value="">All Specializations</option>
            <option value="Agronomy">Agronomy & Crop Rotation</option>
            <option value="Pathology">Plant Pathology & Diseases</option>
            <option value="Soil">Soil Science & Fertility</option>
            <option value="Entomology">Pest & Insect Management</option>
          </select>
        </div>
      </div>

      {/* Expert Cards Grid */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
          <p className="text-xs font-medium">Loading certified agriculture experts...</p>
        </div>
      ) : experts.length === 0 ? (
        <div className="glass-card p-12 rounded-3xl border border-slate-800 text-center space-y-3">
          <Award className="w-8 h-8 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No Experts Found</h3>
          <p className="text-xs text-slate-400">Try adjusting your search criteria or clearing filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {experts.map((exp) => (
            <div
              key={exp._id}
              className="glass-card p-6 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-4 hover:border-amber-500/30 transition-all"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <img
                    src={exp.profileImage || exp.avatar}
                    alt={exp.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-amber-500/40"
                  />
                  <div className="space-y-0.5">
                    <h3 className="text-base font-bold text-white leading-tight">{exp.name}</h3>
                    <p className="text-xs text-amber-400 font-semibold">{exp.specialization}</p>
                    <p className="text-[11px] text-slate-400">{exp.qualification}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800">
                  <div className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>{exp.rating?.toFixed(1) || '5.0'}</span>
                    <span className="text-slate-500 font-normal text-[10px]">({exp.ratingCount || 1} reviews)</span>
                  </div>

                  <span className="text-slate-300 font-semibold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> {exp.experience} yrs exp
                  </span>
                </div>

                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                  {exp.bio}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] text-slate-500 block">Consultation Fee</span>
                  <span className="text-xs font-bold text-emerald-400">
                    {exp.consultationFee > 0 ? `₹${exp.consultationFee}` : 'Free Advice'}
                  </span>
                </div>

                <Link
                  to={`/experts/${exp._id}`}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/10"
                >
                  View Profile <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExpertListPage;
