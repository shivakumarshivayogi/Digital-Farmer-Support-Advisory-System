import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import {
  Sprout,
  ArrowLeft,
  Save,
  Loader2,
  AlertCircle,
  Calendar,
  Upload,
  Image as ImageIcon,
} from 'lucide-react';

const EditCropPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [farms, setFarms] = useState([]);
  const [formData, setFormData] = useState({
    cropName: '',
    variety: '',
    farmId: '',
    sowingDate: '',
    expectedHarvestDate: '',
    area: '',
    season: 'Kharif',
    soilType: '',
    irrigationMethod: '',
    status: 'SOWN',
    cropImage: '',
    notes: '',
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const [farmsRes, cropRes] = await Promise.all([
          api.get('/farms'),
          api.get(`/crops/${id}`),
        ]);

        if (farmsRes.data.success) {
          setFarms(farmsRes.data.farms);
        }

        if (cropRes.data.success) {
          const c = cropRes.data.crop;
          setFormData({
            cropName: c.cropName || '',
            variety: c.variety || '',
            farmId: c.farmId?._id || c.farmId || '',
            sowingDate: c.sowingDate ? new Date(c.sowingDate).toISOString().split('T')[0] : '',
            expectedHarvestDate: c.expectedHarvestDate
              ? new Date(c.expectedHarvestDate).toISOString().split('T')[0]
              : '',
            area: c.area || '',
            season: c.season || 'Kharif',
            soilType: c.soilType || '',
            irrigationMethod: c.irrigationMethod || '',
            status: c.status || 'SOWN',
            cropImage: c.cropImage || '',
            notes: c.notes || '',
          });
          setPreviewUrl(c.cropImage || '');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch crop details.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.mimetype || file.type)) {
      setError('Invalid file format. Please upload JPEG, PNG, WEBP, or GIF.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB limit.');
      return;
    }

    setError('');
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.cropName || !formData.farmId || !formData.sowingDate || !formData.area) {
      setError('Please fill in required fields (Crop Name, Farm Plot, Sowing Date, Area).');
      return;
    }

    setSaving(true);
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

      const res = await api.put(`/crops/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.success) {
        navigate('/farmer/crops');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update crop entry.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400 flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        <p className="text-xs font-medium">Loading crop details...</p>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold text-white">Edit Crop Record</h1>
          <p className="text-xs text-slate-400">Update status, harvest schedule, and photo for "{formData.cropName}"</p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Sprout className="w-4 h-4" /> Crop Specifications
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Farm Plot *</label>
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

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Crop Name *</label>
                <input
                  type="text"
                  name="cropName"
                  value={formData.cropName}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Variety</label>
                <input
                  type="text"
                  name="variety"
                  value={formData.variety}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-amber-500 focus:outline-none"
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
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
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
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-amber-500 focus:outline-none"
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
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Current Lifecycle Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-amber-500 focus:outline-none"
                >
                  <option value="PLANNED">PLANNED</option>
                  <option value="SOWN">SOWN</option>
                  <option value="GROWING">GROWING</option>
                  <option value="READY_FOR_HARVEST">READY FOR HARVEST</option>
                  <option value="HARVESTED">HARVESTED</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-800">
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Upload className="w-4 h-4" /> Replace Photo (Max 5MB)
            </label>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Crop preview"
                  className="w-24 h-24 rounded-2xl object-cover border-2 border-amber-500/40 shrink-0"
                />
              )}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileChange}
                className="block w-full text-xs text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700 cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <label className="block text-xs font-semibold text-slate-300 mb-1">Notes / Remarks</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-amber-500 focus:outline-none"
            ></textarea>
          </div>

          <div className="flex items-center gap-3 pt-6 border-t border-slate-800">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
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
    </div>
  );
};

export default EditCropPage;
