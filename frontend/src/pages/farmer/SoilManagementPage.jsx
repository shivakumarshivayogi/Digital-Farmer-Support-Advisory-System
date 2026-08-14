import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import {
  Compass,
  Plus,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Activity,
  Layers,
  Calendar,
  Droplets,
} from 'lucide-react';

const SoilManagementPage = () => {
  const [farms, setFarms] = useState([]);
  const [soilRecords, setSoilRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const [formData, setFormData] = useState({
    farmId: '',
    soilType: 'Alluvial',
    ph: '6.8',
    nitrogen: '160',
    phosphorus: '22',
    potassium: '180',
    organicCarbon: '0.6',
    moisture: '22',
    testingDate: new Date().toISOString().split('T')[0],
  });

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [farmsRes, soilRes] = await Promise.all([
        api.get('/farms'),
        api.get('/soil-records'),
      ]);

      if (farmsRes.data.success) {
        setFarms(farmsRes.data.farms);
        if (farmsRes.data.farms.length > 0 && !formData.farmId) {
          setFormData((prev) => ({ ...prev, farmId: farmsRes.data.farms[0]._id }));
        }
      }

      if (soilRes.data.success) {
        setSoilRecords(soilRes.data.soilRecords);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load soil records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.farmId || !formData.ph || !formData.nitrogen) {
      setError('Please select a farm plot and enter required NPK & pH values.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await api.post('/soil-records', formData);
      if (res.data.success) {
        setSuccess('Soil test record added successfully!');
        setShowAddModal(false);
        fetchData();
        setTimeout(() => setSuccess(''), 4000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save soil test record.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this soil test record?')) return;
    try {
      const res = await api.delete(`/soil-records/${id}`);
      if (res.data.success) {
        setSoilRecords(soilRecords.filter((r) => r._id !== id));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete record.');
    }
  };

  const getPhStatus = (phVal) => {
    const ph = Number(phVal);
    if (ph < 6.0) return { label: 'Acidic', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' };
    if (ph > 7.5) return { label: 'Alkaline', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' };
    return { label: 'Optimal pH', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
  };

  const getNpkRating = (n, p, k) => {
    let score = 0;
    if (n >= 140 && n <= 280) score++;
    if (p >= 15 && p <= 30) score++;
    if (k >= 120 && k <= 250) score++;

    if (score === 3) return { status: 'Optimal NPK Balance', badge: 'bg-emerald-500/20 text-emerald-300' };
    if (score === 2) return { status: 'Moderate Soil Fertility', badge: 'bg-amber-500/20 text-amber-300' };
    return { status: 'Nutrient Deficient', badge: 'bg-rose-500/20 text-rose-300' };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-amber-500/20 relative overflow-hidden bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold">
              <Compass className="w-3.5 h-3.5" /> Soil Health Management
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Soil Testing & NPK Tracker</h1>
            <p className="text-xs text-slate-300">
              Log soil laboratory test results (pH, Nitrogen, Phosphorus, Potassium, Organic Carbon) to optimize fertilizer usage.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" /> Log Soil Test Result
          </button>
        </div>
      </div>

      {/* Notifications */}
      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {success}
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400" /> {error}
        </div>
      )}

      {/* Add Soil Record Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 max-w-2xl w-full space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Compass className="w-5 h-5 text-amber-400" /> Log Soil Health Test
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 bg-slate-800 rounded-lg"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Select Farm Plot *</label>
                <select
                  name="farmId"
                  value={formData.farmId}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-amber-500 focus:outline-none"
                  required
                >
                  {farms.map((f) => (
                    <option key={f._id} value={f._id}>
                      {f.farmName} ({f.location})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Soil pH (0-14) *</label>
                  <input
                    type="number"
                    step="0.1"
                    name="ph"
                    value={formData.ph}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Nitrogen (N) kg/ha *</label>
                  <input
                    type="number"
                    name="nitrogen"
                    value={formData.nitrogen}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Phosphorus (P) kg/ha *</label>
                  <input
                    type="number"
                    name="phosphorus"
                    value={formData.phosphorus}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Potassium (K) kg/ha *</label>
                  <input
                    type="number"
                    name="potassium"
                    value={formData.potassium}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Organic Carbon (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="organicCarbon"
                    value={formData.organicCarbon}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Moisture (%)</label>
                  <input
                    type="number"
                    name="moisture"
                    value={formData.moisture}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Testing Date</label>
                <input
                  type="date"
                  name="testingDate"
                  value={formData.testingDate}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-800">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Test Record'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Soil Records List */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
          <p className="text-xs font-medium">Loading soil health records...</p>
        </div>
      ) : soilRecords.length === 0 ? (
        <div className="glass-card p-12 rounded-3xl border border-slate-800 text-center space-y-3">
          <Compass className="w-8 h-8 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No Soil Tests Recorded</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Log your laboratory NPK & pH soil test results to track land fertility over time.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {soilRecords.map((rec) => {
            const phInfo = getPhStatus(rec.ph);
            const npkEval = getNpkRating(rec.nitrogen, rec.phosphorus, rec.potassium);

            return (
              <div
                key={rec._id}
                className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4 hover:border-amber-500/30 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {rec.farmId?.farmName || 'Farm Plot'}
                    </h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      Tested on {new Date(rec.testingDate).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(rec._id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${phInfo.color}`}>
                    pH {rec.ph} ({phInfo.label})
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${npkEval.badge}`}>
                    {npkEval.status}
                  </span>
                </div>

                {/* NPK Values Grid */}
                <div className="grid grid-cols-3 gap-3 text-center pt-2 border-t border-slate-800">
                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 block">Nitrogen (N)</span>
                    <span className="text-base font-black text-emerald-400">{rec.nitrogen}</span>
                    <span className="text-[9px] text-slate-500 block">kg/ha</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 block">Phosphorus (P)</span>
                    <span className="text-base font-black text-amber-400">{rec.phosphorus}</span>
                    <span className="text-[9px] text-slate-500 block">kg/ha</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 block">Potassium (K)</span>
                    <span className="text-base font-black text-sky-400">{rec.potassium}</span>
                    <span className="text-[9px] text-slate-500 block">kg/ha</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SoilManagementPage;
