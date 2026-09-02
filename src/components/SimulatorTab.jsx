import React, { useState } from 'react';
import { 
  Sparkles, 
  Sliders, 
  RotateCcw, 
  ShieldAlert, 
  Activity, 
  Flame, 
  Zap, 
  Gauge, 
  Cpu, 
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

export default function SimulatorTab({ devices, onApplySimulatedState }) {
  const [selectedDeviceId, setSelectedDeviceId] = useState(devices[0].id);
  const targetDevice = devices.find(d => d.id === selectedDeviceId) || devices[0];

  // Simulator Sliders State
  const [temp, setTemp] = useState(targetDevice.telemetry.temperature);
  const [vibration, setVibration] = useState(targetDevice.telemetry.vibration);
  const [pressure, setPressure] = useState(targetDevice.telemetry.pressure);
  const [voltage, setVoltage] = useState(targetDevice.telemetry.voltage);
  const [rpm, setRpm] = useState(targetDevice.telemetry.rpm);

  // Sync state when selected device changes
  const handleDeviceChange = (id) => {
    setSelectedDeviceId(id);
    const d = devices.find(x => x.id === id);
    if (d) {
      setTemp(d.telemetry.temperature);
      setVibration(d.telemetry.vibration);
      setPressure(d.telemetry.pressure);
      setVoltage(d.telemetry.voltage);
      setRpm(d.telemetry.rpm);
    }
  };

  // Dynamic calculation of risk score based on parameter deviations
  const tempDev = Math.max(0, (temp - targetDevice.nominal.temperature) / targetDevice.nominal.temperature);
  const vibDev = Math.max(0, (vibration - targetDevice.nominal.vibration) / targetDevice.nominal.vibration);
  const pressDev = Math.max(0, Math.abs(pressure - targetDevice.nominal.pressure) / targetDevice.nominal.pressure);
  const voltDev = Math.max(0, Math.abs(voltage - targetDevice.nominal.voltage) / targetDevice.nominal.voltage);

  const computedRisk = Math.min(99, Math.max(5, Math.round(
    (tempDev * 35) + (vibDev * 40) + (pressDev * 15) + (voltDev * 10) + 10
  )));

  const computedRul = Math.max(2.0, parseFloat((120 - (computedRisk * 1.15)).toFixed(1)));
  const computedStatus = computedRisk >= 75 ? 'CRITICAL' : computedRisk >= 45 ? 'WARNING' : 'HEALTHY';

  // Instant Scenario Presets
  const applyPreset = (presetName) => {
    if (presetName === 'ct_overheat') {
      setTemp(92.4);
      setVibration(5.4);
      setPressure(24.1);
      setVoltage(420.0);
    } else if (presetName === 'valve_leak') {
      setTemp(52.0);
      setVibration(3.8);
      setPressure(16.5);
      setVoltage(118.0);
    } else if (presetName === 'battery_sag') {
      setTemp(48.2);
      setVibration(2.4);
      setPressure(18.0);
      setVoltage(11.2);
    } else if (presetName === 'baseline') {
      setTemp(targetDevice.nominal.temperature);
      setVibration(targetDevice.nominal.vibration);
      setPressure(targetDevice.nominal.pressure);
      setVoltage(targetDevice.nominal.voltage);
      setRpm(targetDevice.nominal.rpm);
    }
  };

  // Generated preview wave data based on simulated slider values
  const simulatedChartData = Array.from({ length: 20 }, (_, i) => {
    const noise = Math.sin(i * 0.6) * (computedRisk > 60 ? 2.2 : 0.5);
    return {
      time: `${i * 3}s`,
      SimulatedTemp: parseFloat((temp + noise * 1.1).toFixed(2)),
      SimulatedVib: parseFloat((vibration + noise * 0.25).toFixed(2)),
      SimulatedPress: parseFloat((pressure - noise * 0.4).toFixed(2)),
      TempThreshold: targetDevice.nominal.temperature * 1.35
    };
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Simulator Banner */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
            AI Stress Test & Scenario Generator
          </span>
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mt-0.5">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            Interactive Failure Simulator
          </h2>
        </div>

        {/* Target Device Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-400">Target Device:</label>
          <select
            value={selectedDeviceId}
            onChange={(e) => handleDeviceChange(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-100 text-xs font-bold px-3 py-2 rounded-xl focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            {devices.map(d => (
              <option key={d.id} value={d.id} className="bg-slate-900 text-slate-100">
                {d.name} ({d.wing})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Preset Anomaly Trigger Buttons */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Zap className="w-4 h-4 text-cyan-400" /> Instant Hackathon Anomaly Presets
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => applyPreset('ct_overheat')}
            className="p-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-left transition flex items-center gap-2.5"
          >
            <Flame className="w-5 h-5 text-rose-400 shrink-0" />
            <div>
              <strong className="text-xs font-bold block">CT Tube Overheat</strong>
              <span className="text-[10px] text-slate-400">Temp &gt; 90°C & Vib spike</span>
            </div>
          </button>

          <button
            onClick={() => applyPreset('valve_leak')}
            className="p-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-left transition flex items-center gap-2.5"
          >
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <strong className="text-xs font-bold block">Valve Pressure Drop</strong>
              <span className="text-[10px] text-slate-400">Pressure drop &lt; 18 PSI</span>
            </div>
          </button>

          <button
            onClick={() => applyPreset('battery_sag')}
            className="p-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-left transition flex items-center gap-2.5"
          >
            <Gauge className="w-5 h-5 text-cyan-400 shrink-0" />
            <div>
              <strong className="text-xs font-bold block">Power Supply Sag</strong>
              <span className="text-[10px] text-slate-400">Voltage drop & low RPM</span>
            </div>
          </button>

          <button
            onClick={() => applyPreset('baseline')}
            className="p-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-left transition flex items-center gap-2.5"
          >
            <RotateCcw className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <strong className="text-xs font-bold block">Reset to Baseline</strong>
              <span className="text-[10px] text-slate-400">Nominal healthy state</span>
            </div>
          </button>
        </div>
      </div>

      {/* Main Grid: Telemetry Sliders + Real-Time Prediction Outcome */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Interactive Telemetry Sliders (2 Cols) */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            Sensor Parameter Sliders
          </h3>

          <div className="space-y-4">
            
            {/* Slider 1: Temperature */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-200">Thermal Temperature (°C)</span>
                <span className="font-mono font-bold text-cyan-400">{temp}°C (Nominal: {targetDevice.nominal.temperature}°C)</span>
              </div>
              <input
                type="range"
                min="20"
                max="110"
                step="0.5"
                value={temp}
                onChange={(e) => setTemp(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* Slider 2: Vibration RMS */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-200">Vibration RMS (mm/s)</span>
                <span className="font-mono font-bold text-cyan-400">{vibration} mm/s (Nominal: {targetDevice.nominal.vibration} mm/s)</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="8.0"
                step="0.05"
                value={vibration}
                onChange={(e) => setVibration(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* Slider 3: Pressure */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-200">Operating Coolant/Air Pressure (PSI)</span>
                <span className="font-mono font-bold text-cyan-400">{pressure} PSI (Nominal: {targetDevice.nominal.pressure} PSI)</span>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                step="0.5"
                value={pressure}
                onChange={(e) => setPressure(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* Slider 4: Power Voltage */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-200">Power Input Voltage (V)</span>
                <span className="font-mono font-bold text-cyan-400">{voltage} V (Nominal: {targetDevice.nominal.voltage} V)</span>
              </div>
              <input
                type="range"
                min="10"
                max="450"
                step="1"
                value={voltage}
                onChange={(e) => setVoltage(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

          </div>
        </div>

        {/* Real-time Computed Failure Risk Outcome (1 Col) */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              Live AI Inference
            </h3>
            <p className="text-xs text-slate-400">
              Real-time inference calculated by model from simulated sliders
            </p>

            <div className="my-6 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 text-center space-y-3">
              <span className="text-xs uppercase font-bold text-slate-400">Calculated Risk Score</span>
              
              <div className={`text-5xl font-black ${
                computedStatus === 'CRITICAL' ? 'text-rose-400' : computedStatus === 'WARNING' ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {computedRisk}%
              </div>

              <span className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold border uppercase tracking-wider ${
                computedStatus === 'CRITICAL' 
                  ? 'bg-rose-500/20 border-rose-500/50 text-rose-400 pulse-critical' 
                  : computedStatus === 'WARNING' 
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-400 pulse-warning' 
                  : 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
              }`}>
                {computedStatus}
              </span>

              <div className="pt-2 border-t border-slate-800 text-xs text-slate-300">
                Estimated RUL: <strong className="text-white font-bold">{computedRul} Hours</strong>
              </div>
            </div>
          </div>

          <button
            onClick={() => onApplySimulatedState(targetDevice.id, computedRisk, computedRul, computedStatus, { temp, vibration, pressure, voltage })}
            className="w-full py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition"
          >
            <CheckCircle2 className="w-4 h-4" /> Push Simulated State to Dashboard
          </button>
        </div>

      </div>

      {/* Real-time Simulated Telemetry Waveform Preview */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          Simulated Telemetry Waveform Output
        </h3>

        <div className="h-60 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={simulatedChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line type="monotone" dataKey="SimulatedTemp" stroke="#f43f5e" strokeWidth={2} name="Simulated Temp (°C)" />
              <Line type="monotone" dataKey="SimulatedVib" stroke="#06b6d4" strokeWidth={2} name="Simulated Vibration (mm/s)" />
              <Line type="monotone" dataKey="SimulatedPress" stroke="#f59e0b" strokeWidth={2} name="Simulated Pressure (PSI)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
