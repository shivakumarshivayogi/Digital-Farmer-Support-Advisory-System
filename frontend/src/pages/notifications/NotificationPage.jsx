import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
  Bell,
  CheckCheck,
  Trash2,
  Loader2,
  Award,
  MessageSquare,
  CloudSun,
  Bug,
  Building2,
  ExternalLink,
} from 'lucide-react';

const NotificationPage = () => {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/notifications');
      if (res.data.success) {
        setNotifications(res.data.notifications);
        setUnreadCount(res.data.unreadCount);
      }
    } catch (err) {
      console.error('Failed to load notifications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      const res = await api.put('/notifications/read-all');
      if (res.data.success) {
        fetchNotifications();
      }
    } catch (err) {
      console.error('Failed to mark all notifications as read', err);
    }
  };

  const handleNotificationClick = async (notif) => {
    if (!notif.isRead) {
      try {
        await api.put(`/notifications/${notif._id}/read`);
      } catch (err) {}
    }
    if (notif.link) {
      navigate(notif.link);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      const res = await api.delete(`/notifications/${id}`);
      if (res.data.success) {
        setNotifications(notifications.filter((n) => n._id !== id));
      }
    } catch (err) {}
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'EXPERT_ANSWER':
        return <Award className="w-5 h-5 text-amber-400" />;
      case 'NEW_MESSAGE':
        return <MessageSquare className="w-5 h-5 text-emerald-400" />;
      case 'WEATHER_ALERT':
        return <CloudSun className="w-5 h-5 text-sky-400" />;
      case 'DISEASE_ALERT':
        return <Bug className="w-5 h-5 text-rose-400" />;
      case 'SCHEME_UPDATE':
        return <Building2 className="w-5 h-5 text-sky-400" />;
      default:
        return <Bell className="w-5 h-5 text-amber-400" />;
    }
  };

  const filteredNotifications = typeFilter
    ? notifications.filter((n) => n.type === typeFilter)
    : notifications;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-amber-500/20 relative overflow-hidden bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold">
              <Bell className="w-3.5 h-3.5" /> Notification Center
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Alerts & System Updates</h1>
            <p className="text-xs text-slate-300">
              Live alerts for expert answers, consultation status changes, new chat messages, and government scheme releases.
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold rounded-xl border border-slate-700 transition-colors shrink-0"
            >
              <CheckCheck className="w-4 h-4 text-emerald-400" /> Mark All as Read
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {['', 'EXPERT_ANSWER', 'NEW_MESSAGE', 'CONSULTATION_UPDATE', 'SCHEME_UPDATE', 'WEATHER_ALERT'].map((tp) => (
          <button
            key={tp}
            onClick={() => setTypeFilter(tp)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              typeFilter === tp
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/10'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {tp === '' ? 'All Notifications' : tp.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
          <p className="text-xs font-medium">Fetching notifications...</p>
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="glass-card p-12 rounded-3xl border border-slate-800 text-center space-y-3">
          <Bell className="w-8 h-8 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No Notifications</h3>
          <p className="text-xs text-slate-400">You are all caught up!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((n) => (
            <div
              key={n._id}
              onClick={() => handleNotificationClick(n)}
              className={`glass-card p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                !n.isRead
                  ? 'border-amber-500/40 bg-amber-950/10 shadow-lg'
                  : 'border-slate-800/80 bg-slate-900/40 hover:border-slate-700'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 shrink-0">
                {getTypeIcon(n.type)}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    {n.title}
                    {!n.isRead && <span className="w-2 h-2 rounded-full bg-amber-400"></span>}
                  </h4>
                  <span className="text-[10px] text-slate-500">
                    {new Date(n.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{n.message}</p>
              </div>

              <button
                onClick={(e) => handleDelete(e, n._id)}
                className="p-1 text-slate-500 hover:text-rose-400 rounded-lg shrink-0"
                title="Delete notification"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationPage;
