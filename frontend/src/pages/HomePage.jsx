import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  CloudSun,
  TrendingUp,
  Award,
  BookOpen,
  MessageSquare,
  ShieldCheck,
  ArrowRight,
  Leaf,
  Users,
  CheckCircle2,
} from 'lucide-react';

const HomePage = () => {
  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 lg:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="absolute inset-0 -z-10 flex items-center justify-center">
          <div className="w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="w-[300px] h-[300px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none -translate-y-20"></div>
        </div>

        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wide">
            <Sprout className="w-4 h-4 animate-bounce" />
            <span>Next-Generation Agricultural Advisory Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Smart Farming Advisory & <span className="gradient-text">Expert Support</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Connecting farmers directly with agricultural experts, real-time crop disease diagnosis, weather analytics, market prices, and tailored government schemes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl glass-card hover:bg-slate-800 text-slate-200 font-semibold text-sm flex items-center justify-center gap-2 border border-slate-700/60 transition-all"
            >
              Sign In to Portal
            </Link>
          </div>
        </div>
      </section>

      {/* Roles Feature Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Tailored Portals for Every Stakeholder
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Designed specifically for Farmers, Agricultural Experts, and System Administrators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Farmer Role */}
          <div className="glass-card p-6 rounded-2xl border border-emerald-500/20 relative overflow-hidden group hover:border-emerald-500/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Sprout className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Farmers</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Manage your farm profiles, receive crop advisories, ask questions to experts, track weather, and view current market rates.
            </p>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Soil & Crop Health Analysis</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Instant Pest & Disease Advisory</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Live Market & Weather Insights</li>
            </ul>
          </div>

          {/* Expert Role */}
          <div className="glass-card p-6 rounded-2xl border border-amber-500/20 relative overflow-hidden group hover:border-amber-500/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Agri Experts</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Review farmer queries, provide certified agricultural guidance, diagnose plant diseases, and publish advisories.
            </p>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> Direct Farmer Q&A Consultation</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> Specialized Disease Diagnostics</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> Verified Credentials Badge</li>
            </ul>
          </div>

          {/* Admin Role */}
          <div className="glass-card p-6 rounded-2xl border border-rose-500/20 relative overflow-hidden group hover:border-rose-500/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Administrators</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Manage platform users, verify agricultural experts, publish government schemes, and monitor overall system metrics.
            </p>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-rose-400" /> User & Role Management</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-rose-400" /> Expert Approval System</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-rose-400" /> Platform Analytics Dashboard</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-3xl p-8 lg:p-12 border border-slate-800">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Complete Agricultural Support Ecosystem</h2>
            <p className="text-xs text-slate-400 mt-2">All essential farming tools integrated into one single platform.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <CloudSun className="w-6 h-6 text-sky-400" />
              <h4 className="text-sm font-semibold text-white">Weather Forecast</h4>
              <p className="text-xs text-slate-400">Localized weather forecasts with precipitation and temperature alerts.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
              <h4 className="text-sm font-semibold text-white">Market Rates</h4>
              <p className="text-xs text-slate-400">Real-time Mandi price trends and market demand updates.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <Leaf className="w-6 h-6 text-emerald-400" />
              <h4 className="text-sm font-semibold text-white">Crop & Soil Health</h4>
              <p className="text-xs text-slate-400">NPK fertilizer calculator and crop rotation recommendations.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <BookOpen className="w-6 h-6 text-amber-400" />
              <h4 className="text-sm font-semibold text-white">Government Schemes</h4>
              <p className="text-xs text-slate-400">Latest subsidies, grants, and agricultural welfare updates.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
