export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type EventType = 'Recall' | 'Malfunction' | 'Safety Alert' | 'Field Safety Notice';

export interface SafetyEvent {
  id: string;
  deviceId: string;
  date: string;
  eventType: EventType;
  severity: RiskLevel;
  manufacturer: string;
  summary: string;
  reportNumber: string;
  affectedComponents?: string[];
  actionRequired?: string;
}

export interface RiskFactor {
  factor: string;
  contribution: number; // percentage e.g. 38
  detail: string;
}

export interface Recommendation {
  level: RiskLevel;
  title: string;
  actionSteps: string[];
  inspectionPriority: 'Immediate' | 'High' | 'Routine' | 'Normal';
  suggestedIntervalDays: number;
}

export interface Device {
  id: string;
  name: string;
  type: string;
  manufacturer: string;
  model: string;
  country: string;
  serialNumber: string;
  installDate: string;
  firstRecordedEvent: string;
  lastEventDate: string;
  riskScore: number; // 0 to 100
  riskLevel: RiskLevel;
  modelConfidence: number; // percentage e.g. 94
  totalSafetyEvents: number;
  primaryFailureMode: string;
  hospitalWing: string;
  room: string;
  assignedEngineer: {
    name: string;
    role: string;
    contact: string;
  };
  riskFactors: RiskFactor[];
  safetyEvents: SafetyEvent[];
  recommendation: Recommendation;
}

export interface DashboardSummary {
  totalDevices: number;
  highRiskCount: number;
  criticalRiskCount: number;
  totalSafetyEvents: number;
  riskDistribution: {
    LOW: number;
    MEDIUM: number;
    HIGH: number;
    CRITICAL: number;
  };
}

export interface AlertItem {
  id: string;
  deviceId: string;
  deviceName: string;
  deviceType: string;
  manufacturer: string;
  country: string;
  riskScore: number;
  riskLevel: RiskLevel;
  reason: string;
  date: string;
  status: 'UNREAD' | 'REVIEWED' | 'IN_PROGRESS' | 'RESOLVED';
}

export interface AnalyticsData {
  eventsOverTime: { date: string; recalls: number; malfunctions: number; alerts: number; fsns: number }[];
  devicesByCategory: { category: string; count: number; avgRisk: number }[];
  manufacturerRisk: { manufacturer: string; count: number; avgRisk: number; criticalCount: number }[];
  eventTypeDistribution: { name: EventType; value: number; color: string }[];
  geographicDistribution: { country: string; deviceCount: number; highRiskCount: number; code: string }[];
}

export interface ReportItem {
  id: string;
  title: string;
  category: string;
  generatedDate: string;
  author: string;
  status: 'Ready' | 'Generating' | 'Archived';
  fileSize: string;
  type: 'PDF' | 'CSV' | 'JSON';
}
