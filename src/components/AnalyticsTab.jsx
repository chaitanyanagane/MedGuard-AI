import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  FileText, 
  CheckCircle2, 
  Download, 
  Shield, 
  Calendar, 
  Cpu,
  Lock
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  LineChart, 
  Line, 
  Legend, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

export default function AnalyticsTab({ devices }) {
  const failureModeData = [
    { mode: 'Thermal Overload', count: 38, percentage: 38 },
    { mode: 'Valve / Pressure Leak', count: 26, percentage: 26 },
    { mode: 'Bearing Mechanical Wear', count: 18, percentage: 18 },
    { mode: 'Voltage / Power Sag', count: 12, percentage: 12 },
    { mode: 'Sensor Signal Drift', count: 6, percentage: 6 }
  ];

  const COLORS = ['#f43f5e', '#f59e0b', '#06b6d4', '#6366f1', '#10b981'];

  const mtbfTrendData = [
    { month: 'Jan', MTBF: 1240, MTTR: 4.8 },
    { month: 'Feb', MTBF: 1310, MTTR: 4.2 },
    { month: 'Mar', MTBF: 1380, MTTR: 3.5 },
    { month: 'Apr', MTBF: 1490, MTTR: 2.9 },
    { month: 'May', MTBF: 1560, MTTR: 2.1 },
    { month: 'Jun', MTBF: 1680, MTTR: 1.4 },
    { month: 'Jul', MTBF: 1820, MTTR: 0.8 }
  ];

  const auditLogs = [
    {
      id: "AUD-2026-091",
      timestamp: "2026-08-24 12:01:45",
      event: "AI Model Retrained: Failure Risk Threshold updated for GE CT Scanner Tube",
      actor: "AEGIS Neural Engine v4.2",
      hash: "0x8f99a12c...e84",
      status: "VERIFIED"
    },
    {
      id: "AUD-2026-090",
      timestamp: "2026-08-24 11:30:00",
      event: "Work Order WO-2026-8802 Dispatched to Sarah Jenkins",
      actor: "System Auto-Triage Rules",
      hash: "0x3b1104e...112",
      status: "VERIFIED"
    },
    {
      id: "AUD-2026-089",
      timestamp: "2026-08-24 10:15:22",
      event: "Critical Alert Triggered: Anode Housing Temp > 84.6°C on DEV-CT-9901",
      actor: "Telemetry Monitor Node 4",
      hash: "0x77e41b9...a01",
      status: "VERIFIED"
    },
    {
      id: "AUD-2026-088",
      timestamp: "2026-08-24 09:00:10",
      event: "ISO-13485 Quarterly Self-Diagnostics Passed: 142 Assets Baseline OK",
      actor: "Compliance Daemon",
      hash: "0x12a99c0...f42",
      status: "VERIFIED"
    }
  ];

  const [exportNotice, setExportNotice] = useState(false);

  const handleExportAudit = () => {
    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 3500);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Banner */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
            Clinical Asset Reliability Intelligence
          </span>
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mt-0.5">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            Reliability Analytics & Regulatory Audit Logs
          </h2>
        </div>

        <button
          onClick={handleExportAudit}
          className="px-4 py-2.5 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-2 transition"
        >
          <Download className="w-4 h-4 text-cyan-400" /> Export FDA 21 CFR Audit Trail (PDF)
        </button>
      </div>

      {exportNotice && (
        <div className="p-4 rounded-xl bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 text-xs font-bold shadow-lg shadow-cyan-500/10 animate-fadeIn flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-cyan-400" /> Audit Log bundle exported successfully (Cryptographically Sealed SHA-256).
        </div>
      )}

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Pareto Failure Modes Bar Chart */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            Equipment Failure Mode Pareto Distribution
          </h3>
          <p className="text-xs text-slate-400">
            Historical breakdown of primary root cause categories across fleet assets
          </p>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={failureModeData} margin={{ top: 10, right: 30, left: 0, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="mode" stroke="#94a3b8" fontSize={10} interval={0} angle={-15} textAnchor="end" />
                <YAxis stroke="#64748b" fontSize={11} unit="%" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                <Bar dataKey="percentage" fill="#06b6d4" radius={[6, 6, 0, 0]}>
                  {failureModeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* MTBF vs MTTR Monthly Trend Line Chart */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            Uptime Performance: MTBF vs MTTR Trend
          </h3>
          <p className="text-xs text-slate-400">
            Mean Time Between Failures (Hours) vs Mean Time To Repair (Hours) post-AI implementation
          </p>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mtbfTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis yAxisId="left" stroke="#10b981" fontSize={11} />
                <YAxis yAxisId="right" orientation="right" stroke="#f43f5e" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line yAxisId="left" type="monotone" dataKey="MTBF" stroke="#10b981" strokeWidth={2.5} name="MTBF (Hours - Up is better)" />
                <Line yAxisId="right" type="monotone" dataKey="MTTR" stroke="#f43f5e" strokeWidth={2.5} name="MTTR (Hours - Down is better)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* FDA 21 CFR Part 11 & ISO 13485 Audit Log Table */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-cyan-400" />
              Cryptographic Audit Log (FDA 21 CFR Part 11 Compliant)
            </h3>
            <p className="text-xs text-slate-400">
              Immutable ledger recording all AI predictions, telemetry overrides, and technician dispatches
            </p>
          </div>
          <span className="text-[10px] font-mono px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center gap-1">
            <Lock className="w-3 h-3" /> Blockchain Hash Valid
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                <th className="py-3 px-3">Log ID</th>
                <th className="py-3 px-3">Timestamp</th>
                <th className="py-3 px-3">Event Description</th>
                <th className="py-3 px-3">Actor / Agent</th>
                <th className="py-3 px-3">SHA-256 Hash</th>
                <th className="py-3 px-3">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {auditLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-900/40 transition">
                  <td className="py-3 px-3 font-mono font-bold text-cyan-400">{log.id}</td>
                  <td className="py-3 px-3 text-slate-300">{log.timestamp}</td>
                  <td className="py-3 px-3 text-slate-100 font-medium">{log.event}</td>
                  <td className="py-3 px-3 text-slate-400">{log.actor}</td>
                  <td className="py-3 px-3 font-mono text-slate-500 text-[10px]">{log.hash}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
