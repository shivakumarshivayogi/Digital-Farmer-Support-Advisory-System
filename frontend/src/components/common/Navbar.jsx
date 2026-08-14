import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
  Sprout,
  LogOut,
  User,
  Menu,
  X,
  Shield,
  Award,
  LayoutDashboard,
  Leaf,
  BookOpen,
  Compass,
  Bug,
  Droplets,
  CloudSun,
  TrendingUp,
  HelpCircle,
  MessageSquare,
  Send,
  Building2,
  Bell,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);

  const fetchUnreadCount = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await api.get('/notifications');
      if (res.data.success) {
        setUnreadNotifCount(res.data.unreadCount || 0);
      }
    } catch (err) {}
  };

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 15000); // Check every 15s
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            <Shield className="w-3 h-3" /> Admin
          </span>
        );
      case 'expert':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <Award className="w-3 h-3" /> Agri Expert
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <Sprout className="w-3 h-3" /> Farmer
          </span>
        );
    }
  };

  const getDashboardPath = () => {
    if (user?.role === 'admin') return '/admin/dashboard';
    if (user?.role === 'expert') return '/expert/dashboard';
    return '/farmer/dashboard';
  };

  return (
    <nav className="sticky top-0 z-50 glass-nav transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-900/30 group-hover:scale-105 transition-transform duration-200">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-white tracking-tight group-hover:text-emerald-400 transition-colors">
                AgriAdvisor
              </span>
              <span className="block text-[10px] font-medium text-emerald-400/80 -mt-1 tracking-wider uppercase">
                Digital Farmer Support
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-3">
            <Link to="/" className="text-xs font-medium text-slate-300 hover:text-emerald-400 transition-colors">
              Home
            </Link>

            <Link
              to="/schemes"
              className="flex items-center gap-1 text-xs font-medium text-slate-300 hover:text-sky-400 transition-colors"
            >
              <Building2 className="w-3.5 h-3.5 text-sky-400" />
              Govt Schemes
            </Link>

            <Link
              to="/experts"
              className="flex items-center gap-1 text-xs font-medium text-slate-300 hover:text-amber-400 transition-colors"
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              Experts
            </Link>

            <Link
              to="/questions"
              className="flex items-center gap-1 text-xs font-medium text-slate-300 hover:text-emerald-400 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
              Q&A
            </Link>

            <Link
              to="/weather"
              className="flex items-center gap-1 text-xs font-medium text-slate-300 hover:text-sky-400 transition-colors"
            >
              <CloudSun className="w-3.5 h-3.5 text-sky-400" />
              Weather
            </Link>

            <Link
              to="/market"
              className="flex items-center gap-1 text-xs font-medium text-slate-300 hover:text-emerald-400 transition-colors"
            >
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              Market
            </Link>

            <Link
              to="/advisory/crops"
              className="flex items-center gap-1 text-xs font-medium text-slate-300 hover:text-emerald-400 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              Advisory
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/chat"
                  className="flex items-center gap-1 text-xs font-medium text-slate-300 hover:text-emerald-400 transition-colors"
                >
                  <Send className="w-3.5 h-3.5 text-emerald-400" />
                  Chat
                </Link>

                <Link
                  to="/consultations"
                  className="flex items-center gap-1 text-xs font-medium text-slate-300 hover:text-amber-400 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                  Consultations
                </Link>

                {(user?.role === 'farmer' || user?.role === 'admin') && (
                  <Link
                    to="/farmer/farms"
                    className="flex items-center gap-1 text-xs font-medium text-slate-300 hover:text-emerald-400 transition-colors"
                  >
                    <Sprout className="w-3.5 h-3.5 text-emerald-400" />
                    Farms
                  </Link>
                )}

                <Link
                  to={getDashboardPath()}
                  className="flex items-center gap-1 text-xs font-medium text-slate-300 hover:text-emerald-400 transition-colors"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-emerald-400" />
                  Dashboard
                </Link>

                {/* Notification Bell */}
                <Link
                  to="/notifications"
                  className="relative p-1.5 text-slate-300 hover:text-amber-400 transition-colors"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadNotifCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-black text-[9px] flex items-center justify-center">
                      {unreadNotifCount}
                    </span>
                  )}
                </Link>

                <div className="flex items-center gap-2 pl-2 border-l border-slate-700/60">
                  <img
                    src={user?.profileImage || user?.avatar}
                    alt={user?.name}
                    className="w-7 h-7 rounded-full border border-emerald-500/40 object-cover"
                  />
                  <button
                    onClick={handleLogout}
                    className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-700/60">
                <Link
                  to="/login"
                  className="text-xs font-medium text-slate-300 hover:text-white px-2.5 py-1 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-xs font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-300 px-3 py-1.5 rounded-xl shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-card border-b border-slate-800 px-4 pt-2 pb-4 space-y-2 text-xs">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block font-medium text-slate-300 hover:text-emerald-400 py-1.5"
          >
            Home
          </Link>
          <Link
            to="/schemes"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 font-medium text-slate-300 hover:text-sky-400 py-1.5"
          >
            <Building2 className="w-4 h-4 text-sky-400" /> Govt Schemes
          </Link>
          <Link
            to="/notifications"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 font-medium text-slate-300 hover:text-amber-400 py-1.5"
          >
            <Bell className="w-4 h-4 text-amber-400" /> Notifications ({unreadNotifCount})
          </Link>
          <Link
            to="/experts"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 font-medium text-slate-300 hover:text-amber-400 py-1.5"
          >
            <Award className="w-4 h-4 text-amber-400" /> Find Experts
          </Link>
          <Link
            to="/questions"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 font-medium text-slate-300 hover:text-emerald-400 py-1.5"
          >
            <HelpCircle className="w-4 h-4 text-emerald-400" /> Q&A Forum
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/chat"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 font-medium text-emerald-400 py-1.5"
              >
                <Send className="w-4 h-4 text-emerald-400" /> Live Chat
              </Link>
              <Link
                to="/consultations"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 font-medium text-slate-300 hover:text-amber-400 py-1.5"
              >
                <MessageSquare className="w-4 h-4 text-amber-400" /> My Consultations
              </Link>
              <Link
                to={getDashboardPath()}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 font-medium text-emerald-400 py-1.5"
              >
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </Link>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src={user?.profileImage || user?.avatar} alt={user?.name} className="w-8 h-8 rounded-full border border-emerald-500/40 object-cover" />
                  <div>
                    <p className="text-sm font-medium text-white">{user?.name}</p>
                    {getRoleBadge(user?.role)}
                  </div>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-1 text-xs text-rose-400 bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-500/20"
                >
                  <LogOut className="w-3.5 h-3.5" /> Logout
                </button>
              </div>
            </>
          ) : (
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center text-sm font-medium text-slate-300 hover:text-white py-2 rounded-lg bg-slate-800/60"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center text-sm font-semibold text-slate-900 bg-emerald-400 py-2 rounded-lg"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
