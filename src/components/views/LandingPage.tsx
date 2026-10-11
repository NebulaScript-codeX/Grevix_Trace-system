import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { BrandSelectionCards } from '../brand/BrandSelectionCards';
import { TraviRobotLogo } from '../brand/TraviRobotLogo';
import { TraceLogo } from '../brand/TraceLogo';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldAlert, 
  CheckCircle2, 
  Network, 
  Database, 
  CheckSquare, 
  Library, 
  History, 
  Lock, 
  AlertTriangle, 
  Eye, 
  Layers, 
  ChevronRight,
  BrainCircuit,
  Workflow,
  Cpu,
  Mail,
  Calendar,
  Zap
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { 
    setActiveTab, 
    setDemoModalOpen, 
    setDemoStep, 
    setTraviOpen, 
    metrics 
  } = useWorkspace();
  const reduceMotion = useReducedMotion();

  return (
    <div className="space-y-20 pb-16">
      {/* Prototype Banner */}
      <div className="trace-glass trace-entrance flex flex-col items-center justify-between gap-3 rounded-2xl border-amber-300/20 bg-gradient-to-r from-amber-500/[0.07] via-indigo-500/[0.035] to-transparent p-3.5 text-xs text-amber-100 sm:flex-row">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded font-mono font-bold uppercase bg-amber-500/20 text-amber-300 text-[10px] tracking-wider">
            Hackathon Prototype
          </span>
          <span>
            <strong>TRACE IS CURRENTLY A HACKATHON PROTOTYPE.</strong> Demonstrating context-aware execution over deterministic sample data.
          </span>
        </div>
        <button
          onClick={() => {
            setDemoStep(1);
            setDemoModalOpen(true);
          }}
          className="text-amber-300 hover:text-white font-semibold underline underline-offset-4 text-xs whitespace-nowrap"
        >
          Launch Guided Scenario &rarr;
        </button>
      </div>

      {/* Hero Section */}
      <motion.section
        className="relative isolate overflow-hidden rounded-[2rem] border border-indigo-300/10 bg-[radial-gradient(ellipse_at_50%_0%,rgba(99,102,241,0.16),transparent_55%),linear-gradient(145deg,rgba(12,18,36,0.68),rgba(7,11,22,0.2))] px-4 py-14 sm:px-8 sm:py-20"
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="trace-ambient-orb pointer-events-none absolute -left-32 top-0 h-80 w-80 rounded-full bg-blue-500/[0.12] blur-[90px]" />
        <div className="trace-ambient-orb pointer-events-none absolute -right-28 top-12 h-96 w-96 rounded-full bg-violet-500/[0.13] blur-[110px]" style={{ animationDelay: '-7s' }} />
        <motion.div className="pointer-events-none absolute left-[13%] top-[24%] h-1 w-1 rounded-full bg-cyan-200 shadow-[0_0_18px_5px_rgba(34,211,238,0.35)]" animate={reduceMotion ? undefined : { y: [0, -18, 0], opacity: [0.35, 0.9, 0.35] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="pointer-events-none absolute right-[17%] top-[33%] h-1.5 w-1.5 rounded-full bg-violet-200 shadow-[0_0_20px_5px_rgba(167,139,250,0.35)]" animate={reduceMotion ? undefined : { y: [0, 14, 0], x: [0, -8, 0], opacity: [0.25, 0.8, 0.25] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} />
        <div className="pointer-events-none absolute inset-x-[12%] bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-300/25 to-transparent" />

        <div className="relative z-10 mx-auto max-w-4xl space-y-7 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/15 bg-slate-950/45 px-3.5 py-1.5 text-xs text-slate-300 shadow-lg shadow-indigo-950/20 backdrop-blur-xl">
            <TraceLogo className="w-4 h-4" />
            <span className="font-semibold text-blue-400">TRACE</span>
            <span className="text-slate-600">·</span>
            <span>Personal Intelligence & Context-Aware Execution System</span>
          </div>

          <h1 className="text-balance text-4xl font-extrabold leading-[1.08] tracking-[-0.045em] text-white sm:text-6xl lg:text-7xl">
            See the connections.<br />
            <span className="trace-gradient-text">
              Know what matters.
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
            People don't suffer from a lack of information — they suffer from scattered context. TRACE connects emails, calendars, meeting notes, and commitments to surface critical conflicts and recommend approved actions.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('command-center')}
              className="group flex items-center gap-2 rounded-xl border border-blue-300/20 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-6 py-3 text-xs font-semibold text-white shadow-lg shadow-indigo-950/50 transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_34px_-14px_rgba(99,102,241,0.9)]"
            >
              <span>Enter Workspace Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setDemoStep(1);
                setDemoModalOpen(true);
              }}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-6 py-3 text-xs font-semibold text-slate-200 transition-all hover:-translate-y-0.5 hover:border-indigo-300/25 hover:bg-indigo-400/[0.08] hover:text-white"
            >
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Interactive Demo Scenario</span>
            </button>

            <button
              onClick={() => setTraviOpen(true)}
              className="flex items-center gap-2.5 rounded-xl border border-cyan-200/15 bg-gradient-to-r from-indigo-500/15 to-cyan-500/[0.06] px-5 py-3 text-xs font-semibold text-indigo-200 transition-all hover:-translate-y-0.5 hover:border-cyan-200/30 hover:shadow-[0_12px_32px_-18px_rgba(34,211,238,0.65)] hover:text-white"
            >
              <TraviRobotLogo className="w-5 h-5" />
              <span>Meet TRAVI</span>
            </button>
          </div>
        </div>
      </motion.section>

      {/* RECREATED BRAND SELECTION SECTION: Two distinct brand cards from visual reference */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
            <span>Explore Options</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            One connected system. Two ways to explore.
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Discover the TRACE intelligence platform or meet TRAVI, your guide to the context behind your information.
          </p>
        </div>

        {/* The Recreated Brand Cards from User Reference Image */}
        <BrandSelectionCards />
      </section>

      {/* The Problem Section */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-blue-400">The Problem</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Information is scattered. Context is lost.
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Every day, vital commitments and schedule changes slip through the cracks across disjointed communication channels.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 rounded-2xl bg-[#0c1220] border border-slate-800 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white">Silent Contradictions</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              An email moves a critical submission cutoff 48 hours earlier, but team calendar invites and shared memory notes still anchor to the outdated deadline.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0c1220] border border-slate-800 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white">Temporal Inversions</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Preparation dry-runs get left scheduled after the actual portal has closed because no system tracks the causal dependency between milestones.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0c1220] border border-slate-800 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white">Lack of Verifiable Agency</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generic autonomous agents mutate calendars and files without oversight, destroying trust. TRACE enforces human approval before committing any change.
            </p>
          </div>
        </div>
      </section>

      {/* The TRACE Workflow Pipeline */}
      <section className="p-8 rounded-3xl bg-[#0a0f1d] border border-slate-800 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-blue-400">The 9-Stage Architecture</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            How TRACE Transforms Information into Action
          </h2>
          <p className="text-xs text-slate-400">
            A deterministic, auditable context chain with human governance at the core.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-9 gap-2 text-xs">
          {[
            { step: '1', title: 'Information', desc: 'Raw emails, calendar events, docs' },
            { step: '2', title: 'Context', desc: 'Entity and timeline extraction' },
            { step: '3', title: 'Connections', desc: 'Cross-document relationship mapping' },
            { step: '4', title: 'Intelligence', desc: 'Contradiction and risk detection' },
            { step: '5', title: 'Recommendation', desc: 'Concrete proposed adjustments' },
            { step: '6', title: 'Approval', desc: 'Explicit human operator review' },
            { step: '7', title: 'Action', desc: 'Deterministic internal execution' },
            { step: '8', title: 'Verification', desc: 'Outcome checks and state diffs' },
            { step: '9', title: 'Updated Context', desc: 'Synchronized workspace memory' }
          ].map((s, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="text-[10px] font-mono text-blue-400 font-bold">0{s.step}</div>
              <div className="font-semibold text-white leading-tight">{s.title}</div>
              <div className="text-[10px] text-slate-400 leading-tight">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PART 3: MEET TRAVI SECTION */}
      <section id="travi-section" className="p-8 rounded-3xl bg-gradient-to-br from-[#0c142b] via-[#0f1730] to-[#0a1020] border border-indigo-500/30 shadow-2xl space-y-8 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-xs text-indigo-300">
              <TraviRobotLogo className="w-4 h-4" />
              <span>Conversational Assistant Inside TRACE</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Meet TRAVI — your guide to the context behind everything.
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              TRAVI is a local demo assistant with predefined keyword responses. Explore sample workspace records, inspect linked evidence, and navigate TRACE—without an external AI service.
            </p>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-1">
              <div className="font-semibold text-white">How TRACE & TRAVI Relate:</div>
              <div className="text-slate-400 text-[11px] leading-relaxed">
                <strong className="text-blue-400">TRACE</strong> is the overall personal intelligence and context-aware execution system.<br />
                <strong className="text-indigo-400">TRAVI</strong> is the assistant interface within TRACE, using transparent local keyword matching over demo workspace records.
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setTraviOpen(true)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs transition-all shadow-lg shadow-indigo-600/25 flex items-center gap-2.5"
              >
                <TraviRobotLogo className="w-5 h-5" />
                <span>Meet TRAVI (Open Assistant)</span>
              </button>

              <button
                onClick={() => setActiveTab('travi')}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold transition-colors"
              >
                Dedicated Full Screen
              </button>
            </div>
          </div>

          {/* TRAVI Conversational Interface Preview */}
          <div className="w-full lg:max-w-md bg-slate-950/90 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-2.5">
                <TraviRobotLogo className="w-7 h-7" />
                <span className="font-bold text-white">TRAVI Live Preview</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400">LOCAL DEMO · KEYWORD MATCH</span>
            </div>

            {/* Preview Question */}
            <div className="p-3 rounded-xl bg-blue-600/10 border border-blue-500/20 text-xs text-blue-200">
              <div className="font-semibold text-[11px] text-blue-300 mb-0.5">Sample Query:</div>
              "Explain the Project Polaris deadline conflict."
            </div>

            {/* Preview Answer */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-2 leading-relaxed">
              <p>
                Source A (Kickoff Email) originally set submission to <strong className="text-white">Oct 20</strong>. Source C (Urgent Email from Sarah Lin) advanced it to <strong className="text-rose-400">Oct 18 at 11:59 PM</strong>.
              </p>
              <p className="text-[11px] text-amber-300/90 bg-amber-950/30 p-2 rounded border border-amber-500/20">
                Warning: The team prep session is booked for Oct 19 — after the portal closes!
              </p>
              <div className="flex items-center gap-1.5 pt-1 text-[10px] text-slate-400">
                <span>Citations:</span>
                <span className="font-mono text-blue-400 bg-slate-950 px-1 rounded">Source A</span>
                <span className="font-mono text-rose-400 bg-slate-950 px-1 rounded">Source C</span>
              </div>
            </div>

            <button
              onClick={() => setTraviOpen(true)}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Ask TRAVI Directly</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Relatable Demo Scenario: The Missing Deadline Update */}
      <section className="p-8 rounded-3xl bg-[#0c1220] border border-slate-800 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-blue-400">Signature Presentation Scenario</div>
            <h2 className="text-2xl font-bold text-white tracking-tight">The Missing Deadline Update</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Watch TRACE ingest multi-source updates, flag an inverted prep calendar event, and execute an approved fix.
            </p>
          </div>

          <button
            onClick={() => {
              setDemoStep(1);
              setDemoModalOpen(true);
            }}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch Interactive Walkthrough</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="font-semibold text-white flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-blue-400" />
              <span>1. Source A: Kickoff Email</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Director Sarah Lin slates final RFP portal submission for <strong className="text-slate-200">October 20, 2026 at 5:00 PM</strong>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="font-semibold text-white flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>2. Source B: Prep Session</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Team calendar invitation booked for <strong className="text-slate-200">October 19, 2026</strong> as a final verification dry run.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-rose-500/30 space-y-2">
            <div className="font-semibold text-white flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-rose-400" />
              <span>3. Source C: Urgent Advance</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Client review board advances the deadline by 48h to <strong className="text-rose-300">October 18 at 11:59 PM</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* Main Modules Showcase */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-blue-400">Comprehensive Product Suite</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            11 Integrated Modules for Personal Intelligence
          </h2>
          <p className="text-xs text-slate-400">
            Every module is live and fully interactive within the current workspace.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div
            onClick={() => setActiveTab('command-center')}
            className="p-5 rounded-2xl bg-[#0c1220] border border-slate-800 hover:border-slate-700 transition-all cursor-pointer space-y-2 group"
          >
            <div className="font-bold text-white group-hover:text-blue-400 transition-colors flex items-center justify-between">
              <span>Command Center</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400" />
            </div>
            <p className="text-slate-400 leading-relaxed">
              Real-time workspace overview with calculated metrics, urgent attention items, and upcoming deadlines.
            </p>
          </div>

          <div
            onClick={() => setActiveTab('intelligence-center')}
            className="p-5 rounded-2xl bg-[#0c1220] border border-slate-800 hover:border-slate-700 transition-all cursor-pointer space-y-2 group"
          >
            <div className="font-bold text-white group-hover:text-blue-400 transition-colors flex items-center justify-between">
              <span>Intelligence Center</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400" />
            </div>
            <p className="text-slate-400 leading-relaxed">
              Reasoning engine exposing conflicting dates, schedule inversions, and multi-source evidence citations.
            </p>
          </div>

          <div
            onClick={() => setActiveTab('context-graph')}
            className="p-5 rounded-2xl bg-[#0c1220] border border-slate-800 hover:border-slate-700 transition-all cursor-pointer space-y-2 group"
          >
            <div className="font-bold text-white group-hover:text-blue-400 transition-colors flex items-center justify-between">
              <span>Context Graph</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400" />
            </div>
            <p className="text-slate-400 leading-relaxed">
              Interactive node topology mapping semantic links between people, emails, calendar events, and deadlines.
            </p>
          </div>

          <div
            onClick={() => setActiveTab('action-board')}
            className="p-5 rounded-2xl bg-[#0c1220] border border-slate-800 hover:border-slate-700 transition-all cursor-pointer space-y-2 group"
          >
            <div className="font-bold text-white group-hover:text-blue-400 transition-colors flex items-center justify-between">
              <span>Action Board</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400" />
            </div>
            <p className="text-slate-400 leading-relaxed">
              Human-in-the-loop review board where users authorize proposed adjustments and verify deterministic outcomes.
            </p>
          </div>

          <div
            onClick={() => setActiveTab('memory-center')}
            className="p-5 rounded-2xl bg-[#0c1220] border border-slate-800 hover:border-slate-700 transition-all cursor-pointer space-y-2 group"
          >
            <div className="font-bold text-white group-hover:text-blue-400 transition-colors flex items-center justify-between">
              <span>Memory Center</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400" />
            </div>
            <p className="text-slate-400 leading-relaxed">
              Structured repository of preserved executive decisions, preferences, commitments, and facts.
            </p>
          </div>

          <div
            onClick={() => setActiveTab('timeline-audit')}
            className="p-5 rounded-2xl bg-[#0c1220] border border-slate-800 hover:border-slate-700 transition-all cursor-pointer space-y-2 group"
          >
            <div className="font-bold text-white group-hover:text-blue-400 transition-colors flex items-center justify-between">
              <span>Timeline & Audit</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400" />
            </div>
            <p className="text-slate-400 leading-relaxed">
              Chronological audit log tracking ingestions, approvals, state modifications, and execution timestamps.
            </p>
          </div>
        </div>
      </section>

      {/* Transparency Status Matrix: Prototype Disclosure */}
      <section className="p-8 rounded-3xl bg-[#090d18] border border-slate-800 space-y-6">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Strict Prototype Transparency</div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Feature Status & Integration Matrix</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Clear delineation of what is operational, what uses deterministic demo data, and what is planned.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-emerald-500/20 space-y-2.5">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Working Capabilities</span>
            </div>
            <ul className="space-y-1.5 text-slate-300">
              <li>• Real-time conflict detection & reasoning</li>
              <li>• Interactive Context Graph with React Flow</li>
              <li>• Human approval action execution engine</li>
              <li>• TRAVI context-grounded conversational agent</li>
              <li>• LocalStorage persistence & deterministic reset</li>
              <li>• Immutable audit event logger</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-blue-500/20 space-y-2.5">
            <div className="flex items-center gap-2 text-blue-400 font-bold">
              <Database className="w-4 h-4" />
              <span>Sample Demo Records</span>
            </div>
            <ul className="space-y-1.5 text-slate-300">
              <li>• Project Polaris executive RFP correspondence</li>
              <li>• Sarah Lin kickoff & urgent advance emails</li>
              <li>• Oct 19 preparation run calendar invitation</li>
              <li>• David Chen architecture specification</li>
              <li>• Steering committee meeting transcript</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-700/60 space-y-2.5">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <Lock className="w-4 h-4" />
              <span>External Gateways Notice</span>
            </div>
            <ul className="space-y-1.5 text-slate-400">
              <li>• Gmail & Google Calendar feeds are labeled DEMO SOURCE</li>
              <li>• No live external OAuth tokens are claimed without setup</li>
              <li>• Air-gapped local browser data security</li>
              <li>• Zero unconsented mutation of external calendars</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="text-center p-12 rounded-3xl bg-gradient-to-b from-[#0e162d] to-[#070b14] border border-blue-500/20 space-y-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Ready to experience context-aware personal intelligence?
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
          Explore the Project Polaris workspace, run the deadline walkthrough, or consult TRAVI.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setActiveTab('command-center')}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-md"
          >
            Open Command Center
          </button>
          <button
            onClick={() => setTraviOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
          >
            Meet TRAVI
          </button>
        </div>
      </section>
    </div>
  );
};
