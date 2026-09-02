import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import PredictView from './components/PredictView';
import CTAnalysisView from './components/CTAnalysisView';
import DevicesView from './components/DevicesView';
import HistoryView from './components/HistoryView';
import AnalyticsView from './components/AnalyticsView';
import ReportsView from './components/ReportsView';
import SettingsView from './components/SettingsView';
import DeviceDetailView from './components/DeviceDetailView';
import HelpModal from './components/HelpModal';
import { INITIAL_DEVICES } from './data/medicalDevices';

export default function App() {
  const [devices, setDevices] = useState(INITIAL_DEVICES);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Prediction History in localStorage
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('medguard_prediction_history');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('medguard_prediction_history', JSON.stringify(history));
    } catch (e) {
      console.warn("Failed to persist history:", e);
    }
  }, [history]);

  const handleSaveToHistory = (predictionRecord) => {
    setHistory(prev => [predictionRecord, ...prev.slice(0, 49)]); // Keep last 50
  };

  const handleDeleteHistoryItem = (id) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans antialiased radar-grid">
      
      {/* Top Navigation Header */}
      <Header 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenHelp={() => setShowHelpModal(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
        
        {/* Dashboard View */}
        {activeTab === 'dashboard' && (
          <DashboardView 
            onNavigateToPredict={() => setActiveTab('predict')}
            onNavigateToCT={() => setActiveTab('ct-analysis')}
            onNavigateToDevices={() => setActiveTab('devices')}
            onNavigateToAlerts={() => setActiveTab('analytics')}
          />
        )}

        {/* Model 1: General Equipment Prediction View */}
        {activeTab === 'predict' && (
          <PredictView 
            onSaveToHistory={handleSaveToHistory}
          />
        )}

        {/* Model 2: CT Scanner Analysis View */}
        {activeTab === 'ct-analysis' && (
          <CTAnalysisView 
            onSaveToHistory={handleSaveToHistory}
          />
        )}

        {/* Devices View */}
        {activeTab === 'devices' && (
          <DevicesView 
            onSelectDevice={(device) => setSelectedDevice(device)}
          />
        )}

        {/* Prediction History View */}
        {activeTab === 'history' && (
          <HistoryView 
            history={history}
            onDeleteHistoryItem={handleDeleteHistoryItem}
            onClearHistory={handleClearHistory}
          />
        )}

        {/* Analytics View */}
        {activeTab === 'analytics' && (
          <AnalyticsView 
            devices={devices}
          />
        )}

        {/* Reports View */}
        {activeTab === 'reports' && (
          <ReportsView />
        )}

        {/* Settings View */}
        {activeTab === 'settings' && (
          <SettingsView />
        )}

      </main>

      {/* Device Detail Modal */}
      {selectedDevice && (
        <DeviceDetailView 
          device={selectedDevice}
          onClose={() => setSelectedDevice(null)}
        />
      )}

      {/* Platform Workflow Help Guide Modal */}
      {showHelpModal && (
        <HelpModal 
          onClose={() => setShowHelpModal(false)}
        />
      )}

      {/* Global Footer */}
      <footer className="glass-panel border-t border-slate-900 py-4 px-6 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 MedGuard AI • Medical Equipment Command Center</span>
          <span className="text-cyan-500/80 font-mono">Cognizant Hackathon • Healthcare Track</span>
        </div>
      </footer>

    </div>
  );
}
