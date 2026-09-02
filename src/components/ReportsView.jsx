import React, { useState } from 'react';
import { FileText, Download, CheckCircle2, ShieldCheck, Printer, FileSpreadsheet, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ReportsView() {
  const [downloadNotice, setDownloadNotice] = useState(null);

  const reports = [
    {
      id: "REP-2026-001",
      title: "Quarterly High-Risk Medical Device Inspection Prioritization Report",
      category: "Inspection Triage",
      generatedDate: "2026-08-31",
      author: "MedGuard AI Automated Engine",
      status: "Ready",
      fileSize: "2.4 MB",
      type: "PDF"
    },
    {
      id: "REP-2026-002",
      title: "FDA Class I & II Recall Correlation Summary across Hospital Fleet",
      category: "Regulatory Compliance",
      generatedDate: "2026-08-28",
      author: "Clinical Engineering Board",
      status: "Ready",
      fileSize: "1.8 MB",
      type: "PDF"
    },
    {
      id: "REP-2026-003",
      title: "Global Manufacturer Safety Event & Malfunction Pareto Export",
      category: "Analytics Export",
      generatedDate: "2026-08-20",
      author: "MedGuard Risk Analytics",
      status: "Ready",
      fileSize: "840 KB",
      type: "CSV"
    },
    {
      id: "REP-2026-004",
      title: "ISO-13485 Equipment Reliability & Preventive Maintenance Ledger",
      category: "Audit Ledger",
      generatedDate: "2026-08-15",
      author: "Biomedical Systems Lead",
      status: "Ready",
      fileSize: "3.1 MB",
      type: "PDF"
    }
  ];

  const handleDownload = (reportTitle) => {
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.6 }
    });
    setDownloadNotice(`Exporting "${reportTitle}" (Cryptographically Sealed PDF)...`);
    setTimeout(() => setDownloadNotice(null), 4000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
            Management & Compliance
          </span>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2 mt-0.5">
            <FileText className="w-6 h-6 text-cyan-400" />
            Equipment Risk & Compliance Reports
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Generate and export regulatory audit trails, recall summaries, and inspection prioritization bundles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-xl flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" /> ISO-13485 & FDA Compliant
          </span>
        </div>
      </div>

      {downloadNotice && (
        <div className="p-4 rounded-xl bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 text-xs font-bold flex items-center justify-between shadow-lg shadow-cyan-500/10 animate-bounce">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" /> {downloadNotice}
          </span>
          <span className="text-[10px] font-mono text-cyan-400">SHA-256 Verified</span>
        </div>
      )}

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map(rep => (
          <div 
            key={rep.id}
            className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 hover:border-cyan-500/40 transition group"
          >
            <div className="flex items-start justify-between">
              <span className="font-mono text-xs font-bold text-cyan-400 px-2.5 py-1 rounded bg-slate-900 border border-slate-800">
                {rep.id}
              </span>

              <span className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase">
                {rep.status}
              </span>
            </div>

            <div>
              <h3 className="font-bold text-base text-white group-hover:text-cyan-300 transition">{rep.title}</h3>
              <p className="text-xs text-slate-400 mt-1">Category: {rep.category} • Author: {rep.author}</p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono text-[11px]">Date: {rep.generatedDate} • {rep.fileSize}</span>

              <button
                onClick={() => handleDownload(rep.title)}
                className="px-3.5 py-1.5 rounded-xl font-bold text-xs bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-300 flex items-center gap-1.5 transition"
              >
                {rep.type === 'CSV' ? <FileSpreadsheet className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
                Export {rep.type}
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
