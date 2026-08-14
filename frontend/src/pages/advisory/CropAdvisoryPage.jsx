import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import {
  Sprout,
  Search,
  BookOpen,
  Compass,
  Droplets,
  Calendar,
  ShieldCheck,
  AlertTriangle,
  Bug,
  Info,
  Loader2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const CropAdvisoryPage = () => {
  const [advisories, setAdvisories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCrop, setExpandedCrop] = useState(null);

  const fetchAdvisories = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/advisory/crops?search=${encodeURIComponent(searchTerm)}`);
      if (res.data.success) {
        setAdvisories(res.data.advisories);
      }
    } catch (err) {
      console.error('Failed to load crop advisories', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvisories();
  }, [searchTerm]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-emerald-500/20 relative overflow-hidden bg-gradient-to-r from-slate-900 via-emerald-950/30 to-slate-900">
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5" /> Agricultural Knowledge Base
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Crop Advisory Encyclopedia</h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Comprehensive agronomy guidance: suitable soil types, climatic conditions, water management, sowing windows, pest control, and disease prevention.
          </p>
          <span className="inline-block mt-2 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-[11px] font-medium text-amber-300">
            ℹ️ Includes Expert Sample Advisory Standards
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by crop name (e.g. Wheat, Paddy Rice, Cotton, Tomato)..."
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Advisory Cards */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          <p className="text-xs font-medium">Fetching crop advisories...</p>
        </div>
      ) : advisories.length === 0 ? (
        <div className="glass-card p-12 rounded-3xl border border-slate-800 text-center space-y-3">
          <Sprout className="w-8 h-8 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No Crop Advisories Found</h3>
          <p className="text-xs text-slate-400">Try searching for Wheat, Paddy Rice, Cotton, or Tomato.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {advisories.map((adv) => {
            const isExpanded = expandedCrop === adv._id;

            return (
              <div
                key={adv._id}
                className="glass-card rounded-3xl border border-slate-800 overflow-hidden transition-all hover:border-emerald-500/30"
              >
                <div className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <img
                      src={adv.image}
                      alt={adv.cropName}
                      className="w-16 h-16 rounded-2xl object-cover border border-slate-700 shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-white">{adv.cropName}</h3>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {adv.growthDuration}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 flex items-center gap-1.5">
                        <Compass className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        {adv.suitableSoil}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setExpandedCrop(isExpanded ? null : adv._id)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors shrink-0"
                  >
                    {isExpanded ? (
                      <>
                        Hide Details <ChevronUp className="w-4 h-4 text-emerald-400" />
                      </>
                    ) : (
                      <>
                        View Full Advisory <ChevronDown className="w-4 h-4 text-emerald-400" />
                      </>
                    )}
                  </button>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-6 pt-0 border-t border-slate-800/80 space-y-6 text-xs text-slate-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                        <h4 className="font-bold text-white flex items-center gap-1.5">
                          <Compass className="w-4 h-4 text-amber-400" /> Climatic & Growing Conditions
                        </h4>
                        <p className="leading-relaxed text-slate-300">{adv.growingConditions}</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                        <h4 className="font-bold text-white flex items-center gap-1.5">
                          <Droplets className="w-4 h-4 text-sky-400" /> Water Management
                        </h4>
                        <p className="leading-relaxed text-slate-300">{adv.waterRequirements}</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                        <h4 className="font-bold text-white flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-emerald-400" /> Sowing Schedule & Seed Rate
                        </h4>
                        <p className="leading-relaxed text-slate-300">{adv.sowingInfo}</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                        <h4 className="font-bold text-white flex items-center gap-1.5">
                          <Bug className="w-4 h-4 text-rose-400" /> Pest & Insect Information
                        </h4>
                        <p className="leading-relaxed text-slate-300">{adv.pestInfo}</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                      <h4 className="font-bold text-white flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" /> Prevention & Agronomic Best Practices
                      </h4>
                      <p className="leading-relaxed text-slate-200">{adv.preventionGuidance}</p>
                      {adv.commonDiseases?.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-emerald-900/40">
                          <span className="text-[11px] text-slate-400 font-semibold">Common Diseases:</span>
                          {adv.commonDiseases.map((d, i) => (
                            <span key={i} className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/20">
                              {d}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CropAdvisoryPage;
