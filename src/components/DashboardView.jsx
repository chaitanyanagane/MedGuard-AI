import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Cpu, 
  ChevronRight, 
  BarChart3, 
  Sparkles,
  Stethoscope,
  Scan,
  ArrowRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip 
} from 'recharts';
import { getDashboardSummary } from '../lib/api';

export default function DashboardView({ 
  onNavigateToPredict,
  onNavigateToCT,
  onNavigateToDevices,
  onNavigateToAlerts 
}) {
  const [summary, setSummary] = useState({
    totalDevices: 5000,
    predictionsGenerated: 1482,
    urgentCount: 142,
    attentionCount: 410,
    routineCount: 732,
    avgLifespanMonths: 23,
    ctScannersCount: 48,
    ctCriticalScanners: 6
  });

  const [historyItems, setHistoryItems] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        const sum = await getDashboardSummary();
        setSummary(sum);
      } catch (err) {
        console.error("Dashboard error:", err);
      }

      try {
        const saved = localStorage.getItem('medguard_prediction_history');
        if (saved) {
          const parsed = JSON.parse(saved);
          setHistoryItems(parsed);
        }
      } catch (e) {}
    }
    loadData();
  }, []);

  const timelineDistData = [
    { name: '< 6 months (URGENT)', count: summary.urgentCount, color: '#ef4444' },
    { name: '6–18 months (ATTENTION)', count: summary.attentionCount, color: '#f59e0b' },
    { name: '> 18 months (ROUTINE)', count: summary.routineCount, color: '#10b981' }
  ];

  const defaultPredictions = [
    {
      id: "PRED-CT-901",
      deviceType: "CT Scanner (Deep Analysis)",
      scannerId: "CT-017",
      manufacturer: "GE Healthcare",
      analysisType: "CT Scanner",
      result: "64.2 / 100 Health Score (218 Days RUL)",
      priority: "HIGH",
      priorityColor: "orange",
      date: "2026-08-31 11:30 AM"
    },
    {
      id: "PRED-101",
      deviceType: "Ventilator",
      scannerId: "MD-3109",
      manufacturer: "Medtronic",
      analysisType: "General Equipment",
      result: "5.4 Months to Failure",
      priority: "URGENT",
      priorityColor: "rose",
      date: "2026-08-31 10:15 AM"
    },
    {
      id: "PRED-102",
      deviceType: "Radiographic System",
      scannerId: "MD-2050",
      manufacturer: "Siemens Healthineers",
      analysisType: "General Equipment",
      result: "4.2 Months to Failure",
      priority: "URGENT",
      priorityColor: "rose",
      date: "2026-08-31 09:40 AM"
    }
  ];

  const formattedHistory = historyItems.map(item => ({
    id: item.id || `PRED-${Math.random()}`,
    deviceType: item.TypeDescription || item.scanner_id || 'Medical Equipment',
    scannerId: item.scanner_id || 'MD-SYSTEM',
    manufacturer: item.Manufacturer || 'Medical Systems',
    analysisType: item.analysisType || 'General Equipment',
    result: item.result || `${item.monthsToFailure} Months`,
    priority: typeof item.priority === 'object' ? item.priority.level : (item.priority || 'ATTENTION'),
    date: item.timestamp || item.date || new Date().toLocaleString()
  }));

  const recentPredictions = [...formattedHistory, ...defaultPredictions].slice(0, 5);

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Hero Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 uppercase tracking-wider">
                MEDGUARD AI
              </span>
              <span className="text-xs text-slate-400 font-mono">Cognizant Healthcare Hackathon</span>
            </div>
            
            <h2 className="text-2xl lg:text-3xl font-extrabold text-white mt-1 tracking-tight">
              Medical Equipment Command Center
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Predict equipment failure, identify high-risk assets, and prioritize preventive maintenance.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateToCT}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold shadow-lg shadow-purple-500/20 hover:opacity-90 transition flex items-center gap-2"
            >
              <Scan className="w-4 h-4" />
              <span>CT Scanner Deep Analysis</span>
            </button>

            <button
              onClick={onNavigateToPredict}
              className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-white text-xs font-bold transition flex items-center gap-2"
            >
              <Stethoscope className="w-4 h-4 text-cyan-400" />
              <span>General Screening</span>
            </button>
          </div>
        </div>
      </div>

      {/* TOP KPI SECTION */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Devices */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Hospital Devices</span>
            <span className="text-3xl font-extrabold text-white mt-1 font-mono block">
              {summary.totalDevices.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-500 mt-1 block">*Demo Fleet Baseline Data</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
            <Cpu className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Predictions Generated */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Predictions Generated</span>
            <span className="text-3xl font-extrabold text-cyan-400 mt-1 font-mono block">
              {summary.predictionsGenerated.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-500 mt-1 block">*Session & Benchmark History</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Devices Requiring Attention */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Requiring Attention</span>
            <span className="text-3xl font-extrabold text-amber-400 mt-1 font-mono block">
              {summary.attentionCount}
            </span>
            <span className="text-[11px] text-slate-500 mt-1 block">*6–18m Derived Priority</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Urgent Devices */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Urgent Assets</span>
            <span className="text-3xl font-extrabold text-rose-400 mt-1 font-mono block">
              {summary.urgentCount}
            </span>
            <span className="text-[11px] text-slate-500 mt-1 block">*&lt; 6m Derived Priority</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* PROMINENT ANALYSIS SELECTION SECTION */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <span>Choose Analysis</span>
          </h3>
          <span className="text-xs text-slate-400 font-medium">Select predictive model workflow</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* CARD 1: GENERAL EQUIPMENT */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition group relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition" />
            
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 uppercase tracking-wider">
                  MODEL 1 — GENERAL EQUIPMENT
                </span>
                <Stethoscope className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition duration-300" />
              </div>

              <h4 className="text-xl font-bold text-white group-hover:text-cyan-300 transition">
                Hospital-wide equipment screening
              </h4>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Estimate remaining months to failure using equipment characteristics such as device category, manufacturer, age, asset condition, and operational shift patterns.
              </p>

              <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center gap-4 text-xs font-mono text-slate-400">
                <span>Outputs: MonthsToFailure</span>
                <span>•</span>
                <span>Derived Priority</span>
              </div>
            </div>

            <button
              onClick={onNavigateToPredict}
              className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs shadow-md shadow-cyan-500/10 hover:shadow-cyan-500/25 transition flex items-center justify-center gap-2"
            >
              <span>Analyze Equipment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* CARD 2: CT SCANNER */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-purple-500/40 transition group relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition" />
            
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/30 uppercase tracking-wider">
                  MODEL 2 — CT SCANNER
                </span>
                <Scan className="w-6 h-6 text-purple-400 group-hover:scale-110 transition duration-300" />
              </div>

              <h4 className="text-xl font-bold text-white group-hover:text-purple-300 transition">
                Deep device-specific analysis
              </h4>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Analyze current CT scanner condition and predict equipment risk from 20+ telemetry parameters (tube wear, gantry vibration, bearing temperature, coolant flow, error history).
              </p>

              <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center gap-4 text-xs font-mono text-slate-400">
                <span>Outputs: Health Score</span>
                <span>•</span>
                <span>RUL Days</span>
                <span>•</span>
                <span>Risk Level</span>
              </div>
            </div>

            <button
              onClick={onNavigateToCT}
              className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white font-bold text-xs shadow-md shadow-purple-500/10 hover:shadow-purple-500/25 transition flex items-center justify-center gap-2"
            >
              <span>Analyze CT Scanner</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* DASHBOARD CHARTS & RECENT PREDICTIONS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CHART: GENERAL EQUIPMENT TIMELINE DISTRIBUTION */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Fleet Failure Timeline Distribution</span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">Derived priority breakdown across hospital equipment</p>
            
            <div className="h-48 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={timelineDistData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="count"
                  >
                    {timelineDistData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            {timelineDistData.map(item => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-300">{item.name}</span>
                </div>
                <span className="font-mono font-bold text-white">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RECENT PREDICTIONS TABLE */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>Recent Command Center Predictions</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">Latest AI predictions from Model 1 and Model 2</p>
              </div>
              <button
                onClick={onNavigateToDevices}
                className="text-xs text-cyan-400 font-semibold hover:underline flex items-center gap-1"
              >
                <span>View All Devices</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2.5 px-3">Device / Scanner</th>
                    <th className="py-2.5 px-3">Analysis Level</th>
                    <th className="py-2.5 px-3">Predicted Result</th>
                    <th className="py-2.5 px-3">Priority / Risk</th>
                    <th className="py-2.5 px-3 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {recentPredictions.map(item => (
                    <tr key={item.id} className="hover:bg-slate-900/40 transition">
                      <td className="py-3 px-3">
                        <div className="font-bold text-white">{item.deviceType}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{item.scannerId} • {item.manufacturer}</div>
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-300">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.analysisType === 'CT Scanner' 
                            ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30' 
                            : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                        }`}>
                          {item.analysisType}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-100">
                        {item.result}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          item.priority === 'URGENT' || item.priority === 'CRITICAL' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' :
                          item.priority === 'HIGH' || item.priority === 'ATTENTION' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                          'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        }`}>
                          {item.priority}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right text-slate-400 font-mono text-[11px]">
                        {item.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
