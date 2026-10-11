import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { 
  History, 
  Filter, 
  Clock, 
  User, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  PlusCircle, 
  Edit3, 
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { TimelineEventType } from '../../types';

export const TimelineAudit: React.FC = () => {
  const { timeline, setSelectedItem, sources, memories, findings, actions, risks } = useWorkspace();
  const [typeFilter, setTypeFilter] = useState<'all' | TimelineEventType>('all');
  const [search, setSearch] = useState('');

  const filteredTimeline = timeline.filter(ev => {
    if (typeFilter !== 'all' && ev.eventType !== typeFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!ev.description.toLowerCase().includes(q) && !ev.actor.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  const getEventIcon = (type: TimelineEventType) => {
    switch (type) {
      case 'action_approved':
      case 'action_executed':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'action_rejected':
        return <XCircle className="w-4 h-4 text-rose-400" />;
      case 'finding_detected':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'memory_edited':
        return <Edit3 className="w-4 h-4 text-blue-400" />;
      case 'source_added':
      case 'memory_created':
        return <PlusCircle className="w-4 h-4 text-blue-400" />;
      case 'workspace_reset':
        return <RotateCcw className="w-4 h-4 text-purple-400" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const openRelatedRecord = (ev: any) => {
    if (!ev.relatedRecordId) return;
    if (ev.recordType === 'source') {
      const found = sources.find(s => s.id === ev.relatedRecordId);
      if (found) setSelectedItem({ type: 'source', item: found });
    } else if (ev.recordType === 'memory') {
      const found = memories.find(m => m.id === ev.relatedRecordId);
      if (found) setSelectedItem({ type: 'memory', item: found });
    } else if (ev.recordType === 'finding') {
      const found = findings.find(f => f.id === ev.relatedRecordId);
      if (found) setSelectedItem({ type: 'finding', item: found });
    } else if (ev.recordType === 'action') {
      const found = actions.find(a => a.id === ev.relatedRecordId);
      if (found) setSelectedItem({ type: 'action', item: found });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400 mb-1">
            <History className="w-4 h-4" />
            <span>Cryptographic & Deterministic Audit Trail</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Timeline & Audit</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Immutable chronological log of all ingested sources, context extractions, user approvals, and state modifications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search audit trail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 w-48"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-[#0d1322] rounded-xl border border-slate-800 overflow-x-auto text-xs">
        <button
          onClick={() => setTypeFilter('all')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            typeFilter === 'all' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          All Events ({timeline.length})
        </button>
        <button
          onClick={() => setTypeFilter('action_approved')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            typeFilter === 'action_approved' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Approvals
        </button>
        <button
          onClick={() => setTypeFilter('finding_detected')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            typeFilter === 'finding_detected' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Findings
        </button>
        <button
          onClick={() => setTypeFilter('source_added')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            typeFilter === 'source_added' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Ingestions
        </button>
        <button
          onClick={() => setTypeFilter('memory_edited')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            typeFilter === 'memory_edited' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Memory Edits
        </button>
      </div>

      {/* Timeline Stream */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
        {filteredTimeline.map(ev => (
          <div key={ev.id} className="relative group">
            {/* Timeline Dot */}
            <div className="absolute -left-6 top-1.5 w-5 h-5 rounded-full bg-[#090e1a] border border-slate-700 flex items-center justify-center">
              {getEventIcon(ev.eventType)}
            </div>

            {/* Event Box */}
            <div className="p-4 rounded-xl bg-[#0c1220] border border-slate-800 hover:border-slate-700 transition-all space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] uppercase font-bold text-blue-400 px-1.5 py-0.2 rounded bg-blue-950/40 border border-blue-500/20">
                    {ev.eventType}
                  </span>
                  <span className="text-slate-400">by <strong className="text-slate-200">{ev.actor}</strong></span>
                </div>
                <span className="font-mono text-[11px] text-slate-500">{ev.timestamp}</span>
              </div>

              <div className="text-xs font-semibold text-white">
                {ev.description}
              </div>

              {/* State Diffs */}
              {(ev.previousState || ev.newState) && (
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 font-mono text-[11px] grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {ev.previousState && (
                    <div className="text-rose-400">
                      <span className="text-slate-500 mr-1.5">Previous:</span>
                      <span className="line-through">{ev.previousState}</span>
                    </div>
                  )}
                  {ev.newState && (
                    <div className="text-emerald-400">
                      <span className="text-slate-500 mr-1.5">Applied:</span>
                      <span>{ev.newState}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Verification Outcome */}
              {ev.result && (
                <div className="text-[11px] text-slate-400">
                  <span className="text-slate-500">Result: </span>
                  <span className="text-slate-300 font-medium">{ev.result}</span>
                </div>
              )}

              {ev.relatedRecordId && (
                <div className="pt-1">
                  <button
                    onClick={() => openRelatedRecord(ev)}
                    className="text-[11px] text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
                  >
                    <span>Inspect Target Record ({ev.relatedRecordId})</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
