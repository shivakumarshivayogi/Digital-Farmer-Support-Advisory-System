import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import {
  Sprout,
  ArrowLeft,
  Calendar,
  Layers,
  MapPin,
  Compass,
  Droplets,
  Edit,
  Trash2,
  Loader2,
  AlertCircle,
  FileText,
  Clock,
} from 'lucide-react';

const CropDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [crop, setCrop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchCrop = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get(`/crops/${id}`);
        if (res.data.success) {
          setCrop(res.data.crop);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load crop entry details.');
      } finally {
        setLoading(false);
      }
    };

    fetchCrop();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete crop entry "${crop?.cropName}"?`)) return;

    setDeleting(true);
    try {
      const res = await api.delete(`/crops/${id}`);
      if (res.data.success) {
        navigate('/farmer/crops');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete crop entry.');
    } finally {
      setDeleting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PLANNED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-slate-500/20 text-slate-300 border border-slate-500/30">
            PLANNED
          </span>
        );
      case 'SOWN':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-sky-500/20 text-sky-300 border border-sky-500/30">
            SOWN
          </span>
        );
      case 'GROWING':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            GROWING
          </span>
        );
      case 'READY_FOR_HARVEST':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            READY FOR HARVEST
          </span>
        );
      case 'HARVESTED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/30">
            HARVESTED
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-slate-500/20 text-slate-300">
            {status}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400 flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        <p className="text-xs font-medium">Loading crop entry specifications...</p>
      </div>
    );
  }

  if (error || !crop) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center space-y-4">
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4" /> {error || 'Crop entry not found.'}
        </div>
        <Link
          to="/farmer/crops"
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-200 text-xs font-semibold rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Crops List
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/farmer/crops"
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Crops List
        </Link>

        <div className="flex items-center gap-2">
          <Link
            to={`/farmer/crops/${crop._id}/edit`}
            className="flex items-center gap-1.5 px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold rounded-xl transition-colors"
          >
            <Edit className="w-3.5 h-3.5" /> Edit Record
          </Link>

          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-1.5 px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold rounded-xl transition-colors disabled:opacity-50"
          >
            {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
            Delete Record
          </button>
        </div>
      </div>

      {/* Main Image Header */}
      <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden relative">
        <div className="h-64 sm:h-80 w-full relative bg-slate-950">
          <img
            src={crop.cropImage}
            alt={crop.cropName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

          <div className="absolute top-4 right-4">{getStatusBadge(crop.status)}</div>

          <div className="absolute bottom-6 left-6 right-6 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold backdrop-blur-md">
              <Layers className="w-3.5 h-3.5" /> Plot: {crop.farmId?.farmName || 'Registered Farm'}
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white">{crop.cropName}</h1>
            {crop.variety && (
              <p className="text-sm text-emerald-300 font-semibold">Variety: {crop.variety}</p>
            )}
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-sky-400" /> Sowing Date
          </span>
          <p className="text-lg font-bold text-white">
            {new Date(crop.sowingDate).toLocaleDateString()}
          </p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-400" /> Expected Harvest Date
          </span>
          <p className="text-lg font-bold text-white">
            {crop.expectedHarvestDate
              ? new Date(crop.expectedHarvestDate).toLocaleDateString()
              : 'Not specified'}
          </p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Sprout className="w-3.5 h-3.5 text-emerald-400" /> Cultivated Area
          </span>
          <p className="text-lg font-bold text-white">{crop.area} Acres</p>
        </div>
      </div>

      {/* Infrastructure Details */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Compass className="w-4 h-4 text-emerald-400" /> Season & Soil Specifications
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400">Cropping Season</span>
            <p className="font-semibold text-white">{crop.season}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400">Soil Classification</span>
            <p className="font-semibold text-white">{crop.soilType || 'N/A'}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400">Irrigation Method</span>
            <p className="font-semibold text-white">{crop.irrigationMethod || 'N/A'}</p>
          </div>
        </div>

        {crop.notes && (
          <div className="pt-4 border-t border-slate-800 space-y-1 text-xs">
            <span className="text-slate-400 font-bold flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-emerald-400" /> Notes & Cultivation Remarks
            </span>
            <p className="text-slate-300 leading-relaxed bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
              {crop.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CropDetailsPage;
