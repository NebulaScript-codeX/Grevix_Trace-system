import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink, 
  ArrowRight,
  Eye,
  Check
} from 'lucide-react';
import { RiskSeverity, RiskStatus } from '../../types';

export const TrustRisk: React.FC = () => {
  const { risks, reviewRisk, mitigateRisk, setSelectedItem, sources } = useWorkspace();
  const [severityFilter, setSeverityFilter] = useState<'all' | RiskSeverity>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | RiskStatus>('all');

  const filteredRisks = risks.filter(r => {
    if (severityFilter !== 'all' && r.severity !== severityFilter) return false;
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
          <ShieldAlert className="w-4 h-4" />
          <span>Epistemic Integrity & Governance</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Trust & Risk Center</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Audits conflicting statements, temporal inversions, unverified assumptions, and ungrounded claims across all sources.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#0d1322] rounded-xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800/80">
          <span className="text-[11px] font-medium text-slate-400 px-2">Severity:</span>
          {(['all', 'critical', 'high', 'medium', 'low'] as const).map(sev => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all capitalize ${
                severityFilter === sev
                  ? 'bg-slate-800 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800/80">
          <span className="text-[11px] font-medium text-slate-400 px-2">Status:</span>
          {(['all', 'unreviewed', 'reviewed', 'mitigated'] as const).map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all capitalize ${
                statusFilter === st
                  ? 'bg-slate-800 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Risk Cards */}
      <div className="space-y-4">
        {filteredRisks.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#0c1220] border border-slate-800 text-slate-400 text-xs">
            No risks match the selected filters.
          </div>
        ) : (
          filteredRisks.map(risk => {
            let sevColor = 'text-blue-400 border-blue-500/20 bg-blue-500/10';
            if (risk.severity === 'critical') sevColor = 'text-rose-400 border-rose-500/20 bg-rose-500/10';
            if (risk.severity === 'high') sevColor = 'text-amber-400 border-amber-500/20 bg-amber-500/10';

            const suppSources = sources.filter(s => risk.supportingSourceIds.includes(s.id));

            return (
              <div
                key={risk.id}
                className="p-5 rounded-2xl bg-[#0c1220] border border-slate-800 hover:border-slate-700 transition-all space-y-4 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${sevColor}`}>
                        {risk.severity} Severity
                      </span>
                      <span className="text-slate-600">·</span>
                      <span className="text-xs text-slate-300 font-semibold">{risk.category}</span>
                      <span className="text-slate-600">·</span>
                      <span className="text-xs text-emerald-400 font-mono">
                        Certainty: {Math.round(risk.confidence * 100)}%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 text-[11px]">Audit State:</span>
                    <span className={`text-xs font-mono font-bold uppercase ${
                      risk.status === 'mitigated' ? 'text-emerald-400' :
                      risk.status === 'reviewed' ? 'text-blue-400' : 'text-amber-400'
                    }`}>
                      {risk.status}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {risk.explanation}
                </p>

                {/* Direct Conflicting Values display */}
                {risk.conflictingValues && (
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider">
                      Direct Contradiction Evidence:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                        <div className="text-slate-400 font-medium">{risk.conflictingValues.labelA}</div>
                        <div className="text-slate-200 font-mono font-semibold mt-1">{risk.conflictingValues.valueA}</div>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-900 border border-rose-500/30">
                        <div className="text-rose-300 font-medium">{risk.conflictingValues.labelB}</div>
                        <div className="text-rose-200 font-mono font-semibold mt-1">{risk.conflictingValues.valueB}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Resolution note */}
                <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-500/20 text-xs text-blue-200">
                  <strong className="text-blue-300">Recommended Resolution: </strong>
                  {risk.suggestedResolution}
                </div>

                {/* Footer Controls */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <button
                    onClick={() => setSelectedItem({ type: 'risk', item: risk })}
                    className="text-slate-400 hover:text-white flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect Raw Sources ({suppSources.length})</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {risk.status === 'unreviewed' && (
                      <button
                        onClick={() => reviewRisk(risk.id)}
                        className="px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        Mark as Reviewed
                      </button>
                    )}

                    {risk.status !== 'mitigated' && (
                      <button
                        onClick={() => mitigateRisk(risk.id)}
                        className="px-3 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-500/30 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Mitigate Risk</span>
                      </button>
                    )}

                    {risk.status === 'mitigated' && (
                      <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mitigated</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
