import React from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { Sparkles, Search } from 'lucide-react';
import { NavigationTab } from '../types';
import { TraceLogo } from './brand/TraceLogo';
import { TraviRobotLogo } from './brand/TraviRobotLogo';

export const Navbar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    setDemoModalOpen, 
    setDemoStep, 
    setTraviOpen
  } = useWorkspace();

  const navLinks: { label: string; tab: NavigationTab }[] = [
    { label: 'Overview', tab: 'home' },
    { label: 'Command', tab: 'command-center' },
    { label: 'Intelligence', tab: 'intelligence-center' },
    { label: 'Context Graph', tab: 'context-graph' },
    { label: 'Action Board', tab: 'action-board' },
    { label: 'TRAVI', tab: 'travi' }
  ];

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-indigo-200/[0.08] bg-[#080c17]/85 px-4 shadow-[0_12px_40px_-30px_rgba(99,102,241,0.5)] backdrop-blur-2xl sm:px-6 lg:gap-8">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <a 
          href="#home" 
          onClick={(e) => { e.preventDefault(); setActiveTab('home'); }}
          className="flex shrink-0 items-center gap-2.5 whitespace-nowrap text-lg font-extrabold tracking-tight text-white transition-colors hover:text-cyan-200"
        >
          <TraceLogo className="w-7 h-7" />
          <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text tracking-[0.2em] text-transparent">TRACE</span>
        </a>

        {/* Workspace indicator */}
        <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400 border-l border-slate-800 pl-3">
          <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
            DEMO WORKSPACE
          </span>
          <span className="text-slate-500">·</span>
          <span className="truncate max-w-[180px] text-slate-300 font-medium">Project Polaris</span>
        </div>
      </div>

      {/* Zone 2: Concise single-line navigation links */}
      <nav className="hidden items-center gap-5 text-xs font-semibold text-slate-400 lg:flex xl:gap-6">
        {navLinks.map((link) => (
          <button
            key={link.tab}
            onClick={() => setActiveTab(link.tab)}
            className={`relative shrink-0 whitespace-nowrap py-2 transition-colors ${
              activeTab === link.tab
                ? 'font-bold text-white after:absolute after:inset-x-0 after:-bottom-[1.15rem] after:h-0.5 after:rounded-full after:bg-gradient-to-r after:from-blue-400 after:to-cyan-300 after:shadow-[0_0_12px_rgba(34,211,238,0.65)]'
                : 'hover:text-slate-200'
            }`}
          >
            {link.label}
          </button>
        ))}
      </nav>

      {/* Zone 3: Primary Action & TRAVI */}
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2.5">
        <button
          onClick={() => setActiveTab('universal-search')}
          className="hidden items-center gap-2 whitespace-nowrap rounded-lg border border-white/[0.08] bg-white/[0.035] px-3 py-1.5 text-xs text-slate-400 transition-colors hover:border-indigo-300/20 hover:bg-indigo-400/[0.08] hover:text-slate-100 xl:flex"
          title="Universal Search"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Search records...</span>
          <kbd className="hidden lg:inline text-[10px] font-mono px-1 rounded bg-slate-800 text-slate-400">⌘K</kbd>
        </button>

        <button
          onClick={() => setTraviOpen(true)}
          className="shrink-0 whitespace-nowrap rounded-lg border border-indigo-300/20 bg-gradient-to-r from-indigo-500/15 to-cyan-500/[0.04] px-3 py-1.5 text-xs font-semibold text-indigo-100 shadow-sm transition-all hover:border-cyan-200/30 hover:shadow-[0_8px_24px_-14px_rgba(99,102,241,0.8)]"
          title="Meet TRAVI Assistant"
        >
          <TraviRobotLogo className="w-5 h-5" />
          <span className="hidden sm:inline">Meet TRAVI</span>
        </button>

        <button
          onClick={() => {
            setDemoStep(1);
            setDemoModalOpen(true);
          }}
          className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border border-blue-300/15 bg-gradient-to-r from-blue-600 to-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-indigo-950/50 transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_25px_-10px_rgba(59,130,246,0.8)]"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Interactive Demo</span>
        </button>
      </div>
    </header>
  );
};
