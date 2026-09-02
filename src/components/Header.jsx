import React from 'react';
import { 
  ShieldAlert, 
  Activity, 
  Cpu, 
  HelpCircle, 
  Sliders, 
  FileText, 
  History,
  Sparkles,
  Stethoscope,
  Scan
} from 'lucide-react';

export default function Header({
  activeTab,
  setActiveTab,
  onOpenHelp
}) {
  const navItems = [
    { id: 'dashboard', label: 'Command Center', icon: Activity },
    { id: 'predict', label: 'General Screening', icon: Stethoscope },
    { id: 'ct-analysis', label: 'CT Scanner Analysis', icon: Scan, highlight: true },
    { id: 'devices', label: 'Devices', icon: Cpu },
    { id: 'history', label: 'History', icon: History },
    { id: 'analytics', label: 'Analytics', icon: ShieldAlert },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Sliders }
  ];

  return (
    <header className="glass-panel border-b border-slate-800 sticky top-0 z-40 px-4 lg:px-8 py-3 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & Identity */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <ShieldAlert className="w-6 h-6 text-white animate-pulse" />
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold bg-gradient-to-r from-white via-cyan-200 to-blue-400 bg-clip-text text-transparent tracking-tight">
                  MedGuard AI
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-full uppercase tracking-wider">
                  Cognizant Hackathon
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Predict. Prevent. Protect.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenHelp}
            className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            title="Help & Workflow Guide"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Action Button & Help */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          <button
            onClick={() => setActiveTab('ct-analysis')}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 via-cyan-500 to-blue-600 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-1.5 hover:opacity-90 transition"
          >
            <Scan className="w-3.5 h-3.5" /> CT Scanner Deep Analysis
          </button>

          <button
            onClick={onOpenHelp}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition"
          >
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span>Guide</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto mt-3 flex items-center gap-2 overflow-x-auto no-scrollbar border-t border-slate-800/80 pt-2">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 text-cyan-300 shadow-md shadow-cyan-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 border border-transparent'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
