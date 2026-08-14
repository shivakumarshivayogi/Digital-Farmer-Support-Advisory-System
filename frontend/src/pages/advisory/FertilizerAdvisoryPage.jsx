import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import {
  Droplets,
  Search,
  Filter,
  ShieldAlert,
  CheckCircle2,
  BookOpen,
  Loader2,
  Sprout,
} from 'lucide-react';

const FertilizerAdvisoryPage = () => {
  const [fertilizers, setFertilizers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('');
  const [selectedNutrient, setSelectedNutrient] = useState('');

  const fetchFertilizers = async () => {
    setLoading(true);
    try {
      let query = `/advisory/fertilizers?search=${encodeURIComponent(searchTerm)}`;
      if (selectedCrop) query += `&crop=${encodeURIComponent(selectedCrop)}`;
      if (selectedNutrient) query += `&nutrient=${encodeURIComponent(selectedNutrient)}`;

      const res = await api.get(query);
      if (res.data.success) {
        setFertilizers(res.data.fertilizers);
      }
    } catch (err) {
      console.error('Failed to fetch fertilizer advisories', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFertilizers();
  }, [searchTerm, selectedCrop, selectedNutrient]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-sky-500/20 relative overflow-hidden bg-gradient-to-r from-slate-900 via-sky-950/30 to-slate-900">
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs font-semibold">
            <Droplets className="w-3.5 h-3.5" /> Soil Nutrient & Fertilizer Calculator
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Fertilizer Advisory & Dosages</h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Recommended application doses, split schedules, micro-nutrient management, and handling precautions for maximum yield efficiency.
          </p>
          <span className="inline-block mt-2 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-[11px] font-medium text-amber-300">
            ℹ️ Includes Expert Sample Dosage Standards
          </span>
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
            placeholder="Search fertilizer name (e.g. Urea, DAP, MOP, SSP), crop, or nutrient..."
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
          >
            <option value="">All Crops</option>
            <option value="Wheat">Wheat</option>
            <option value="Paddy Rice">Paddy Rice</option>
            <option value="Cotton">Cotton</option>
            <option value="Tomato">Tomato</option>
          </select>

          <select
            value={selectedNutrient}
            onChange={(e) => setSelectedNutrient(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
          >
            <option value="">All Nutrients</option>
            <option value="Nitrogen">Nitrogen (N)</option>
            <option value="Phosphorus">Phosphorus (P)</option>
            <option value="Potassium">Potassium (K)</option>
          </select>
        </div>
      </div>

      {/* Fertilizer Cards Grid */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
          <p className="text-xs font-medium">Fetching fertilizer advisory records...</p>
        </div>
      ) : fertilizers.length === 0 ? (
        <div className="glass-card p-12 rounded-3xl border border-slate-800 text-center space-y-3">
          <Droplets className="w-8 h-8 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No Fertilizer Advisories Found</h3>
          <p className="text-xs text-slate-400">Try searching for Urea, DAP, MOP, or Single Super Phosphate.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fertilizers.map((f) => (
            <div
              key={f._id}
              className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4 hover:border-sky-500/30 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-white">{f.fertilizerName}</h3>
                    <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                      <Sprout className="w-3.5 h-3.5" /> Target Crop: {f.crop}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-sky-500/10 text-sky-300 border border-sky-500/20">
                    {f.nutrient}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1 text-xs">
                  <span className="text-[11px] font-bold text-sky-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Application Schedule & Dosage
                  </span>
                  <p className="text-slate-300 leading-relaxed">{f.generalGuidance}</p>
                </div>

                {f.precautions && (
                  <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-1 text-xs">
                    <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5" /> Safety & Field Precautions
                    </span>
                    <p className="text-slate-200 leading-relaxed">{f.precautions}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FertilizerAdvisoryPage;
