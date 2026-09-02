import React, { useState } from 'react';
import { 
  Zap, 
  UserCheck, 
  Package, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  DollarSign, 
  ShieldCheck, 
  Wrench, 
  Plus,
  Send,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function WorkOrdersTab({ devices, focusDevice }) {
  const [workOrders, setWorkOrders] = useState([
    {
      id: "WO-2026-8801",
      deviceId: "DEV-CT-9901",
      deviceName: "GE Revolution Apex CT Scanner",
      wing: "Radiology & Imaging",
      priority: "CRITICAL",
      techName: "Dr. Marcus Vance",
      techRole: "Lead Biomedical Systems Engineer",
      partRequired: "Liquid-Cooled Tube Rotor Bearing (P/N GE-CT99-X)",
      status: "DISPATCHED",
      createdTime: "2026-08-24 10:15 AM",
      slaMinutes: 45,
      costEstimate: 8450
    },
    {
      id: "WO-2026-8802",
      deviceId: "DEV-VENT-402",
      deviceName: "Medtronic Puritan Bennett 980 Ventilator",
      wing: "ICU Wing A",
      priority: "WARNING",
      techName: "Sarah Jenkins, CBET",
      techRole: "Senior ICU Biomedical Specialist",
      partRequired: "Expiratory Valve Transducer (P/N PB-VALVE-980)",
      status: "IN_PROGRESS",
      createdTime: "2026-08-24 11:30 AM",
      slaMinutes: 90,
      costEstimate: 2100
    },
    {
      id: "WO-2026-8803",
      deviceId: "DEV-ANES-101",
      deviceName: "Dräger Perseus A500 Anesthesia Workstation",
      wing: "Operating Rooms",
      priority: "CRITICAL",
      techName: "Alex Rivera",
      techRole: "Surgical Equipment Specialist",
      partRequired: "Dual Galvanic Oxygen Sensor (P/N DRG-O2-CELL)",
      status: "PENDING_APPROVAL",
      createdTime: "2026-08-24 12:00 PM",
      slaMinutes: 30,
      costEstimate: 1850
    }
  ]);

  const [selectedTicketDevice, setSelectedTicketDevice] = useState(focusDevice || devices[0]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [dispatchSuccessToast, setDispatchSuccessToast] = useState(null);

  // Dispatch work order trigger with confetti
  const handleApproveDispatch = (orderId) => {
    setWorkOrders(prev => prev.map(wo => {
      if (wo.id === orderId) {
        return { ...wo, status: 'DISPATCHED' };
      }
      return wo;
    }));

    // Trigger celebration confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    setDispatchSuccessToast(`Work Order ${orderId} successfully dispatched! Biomedical Engineer notified.`);
    setTimeout(() => setDispatchSuccessToast(null), 4000);
  };

  const handleCreateNewOrder = () => {
    const newWo = {
      id: `WO-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      deviceId: selectedTicketDevice.id,
      deviceName: selectedTicketDevice.name,
      wing: selectedTicketDevice.wing,
      priority: selectedTicketDevice.status,
      techName: selectedTicketDevice.assignedTech.name,
      techRole: selectedTicketDevice.assignedTech.role,
      partRequired: `${selectedTicketDevice.requiredPart.name} (${selectedTicketDevice.requiredPart.partNumber})`,
      status: "DISPATCHED",
      createdTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      slaMinutes: 60,
      costEstimate: selectedTicketDevice.requiredPart.estimatedCost
    };

    setWorkOrders([newWo, ...workOrders]);
    setShowCreateModal(false);

    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 }
    });

    setDispatchSuccessToast(`Dispatched Emergency Ticket for ${selectedTicketDevice.name}!`);
    setTimeout(() => setDispatchSuccessToast(null), 4000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Toast Banner */}
      {dispatchSuccessToast && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 flex items-center justify-between text-xs font-bold shadow-lg shadow-emerald-500/10 animate-bounce">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {dispatchSuccessToast}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-emerald-400">FDA 21 CFR Compliant</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
            Biomedical Asset Operations
          </span>
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mt-0.5">
            <Zap className="w-5 h-5 text-cyan-400" />
            Automated Maintenance Dispatch & Work Orders
          </h2>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition"
        >
          <Plus className="w-4 h-4" /> Create Emergency Work Order
        </button>
      </div>

      {/* ROI & Financial Downtime Prevention Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase">Avoided Clinical Downtime</span>
            <h4 className="text-2xl font-black text-emerald-400 mt-1">$485,000</h4>
            <span className="text-[11px] text-slate-400">YTD Savings from Predictive Repair</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase">Surgeries Preserved</span>
            <h4 className="text-2xl font-black text-cyan-400 mt-1">34 Surgeries</h4>
            <span className="text-[11px] text-slate-400">Zero Unplanned Cancellations</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase">Avg Repair SLA</span>
            <h4 className="text-2xl font-black text-amber-400 mt-1">38 Mins</h4>
            <span className="text-[11px] text-slate-400">Industry Avg: 4.2 Hours</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Clock className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Active Work Orders Queue List */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Wrench className="w-5 h-5 text-cyan-400" />
          Active Work Orders & Technician Queue ({workOrders.length})
        </h3>

        <div className="space-y-3">
          {workOrders.map(wo => {
            const isCrit = wo.priority === 'CRITICAL';
            const isDispatched = wo.status === 'DISPATCHED' || wo.status === 'IN_PROGRESS';

            return (
              <div 
                key={wo.id}
                className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900/90 transition space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-cyan-400 px-2.5 py-1 rounded bg-slate-800">
                      {wo.id}
                    </span>
                    <div>
                      <h4 className="font-bold text-sm text-white">{wo.deviceName}</h4>
                      <p className="text-xs text-slate-400">{wo.wing} • Logged at {wo.createdTime}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 text-[10px] font-extrabold rounded-lg uppercase tracking-wider border ${
                      isCrit ? 'bg-rose-500/20 border-rose-500/50 text-rose-400' : 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                    }`}>
                      {wo.priority}
                    </span>

                    <span className={`px-3 py-1 text-[11px] font-bold rounded-lg uppercase tracking-wider ${
                      wo.status === 'DISPATCHED' 
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' 
                        : wo.status === 'IN_PROGRESS'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {wo.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-3 border-t border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                    <div>
                      <span className="text-slate-400 block text-[10px]">Assigned Engineer</span>
                      <strong className="text-slate-200">{wo.techName}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <span className="text-slate-400 block text-[10px]">Part Required</span>
                      <strong className="text-slate-200 truncate block max-w-[200px]">{wo.partRequired}</strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3">
                    <div className="text-right">
                      <span className="text-slate-400 block text-[10px]">SLA Target</span>
                      <strong className="text-cyan-400">&lt; {wo.slaMinutes} Mins</strong>
                    </div>

                    {!isDispatched && (
                      <button
                        onClick={() => handleApproveDispatch(wo.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-300 flex items-center gap-1 transition"
                      >
                        <Send className="w-3.5 h-3.5" /> Approve & Dispatch
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Create Work Order Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-panel max-w-lg w-full p-6 rounded-2xl border border-slate-700 space-y-5 animate-scaleUp">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-cyan-400" />
              Dispatch Emergency Work Order
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-1">Select Equipment</label>
                <select
                  value={selectedTicketDevice.id}
                  onChange={(e) => {
                    const found = devices.find(d => d.id === e.target.value);
                    if (found) setSelectedTicketDevice(found);
                  }}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-100 text-xs font-bold px-3 py-2.5 rounded-xl focus:outline-none focus:border-cyan-500"
                >
                  {devices.map(d => (
                    <option key={d.id} value={d.id} className="bg-slate-900">
                      {d.name} ({d.wing} - {d.status})
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5 text-xs">
                <p><strong className="text-slate-400">Assigned Tech:</strong> {selectedTicketDevice.assignedTech.name}</p>
                <p><strong className="text-slate-400">Required Part:</strong> {selectedTicketDevice.requiredPart.name}</p>
                <p><strong className="text-slate-400">In Stock:</strong> <span className="text-emerald-400 font-bold">{selectedTicketDevice.requiredPart.stockCount} Units</span></p>
                <p><strong className="text-slate-400">Est Downtime Saved:</strong> <span className="text-cyan-400 font-bold">${selectedTicketDevice.downtimeRiskCost.toLocaleString()}</span></p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateNewOrder}
                className="px-5 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20"
              >
                Confirm Dispatch
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
