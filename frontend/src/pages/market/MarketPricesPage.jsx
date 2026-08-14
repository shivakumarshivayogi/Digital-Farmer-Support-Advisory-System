import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
  TrendingUp,
  Search,
  Filter,
  Plus,
  Trash2,
  Edit,
  Loader2,
  AlertCircle,
  CheckCircle2,
  DollarSign,
  BarChart3,
  MapPin,
  Calendar,
} from 'lucide-react';

const MarketPricesPage = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('');
  const [sortOption, setSortOption] = useState('date_desc');

  // Admin Modal State
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    crop: 'Wheat',
    market: '',
    location: '',
    minimumPrice: '',
    maximumPrice: '',
    averagePrice: '',
    date: new Date().toISOString().split('T')[0],
  });

  const fetchPrices = async () => {
    setLoading(true);
    setError('');
    try {
      let query = `/market?search=${encodeURIComponent(searchTerm)}&sort=${sortOption}`;
      if (selectedCrop) query += `&crop=${encodeURIComponent(selectedCrop)}`;

      const res = await api.get(query);
      if (res.data.success) {
        setPrices(res.data.prices);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch Mandi market prices.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, [searchTerm, selectedCrop, sortOption]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (modalError) setModalError('');
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    if (!formData.crop || !formData.market || !formData.location || !formData.averagePrice) {
      setModalError('Please fill in all required price fields.');
      return;
    }

    setSubmitting(true);
    setModalError('');

    try {
      const res = await api.post('/market', formData);
      if (res.data.success) {
        setSuccess('Market commodity rate published successfully!');
        setShowAdminModal(false);
        setFormData({
          crop: 'Wheat',
          market: '',
          location: '',
          minimumPrice: '',
          maximumPrice: '',
          averagePrice: '',
          date: new Date().toISOString().split('T')[0],
        });
        fetchPrices();
        setTimeout(() => setSuccess(''), 4000);
      }
    } catch (err) {
      setModalError(err.response?.data?.message || 'Failed to publish market price.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this Mandi market rate entry?')) return;
    try {
      const res = await api.delete(`/market/${id}`);
      if (res.data.success) {
        setPrices(prices.filter((p) => p._id !== id));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete entry.');
    }
  };

  // Find overall maximum price for scaling visual comparison bars
  const highestPriceInList = Math.max(...prices.map((p) => p.maximumPrice || 1), 10000);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-emerald-500/20 relative overflow-hidden bg-gradient-to-r from-slate-900 via-emerald-950/30 to-slate-900">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
              <TrendingUp className="w-3.5 h-3.5" /> Mandi Commodity Rates & Analytics
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Agricultural Market Prices</h1>
            <p className="text-xs text-slate-300">
              Live Mandi price trends, minimum, maximum, and average rates per quintal across major regional markets.
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={() => setShowAdminModal(true)}
              className="flex items-center gap-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
            >
              <Plus className="w-4 h-4" /> Add Mandi Price (Admin)
            </button>
          )}
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

      {/* Admin Publish Price Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 max-w-xl w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" /> Publish Mandi Commodity Rate
              </h3>
              <button
                onClick={() => setShowAdminModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 bg-slate-800 rounded-lg"
              >
                Close
              </button>
            </div>

            {modalError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> {modalError}
              </div>
            )}

            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Crop Name *</label>
                  <input
                    type="text"
                    name="crop"
                    value={formData.crop}
                    onChange={handleChange}
                    placeholder="e.g. Wheat / Paddy"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Mandi / Market Name *</label>
                  <input
                    type="text"
                    name="market"
                    value={formData.market}
                    onChange={handleChange}
                    placeholder="e.g. Ludhiana Grain Mandi"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-emerald-500"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Location / District *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Ludhiana, Punjab"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Min Price (₹/quintal) *</label>
                  <input
                    type="number"
                    name="minimumPrice"
                    value={formData.minimumPrice}
                    onChange={handleChange}
                    placeholder="2200"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Max Price (₹/quintal) *</label>
                  <input
                    type="number"
                    name="maximumPrice"
                    value={formData.maximumPrice}
                    onChange={handleChange}
                    placeholder="2450"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-emerald-500"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Average Model Price (₹/quintal) *</label>
                  <input
                    type="number"
                    name="averagePrice"
                    value={formData.averagePrice}
                    onChange={handleChange}
                    placeholder="2380"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-800">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Publish Rate'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAdminModal(false)}
                  className="px-4 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filter & Sorting Controls */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search crop name, Mandi market, or city..."
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="">All Commodities</option>
            <option value="Wheat">Wheat</option>
            <option value="Paddy">Paddy Rice</option>
            <option value="Cotton">Cotton</option>
            <option value="Tomato">Tomato</option>
            <option value="Sugarcane">Sugarcane</option>
            <option value="Potato">Potato</option>
          </select>

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="date_desc">Newest Date</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="crop_asc">Crop: Alphabetical</option>
          </select>
        </div>
      </div>

      {/* Mandi Price Comparison List with Visual Chart Bars */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          <p className="text-xs font-medium">Fetching Mandi market prices...</p>
        </div>
      ) : prices.length === 0 ? (
        <div className="glass-card p-12 rounded-3xl border border-slate-800 text-center space-y-3">
          <TrendingUp className="w-8 h-8 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No Market Rates Found</h3>
          <p className="text-xs text-slate-400">Try searching for Wheat, Paddy Rice, Cotton, or Tomato.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 px-2">
            <span>Showing Market Commodity Rates</span>
            <span>Unit: ₹ per Quintal (100 kg)</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {prices.map((p) => {
              const avgPercent = Math.min(Math.round((p.averagePrice / highestPriceInList) * 100), 100);

              return (
                <div
                  key={p._id}
                  className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4 hover:border-emerald-500/30 transition-all"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-white">{p.crop}</h3>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          ₹{p.averagePrice.toLocaleString('en-IN')} / Quintal
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        {p.market} • {p.location}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 block">Min - Max Range</span>
                        <span className="font-bold text-slate-200">
                          ₹{p.minimumPrice} - ₹{p.maximumPrice}
                        </span>
                      </div>

                      {isAdmin && (
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="p-2 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                          title="Delete entry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Interactive Visual Price Bar */}
                  <div className="space-y-1 pt-2 border-t border-slate-800/80">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Price Range Indicator</span>
                      <span className="font-semibold text-emerald-400">Model Avg: ₹{p.averagePrice}</span>
                    </div>
                    <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden flex items-center border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-600 via-teal-400 to-emerald-300 rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(avgPercent, 10)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketPricesPage;
