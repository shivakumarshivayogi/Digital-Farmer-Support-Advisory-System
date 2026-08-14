import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import {
  Bug,
  Search,
  Filter,
  AlertTriangle,
  ShieldCheck,
  Activity,
  Loader2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const DiseaseAdvisoryPage = () => {
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const fetchDiseases = async () => {
    setLoading(true);
    try {
      let query = `/advisory/diseases?search=${encodeURIComponent(searchTerm)}`;
      if (selectedCrop) query += `&crop=${encodeURIComponent(selectedCrop)}`;
      if (selectedSeverity) query += `&severity=${encodeURIComponent(selectedSeverity)}`;

      const res = await api.get(query);
      if (res.data.success) {
        setDiseases(res.data.diseases);
      }
    } catch (err) {
      console.error('Failed to fetch disease advisories', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiseases();
  }, [searchTerm, selectedCrop, selectedSeverity]);

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-500/20 text-rose-300 border border-rose-500/30">
            CRITICAL SEVERITY
          </span>
        );
      case 'HIGH':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            HIGH SEVERITY
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
            MEDIUM SEVERITY
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/20 text-slate-300">
            LOW SEVERITY
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-rose-500/20 relative overflow-hidden bg-gradient-to-r from-slate-900 via-rose-950/30 to-slate-900">
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-semibold">
            <Bug className="w-3.5 h-3.5" /> Plant Pathology & Pest Diagnostics
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Disease & Pest Advisory Guide</h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Identify crop diseases, fungal blights, viral infections, and insect pests with verified symptoms, prevention strategies, and chemical treatments.
          </p>
          <span className="inline-block mt-2 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-[11px] font-medium text-amber-300">
            ℹ️ Includes Expert Sample Pest Diagnostics
          </span>
        </div>
      </div>

      {/* Filter & Search Controls */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search disease name, symptoms, or crop..."
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500"
          >
            <option value="">All Affected Crops</option>
            <option value="Wheat">Wheat</option>
            <option value="Paddy Rice">Paddy Rice</option>
            <option value="Cotton">Cotton</option>
            <option value="Tomato">Tomato</option>
          </select>

          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500"
          >
            <option value="">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* Disease Cards */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
          <p className="text-xs font-medium">Fetching plant disease records...</p>
        </div>
      ) : diseases.length === 0 ? (
        <div className="glass-card p-12 rounded-3xl border border-slate-800 text-center space-y-3">
          <Bug className="w-8 h-8 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No Disease Records Found</h3>
          <p className="text-xs text-slate-400">Try clearing filter parameters or searching by disease name.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {diseases.map((d) => {
            const isExpanded = expandedId === d._id;

            return (
              <div
                key={d._id}
                className="glass-card rounded-3xl border border-slate-800 overflow-hidden flex flex-col justify-between hover:border-rose-500/30 transition-all"
              >
                <div>
                  <div className="relative h-44 bg-slate-900 overflow-hidden">
                    <img src={d.image} alt={d.name} className="w-full h-full object-cover" />
                    <div className="absolute top-3 right-3">{getSeverityBadge(d.severity)}</div>
                    <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800 text-xs font-bold text-emerald-400">
                      Crop: {d.crop}
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <h3 className="text-lg font-bold text-white">{d.name}</h3>

                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                      <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">
                        Visible Symptoms
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed">{d.symptoms}</p>
                    </div>

                    {isExpanded && (
                      <div className="space-y-3 text-xs text-slate-300 pt-2 border-t border-slate-800">
                        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                            Causes & Environmental Triggers
                          </span>
                          <p className="leading-relaxed">{d.causes}</p>
                        </div>

                        <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
                          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                            Prevention & Cultural Measures
                          </span>
                          <p className="leading-relaxed">{d.prevention}</p>
                        </div>

                        <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-1">
                          <span className="text-[10px] font-bold text-rose-300 uppercase tracking-wider block">
                            Chemical & Fungicidal Management
                          </span>
                          <p className="leading-relaxed text-slate-200">{d.management}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-slate-950/40 border-t border-slate-800 text-center">
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : d._id)}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                  >
                    {isExpanded ? (
                      <>
                        Collapse Treatment Details <ChevronUp className="w-4 h-4 text-rose-400" />
                      </>
                    ) : (
                      <>
                        View Full Diagnostic & Treatment Plan <ChevronDown className="w-4 h-4 text-rose-400" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DiseaseAdvisoryPage;
