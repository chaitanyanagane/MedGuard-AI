export const INITIAL_DEVICES = [
  {
    id: "MD-1024",
    name: "CentriMag Blood Pump System",
    type: "Cardiovascular Pump",
    manufacturer: "Abbott Laboratories",
    model: "CentriMag 2nd Gen",
    country: "USA",
    serialNumber: "SN-ABT-9901-C",
    installDate: "2021-03-15",
    firstRecordedEvent: "2021-08-10",
    lastEventDate: "2026-08-31",
    riskScore: 92,
    riskLevel: "CRITICAL",
    modelConfidence: 94,
    totalSafetyEvents: 18,
    primaryFailureMode: "Peristaltic Motor Bearing Binding & Rotor Seal Micro-Leakage",
    hospitalWing: "Cardiology & Surgery",
    room: "OR Suite 1",
    assignedEngineer: {
      name: "Dr. Marcus Vance",
      role: "Lead Biomedical Systems Engineer",
      contact: "marcus.vance@medguard.health"
    },
    riskFactors: [
      { factor: "Previous Safety Events", contribution: 38, detail: "18 historical safety events logged over 4.5 years" },
      { factor: "Device Problem History", contribution: 29, detail: "Repeated rotor seal micro-leakage and motor binding reports" },
      { factor: "Manufacturer Pattern", contribution: 18, detail: "Global recall trend across batch series ABT-2021" },
      { factor: "Event Severity Ratio", contribution: 15, detail: "61% of events classified as High or Critical" }
    ],
    safetyEvents: [
      {
        id: "EVT-2026-0891",
        deviceId: "MD-1024",
        date: "2026-08-31",
        eventType: "Recall",
        severity: "CRITICAL",
        manufacturer: "Abbott Laboratories",
        summary: "Voluntary Class I Recall issued due to potential motor rotor binding during high-flow operation.",
        reportNumber: "FDA-RCL-2026-9901",
        affectedComponents: ["Motor Drive Assembly", "Bearing Seals"],
        actionRequired: "Immediate physical inspection and bearing tolerance check required."
      },
      {
        id: "EVT-2025-1114",
        deviceId: "MD-1024",
        date: "2025-11-14",
        eventType: "Malfunction",
        severity: "HIGH",
        manufacturer: "Abbott Laboratories",
        summary: "Intermittent flow rate deviation (+14.2%) detected during pre-op calibration check.",
        reportNumber: "FDA-MAL-2025-4412",
        affectedComponents: ["Optical Speed Transducer"],
        actionRequired: "Recalibrate speed sensor array."
      },
      {
        id: "EVT-2024-0520",
        deviceId: "MD-1024",
        date: "2024-05-20",
        eventType: "Safety Alert",
        severity: "HIGH",
        manufacturer: "Abbott Laboratories",
        summary: "Field safety alert regarding drive console heat dissipation under continuous high load.",
        reportNumber: "FDA-ALT-2024-1002",
        affectedComponents: ["Enclosure Fan Unit"],
        actionRequired: "Clean intake air filters quarterly."
      },
      {
        id: "EVT-2022-0915",
        deviceId: "MD-1024",
        date: "2022-09-15",
        eventType: "Field Safety Notice",
        severity: "MEDIUM",
        manufacturer: "Abbott Laboratories",
        summary: "Firmware v3.1 update addressing rare checksum error during startup boot sequence.",
        reportNumber: "FSN-2022-088",
        affectedComponents: ["Main Controller MCU"],
        actionRequired: "Update firmware to v3.1.4."
      }
    ],
    recommendation: {
      level: "CRITICAL",
      title: "Prioritize immediate equipment review and inspection.",
      actionSteps: [
        "Temporarily remove device from clinical scheduling roster.",
        "Perform full teardown inspection of motor rotor bearings and seals.",
        "Verify compliance against FDA Class I recall advisory #FDA-RCL-2026-9901."
      ],
      inspectionPriority: "Immediate",
      suggestedIntervalDays: 1
    }
  },
  {
    id: "MD-2050",
    name: "GE Revolution Apex CT Scanner",
    type: "Computed Tomography",
    manufacturer: "GE Healthcare",
    model: "Apex 256-Slice",
    country: "USA",
    serialNumber: "SN-GE-98821-X",
    installDate: "2022-03-15",
    firstRecordedEvent: "2022-07-04",
    lastEventDate: "2026-08-25",
    riskScore: 88,
    riskLevel: "CRITICAL",
    modelConfidence: 96,
    totalSafetyEvents: 14,
    primaryFailureMode: "X-Ray Tube Target Anode Thermal Overload & Rotor Bearing Wear",
    hospitalWing: "Radiology & Imaging",
    room: "Radiology Suite 2",
    assignedEngineer: {
      name: "Dr. Marcus Vance",
      role: "Lead Biomedical Systems Engineer",
      contact: "marcus.vance@medguard.health"
    },
    riskFactors: [
      { factor: "Previous Safety Events", contribution: 36, detail: "14 historical thermal and bearing safety events" },
      { factor: "Device Problem History", contribution: 30, detail: "High tube arc frequency during cardiac protocol scans" },
      { factor: "Manufacturer Pattern", contribution: 20, detail: "Anode housing thermal excursion warnings across Apex fleet" },
      { factor: "Event Severity Ratio", contribution: 14, detail: "57% of events logged as High Severity" }
    ],
    safetyEvents: [
      {
        id: "EVT-2026-0825",
        deviceId: "MD-2050",
        date: "2026-08-25",
        eventType: "Safety Alert",
        severity: "CRITICAL",
        manufacturer: "GE Healthcare",
        summary: "Thermal sensor cutoff triggered during high-dose contrast cardiac protocols.",
        reportNumber: "FDA-ALT-2026-8802",
        affectedComponents: ["X-Ray Tube Anode Assembly"],
        actionRequired: "Inspect coolant circulation pump and purger."
      },
      {
        id: "EVT-2025-1010",
        deviceId: "MD-2050",
        date: "2025-10-10",
        eventType: "Malfunction",
        severity: "HIGH",
        manufacturer: "GE Healthcare",
        summary: "Excessive acoustic vibration detected during 256-slice gantry rotation.",
        reportNumber: "FDA-MAL-2025-3390",
        affectedComponents: ["Gantry Bearing Track"],
        actionRequired: "Perform dynamic balancing and lubrication."
      },
      {
        id: "EVT-2023-1201",
        deviceId: "MD-2050",
        date: "2023-12-01",
        eventType: "Recall",
        severity: "HIGH",
        manufacturer: "GE Healthcare",
        summary: "Field safety recall for tube oil cooler gasket seal replacement.",
        reportNumber: "FDA-RCL-2023-1022",
        affectedComponents: ["Coolant Loop Gasket"],
        actionRequired: "Replace rubber gasket assembly."
      }
    ],
    recommendation: {
      level: "CRITICAL",
      title: "Prioritize immediate equipment review and inspection.",
      actionSteps: [
        "Restrict scanner from high-heat 256-slice cardiac scan protocols.",
        "Dispatch lead CT biomedical technician for thermal camera baseline audit.",
        "Replace liquid-cooled tube rotor bearing kit if vibration exceeds 3.5 mm/s."
      ],
      inspectionPriority: "Immediate",
      suggestedIntervalDays: 2
    }
  },
  {
    id: "MD-3109",
    name: "Medtronic Puritan Bennett 980 Ventilator",
    type: "ICU Ventilator",
    manufacturer: "Medtronic",
    model: "PB980-Dual",
    country: "USA",
    serialNumber: "SN-MDT-44102-V",
    installDate: "2023-01-10",
    firstRecordedEvent: "2023-04-18",
    lastEventDate: "2026-08-19",
    riskScore: 78,
    riskLevel: "HIGH",
    modelConfidence: 91,
    totalSafetyEvents: 11,
    primaryFailureMode: "Expiratory Flow Transducer Calibration Drift & Solenoid Hysteresis",
    hospitalWing: "ICU Wing A",
    room: "ICU Bed 104",
    assignedEngineer: {
      name: "Sarah Jenkins, CBET",
      role: "Senior ICU Biomedical Specialist",
      contact: "sarah.jenkins@medguard.health"
    },
    riskFactors: [
      { factor: "Previous Safety Events", contribution: 34, detail: "11 flow sensor drift and valve hysteresis events" },
      { factor: "Device Problem History", contribution: 32, detail: "Expiratory volume measurement drift exceeding 15%" },
      { factor: "Manufacturer Pattern", contribution: 19, detail: "Transducer cassette recalibration advisories issued globally" },
      { factor: "Event Severity Ratio", contribution: 15, detail: "45% classified as High Severity" }
    ],
    safetyEvents: [
      {
        id: "EVT-2026-0819",
        deviceId: "MD-3109",
        date: "2026-08-19",
        eventType: "Safety Alert",
        severity: "HIGH",
        manufacturer: "Medtronic",
        summary: "Field notice regarding expiratory flow sensor zero-point drift under high humidity.",
        reportNumber: "FDA-ALT-2026-7711",
        affectedComponents: ["Expiratory Flow Cassette"],
        actionRequired: "Recalibrate cassette before clinical reuse."
      },
      {
        id: "EVT-2025-0604",
        deviceId: "MD-3109",
        date: "2025-06-04",
        eventType: "Malfunction",
        severity: "MEDIUM",
        manufacturer: "Medtronic",
        summary: "Proportional valve hysteresis warning during routine 12-point EST compliance check.",
        reportNumber: "FDA-MAL-2025-1102",
        affectedComponents: ["Proportional Solenoid Valve"],
        actionRequired: "Perform valve seat cleaning."
      }
    ],
    recommendation: {
      level: "HIGH",
      title: "Prioritize preventive inspection.",
      actionSteps: [
        "Schedule comprehensive 12-point EST (Extended Self Test) compliance check.",
        "Inspect and recalibrate expiratory flow sensor cassette.",
        "Replace expiratory valve seal kit if pressure drift exceeds 5 cmH2O."
      ],
      inspectionPriority: "High",
      suggestedIntervalDays: 7
    }
  },
  {
    id: "MD-4082",
    name: "Dräger Perseus A500 Anesthesia Workstation",
    type: "Anesthesia System",
    manufacturer: "Dräger",
    model: "Perseus A500",
    country: "Germany",
    serialNumber: "SN-DRG-11029-A",
    installDate: "2021-11-20",
    firstRecordedEvent: "2022-02-14",
    lastEventDate: "2026-08-12",
    riskScore: 74,
    riskLevel: "HIGH",
    modelConfidence: 93,
    totalSafetyEvents: 9,
    primaryFailureMode: "O2 Galvanic Fuel Cell Voltage Decay & Piston Seal Leakage",
    hospitalWing: "Operating Rooms",
    room: "OR Suite 3",
    assignedEngineer: {
      name: "Alex Rivera",
      role: "Surgical Equipment Specialist",
      contact: "alex.rivera@medguard.health"
    },
    riskFactors: [
      { factor: "Previous Safety Events", contribution: 35, detail: "9 events logged including oxygen cell decay and piston leakage" },
      { factor: "Device Problem History", contribution: 31, detail: "O2 sensor voltage drop below 10 mV tolerance" },
      { factor: "Manufacturer Pattern", contribution: 18, detail: "Dräger field technical update for oxygen sensor lifetime limits" },
      { factor: "Event Severity Ratio", contribution: 16, detail: "55% High Severity events" }
    ],
    safetyEvents: [
      {
        id: "EVT-2026-0812",
        deviceId: "MD-4082",
        date: "2026-08-12",
        eventType: "Field Safety Notice",
        severity: "HIGH",
        manufacturer: "Dräger",
        summary: "Mandatory replacement schedule advisory for galvanic oxygen cell capsules.",
        reportNumber: "FSN-2026-DRG-04",
        affectedComponents: ["Dual Galvanic O2 Cell"],
        actionRequired: "Replace sensor capsule every 12 months."
      },
      {
        id: "EVT-2024-1130",
        deviceId: "MD-4082",
        date: "2024-11-30",
        eventType: "Malfunction",
        severity: "MEDIUM",
        manufacturer: "Dräger",
        summary: "Piston ventilator compliance leak rate logged at 42 mL/min during morning self-test.",
        reportNumber: "FDA-MAL-2024-9981",
        affectedComponents: ["Turbine Piston Gasket"],
        actionRequired: "Replace piston seal ring."
      }
    ],
    recommendation: {
      level: "HIGH",
      title: "Prioritize preventive inspection.",
      actionSteps: [
        "Replace dual galvanic oxygen sensing capsules.",
        "Perform automated system leak test prior to surgical anesthesia release.",
        "Verify vaporizer gas drive pressure."
      ],
      inspectionPriority: "High",
      suggestedIntervalDays: 7
    }
  },
  {
    id: "MD-5510",
    name: "Siemens Magnetom Vida 3T MRI Scanner",
    type: "MRI Scanner",
    manufacturer: "Siemens Healthineers",
    model: "Magnetom Vida 3T",
    country: "Germany",
    serialNumber: "SN-SIE-3T-8812",
    installDate: "2020-05-18",
    firstRecordedEvent: "2020-09-02",
    lastEventDate: "2026-08-05",
    riskScore: 68,
    riskLevel: "HIGH",
    modelConfidence: 89,
    totalSafetyEvents: 8,
    primaryFailureMode: "Cryogen Coldhead Compressor Pressure Drop & Gradient Thermal Spike",
    hospitalWing: "Radiology & Imaging",
    room: "MRI Bay 1",
    assignedEngineer: {
      name: "Dr. Marcus Vance",
      role: "Lead Biomedical Systems Engineer",
      contact: "marcus.vance@medguard.health"
    },
    riskFactors: [
      { factor: "Previous Safety Events", contribution: 37, detail: "8 events related to helium compressor pressure oscillations" },
      { factor: "Device Problem History", contribution: 28, detail: "Coldhead motor adsorber replacement interval exceeded" },
      { factor: "Manufacturer Pattern", contribution: 20, detail: "Siemens global service bulletin for cryo compressor maintenance" },
      { factor: "Event Severity Ratio", contribution: 15, detail: "50% High Severity events" }
    ],
    safetyEvents: [
      {
        id: "EVT-2026-0805",
        deviceId: "MD-5510",
        date: "2026-08-05",
        eventType: "Safety Alert",
        severity: "HIGH",
        manufacturer: "Siemens Healthineers",
        summary: "Helium compressor return pressure dropped to 1.85 Bar (Threshold: 2.20 Bar).",
        reportNumber: "FDA-ALT-2026-5501",
        affectedComponents: ["Sumitomo F-70 Cryo Compressor"],
        actionRequired: "Replace compressor adsorber unit."
      }
    ],
    recommendation: {
      level: "HIGH",
      title: "Prioritize preventive inspection.",
      actionSteps: [
        "Inspect helium compressor pressure and boil-off rate.",
        "Replace Sumitomo coldhead adsorber unit.",
        "Flush primary water chiller heat exchanger."
      ],
      inspectionPriority: "High",
      suggestedIntervalDays: 10
    }
  },
  {
    id: "MD-6204",
    name: "Baxter Sigma Spectrum Infusion Pump",
    type: "Infusion Pump",
    manufacturer: "Baxter",
    model: "Sigma Spectrum v8",
    country: "USA",
    serialNumber: "SN-BAX-99042-P",
    installDate: "2022-09-12",
    firstRecordedEvent: "2023-01-15",
    lastEventDate: "2026-07-28",
    riskScore: 54,
    riskLevel: "MEDIUM",
    modelConfidence: 88,
    totalSafetyEvents: 6,
    primaryFailureMode: "Peristaltic Motor Encoder Slippage & Li-Ion Battery Capacity Sag",
    hospitalWing: "NICU & Pediatrics",
    room: "NICU Suite 4",
    assignedEngineer: {
      name: "Elena Rostova",
      role: "Clinical Engineering Tech",
      contact: "elena.rostova@medguard.health"
    },
    riskFactors: [
      { factor: "Previous Safety Events", contribution: 34, detail: "6 events involving encoder slippage and battery resistance" },
      { factor: "Device Problem History", contribution: 29, detail: "Flow rate accuracy drift (+8.4%) reported during high-pressure infusions" },
      { factor: "Manufacturer Pattern", contribution: 22, detail: "Baxter recall notification for v8 battery latch contacts" },
      { factor: "Event Severity Ratio", contribution: 15, detail: "33% High / Medium events" }
    ],
    safetyEvents: [
      {
        id: "EVT-2026-0728",
        deviceId: "MD-6204",
        date: "2026-07-28",
        eventType: "Recall",
        severity: "MEDIUM",
        manufacturer: "Baxter",
        summary: "Class II Recall for battery latch contact corrosion preventing backup power charge.",
        reportNumber: "FDA-RCL-2026-4401",
        affectedComponents: ["14.4V Li-Ion Battery Pack"],
        actionRequired: "Clean contacts and replace battery assembly."
      }
    ],
    recommendation: {
      level: "MEDIUM",
      title: "Schedule a routine equipment review.",
      actionSteps: [
        "Clean linear peristaltic fingers and lubricate drive shaft.",
        "Test battery backup runtime under full load.",
        "Recalibrate occlusion pressure sensor."
      ],
      inspectionPriority: "Routine",
      suggestedIntervalDays: 14
    }
  },
  {
    id: "MD-7115",
    name: "Fresenius 5008S Hemodialysis Machine",
    type: "Hemodialysis System",
    manufacturer: "Fresenius Medical Care",
    model: "5008S CorDiax",
    country: "Germany",
    serialNumber: "SN-FMC-5008-H",
    installDate: "2021-08-01",
    firstRecordedEvent: "2022-03-10",
    lastEventDate: "2026-07-14",
    riskScore: 48,
    riskLevel: "MEDIUM",
    modelConfidence: 87,
    totalSafetyEvents: 5,
    primaryFailureMode: "Blood Pump Segment Wear & Ultrafiltration Balancing Chamber Drift",
    hospitalWing: "Nephrology & Dialysis",
    room: "Dialysis Bay 3",
    assignedEngineer: {
      name: "Elena Rostova",
      role: "Clinical Engineering Tech",
      contact: "elena.rostova@medguard.health"
    },
    riskFactors: [
      { factor: "Previous Safety Events", contribution: 33, detail: "5 historical events involving balance chamber recalibrations" },
      { factor: "Device Problem History", contribution: 30, detail: "Ultrafiltration rate tolerance alarms" },
      { factor: "Manufacturer Pattern", contribution: 21, detail: "Fresenius technical service update on blood pump rotor rollers" },
      { factor: "Event Severity Ratio", contribution: 16, detail: "20% High Severity events" }
    ],
    safetyEvents: [
      {
        id: "EVT-2026-0714",
        deviceId: "MD-7115",
        date: "2026-07-14",
        eventType: "Safety Alert",
        severity: "MEDIUM",
        manufacturer: "Fresenius Medical Care",
        summary: "Service alert for ultrafiltration balancing chamber differential pressure monitoring.",
        reportNumber: "FDA-ALT-2026-3302",
        affectedComponents: ["UF Balance Chamber Valves"],
        actionRequired: "Calibrate balance chamber pressure transducers."
      }
    ],
    recommendation: {
      level: "MEDIUM",
      title: "Schedule a routine equipment review.",
      actionSteps: [
        "Perform quarterly hydraulic balance check.",
        "Inspect blood pump tubing segment for mechanical wear.",
        "Verify conductivity cell calibration."
      ],
      inspectionPriority: "Routine",
      suggestedIntervalDays: 21
    }
  },
  {
    id: "MD-8002",
    name: "Philips HeartStart XL Defibrillator",
    type: "Defibrillator",
    manufacturer: "Philips Healthcare",
    model: "HeartStart XL+",
    country: "Netherlands",
    serialNumber: "SN-PH-DEF-8002",
    installDate: "2022-05-10",
    firstRecordedEvent: "2023-08-01",
    lastEventDate: "2026-06-20",
    riskScore: 28,
    riskLevel: "LOW",
    modelConfidence: 92,
    totalSafetyEvents: 2,
    primaryFailureMode: "High-Voltage Capacitor Charge Time Degradation",
    hospitalWing: "Emergency Department",
    room: "Trauma Room 1",
    assignedEngineer: {
      name: "Alex Rivera",
      role: "Surgical Equipment Specialist",
      contact: "alex.rivera@medguard.health"
    },
    riskFactors: [
      { factor: "Previous Safety Events", contribution: 30, detail: "2 low-severity routine events" },
      { factor: "Device Problem History", contribution: 25, detail: "Minor battery contact oxidation" },
      { factor: "Manufacturer Pattern", contribution: 25, detail: "Low overall failure rate across HeartStart XL series" },
      { factor: "Event Severity Ratio", contribution: 20, detail: "0% Critical events" }
    ],
    safetyEvents: [
      {
        id: "EVT-2026-0620",
        deviceId: "MD-8002",
        date: "2026-06-20",
        eventType: "Field Safety Notice",
        severity: "LOW",
        manufacturer: "Philips Healthcare",
        summary: "Routine paddle contact pad cleaning recommendation.",
        reportNumber: "FSN-PH-2026-11",
        affectedComponents: ["External Paddle Contacts"],
        actionRequired: "Wipe paddle contacts with alcohol swab."
      }
    ],
    recommendation: {
      level: "LOW",
      title: "Continue routine monitoring.",
      actionSteps: [
        "Maintain standard monthly 200J self-test protocol.",
        "Check battery expiration date.",
        "Inspect therapy cable continuity."
      ],
      inspectionPriority: "Normal",
      suggestedIntervalDays: 30
    }
  },
  {
    id: "MD-9104",
    name: "Atom Medical Dual Incu i Neonatal Incubator",
    type: "Infant Incubator",
    manufacturer: "Atom Medical",
    model: "Dual Incu i",
    country: "Japan",
    serialNumber: "SN-ATM-50123",
    installDate: "2023-03-22",
    firstRecordedEvent: "2024-01-10",
    lastEventDate: "2026-05-18",
    riskScore: 18,
    riskLevel: "LOW",
    modelConfidence: 95,
    totalSafetyEvents: 1,
    primaryFailureMode: "Nominal Operating Condition - Routine Filter Inspection",
    hospitalWing: "NICU & Pediatrics",
    room: "NICU Bay 2",
    assignedEngineer: {
      name: "Elena Rostova",
      role: "Clinical Engineering Tech",
      contact: "elena.rostova@medguard.health"
    },
    riskFactors: [
      { factor: "Previous Safety Events", contribution: 25, detail: "1 routine filter replacement logged" },
      { factor: "Device Problem History", contribution: 25, detail: "No telemetry thermal deviations" },
      { factor: "Manufacturer Pattern", contribution: 25, detail: "High baseline reliability rating" },
      { factor: "Event Severity Ratio", contribution: 25, detail: "100% Low Severity" }
    ],
    safetyEvents: [
      {
        id: "EVT-2026-0518",
        deviceId: "MD-9104",
        date: "2026-05-18",
        eventType: "Field Safety Notice",
        severity: "LOW",
        manufacturer: "Atom Medical",
        summary: "HEPA air intake filter scheduled quarterly replacement advisory.",
        reportNumber: "FSN-ATM-2026-02",
        affectedComponents: ["HEPA Air Filter"],
        actionRequired: "Replace air intake filter element."
      }
    ],
    recommendation: {
      level: "LOW",
      title: "Continue routine monitoring.",
      actionSteps: [
        "Perform scheduled quarterly HEPA intake air filter change.",
        "Verify skin temperature probe calibration against reference thermometer."
      ],
      inspectionPriority: "Normal",
      suggestedIntervalDays: 60
    }
  },
  {
    id: "MD-9801",
    name: "Covidien ForceTriad Electrosurgical Generator",
    type: "Electrosurgical Generator",
    manufacturer: "Medtronic / Covidien",
    model: "ForceTriad ESU",
    country: "USA",
    serialNumber: "SN-COV-70291",
    installDate: "2022-01-14",
    firstRecordedEvent: "2023-05-12",
    lastEventDate: "2026-04-10",
    riskScore: 12,
    riskLevel: "LOW",
    modelConfidence: 96,
    totalSafetyEvents: 1,
    primaryFailureMode: "Nominal Operating Condition - Monopolar Output Baseline OK",
    hospitalWing: "Operating Rooms",
    room: "OR Suite 2",
    assignedEngineer: {
      name: "Alex Rivera",
      role: "Surgical Equipment Specialist",
      contact: "alex.rivera@medguard.health"
    },
    riskFactors: [
      { factor: "Previous Safety Events", contribution: 25, detail: "1 low severity advisory" },
      { factor: "Device Problem History", contribution: 25, detail: "Zero RF power output faults" },
      { factor: "Manufacturer Pattern", contribution: 25, detail: "Stable fleet history" },
      { factor: "Event Severity Ratio", contribution: 25, detail: "100% Low Severity" }
    ],
    safetyEvents: [
      {
        id: "EVT-2026-0410",
        deviceId: "MD-9801",
        date: "2026-04-10",
        eventType: "Field Safety Notice",
        severity: "LOW",
        manufacturer: "Medtronic / Covidien",
        summary: "Footswitch cable strain relief check advisory.",
        reportNumber: "FSN-COV-2026-01",
        affectedComponents: ["Monopolar Footswitch Cable"],
        actionRequired: "Inspect footswitch connector housing."
      }
    ],
    recommendation: {
      level: "LOW",
      title: "Continue routine monitoring.",
      actionSteps: [
        "Perform standard annual RF power output calibration test.",
        "Inspect REM return electrode monitor circuit."
      ],
      inspectionPriority: "Normal",
      suggestedIntervalDays: 90
    }
  }
];

