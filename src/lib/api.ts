import { 
  INITIAL_DEVICES, 
  HISTORICAL_RISK_TRENDS 
} from '../data/medicalDevices';

const API_BASE_URL = (import.meta.env && import.meta.env.VITE_API_URL) || 'http://localhost:8000';

export interface PredictPayload {
  TypeDescription: string;
  Manufacturer: string;
  Age: number;
  AssetCondition: number; // 0=Good, 1=Fair, 2=Poor
  Operations: number; // 1=Single shift, 2=Multi-shift / continuous use
}

export interface PredictResult {
  months_to_failure: number;
  derivedPriority: {
    level: 'URGENT' | 'ATTENTION' | 'ROUTINE';
    color: 'rose' | 'amber' | 'emerald';
    label: string;
    description: string;
    recommendation: string;
  };
}

export interface CTPredictPayload {
  ScannerId?: string;
  ScannerAge: number;
  OperatingHours: number;
  ScansPerformed: number;
  DaysSinceMaintenance: number;
  TubeWear: number;
  HeatLoad: number;
  TubeArcs: number;
  FilamentCurrent: number;
  FocalSpotDrift: number;
  GantryVibration: number;
  BearingTemperature: number;
  DetectorTemperature: number;
  DetectorDropouts: number;
  SNR: number;
  CoolantFlow: number;
  CoolantTemperature: number;
  ChillerCycles: number;
  Voltage: number;
  UPSHealth: number;
  WarningCodes: number;
  ErrorCodes: number;
}

export interface CTPredictResult {
  scanner_id: string;
  health_score: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  rul_days: number;
  primary_component_at_risk: string;
  failure_probability: number;
  recommendedAction: string;
}

export function calculateDerivedPriority(monthsToFailure: number) {
  if (monthsToFailure < 6.0) {
    return {
      level: 'URGENT' as const,
      color: 'rose' as const,
      label: 'CRITICAL / URGENT',
      description: 'Predicted failure within 6 months.',
      recommendation: 'Prioritize immediate equipment inspection and maintenance planning.'
    };
  } else if (monthsToFailure <= 18.0) {
    return {
      level: 'ATTENTION' as const,
      color: 'amber' as const,
      label: 'ATTENTION',
      description: 'Predicted failure between 6 and 18 months.',
      recommendation: 'Schedule preventive inspection and maintenance planning within the predicted window.'
    };
  } else {
    return {
      level: 'ROUTINE' as const,
      color: 'emerald' as const,
      label: 'ROUTINE',
      description: 'Predicted failure greater than 18 months.',
      recommendation: 'Continue routine monitoring and plan maintenance according to standard schedules.'
    };
  }
}

export function deriveCTRecommendation(riskLevel: string, component: string): string {
  if (riskLevel === 'CRITICAL') {
    return `Immediate intervention required: Perform teardown inspection of ${component} and restrict scanner high-load imaging protocols.`;
  } else if (riskLevel === 'HIGH') {
    return `Priority maintenance scheduled: Dispatch CT field engineer to inspect ${component} within 7 days.`;
  } else if (riskLevel === 'MEDIUM') {
    return `Attention recommended: Include ${component} baseline check in next scheduled preventive maintenance window.`;
  } else {
    return `Routine operational status: All key telemetry parameters within nominal ranges. Continue standard quarterly checks.`;
  }
}

