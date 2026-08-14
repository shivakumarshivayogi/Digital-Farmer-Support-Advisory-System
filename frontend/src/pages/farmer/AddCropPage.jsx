import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import {
  Sprout,
  ArrowLeft,
  Save,
  Loader2,
  AlertCircle,
  Calendar,
  Layers,
  Upload,
  Image as ImageIcon,
} from 'lucide-react';

const AddCropPage = () => {
  const navigate = useNavigate();

  const [farms, setFarms] = useState([]);
  const [loadingFarms, setLoadingFarms] = useState(true);

  const [formData, setFormData] = useState({
    cropName: '',
    variety: '',
    farmId: '',
    sowingDate: new Date().toISOString().split('T')[0],
    expectedHarvestDate: '',
    area: '',
    season: 'Kharif',
    soilType: '',
    irrigationMethod: '',
    status: 'SOWN',
    notes: '',
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const res = await api.get('/farms');
        if (res.data.success) {
          setFarms(res.data.farms);
          if (res.data.farms.length > 0) {
            setFormData((prev) => ({ ...prev, farmId: res.data.farms[0]._id }));
          }
        }
      } catch (err) {
        setError('Failed to load your registered farm plots.');
      } finally {
        setLoadingFarms(false);
      }
    };

    fetchFarms();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.mimetype || file.type)) {
      setError('Invalid file format. Please upload a JPEG, PNG, WEBP, or GIF image.');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB. Please choose a smaller image file.');
      return;
    }

    setError('');
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.cropName || !formData.farmId || !formData.sowingDate || !formData.area) {
      setError('Please fill in all required fields (Crop Name, Farm Plot, Sowing Date, Area).');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== '') {
          data.append(key, formData[key]);
        }
      });

      if (selectedFile) {
        data.append('cropImage', selectedFile);
      }

      const res = await api.post('/crops', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.success) {
        navigate('/farmer/crops');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register crop entry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          to="/farmer/crops"
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Add New Crop Record</h1>
          <p className="text-xs text-slate-400">Register crop details, sowing schedule, and cultivation plot</p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loadingFarms ? (
        <div className="py-12 text-center text-slate-400 flex items-center justify-center gap-2 text-xs">
          <Loader2 className="w-4 h-4 animate-spin text-emerald-500" /> Loading farm plots...
        </div>
      ) : farms.length === 0 ? (
        <div className="glass-card p-8 rounded-3xl border border-slate-800 text-center space-y-4">
          <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
          <h3 className="text-sm font-bold text-white">No Farm Plots Registered</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You need at least one registered farm plot before registering crops.
          </p>
          <Link
            to="/farmer/farms/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs"
          >
            Register Farm Plot First
          </Link>
        </div>
      ) : (
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* General Specs */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Sprout className="w-4 h-4" /> Crop Identification
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Select Farm Plot *</label>
                  <select
                    name="farmId"
                    value={formData.farmId}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-emerald-500 focus:outline-none"
                    required
                  >
                    {farms.map((f) => (
                      <option key={f._id} value={f._id}>
                        {f.farmName} ({f.area} {f.areaUnit} - {f.location})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Crop Name *</label>
                  <input
                    type="text"
                    name="cropName"
                    value={formData.cropName}
                    onChange={handleChange}
                    placeholder="e.g. Wheat / Paddy / Cotton"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Variety / Hybrid</label>
                  <input
                    type="text"
                    name="variety"
                    value={formData.variety}
                    onChange={handleChange}
                    placeholder="e.g. HD-2967 / Pusa Basmati"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Cultivated Area (Acres) *</label>
                  <input
                    type="number"
                    step="0.01"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    placeholder="e.g. 5.0"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Dates & Status */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Calendar className="w-4 h-4" /> Schedule & Lifecycle Status
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Sowing Date *</label>
                  <input
                    type="date"
                    name="sowingDate"
                    value={formData.sowingDate}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Expected Harvest Date</label>
                  <input
                    type="date"
                    name="expectedHarvestDate"
                    value={formData.expectedHarvestDate}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Current Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="PLANNED">PLANNED</option>
                    <option value="SOWN">SOWN</option>
                    <option value="GROWING">GROWING</option>
                    <option value="READY_FOR_HARVEST">READY FOR HARVEST</option>
                    <option value="HARVESTED">HARVESTED</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Season</label>
                  <select
                    name="season"
                    value={formData.season}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Kharif">Kharif (Monsoon)</option>
                    <option value="Rabi">Rabi (Winter)</option>
                    <option value="Zaid">Zaid (Summer)</option>
                    <option value="Whole Year">Whole Year</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Soil Type</label>
                  <input
                    type="text"
                    name="soilType"
                    value={formData.soilType}
                    onChange={handleChange}
                    placeholder="Alluvial / Loam"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Irrigation Method</label>
                  <input
                    type="text"
                    name="irrigationMethod"
                    value={formData.irrigationMethod}
                    onChange={handleChange}
                    placeholder="Borewell / Drip"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Crop Image Upload */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Upload className="w-4 h-4" /> Crop Photo (Max 5MB - JPEG/PNG/WEBP)
              </label>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-24 h-24 rounded-2xl object-cover border-2 border-emerald-500/40 shrink-0"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-2xl bg-slate-900 border border-dashed border-slate-700 flex flex-col items-center justify-center text-slate-500 shrink-0">
                    <ImageIcon className="w-6 h-6" />
                    <span className="text-[10px] mt-1">No Image</span>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleFileChange}
                  className="block w-full text-xs text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700 cursor-pointer"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="pt-4 border-t border-slate-800">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Notes / Remarks</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                placeholder="Optional notes regarding fertilizer treatment, seed variety specs, etc."
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
              ></textarea>
            </div>

            <div className="flex items-center gap-3 pt-6 border-t border-slate-800">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Crop Record
              </button>
              <Link
                to="/farmer/crops"
                className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddCropPage;
