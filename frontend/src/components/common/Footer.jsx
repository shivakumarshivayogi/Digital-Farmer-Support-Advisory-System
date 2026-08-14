import React from 'react';
import { Sprout, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400 py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                <Sprout className="w-5 h-5 text-slate-950" />
              </div>
              <span className="font-bold text-white text-lg tracking-tight">AgriAdvisor</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering farmers with modern agricultural advisory, real-time weather analytics, market prices, and expert consultation.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">Key Features</h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-emerald-400 transition-colors">Crop Advisory & Diagnosis</li>
              <li className="hover:text-emerald-400 transition-colors">Real-time Weather Insights</li>
              <li className="hover:text-emerald-400 transition-colors">Agricultural Market Prices</li>
              <li className="hover:text-emerald-400 transition-colors">Soil & Fertilizer Guidance</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">User Portals</h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-emerald-400 transition-colors">Farmer Dashboard</li>
              <li className="hover:text-emerald-400 transition-colors">Agriculture Expert Portal</li>
              <li className="hover:text-emerald-400 transition-colors">System Admin Console</li>
              <li className="hover:text-emerald-400 transition-colors">Government Schemes</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">Technology Stack</h4>
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">React.js</span>
              <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">Vite</span>
              <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">Node.js</span>
              <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">Express</span>
              <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">MongoDB</span>
              <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">Tailwind CSS</span>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Digital Farmer Support & Advisory System. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built for Farmers with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
