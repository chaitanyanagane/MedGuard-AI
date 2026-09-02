import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Info, 
  ArrowRight, 
  Sliders, 
  Sparkles,
  Stethoscope
} from 'lucide-react';
import { getOptions, predictDevice } from '../lib/api';
import confetti from 'canvas-confetti';

export default function PredictView({ onSaveToHistory }) {
  // Form State
  const [deviceType, setDeviceType] = useState('Ventilator');
  const [manufacturer, setManufacturer] = useState('GE Healthcare');
  const [age, setAge] = useState(8);
  const [assetCondition, setAssetCondition] = useState(1); // 0=Good, 1=Fair, 2=Poor
  const [operations, setOperations] = useState(2); // 1=Single shift, 2=Multi-shift

  // Options State
  const [options, setOptions] = useState(null);
  const [loadingOptions, setLoadingOptions] = useState(true);

  // Prediction Outcome State
  const [predicting, setPredicting] = useState(false);
  const [result, setResult] = useState(null);
  const [lastSubmitted, setLastSubmitted] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    async function loadFormOptions() {
      setLoadingOptions(true);
      try {
        const opts = await getOptions();
        setOptions(opts);
      } catch (err) {
        console.error("Failed to load options:", err);
      } font-mono;
      setLoadingOptions(false);
    }
    loadFormOptions();
  }, []);

  const handlePredict = async (e) => {
    if (e) e.preventDefault();
    setPredicting(true);
    setErrorMsg(null);

    const payload = {
      TypeDescription: deviceType,
      Manufacturer: manufacturer,
      Age: Number(age),
      AssetCondition: Number(assetCondition),
      Operations: Number(operations)
    };

    try {
      const outcome = await predictDevice(payload);
      setResult(outcome);
      setLastSubmitted(payload);

      // Trigger celebration confetti
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 }
      });

      if (onSaveToHistory) {
        onSaveToHistory({
          id: `PRED-${Date.now()}`,
          timestamp: new Date().toLocaleString(),
          ...payload,
          scanner_id: `MD-${Math.floor(1000 + Math.random() * 9000)}`,
          analysisType: 'General Equipment',
          monthsToFailure: outcome.months_to_failure,
          priority: outcome.derivedPriority.level,
          result: `${outcome.months_to_failure} Months`
        });
      }
    } catch (err) {
      console.error("Prediction error:", err);
      setErrorMsg("Prediction service is currently unavailable. Please try again.");
    } finally {
      setPredicting(false);
    }
  };

  const conditionLabels = [
    { label: 'Good', value: 0 },
    { label: 'Fair', value: 1 },
    { label: 'Poor', value: 2 }
  ];

  const operationLabels = [
    { label: 'Single Shift', value: 1 },
    { label: 'Multi-shift / Continuous Use', value: 2 }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Page Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 uppercase tracking-wider">
                MODEL 1 — GENERAL EQUIPMENT
              </span>
              <span className="text-xs text-slate-400 font-mono">Hospital-Wide Screening</span>
            </div>
            
            <h2 className="text-2xl font-extrabold text-white flex items-center gap-2 mt-1">
              <Stethoscope className="w-6 h-6 text-cyan-400" />
              General Equipment Prediction
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Estimate the remaining time before likely equipment failure.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-400">
              GradientBoosting Regressor Active
            </span>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/20 border border-rose-500/50 text-rose-300 text-xs font-bold flex items-center justify-between shadow-lg shadow-rose-500/10">
          <span>{errorMsg}</span>
          <button
            onClick={handlePredict}
            className="px-3 py-1 bg-rose-500 text-white rounded-lg text-[11px]"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Two Column Layout on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* LEFT COLUMN: Input Form */}
        <form onSubmit={handlePredict} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              Equipment Characteristics
            </h3>
            <span className="text-[10px] font-mono text-slate-500 uppercase">5 Inputs</span>
          </div>

          {/* 1. Device Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-200 block">Device Type</label>
            <select
              value={deviceType}
              onChange={(e) => setDeviceType(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-slate-100 text-xs font-bold px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-cyan-500"
            >
              {(options?.type_description || [
                "Ventilator", "Infusion Pump", "Defibrillator", 
                "Physiologic Monitoring System", "Radiographic System", "Sphygmomanometers"
              ]).map(t => (
                <option key={t} value={t} className="bg-slate-900">{t}</option>
              ))}
            </select>
            <span className="text-[10px] text-slate-400 block">Category of equipment to evaluate.</span>
          </div>

          {/* 2. Manufacturer */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-200 block">Manufacturer</label>
            <select
              value={manufacturer}
              onChange={(e) => setManufacturer(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-slate-100 text-xs font-bold px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-cyan-500"
            >
              {(options?.manufacturers || [
                "GE Healthcare", "Koninklijke Philips N.V.", "Siemens Healthineers", 
                "Medtronic", "Drager Medical AG & Co KGaA", "B. Braun Melsungen AG", "Baxter Healthcare Corp"
              ]).map(m => (
                <option key={m} value={m} className="bg-slate-900">{m}</option>
              ))}
            </select>
            <span className="text-[10px] text-slate-400 block">Manufacturer of the equipment.</span>
          </div>

          {/* 3. Device Age */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-slate-200">Device Age (Years)</label>
              <span className="font-mono font-extrabold text-cyan-400 text-sm">{age} Years</span>
            </div>

            <input
              type="range"
              min="0"
              max="30"
              value={age}
              onChange={(e) => setAge(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0 yrs (New)</span>
              <span>15 yrs</span>
              <span>30 yrs (Aged)</span>
            </div>
          </div>

          {/* 4. Current Asset Condition */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-200 block">Asset Condition</label>
            <div className="grid grid-cols-3 gap-2">
              {conditionLabels.map(cond => (
                <button
                  key={cond.value}
                  type="button"
                  onClick={() => setAssetCondition(cond.value)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition ${
                    assetCondition === cond.value
                      ? 'bg-cyan-500/20 border-cyan-500/60 text-cyan-300 shadow-md shadow-cyan-500/10'
                      : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {cond.label}
                </button>
              ))}
            </div>
            <span className="text-[10px] text-slate-400 block">0 = Good, 1 = Fair, 2 = Poor</span>
          </div>

          {/* 5. Operations / Usage Pattern */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-200 block">Usage Pattern</label>
            <div className="grid grid-cols-2 gap-2">
              {operationLabels.map(op => (
                <button
                  key={op.value}
                  type="button"
                  onClick={() => setOperations(op.value)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition ${
                    operations === op.value
                      ? 'bg-cyan-500/20 border-cyan-500/60 text-cyan-300 shadow-md shadow-cyan-500/10'
                      : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {op.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={predicting}
            className="w-full py-3.5 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition duration-200 disabled:opacity-50"
          >
            {predicting ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                <span>Analyzing equipment...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Predict Failure Timeline</span>
              </>
            )}
          </button>

        </form>

        {/* RIGHT COLUMN: Prediction Result & Derived Priority */}
        <div className="space-y-6">
          
          {/* Main Outcome Card */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                Prediction Output
              </h3>
              <span className="text-[10px] font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30">
                Model 1 ML Output
              </span>
            </div>

            {!result ? (
              /* Initial Placeholder State */
              <div className="py-12 text-center text-slate-400 space-y-3">
                <Clock className="w-10 h-10 text-slate-600 mx-auto animate-pulse" />
                <h4 className="text-sm font-bold text-white">Ready to Predict Failure Timeline</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Select device parameters on the left and click "Predict Failure Timeline" to generate model estimation.
                </p>
              </div>
            ) : (
              /* Generated Prediction Result Display */
              <div className="space-y-6 animate-scaleUp">
                
                {/* PROMINENT MONTHS TO FAILURE DISPLAY */}
                <div className="p-6 rounded-2xl bg-gradient-to-tr from-slate-900 via-slate-900 to-slate-950 border border-slate-800 text-center space-y-2 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl" />
                  
                  <span className="text-xs uppercase font-bold tracking-wider text-slate-400 block">
                    PREDICTED TIME TO FAILURE
                  </span>

                  <div className="flex items-baseline justify-center gap-2 my-2">
                    <span className="text-6xl lg:text-7xl font-black bg-gradient-to-r from-white via-cyan-200 to-blue-400 bg-clip-text text-transparent tracking-tight">
                      {result.months_to_failure}
                    </span>
                    <span className="text-lg font-bold text-cyan-400 uppercase font-mono">MONTHS</span>
                  </div>

                  {/* Derived Maintenance Priority Card */}
                  <div className="pt-3 border-t border-slate-800/80 max-w-xs mx-auto space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Derived Maintenance Priority
                    </span>
                    
                    <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border ${
                      result.derivedPriority.level === 'URGENT' 
                        ? 'bg-rose-500/20 border-rose-500/50 text-rose-400' 
                        : result.derivedPriority.level === 'ATTENTION'
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                        : 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                    }`}>
                      {result.derivedPriority.label}
                    </span>

                    <p className="text-[10px] text-slate-500 pt-1 italic">
                      *Derived maintenance heuristic (&lt;6m Urgent, 6-18m Attention, &gt;18m Routine).
                    </p>
                  </div>
                </div>

                {/* VISUAL FAILURE TIMELINE */}
                <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Timeline Position
                  </h4>

                  <div className="relative pt-6 pb-2">
                    <div className="w-full h-3 rounded-full bg-slate-950 flex overflow-hidden border border-slate-800">
                      <div className="w-[10%] bg-rose-500/60" title="URGENT (< 6m)" />
                      <div className="w-[20%] bg-amber-500/60" title="ATTENTION (6-18m)" />
                      <div className="w-[70%] bg-emerald-500/60" title="ROUTINE (> 18m)" />
                    </div>

                    <div 
                      className="absolute top-0 transform -translate-x-1/2 flex flex-col items-center transition-all duration-700"
                      style={{ left: `${Math.min(95, Math.max(5, (result.months_to_failure / 60) * 100))}%` }}
                    >
                      <span className="px-2 py-0.5 text-[10px] font-black rounded bg-cyan-400 text-slate-950 font-mono">
                        {result.months_to_failure}m
                      </span>
                      <div className="w-0.5 h-6 bg-cyan-400" />
                    </div>
                  </div>

                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span className="text-rose-400 font-bold">&lt; 6m (URGENT)</span>
                    <span className="text-amber-400 font-bold">6–18m (ATTENTION)</span>
                    <span className="text-emerald-400 font-bold">&gt; 18m (ROUTINE)</span>
                    <span>60m</span>
                  </div>
                </div>

                {/* RECOMMENDED ACTION */}
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5 text-xs">
                  <strong className="text-slate-200 font-bold block">Recommended Action:</strong>
                  <p className="text-slate-300 leading-relaxed">
                    {result.derivedPriority.recommendation}
                  </p>
                </div>

              </div>
            )}

          </div>

          {/* MODEL TRANSPARENCY CARD */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Info className="w-4 h-4 text-cyan-400" />
              Model Architecture & Transparency
            </h4>

            <p className="text-xs text-slate-300 leading-relaxed">
              Model 1 is a trained Gradient Boosting Regression pipeline evaluating device type, manufacturer, age, asset condition, and operational shift patterns.
            </p>

            <div className="pt-2 flex items-center justify-between text-[10px] font-mono text-slate-400 border-t border-slate-800">
              <span>Inputs (5 Attributes)</span>
              <ArrowRight className="w-3 h-3 text-cyan-400" />
              <span>Gradient Boosting</span>
              <ArrowRight className="w-3 h-3 text-cyan-400" />
              <span>MonthsToFailure</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
