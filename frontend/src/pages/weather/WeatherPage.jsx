import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
  CloudSun,
  Thermometer,
  Droplets,
  Wind,
  CloudRain,
  Search,
  MapPin,
  Calendar,
  AlertTriangle,
  Loader2,
  Info,
  CheckCircle2,
} from 'lucide-react';

const WeatherPage = () => {
  const { user } = useAuth();
  const defaultLocation = user?.district ? `${user.district}, ${user.state}` : 'Ludhiana, Punjab';

  const [locationInput, setLocationInput] = useState(defaultLocation);
  const [activeLocation, setActiveLocation] = useState(defaultLocation);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchWeather = async (loc) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/weather?location=${encodeURIComponent(loc)}`);
      if (res.data.success) {
        setWeatherData(res.data.weather);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to retrieve weather information.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(activeLocation);
  }, [activeLocation]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (locationInput.trim()) {
      setActiveLocation(locationInput.trim());
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-sky-500/20 relative overflow-hidden bg-gradient-to-r from-slate-900 via-sky-950/30 to-slate-900">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs font-semibold">
              <CloudSun className="w-3.5 h-3.5" /> Real-Time Weather Intelligence
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Agricultural Weather Dashboard</h1>
            <p className="text-xs text-slate-300">
              Live weather metrics, precipitation forecasts, wind speeds, and agricultural spray advisories.
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                placeholder="Enter village, district, or city..."
                className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-sky-500/20 transition-all shrink-0"
            >
              Search Location
            </button>
          </form>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400" /> {error}
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-slate-400 flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
          <p className="text-xs font-medium">Fetching real-time weather metrics for {activeLocation}...</p>
        </div>
      ) : weatherData ? (
        <div className="space-y-6">
          {/* Main Current Weather Card */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="space-y-2 lg:col-span-1 border-b lg:border-b-0 lg:border-r border-slate-800 pb-4 lg:pb-0 lg:pr-6">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-sky-400" /> Currently Viewing
              </span>
              <h2 className="text-2xl font-black text-white">{weatherData.location}</h2>
              <div className="flex items-center gap-3 pt-2">
                <span className="text-5xl font-black text-sky-400">{weatherData.temperature}°C</span>
                <div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-500/10 text-sky-300 border border-sky-500/20 block">
                    {weatherData.weatherCondition}
                  </span>
                  <span className="text-[11px] text-slate-400 mt-1 block">Feels like {weatherData.feelsLike}°C</span>
                </div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 lg:col-span-2">
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-sky-400" /> Relative Humidity
                </span>
                <p className="text-xl font-bold text-white">{weatherData.humidity}%</p>
                <span className="text-[10px] text-slate-500">Air moisture level</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <CloudRain className="w-3.5 h-3.5 text-blue-400" /> Rainfall / Precip.
                </span>
                <p className="text-xl font-bold text-white">{weatherData.rainfall} mm</p>
                <span className="text-[10px] text-slate-500">Last 24 hours</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1 col-span-2 sm:col-span-1">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Wind className="w-3.5 h-3.5 text-emerald-400" /> Wind Speed
                </span>
                <p className="text-xl font-bold text-white">{weatherData.windSpeed} km/h</p>
                <span className="text-[10px] text-slate-500">Surface wind rate</span>
              </div>
            </div>
          </div>

          {/* Agronomic Spray & Irrigation Advisory Banner */}
          <div className="glass-card p-6 rounded-2xl border border-emerald-500/30 bg-emerald-950/20">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white">Agronomic Weather Advisory</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {weatherData.rainfall > 5
                    ? 'Heavy rainfall predicted. Suspend pesticide spraying and ensure field drainage outlets are open.'
                    : weatherData.windSpeed > 20
                    ? 'High wind velocity detected (>20 km/h). Avoid foliar pesticide or herbicide spraying to prevent drift.'
                    : 'Optimal weather conditions for field work, fertilizer broadcasting, and irrigation management.'}
                </p>
              </div>
            </div>
          </div>

          {/* 5-Day Daily Forecast */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-sky-400" /> 5-Day Weather Forecast
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {weatherData.forecast?.map((day, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-2 hover:border-sky-500/30 transition-all"
                >
                  <p className="text-xs font-bold text-white">{day.day}</p>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-800 text-sky-300 block truncate">
                    {day.condition}
                  </span>
                  <div className="pt-1">
                    <span className="text-sm font-extrabold text-white">{day.highTemp}°</span>
                    <span className="text-xs text-slate-500 ml-1">/ {day.lowTemp}°C</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block">🌧️ {day.precipitationChance}% rain</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default WeatherPage;
