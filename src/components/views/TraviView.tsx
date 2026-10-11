import React from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { TraviAssistant } from '../TraviAssistant';
import { TraviRobotLogo } from '../brand/TraviRobotLogo';
import { Sparkles, Database, ArrowRight } from 'lucide-react';

export const TraviView: React.FC = () => {
  const { setActiveTab, setDemoModalOpen, setDemoStep, metrics, settings, sources, memories } = useWorkspace();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <TraviRobotLogo className="w-12 h-12" />
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-0.5">
              <span>Context Intelligence Guide</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">TRAVI Assistant Console</h1>
            <p className="text-xs text-slate-400">
              A local demo assistant with predefined keyword responses over your browser workspace.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setDemoStep(1);
              setDemoModalOpen(true);
            }}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Launch Walkthrough</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Assistant and Context Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[720px]">
        {/* Left 2 Cols: Interactive TRAVI Chat */}
        <div className="lg:col-span-2 h-full">
          <TraviAssistant />
        </div>

        {/* Right 1 Col: Grounding Reference & Live Context Cards */}
        <div className="space-y-4 overflow-y-auto">
          {/* Grounding Scope Card */}
          <div className="p-5 rounded-2xl bg-[#0c1220] border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-blue-400" />
              <span>TRAVI Knowledge Perimeter</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              TRAVI uses predefined keyword responses and can look up {sources.length} local source records and {memories.length} memories. It does not connect to an AI service.
            </p>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <div>Active Workspace: <strong className="text-slate-200">{settings.workspaceName}</strong></div>
              <div>Authoritative Lead: <strong className="text-slate-200">Sarah Lin</strong></div>
              <div>Technical Authority: <strong className="text-slate-200">David Chen</strong></div>
            </div>
          </div>

          {/* Quick Context Shortcuts */}
          <div className="p-5 rounded-2xl bg-[#0c1220] border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Explore Underlying Modules
            </h3>
            <div className="space-y-2 text-xs">
              <button
                onClick={() => setActiveTab('intelligence-center')}
                className="w-full p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-between transition-colors text-left"
              >
                <div>
                  <div className="font-semibold text-white">Intelligence Center</div>
                  <div className="text-[11px] text-slate-400">{metrics.openFindings} active findings</div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => setActiveTab('context-graph')}
                className="w-full p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-between transition-colors text-left"
              >
                <div>
                  <div className="font-semibold text-white">Context Graph</div>
                  <div className="text-[11px] text-slate-400">Interactive visual node network</div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => setActiveTab('action-board')}
                className="w-full p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-between transition-colors text-left"
              >
                <div>
                  <div className="font-semibold text-white">Action Board</div>
                  <div className="text-[11px] text-slate-400">{metrics.pendingActions} pending actions</div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Transparency Disclaimer */}
          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/20 text-xs text-amber-200/90 leading-relaxed">
            <strong className="text-amber-300">Demo notice: </strong>
            TRAVI is a local keyword-based demonstration. It does not connect to external accounts or generate AI responses.
          </div>
        </div>
      </div>
    </div>
  );
};
