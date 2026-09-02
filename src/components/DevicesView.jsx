import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  RotateCcw, 
  Eye, 
  ChevronRight, 
  ArrowUpDown, 
  Globe, 
  Building2, 
  ShieldAlert, 
  Cpu,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { getDevices } from '../lib/api';
import { DEVICE_TYPES, MANUFACTURERS, COUNTRIES } from '../data/medicalDevices';

export default function DevicesView({ onSelectDevice, initialSearch = '' }) {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search States
  const [search, setSearch] = useState(initialSearch);
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedManufacturer, setSelectedManufacturer] = useState('All Manufacturers');
  const [selectedRiskLevel, setSelectedRiskLevel] = useState('All Levels');
  const [selectedCountry, setSelectedCountry] = useState('All Countries');
  const [selectedEventType, setSelectedEventType] = useState('All Event Types');

  // Sorting
  const [sortBy, setSortBy] = useState('riskScore');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    async function loadFilteredDevices() {
      setLoading(true);
      try {
        const data = await getDevices({
          search,
          deviceType: selectedType,
          manufacturer: selectedManufacturer,
          riskLevel: selectedRiskLevel,
          country: selectedCountry,
          eventType: selectedEventType,
          sortBy,
          sortOrder
        });
        setDevices(data);
      } catch (err) {
        console.error("Error fetching devices:", err);
      } finally {
        setLoading(false);
      }
    }

    loadFilteredDevices();
  }, [search, selectedType, selectedManufacturer, selectedRiskLevel, selectedCountry, selectedEventType, sortBy, sortOrder]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedType('All Types');
    setSelectedManufacturer('All Manufacturers');
    setSelectedRiskLevel('All Levels');
    setSelectedCountry('All Countries');
    setSelectedEventType('All Event Types');
    setSortBy('riskScore');
    setSortOrder('desc');
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
            Clinical Asset Inventory
          </span>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2 mt-0.5">
            <Cpu className="w-6 h-6 text-cyan-400" />
            Medical Devices
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Explore equipment, risk scores, manufacturers, and historical safety activity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
            Showing <strong className="text-cyan-400">{devices.length}</strong> Devices
          </span>

          {(search || selectedType !== 'All Types' || selectedManufacturer !== 'All Manufacturers' || selectedRiskLevel !== 'All Levels' || selectedCountry !== 'All Countries' || selectedEventType !== 'All Event Types') && (
            <button
              onClick={handleResetFilters}
              className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
        
        {/* Search Input Bar */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by Device ID, Name, Manufacturer, Model, or Country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-100 text-xs font-semibold placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition"
          />
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          
          {/* Device Type */}
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Device Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs font-semibold px-2.5 py-2 rounded-xl focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              {DEVICE_TYPES.map(t => (
                <option key={t} value={t} className="bg-slate-900">{t}</option>
              ))}
            </select>
          </div>

          {/* Manufacturer */}
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Manufacturer</label>
            <select
              value={selectedManufacturer}
              onChange={(e) => setSelectedManufacturer(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs font-semibold px-2.5 py-2 rounded-xl focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              {MANUFACTURERS.map(m => (
                <option key={m} value={m} className="bg-slate-900">{m}</option>
              ))}
            </select>
          </div>

          {/* Risk Level */}
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Risk Level</label>
            <select
              value={selectedRiskLevel}
              onChange={(e) => setSelectedRiskLevel(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs font-semibold px-2.5 py-2 rounded-xl focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="All Levels">All Risk Levels</option>
              <option value="CRITICAL">CRITICAL (85-100%)</option>
              <option value="HIGH">HIGH (70-84%)</option>
              <option value="MEDIUM">MEDIUM (30-69%)</option>
              <option value="LOW">LOW (0-29%)</option>
            </select>
          </div>

          {/* Country */}
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Country</label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs font-semibold px-2.5 py-2 rounded-xl focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              {COUNTRIES.map(c => (
                <option key={c} value={c} className="bg-slate-900">{c}</option>
              ))}
            </select>
          </div>

          {/* Event Type */}
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Event History</label>
            <select
              value={selectedEventType}
              onChange={(e) => setSelectedEventType(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs font-semibold px-2.5 py-2 rounded-xl focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="All Event Types">All Event Types</option>
              <option value="Recall">Recall</option>
              <option value="Malfunction">Malfunction</option>
              <option value="Safety Alert">Safety Alert</option>
              <option value="Field Safety Notice">Field Safety Notice</option>
            </select>
          </div>

        </div>
      </div>

      {/* Main Table / Grid Container */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        
        {loading ? (
          <div className="py-12 text-center text-slate-400 space-y-3">
            <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin mx-auto" />
            <p className="text-xs">Loading equipment safety registry...</p>
          </div>
        ) : devices.length === 0 ? (
          /* Empty State */
          <div className="py-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">No devices found</h3>
              <p className="text-xs text-slate-400 mt-1">No equipment matches your active search query or filter parameters.</p>
            </div>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-xl font-bold text-xs bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 transition"
            >
              Clear Filters & Retry
            </button>
          </div>
        ) : (
          /* Responsive Table View */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                  <th 
                    onClick={() => toggleSort('id')} 
                    className="py-3 px-3 cursor-pointer hover:text-white transition"
                  >
                    Device ID {sortBy === 'id' && (sortOrder === 'desc' ? '▼' : '▲')}
                  </th>
                  <th className="py-3 px-3">Device & Model</th>
                  <th className="py-3 px-3">Device Type</th>
                  <th className="py-3 px-3">Manufacturer</th>
                  <th className="py-3 px-3">Country</th>
                  <th 
                    onClick={() => toggleSort('riskScore')} 
                    className="py-3 px-3 cursor-pointer hover:text-white transition"
                  >
                    Risk Score {sortBy === 'riskScore' && (sortOrder === 'desc' ? '▼' : '▲')}
                  </th>
                  <th 
                    onClick={() => toggleSort('totalSafetyEvents')} 
                    className="py-3 px-3 cursor-pointer hover:text-white transition"
                  >
                    Safety Events {sortBy === 'totalSafetyEvents' && (sortOrder === 'desc' ? '▼' : '▲')}
                  </th>
                  <th className="py-3 px-3">Last Event</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {devices.map(device => {
                  const isCrit = device.riskLevel === 'CRITICAL';
                  const isHigh = device.riskLevel === 'HIGH';
                  const isMed = device.riskLevel === 'MEDIUM';

                  return (
                    <tr 
                      key={device.id}
                      onClick={() => onSelectDevice(device)}
                      className="hover:bg-slate-900/60 transition cursor-pointer group"
                    >
                      <td className="py-3.5 px-3 font-mono font-bold text-cyan-400">{device.id}</td>
                      <td className="py-3.5 px-3">
                        <strong className="text-slate-100 block">{device.name}</strong>
                        <span className="text-[10px] text-slate-400 font-mono">S/N: {device.serialNumber}</span>
                      </td>
                      <td className="py-3.5 px-3 text-slate-300">{device.type}</td>
                      <td className="py-3.5 px-3 text-slate-300 font-medium">{device.manufacturer}</td>
                      <td className="py-3.5 px-3 text-slate-400">{device.country}</td>
                      <td className="py-3.5 px-3">
                        <span className={`px-2.5 py-1 text-[11px] font-extrabold rounded-lg uppercase tracking-wider border inline-flex items-center gap-1 ${
                          isCrit 
                            ? 'bg-rose-500/20 border-rose-500/50 text-rose-400 pulse-critical' 
                            : isHigh 
                            ? 'bg-orange-500/20 border-orange-500/50 text-orange-400' 
                            : isMed 
                            ? 'bg-amber-500/20 border-amber-500/50 text-amber-400' 
                            : 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                        }`}>
                          {device.riskScore}% {device.riskLevel}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-slate-300 font-bold">{device.totalSafetyEvents} Events</td>
                      <td className="py-3.5 px-3 font-mono text-[11px] text-slate-400">{device.lastEventDate}</td>
                      <td className="py-3.5 px-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectDevice(device);
                          }}
                          className="px-3 py-1.5 text-xs font-bold bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 rounded-lg group-hover:border-cyan-400 transition"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  );
}
