import React, { useState, useEffect } from 'react';
import { WorkspaceProvider, useWorkspace } from './context/WorkspaceContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ToastContainer } from './components/Toast';
import { DetailModal } from './components/DetailModal';
import { DemoModal } from './components/DemoModal';
import { TraviDrawer } from './components/TraviDrawer';

// Views
import { LandingPage } from './components/views/LandingPage';
import { CommandCenter } from './components/views/CommandCenter';
import { IntelligenceCenter } from './components/views/IntelligenceCenter';
import { MemoryCenter } from './components/views/MemoryCenter';
import { ContextGraph } from './components/views/ContextGraph';
import { ActionBoard } from './components/views/ActionBoard';
import { SourceLibrary } from './components/views/SourceLibrary';
import { TrustRisk } from './components/views/TrustRisk';
import { UniversalSearch } from './components/views/UniversalSearch';
import { TimelineAudit } from './components/views/TimelineAudit';
import { IntegrationsPermissions } from './components/views/IntegrationsPermissions';
import { SettingsPrivacy } from './components/views/SettingsPrivacy';
import { TraviView } from './components/views/TraviView';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab } = useWorkspace();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Keyboard shortcut: Cmd+K / Ctrl+K opens Universal Search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setActiveTab('universal-search');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActiveTab]);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'home':
        return <LandingPage />;
      case 'command-center':
        return <CommandCenter />;
      case 'intelligence-center':
        return <IntelligenceCenter />;
      case 'memory-center':
        return <MemoryCenter />;
      case 'context-graph':
        return <ContextGraph />;
      case 'action-board':
        return <ActionBoard />;
      case 'source-library':
        return <SourceLibrary />;
      case 'trust-risk':
        return <TrustRisk />;
      case 'universal-search':
        return <UniversalSearch />;
      case 'timeline-audit':
        return <TimelineAudit />;
      case 'integrations':
        return <IntegrationsPermissions />;
      case 'settings':
        return <SettingsPrivacy />;
      case 'travi':
        return <TraviView />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Collapsible Sidebar */}
        <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

        {/* Content Viewport */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-[1560px] mx-auto w-full">
          {renderActiveView()}
        </main>
      </div>

      {/* Overlays & Modals */}
      <DetailModal />
      <DemoModal />
      <TraviDrawer />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <WorkspaceProvider>
      <AppContent />
    </WorkspaceProvider>
  );
}
