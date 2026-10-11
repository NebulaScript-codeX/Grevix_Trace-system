import React from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { TraceLogo } from '../brand/TraceLogo';
import { TraviRobotLogo } from '../brand/TraviRobotLogo';
import { 
  Sparkles, 
  AlertTriangle, 
  CheckSquare, 
  Clock, 
  ArrowRight, 
  Library, 
  Bookmark, 
  ShieldAlert, 
  CheckCircle2, 
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export const CommandCenter: React.FC = () => {
  const { 
    metrics, 
    findings, 
    actions, 
    memories, 
    sources, 
    setActiveTab, 
    setDemoModalOpen, 
    setDemoStep, 
    setSelectedItem,
    setTraviOpen,
    approveAction 
  } = useWorkspace();

  const criticalFindings = findings.filter(f => f.status === 'open' && f.severity === 'critical');
  const pendingActions = actions.filter(a => a.status === 'pending_approval' || a.status === 'suggested');
  const deadlineMemories = memories.filter(m => m.category === 'deadlines' || m.category === 'commitments');

  return (
    <div className="space-y-6">
      {/* Top Banner / Attention Alert */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0d162d] via-[#101c38] to-[#0c1428] border border-blue-500/20 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400">
              <TraceLogo className="w-4 h-4" />
              <span>Personal Intelligence Overview</span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-400 font-mono">Workspace: Project Polaris</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Good morning, Lead Director.
            </h1>
            <p className="text-xs text-slate-300 leading-relaxed">
              {metrics.criticalFindings > 0 ? (
                <span>
                  TRACE detected <strong className="text-rose-400 font-semibold">{metrics.criticalFindings} critical schedule conflict</strong> requiring human review. An authoritative update advanced the Project Polaris submission cutoff ahead of downstream prep runs.
                </span>
              ) : (
                <span>
                  All critical conflicts are currently resolved. Workspace memory is synchronized with verified source updates.
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setTraviOpen(true)}
              className="px-3.5 py-2.5 text-xs font-semibold text-indigo-200 hover:text-white bg-indigo-950/70 hover:bg-indigo-900/70 border border-indigo-500/30 rounded-xl transition-all shadow-sm flex items-center gap-2"
            >
              <TraviRobotLogo className="w-5 h-5" />
              <span>Ask TRAVI</span>
            </button>

            <button
              onClick={() => {
                setDemoStep(1);
                setDemoModalOpen(true);
              }}
              className="px-4 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Interactive Demo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row (Derived directly from actual current records) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <button
          onClick={() => setActiveTab('source-library')}
          className="p-4 rounded-xl bg-[#0d1322] border border-slate-800/80 hover:border-slate-700 text-left transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Sources</span>
            <Library className="w-3.5 h-3.5 group-hover:text-blue-400 transition-colors" />
          </div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums">{metrics.totalSources}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Ingested records</div>
        </button>

        <button
          onClick={() => setActiveTab('memory-center')}
          className="p-4 rounded-xl bg-[#0d1322] border border-slate-800/80 hover:border-slate-700 text-left transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Memories</span>
            <Bookmark className="w-3.5 h-3.5 group-hover:text-blue-400 transition-colors" />
          </div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums">{metrics.totalMemories}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Preserved context</div>
        </button>

        <button
          onClick={() => setActiveTab('intelligence-center')}
          className="p-4 rounded-xl bg-[#0d1322] border border-slate-800/80 hover:border-slate-700 text-left transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Findings</span>
            <span className={`w-2 h-2 rounded-full ${metrics.openFindings > 0 ? 'bg-amber-400' : 'bg-slate-600'}`} />
          </div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums">{metrics.openFindings}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Active insights</div>
        </button>

        <button
          onClick={() => setActiveTab('action-board')}
          className="p-4 rounded-xl bg-[#0d1322] border border-slate-800/80 hover:border-slate-700 text-left transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Pending</span>
            <CheckSquare className="w-3.5 h-3.5 group-hover:text-blue-400 transition-colors" />
          </div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums">{metrics.pendingActions}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Awaiting approval</div>
        </button>

        <button
          onClick={() => setActiveTab('action-board')}
          className="p-4 rounded-xl bg-[#0d1322] border border-slate-800/80 hover:border-slate-700 text-left transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Verified</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono tabular-nums">{metrics.verifiedActions}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Executed outcomes</div>
        </button>

        <button
          onClick={() => setActiveTab('trust-risk')}
          className="p-4 rounded-xl bg-[#0d1322] border border-slate-800/80 hover:border-slate-700 text-left transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Risks</span>
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums">{metrics.unreviewedRisks}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Trust items</div>
        </button>
      </div>

      {/* Main Grid: Pending Attention & Critical Discrepancies */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Actionable Findings & Pending Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Critical Attention Card */}
          <div className="p-5 rounded-2xl bg-[#0c1220] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <h2 className="text-sm font-bold text-white tracking-tight">Active Context Discrepancies</h2>
              </div>
              <button
                onClick={() => setActiveTab('intelligence-center')}
                className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
              >
                <span>View all findings</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {criticalFindings.length === 0 ? (
              <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800/60 text-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                <div className="text-xs font-semibold text-white">No Critical Conflicts</div>
                <p className="text-[11px] text-slate-400 mt-0.5">All detected deadline and dependency conflicts have been approved or resolved.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {criticalFindings.map(finding => (
                  <div
                    key={finding.id}
                    className="p-4 rounded-xl bg-slate-900/70 border border-rose-500/20 hover:border-rose-500/40 transition-colors space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-xs font-semibold text-white">{finding.title}</div>
                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">{finding.explanation}</p>
                      </div>
                      <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 shrink-0">
                        {finding.severity}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-amber-200/90 leading-tight">
                      <strong>Impact:</strong> {finding.whyItMatters}
                    </div>

                    <div className="flex items-center justify-between pt-1 text-xs">
                      <button
                        onClick={() => setSelectedItem({ type: 'finding', item: finding })}
                        className="text-slate-400 hover:text-slate-200 flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Inspect Evidence</span>
                      </button>

                      {finding.recommendedActionId && (
                        <button
                          onClick={() => {
                            const act = actions.find(a => a.id === finding.recommendedActionId);
                            if (act) setSelectedItem({ type: 'action', item: act });
                          }}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-xs transition-colors flex items-center gap-1"
                        >
                          <span>Review Recommended Action</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending Actions Spotlight */}
          <div className="p-5 rounded-2xl bg-[#0c1220] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-blue-400" />
                <h2 className="text-sm font-bold text-white tracking-tight">Pending Actions Awaiting Approval</h2>
              </div>
              <button
                onClick={() => setActiveTab('action-board')}
                className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
              >
                <span>Action Board</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {pendingActions.length === 0 ? (
              <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800/60 text-center text-xs text-slate-400">
                All proposed actions have been executed or reviewed.
              </div>
            ) : (
              <div className="space-y-3">
                {pendingActions.map(action => (
                  <div
                    key={action.id}
                    className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white truncate">{action.title}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold uppercase">
                          {action.priority}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-tight">{action.explanation}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setSelectedItem({ type: 'action', item: action })}
                        className="px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => approveAction(action.id)}
                        className="px-3 py-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-sm"
                      >
                        Approve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Stored Milestones & Context Shortcuts */}
        <div className="space-y-6">
          {/* Upcoming Deadlines & Commitments */}
          <div className="p-5 rounded-2xl bg-[#0c1220] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <h2 className="text-sm font-bold text-white tracking-tight">Tracked Deadlines & Dates</h2>
              </div>
              <button
                onClick={() => setActiveTab('memory-center')}
                className="text-xs text-blue-400 hover:text-blue-300 font-medium"
              >
                Memories
              </button>
            </div>

            <div className="space-y-2.5">
              {deadlineMemories.map(mem => (
                <div
                  key={mem.id}
                  onClick={() => setSelectedItem({ type: 'memory', item: mem })}
                  className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer space-y-1"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white truncate">{mem.title}</span>
                    <span className={`text-[10px] uppercase font-mono font-semibold ${
                      mem.verificationStatus === 'verified' ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {mem.verificationStatus}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-slate-300 font-semibold">{mem.value}</div>
                  <div className="text-[11px] text-slate-500 truncate">{mem.sourceRef}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Execution Architecture Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-[#0c1220] border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">TRACE Engine Guarantee</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every recommendation links directly to cryptographic source evidence. Actions are held in pending queue until approved by human operator.
            </p>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Deterministic Auditing</span>
              <span className="text-emerald-400 font-mono">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
