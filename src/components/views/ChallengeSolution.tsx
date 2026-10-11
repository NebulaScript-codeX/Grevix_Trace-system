import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock3,
  CloudOff,
  Database,
  FileWarning,
  GitMerge,
  History,
  Info,
  Network,
  Radio,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  ShieldQuestion,
  Wifi,
  WifiOff
} from 'lucide-react';

type DemoPhase = 'online' | 'offline' | 'recovered';
type DemoEvent = { id: string; time: string; title: string; detail: string; kind: 'good' | 'warning' | 'recovery' };

const scenarioCards = [
  { icon: CloudOff, title: 'Network disconnection', description: 'Important information cannot reach TRACE while the connection is unavailable.', color: 'text-amber-300 bg-amber-400/10 border-amber-400/20' },
  { icon: FileWarning, title: 'Device crash', description: 'Recent updates may not be saved or synchronized successfully.', color: 'text-rose-300 bg-rose-400/10 border-rose-400/20' },
  { icon: Database, title: 'Incomplete information', description: 'People may forget to upload or enter information TRACE needs.', color: 'text-violet-300 bg-violet-400/10 border-violet-400/20' },
  { icon: AlertTriangle, title: 'Stale or conflicting data', description: 'Out-of-date context can create misleading connections and unreliable recommendations.', color: 'text-orange-300 bg-orange-400/10 border-orange-400/20' }
];

const solutionCapabilities = [
  { icon: ShieldQuestion, title: 'Data completeness detection', detail: 'This demo tracks an expected deadline update that did not arrive. The existing workspace does not yet detect missing source feeds automatically.', status: 'Demo behavior' },
  { icon: WifiOff, title: 'Connection-aware operation', detail: 'An explicit offline state keeps the known records visible and warns that absence of an update is not proof that nothing changed.', status: 'Demo behavior' },
  { icon: History, title: 'Last-known context', detail: 'The existing app already keeps records in browser storage. The demo labels that saved snapshot as last known, not guaranteed current.', status: 'Existing + demo label' },
  { icon: Network, title: 'Uncertainty-aware context map', detail: 'The normal graph is built from workspace records. This demo adds missing, stale, and verify states instead of drawing uncertain facts as confirmed.', status: 'Demo behavior' },
  { icon: GitMerge, title: 'Recovery and reconciliation', detail: 'The simulated update is checked against the known deadline, reconciled once, and added to a deterministic event history.', status: 'Demo behavior' },
  { icon: CheckCircle2, title: 'Actionable insights', detail: 'After recovery, the revised insight flags the October 19 preparation meeting as later than the October 18 cutoff.', status: 'Demo behavior' },
  { icon: RefreshCw, title: 'Low-overhead updates', detail: 'The demo recalculates only this scenario’s affected deadline, meeting relationship, and recommendation—not the entire workspace.', status: 'Demo behavior' }
];

const initialEvents: DemoEvent[] = [
  { id: 'baseline', time: 'Start', title: 'Last-known snapshot loaded', detail: 'Kickoff email, project owner, October 20 deadline, and October 19 prep meeting are available locally.', kind: 'good' }
];

const lastKnownDeadline = {
  projectId: 'project-polaris',
  value: 'October 20, 2026 at 5:00 PM',
  sourceDate: '2026-10-05'
};

const delayedDeadlineUpdate = {
  projectId: 'project-polaris',
  supersedes: 'October 20, 2026 at 5:00 PM',
  value: 'October 18, 2026 at 11:59 PM',
  sourceDate: '2026-10-11'
};

