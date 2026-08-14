import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
  Building2,
  Search,
  Filter,
  ExternalLink,
  Plus,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle2,
  FileText,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const SchemeListPage = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  // Admin Publish Modal State
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    schemeName: '',
    description: '',
    eligibility: '',
    benefits: '',
    documentsRequired: '',
    applicationProcess: '',
    officialUrl: '',
    state: 'All-India / National',
    status: 'ACTIVE',
  });

  const fetchSchemes = async () => {
    setLoading(true);
    setError('');
    try {
      let query = `/schemes?search=${encodeURIComponent(searchTerm)}`;
      if (stateFilter) query += `&state=${encodeURIComponent(stateFilter)}`;

      const res = await api.get(query);
      if (res.data.success) {
        setSchemes(res.data.schemes);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch government schemes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, [searchTerm, stateFilter]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (modalError) setModalError('');
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    if (!formData.schemeName || !formData.description || !formData.eligibility || !formData.benefits) {
      setModalError('Please fill in scheme name, description, eligibility, and benefits.');
      return;
    }

    setSubmitting(true);
    setModalError('');

    try {
      const res = await api.post('/schemes', formData);
      if (res.data.success) {
        setSuccess('Government scheme published & notified to farmers!');
        setShowAdminModal(false);
        setFormData({
          schemeName: '',
          description: '',
          eligibility: '',
          benefits: '',
          documentsRequired: '',
          applicationProcess: '',
          officialUrl: '',
          state: 'All-India / National',
          status: 'ACTIVE',
        });
        fetchSchemes();
        setTimeout(() => setSuccess(''), 4000);
      }
    } catch (err) {
      setModalError(err.response?.data?.message || 'Failed to publish scheme.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this government scheme record?')) return;
    try {
      const res = await api.delete(`/schemes/${id}`);
      if (res.data.success) {
        setSchemes(schemes.filter((s) => s._id !== id));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete scheme.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-sky-500/20 relative overflow-hidden bg-gradient-to-r from-slate-900 via-sky-950/30 to-slate-900">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs font-semibold">
              <Building2 className="w-3.5 h-3.5" /> Official Agricultural Welfare Schemes
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Government Schemes & Subsidies</h1>
            <p className="text-xs text-slate-300">
              Discover official Central & State agricultural subsidy programs, crop insurance, financial assistance, and direct application links.
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={() => setShowAdminModal(true)}
              className="flex items-center gap-2 px-5 py-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-sky-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
            >
              <Plus className="w-4 h-4" /> Add Government Scheme (Admin)
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

      {/* Admin Publish Scheme Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 max-w-2xl w-full space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-sky-400" /> Add Official Government Scheme
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
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Scheme Name *</label>
                <input
                  type="text"
                  name="schemeName"
                  value={formData.schemeName}
                  onChange={handleChange}
                  placeholder="e.g. Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)"
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-sky-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Short Description *</label>
                <textarea
                  rows={2}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Provide scheme overview..."
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-sky-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Eligibility Criteria *</label>
                  <textarea
                    rows={3}
                    name="eligibility"
                    value={formData.eligibility}
                    onChange={handleChange}
                    placeholder="Who is eligible..."
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-sky-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Financial & Yield Benefits *</label>
                  <textarea
                    rows={3}
                    name="benefits"
                    value={formData.benefits}
                    onChange={handleChange}
                    placeholder="Subsidy details..."
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-sky-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Official Government Portal URL</label>
                <input
                  type="url"
                  name="officialUrl"
                  value={formData.officialUrl}
                  onChange={handleChange}
                  placeholder="https://pmkisan.gov.in"
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-sky-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-800">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Publish Scheme'}
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

      {/* Filter & Search Bar */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search scheme by name, benefits, or eligibility..."
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
          >
            <option value="">All States & National</option>
            <option value="National">National Schemes</option>
            <option value="Punjab">Punjab</option>
            <option value="Haryana">Haryana</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
            <option value="Maharashtra">Maharashtra</option>
          </select>
        </div>
      </div>

      {/* Schemes Grid */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
          <p className="text-xs font-medium">Fetching official government schemes...</p>
        </div>
      ) : schemes.length === 0 ? (
        <div className="glass-card p-12 rounded-3xl border border-slate-800 text-center space-y-3">
          <Building2 className="w-8 h-8 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No Government Schemes Found</h3>
          <p className="text-xs text-slate-400">Try clearing state filters or searching for PM-KISAN, PMFBY, or KCC.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {schemes.map((s) => {
            const isExpanded = expandedId === s._id;

            return (
              <div
                key={s._id}
                className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4 hover:border-sky-500/30 transition-all"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-white">{s.schemeName}</h3>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                        {s.state}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{s.description}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={s.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
                    >
                      Official Portal <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(s._id)}
                        className="p-2 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800"
                        title="Delete scheme"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-emerald-400 block">Eligibility Criteria</span>
                    <p className="text-slate-300 leading-relaxed">{s.eligibility}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-amber-400 block">Financial & Subsidy Benefits</span>
                    <p className="text-slate-300 leading-relaxed">{s.benefits}</p>
                  </div>
                </div>

                <button
                  onClick={() => setExpandedId(isExpanded ? null : s._id)}
                  className="w-full py-2 bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  {isExpanded ? (
                    <>
                      Hide Required Documents & Process <ChevronUp className="w-4 h-4 text-sky-400" />
                    </>
                  ) : (
                    <>
                      View Required Documents & Application Process <ChevronDown className="w-4 h-4 text-sky-400" />
                    </>
                  )}
                </button>

                {isExpanded && (
                  <div className="pt-2 border-t border-slate-800 space-y-3 text-xs text-slate-300">
                    <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-1">
                      <span className="text-[11px] font-bold text-sky-400 flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5" /> Documents Required for Application
                      </span>
                      <p className="leading-relaxed">{s.documentsRequired}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-1">
                      <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> How to Apply
                      </span>
                      <p className="leading-relaxed">{s.applicationProcess}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SchemeListPage;
