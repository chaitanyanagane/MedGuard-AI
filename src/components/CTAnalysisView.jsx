import React, { useState, useEffect } from 'react';
import { 
  Scan, 
  Sliders, 
  Upload, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Cpu, 
  Zap, 
  Activity, 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  Info,
  RefreshCw,
  Sparkles,
  Thermometer,
  Wind,
  Layers,
  ShieldAlert
} from 'lucide-react';
import { predictCTScanner, uploadCTTelemetry, getCTOptions } from '../lib/api';

export default function CTAnalysisView({ onSaveToHistory }) {
  const [activeMode, setActiveMode] = useState('manual'); // 'manual' | 'upload'
  const [scannerId, setScannerId] = useState('CT-017');
  const [scannerIds, setScannerIds] = useState(['CT-004', 'CT-017', 'CT-029', 'CT-042', 'CT-058']);
  const [scenarios, setScenarios] = useState(null);

  // Manual Form State
  const [inputs, setInputs] = useState({
    ScannerAge: 6.8,
    OperatingHours: 15400,
    ScansPerformed: 48200,
    DaysSinceMaintenance: 85,
    TubeWear: 68.0,
    HeatLoad: 72.0,
    TubeArcs: 8,
    FilamentCurrent: 5.1,
    FocalSpotDrift: 0.58,
    GantryVibration: 0.42,
    BearingTemperature: 58.0,
    DetectorTemperature: 32.0,
    DetectorDropouts: 6,
    SNR: 27.5,
    CoolantFlow: 4.8,
    CoolantTemperature: 41.0,
    ChillerCycles: 115,
    Voltage: 394.0,
    UPSHealth: 82.0,
    WarningCodes: 9,
    ErrorCodes: 3
  });

  // Collapsible Sections
  const [collapsedSections, setCollapsedSections] = useState({
    machine: false,
    tube: false,
    mechanical: false,
    detector: true,
    cooling: true,
    power: true,
    errors: true
  });

  // Upload state
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadPreview, setUploadPreview] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  // Results state
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadOptions() {
      const opts = await getCTOptions();
      if (opts.scanner_ids) setScannerIds(opts.scanner_ids);
      if (opts.scenarios) setScenarios(opts.scenarios);
    }
    loadOptions();
  }, []);

  const toggleSection = (key) => {
    setCollapsedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleInputChange = (field, val) => {
    setInputs(prev => ({ ...prev, [field]: parseFloat(val) || 0 }));
  };

  const handleApplyPreset = (presetName) => {
    if (scenarios && scenarios[presetName]) {
      setInputs(scenarios[presetName]);
    } else {
      if (presetName === 'healthy') {
        setInputs({
          ScannerAge: 2.5, OperatingHours: 4200, ScansPerformed: 14500, DaysSinceMaintenance: 24,
          TubeWear: 22.0, HeatLoad: 35.0, TubeArcs: 1, FilamentCurrent: 4.3, FocalSpotDrift: 0.12,
          GantryVibration: 0.08, BearingTemperature: 38.0, DetectorTemperature: 24.5, DetectorDropouts: 1,
          SNR: 38.5, CoolantFlow: 7.8, CoolantTemperature: 28.0, ChillerCycles: 45, Voltage: 402.0,
          UPSHealth: 98.0, WarningCodes: 1, ErrorCodes: 0
        });
      } else if (presetName === 'degrading') {
        setInputs({
          ScannerAge: 6.8, OperatingHours: 15400, ScansPerformed: 48200, DaysSinceMaintenance: 85,
          TubeWear: 68.0, HeatLoad: 72.0, TubeArcs: 8, FilamentCurrent: 5.1, FocalSpotDrift: 0.58,
          GantryVibration: 0.42, BearingTemperature: 58.0, DetectorTemperature: 32.0, DetectorDropouts: 6,
          SNR: 27.5, CoolantFlow: 4.8, CoolantTemperature: 41.0, ChillerCycles: 115, Voltage: 394.0,
          UPSHealth: 82.0, WarningCodes: 9, ErrorCodes: 3
        });
      } else if (presetName === 'critical') {
        setInputs({
          ScannerAge: 9.5, OperatingHours: 24800, ScansPerformed: 82000, DaysSinceMaintenance: 160,
          TubeWear: 89.0, HeatLoad: 92.0, TubeArcs: 24, FilamentCurrent: 5.7, FocalSpotDrift: 1.25,
          GantryVibration: 1.15, BearingTemperature: 78.5, DetectorTemperature: 39.8, DetectorDropouts: 14,
          SNR: 18.2, CoolantFlow: 2.1, CoolantTemperature: 54.0, ChillerCycles: 168, Voltage: 372.0,
          UPSHealth: 64.0, WarningCodes: 22, ErrorCodes: 11
        });
      }
    }
  };

  const handleManualAnalyze = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = { ScannerId: scannerId, ...inputs };
      const res = await predictCTScanner(payload);
      setResult(res);

      if (onSaveToHistory) {
        onSaveToHistory({
          id: `PRED-CT-${Date.now()}`,
          scanner_id: res.scanner_id,
          analysisType: 'CT Scanner Analysis',
          result: `${res.health_score} / 100 Health Score`,
          priority: res.risk_level,
          rul: `${res.rul_days} Days RUL`,
          date: new Date().toLocaleString()
        });
      }
    } catch (err) {
      setError(err.message || "Failed to analyze CT scanner telemetry.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (file) => {
    if (!file || !file.name.endsWith('.csv')) {
      setUploadError("Please select a valid CSV telemetry file.");
      return;
    }
    setUploadedFile(file);
    setUploadError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split('\n').filter(l => l.trim());
      if (lines.length > 1) {
        const headers = lines[0].split(',');
        const firstRow = lines[1].split(',');
        setUploadPreview({ headers, values: firstRow });
      }
    };
    reader.readAsText(file);
  };

  const handleUploadAnalyze = async () => {
    if (!uploadedFile) return;
    setLoading(true);
    setError(null);
    try {
      const res = await uploadCTTelemetry(uploadedFile);
      setResult(res);

      if (onSaveToHistory) {
        onSaveToHistory({
          id: `PRED-CT-${Date.now()}`,
          scanner_id: res.scanner_id,
          analysisType: 'CT Scanner Analysis (Telemetry Upload)',
          result: `${res.health_score} / 100 Health Score`,
          priority: res.risk_level,
          rul: `${res.rul_days} Days RUL`,
          date: new Date().toLocaleString()
        });
      }
    } catch (err) {
      setError(err.message || "Failed to process CSV file.");
    } finally {
      setLoading(false);
    }
  };

  const getRiskBadgeColor = (level) => {
    switch (level) {
      case 'CRITICAL': return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'HIGH': return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      case 'MEDIUM': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      default: return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/30 uppercase tracking-wider">
                Model 2 — CT Scanner Analysis
              </span>
              <span className="text-xs text-slate-400 font-mono">Deep AI Diagnostic Layer</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white mt-1 tracking-tight">
              CT Scanner Health Assessment
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Analyze the current condition of an individual CT scanner and identify potential failure risk from operational telemetry.
            </p>
          </div>

          {/* Scanner ID Selector */}
          <div className="flex items-center gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <Scan className="w-5 h-5 text-purple-400" />
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 block">Target CT Scanner ID</label>
              <select
                value={scannerId}
                onChange={(e) => setScannerId(e.target.value)}
                className="bg-transparent text-white font-mono font-bold text-sm outline-none cursor-pointer"
              >
                {scannerIds.map(id => (
                  <option key={id} value={id} className="bg-slate-900 text-white">{id} — Revolution Apex CT</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Input Mode Selector & Demo Presets */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-4 rounded-2xl border border-slate-800">
        
        {/* Mode Switcher Tabs */}
        <div className="flex items-center gap-1 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800 w-full sm:w-auto">
          <button
            onClick={() => setActiveMode('manual')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
              activeMode === 'manual'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Manual Assessment</span>
          </button>

          <button
            onClick={() => setActiveMode('upload')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
              activeMode === 'upload'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload Telemetry</span>
          </button>
        </div>

        {/* Demo Presets (Only in manual mode) */}
        {activeMode === 'manual' && (
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            <span className="text-xs text-slate-400 font-semibold whitespace-nowrap">Demo Presets:</span>
            <button
              onClick={() => handleApplyPreset('healthy')}
              className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-500/20 transition flex items-center gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Healthy
            </button>
            <button
              onClick={() => handleApplyPreset('degrading')}
              className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold hover:bg-amber-500/20 transition flex items-center gap-1"
            >
              <AlertTriangle className="w-3.5 h-3.5" /> Degrading
            </button>
            <button
              onClick={() => handleApplyPreset('critical')}
              className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs font-bold hover:bg-rose-500/20 transition flex items-center gap-1"
            >
              <ShieldAlert className="w-3.5 h-3.5" /> Critical
            </button>
          </div>
        )}
      </div>

      {/* MODE 1: MANUAL ASSESSMENT */}
      {activeMode === 'manual' && (
        <div className="space-y-4">
          
          {/* SECTION 1: MACHINE INFORMATION */}
          <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
            <button
              onClick={() => toggleSection('machine')}
              className="w-full p-4 flex items-center justify-between bg-slate-900/60 hover:bg-slate-900 text-left"
            >
              <div className="flex items-center gap-2.5">
                <Cpu className="w-5 h-5 text-purple-400" />
                <span className="font-bold text-white text-sm">Machine Information</span>
              </div>
              {collapsedSections.machine ? <ChevronDown className="w-5 h-5 text-slate-500" /> : <ChevronUp className="w-5 h-5 text-slate-500" />}
            </button>

            {!collapsedSections.machine && (
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400 font-medium">Scanner Age</span>
                    <span className="text-white font-mono font-bold">{inputs.ScannerAge} yrs</span>
                  </div>
                  <input type="range" min="0.5" max="15.0" step="0.1" value={inputs.ScannerAge} onChange={(e) => handleInputChange('ScannerAge', e.target.value)} className="w-full accent-purple-500" />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400 font-medium">Operating Hours</span>
                    <span className="text-white font-mono font-bold">{inputs.OperatingHours.toLocaleString()} hrs</span>
                  </div>
                  <input type="range" min="500" max="30000" step="100" value={inputs.OperatingHours} onChange={(e) => handleInputChange('OperatingHours', e.target.value)} className="w-full accent-purple-500" />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400 font-medium">Scans Performed</span>
                    <span className="text-white font-mono font-bold">{inputs.ScansPerformed.toLocaleString()}</span>
                  </div>
                  <input type="range" min="1000" max="100000" step="500" value={inputs.ScansPerformed} onChange={(e) => handleInputChange('ScansPerformed', e.target.value)} className="w-full accent-purple-500" />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400 font-medium">Days Since Maintenance</span>
                    <span className="text-white font-mono font-bold">{inputs.DaysSinceMaintenance} days</span>
                  </div>
                  <input type="range" min="1" max="180" step="1" value={inputs.DaysSinceMaintenance} onChange={(e) => handleInputChange('DaysSinceMaintenance', e.target.value)} className="w-full accent-purple-500" />
                </div>
              </div>
            )}
          </div>

          {/* SECTION 2: X-RAY TUBE */}
          <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
            <button
              onClick={() => toggleSection('tube')}
              className="w-full p-4 flex items-center justify-between bg-slate-900/60 hover:bg-slate-900 text-left"
            >
              <div className="flex items-center gap-2.5">
                <Zap className="w-5 h-5 text-amber-400" />
                <span className="font-bold text-white text-sm">X-Ray Tube Metrics</span>
              </div>
              {collapsedSections.tube ? <ChevronDown className="w-5 h-5 text-slate-500" /> : <ChevronUp className="w-5 h-5 text-slate-500" />}
            </button>

            {!collapsedSections.tube && (
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400 font-medium">Tube Wear</span>
                    <span className="text-amber-400 font-mono font-bold">{inputs.TubeWear}%</span>
                  </div>
                  <input type="range" min="5" max="98" step="1" value={inputs.TubeWear} onChange={(e) => handleInputChange('TubeWear', e.target.value)} className="w-full accent-amber-500" />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400 font-medium">Heat Load</span>
                    <span className="text-amber-400 font-mono font-bold">{inputs.HeatLoad}%</span>
                  </div>
                  <input type="range" min="10" max="99" step="1" value={inputs.HeatLoad} onChange={(e) => handleInputChange('HeatLoad', e.target.value)} className="w-full accent-amber-500" />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400 font-medium">Tube Arcs</span>
                    <span className="text-white font-mono font-bold">{inputs.TubeArcs} arcs/mo</span>
                  </div>
                  <input type="range" min="0" max="45" step="1" value={inputs.TubeArcs} onChange={(e) => handleInputChange('TubeArcs', e.target.value)} className="w-full accent-amber-500" />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400 font-medium">Filament Current</span>
                    <span className="text-white font-mono font-bold">{inputs.FilamentCurrent} A</span>
                  </div>
                  <input type="range" min="3.0" max="5.8" step="0.1" value={inputs.FilamentCurrent} onChange={(e) => handleInputChange('FilamentCurrent', e.target.value)} className="w-full accent-amber-500" />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400 font-medium">Focal Spot Drift</span>
                    <span className="text-white font-mono font-bold">{inputs.FocalSpotDrift} mm</span>
                  </div>
                  <input type="range" min="0.02" max="1.45" step="0.02" value={inputs.FocalSpotDrift} onChange={(e) => handleInputChange('FocalSpotDrift', e.target.value)} className="w-full accent-amber-500" />
                </div>
              </div>
            )}
          </div>

          {/* SECTION 3: MECHANICAL & GANTRY */}
          <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
            <button
              onClick={() => toggleSection('mechanical')}
              className="w-full p-4 flex items-center justify-between bg-slate-900/60 hover:bg-slate-900 text-left"
            >
              <div className="flex items-center gap-2.5">
                <Activity className="w-5 h-5 text-cyan-400" />
                <span className="font-bold text-white text-sm">Mechanical & Gantry Dynamics</span>
              </div>
              {collapsedSections.mechanical ? <ChevronDown className="w-5 h-5 text-slate-500" /> : <ChevronUp className="w-5 h-5 text-slate-500" />}
            </button>

            {!collapsedSections.mechanical && (
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400 font-medium">Gantry Vibration</span>
                    <span className="text-cyan-400 font-mono font-bold">{inputs.GantryVibration} g</span>
                  </div>
                  <input type="range" min="0.01" max="1.85" step="0.01" value={inputs.GantryVibration} onChange={(e) => handleInputChange('GantryVibration', e.target.value)} className="w-full accent-cyan-500" />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400 font-medium">Bearing Temperature</span>
                    <span className="text-cyan-400 font-mono font-bold">{inputs.BearingTemperature} °C</span>
                  </div>
                  <input type="range" min="22.0" max="85.0" step="0.5" value={inputs.BearingTemperature} onChange={(e) => handleInputChange('BearingTemperature', e.target.value)} className="w-full accent-cyan-500" />
                </div>
              </div>
            )}
          </div>

          {/* ADVANCED SECTIONS TOGGLERS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Detector */}
            <button
              onClick={() => toggleSection('detector')}
              className="p-3.5 glass-panel rounded-xl border border-slate-800 flex items-center justify-between text-xs font-bold text-slate-300 hover:text-white"
            >
              <span>Detector Array Parameters</span>
              {collapsedSections.detector ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronUp className="w-4 h-4 text-slate-500" />}
            </button>

            {/* Cooling */}
            <button
              onClick={() => toggleSection('cooling')}
              className="p-3.5 glass-panel rounded-xl border border-slate-800 flex items-center justify-between text-xs font-bold text-slate-300 hover:text-white"
            >
              <span>Cooling Loop Telemetry</span>
              {collapsedSections.cooling ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronUp className="w-4 h-4 text-slate-500" />}
            </button>

            {/* Power */}
            <button
              onClick={() => toggleSection('power')}
              className="p-3.5 glass-panel rounded-xl border border-slate-800 flex items-center justify-between text-xs font-bold text-slate-300 hover:text-white"
            >
              <span>Power Subsystem</span>
              {collapsedSections.power ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronUp className="w-4 h-4 text-slate-500" />}
            </button>

            {/* Errors */}
            <button
              onClick={() => toggleSection('errors')}
              className="p-3.5 glass-panel rounded-xl border border-slate-800 flex items-center justify-between text-xs font-bold text-slate-300 hover:text-white"
            >
              <span>Error Code History</span>
              {collapsedSections.errors ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronUp className="w-4 h-4 text-slate-500" />}
            </button>
          </div>

          {/* DETECTOR CONTENT */}
          {!collapsedSections.detector && (
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Detector Temperature</span>
                  <span className="text-white font-mono font-bold">{inputs.DetectorTemperature} °C</span>
                </div>
                <input type="range" min="18.0" max="42.0" step="0.5" value={inputs.DetectorTemperature} onChange={(e) => handleInputChange('DetectorTemperature', e.target.value)} className="w-full accent-purple-500" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Detector Dropouts</span>
                  <span className="text-white font-mono font-bold">{inputs.DetectorDropouts}</span>
                </div>
                <input type="range" min="0" max="18" step="1" value={inputs.DetectorDropouts} onChange={(e) => handleInputChange('DetectorDropouts', e.target.value)} className="w-full accent-purple-500" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Signal-to-Noise Ratio (SNR)</span>
                  <span className="text-white font-mono font-bold">{inputs.SNR} dB</span>
                </div>
                <input type="range" min="16.0" max="44.0" step="0.5" value={inputs.SNR} onChange={(e) => handleInputChange('SNR', e.target.value)} className="w-full accent-purple-500" />
              </div>
            </div>
          )}

          {/* COOLING CONTENT */}
          {!collapsedSections.cooling && (
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Coolant Flow</span>
                  <span className="text-blue-400 font-mono font-bold">{inputs.CoolantFlow} L/min</span>
                </div>
                <input type="range" min="1.2" max="9.8" step="0.1" value={inputs.CoolantFlow} onChange={(e) => handleInputChange('CoolantFlow', e.target.value)} className="w-full accent-blue-500" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Coolant Temperature</span>
                  <span className="text-blue-400 font-mono font-bold">{inputs.CoolantTemperature} °C</span>
                </div>
                <input type="range" min="18.0" max="58.0" step="0.5" value={inputs.CoolantTemperature} onChange={(e) => handleInputChange('CoolantTemperature', e.target.value)} className="w-full accent-blue-500" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Chiller Cycles</span>
                  <span className="text-white font-mono font-bold">{inputs.ChillerCycles} /day</span>
                </div>
                <input type="range" min="12" max="185" step="1" value={inputs.ChillerCycles} onChange={(e) => handleInputChange('ChillerCycles', e.target.value)} className="w-full accent-blue-500" />
              </div>
            </div>
          )}

          {/* POWER CONTENT */}
          {!collapsedSections.power && (
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Line Voltage</span>
                  <span className="text-white font-mono font-bold">{inputs.Voltage} V</span>
                </div>
                <input type="range" min="365.0" max="435.0" step="1.0" value={inputs.Voltage} onChange={(e) => handleInputChange('Voltage', e.target.value)} className="w-full accent-emerald-500" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">UPS Battery Health</span>
                  <span className="text-emerald-400 font-mono font-bold">{inputs.UPSHealth}%</span>
                </div>
                <input type="range" min="52.0" max="100.0" step="1.0" value={inputs.UPSHealth} onChange={(e) => handleInputChange('UPSHealth', e.target.value)} className="w-full accent-emerald-500" />
              </div>
            </div>
          )}

          {/* ERRORS CONTENT */}
          {!collapsedSections.errors && (
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Logged Warning Codes</span>
                  <span className="text-amber-400 font-mono font-bold">{inputs.WarningCodes}</span>
                </div>
                <input type="range" min="0" max="28" step="1" value={inputs.WarningCodes} onChange={(e) => handleInputChange('WarningCodes', e.target.value)} className="w-full accent-amber-500" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Logged Critical Error Codes</span>
                  <span className="text-rose-400 font-mono font-bold">{inputs.ErrorCodes}</span>
                </div>
                <input type="range" min="0" max="14" step="1" value={inputs.ErrorCodes} onChange={(e) => handleInputChange('ErrorCodes', e.target.value)} className="w-full accent-rose-500" />
              </div>
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <button
            onClick={handleManualAnalyze}
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white font-extrabold text-base shadow-xl shadow-purple-500/20 hover:opacity-95 transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Analyzing Scanner Condition...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>ANALYZE CT SCANNER</span>
              </>
            )}
          </button>

        </div>
      )}

      {/* MODE 2: TELEMETRY UPLOAD */}
      {activeMode === 'upload' && (
        <div className="space-y-4">
          
          <div className="glass-panel p-8 rounded-2xl border-2 border-dashed border-slate-700 text-center relative hover:border-purple-500/50 transition">
            <input
              type="file"
              accept=".csv"
              onChange={(e) => handleFileUpload(e.target.files[0])}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto mb-4 border border-purple-500/30">
              <Upload className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">Upload Scanner Telemetry CSV</h3>
            <p className="text-xs text-slate-400 mt-1">
              Drag & Drop or browse file from your workstation (`.csv` format only)
            </p>

            {uploadedFile && (
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 font-mono text-xs">
                <FileText className="w-4 h-4" />
                <span>{uploadedFile.name}</span>
              </div>
            )}

            {uploadError && (
              <p className="text-xs text-rose-400 font-medium mt-2">{uploadError}</p>
            )}
          </div>

          {uploadPreview && (
            <div className="glass-panel p-5 rounded-2xl border border-slate-800">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Telemetry Data Preview</h4>
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      {uploadPreview.headers.slice(0, 8).map((h, i) => (
                        <th key={i} className="py-2 px-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="text-slate-200 font-mono">
                      {uploadPreview.values.slice(0, 8).map((v, i) => (
                        <td key={i} className="py-2 px-3">{v}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              <button
                onClick={handleUploadAnalyze}
                disabled={loading}
                className="w-full mt-4 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-sm flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Processing CSV Telemetry...</span>
                  </>
                ) : (
                  <>
                    <Scan className="w-4 h-4" />
                    <span>Analyze Uploaded Scanner Telemetry</span>
                  </>
                )}
              </button>
            </div>
          )}

        </div>
      )}

      {/* ERROR MESSAGE */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* CT PREDICTION RESULT REPORT */}
      {result && (
        <div className="glass-panel p-6 lg:p-8 rounded-2xl border border-purple-500/40 relative overflow-hidden space-y-6 animate-fadeIn">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-purple-400">{result.scanner_id}</span>
                <span className="text-xs text-slate-400">• Revolution Apex CT Scanner</span>
              </div>
              <h3 className="text-xl font-black text-white mt-0.5">CT Scanner AI Health Report</h3>
            </div>

            <div className={`px-4 py-1.5 rounded-full border text-xs font-extrabold flex items-center gap-1.5 self-start sm:self-auto ${getRiskBadgeColor(result.risk_level)}`}>
              <ShieldAlert className="w-4 h-4" />
              <span>CT RISK: {result.risk_level}</span>
            </div>
          </div>

          {/* Primary Metric Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Health Score */}
            <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-xs text-slate-400 font-bold uppercase block">CT AI Health Score</span>
              <div className="text-4xl font-black text-white mt-2 font-mono">
                {result.health_score} <span className="text-xs text-slate-500">/ 100</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${
                    result.health_score >= 80 ? 'bg-emerald-500' :
                    result.health_score >= 60 ? 'bg-amber-500' :
                    result.health_score >= 40 ? 'bg-orange-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${result.health_score}%` }}
                />
              </div>
            </div>

            {/* Remaining Useful Life */}
            <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-xs text-slate-400 font-bold uppercase block">Predicted RUL</span>
              <div className="text-4xl font-black text-purple-400 mt-2 font-mono">
                {result.rul_days} <span className="text-xs text-slate-400">DAYS</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">Estimated remaining useful life before service</p>
            </div>

            {/* Failure Probability */}
            <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-xs text-slate-400 font-bold uppercase block">Failure Risk Factor</span>
              <div className="text-4xl font-black text-amber-400 mt-2 font-mono">
                {Math.round(result.failure_probability * 100)}%
              </div>
              <p className="text-[11px] text-slate-400 mt-2">Model calculated failure probability</p>
            </div>

            {/* Component at Risk */}
            <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-xs text-slate-400 font-bold uppercase block">Component at Risk</span>
              <div className="text-base font-bold text-rose-300 mt-3">
                {result.primary_component_at_risk}
              </div>
              <p className="text-[11px] text-slate-400 mt-2">Primary component triggering degradation</p>
            </div>
          </div>

          {/* Why Section & Recommended Action */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Key Machine Condition Inputs */}
            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Info className="w-4 h-4 text-purple-400" />
                <span>Key Machine Condition Inputs</span>
              </h4>
              
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400">X-Ray Tube Wear:</span>
                  <span className="font-mono font-bold text-white">{inputs.TubeWear}%</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400">Anode Heat Load:</span>
                  <span className="font-mono font-bold text-white">{inputs.HeatLoad}%</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400">Gantry Vibration:</span>
                  <span className="font-mono font-bold text-white">{inputs.GantryVibration} g</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400">Bearing Temperature:</span>
                  <span className="font-mono font-bold text-white">{inputs.BearingTemperature} °C</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400">Coolant Loop Flow:</span>
                  <span className="font-mono font-bold text-white">{inputs.CoolantFlow} L/min</span>
                </div>
              </div>
            </div>

            {/* Recommended Action */}
            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Recommended Action</span>
                </h4>
                <p className="text-sm font-medium text-slate-200 mt-3 leading-relaxed">
                  {result.recommendedAction}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500 font-mono">
                Model: CT-Scanner-GradBoost-v3.0 • Response Time: 42ms
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
