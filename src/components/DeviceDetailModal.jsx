import React from 'react';
import { 
  X, 
  Activity, 
  ShieldAlert, 
  Clock, 
  Wrench, 
  Package, 
  UserCheck, 
  ChevronRight, 
  Zap,
  Info
} from 'lucide-react';

export default function DeviceDetailModal({ device, onClose, onNavigateToXAI, onNavigateToDispatch }) {
  if (!device) return null;

  const isCrit = device.status === 'CRITICAL';
  const isWarn = device.status === 'WARNING';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel max-w-2xl w-full p-6 rounded-2xl border border-slate-700 space-y-5 animate-scaleUp max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div>
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
              {device.wing} • {device.room}
            </span>
            <h2 className="text-xl font-bold text-white mt-0.5">{device.name}</h2>
            <p className="text-xs text-slate-400">{device.manufacturer} • Model {device.model}</p>
          </div>

          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 text-xs font-extrabold rounded-xl border uppercase tracking-wider ${
              isCrit ? 'bg-rose-500/20 border-rose-500/50 text-rose-400' : isWarn ? 'bg-amber-500/20 border-amber-500/50 text-amber-400' : 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
            }`}>
              {device.riskScore}% RISK
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Telemetry Metrics Comparison Grid */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Live Telemetry Metrics vs Nominal</h4>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Temperature (°C)</span>
              <strong className={`text-base font-extrabold ${device.telemetry.temperature > device.nominal.temperature * 1.2 ? 'text-rose-400' : 'text-slate-100'}`}>
                {device.telemetry.temperature}°C
              </strong>
              <span className="text-[10px] text-slate-500 block mt-0.5">Nominal: {device.nominal.temperature}°C</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Vibration RMS</span>
              <strong className={`text-base font-extrabold ${device.telemetry.vibration > device.nominal.vibration * 2 ? 'text-rose-400' : 'text-slate-100'}`}>
                {device.telemetry.vibration} mm/s
              </strong>
              <span className="text-[10px] text-slate-500 block mt-0.5">Nominal: {device.nominal.vibration} mm/s</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Pressure (PSI)</span>
              <strong className="text-base font-extrabold text-slate-100">{device.telemetry.pressure} PSI</strong>
              <span className="text-[10px] text-slate-500 block mt-0.5">Nominal: {device.nominal.pressure} PSI</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Voltage Input</span>
              <strong className="text-base font-extrabold text-slate-100">{device.telemetry.voltage} V</strong>
              <span className="text-[10px] text-slate-500 block mt-0.5">Nominal: {device.nominal.voltage} V</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Remaining Life (RUL)</span>
              <strong className={`text-base font-extrabold ${isCrit ? 'text-rose-400' : isWarn ? 'text-amber-400' : 'text-emerald-400'}`}>
                {device.rulHours} Hours
              </strong>
              <span className="text-[10px] text-slate-500 block mt-0.5">Confidence: 95%</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Downtime Cost</span>
              <strong className="text-base font-extrabold text-cyan-400">${device.downtimeRiskCost.toLocaleString()}</strong>
              <span className="text-[10px] text-slate-500 block mt-0.5">Est. Impact Risk</span>
            </div>
          </div>
        </div>

        {/* Primary Anomaly Cause */}
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
          <strong className="font-bold text-rose-400 block mb-0.5">Predicted Failure Mode:</strong>
          {device.failureMode}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            onClick={() => {
              onClose();
              onNavigateToXAI(device);
            }}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center gap-1.5 transition"
          >
            <Activity className="w-4 h-4 text-cyan-400" /> Deep XAI Breakdown
          </button>

          <button
            onClick={() => {
              onClose();
              onNavigateToDispatch(device);
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-1.5 transition"
          >
            <Zap className="w-4 h-4" /> Dispatch Technician
          </button>
        </div>

      </div>
    </div>
  );
}
