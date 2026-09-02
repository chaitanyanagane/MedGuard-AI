import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Eye, 
  RotateCcw, 
  Check, 
  Search,
  Filter
} from 'lucide-react';
import { getAlerts } from '../lib/api';

export default function AlertsView({ onSelectDevice }) {
  const [alerts, setAlerts] = useState([]);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAlerts() {
      setLoading(true);
      try {
        const data = await getAlerts();
        setAlerts(data);
      } catch (err) {
        console.error("Error loading alerts:", err);
      } finally {
        setLoading(false);
      }
    }
    loadAlerts();
  }, []);

  const handleResolveAlert = (alertId) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'RESOLVED' } : a));
  };

  const filteredAlerts = alerts.filter(a => {
    if (activeFilter === 'CRITICAL') return a.riskLevel === 'CRITICAL' && a.status !== 'RESOLVED';
    if (activeFilter === 'HIGH') return a.riskLevel === 'HIGH' && a.status !== 'RESOLVED';
    if (activeFilter === 'MEDIUM') return a.riskLevel === 'MEDIUM' && a.status !== 'RESOLVED';
    if (activeFilter === 'RESOLVED') return a.status === 'RESOLVED';
    return a.status !== 'RESOLVED';
  });

  const criticalCount = alerts.filter(a => a.riskLevel === 'CRITICAL' && a.status !== 'RESOLVED').length;
  const highCount = alerts.filter(a => a.riskLevel === 'HIGH' && a.status !== 'RESOLVED').length;
  const mediumCount = alerts.filter(a => a.riskLevel === 'MEDIUM' && a.status !== 'RESOLVED').length;
  const resolvedCount = alerts.filter(a => a.status === 'RESOLVED').length;

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
            Risk & Safety Event Triage
          </span>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2 mt-0.5">
            <Bell className="w-6 h-6 text-cyan-400" />
            Equipment Safety Alerts ({filteredAlerts.length})
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time equipment risk notifications flagged for clinical engineering review.
          </p>
        </div>

        {/* Filter Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 text-xs">
          {[
            { id: 'ALL', label: `Active (${criticalCount + highCount + mediumCount})` },
            { id: 'CRITICAL', label: `Critical (${criticalCount})` },
            { id: 'HIGH', label: `High (${highCount})` },
            { id: 'MEDIUM', label: `Medium (${mediumCount})` },
            { id: 'RESOLVED', label: `Resolved (${resolvedCount})` }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                activeFilter === f.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Alert Cards Container */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-12 text-center text-slate-400 space-y-3">
            <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin mx-auto" />
            <p className="text-xs">Fetching active safety alert queue...</p>
          </div>
        ) : filteredAlerts.length === 0 ? (
          <div className="glass-panel p-12 text-center rounded-2xl border border-slate-800 space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="text-base font-bold text-white">No active alerts in this category</h3>
            <p className="text-xs text-slate-400">All equipment risk alerts for this filter have been triaged.</p>
          </div>
        ) : (
          filteredAlerts.map(alert => {
            const isCrit = alert.riskLevel === 'CRITICAL';
            const isHigh = alert.riskLevel === 'HIGH';
            const isResolved = alert.status === 'RESOLVED';

            return (
              <div
                key={alert.id}
                className={`glass-panel p-5 rounded-2xl border transition-all duration-200 ${
                  isResolved 
                    ? 'border-slate-800 bg-slate-900/40 opacity-70' 
                    : isCrit 
                    ? 'border-rose-500/40 bg-rose-950/20' 
                    : isHigh 
                    ? 'border-orange-500/40 bg-orange-950/20' 
                    : 'border-amber-500/40 bg-amber-950/20'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`p-2.5 rounded-xl border mt-0.5 ${
                      isCrit 
                        ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' 
                        : isHigh 
                        ? 'bg-orange-500/10 border-orange-500/30 text-orange-400' 
                        : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                    }`}>
                      <ShieldAlert className={`w-5 h-5 ${isCrit ? 'animate-bounce' : ''}`} />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-cyan-400">{alert.deviceId}</span>
                        <span className="text-slate-500">•</span>
                        <h4 className="font-bold text-sm text-white">{alert.deviceName}</h4>
                      </div>
                      
                      <p className="text-xs text-slate-400 mt-0.5">
                        {alert.manufacturer} • {alert.deviceType} ({alert.country})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 text-xs font-extrabold rounded-xl border uppercase tracking-wider ${
                      isCrit 
                        ? 'bg-rose-500/20 border-rose-500/50 text-rose-400 pulse-critical' 
                        : isHigh 
                        ? 'bg-orange-500/20 border-orange-500/50 text-orange-400' 
                        : 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                    }`}>
                      {alert.riskScore}% {alert.riskLevel}
                    </span>

                    <span className="font-mono text-[10px] text-slate-500 px-2 py-1 bg-slate-900 rounded border border-slate-800">
                      {alert.date}
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <p className="text-slate-300 leading-relaxed">
                    <strong className="text-slate-400">Trigger Reason:</strong> {alert.reason}
                  </p>

                  <div className="flex items-center gap-2 shrink-0">
                    {!isResolved && (
                      <button
                        onClick={() => handleResolveAlert(alert.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1 transition"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-400" /> Acknowledge
                      </button>
                    )}

                    <button
                      onClick={() => onSelectDevice({ id: alert.deviceId, name: alert.deviceName, manufacturer: alert.manufacturer, type: alert.deviceType, country: alert.country, riskScore: alert.riskScore, riskLevel: alert.riskLevel })}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-300 flex items-center gap-1 transition"
                    >
                      <Eye className="w-3.5 h-3.5" /> Inspect Device
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