const nodeStatus = (phase: DemoPhase, id: string) => {
  if (id === 'delayed-update') {
    if (phase === 'offline') return { label: 'MISSING · HELD OFFLINE', className: 'border-rose-400/30 bg-rose-400/10 text-rose-200' };
    if (phase === 'recovered') return { label: 'RECOVERED · VERIFIED', className: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200' };
    return { label: 'EXPECTED UPDATE', className: 'border-slate-600 bg-slate-800/70 text-slate-300' };
  }
  if (id === 'deadline') {
    if (phase === 'offline') return { label: 'LAST KNOWN · POSSIBLY STALE', className: 'border-amber-400/30 bg-amber-400/10 text-amber-200' };
    if (phase === 'recovered') return { label: 'CONFIRMED · OCT 18', className: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200' };
  }
  if (id === 'meeting' && phase === 'offline') return { label: 'VERIFY AGAINST UPDATE', className: 'border-amber-400/30 bg-amber-400/10 text-amber-200' };
  return { label: 'CONFIRMED', className: 'border-sky-400/30 bg-sky-400/10 text-sky-200' };
};

export const ChallengeSolution: React.FC = () => {
  const [phase, setPhase] = useState<DemoPhase>('online');
  const [events, setEvents] = useState<DemoEvent[]>(initialEvents);
  const [recoveryError, setRecoveryError] = useState('');
  const isOffline = phase === 'offline';
  const isRecovered = phase === 'recovered';
  const completeness = isOffline ? '4 / 5 expected updates' : isRecovered ? '5 / 5 reconciled' : '4 / 4 received snapshot';

  const simulateFailure = () => {
    if (phase !== 'online') return;
    setPhase('offline');
    setEvents(previous => [
      ...previous,
      {
        id: 'connection-lost',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        title: 'Connection lost · update held',
        detail: 'The simulated executive email advances the cutoff to October 18, but cannot be received while offline.',
        kind: 'warning'
      }
    ]);
  };

  const restoreConnection = () => {
    if (phase !== 'offline') return;
    const updateIsValid = delayedDeadlineUpdate.projectId === lastKnownDeadline.projectId
      && delayedDeadlineUpdate.supersedes === lastKnownDeadline.value
      && delayedDeadlineUpdate.sourceDate > lastKnownDeadline.sourceDate;
    if (!updateIsValid) {
      setRecoveryError('The recovered update did not match the expected project, prior deadline, and newer source date. No context was changed.');
      return;
    }
    setRecoveryError('');
    setPhase('recovered');
    setEvents(previous => {
      if (previous.some(event => event.id === 'update-reconciled')) return previous;
      return [
        ...previous,
        {
          id: 'connection-restored',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          title: 'Connection restored · update received',
          detail: 'The held executive update was recovered and matched to the existing Project Polaris deadline record.',
          kind: 'recovery'
        },
        {
          id: 'update-reconciled',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          title: 'Deadline reconciled · insight revised',
          detail: 'October 18 supersedes October 20. The October 19 preparation meeting is now flagged for rescheduling.',
          kind: 'good'
        }
      ];
    });
  };

  const resetDemo = () => {
    setPhase('online');
    setEvents(initialEvents);
    setRecoveryError('');
  };

  const contextNodes = [
    { id: 'project', eyebrow: 'PROJECT', title: 'Project Polaris', detail: 'Sarah Lin · RFP submission', icon: Database },
    { id: 'deadline', eyebrow: 'DEADLINE', title: isRecovered ? 'Oct 18 · 11:59 PM' : 'Oct 20 · 5:00 PM', detail: isOffline ? 'Saved value; may be stale' : isRecovered ? 'Newer source confirmed' : 'From kickoff email · Oct 5', icon: Clock3 },
    { id: 'meeting', eyebrow: 'PREP MEETING', title: 'Oct 19 · 2:00 PM', detail: isRecovered ? 'After cutoff · reschedule' : 'Calendar invitation', icon: History },
    ...(phase !== 'online' ? [{ id: 'delayed-update', eyebrow: 'INCOMING UPDATE', title: isRecovered ? 'Cutoff moved to Oct 18' : 'Cutoff moved to Oct 18', detail: isOffline ? 'Not received · connection offline' : 'Sarah Lin · recovered email', icon: isOffline ? WifiOff : CheckCircle2 }] : [])
  ];

  return (
    <div className="space-y-8 pb-8">
      <header className="relative overflow-hidden rounded-3xl border border-blue-500/20 bg-gradient-to-br from-[#111d34] via-[#0c1424] to-[#0a0e19] p-6 md:p-9">
        <div className="absolute -right-12 -top-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="relative max-w-4xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-300">
            <Radio className="h-3.5 w-3.5" /> Original hackathon challenge
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">The Connected Context Fallacy</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
            TRACE can only connect the information it has received. When data is missing, delayed, or stale, a confident-looking map can still lead to the wrong conclusion. This challenge demo makes that uncertainty visible and shows a recoverable response.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
            <span className="rounded-lg border border-slate-700 bg-slate-950/60 px-2.5 py-1.5">Standalone, deterministic demo</span>
            <span className="rounded-lg border border-slate-700 bg-slate-950/60 px-2.5 py-1.5">No external service or real disconnection</span>
          </div>
        </div>
      </header>

      <section aria-labelledby="challenge-heading" className="space-y-4">
        <SectionHeading eyebrow="A · THE CHALLENGE" title="When connected context is incomplete" description="Four everyday gaps can quietly undermine an otherwise useful context map." />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {scenarioCards.map(({ icon: Icon, title, description, color }, index) => (
            <article key={title} className="rounded-2xl border border-slate-800 bg-[#0c1220] p-4 transition-colors hover:border-slate-700">
              <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl border ${color}`}><Icon className="h-5 w-5" /></div>
              <div className="text-[10px] font-mono text-slate-500">0{index + 1}</div>
              <h3 className="mt-1 text-sm font-bold text-white">{title}</h3>
              <p className="mt-2 text-xs leading-5 text-slate-400">{description}</p>
            </article>
          ))}
        </div>
        <div className="rounded-2xl border border-rose-500/20 bg-rose-950/15 p-4 md:p-5">
          <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-rose-300">The risk chain</div>
          <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-between">
            {['Incomplete data', 'Flawed context map', 'Misleading connections', 'Unreliable suggestions'].map((label, index) => (
              <React.Fragment key={label}>
                <div className="flex min-h-11 flex-1 items-center justify-center rounded-xl border border-rose-400/15 bg-slate-950/60 px-3 text-center text-xs font-semibold text-slate-200">{label}</div>
                {index < 3 && <ArrowRight className="mx-auto hidden h-4 w-4 shrink-0 text-rose-300/70 sm:block" />}
                {index < 3 && <ArrowDown className="mx-auto h-4 w-4 shrink-0 text-rose-300/70 sm:hidden" />}
              </React.Fragment>
            ))}
          </div>
          <p className="mt-3 text-xs leading-5 text-slate-400">A missing update is not evidence that the old information is still true. The interface must show what is known—and what is not.</p>
        </div>
      </section>

      <section aria-labelledby="solution-heading" className="space-y-4">
        <SectionHeading eyebrow="B · OUR SOLUTION" title="Keep useful context, make uncertainty visible" description="TRACE already supports local records and derived views. The behaviors below are explicitly separated from this interactive prototype." />
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {solutionCapabilities.map(({ icon: Icon, title, detail, status }) => {
            const implemented = status.startsWith('Existing');
            return (
              <article key={title} className="rounded-2xl border border-slate-800 bg-[#0c1220] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-blue-500/15 bg-blue-500/10 text-blue-300"><Icon className="h-4 w-4" /></span><h3 className="text-xs font-bold leading-5 text-white">{title}</h3></div>
                  <span className={`shrink-0 rounded-full border px-2 py-1 text-[9px] font-bold uppercase tracking-wide ${implemented ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300' : 'border-indigo-500/20 bg-indigo-500/10 text-indigo-300'}`}>{status}</span>
                </div>
                <p className="mt-3 text-[11px] leading-5 text-slate-400">{detail}</p>
              </article>
            );
          })}
        </div>
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/50 p-4 text-xs leading-5 text-slate-400 sm:flex-row sm:items-start">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-300" />
          <p><strong className="text-slate-200">Scope transparency:</strong> TRACE persists workspace edits locally and builds its regular context graph from available records. Automatic sync monitoring, feed completeness detection, and offline reconciliation are not existing workspace features; the live demo below implements those behaviors as deterministic, in-memory scenario state.</p>
        </div>
      </section>

      <section aria-labelledby="demo-heading" className="space-y-4">
        <SectionHeading eyebrow="C · LIVE WORKING DEMO" title="A deadline update arrives while offline" description="Try the outage, inspect the uncertain context, then restore the simulated connection to reconcile the delayed update." />
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(280px,0.8fr)]">
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-[#0c1220] p-4 md:p-5">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase ${isOffline ? 'border-rose-400/30 bg-rose-400/10 text-rose-200' : 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200'}`}>
                      {isOffline ? <WifiOff className="h-3 w-3" /> : <Wifi className="h-3 w-3" />}{isOffline ? 'Offline' : 'Online'}
                    </span>
                    <span className="rounded-full border border-slate-700 bg-slate-900 px-2.5 py-1 text-[10px] font-semibold text-slate-300">Completeness · {completeness}</span>
                    {isRecovered && <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold uppercase text-emerald-200">Recovered</span>}
                  </div>
                  <p className="mt-2 text-[11px] text-slate-500">{isOffline ? 'Last-known context is preserved; one expected update is unavailable.' : isRecovered ? 'Recovered update reconciled with the saved deadline and meeting.' : 'Initial local snapshot. A complete snapshot does not prove all relevant updates exist.'}</p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <button onClick={simulateFailure} disabled={phase !== 'online'} className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-400/25 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-200 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-45">
                    <WifiOff className="h-3.5 w-3.5" /> Simulate Network Failure
                  </button>
                  <button onClick={restoreConnection} disabled={!isOffline} className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-400/25 bg-blue-600/20 px-3 py-2 text-xs font-semibold text-blue-100 transition hover:bg-blue-600/30 disabled:cursor-not-allowed disabled:opacity-45">
                    <RefreshCw className="h-3.5 w-3.5" /> Restore Connection
                  </button>
                  <button onClick={resetDemo} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white">
                    <RotateCcw className="h-3.5 w-3.5" /> Reset Demo
                  </button>
                </div>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {contextNodes.map(({ id, eyebrow, title, detail, icon: Icon }) => {
                  const status = nodeStatus(phase, id);
                  return (
                    <article key={id} className={`rounded-xl border p-3 transition-all duration-300 ${id === 'delayed-update' && isOffline ? 'border-rose-400/30 bg-rose-950/20' : id === 'deadline' && isOffline ? 'border-amber-400/25 bg-amber-950/15' : 'border-slate-800 bg-slate-950/60'}`}>
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-slate-300"><Icon className="h-4 w-4" /></div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-2"><span className="text-[9px] font-bold tracking-[0.15em] text-slate-500">{eyebrow}</span><span className={`rounded-full border px-2 py-0.5 text-[8px] font-bold tracking-wide ${status.className}`}>{status.label}</span></div>
                          <div className="mt-1 text-xs font-bold text-slate-100">{title}</div>
                          <div className="mt-1 text-[10px] text-slate-500">{detail}</div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <ContextLink label="Project owns deadline" uncertain={false} />
                <ContextLink label={isRecovered ? 'Deadline precedes prep meeting' : 'Deadline is compared with prep meeting'} uncertain={isOffline} />
                {phase !== 'online' && <ContextLink label={isOffline ? 'Update → deadline · verify' : 'Recovered update → deadline'} uncertain={isOffline} />}
              </div>
              {recoveryError && <div role="alert" className="mt-4 rounded-xl border border-rose-400/25 bg-rose-950/20 px-4 py-3 text-xs text-rose-100">{recoveryError}</div>}
              <div className={`mt-4 rounded-xl border px-4 py-3 text-xs leading-5 transition-colors ${isOffline ? 'border-amber-400/25 bg-amber-950/20 text-amber-100/90' : isRecovered ? 'border-emerald-400/20 bg-emerald-950/20 text-emerald-100/90' : 'border-slate-800 bg-slate-950/50 text-slate-400'}`}>
                {isOffline ? <><strong className="text-amber-200">Insight paused, not trusted as current.</strong> The saved October 20 deadline may have changed. Treat the October 19 preparation meeting relationship and any date-based recommendation as unverified until the missing source is recovered.</> : isRecovered ? <><strong className="text-emerald-200">Insight revised from recovered evidence.</strong> The binding cutoff is October 18 at 11:59 PM; the October 19 preparation meeting is after the deadline. Reschedule it before relying on the submission plan.</> : <><strong className="text-slate-200">Last-known insight.</strong> The October 19 preparation meeting was scheduled against the October 20 kickoff deadline. This snapshot may not include later changes.</>}
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <ComparisonCard title="Before recovery" accent="amber" active={isOffline} lines={[
                isOffline ? 'Saved deadline: October 20 · may be stale' : 'Last known: October 20 · from kickoff email',
                isOffline ? 'Missing: executive deadline update held offline' : 'No later update in the initial snapshot',
                'October 19 prep meeting appears to fit the saved deadline',
                isOffline ? 'Reliability: uncertain · verify before acting' : 'Confidence is limited to records received'
              ]} />
              <ComparisonCard title="After recovery" accent="emerald" active={isRecovered} lines={[
                isRecovered ? 'Reconciled cutoff: October 18 · 11:59 PM' : 'Waiting for a recovered source update',
                isRecovered ? 'Newer executive email supersedes October 20' : 'The offline update has not been checked',
                isRecovered ? 'October 19 prep meeting is now after the cutoff' : 'Meeting relationship requires verification',
                isRecovered ? 'Recommendation: reschedule prep before cutoff' : 'No revised recommendation yet'
              ]} />
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-[#0c1220] p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-white"><History className="h-4 w-4 text-blue-300" /> Recovery timeline</div>
              <div className="mt-4 space-y-0">
                {events.map((event, index) => (
                  <div key={event.id} className="relative flex gap-3 pb-4 last:pb-0">
                    {index < events.length - 1 && <span className="absolute left-[7px] top-4 h-full w-px bg-slate-800" />}
                    <span className={`relative mt-1 h-4 w-4 shrink-0 rounded-full border-2 ${event.kind === 'warning' ? 'border-rose-300 bg-rose-400/20' : event.kind === 'recovery' ? 'border-blue-300 bg-blue-400/20' : 'border-emerald-300 bg-emerald-400/20'}`} />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1"><span className="text-[11px] font-semibold text-slate-200">{event.title}</span><span className="text-[9px] font-mono text-slate-500">{event.time}</span></div>
                      <p className="mt-1 text-[10px] leading-4 text-slate-500">{event.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
              {isOffline && <div className="mt-4 rounded-xl border border-rose-400/20 bg-rose-950/15 p-3 text-[10px] leading-4 text-rose-100/80">Update is held in the demo until you restore the connection. No real network state changed.</div>}
            </div>

            <div className="rounded-2xl border border-blue-500/20 bg-blue-950/15 p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-100"><ShieldCheck className="h-4 w-4 text-blue-300" /> Accuracy × responsiveness</div>
              <div className="mt-3 space-y-3 text-[10px] leading-4 text-slate-400">
                <p><strong className="text-slate-200">Rebuilding everything</strong> after each small update does unnecessary work and can slow the interface.</p>
                <p><strong className="text-slate-200">Waiting for every possible update</strong> blocks useful work indefinitely. Instead, preserve the last-known snapshot and label uncertainty immediately.</p>
                <p><strong className="text-slate-200">Targeted reconciliation</strong> checks the recovered deadline and updates only its affected meeting link and recommendation.</p>
              </div>
              <div className="mt-3 flex items-start gap-2 rounded-lg border border-slate-700/70 bg-slate-950/50 p-2.5 text-[9px] leading-4 text-slate-500">
                <Info className="mt-0.5 h-3 w-3 shrink-0 text-blue-300" />
                <span>Illustrates an incremental strategy; no latency or performance benchmark is claimed.</span>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
};

const SectionHeading: React.FC<{ eyebrow: string; title: string; description: string }> = ({ eyebrow, title, description }) => (
  <div>
    <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-400">{eyebrow}</div>
    <h2 className="mt-1 text-xl font-bold tracking-tight text-white" id={eyebrow.startsWith('A') ? 'challenge-heading' : eyebrow.startsWith('B') ? 'solution-heading' : 'demo-heading'}>{title}</h2>
    <p className="mt-1 text-xs leading-5 text-slate-400">{description}</p>
  </div>
);

const ComparisonCard: React.FC<{ title: string; accent: 'amber' | 'emerald'; active: boolean; lines: string[] }> = ({ title, accent, active, lines }) => {
  const styles = accent === 'amber'
    ? { card: 'border-amber-400/30 bg-amber-950/15', dot: 'bg-amber-300', check: 'text-amber-300' }
    : { card: 'border-emerald-400/30 bg-emerald-950/15', dot: 'bg-emerald-300', check: 'text-emerald-300' };
  return (
    <div className={`rounded-2xl border p-4 transition-colors ${active ? styles.card : 'border-slate-800 bg-[#0c1220]'}`}>
      <div className="flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${active ? styles.dot : 'bg-slate-600'}`} /><h3 className="text-xs font-bold text-white">{title}</h3></div>
      <ul className="mt-3 space-y-2">
        {lines.map(line => <li key={line} className="flex items-start gap-2 text-[10px] leading-4 text-slate-400"><Check className={`mt-0.5 h-3 w-3 shrink-0 ${active ? styles.check : 'text-slate-600'}`} />{line}</li>)}
      </ul>
    </div>
  );
};

const ContextLink: React.FC<{ label: string; uncertain: boolean }> = ({ label, uncertain }) => (
  <div className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-[9px] font-medium ${uncertain ? 'border-amber-400/25 bg-amber-950/10 text-amber-200' : 'border-slate-800 bg-slate-950/40 text-slate-400'}`}>
    <span className={`h-px flex-1 border-t ${uncertain ? 'border-dashed border-amber-300/60' : 'border-slate-600'}`} />
    <ArrowRight className={`h-3 w-3 shrink-0 ${uncertain ? 'text-amber-300' : 'text-blue-300'}`} />
    <span className="text-center">{label}</span>
    <span className={`h-px flex-1 border-t ${uncertain ? 'border-dashed border-amber-300/60' : 'border-slate-600'}`} />
  </div>
);
