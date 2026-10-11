import React from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { TraviRobotLogo } from './TraviRobotLogo';
import { TraceLogo } from './TraceLogo';
import { ArrowRight } from 'lucide-react';

export const BrandSelectionCards: React.FC = () => {
  const { setActiveTab, setTraviOpen } = useWorkspace();

  return (
    <div className="space-y-4 max-w-4xl mx-auto w-full">
      {/* CARD 1 — TRAVI */}
      <button
        type="button"
        onClick={() => setTraviOpen(true)}
        className="w-full text-left p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-[#090e1a]/90 hover:bg-[#0d1426] border border-indigo-500/20 hover:border-indigo-400/50 shadow-xl hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 group flex items-center justify-between gap-5 relative overflow-hidden"
      >
        {/* Subtle hover gradient shimmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        <div className="flex items-center gap-5 sm:gap-6 relative z-10 min-w-0">
          {/* Robot Mascot Logo */}
          <div className="group-hover:scale-105 group-hover:rotate-1 transition-transform duration-300">
            <TraviRobotLogo className="w-16 h-16 sm:w-20 sm:h-20" />
          </div>

          <div className="space-y-1.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                TRAVI
              </h3>
              <span className="px-3 py-0.5 rounded-full text-[11px] sm:text-xs font-semibold tracking-wider font-mono uppercase bg-indigo-950/70 border border-indigo-500/40 text-indigo-300 shadow-sm">
                TRACE ASSISTANT
              </span>
            </div>
            <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed truncate sm:whitespace-normal">
              Your context guide through connected outcomes.
            </p>
          </div>
        </div>

        {/* Right Arrow */}
        <div className="relative z-10 shrink-0 pl-2">
          <ArrowRight className="w-6 h-6 sm:w-7 sm:h-7 text-slate-400 group-hover:text-white group-hover:translate-x-2 transition-all duration-300" />
        </div>
      </button>

      {/* CARD 2 — TRACE */}
      <button
        type="button"
        onClick={() => setActiveTab('command-center')}
        className="w-full text-left p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-[#090e1a]/90 hover:bg-[#0c162c] border border-blue-500/20 hover:border-cyan-400/50 shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 group flex items-center justify-between gap-5 relative overflow-hidden"
      >
        {/* Subtle hover gradient shimmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        <div className="flex items-center gap-5 sm:gap-6 relative z-10 min-w-0">
          {/* Geometric Platform Logo */}
          <div className="group-hover:scale-105 group-hover:-rotate-1 transition-transform duration-300">
            <TraceLogo className="w-16 h-16 sm:w-20 sm:h-20" />
          </div>

          <div className="space-y-1.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                TRACE
              </h3>
              <span className="px-3 py-0.5 rounded-full text-[11px] sm:text-xs font-semibold tracking-wider font-mono uppercase bg-blue-950/70 border border-blue-500/40 text-cyan-400 shadow-sm">
                MAIN PLATFORM
              </span>
            </div>
            <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed truncate sm:whitespace-normal">
              Connect. Analyze. Take action.
            </p>
          </div>
        </div>

        {/* Right Arrow */}
        <div className="relative z-10 shrink-0 pl-2">
          <ArrowRight className="w-6 h-6 sm:w-7 sm:h-7 text-slate-400 group-hover:text-white group-hover:translate-x-2 transition-all duration-300" />
        </div>
      </button>
    </div>
  );
};
