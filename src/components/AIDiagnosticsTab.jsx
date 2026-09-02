import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Cpu, 
  BarChart3, 
  Wrench, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Zap, 
  Package, 
  UserCheck, 
  ChevronRight,
  Sparkles,
  Info
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis 
} from 'recharts';

export default function AIDiagnosticsTab({ 
  devices, 
  selectedDevice, 
  setSelectedDevice, 
  onNavigateToDispatch 
}) {
  const device = selectedDevice || devices[0];

  const isCrit = device.status === 'CRITICAL';
  const isWarn = device.status === 'WARNING';

  // Radar chart data comparing nominal vs actual multi-domain health
  const radarData = [
    { domain: 'Mechanical', Health: isCrit ? 35 : isWarn ? 65 : 95 },
    { domain: 'Thermal', Health: isCrit ? 28 : isWarn ? 55 : 98 },
    { domain: 'Electrical', Health: isCrit ? 70 : isWarn ? 80 : 94 },
    { domain: 'Fluidics/Pressure', Health: isCrit ? 40 : isWarn ? 60 : 96 },
    { domain: 'Calibration', Health: isCrit ? 50 : isWarn ? 72 : 99 }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Device Selector Banner */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
            Explainable AI (XAI) Diagnostic Center
          </span>
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mt-0.5">
            <Cpu className="w-5 h-5 text-cyan-400" />
            Failure Diagnostics & Root Cause Analysis
          </h2>
        </div>

        {/* Equipment Dropdown Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-400">Select Equipment:</label>
          <select
            value={device.id}
            onChange={(e) => {
              const found = devices.find(d => d.id === e.target.value);
              if (found) setSelectedDevice(found);
            }}
            className="bg-slate-900 border border-slate-700 text-slate-100 text-xs font-bold px-3 py-2 rounded-xl focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            {devices.map(d => (
              <option key={d.id} value={d.id} className="bg-slate-900 text-slate-100">
                {d.name} ({d.status} - {d.riskScore}%)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Diagnostic Header & RUL Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Device Summary Card & Failure Risk Dial (1 Col) */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{device.wing}</span>
                <h3 className="text-lg font-bold text-white mt-0.5">{device.name}</h3>
                <p className="text-xs text-slate-400">{device.manufacturer} • {device.model}</p>
                <p className="text-[11px] text-slate-500 font-mono mt-1">S/N: {device.serialNumber}</p>
              </div>

              <span className={`px-3 py-1.5 text-xs font-extrabold rounded-xl border uppercase tracking-wider ${
                isCrit 
                  ? 'bg-rose-500/20 border-rose-500/50 text-rose-400 pulse-critical' 
                  : isWarn 
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-400 pulse-warning' 
                  : 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
              }`}>
                {device.status}
              </span>
            </div>

            {/* Circular Risk Dial Display */}
            <div className="my-6 text-center">
              <div className="inline-flex relative items-center justify-center">
                <svg className="w-36 h-36">
                  <circle
                    cx="72"
                    cy="72"
                    r="56"
                    stroke="#1e293b"
                    strokeWidth="12"
                    fill="transparent"
                  />
                  <circle
                    cx="72"
                    cy="72"
                    r="56"
                    stroke={isCrit ? '#f43f5e' : isWarn ? '#f59e0b' : '#10b981'}
                    strokeWidth="12"
                    strokeDasharray={351.8}
                    strokeDashoffset={351.8 - (351.8 * device.riskScore) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out transform -rotate-90 origin-center"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-3xl font-black ${isCrit ? 'text-rose-400' : isWarn ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {device.riskScore}%
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Failure Risk</span>
                </div>
              </div>
            </div>

            {/* Remaining Useful Life Box */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-cyan-400" /> Remaining Useful Life (RUL)
                </span>
                <span className={`font-extrabold text-sm ${isCrit ? 'text-rose-400' : isWarn ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {device.rulHours} Hours
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Predicted Failure: <strong className="text-slate-200">{device.predictedFailureDate}</strong> (±2.5h Confidence Interval)
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateToDispatch(device)}
            className="w-full py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition"
          >
            <Zap className="w-4 h-4" /> Schedule Biomedical Dispatch
          </button>
        </div>

        {/* Explainable AI (SHAP Feature Importance) Chart (2 Cols) */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-cyan-400" />
                SHAP Feature Importance (Root Cause Drivers)
              </h3>
              <p className="text-xs text-slate-400">
                AI Model Shapley values explaining percentage contribution of telemetry anomalies to failure risk
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              XAI Model: Random Forest Ensembles + LSTM
            </span>
          </div>

          {/* Bar Chart of SHAP Contributions */}
          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={device.shapFeatures} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis type="number" stroke="#64748b" fontSize={11} unit="%" />
                <YAxis dataKey="feature" type="category" stroke="#94a3b8" fontSize={11} width={170} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  formatter={(val, name, props) => [`+${val}% Impact (${props.payload.val})`, 'Risk Contribution']}
                />
                <Bar dataKey="impact" fill="#06b6d4" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Key Primary Risk Cause Text Banner */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
            <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <strong className="text-cyan-300 font-bold block mb-0.5">Primary Anomaly Detected:</strong>
              <p className="text-slate-300 leading-relaxed">
                {device.failureMode}. The primary metric driving this risk classification is <strong className="text-white">{device.shapFeatures[0]?.feature}</strong> contributing <strong className="text-cyan-400">+{device.shapFeatures[0]?.impact}%</strong> to overall failure probability.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Multi-Axis Health Radar & Prescriptive Action Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Multi-Domain Health Radar Chart */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Sub-System Health Profile (Radar Analysis)
          </h3>
          <p className="text-xs text-slate-400">
            Multi-domain sensor evaluation comparing actual sub-system health against baseline tolerances
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="domain" stroke="#94a3b8" fontSize={11} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#64748b" fontSize={10} />
                <Radar name="Sub-System Health" dataKey="Health" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Prescriptive Maintenance Protocol */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Wrench className="w-4 h-4 text-cyan-400" />
              Prescriptive AI Action Plan
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Automated maintenance steps recommended to mitigate failure prior to clinical downtime
            </p>

            <ul className="space-y-2.5">
              {device.prescriptiveActions.map((action, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-200">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{action}</span>
                </li>
              ))}
            </ul>

            {/* Required Spare Parts Info */}
            <div className="mt-5 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <Package className="w-4 h-4 text-amber-400" />
                <div>
                  <span className="text-slate-400 block text-[10px]">Required Component</span>
                  <strong className="text-slate-100">{device.requiredPart.name}</strong>
                  <span className="text-[10px] text-slate-500 block">P/N: {device.requiredPart.partNumber}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                  {device.requiredPart.stockCount} In Stock
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">${device.requiredPart.estimatedCost}</span>
              </div>
            </div>
          </div>

          {/* Assigned Technician */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-cyan-400" />
              <div>
                <span className="text-slate-400 text-[10px] block">Assigned Lead Technician</span>
                <strong className="text-slate-200">{device.assignedTech.name} ({device.assignedTech.role})</strong>
              </div>
            </div>
            <span className="text-[11px] font-bold text-cyan-400">SLA: {device.assignedTech.sla}</span>
          </div>

        </div>

      </div>

    </div>
  );
}