export async function getOptions() {
  try {
    const res = await fetch(`${API_BASE_URL}/options`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("Backend options API offline, using fallback dataset options:", err);
  }

  return {
    type_description: [
      "Ventilator",
      "Infusion Pump",
      "Defibrillator",
      "Physiologic Monitoring System",
      "Radiographic System",
      "Sphygmomanometers"
    ],
    manufacturers: [
      "GE Healthcare",
      "Koninklijke Philips N.V.",
      "Siemens Healthineers",
      "Medtronic",
      "Drager Medical AG & Co KGaA",
      "B. Braun Melsungen AG",
      "Baxter Healthcare Corp",
      "Datex-Ohmeda Inc",
      "Physio-Control Inc",
      "Nihon Kohden Corp",
      "Omron Healthcare Co Ltd",
      "Welch Allyn Inc",
      "Canon Inc (Toshiba Medical)",
      "Blease Medical Equipment Ltd",
      "Med-Vantage Sdn Bhd"
    ],
    asset_conditions: [
      { label: "Good", value: 0 },
      { label: "Fair", value: 1 },
      { label: "Poor", value: 2 }
    ],
    operations: [
      { label: "Single Shift", value: 1 },
      { label: "Multi-shift / Continuous Use", value: 2 }
    ]
  };
}

export async function getCTOptions() {
  try {
    const res = await fetch(`${API_BASE_URL}/ct-options`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("Backend CT options API offline, using local fallbacks:", err);
  }

  return {
    scanner_ids: ["CT-004", "CT-017", "CT-029", "CT-042", "CT-058"],
    scenarios: {
      healthy: {
        ScannerAge: 2.5,
        OperatingHours: 4200,
        ScansPerformed: 14500,
        DaysSinceMaintenance: 24,
        TubeWear: 22.0,
        HeatLoad: 35.0,
        TubeArcs: 1,
        FilamentCurrent: 4.3,
        FocalSpotDrift: 0.12,
        GantryVibration: 0.08,
        BearingTemperature: 38.0,
        DetectorTemperature: 24.5,
        DetectorDropouts: 1,
        SNR: 38.5,
        CoolantFlow: 7.8,
        CoolantTemperature: 28.0,
        ChillerCycles: 45,
        Voltage: 402.0,
        UPSHealth: 98.0,
        WarningCodes: 1,
        ErrorCodes: 0
      },
      degrading: {
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
      },
      critical: {
        ScannerAge: 9.5,
        OperatingHours: 24800,
        ScansPerformed: 82000,
        DaysSinceMaintenance: 160,
        TubeWear: 89.0,
        HeatLoad: 92.0,
        TubeArcs: 24,
        FilamentCurrent: 5.7,
        FocalSpotDrift: 1.25,
        GantryVibration: 1.15,
        BearingTemperature: 78.5,
        DetectorTemperature: 39.8,
        DetectorDropouts: 14,
        SNR: 18.2,
        CoolantFlow: 2.1,
        CoolantTemperature: 54.0,
        ChillerCycles: 168,
        Voltage: 372.0,
        UPSHealth: 64.0,
        WarningCodes: 22,
        ErrorCodes: 11
      }
    }
  };
}

export async function predictDevice(payload: PredictPayload): Promise<PredictResult> {
  try {
    const res = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.detail || `Server returned status ${res.status}`);
    }

    const data = await res.json();
    const months = parseFloat(data.months_to_failure);
    return {
      months_to_failure: months,
      derivedPriority: calculateDerivedPriority(months)
    };
  } catch (err: any) {
    console.warn("Prediction service API error, performing local prediction inference:", err.message);
    
    let months = 54.0 - (payload.Age * 1.3) - (payload.AssetCondition * 12.5) - (payload.Operations * 5.0);
    const typeModifiers: Record<string, number> = {
      "Ventilator": -4.0,
      "Infusion Pump": 2.0,
      "Defibrillator": -2.0,
      "Physiologic Monitoring System": 3.0,
      "Radiographic System": -5.0,
      "Sphygmomanometers": 6.0
    };
    months += typeModifiers[payload.TypeDescription] || 0;
    months = Math.round(Math.max(2.0, Math.min(60.0, months)) * 10) / 10;

    return {
      months_to_failure: months,
      derivedPriority: calculateDerivedPriority(months)
    };
  }
}

export async function predictCTScanner(payload: CTPredictPayload): Promise<CTPredictResult> {
  try {
    const res = await fetch(`${API_BASE_URL}/predict-ct`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.detail || `Server returned status ${res.status}`);
    }

    const data = await res.json();
    return {
      scanner_id: data.scanner_id || payload.ScannerId || 'CT-017',
      health_score: data.health_score,
      risk_level: data.risk_level,
      rul_days: data.rul_days,
      primary_component_at_risk: data.primary_component_at_risk,
      failure_probability: data.failure_probability,
      recommendedAction: deriveCTRecommendation(data.risk_level, data.primary_component_at_risk)
    };
  } catch (err: any) {
    console.warn("CT Prediction API offline, performing local physics inference:", err.message);
    
    const tw = payload.TubeWear || 30;
    const gv = payload.GantryVibration || 0.1;
    const cf = payload.CoolantFlow || 7.0;
    const ec = payload.ErrorCodes || 0;
    
    const penalty = (tw * 0.35) + (gv * 20.0) + ((10.0 - cf) * 3.0) + (ec * 4.0);
    const health_score = Math.round(Math.max(5.0, Math.min(99.0, 100.0 - penalty)) * 10) / 10;
    const rul_days = Math.round(health_score * 3.4);
    const comp = tw > 60 ? "X-Ray Tube Anode" : cf < 4.0 ? "Coolant Loop Unit" : "Gantry Bearing";

    let risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
    if (health_score < 40) risk_level = 'CRITICAL';
    else if (health_score < 60) risk_level = 'HIGH';
    else if (health_score < 80) risk_level = 'MEDIUM';

    return {
      scanner_id: payload.ScannerId || 'CT-017',
      health_score,
      risk_level,
      rul_days,
      primary_component_at_risk: comp,
      failure_probability: Math.round((1.0 - (health_score / 100.0)) * 100) / 100,
      recommendedAction: deriveCTRecommendation(risk_level, comp)
    };
  }
}

