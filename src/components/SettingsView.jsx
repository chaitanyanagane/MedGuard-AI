import React, { useState, useEffect } from 'react';
import { Sliders, Cpu, Database, Save, CheckCircle2, Shield, RefreshCw } from 'lucide-react';
import { getSettings, saveSettings } from '../lib/api';

export default function SettingsView() {
  const [criticalThreshold, setCriticalThreshold] = useState(85);
  const [highThreshold, setHighThreshold] = useState(70);
  const [apiUrl, setApiUrl] = useState('http://localhost:8000');
  const [apiMode, setApiMode] = useState('MOCK');
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    const current = getSettings();
    setCriticalThreshold(current.criticalThreshold || 85);
    setHighThreshold(current.highThreshold || 70);
    setApiUrl(current.apiUrl || 'http://localhost:8000');
    setApiMode(current.apiMode || 'MOCK');
  }, []);

  const handleSaveSettings = () => {
    const updated = {
      criticalThreshold,
      highThreshold,
      apiUrl,
      apiMode
    };
    saveSettings(updated);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3500);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
            System & ML Model Configuration
          </span>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2 mt-0.5">
            <Sliders className="w-6 h-6 text-cyan-400" />
            Platform Settings
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure risk thresholds, backend ML model endpoint parameters, and data integration architecture.
          </p>
        </div>

        <button
          onClick={handleSaveSettings}
          className="px-5 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition"
        >
          <Save className="w-4 h-4" /> Save Configuration
        </button>
      </div>

      {savedNotice && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-bold shadow-lg shadow-emerald-500/10 flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> System settings & API endpoint configuration saved successfully!
        </div>
      )}

      {/* Main Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* ML Risk Score Classification Thresholds */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-400" />
            Risk Classification Thresholds
          </h3>

          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-rose-400">CRITICAL Risk Threshold</span>
                <span className="font-mono font-bold text-white">&gt;= {criticalThreshold}%</span>
              </div>
              <input
                type="range"
                min="75"
                max="95"
                value={criticalThreshold}
                onChange={(e) => setCriticalThreshold(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
              <p className="text-[10px] text-slate-400">Devices scoring at or above this threshold require immediate review.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-orange-400">HIGH Risk Threshold</span>
                <span className="font-mono font-bold text-white">&gt;= {highThreshold}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="74"
                value={highThreshold}
                onChange={(e) => setHighThreshold(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
              <p className="text-[10px] text-slate-400">Devices scoring in this range are prioritized for preventive inspection.</p>
            </div>
          </div>
        </div>

        {/* Backend REST API & ML Model Integration Settings */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-cyan-400" />
            Backend & ML API Integration (Step 12)
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="text-slate-400 font-bold block mb-1">Data Source Mode</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setApiMode('MOCK')}
                  className={`p-3 rounded-xl border font-bold text-left transition ${
                    apiMode === 'MOCK' 
                      ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300' 
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  <strong className="block text-xs text-white">Centralized Demo Mode</strong>
                  <span className="text-[10px] text-slate-400 font-normal">Kaggle dataset mock facade</span>
                </button>

                <button
                  type="button"
                  onClick={() => setApiMode('REST_API')}
                  className={`p-3 rounded-xl border font-bold text-left transition ${
                    apiMode === 'REST_API' 
                      ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300' 
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  <strong className="block text-xs text-white">Live ML REST API</strong>
                  <span className="text-[10px] text-slate-400 font-normal">Connect ML backend service</span>
                </button>
              </div>
            </div>

            <div>
              <label className="text-slate-400 font-bold block mb-1">REST API Prediction Endpoint URL</label>
              <input
                type="text"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 font-mono text-cyan-400 text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1 text-slate-400">
              <strong className="text-slate-200 block">Current ML Model Version:</strong>
              <p className="font-mono text-cyan-400 text-[11px]">MedGuard-RF-XGBoost-v2.4 (Cognizant Dataset Trained)</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
