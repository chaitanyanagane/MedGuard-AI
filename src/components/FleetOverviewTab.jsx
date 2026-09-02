import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Activity, 
  Clock, 
  DollarSign, 
  Zap, 
  Eye, 
  ChevronRight, 
  Radio, 
  Filter, 
  CheckCircle2, 
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { generateWaveformData } from '../data/medicalDevices';

export default function FleetOverviewTab({ 
  devices, 
  selectedWing, 
  onSelectDevice, 
  onNavigateToXAI,
  onNavigateToDispatch
}) {
  const filteredDevices = selectedWing === "All Wings" 
    ? devices 
    : devices.filter(d => d.wing === selectedWing);

  const criticalList = filteredDevices.filter(d => d.status === 'CRITICAL');
  const warningList = filteredDevices.filter(d => d.status === 'WARNING');
  const healthyList = filteredDevices.filter(d => d.status === 'HEALTHY');

  // Currently focused device for live telemetry waveform
  const [telemetryDevice, setTelemetryDevice] = useState(devices[0]);
  const [waveData, setWaveData] = useState(() => generateWaveformData(devices[0]));
  const [isLiveStream, setIsLiveStream] = useState(true);

  useEffect(() => {
    setWaveData(generateWaveformData(telemetryDevice));
  }, [telemetryDevice]);

  // Live real-time tick simulator for sensor stream
  useEffect(() => {
    if (!isLiveStream) return;
    const interval = setInterval(() => {
      setWaveData(prev => {
        const nextTime = (prev.length * 2) + 's';
        const lastTemp = prev[prev.length - 1]?.Temperature || telemetryDevice.telemetry.temperature;
        const lastVib = prev[prev.length - 1]?.Vibration || telemetryDevice.telemetry.vibration;
        const lastPress = prev[prev.length - 1]?.Pressure || telemetryDevice.telemetry.pressure;

        const isCrit = telemetryDevice.status === 'CRITICAL';
        const jitter = (Math.random() - 0.48) * (isCrit ? 2.5 : 0.4);

        const newPoint = {
          time: nextTime,
          Temperature: parseFloat(Math.max(20, lastTemp + jitter * 0.8).toFixed(2)),
          Vibration: parseFloat(Math.max(0.1, lastVib + jitter * 0.2).toFixed(2)),
          Pressure: parseFloat(Math.max(5, lastPress - jitter * 0.3).toFixed(2)),
          ThresholdTemp: telemetryDevice.nominal.temperature * 1.35,
          ThresholdVib: telemetryDevice.nominal.vibration * 3.0
        };

        const updated = [...prev.slice(1), newPoint];
        return updated;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [isLiveStream, telemetryDevice]);

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Assets Monitored</p>
              <h3 className="text-3xl font-extrabold text-white mt-1">142 <span className="text-xs font-normal text-cyan-400">/ 142 Telemetry Live</span></h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs text-slate-400">
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% Sensors Active
            </span>
            <span className="mx-2">•</span>
            <span>4 Hospital Wings</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl group-hover:bg-rose-500/10 transition" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Critical Failure Risks</p>
              <h3 className="text-3xl font-extrabold text-rose-400 mt-1">{criticalList.length} <span className="text-xs font-normal text-slate-400">Urgent Devices</span></h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-6 h-6 animate-bounce" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs text-slate-400">
            <span className="text-rose-400 font-semibold">Action SLA &lt; 2h</span>
            <span className="mx-2">•</span>
            <span>Immediate Tech Dispatch</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Avg Remaining Life (RUL)</p>
              <h3 className="text-3xl font-extrabold text-amber-400 mt-1">42.8 <span className="text-xs font-normal text-slate-400">Hours (High Risk)</span></h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs text-slate-400">
            <span className="text-amber-400 font-semibold">95% Confidence Bounds</span>
            <span className="mx-2">•</span>
            <span>AI Predictive Horizon</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Saved Financial Downtime</p>
              <h3 className="text-3xl font-extrabold text-emerald-400 mt-1">$485,000 <span className="text-xs font-normal text-slate-400">YTD</span></h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs text-slate-400">
            <span className="text-emerald-400 font-semibold">34 Unscheduled Surgeries Saved</span>
          </div>
        </div>

      </div>

      {/* Main Grid Section: Heatmap Matrix + Priority Alert List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Hospital Wing Risk Matrix Heatmap (2 Cols) */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Filter className="w-5 h-5 text-cyan-400" />
                Hospital Equipment Risk Heatmap Matrix
              </h2>
              <p className="text-xs text-slate-400">
                Real-time failure probability grid for monitored clinical assets in {selectedWing}
              </p>
            </div>
            <span className="text-xs px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-slate-400 font-medium">
              Showing {filteredDevices.length} Devices
            </span>
          </div>

          {/* Interactive Heatmap Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredDevices.map(device => {
              const isCrit = device.status === 'CRITICAL';
              const isWarn = device.status === 'WARNING';
              const isSelected = telemetryDevice.id === device.id;

              return (
                <div
                  key={device.id}
                  onClick={() => setTelemetryDevice(device)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 relative overflow-hidden ${
                    isSelected ? 'ring-2 ring-cyan-400 bg-slate-900/90' : 'glass-panel-hover'
                  } ${
                    isCrit 
                      ? 'border-rose-500/40 bg-rose-950/20' 
                      : isWarn 
                      ? 'border-amber-500/40 bg-amber-950/20' 
                      : 'border-slate-800/80 bg-slate-900/40'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {device.wing} • {device.room}
                      </span>
                      <h4 className="font-bold text-sm text-slate-100 mt-0.5 line-clamp-1">
                        {device.name}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {device.model}
                      </p>
                    </div>

                    {/* Status Badge */}
                    <span className={`px-2.5 py-1 text-[11px] font-extrabold rounded-lg uppercase tracking-wider border ${
                      isCrit 
                        ? 'bg-rose-500/20 border-rose-500/50 text-rose-400 pulse-critical' 
                        : isWarn 
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-400 pulse-warning' 
                        : 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                    }`}>
                      {device.riskScore}% RISK
                    </span>
                  </div>

                  {/* Failure Mode & RUL */}
                  <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      <span>RUL: <strong className={isCrit ? 'text-rose-400' : isWarn ? 'text-amber-400' : 'text-emerald-400'}>{device.rulHours}h</strong></span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectDevice(device);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                        title="View Full Technical Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigateToXAI(device);
                        }}
                        className="px-2 py-1 text-[11px] font-medium bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 rounded-lg flex items-center gap-1 transition"
                      >
                        XAI Breakdown <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority Urgent Alert Queue (1 Col) */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-white flex items-center gap-2 text-base">
                <ShieldAlert className="w-5 h-5 text-rose-400" />
                Urgent Failure Queue
              </h3>
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-rose-400 px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/30">
                Action Required
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              AI model predicted imminent failure within next 48-72 hours.
            </p>

            <div className="space-y-3">
              {filteredDevices
                .filter(d => d.status !== 'HEALTHY')
                .sort((a, b) => b.riskScore - a.riskScore)
                .map(device => {
                  const isCrit = device.status === 'CRITICAL';
                  return (
                    <div 
                      key={device.id}
                      className={`p-3.5 rounded-xl border ${
                        isCrit ? 'border-rose-500/40 bg-rose-950/20' : 'border-amber-500/40 bg-amber-950/20'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h5 className="font-bold text-xs text-slate-100">{device.name}</h5>
                          <p className="text-[11px] text-slate-400 mt-0.5">{device.wing}</p>
                        </div>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                          isCrit ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {device.riskScore}% RISK
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                        <strong className="text-slate-400">Cause:</strong> {device.failureMode}
                      </p>

                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400 font-semibold">
                          Est Failure: <span className="text-white">{device.predictedFailureDate}</span>
                        </span>
                        <button
                          onClick={() => onNavigateToDispatch(device)}
                          className="px-2.5 py-1 text-[11px] font-bold bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 rounded-lg flex items-center gap-1 transition"
                        >
                          <Zap className="w-3 h-3" /> Dispatch Tech
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
            <p className="text-xs text-slate-400">
              ⚡ Automated work orders are dispatched based on FDA ISO-13485 biomedical triage rules.
            </p>
          </div>
        </div>

      </div>

      {/* Real-time Dynamic Telemetry Stream Section */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              <h3 className="text-lg font-bold text-white">
                Live Telemetry Stream: <span className="text-cyan-400">{telemetryDevice.name}</span>
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Sensor feeds: Temperature (°C), Vibration (mm/s RMS), & Coolant/Air Pressure (PSI)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsLiveStream(!isLiveStream)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition ${
                isLiveStream
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                  : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
              }`}
            >
              {isLiveStream ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isLiveStream ? 'Pause Telemetry' : 'Resume Telemetry'}
            </button>

            <button
              onClick={() => setWaveData(generateWaveformData(telemetryDevice))}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
              title="Reset Waveform Stream"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Recharts Waveform Stream */}
        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={waveData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f172a', 
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#f8fafc',
                  fontSize: '12px'
                }} 
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
              <Line 
                type="monotone" 
                dataKey="Temperature" 
                stroke="#f43f5e" 
                strokeWidth={2} 
                dot={false}
                activeDot={{ r: 6 }} 
              />
              <Line 
                type="monotone" 
                dataKey="Vibration" 
                stroke="#06b6d4" 
                strokeWidth={2} 
                dot={false} 
              />
              <Line 
                type="monotone" 
                dataKey="Pressure" 
                stroke="#f59e0b" 
                strokeWidth={2} 
                dot={false} 
              />
              <Line 
                type="step" 
                dataKey="ThresholdTemp" 
                stroke="#e11d48" 
                strokeDasharray="4 4" 
                strokeWidth={1.5}
                name="Temp Safety Threshold"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
