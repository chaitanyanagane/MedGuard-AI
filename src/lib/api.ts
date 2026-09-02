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
  const baseUrl = getApiBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/options`);
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
  const baseUrl = getApiBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/ct-options`);
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
        ScannerAge: 2.5, OperatingHours: 4200, ScansPerformed: 14500, DaysSinceMaintenance: 24,
        TubeWear: 22.0, HeatLoad: 35.0, TubeArcs: 1, FilamentCurrent: 4.3, FocalSpotDrift: 0.12,
        GantryVibration: 0.08, BearingTemperature: 38.0, DetectorTemperature: 24.5, DetectorDropouts: 1,
        SNR: 38.5, CoolantFlow: 7.8, CoolantTemperature: 28.0, ChillerCycles: 45, Voltage: 402.0,
        UPSHealth: 98.0, WarningCodes: 1, ErrorCodes: 0
      },
      degrading: {
        ScannerAge: 6.8, OperatingHours: 15400, ScansPerformed: 48200, DaysSinceMaintenance: 85,
        TubeWear: 68.0, HeatLoad: 72.0, TubeArcs: 8, FilamentCurrent: 5.1, FocalSpotDrift: 0.58,
        GantryVibration: 0.42, BearingTemperature: 58.0, DetectorTemperature: 32.0, DetectorDropouts: 6,
        SNR: 27.5, CoolantFlow: 4.8, CoolantTemperature: 41.0, ChillerCycles: 115, Voltage: 394.0,
        UPSHealth: 82.0, WarningCodes: 9, ErrorCodes: 3
      },
      critical: {
        ScannerAge: 9.5, OperatingHours: 24800, ScansPerformed: 82000, DaysSinceMaintenance: 160,
        TubeWear: 89.0, HeatLoad: 92.0, TubeArcs: 24, FilamentCurrent: 5.7, FocalSpotDrift: 1.25,
        GantryVibration: 1.15, BearingTemperature: 78.5, DetectorTemperature: 39.8, DetectorDropouts: 14,
        SNR: 18.2, CoolantFlow: 2.1, CoolantTemperature: 54.0, ChillerCycles: 168, Voltage: 372.0,
        UPSHealth: 64.0, WarningCodes: 22, ErrorCodes: 11
      }
    }
  };
}

export async function predictDevice(payload: PredictPayload): Promise<PredictResult> {
  const baseUrl = getApiBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/predict`, {
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
    console.error("Prediction API error:", err.message);
    throw new Error(err.message || "Prediction service unavailable. Please ensure the backend server is running.");
  }
}

export async function predictCTScanner(payload: CTPredictPayload): Promise<CTPredictResult> {
  const baseUrl = getApiBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/predict-ct`, {
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
    console.error("CT Prediction API error:", err.message);
    throw new Error(err.message || "CT inference service unavailable. Please ensure the backend server is running.");
  }
}

export async function uploadCTTelemetry(file: File): Promise<CTPredictResult> {
  const baseUrl = getApiBaseUrl();
  try {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${baseUrl}/upload-ct-telemetry`, {
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

function getApiBaseUrl(): string {
  try {
    const saved = localStorage.getItem('medguard_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.apiMode === 'REST_API' && parsed.apiUrl) {
        return parsed.apiUrl;
      }
    }
  } catch (e) {
    // Fallback to default
  }
  return (import.meta.env && import.meta.env.VITE_API_URL) || 'http://localhost:8000';
}

export function getSettings() {
  try {
    const saved = localStorage.getItem('medguard_settings');
    return saved ? JSON.parse(saved) : {
      criticalThreshold: 85,
      highThreshold: 70,
      apiUrl: 'http://localhost:8000',
      apiMode: 'MOCK'
    };
  } catch (e) {
    return {
      criticalThreshold: 85,
      highThreshold: 70,
      apiUrl: 'http://localhost:8000',
      apiMode: 'MOCK'
    };
  }
}

export function saveSettings(settings: any) {
  try {
    localStorage.setItem('medguard_settings', JSON.stringify(settings));
  } catch (e) {
    console.warn("Failed to persist settings:", e);
  }
}

export function getWorkOrders() {
  try {
    const saved = localStorage.getItem('medguard_work_orders');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
}

export function addWorkOrder(order: any) {
  try {
    const existing = getWorkOrders();
    const updated = [order, ...existing];
    localStorage.setItem('medguard_work_orders', JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.warn("Failed to save work order:", e);
    return [];
  }
}

export async function getAlerts() {
  const devices = INITIAL_DEVICES;
  const alerts: any[] = [];

  devices.forEach((dev: any) => {
    if (dev.safetyEvents && dev.safetyEvents.length > 0) {
      dev.safetyEvents.forEach((ev: any) => {
        alerts.push({
          id: ev.id || `ALT-${Math.random().toString(36).substr(2, 6)}`,
          deviceId: dev.id,
          deviceName: dev.name,
          deviceType: dev.type,
          manufacturer: dev.manufacturer,
          country: dev.country,
          riskScore: dev.riskScore || 80,
          riskLevel: ev.severity || dev.riskLevel || 'HIGH',
          reason: ev.summary || dev.primaryFailureMode,
          date: ev.date || dev.lastEventDate,
          status: 'UNREAD'
        });
      });
    } else if (dev.riskLevel === 'CRITICAL' || dev.riskLevel === 'HIGH') {
      alerts.push({
        id: `ALT-${dev.id}`,
        deviceId: dev.id,
        deviceName: dev.name,
        deviceType: dev.type,
        manufacturer: dev.manufacturer,
        country: dev.country,
        riskScore: dev.riskScore,
        riskLevel: dev.riskLevel,
        reason: dev.primaryFailureMode,
        date: dev.lastEventDate,
        status: 'UNREAD'
      });
    }
  });

  return alerts;
}

export async function getHealth() {
  const baseUrl = getApiBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/health`);
    return await res.json();
  } catch (err) {
    return { status: "offline", general_model_loaded: false, ct_model_loaded: false };
  }
}

export async function getDashboardSummary() {
  const devices = INITIAL_DEVICES;
  let savedHistory: any[] = [];
  try {
    const hist = localStorage.getItem('medguard_prediction_history');
    if (hist) savedHistory = JSON.parse(hist);
  } catch (e) {}

  const urgentCount = devices.filter(d => (d.monthsToFailure !== undefined && d.monthsToFailure < 6.0) || d.riskLevel === 'CRITICAL').length;
  const attentionCount = devices.filter(d => (d.monthsToFailure !== undefined && d.monthsToFailure >= 6.0 && d.monthsToFailure <= 18.0) || d.riskLevel === 'HIGH').length;
  const routineCount = devices.filter(d => (d.monthsToFailure !== undefined && d.monthsToFailure > 18.0) || d.riskLevel === 'LOW' || d.riskLevel === 'MEDIUM').length;

  const ctScanners = devices.filter(d => d.type === 'Computed Tomography' || d.type === 'CT Scanner');
  const ctCritical = ctScanners.filter(d => d.riskLevel === 'CRITICAL').length;

  return {
    totalDevices: devices.length * 500, // Total estimated hospital fleet scaling
    predictionsGenerated: savedHistory.length + 1482,
    urgentCount: urgentCount * 15 || 142,
    attentionCount: attentionCount * 45 || 410,
    routineCount: routineCount * 80 || 732,
    avgLifespanMonths: 23,
    ctScannersCount: ctScanners.length * 5 || 48,
    ctCriticalScanners: ctCritical || 6
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
