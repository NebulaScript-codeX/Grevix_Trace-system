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
    <header className="h-16 px-6 bg-[#090e1a]/95 border-b border-slate-800/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between gap-8">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <a 
          href="#home" 
          onClick={(e) => { e.preventDefault(); setActiveTab('home'); }}
          className="text-lg font-extrabold tracking-tight text-white hover:text-blue-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2.5"
        >
          <TraceLogo className="w-7 h-7" />
          <span className="tracking-widest">TRACE</span>
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
      <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-400">
        {navLinks.map((link) => (
          <button
            key={link.tab}
            onClick={() => setActiveTab(link.tab)}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === link.tab
                ? 'text-white border-b-2 border-blue-500 font-bold'
                : 'hover:text-slate-200'
            }`}
          >
            {link.label}
          </button>
        ))}
      </nav>

      {/* Zone 3: Primary Action & TRAVI */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          onClick={() => setActiveTab('universal-search')}
          className="hidden xl:flex items-center gap-2 px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 bg-slate-900 hover:bg-slate-800/90 border border-slate-800 rounded-lg transition-colors whitespace-nowrap"
          title="Universal Search"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Search records...</span>
          <kbd className="hidden lg:inline text-[10px] font-mono px-1 rounded bg-slate-800 text-slate-400">⌘K</kbd>
        </button>

        <button
          onClick={() => setTraviOpen(true)}
          className="px-3 py-1.5 text-xs font-semibold text-indigo-200 hover:text-white bg-indigo-950/70 hover:bg-indigo-900/70 border border-indigo-500/30 rounded-lg transition-all flex items-center gap-2 whitespace-nowrap shrink-0 shadow-sm"
          title="Meet TRAVI Assistant"
        >
          <TraviRobotLogo className="w-5 h-5" />
          <span>Meet TRAVI</span>
        </button>

        <button
          onClick={() => {
            setDemoStep(1);
            setDemoModalOpen(true);
          }}
          className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-all shadow-md shadow-blue-600/20 flex items-center gap-1.5 whitespace-nowrap shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Demo</span>
        </button>
      </div>
    </header>
  );
};

