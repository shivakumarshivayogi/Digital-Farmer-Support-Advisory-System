import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
  Sprout,
  Leaf,
  CloudSun,
  TrendingUp,
  Bug,
  HelpCircle,
  Bell,
  Compass,
  Plus,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

const FarmerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [dashRes, weatherRes] = await Promise.all([
          api.get('/dashboard/farmer'),
          api.get(`/weather?location=${encodeURIComponent(user?.district || 'Ludhiana')}`),
        ]);

        if (dashRes.data.success) {
          setStats(dashRes.data.stats);
        }
        if (weatherRes.data.success) {
          setWeather(weatherRes.data.weather);
        }
      } catch (err) {
        console.error('Failed to load farmer dashboard statistics', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.district]);

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400 flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        <p className="text-xs font-medium">Loading Farmer Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Welcome Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-emerald-500/20 relative overflow-hidden bg-gradient-to-r from-slate-900 via-emerald-950/30 to-slate-900">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
              <Sprout className="w-3.5 h-3.5" /> Welcome Back, {user?.name}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Farmer Executive Dashboard</h1>
            <p className="text-xs text-slate-300">
              Overview of your registered farms, active crop lifecycles, live weather forecast, and Mandi commodity rates.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/farmer/farms/new"
              className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all"
            >
              <Plus className="w-4 h-4" /> Add Farm Plot
            </Link>
            <Link
              to="/farmer/crops/new"
              className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700"
            >
              <Plus className="w-4 h-4 text-emerald-400" /> Add Crop
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Farms */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">Total Farm Plots</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Sprout className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-white">{stats?.totalFarms || 0}</p>
          <Link to="/farmer/farms" className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 hover:underline">
            Manage Farms <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Total Crops */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">Total Crops</span>
            <div className="p-2 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
              <Leaf className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-white">{stats?.totalCrops || 0}</p>
          <Link to="/farmer/crops" className="text-[11px] text-teal-400 font-semibold flex items-center gap-1 hover:underline">
            View All Crops <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Active Crops */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">Active Growing Crops</span>
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-white">{stats?.activeCrops || 0}</p>
          <span className="text-[10px] text-slate-500">Sown, Growing & Ready for Harvest</span>
        </div>

        {/* Live Weather Widget */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2 bg-gradient-to-br from-slate-900 to-sky-950/20">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">{weather?.location || 'Weather'}</span>
            <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
              <CloudSun className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-3xl font-black text-sky-400">{weather?.temperature || 28}°C</p>
            <span className="text-xs font-bold text-white">{weather?.weatherCondition || 'Partly Cloudy'}</span>
          </div>
          <Link to="/weather" className="text-[11px] text-sky-400 font-semibold flex items-center gap-1 hover:underline">
            5-Day Forecast <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Main Grid: Left (Disease Alerts & Market Rates), Right (Questions & Quick Actions) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Disease Alerts Snippet */}
          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Bug className="w-4 h-4 text-rose-400" /> Recent Disease & Pest Alerts
              </h3>
              <Link to="/advisory/diseases" className="text-xs font-semibold text-rose-400 hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {stats?.diseaseAlerts?.map((d) => (
                <div key={d._id} className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-rose-500/10 text-rose-300 border border-rose-500/20">
                    {d.crop}
                  </span>
                  <h4 className="text-xs font-bold text-white truncate">{d.name}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{d.symptoms}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Mandi Commodity Market Rates */}
          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" /> Live Mandi Commodity Rates
              </h3>
              <Link to="/market" className="text-xs font-semibold text-emerald-400 hover:underline flex items-center gap-1">
                Full Mandi Prices <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {stats?.marketPrices?.map((m) => (
                <div key={m._id} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">{m.crop}</h4>
                    <span className="text-[10px] text-slate-500">{m.market}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-emerald-400">₹{m.averagePrice}</span>
                    <span className="text-[9px] text-slate-500 block">per Quintal</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 span) */}
        <div className="space-y-6">
          {/* Quick Action Shortcuts */}
          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white">Farmer Action Center</h3>

            <div className="space-y-2 text-xs">
              <Link
                to="/questions/new"
                className="w-full p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center gap-3 text-slate-200 transition-colors"
              >
                <HelpCircle className="w-4 h-4 text-emerald-400" /> Ask Crop Diagnostic Question
              </Link>

              <Link
                to="/experts"
                className="w-full p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center gap-3 text-slate-200 transition-colors"
              >
                <Sprout className="w-4 h-4 text-amber-400" /> Book 1-on-1 Expert Advice
              </Link>

              <Link
                to="/farmer/soil-records"
                className="w-full p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center gap-3 text-slate-200 transition-colors"
              >
                <Compass className="w-4 h-4 text-sky-400" /> Log Soil Health Test Result
              </Link>

              <Link
                to="/schemes"
                className="w-full p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center gap-3 text-slate-200 transition-colors"
              >
                <Leaf className="w-4 h-4 text-emerald-400" /> Browse Govt Subsidies & Schemes
              </Link>
            </div>
          </div>

          {/* Recent Q&A Questions */}
          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-emerald-400" /> My Questions
              </h3>
              <Link to="/questions" className="text-[11px] font-semibold text-emerald-400 hover:underline">
                View All
              </Link>
            </div>

            {stats?.recentQuestions?.length === 0 ? (
              <p className="text-xs text-slate-400 py-2">No questions asked yet.</p>
            ) : (
              <div className="space-y-2">
                {stats?.recentQuestions?.map((q) => (
                  <Link
                    key={q._id}
                    to={`/questions/${q._id}`}
                    className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 block text-xs space-y-1 hover:border-emerald-500/30"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-emerald-400 font-bold">{q.crop}</span>
                      <span className="text-[9px] text-slate-500">{q.status}</span>
                    </div>
                    <p className="font-semibold text-white truncate">{q.title}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
