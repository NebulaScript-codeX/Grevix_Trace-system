import React from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { 
  Home,
  LayoutDashboard, 
  Lightbulb, 
  Bookmark, 
  Network, 
  CheckSquare, 
  Library, 
  ShieldAlert, 
  Search, 
  History, 
  Layers, 
  Settings,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { NavigationTab } from '../types';
import { TraceLogo } from './brand/TraceLogo';
import { TraviRobotLogo } from './brand/TraviRobotLogo';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (c: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const { activeTab, setActiveTab, metrics, resetDemoWorkspace, setDemoModalOpen, setDemoStep, setTraviOpen } = useWorkspace();

  const navItems: { tab: NavigationTab; label: string; icon: React.FC<{ className?: string }>; count?: number; countColor?: string }[] = [
    { tab: 'home', label: 'Overview & Vision', icon: TraceLogo },
    { tab: 'travi', label: 'TRAVI Assistant', icon: TraviRobotLogo, countColor: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' },
    { tab: 'command-center', label: 'Command Center', icon: LayoutDashboard },
    { 
      tab: 'intelligence-center', 
      label: 'Intelligence Center', 
      icon: Lightbulb, 
      count: metrics.openFindings, 
      countColor: metrics.criticalFindings > 0 ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-slate-800 text-slate-300' 
    },
    { tab: 'memory-center', label: 'Memory Center', icon: Bookmark, count: metrics.totalMemories },
    { tab: 'context-graph', label: 'Context Graph', icon: Network },
    { 
      tab: 'action-board', 
      label: 'Action Board', 
      icon: CheckSquare, 
      count: metrics.pendingActions,
      countColor: 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
    },
    { tab: 'source-library', label: 'Source Library', icon: Library, count: metrics.totalSources },
    { 
      tab: 'trust-risk', 
      label: 'Trust & Risk', 
      icon: ShieldAlert, 
      count: metrics.unreviewedRisks,
      countColor: 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
    },
    { tab: 'universal-search', label: 'Universal Search', icon: Search },
    { tab: 'timeline-audit', label: 'Timeline & Audit', icon: History },
    { tab: 'integrations', label: 'Integrations & Perms', icon: Layers },
    { tab: 'settings', label: 'Settings & Privacy', icon: Settings }
  ];

  return (
    <aside
      className={`h-[calc(100vh-4rem)] bg-[#070b14] border-r border-slate-800/80 flex flex-col transition-all duration-200 shrink-0 sticky top-16 z-20 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Sidebar header toggle */}
      <div className="p-3 border-b border-slate-800/60 flex items-center justify-between">
        {!collapsed && (
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2">
            Navigation
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/80 transition-colors ${collapsed ? 'mx-auto' : ''}`}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav List */}
      <nav className="p-2 space-y-1 flex-1 overflow-y-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.tab;

          return (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-blue-600/15 text-blue-400 font-semibold border border-blue-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
              
              {!collapsed && (
                <div className="flex-1 flex items-center justify-between min-w-0">
                  <span className="truncate">{item.label}</span>
                  {item.count !== undefined && item.count > 0 && (
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${item.countColor || 'bg-slate-800/80 text-slate-400'}`}>
                      {item.count}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Signature CTA shortcut */}
      {!collapsed && (
        <div className="p-3 mx-2 mb-2 rounded-xl bg-blue-950/30 border border-blue-500/20 text-xs">
          <div className="flex items-center gap-1.5 text-blue-400 font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hackathon Demo</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-tight mb-2">
            Experience the automated deadline resolution flow.
          </p>
          <button
            onClick={() => {
              setDemoStep(1);
              setDemoModalOpen(true);
            }}
            className="w-full py-1.5 px-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-[11px] transition-colors"
          >
            Launch Demo Flow
          </button>
        </div>
      )}

      {/* Bottom controls */}
      <div className="p-2 border-t border-slate-800/60 space-y-1">
        <button
          onClick={resetDemoWorkspace}
          className={`w-full flex items-center gap-3 px-3 py-2 text-xs text-slate-400 hover:text-rose-300 hover:bg-rose-950/20 rounded-xl transition-colors ${
            collapsed ? 'justify-center' : ''
          }`}
          title="Reset Demo State"
        >
          <RotateCcw className="w-3.5 h-3.5 shrink-0 text-slate-400 group-hover:text-rose-300" />
          {!collapsed && <span className="truncate">Reset Demo State</span>}
        </button>

        {!collapsed && (
          <div className="px-3 py-2 flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-semibold text-slate-300">
              LD
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-slate-300 truncate">Lead Director</div>
              <div className="text-[10px] text-slate-500 truncate">Local Demo Authority</div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
