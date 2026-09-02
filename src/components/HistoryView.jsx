import React from 'react';
import { History as HistoryIcon, Trash2, Clock } from 'lucide-react';

export default function HistoryView({ history = [], onDeleteHistoryItem, onClearHistory }) {
  const conditionLabels = ['Good', 'Fair', 'Poor'];

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
            Command Center Prediction Log
          </span>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2 mt-0.5">
            <HistoryIcon className="w-6 h-6 text-cyan-400" />
            Prediction History ({history.length})
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            View and manage generated predictions across General Equipment screening and CT Scanner deep analysis.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center gap-2 transition"
          >
            <Trash2 className="w-4 h-4" /> Clear All History
          </button>
        )}
      </div>

      {/* History Table / Empty State */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        {history.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <Clock className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No Prediction History Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Generated predictions from Model 1 (General Equipment) and Model 2 (CT Scanner) will automatically be recorded here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                  <th className="py-3 px-3">Timestamp</th>
                  <th className="py-3 px-3">Device / Scanner ID</th>
                  <th className="py-3 px-3">Analysis Type</th>
                  <th className="py-3 px-3">Predicted Result</th>
                  <th className="py-3 px-3">Priority / Risk</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {history.map(item => {
                  const prio = (typeof item.priority === 'object' ? item.priority.level : item.priority) || 'ROUTINE';
                  const isUrgent = prio === 'URGENT' || prio === 'CRITICAL';
                  const isAttention = prio === 'ATTENTION' || prio === 'HIGH';

                  return (
                    <tr key={item.id} className="hover:bg-slate-900/60 transition">
                      <td className="py-3.5 px-3 font-mono text-[11px] text-slate-400">{item.timestamp || item.date}</td>
                      <td className="py-3.5 px-3 font-bold text-white">
                        <div>{item.TypeDescription || item.scanner_id || 'CT Scanner'}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{item.Manufacturer || item.scanner_id}</div>
                      </td>
                      <td className="py-3.5 px-3 font-medium text-slate-300">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          (item.analysisType || '').includes('CT')
                            ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                            : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                        }`}>
                          {item.analysisType || 'General Equipment'}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-mono font-bold text-cyan-300">
                        {item.result || `${item.monthsToFailure} Months`}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className={`px-2.5 py-1 text-[10px] font-black rounded uppercase border ${
                          isUrgent 
                            ? 'bg-rose-500/20 border-rose-500/50 text-rose-400' 
                            : isAttention 
                            ? 'bg-amber-500/20 border-amber-500/50 text-amber-400' 
                            : 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                        }`}>
                          {prio}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <button
                          onClick={() => onDeleteHistoryItem(item.id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition"
                          title="Delete Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
