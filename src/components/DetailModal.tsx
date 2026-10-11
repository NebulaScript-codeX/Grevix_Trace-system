import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { useWorkspace } from '../context/WorkspaceContext';
import { X, ExternalLink, Calendar, CheckCircle2, ShieldAlert, FileText, ArrowRight, CornerDownRight } from 'lucide-react';

export const DetailModal: React.FC = () => {
  const { selectedItem, setSelectedItem, sources, memories, findings, approveAction, resolveFinding, reviewRisk, setActiveTab } = useWorkspace();
  const reduceMotion = useReducedMotion();

  if (!selectedItem) return null;

  const { type, item } = selectedItem;

  const closeModal = () => setSelectedItem(null);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-3 backdrop-blur-md sm:p-4"
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduceMotion ? undefined : { opacity: 0 }}
      onClick={closeModal}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-indigo-300/15 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.12),transparent_45%),#0b1020] shadow-[0_30px_100px_-30px_rgba(79,70,229,0.55)]"
        onClick={(e) => e.stopPropagation()}
        initial={reduceMotion ? false : { opacity: 0, y: 14, scale: 0.975 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduceMotion ? undefined : { opacity: 0, y: 8, scale: 0.985 }}
        transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 320, damping: 30 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-semibold tracking-wider uppercase text-blue-400">
              {type === 'source' && 'Source Record Details'}
              {type === 'memory' && 'Saved Memory Details'}
              {type === 'finding' && 'Intelligence Finding & Evidence'}
              {type === 'action' && 'Action Review & Execution'}
              {type === 'risk' && 'Trust & Risk Analysis'}
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400 font-mono">ID: {item.id}</span>
          </div>
          <button
            onClick={closeModal}
            aria-label="Close details"
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body content */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight leading-snug">
              {item.title || item.category || 'Record Details'}
            </h3>
            {item.date && (
              <div className="flex items-center gap-2 mt-1 text-xs text-slate-400 font-mono">
                <Calendar className="w-3.5 h-3.5" />
                <span>{item.date}</span>
                {item.sourceLabel && (
                  <>
                    <span>·</span>
                    <span className="text-slate-300">{item.sourceLabel}</span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Type specific views */}
          {type === 'source' && (
            <div className="space-y-4">
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Raw Content / Message</div>
                <pre className="text-xs text-slate-200 whitespace-pre-wrap font-sans leading-relaxed">
                  {item.content}
                </pre>
              </div>

              {item.extractedDetails && item.extractedDetails.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-slate-300 mb-2">Extracted Context Details</div>
                  <ul className="space-y-1.5">
                    {item.extractedDetails.map((det: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                        <CornerDownRight className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                        <span>{det}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {item.entities && (
                <div className="pt-2 border-t border-slate-800/60 flex flex-wrap gap-4 text-xs">
                  {item.entities.people?.length > 0 && (
                    <div>
                      <span className="text-slate-500 mr-1.5">People:</span>
                      <span className="text-slate-200">{item.entities.people.join(', ')}</span>
                    </div>
                  )}
                  {item.entities.projects?.length > 0 && (
                    <div>
                      <span className="text-slate-500 mr-1.5">Projects:</span>
                      <span className="text-slate-200">{item.entities.projects.join(', ')}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {type === 'finding' && (
            <div className="space-y-4">
              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/80">
                <div className="text-xs font-semibold text-slate-400 mb-1">Plain Language Explanation</div>
                <p className="text-slate-200 leading-relaxed">{item.explanation}</p>
              </div>

              {item.whyItMatters && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs leading-relaxed">
                  <div className="font-semibold text-amber-300 mb-0.5">Why This Matters:</div>
                  {item.whyItMatters}
                </div>
              )}

              {item.supportingEvidence && (
                <div>
                  <div className="text-xs font-semibold text-slate-300 mb-2">Supporting Evidence Across Sources</div>
                  <div className="space-y-2">
                    {item.supportingEvidence.map((ev: string, idx: number) => (
                      <div key={idx} className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono leading-relaxed">
                        {ev}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-800">
                <div>Severity: <span className="font-semibold text-rose-400 capitalize">{item.severity}</span></div>
                <div>Confidence: <span className="font-mono text-emerald-400">{Math.round(item.confidence * 100)}%</span></div>
                <div>Status: <span className="font-mono text-slate-200 capitalize">{item.status}</span></div>
              </div>
            </div>
          )}

          {type === 'memory' && (
            <div className="space-y-4">
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                <div className="text-xs font-semibold text-slate-400 mb-1">Current Stored Value</div>
                <div className="text-base font-semibold text-white">{item.value}</div>
              </div>

              <div>
                <div className="text-xs font-semibold text-slate-400 mb-1">Source Reference</div>
                <p className="text-xs text-slate-300 bg-slate-900 p-3 rounded-lg border border-slate-800">{item.sourceRef}</p>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-800">
                <div>Category: <span className="text-slate-200 capitalize">{item.category}</span></div>
                <div>Verification: <span className={`capitalize font-semibold ${item.verificationStatus === 'verified' ? 'text-emerald-400' : 'text-amber-400'}`}>{item.verificationStatus}</span></div>
                <div>Updated: <span className="font-mono text-slate-400">{item.updatedAt}</span></div>
              </div>
            </div>
          )}

          {type === 'action' && (
            <div className="space-y-4">
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                <div className="text-xs font-semibold text-slate-400 mb-1">Proposed Action Explanation</div>
                <p className="text-slate-200 leading-relaxed">{item.explanation}</p>
              </div>

              {item.proposedChange && (
                <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/20 space-y-2">
                  <div className="text-xs font-semibold text-blue-300">Proposed Workspace Modification</div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                      <div className="text-slate-500 mb-1">Previous Stored Value</div>
                      <div className="text-rose-300 line-through font-mono">{item.proposedChange.fromValue}</div>
                    </div>
                    <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                      <div className="text-slate-500 mb-1">New Proposed Value</div>
                      <div className="text-emerald-300 font-mono font-medium">{item.proposedChange.toValue}</div>
                    </div>
                  </div>
                </div>
              )}

              {item.executionResult && (
                <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs">
                  <div className="font-semibold text-emerald-400 mb-1">Execution Status: Verified</div>
                  <p className="text-slate-300">{item.executionResult.message}</p>
                  <div className="text-slate-500 mt-1 font-mono text-[11px]">{item.executionResult.executedAt}</div>
                </div>
              )}
            </div>
          )}

          {type === 'risk' && (
            <div className="space-y-4">
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                <div className="text-xs font-semibold text-slate-400 mb-1">Risk Evaluation</div>
                <p className="text-slate-200 leading-relaxed">{item.explanation}</p>
              </div>

              {item.conflictingValues && (
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="text-xs font-semibold text-rose-400">Direct Value Discrepancy</div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                      <div className="text-slate-400 font-medium">{item.conflictingValues.labelA}</div>
                      <div className="text-slate-200 font-mono mt-1 font-semibold">{item.conflictingValues.valueA}</div>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                      <div className="text-slate-400 font-medium">{item.conflictingValues.labelB}</div>
                      <div className="text-emerald-400 font-mono mt-1 font-semibold">{item.conflictingValues.valueB}</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-500/20 text-xs text-blue-200">
                <span className="font-semibold text-blue-300">Suggested Resolution: </span>
                {item.suggestedResolution}
              </div>
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="px-6 py-4 border-t border-slate-800/80 bg-slate-900/60 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            TRACE Context-Aware Verification
          </div>

          <div className="flex items-center gap-2">
            {type === 'action' && item.status === 'pending_approval' && (
              <button
                onClick={() => {
                  approveAction(item.id);
                  closeModal();
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Approve & Execute Update
              </button>
            )}

            {type === 'finding' && item.status === 'open' && (
              <button
                onClick={() => {
                  resolveFinding(item.id);
                  closeModal();
                }}
                className="px-4 py-2 text-xs font-semibold text-emerald-300 bg-emerald-950/50 hover:bg-emerald-900/50 border border-emerald-500/30 rounded-lg transition-colors"
              >
                Mark as Resolved
              </button>
            )}

            {type === 'risk' && item.status === 'unreviewed' && (
              <button
                onClick={() => {
                  reviewRisk(item.id);
                  closeModal();
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                Mark as Reviewed
              </button>
            )}

            <button
              onClick={closeModal}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
