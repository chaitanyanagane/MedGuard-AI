import React from 'react';
import { X, ShieldAlert, Cpu, CheckCircle2, AlertTriangle, FileText, Activity } from 'lucide-react';

export default function HelpModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel max-w-2xl w-full p-6 rounded-2xl border border-slate-700 space-y-6 max-h-[90vh] overflow-y-auto animate-scaleUp">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">MedGuard AI — Platform Guide</h2>
              <p className="text-xs text-slate-400">Cognizant Hackathon Use Case: Predicting Medical Equipment Failure</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Product Workflow: 5 Steps */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Core Product Story</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-center text-xs">
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-cyan-400 font-bold block mb-1">1. MONITOR</span>
              <p className="text-[11px] text-slate-400">Track device inventory & safety history</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-cyan-400 font-bold block mb-1">2. IDENTIFY</span>
              <p className="text-[11px] text-slate-400">Flag high & critical risk equipment</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-cyan-400 font-bold block mb-1">3. INVESTIGATE</span>
              <p className="text-[11px] text-slate-400">Analyze recalls & malfunction patterns</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-cyan-400 font-bold block mb-1">4. EXPLAIN</span>
              <p className="text-[11px] text-slate-400">Understand model-derived SHAP factors</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-cyan-400 font-bold block mb-1">5. ACT</span>
              <p className="text-[11px] text-slate-400">Prioritize preventive inspection & review</p>
            </div>
          </div>
        </div>

        {/* Dataset Context */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
          <strong className="text-slate-200 font-bold block">Cognizant Dataset Alignment:</strong>
          <p className="text-slate-300 leading-relaxed">
            This platform is built around historical medical-device safety events, recalls, malfunctions, field safety notices, device specifications, and manufacturer risk patterns (Kaggle: <em>Faulty Medical Devices Global Dataset</em>).
          </p>
          <p className="text-slate-400 text-[11px]">
            Model predictions represent statistical failure probabilities derived from historical event logs and manufacturer fault distributions.
          </p>
        </div>

        {/* Risk Color Legend */}
        <div className="space-y-2 text-xs">
          <h4 className="font-bold text-slate-300">Risk Classifications</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <div>
                <strong className="block text-[11px]">LOW (0-29%)</strong>
                <span className="text-[10px] text-slate-400">Routine monitoring</span>
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <div>
                <strong className="block text-[11px]">MEDIUM (30-69%)</strong>
                <span className="text-[10px] text-slate-400">Schedule review</span>
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-400 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <div>
                <strong className="block text-[11px]">HIGH (70-84%)</strong>
                <span className="text-[10px] text-slate-400">Preventive inspection</span>
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 animate-pulse" />
              <div>
                <strong className="block text-[11px]">CRITICAL (85-100%)</strong>
                <span className="text-[10px] text-slate-400">Immediate review</span>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
          <strong className="text-amber-400 block mb-1">Important System Disclaimer:</strong>
          MedGuard AI is a medical equipment risk intelligence and predictive maintenance management system. It does NOT provide patient clinical diagnosis, treatment recommendations, or live patient monitoring.
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300"
          >
            Got it, Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
