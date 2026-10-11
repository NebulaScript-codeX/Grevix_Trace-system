import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Mail, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  RotateCcw,
  Network,
  ExternalLink,
  Info
} from 'lucide-react';

export const DemoModal: React.FC = () => {
  const { 
    isDemoModalOpen, 
    setDemoModalOpen, 
    demoStep, 
    setDemoStep, 
    sources, 
    memories, 
    findings, 
    actions, 
    approveAction, 
    resetDemoWorkspace,
    setSelectedItem,
    setActiveTab
  } = useWorkspace();

  const [activeSourcePreview, setActiveSourcePreview] = useState<'src-email-polaris-kickoff' | 'src-cal-prep-session' | 'src-email-deadline-advancement'>('src-email-polaris-kickoff');
  const [approvalDecision, setApprovalDecision] = useState<'pending' | 'approved' | 'rejected'>('pending');

  if (!isDemoModalOpen) return null;

  const polarisDeadlineMemory = memories.find(m => m.id === 'mem-polaris-deadline');
  const polarisAction = actions.find(a => a.id === 'act-update-polaris-deadline');
  const polarisFinding = findings.find(f => f.id === 'find-deadline-conflict');

  const sourceA = sources.find(s => s.id === 'src-email-polaris-kickoff')!;
  const sourceB = sources.find(s => s.id === 'src-cal-prep-session')!;
  const sourceC = sources.find(s => s.id === 'src-email-deadline-advancement')!;

  const handleNext = () => {
    if (demoStep < 10) setDemoStep(demoStep + 1);
  };

  const handleBack = () => {
    if (demoStep > 1) setDemoStep(demoStep - 1);
  };

  const handleApprove = () => {
    approveAction('act-update-polaris-deadline');
    setApprovalDecision('approved');
    setDemoStep(8);
  };

  const handleReject = () => {
    setApprovalDecision('rejected');
    setDemoStep(8);
  };

  const handleRestart = () => {
    resetDemoWorkspace();
    setApprovalDecision('pending');
    setDemoStep(1);
  };

  const stepsMeta = [
    { num: 1, title: 'Introduction' },
    { num: 2, title: 'Explore Sources' },
    { num: 3, title: 'Connect Context' },
    { num: 4, title: 'Detect Conflict' },
    { num: 5, title: 'Explain Risk' },
    { num: 6, title: 'Recommendation' },
    { num: 7, title: 'Approval' },
    { num: 8, title: 'Apply Change' },
    { num: 9, title: 'Verify & Record' },
    { num: 10, title: 'Completion' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        className="bg-[#0b1222] border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">Interactive Scenario: The Missing Deadline Update</h2>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Step {demoStep} of 10
                </span>
              </div>
              <p className="text-xs text-slate-400">Contextual detection, evidence reasoning, and human-in-the-loop approval</p>
            </div>
          </div>
          <button
            onClick={() => setDemoModalOpen(false)}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close demo"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="px-6 py-2.5 bg-slate-950/50 border-b border-slate-800/60 overflow-x-auto">
          <div className="flex items-center gap-1.5 min-w-max">
            {stepsMeta.map((s) => {
              const isActive = s.num === demoStep;
              const isDone = s.num < demoStep;
              return (
                <button
                  key={s.num}
                  onClick={() => setDemoStep(s.num)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white font-semibold shadow-sm'
                      : isDone
                      ? 'text-slate-300 hover:bg-slate-800/80'
                      : 'text-slate-500 hover:text-slate-400'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-mono ${
                    isActive ? 'bg-white/20 text-white' : isDone ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {s.num}
                  </span>
                  <span>{s.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* STEP 1: Introduction */}
          {demoStep === 1 && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-950/30 to-slate-900 border border-blue-500/20 space-y-4">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 uppercase tracking-wider">
                  <span>Scenario Overview</span>
                </div>
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  How TRACE catches the hidden deadline conflict
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  In fast-paced organizations, project timelines change constantly in emails, but calendar events and shared memory records often remain anchored to outdated dates.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-2">
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <div className="font-semibold text-white mb-1 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-blue-400" /> Source A (Oct 5)
                    </div>
                    <p className="text-slate-400">Kickoff email sets final client submission to <strong className="text-slate-200">October 20</strong>.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <div className="font-semibold text-white mb-1 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" /> Source B (Oct 12)
                    </div>
                    <p className="text-slate-400">Prep session scheduled for <strong className="text-slate-200">October 19</strong> (24h before old deadline).</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <div className="font-semibold text-white mb-1 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-rose-400" /> Source C (Oct 11)
                    </div>
                    <p className="text-slate-400">Urgent email moves deadline ahead to <strong className="text-rose-300 font-semibold">October 18</strong>.</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                <span className="font-semibold text-white">The Workflow You Will Experience:</span><br />
                TRACE indexes the emails and calendar, detects the conflicting dates, identifies that the October 19 preparation run now falls <em>after</em> the portal closes, proposes a deterministic update, and awaits your approval before modifying workspace records.
              </div>
            </div>
          )}

          {/* STEP 2: Explore Sources */}
          {demoStep === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">Step 2: Inspect Incoming Sources</h3>
                <p className="text-xs text-slate-400">Examine the three scattered records TRACE has ingested into the Source Library.</p>
              </div>

              {/* Source Tabs */}
              <div className="flex gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
                <button
                  onClick={() => setActiveSourcePreview('src-email-polaris-kickoff')}
                  className={`flex-1 py-2 px-3 text-xs font-medium rounded-lg transition-all text-left flex items-center gap-2 ${
                    activeSourcePreview === 'src-email-polaris-kickoff' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  <span className="truncate">Source A: Kickoff Email</span>
                </button>
                <button
                  onClick={() => setActiveSourcePreview('src-cal-prep-session')}
                  className={`flex-1 py-2 px-3 text-xs font-medium rounded-lg transition-all text-left flex items-center gap-2 ${
                    activeSourcePreview === 'src-cal-prep-session' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span className="truncate">Source B: Prep Session</span>
                </button>
                <button
                  onClick={() => setActiveSourcePreview('src-email-deadline-advancement')}
                  className={`flex-1 py-2 px-3 text-xs font-medium rounded-lg transition-all text-left flex items-center gap-2 ${
                    activeSourcePreview === 'src-email-deadline-advancement' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5 text-rose-400" />
                  <span className="truncate">Source C: Urgent Update</span>
                </button>
              </div>

              {/* Source content view */}
              {activeSourcePreview === 'src-email-polaris-kickoff' && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300">{sourceA.title}</span>
                    <span className="font-mono text-slate-400">{sourceA.date}</span>
                  </div>
                  <pre className="text-xs text-slate-200 whitespace-pre-wrap font-sans bg-slate-900/80 p-3 rounded-lg border border-slate-800/80 leading-relaxed">
                    {sourceA.content}
                  </pre>
                  <div className="text-xs text-blue-400 bg-blue-950/20 p-2.5 rounded-lg border border-blue-500/20">
                    <strong>Extracted Detail:</strong> Final submission deadline is stated as <strong>October 20, 2026 at 5:00 PM</strong>.
                  </div>
                </div>
              )}

              {activeSourcePreview === 'src-cal-prep-session' && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300">{sourceB.title}</span>
                    <span className="font-mono text-slate-400">{sourceB.date}</span>
                  </div>
                  <pre className="text-xs text-slate-200 whitespace-pre-wrap font-sans bg-slate-900/80 p-3 rounded-lg border border-slate-800/80 leading-relaxed">
                    {sourceB.content}
                  </pre>
                  <div className="text-xs text-amber-300 bg-amber-950/20 p-2.5 rounded-lg border border-amber-500/20">
                    <strong>Extracted Detail:</strong> Prep dry-run session booked for <strong>Monday, October 19, 2026 (2:00 PM - 4:00 PM)</strong>.
                  </div>
                </div>
              )}

              {activeSourcePreview === 'src-email-deadline-advancement' && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300">{sourceC.title}</span>
                    <span className="font-mono text-rose-400 font-semibold">{sourceC.date} (Newer)</span>
                  </div>
                  <pre className="text-xs text-slate-200 whitespace-pre-wrap font-sans bg-slate-900/80 p-3 rounded-lg border border-rose-500/30 leading-relaxed">
                    {sourceC.content}
                  </pre>
                  <div className="text-xs text-rose-300 bg-rose-950/20 p-2.5 rounded-lg border border-rose-500/20">
                    <strong>Critical Detail:</strong> Executive notice advances the binding cutoff by 48 hours to <strong>Sunday, October 18, 2026 at 11:59 PM</strong>.
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Connect Context */}
          {demoStep === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">Step 3: Connect Context & Graph Relationships</h3>
                <p className="text-xs text-slate-400">TRACE evaluates cross-document references and maps entity relationships.</p>
              </div>

              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Network className="w-4 h-4 text-blue-400" />
                  <span>Mapped Context Network</span>
                </div>

                {/* Visual relationship cards */}
                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-300 font-medium">Source A (Oct 5 Email)</span>
                    <span className="text-slate-500 font-mono text-[11px] px-2 py-0.5 rounded bg-slate-800">DEFINES INITIAL DEADLINE</span>
                    <span className="text-slate-400 font-mono">October 20</span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-300 font-medium">Source B (Prep Session)</span>
                    <span className="text-slate-500 font-mono text-[11px] px-2 py-0.5 rounded bg-slate-800">SCHEDULED FOR</span>
                    <span className="text-amber-400 font-mono">October 19 (Prep Run)</span>
                  </div>

                  <div className="p-3 rounded-lg bg-blue-950/40 border border-blue-500/30 flex items-center justify-between">
                    <span className="text-white font-medium">Source C (Oct 11 Email)</span>
                    <span className="text-blue-400 font-mono text-[11px] px-2 py-0.5 rounded bg-blue-900/40">SUPERSEDES PREVIOUS CUTOFF</span>
                    <span className="text-rose-400 font-mono font-semibold">October 18</span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
                    <span className="text-slate-400">Sarah Lin</span>
                    <span className="text-slate-500 font-mono text-[11px] px-2 py-0.5 rounded bg-slate-800">AUTHORED BOTH</span>
                    <span className="text-slate-300">Source A and Source C</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-blue-950/20 border border-blue-500/20 text-xs text-slate-300 leading-relaxed">
                  <span className="font-semibold text-blue-300">Relationship Insight:</span> Because Sarah Lin is the authoritative Director for Project Polaris and Source C (Oct 11) is timestamped after Source A (Oct 5), Source C takes precedence.
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Detect Conflict */}
          {demoStep === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">Step 4: Detect the Conflict</h3>
                <p className="text-xs text-slate-400">The Intelligence Engine identifies an active discrepancy between stored memory and authoritative incoming data.</p>
              </div>

              <div className="p-5 rounded-xl bg-slate-950 border border-rose-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span className="text-sm font-bold text-white">{polarisFinding?.title || 'Outdated Submission Deadline for Project Polaris'}</span>
                  </div>
                  <span className="text-xs font-mono text-emerald-400">Confidence: 98%</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {polarisFinding?.explanation}
                </p>

                {/* Evidence Comparison Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs">
                  <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="text-slate-400 font-medium mb-1">Stored Memory & Source A</div>
                    <div className="text-slate-300 font-mono font-semibold">October 20, 2026 · 5:00 PM</div>
                    <div className="text-[11px] text-slate-500 mt-1">Source timestamp: 2026-10-05 09:30</div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-rose-950/30 border border-rose-500/30">
                    <div className="text-rose-300 font-medium mb-1">Authoritative Update (Source C)</div>
                    <div className="text-rose-200 font-mono font-semibold">October 18, 2026 · 11:59 PM</div>
                    <div className="text-[11px] text-rose-400/80 mt-1">Source timestamp: 2026-10-11 08:15 (Latest)</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Explain the Risk */}
          {demoStep === 5 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">Step 5: Explain the Downstream Risk</h3>
                <p className="text-xs text-slate-400">TRACE evaluates the impact on related milestones, tasks, and calendar events.</p>
              </div>

              <div className="p-5 rounded-xl bg-slate-950 border border-amber-500/30 space-y-4">
                <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Schedule Inversion Detected</span>
                </div>

                <div className="p-4 rounded-lg bg-amber-950/20 border border-amber-500/20 text-xs text-amber-200 leading-relaxed space-y-2">
                  <p>
                    <strong>Why this matters:</strong> The team booked a calendar session titled <em>"Polaris Final Submission Prep & Verification Run"</em> for <strong>Monday, October 19 at 2:00 PM</strong>.
                  </p>
                  <p>
                    Because the client submission cutoff is now <strong>Sunday, October 18 at 11:59 PM</strong>, this verification session will take place <strong>14 hours after the portal has already locked</strong>.
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
                  <span className="font-semibold text-white">Trust & Risk Assessment:</span><br />
                  TRACE does not silently reschedule people's calendars or claim meetings were modified without user consent. Instead, it flags the schedule discrepancy clearly for executive review.
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: Recommend an Action */}
          {demoStep === 6 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">Step 6: Formulate Recommendation</h3>
                <p className="text-xs text-slate-400">TRACE connects the finding to a concrete, reviewable action.</p>
              </div>

              <div className="p-5 rounded-xl bg-slate-950 border border-blue-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">Action Proposal</span>
                  <span className="text-xs font-mono text-amber-400 px-2 py-0.5 rounded bg-amber-500/10">Priority: Urgent</span>
                </div>

                <h4 className="text-base font-bold text-white">{polarisAction?.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{polarisAction?.explanation}</p>

                <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-2">
                  <div className="text-slate-400 font-medium">Proposed Deterministic Change:</div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 line-through font-mono">October 20, 2026, 5:00 PM</span>
                    <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-emerald-400 font-mono font-semibold">October 18, 2026, 11:59 PM</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: Request Approval */}
          {demoStep === 7 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">Step 7: Request Human Approval</h3>
                <p className="text-xs text-slate-400">Human-in-the-loop governance: TRACE requires explicit user review before modifying workspace context.</p>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 space-y-5 text-center">
                <div className="w-12 h-12 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto">
                  <ShieldCheck className="w-6 h-6" />
                </div>

                <div>
                  <h4 className="text-lg font-bold text-white">Approve Workspace Context Update?</h4>
                  <p className="text-xs text-slate-300 max-w-lg mx-auto mt-1 leading-relaxed">
                    This will update the Project Polaris Client Submission Deadline memory record to Sunday, October 18, 2026 at 11:59 PM, mark the intelligence finding as resolved, and log a permanent entry in the Timeline & Audit.
                  </p>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={handleApprove}
                    className="px-6 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Approve Update
                  </button>
                  <button
                    onClick={handleReject}
                    className="px-5 py-2.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all"
                  >
                    Reject Proposal
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 8: Apply Change */}
          {demoStep === 8 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">Step 8: Applying Workspace Changes</h3>
                <p className="text-xs text-slate-400">TRACE executes the decision deterministically within the workspace state.</p>
              </div>

              <div className="p-5 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-4">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {approvalDecision === 'rejected' 
                      ? 'Decision Applied: Proposal Rejected (No records modified)' 
                      : 'Changes Successfully Applied to Workspace'}
                  </span>
                </div>

                {approvalDecision !== 'rejected' ? (
                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <span className="text-slate-300">Memory Record: "Project Polaris Client Submission Deadline"</span>
                      <span className="font-mono text-emerald-400 font-semibold">{polarisDeadlineMemory?.value}</span>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <span className="text-slate-300">Verification Status</span>
                      <span className="font-mono text-emerald-400 uppercase font-semibold">{polarisDeadlineMemory?.verificationStatus}</span>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <span className="text-slate-300">Action Record Status</span>
                      <span className="font-mono text-emerald-400 capitalize font-semibold">{polarisAction?.status}</span>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <span className="text-slate-300">Finding Status</span>
                      <span className="font-mono text-emerald-400 capitalize font-semibold">{polarisFinding?.status}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-300">
                    The proposal was rejected. As a result, the memory record retains its previous value and no unauthorized changes were applied.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* STEP 9: Verify & Record */}
          {demoStep === 9 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">Step 9: Verify & Record in Audit Trail</h3>
                <p className="text-xs text-slate-400">TRACE logs the action, previous value, new value, actor, and execution timestamp.</p>
              </div>

              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Timeline & Audit Record
                </div>

                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-2 font-mono">
                  <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800">
                    <span>Event: action_approved</span>
                    <span>Actor: Lead Director</span>
                  </div>
                  <div className="text-white font-semibold">
                    Target: mem-polaris-deadline (Project Polaris Client Submission Deadline)
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                    <div className="text-rose-400">From: October 20, 2026, 5:00 PM</div>
                    <div className="text-emerald-400">To: October 18, 2026, 11:59 PM</div>
                  </div>
                  <div className="text-slate-400 text-[11px] pt-1">
                    Verification Result: Deterministic sync complete. No external calendar silently mutated.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 10: Completion */}
          {demoStep === 10 && (
            <div className="space-y-5">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/30 via-slate-900 to-slate-950 border border-emerald-500/20 space-y-4">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Scenario Walkthrough Complete</span>
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  What TRACE Accomplished in This Scenario
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                    <div className="font-semibold text-white">1. Discovered the Hidden Discrepancy</div>
                    <p className="text-slate-400">Connected Source A (Oct 5), Source B (Oct 12), and Source C (Oct 11) to surface the 48-hour earlier deadline.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                    <div className="font-semibold text-white">2. Grounded Evidence</div>
                    <p className="text-slate-400">Extracted verbatim quotes from Sarah Lin's authoritative update with exact timestamps.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                    <div className="font-semibold text-white">3. Upheld Human Agency</div>
                    <p className="text-slate-400">Presented the change for review; never modified critical data without explicit confirmation.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                    <div className="font-semibold text-white">4. Highlighted Remaining Review</div>
                    <p className="text-slate-400">Flagged the Oct 19 preparation session for the user to coordinate with attendees.</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                <button
                  onClick={handleRestart}
                  className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Restart Demo Scenario
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setDemoModalOpen(false);
                      setActiveTab('context-graph');
                    }}
                    className="px-4 py-2 text-xs font-semibold text-blue-400 bg-blue-950/40 hover:bg-blue-900/40 border border-blue-500/30 rounded-lg transition-colors"
                  >
                    View Context Graph
                  </button>
                  <button
                    onClick={() => {
                      setDemoModalOpen(false);
                      setActiveTab('timeline-audit');
                    }}
                    className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
                  >
                    View Audit Trail
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-4 border-t border-slate-800/80 bg-slate-900/60 flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={demoStep === 1}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors ${
              demoStep === 1 ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          <div className="text-xs text-slate-500 font-mono">
            {demoStep} / 10
          </div>

          {demoStep < 10 ? (
            <button
              onClick={handleNext}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setDemoModalOpen(false)}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors"
            >
              Close & Explore Workspace
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
