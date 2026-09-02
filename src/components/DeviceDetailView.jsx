import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  Cpu, 
  Calendar, 
  Globe, 
  Building2, 
  Info, 
  Wrench, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Activity, 
  UserCheck,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { addWorkOrder } from '../lib/api';

export default function DeviceDetailView({ device, onClose, onScheduleInspection }) {
  if (!device) return null;

  const [toast, setToast] = useState(null);

  const isCrit = device.riskLevel === 'CRITICAL';
  const isHigh = device.riskLevel === 'HIGH';
  const isMed = device.riskLevel === 'MEDIUM';

  const handleScheduleAction = () => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });

    const newWorkOrder = {
      id: `WO-${Date.now()}`,
      deviceId: device.id,
      deviceName: device.name,
      manufacturer: device.manufacturer,
      assignedEngineer: device.assignedEngineer?.name || 'Dr. Marcus Vance',
      status: 'SCHEDULED',
      priority: device.riskLevel || 'HIGH',
      scheduledDate: new Date().toLocaleDateString(),
      description: `Preventive inspection & teardown audit for ${device.primaryFailureMode || 'Routine Inspection'}`
    };

    addWorkOrder(newWorkOrder);

    setToast(`Work Order #${newWorkOrder.id} logged & scheduled for ${device.name}! Lead engineer (${newWorkOrder.assignedEngineer}) notified.`);
    setTimeout(() => setToast(null), 4000);

    if (onScheduleInspection) {
      onScheduleInspection(device);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel max-w-3xl w-full p-6 rounded-2xl border border-slate-700 space-y-6 max-h-[90vh] overflow-y-auto animate-scaleUp">
        
        {/* Toast Banner */}
        {toast && (
          <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-bold shadow-lg shadow-emerald-500/10 flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toast}</span>
          </div>
        )}

        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                {device.hospitalWing} • {device.room}
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-[10px] font-mono text-slate-400">ID: {device.id}</span>
            </div>
            <h2 className="text-xl font-extrabold text-white mt-0.5">{device.name}</h2>
            <p className="text-xs text-slate-400">{device.manufacturer} • Model {device.model} ({device.country})</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Close Details"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Section 1: Prominent Risk Score Gauge & Specs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Prominent Risk Score Dial (1 Col) */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col items-center justify-center text-center space-y-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Predicted Risk Score</span>
            
            <div className="relative inline-flex items-center justify-center my-1">
              <svg className="w-28 h-28">
                <circle
                  cx="56"
                  cy="56"
                  r="44"
                  stroke="#1e293b"
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="56"
                  cy="56"
                  r="44"
                  stroke={isCrit ? '#ef4444' : isHigh ? '#f97316' : isMed ? '#f59e0b' : '#10b981'}
                  strokeWidth="10"
                  strokeDasharray={276.4}
                  strokeDashoffset={276.4 - (276.4 * device.riskScore) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 transform -rotate-90 origin-center"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-2xl font-black ${
                  isCrit ? 'text-rose-400' : isHigh ? 'text-orange-400' : isMed ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {device.riskScore}%
                </span>
                <span className="text-[9px] text-slate-400 font-bold uppercase">{device.riskLevel}</span>
              </div>
            </div>

            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-[10px] text-slate-300 w-full">
              Model Confidence: <strong className="text-cyan-400 font-bold">{device.modelConfidence || 94}%</strong>
            </div>
          </div>

          {/* Device Specifications Grid (2 Cols) */}
          <div className="md:col-span-2 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Device Safety Record & Metadata</h4>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block">First Recorded Event</span>
                <strong className="text-slate-200 font-mono text-[11px]">{device.firstRecordedEvent || device.installDate}</strong>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block">Total Safety Events</span>
                <strong className="text-cyan-400 text-sm">{device.totalSafetyEvents} Logged</strong>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block">Last Recorded Event</span>
                <strong className="text-slate-200 font-mono text-[11px]">{device.lastEventDate}</strong>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block">Serial Number</span>
                <strong className="text-slate-300 font-mono text-[11px]">{device.serialNumber}</strong>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
              <strong className="font-bold text-rose-400 block mb-0.5">Primary Failure Mode:</strong>
              {device.primaryFailureMode}
            </div>
          </div>

        </div>

        {/* Section 2: STEP 7 — Risk Explanation ("Why is this device considered high risk?") */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              Why is this device considered high risk?
            </h3>
            
            <div className="group relative flex items-center">
              <Info className="w-4 h-4 text-slate-400 hover:text-cyan-400 cursor-pointer" />
              <div className="absolute right-0 top-6 w-64 p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-[10px] text-slate-300 shadow-xl opacity-0 group-hover:opacity-100 transition pointer-events-none z-20">
                These factors represent model-derived contributions to the current risk score based on historical event patterns.
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {device.riskFactors.map((rf, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-200">{rf.factor}</span>
                  <span className="font-mono font-bold text-cyan-400">{rf.contribution}%</span>
                </div>

                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                    style={{ width: `${rf.contribution}%` }}
                  />
                </div>

                <p className="text-[10px] text-slate-400">{rf.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: STEP 8 — Safety Event Visual Timeline */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            Historical Safety Event Visual Timeline
          </h3>

          <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
            {device.safetyEvents.map((ev, idx) => {
              const isEVCrit = ev.severity === 'CRITICAL';
              const isEVHigh = ev.severity === 'HIGH';

              return (
                <div key={ev.id || idx} className="relative group">
                  {/* Timeline node icon */}
                  <div className={`absolute -left-6 top-1.5 w-3 h-3 rounded-full border-2 border-slate-950 ${
                    isEVCrit ? 'bg-rose-500 pulse-critical' : isEVHigh ? 'bg-orange-500' : 'bg-amber-500'
                  }`} />

                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-cyan-400">{ev.date}</span>
                        <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded uppercase tracking-wider border ${
                          isEVCrit ? 'bg-rose-500/20 text-rose-400 border-rose-500/50' : 'bg-orange-500/20 text-orange-400 border-orange-500/50'
                        }`}>
                          {ev.eventType} • {ev.severity}
                        </span>
                      </div>

                      <span className="font-mono text-[10px] text-slate-500">Ref: {ev.reportNumber}</span>
                    </div>

                    <p className="text-slate-300 leading-relaxed">
                      {ev.summary}
                    </p>

                    {ev.actionRequired && (
                      <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-900">
                        <strong className="text-cyan-400">Action Taken:</strong> {ev.actionRequired}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 4: STEP 9 — Recommended Action (Equipment Management ONLY) */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Wrench className="w-4 h-4 text-cyan-400" />
              Recommended Action (Equipment Management)
            </h3>
            
            <span className={`px-3 py-1 text-xs font-bold rounded-lg uppercase tracking-wider border ${
              isCrit ? 'bg-rose-500/20 border-rose-500/50 text-rose-400' : 'bg-orange-500/20 border-orange-500/50 text-orange-400'
            }`}>
              {device.recommendation.level} Priority
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
            <h4 className="font-bold text-white text-sm">{device.recommendation.title}</h4>

            <ul className="space-y-1.5 pt-1">
              {device.recommendation.actionSteps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2 text-slate-300">
                  <span className="w-4 h-4 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <UserCheck className="w-4 h-4 text-cyan-400" />
              <span>Assigned Engineer: <strong className="text-slate-200">{device.assignedEngineer.name}</strong></span>
            </div>

            <button
              onClick={handleScheduleAction}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition"
            >
              <Zap className="w-4 h-4" /> Schedule Preventive Inspection
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
