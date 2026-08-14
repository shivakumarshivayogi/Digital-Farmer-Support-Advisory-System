import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import {
  Sprout,
  ArrowLeft,
  MapPin,
  Compass,
  Droplets,
  Calendar,
  User,
  Edit,
  Trash2,
  Loader2,
  AlertCircle,
  Globe,
  Layers,
} from 'lucide-react';

const FarmDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [farm, setFarm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchFarm = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get(`/farms/${id}`);
        if (res.data.success) {
          setFarm(res.data.farm);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load farm details.');
      } finally {
        setLoading(false);
      }
    };

    fetchFarm();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${farm?.farmName}"?`)) return;

    setDeleting(true);
    try {
      const res = await api.delete(`/farms/${id}`);
      if (res.data.success) {
        navigate('/farmer/farms');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete farm plot.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400 flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        <p className="text-xs font-medium">Loading farm plot specifications...</p>
      </div>
    );
  }

  if (error || !farm) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center space-y-4">
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4" /> {error || 'Farm plot not found.'}
        </div>
        <Link
          to="/farmer/farms"
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-200 text-xs font-semibold rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Farms
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/farmer/farms"
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Farms List
        </Link>

        <div className="flex items-center gap-2">
          <Link
            to={`/farmer/farms/${farm._id}/edit`}
            className="flex items-center gap-1.5 px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold rounded-xl transition-colors"
          >
            <Edit className="w-3.5 h-3.5" /> Edit Plot
          </Link>

          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-1.5 px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold rounded-xl transition-colors disabled:opacity-50"
          >
            {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
            Delete Plot
          </button>
        </div>
      </div>

      {/* Header Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-emerald-500/20 relative overflow-hidden bg-gradient-to-r from-slate-900 via-emerald-950/30 to-slate-900">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
              <Sprout className="w-3.5 h-3.5" /> Registered Land Holding
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{farm.farmName}</h1>
            <p className="text-xs text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              {farm.location}
              {farm.district ? `, ${farm.district}` : ''}
              {farm.state ? `, ${farm.state}` : ''}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-right">
            <span className="text-xs text-slate-400 block">Total Plot Area</span>
            <span className="text-2xl font-black text-emerald-400">
              {farm.area} <span className="text-sm font-semibold">{farm.areaUnit}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Specifications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-amber-400">
            <Compass className="w-4 h-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Soil Profile</h4>
          </div>
          <p className="text-lg font-bold text-white mt-1">{farm.soilType || 'Not specified'}</p>
          <p className="text-[11px] text-slate-500">Soil composition classification</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-sky-400">
            <Droplets className="w-4 h-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Irrigation Setup</h4>
          </div>
          <p className="text-lg font-bold text-white mt-1">{farm.irrigationType || 'Not specified'}</p>
          <p className="text-[11px] text-slate-500">Water delivery infrastructure</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400">
            <Layers className="w-4 h-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Water Source</h4>
          </div>
          <p className="text-lg font-bold text-white mt-1">{farm.waterSource || 'Not specified'}</p>
          <p className="text-[11px] text-slate-500">Primary supply source</p>
        </div>
      </div>

      {/* Additional Details */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Globe className="w-4 h-4 text-emerald-400" /> Geographic & Owner Metadata
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400">Registered Owner</span>
            <p className="font-semibold text-white flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-400" />
              {farm.createdBy?.name || 'Logged-in Farmer'}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400">Created At</span>
            <p className="font-semibold text-white flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              {new Date(farm.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400">Latitude</span>
            <p className="font-semibold text-white">{farm.latitude !== null ? farm.latitude : 'N/A'}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400">Longitude</span>
            <p className="font-semibold text-white">{farm.longitude !== null ? farm.longitude : 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmDetailsPage;
