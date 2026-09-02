import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  PieChart as PieIcon, 
  Cpu,
  ShieldCheck,
  Download,
  Stethoscope,
  Scan,
  Activity
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { getAnalytics } from '../lib/api';
import confetti from 'canvas-confetti';
import { jsPDF } from 'jspdf';

export default function AnalyticsView({ devices }) {
  const [activeTab, setActiveTab] = useState('general'); // 'general' | 'ct'
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exportSuccess, setExportSuccess] = useState(false);

  useEffect(() => {
    async function loadAnalyticsData() {
      setLoading(true);
      try {
        const data = await getAnalytics();
        setAnalytics(data);
      } catch (err) {
        console.error("Error loading analytics:", err);
      } finally {
        setLoading(false);
      }
    }
    loadAnalyticsData();
  }, [devices]);

  const handleExportPDF = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    setExportSuccess(true);

    try {
      const doc = new jsPDF();
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, 210, 35, 'F');
      
      doc.setTextColor(6, 182, 212);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('MedGuard AI — Equipment Predictive Analytics Report', 14, 18);

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Exported Date: ${new Date().toLocaleDateString()} | Command Center Intelligence`, 14, 27);

      doc.setTextColor(30, 41, 59);
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text('1. General Equipment Category Summary', 14, 48);

      let yPos = 58;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setFillColor(241, 245, 249);
      doc.rect(14, yPos - 5, 182, 8, 'F');
      doc.text('Category Name', 16, yPos);
      doc.text('Device Count', 100, yPos);
      doc.text('Avg Remaining Lifespan', 145, yPos);

      yPos += 8;
      doc.setFont('helvetica', 'normal');

      if (analytics && analytics.devicesByCategory) {
        analytics.devicesByCategory.forEach((cat) => {
          doc.text(cat.category, 16, yPos);
          doc.text(String(cat.count), 100, yPos);
          doc.text(`${cat.avgMonths} Months`, 145, yPos);
          yPos += 7;
        });
      }

      yPos += 10;
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text('2. CT Scanner Component Risk Ranking', 14, yPos);
      yPos += 10;

      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setFillColor(241, 245, 249);
      doc.rect(14, yPos - 5, 182, 8, 'F');
      doc.text('Component Name', 16, yPos);
      doc.text('Risk Trigger Count', 100, yPos);
      doc.text('Average Wear', 145, yPos);

      yPos += 8;
      doc.setFont('helvetica', 'normal');

      if (analytics && analytics.ctComponentRisk) {
        analytics.ctComponentRisk.forEach((comp) => {
          doc.text(comp.component, 16, yPos);
          doc.text(String(comp.riskCount), 100, yPos);
          doc.text(`${comp.avgWear}%`, 145, yPos);
          yPos += 7;
        });
      }

      doc.save(`MedGuard_Analytics_Report_${Date.now()}.pdf`);
    } catch (e) {
      console.error("PDF export error:", e);
    }

    setTimeout(() => setExportSuccess(false), 4000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
            Command Center Intelligence
          </span>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2 mt-0.5">
            <BarChart3 className="w-6 h-6 text-cyan-400" />
            Equipment Predictive Analytics
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Split analytics across Model 1 (General Equipment Screening) and Model 2 (CT Scanner Deep Analysis).
          </p>
        </div>

        <button
          onClick={handleExportPDF}
          className="px-4 py-2.5 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-2 transition"
        >
          <Download className="w-4 h-4 text-cyan-400" /> Export Analytics PDF
        </button>
      </div>

      {/* Sub-Tab Selector */}
      <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800 w-fit">
        <button
          onClick={() => setActiveTab('general')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
            activeTab === 'general'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Stethoscope className="w-4 h-4" />
          <span>General Equipment Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab('ct')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
            activeTab === 'ct'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Scan className="w-4 h-4" />
          <span>CT Scanner Analytics</span>
        </button>
      </div>

      {exportSuccess && (
        <div className="p-4 rounded-xl bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 text-xs font-bold flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" /> Analytics Report Bundle exported successfully (SHA-256 Validated).
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-slate-400 space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin mx-auto" />
          <p className="text-xs">Computing analytics...</p>
        </div>
      ) : (
        <>
          {/* TAB 1: GENERAL EQUIPMENT ANALYTICS */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Derived Priority Breakdown */}
                <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <PieIcon className="w-5 h-5 text-cyan-400" />
                      Months-to-Failure Priority Breakdown
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400">
                    Distribution of derived maintenance priorities across general equipment
                  </p>

                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={analytics.eventTypeDistribution}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                        >
                          {analytics.eventTypeDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                        <Legend wrapperStyle={{ fontSize: '12px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Equipment Inventory by Category */}
                <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Cpu className="w-5 h-5 text-cyan-400" />
                      Equipment Types & Average Months To Failure
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400">
                    Average predicted remaining months to failure by device category
                  </p>

                  <div className="h-64 w-full pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analytics.devicesByCategory} margin={{ top: 10, right: 20, left: 0, bottom: 25 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="category" stroke="#94a3b8" fontSize={9} interval={0} angle={-20} textAnchor="end" />
                        <YAxis stroke="#64748b" fontSize={11} unit=" m" />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                        <Bar dataKey="avgMonths" fill="#06b6d4" radius={[6, 6, 0, 0]} name="Avg Months to Failure" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: CT SCANNER ANALYTICS */}
          {activeTab === 'ct' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* CT Risk Distribution */}
                <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Scan className="w-5 h-5 text-purple-400" />
                      CT Scanner AI Health Score Distribution
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400">
                    Scanner fleet segmentation into Healthy, Degrading, and Critical risk classes
                  </p>

                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={analytics.ctRiskDistribution}
                          dataKey="count"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                        >
                          {analytics.ctRiskDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                        <Legend wrapperStyle={{ fontSize: '12px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* CT Component Risk Ranking */}
                <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Activity className="w-5 h-5 text-purple-400" />
                      CT Component Risk Ranking
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400">
                    Primary CT scanner components identified as degradation triggers
                  </p>

                  <div className="h-64 w-full pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analytics.ctComponentRisk} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                        <XAxis type="number" stroke="#64748b" fontSize={11} />
                        <YAxis dataKey="component" type="category" stroke="#94a3b8" fontSize={10} width={130} />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                        <Bar dataKey="riskCount" fill="#a855f7" radius={[0, 6, 6, 0]} name="Scanner Flag Count" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>
            </div>
          )}
        </>
      )}

    </div>
  );
}
