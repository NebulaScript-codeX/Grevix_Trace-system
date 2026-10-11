import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { 
  CheckSquare, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Clock, 
  ExternalLink, 
  ShieldCheck, 
  AlertCircle,
  RotateCcw
} from 'lucide-react';
import { ActionStatus, ActionPriority, ActionRecord } from '../../types';

export const ActionBoard: React.FC = () => {
  const { actions, approveAction, rejectAction, setSelectedItem } = useWorkspace();
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed' | 'rejected'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | ActionPriority>('all');
  const [confirmApproveId, setConfirmApproveId] = useState<string | null>(null);

  const filteredActions = actions.filter(a => {
    if (statusFilter === 'pending') {
      if (a.status !== 'pending_approval' && a.status !== 'suggested') return false;
    } else if (statusFilter === 'completed') {
      if (a.status !== 'completed' && a.status !== 'approved') return false;
    } else if (statusFilter === 'rejected') {
      if (a.status !== 'rejected') return false;
    }

    if (priorityFilter !== 'all' && a.priority !== priorityFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400 mb-1">
            <CheckSquare className="w-4 h-4" />
            <span>Human-Governed Execution Board</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Action Board</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Review, authorize, and verify context-aware recommendations before any state changes are committed.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#0d1322] rounded-xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800/80">
          <span className="text-[11px] font-medium text-slate-400 px-2">State:</span>
          {(['all', 'pending', 'completed', 'rejected'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all capitalize ${
                statusFilter === tab
                  ? 'bg-slate-800 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800/80">
          <span className="text-[11px] font-medium text-slate-400 px-2">Priority:</span>
          {(['all', 'urgent', 'high', 'medium', 'low'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all capitalize ${
                priorityFilter === p
                  ? 'bg-slate-800 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Actions List */}
      <div className="space-y-4">
        {filteredActions.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#0c1220] border border-slate-800 text-slate-400 text-xs">
            No actions match the selected filter.
          </div>
        ) : (
          filteredActions.map(action => {
            let priorityBadge = 'text-blue-400 border-blue-500/20 bg-blue-500/10';
            if (action.priority === 'urgent') priorityBadge = 'text-rose-400 border-rose-500/20 bg-rose-500/10';
            if (action.priority === 'high') priorityBadge = 'text-amber-400 border-amber-500/20 bg-amber-500/10';

            const isPending = action.status === 'pending_approval' || action.status === 'suggested';
            const isCompleted = action.status === 'completed' || action.status === 'approved';
            const isRejected = action.status === 'rejected';

            return (
              <div
                key={action.id}
                className="p-5 rounded-2xl bg-[#0c1220] border border-slate-800 hover:border-slate-700 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${priorityBadge}`}>
                        {action.priority}
                      </span>
                      <span className="text-slate-600">·</span>
                      <span className="text-xs text-slate-400 font-mono">Created: {action.createdAt}</span>
                    </div>
                    <h3 className="text-base font-bold text-white tracking-tight">{action.title}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 text-[11px]">Approval:</span>
                    <span className={`text-xs font-mono font-bold uppercase ${
                      isCompleted ? 'text-emerald-400' : isRejected ? 'text-rose-400' : 'text-amber-400'
                    }`}>
                      {action.approvalStatus}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {action.explanation}
                </p>

                {/* Proposed Change block */}
                {action.proposedChange && (
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs space-y-2">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Proposed Workspace Context Modification:
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 font-mono text-xs">
                      <span className="text-rose-400/90 line-through bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
                        {action.proposedChange.fromValue}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-blue-400 hidden sm:inline" />
                      <span className="text-emerald-400 font-semibold bg-emerald-950/30 px-2.5 py-1 rounded border border-emerald-500/30">
                        {action.proposedChange.toValue}
                      </span>
                    </div>
                  </div>
                )}

                {/* Execution Result Log */}
                {action.executionResult && (
                  <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs space-y-1 text-emerald-200">
                    <div className="font-semibold flex items-center gap-1.5 text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Deterministic Internal Execution Verified</span>
                    </div>
                    <p className="text-[11px] text-slate-300">{action.executionResult.message}</p>
                    <div className="text-[10px] font-mono text-slate-500">
                      Verified at: {action.executionResult.executedAt}
                    </div>
                  </div>
                )}

                {/* Actions bottom bar */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <button
                    onClick={() => setSelectedItem({ type: 'action', item: action })}
                    className="text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>View Record Linkages</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {isPending && (
                      <>
                        <button
                          onClick={() => rejectAction(action.id)}
                          className="px-3 py-1.5 text-xs text-slate-400 hover:text-rose-300 hover:bg-rose-950/20 rounded-lg transition-colors"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => setConfirmApproveId(action.id)}
                          className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Approve & Apply</span>
                        </button>
                      </>
                    )}

                    {isCompleted && (
                      <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Completed & Logged</span>
                      </span>
                    )}

                    {isRejected && (
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Rejected</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Confirmation Modal */}
      {confirmApproveId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Confirm Context Update</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to approve this action? This will update the underlying memory record and resolve related intelligence findings.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setConfirmApproveId(null)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  approveAction(confirmApproveId);
                  setConfirmApproveId(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg"
              >
                Confirm Approval
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
