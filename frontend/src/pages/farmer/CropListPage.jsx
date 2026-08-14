import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
  Sprout,
  Plus,
  Search,
  Calendar,
  Layers,
  Edit,
  Trash2,
  Eye,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Filter,
} from 'lucide-react';

const CropListPage = () => {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchCrops = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/crops');
      if (res.data.success) {
        setCrops(res.data.crops);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load crop records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrops();
  }, []);

  const handleDelete = async (cropId, cropName) => {
    if (!window.confirm(`Are you sure you want to delete crop record "${cropName}"?`)) return;

    setDeleteLoading(cropId);
    try {
      const res = await api.delete(`/crops/${cropId}`);
      if (res.data.success) {
        setSuccessMessage(`Crop record "${cropName}" deleted successfully.`);
        setCrops(crops.filter((c) => c._id !== cropId));
        setTimeout(() => setSuccessMessage(''), 4000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete crop entry.');
    } finally {
      setDeleteLoading(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PLANNED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/20 text-slate-300 border border-slate-500/30">
            PLANNED
          </span>
        );
      case 'SOWN':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
            SOWN
          </span>
        );
      case 'GROWING':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            GROWING
          </span>
        );
      case 'READY_FOR_HARVEST':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            READY FOR HARVEST
          </span>
        );
      case 'HARVESTED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
            HARVESTED
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/20 text-slate-300">
            {status}
          </span>
        );
    }
  };

  const filteredCrops = crops.filter((crop) => {
    const matchesSearch =
      crop.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (crop.variety && crop.variety.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (crop.farmId?.farmName && crop.farmId.farmName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || crop.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-emerald-500/20 relative overflow-hidden bg-gradient-to-r from-slate-900 via-emerald-950/30 to-slate-900">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
              <Sprout className="w-3.5 h-3.5" /> Crop Management
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Cultivated Crops</h1>
            <p className="text-xs text-slate-300">
              Track crop lifecycles, sowing dates, expected harvest schedules, and land allocation
            </p>
          </div>

          <Link
            to="/farmer/crops/new"
            className="flex items-center gap-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" /> Add New Crop Entry
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

      {/* Filter & Search Bar */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search crop name, variety, or farm plot..."
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="PLANNED">Planned</option>
            <option value="SOWN">Sown</option>
            <option value="GROWING">Growing</option>
            <option value="READY_FOR_HARVEST">Ready for Harvest</option>
            <option value="HARVESTED">Harvested</option>
          </select>
        </div>
      </div>

      {/* Crop Grid */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          <p className="text-xs font-medium">Loading crop records...</p>
        </div>
      ) : filteredCrops.length === 0 ? (
        <div className="glass-card p-12 rounded-3xl border border-slate-800 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
            <Sprout className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No Crop Records Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchTerm || statusFilter !== 'ALL'
              ? 'No crop entries match your filter criteria.'
              : 'You have not registered any crop entries yet. Click below to add your first crop.'}
          </p>
          {statusFilter === 'ALL' && !searchTerm && (
            <Link
              to="/farmer/crops/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-slate-950 text-xs font-bold rounded-xl"
            >
              <Plus className="w-3.5 h-3.5" /> Register First Crop
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCrops.map((crop) => (
            <div
              key={crop._id}
              className="glass-card rounded-3xl border border-slate-800 overflow-hidden flex flex-col justify-between hover:border-emerald-500/30 transition-all group"
            >
              <div>
                <div className="relative h-40 bg-slate-900 overflow-hidden">
                  <img
                    src={crop.cropImage}
                    alt={crop.cropName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">{getStatusBadge(crop.status)}</div>
                  <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800 text-[11px] text-slate-300 flex items-center gap-1">
                    <Layers className="w-3 h-3 text-emerald-400" />
                    {crop.farmId?.farmName || 'Farm Plot'}
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {crop.cropName}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {crop.variety ? `Variety: ${crop.variety}` : `Season: ${crop.season}`}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-sky-400" /> Sown Date
                      </span>
                      <p className="font-semibold text-white">
                        {new Date(crop.sowingDate).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[10px] text-slate-500">Area</span>
                      <p className="font-semibold text-white">{crop.area} Acres</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-950/40 border-t border-slate-800 flex items-center justify-between gap-2">
                <Link
                  to={`/farmer/crops/${crop._id}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-emerald-400" /> Details
                </Link>

                <div className="flex items-center gap-1">
                  <Link
                    to={`/farmer/crops/${crop._id}/edit`}
                    className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors"
                    title="Edit Crop"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>

                  <button
                    onClick={() => handleDelete(crop._id, crop.cropName)}
                    disabled={deleteLoading === crop._id}
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50"
                    title="Delete Crop"
                  >
                    {deleteLoading === crop._id ? (
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

export default CropListPage;
