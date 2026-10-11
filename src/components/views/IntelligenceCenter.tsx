import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { 
  Lightbulb, 
  AlertTriangle, 
  CheckCircle2, 
  Eye, 
  XCircle, 
  ExternalLink, 
  ArrowRight, 
  Filter,
  Check,
  ShieldAlert
} from 'lucide-react';
import { FindingSeverity, FindingStatus, FindingCategory } from '../../types';

export const IntelligenceCenter: React.FC = () => {
  const { 
    findings, 
    reviewFinding, 
    resolveFinding, 
    dismissFinding, 
    setSelectedItem, 
    actions,
    sources
  } = useWorkspace();

  const [severityFilter, setSeverityFilter] = useState<'all' | FindingSeverity>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | FindingStatus>('all');
  const [search, setSearch] = useState('');

  const filteredFindings = findings.filter(f => {
    if (severityFilter !== 'all' && f.severity !== severityFilter) return false;
    if (statusFilter !== 'all' && f.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchTitle = f.title.toLowerCase().includes(q);
      const matchExpl = f.explanation.toLowerCase().includes(q);
      const matchWhy = f.whyItMatters.toLowerCase().includes(q);
      if (!matchTitle && !matchExpl && !matchWhy) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400 mb-1">
            <Lightbulb className="w-4 h-4" />
            <span>Reasoning Engine</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Intelligence Center</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Surfaces conflicting deadlines, outdated facts, inverted dependencies, and contextual risks backed by multi-source evidence.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search findings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 w-48"
          />
        </div>
      </div>

      {/* Filter Segmented Controls (Using functional buttons without pill badges) */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#0d1322] rounded-xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800/80">
          <span className="text-[11px] font-medium text-slate-400 px-2">Severity:</span>
          {(['all', 'critical', 'warning', 'advisory'] as const).map(sev => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                severityFilter === sev
                  ? 'bg-slate-800 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {sev.charAt(0).toUpperCase() + sev.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800/80">
          <span className="text-[11px] font-medium text-slate-400 px-2">Status:</span>
          {(['all', 'open', 'reviewed', 'resolved', 'dismissed'] as const).map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                statusFilter === st
                  ? 'bg-slate-800 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {st.charAt(0).toUpperCase() + st.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Findings List */}
      {filteredFindings.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#0c1220] border border-slate-800 space-y-2">
          <CheckCircle2 className="w-8 h-8 text-slate-600 mx-auto" />
          <h3 className="text-sm font-semibold text-white">No Findings Match Filter</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try resetting the severity or status filters to display all contextual findings.
          </p>
          <button
            onClick={() => { setSeverityFilter('all'); setStatusFilter('all'); setSearch(''); }}
            className="mt-2 px-3 py-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 bg-blue-950/30 rounded-lg"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredFindings.map(finding => {
            let sevColor = 'text-blue-400 border-blue-500/20 bg-blue-500/10';
            if (finding.severity === 'critical') sevColor = 'text-rose-400 border-rose-500/20 bg-rose-500/10';
            if (finding.severity === 'warning') sevColor = 'text-amber-400 border-amber-500/20 bg-amber-500/10';

            const relatedAction = actions.find(a => a.id === finding.recommendedActionId);
            const refSources = sources.filter(s => finding.sourceIds.includes(s.id));

            return (
              <div
                key={finding.id}
                className="p-5 rounded-2xl bg-[#0c1220] border border-slate-800 hover:border-slate-700/80 transition-all space-y-4 shadow-sm"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${sevColor}`}>
                        {finding.severity}
                      </span>
                      <span className="text-slate-600">·</span>
                      <span className="text-xs text-slate-400 font-mono">Category: {finding.category}</span>
                      <span className="text-slate-600">·</span>
                      <span className="text-xs text-emerald-400 font-mono tabular-nums">
                        Confidence {Math.round(finding.confidence * 100)}%
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white tracking-tight">{finding.title}</h3>
                  </div>

                  <div className="flex items-center gap-1 text-xs">
                    <span className="text-slate-400 text-[11px] mr-1">Status:</span>
                    <span className={`font-mono text-xs font-semibold capitalize ${
                      finding.status === 'resolved' ? 'text-emerald-400' :
                      finding.status === 'reviewed' ? 'text-blue-400' :
                      finding.status === 'dismissed' ? 'text-slate-500' : 'text-amber-400'
                    }`}>
                      {finding.status}
                    </span>
                  </div>
                </div>

                {/* Explanation */}
                <p className="text-xs text-slate-300 leading-relaxed">
                  {finding.explanation}
                </p>

                {/* Why it matters callout */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-amber-200/90 leading-relaxed">
                  <strong className="text-amber-300">Why this matters: </strong>
                  {finding.whyItMatters}
                </div>

                {/* Supporting evidence quotes */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Supporting Cross-Document Evidence:
                  </div>
                  {finding.supportingEvidence.map((ev, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono leading-relaxed">
                      {ev}
                    </div>
                  ))}
                </div>

                {/* Footer Actions */}
                <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedItem({ type: 'finding', item: finding })}
                      className="text-slate-400 hover:text-white flex items-center gap-1.5 py-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Deep Inspection</span>
                    </button>

                    {refSources.length > 0 && (
                      <span className="text-slate-500 text-[11px] hidden sm:inline">
                        (Referencing: {refSources.map(s => s.type).join(', ')})
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {finding.status === 'open' && (
                      <button
                        onClick={() => reviewFinding(finding.id)}
                        className="px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        Mark Reviewed
                      </button>
                    )}

                    {finding.status !== 'resolved' && (
                      <button
                        onClick={() => resolveFinding(finding.id)}
                        className="px-3 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-500/30 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Resolve</span>
                      </button>
                    )}

                    {finding.status !== 'dismissed' && (
                      <button
                        onClick={() => dismissFinding(finding.id)}
                        className="px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-400 rounded-lg transition-colors"
                      >
                        Dismiss
                      </button>
                    )}

                    {relatedAction && (
                      <button
                        onClick={() => setSelectedItem({ type: 'action', item: relatedAction })}
                        className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                      >
                        <span>Review Action</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