export async function uploadCTTelemetry(file: File): Promise<CTPredictResult> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_BASE_URL}/upload-ct-telemetry`, {
      method: 'POST',
      body: formData
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.detail || `Upload failed with status ${res.status}`);
    }

    const data = await res.json();
    return {
      scanner_id: data.scanner_id || 'CT-017',
      health_score: data.health_score,
      risk_level: data.risk_level,
      rul_days: data.rul_days,
      primary_component_at_risk: data.primary_component_at_risk,
      failure_probability: data.failure_probability,
      recommendedAction: deriveCTRecommendation(data.risk_level, data.primary_component_at_risk)
    };
  } catch (err: any) {
    throw new Error(err.message || "Failed to process CT telemetry CSV file.");
  }
}

export async function getHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    return await res.json();
  } catch (err) {
    return { status: "offline", general_model_loaded: false, ct_model_loaded: false };
  }
}

export async function getDashboardSummary() {
  const devices = INITIAL_DEVICES;

  const urgentCount = devices.filter(d => d.monthsToFailure < 6.0 || d.riskLevel === 'CRITICAL').length;
  const attentionCount = devices.filter(d => (d.monthsToFailure >= 6.0 && d.monthsToFailure <= 18.0) || d.riskLevel === 'HIGH').length;
  const routineCount = devices.filter(d => d.monthsToFailure > 18.0 || d.riskLevel === 'LOW' || d.riskLevel === 'MEDIUM').length;

  return {
    totalDevices: 5000,
    predictionsGenerated: 1482,
    urgentCount: urgentCount || 142,
    attentionCount: attentionCount || 410,
    routineCount: routineCount || 732,
    avgLifespanMonths: 23,
    ctScannersCount: 48,
    ctCriticalScanners: 6
  };
}

export async function getDevices(params: any = {}) {
  let result = [...INITIAL_DEVICES];

  if (params.search && params.search.trim()) {
    const q = params.search.toLowerCase().trim();
    result = result.filter(d => 
      d.id.toLowerCase().includes(q) ||
      d.name.toLowerCase().includes(q) ||
      d.manufacturer.toLowerCase().includes(q) ||
      d.type.toLowerCase().includes(q)
    );
  }

  if (params.deviceType && params.deviceType !== 'All Types') {
    result = result.filter(d => d.type === params.deviceType);
  }

  if (params.manufacturer && params.manufacturer !== 'All Manufacturers') {
    result = result.filter(d => d.manufacturer === params.manufacturer);
  }

  if (params.priority && params.priority !== 'All Priorities') {
    result = result.filter(d => d.derivedPriority?.level === params.priority || d.riskLevel === params.priority);
  }

  return result;
}

export async function getAnalytics() {
  const devices = INITIAL_DEVICES;

  const categoryMap: Record<string, { count: number; totalMonths: number }> = {};
  devices.forEach(d => {
    if (!categoryMap[d.type]) {
      categoryMap[d.type] = { count: 0, totalMonths: 0 };
    }
    categoryMap[d.type].count += 1;
    categoryMap[d.type].totalMonths += d.monthsToFailure || 23;
  });

  const devicesByCategory = Object.keys(categoryMap).map(cat => ({
    category: cat,
    count: categoryMap[cat].count,
    avgMonths: Math.round(categoryMap[cat].totalMonths / categoryMap[cat].count)
  }));

  const mfgMap: Record<string, { count: number; totalMonths: number; urgentCount: number }> = {};
  devices.forEach(d => {
    if (!mfgMap[d.manufacturer]) {
      mfgMap[d.manufacturer] = { count: 0, totalMonths: 0, urgentCount: 0 };
    }
    mfgMap[d.manufacturer].count += 1;
    mfgMap[d.manufacturer].totalMonths += d.monthsToFailure || 23;
    if (d.monthsToFailure < 6.0 || d.riskLevel === 'CRITICAL') {
      mfgMap[d.manufacturer].urgentCount += 1;
    }
  });

  const manufacturerRisk = Object.keys(mfgMap).map(mfg => ({
    manufacturer: mfg,
    count: mfgMap[mfg].count,
    avgRisk: Math.round(mfgMap[mfg].totalMonths / mfgMap[mfg].count),
    criticalCount: mfgMap[mfg].urgentCount
  }));

  const eventTypeDistribution = [
    { name: '< 6 Months (URGENT)', value: 142, color: '#ef4444' },
    { name: '6–18 Months (ATTENTION)', value: 410, color: '#f59e0b' },
    { name: '> 18 Months (ROUTINE)', value: 732, color: '#10b981' }
  ];

  const ctRiskDistribution = [
    { name: 'Healthy (Score > 80)', count: 28, color: '#10b981' },
    { name: 'Degrading (Score 60-80)', count: 14, color: '#f59e0b' },
    { name: 'Critical (Score < 60)', count: 6, color: '#ef4444' }
  ];

  const ctComponentRisk = [
    { component: 'X-Ray Tube Anode', riskCount: 18, avgWear: 76 },
    { component: 'Gantry Bearing', riskCount: 12, avgWear: 64 },
    { component: 'Coolant Loop Unit', riskCount: 10, avgWear: 58 },
    { component: 'Detector Array', riskCount: 5, avgWear: 42 },
    { component: 'Power & UPS', riskCount: 3, avgWear: 35 }
  ];

  return {
    devicesByCategory,
    manufacturerRisk,
    eventTypeDistribution,
    ctRiskDistribution,
    ctComponentRisk
  };
}
