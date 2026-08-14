import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
  Sprout,
  Plus,
  Search,
  MapPin,
  Compass,
  Droplets,
  Layers,
  Edit,
  Trash2,
  Eye,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

const FarmListPage = () => {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchFarms = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/farms');
      if (res.data.success) {
        setFarms(res.data.farms);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load farms list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarms();
  }, []);

  const handleDelete = async (farmId, farmName) => {
    if (!window.confirm(`Are you sure you want to delete "${farmName}"?`)) return;

    setDeleteLoading(farmId);
    try {
      const res = await api.delete(`/farms/${farmId}`);
      if (res.data.success) {
        setSuccessMessage(`Farm "${farmName}" deleted successfully.`);
        setFarms(farms.filter((f) => f._id !== farmId));
        setTimeout(() => setSuccessMessage(''), 4000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete farm.');
    } finally {
      setDeleteLoading(null);
    }
  };

  const filteredFarms = farms.filter(
    (f) =>
      f.farmName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.soilType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-emerald-500/20 relative overflow-hidden bg-gradient-to-r from-slate-900 via-emerald-950/30 to-slate-900">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
              <Sprout className="w-3.5 h-3.5" /> Farm Management
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">My Farm Plots</h1>
            <p className="text-xs text-slate-300">
              Manage your agricultural land holdings, soil profiles, and irrigation infrastructure
            </p>
          </div>

          <Link
            to="/farmer/farms/new"
            className="flex items-center gap-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" /> Add New Farm Plot
          </Link>
        </div>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {successMessage}
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400" /> {error}
        </div>
      )}

      {/* Search Bar */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search farm by name, soil type, or district..."
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
        <span className="text-xs text-slate-400">
          Showing <strong className="text-white">{filteredFarms.length}</strong> of {farms.length} farms
        </span>
      </div>

      {/* Farm Grid */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          <p className="text-xs font-medium">Loading your farm records...</p>
        </div>
      ) : filteredFarms.length === 0 ? (
        <div className="glass-card p-12 rounded-3xl border border-slate-800 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
            <Sprout className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No Farms Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchTerm
              ? 'No farm plots match your search criteria.'
              : 'You have not registered any farm plots yet. Add your first farm plot to get started.'}
          </p>
          {!searchTerm && (
            <Link
              to="/farmer/farms/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-slate-950 text-xs font-bold rounded-xl"
            >
              <Plus className="w-3.5 h-3.5" /> Register First Farm
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFarms.map((farm) => (
            <div
              key={farm._id}
              className="glass-card p-6 rounded-3xl border border-slate-800 flex flex-col justify-between hover:border-emerald-500/30 transition-all group"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {farm.farmName}
                    </h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      {farm.location}
                      {farm.district ? `, ${farm.district}` : ''}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {farm.area} {farm.areaUnit}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-800">
                  <div className="p-2.5 rounded-xl bg-slate-900/60 space-y-0.5">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Compass className="w-3 h-3 text-amber-400" /> Soil Type
                    </span>
                    <p className="font-semibold text-white truncate">{farm.soilType || 'N/A'}</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900/60 space-y-0.5">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Droplets className="w-3 h-3 text-sky-400" /> Irrigation
                    </span>
                    <p className="font-semibold text-white truncate">{farm.irrigationType || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-800/80 gap-2">
                <Link
                  to={`/farmer/farms/${farm._id}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-emerald-400" /> Details
                </Link>

                <div className="flex items-center gap-1">
                  <Link
                    to={`/farmer/farms/${farm._id}/edit`}
                    className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors"
                    title="Edit Farm"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>

                  <button
                    onClick={() => handleDelete(farm._id, farm.farmName)}
                    disabled={deleteLoading === farm._id}
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50"
                    title="Delete Farm"
                  >
                    {deleteLoading === farm._id ? (
                      <Loader2 className="w-4 h-4 animate-spin text-rose-400" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FarmListPage;
