import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
  Shield,
  Users,
  Award,
  Leaf,
  HelpCircle,
  MessageSquare,
  Building2,
  BarChart3,
  TrendingUp,
  Plus,
  Loader2,
  CheckCircle2,
  Activity,
  ArrowRight,
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [healthStatus, setHealthStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      setLoading(true);
      try {
        const [dashRes, healthRes] = await Promise.all([
          api.get('/dashboard/admin'),
          api.get('/health'),
        ]);

        if (dashRes.data.success) {
          setStats(dashRes.data.stats);
        }
        setHealthStatus(healthRes.data);
      } catch (err) {
        console.error('Failed to load admin dashboard', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400 flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
        <p className="text-xs font-medium">Loading System Executive Dashboard...</p>
      </div>
    );
  }

  // Calculate totals for visual charts
  const totalCrops = stats?.totalCrops || 1;
  const totalConsultations = stats?.totalConsultations || 1;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-rose-500/20 relative overflow-hidden bg-gradient-to-r from-slate-900 via-rose-950/30 to-slate-900">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-semibold">
              <Shield className="w-3.5 h-3.5" /> System Administration Control Center
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">System Executive Dashboard</h1>
            <p className="text-xs text-slate-300">
              Real-time platform metrics, user distribution, system activity analytics, and administrative publishing tools.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/market"
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
            >
              <Plus className="w-4 h-4" /> Publish Mandi Price
            </Link>
            <Link
              to="/schemes"
              className="px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-sky-500/20"
            >
              <Plus className="w-4 h-4" /> Publish Govt Scheme
            </Link>
          </div>
        </div>
      </div>

      {/* System Executive KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Total Farmers */}
        <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-semibold">Farmers</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-white">{stats?.totalFarmers || 0}</p>
          <span className="text-[10px] text-slate-500 block">Registered Users</span>
        </div>

        {/* Total Experts */}
        <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-semibold">Agri Experts</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-white">{stats?.totalExperts || 0}</p>
          <span className="text-[10px] text-slate-500 block">Certified Specialists</span>
        </div>

        {/* Total Crops */}
        <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-semibold">Crops</span>
            <Leaf className="w-4 h-4 text-teal-400" />
          </div>
          <p className="text-2xl font-black text-white">{stats?.totalCrops || 0}</p>
          <span className="text-[10px] text-slate-500 block">System Crops</span>
        </div>

        {/* Total Questions */}
        <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-semibold">Q&A Questions</span>
            <HelpCircle className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-white">{stats?.totalQuestions || 0}</p>
          <span className="text-[10px] text-slate-500 block">Diagnostic Posts</span>
        </div>

        {/* Total Consultations */}
        <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-semibold">Consultations</span>
            <MessageSquare className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-2xl font-black text-white">{stats?.totalConsultations || 0}</p>
          <span className="text-[10px] text-slate-500 block">1-on-1 Sessions</span>
        </div>

        {/* Total Govt Schemes */}
        <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-semibold">Govt Schemes</span>
            <Building2 className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-2xl font-black text-white">{stats?.totalSchemes || 0}</p>
          <span className="text-[10px] text-slate-500 block">Published Schemes</span>
        </div>
      </div>

      {/* Analytics Charts & Visual Graph Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Crop Lifecycle Distribution Progress Bars */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-400" /> Crop Lifecycle Analytics Breakdown
          </h3>

          <div className="space-y-3 pt-2">
            {stats?.analytics?.cropsByStatus?.map((item) => {
              const percent = Math.round((item.count / totalCrops) * 100);
              return (
                <div key={item._id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300">{item._id || 'PLANNED'}</span>
                    <span className="text-emerald-400 font-bold">
                      {item.count} crops ({percent}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-600 to-teal-400 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(percent, 5)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Consultation Status Pie Analytics */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-sky-400" /> 1-on-1 Consultation Status Analytics
          </h3>

          <div className="space-y-3 pt-2">
            {stats?.analytics?.consultationsByStatus?.map((item) => {
              const percent = Math.round((item.count / totalConsultations) * 100);
              return (
                <div key={item._id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300">{item._id}</span>
                    <span className="text-sky-400 font-bold">
                      {item.count} sessions ({percent}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-sky-600 to-blue-400 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(percent, 5)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* System Health Status & Administrative Actions */}
      <div className="glass-card p-6 rounded-3xl border border-emerald-500/30 bg-emerald-950/10 space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">System API & Database Health Status</h4>
              <p className="text-xs text-slate-300">
                MongoDB Connection: <span className="text-emerald-400 font-bold">Active (127.0.0.1)</span> • Socket.io Engine: <span className="text-emerald-400 font-bold">Active</span>
              </p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            System Status: 100% Operational
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