export const DEVICE_TYPES = [
  "All Types",
  "Cardiovascular Pump",
  "Computed Tomography",
  "ICU Ventilator",
  "Anesthesia System",
  "MRI Scanner",
  "Infusion Pump",
  "Hemodialysis System",
  "Defibrillator",
  "Infant Incubator",
  "Electrosurgical Generator"
];

export const MANUFACTURERS = [
  "All Manufacturers",
  "Abbott Laboratories",
  "GE Healthcare",
  "Medtronic",
  "Dräger",
  "Siemens Healthineers",
  "Baxter",
  "Fresenius Medical Care",
  "Philips Healthcare",
  "Atom Medical",
  "Medtronic / Covidien"
];

export const COUNTRIES = [
  "All Countries",
  "USA",
  "Germany",
  "Japan",
  "Netherlands",
  "UK"
];

export const HOSPITAL_WINGS = [
  "All Wings",
  "Cardiology & Surgery",
  "Radiology & Imaging",
  "ICU Wing A",
  "Operating Rooms",
  "NICU & Pediatrics",
  "Nephrology & Dialysis",
  "Emergency Department"
];

// Historical Risk Trend mock dataset (7 Days, 30 Days, 90 Days, 1 Year)
export const HISTORICAL_RISK_TRENDS = {
  "7D": [
    { date: "Aug 25", critical: 2, high: 3, medium: 2, low: 3, totalEvents: 4 },
    { date: "Aug 26", critical: 2, high: 3, medium: 2, low: 3, totalEvents: 2 },
    { date: "Aug 27", critical: 2, high: 3, medium: 2, low: 3, totalEvents: 5 },
    { date: "Aug 28", critical: 2, high: 3, medium: 2, low: 3, totalEvents: 1 },
    { date: "Aug 29", critical: 2, high: 3, medium: 2, low: 3, totalEvents: 3 },
    { date: "Aug 30", critical: 2, high: 3, medium: 2, low: 3, totalEvents: 6 },
    { date: "Aug 31", critical: 2, high: 3, medium: 2, low: 3, totalEvents: 8 }
  ],
  "30D": [
    { date: "Aug 01", critical: 1, high: 4, medium: 3, low: 2, totalEvents: 12 },
    { date: "Aug 07", critical: 1, high: 4, medium: 3, low: 2, totalEvents: 15 },
    { date: "Aug 14", critical: 2, high: 3, medium: 2, low: 3, totalEvents: 18 },
    { date: "Aug 21", critical: 2, high: 3, medium: 2, low: 3, totalEvents: 21 },
    { date: "Aug 31", critical: 2, high: 3, medium: 2, low: 3, totalEvents: 29 }
  ],
  "90D": [
    { date: "Jun 2026", critical: 1, high: 2, medium: 4, low: 3, totalEvents: 45 },
    { date: "Jul 2026", critical: 2, high: 3, medium: 3, low: 2, totalEvents: 52 },
    { date: "Aug 2026", critical: 2, high: 3, medium: 2, low: 3, totalEvents: 64 }
  ],
  "1Y": [
    { date: "Q3 2025", critical: 0, high: 2, medium: 5, low: 3, totalEvents: 110 },
    { date: "Q4 2025", critical: 1, high: 2, medium: 4, low: 3, totalEvents: 135 },
    { date: "Q1 2026", critical: 1, high: 3, medium: 3, low: 3, totalEvents: 158 },
    { date: "Q2 2026", critical: 2, high: 3, medium: 3, low: 2, totalEvents: 182 },
    { date: "Q3 2026", critical: 2, high: 3, medium: 2, low: 3, totalEvents: 215 }
  ]
};

// Model SHAP Global Contributors
export const GLOBAL_RISK_FACTORS = [
  { factor: "Previous Safety Events", impact: 38, color: "#ef4444", description: "Cumulative count of past recalls, malfunctions, and safety alerts logged for device" },
  { factor: "Device Problem History", impact: 29, color: "#f97316", description: "Frequency of specific mechanical, electrical, or sensor component failure modes" },
  { factor: "Manufacturer Pattern", impact: 18, color: "#f59e0b", description: "Global recall & field safety alert rates across manufacturer's production lot" },
  { factor: "Event Severity Ratio", impact: 15, color: "#06b6d4", description: "Proportion of historical events rated as High or Critical vs Low severity" }
];
