import React from 'react';
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'motion/react';
import { useWorkspace } from '../context/WorkspaceContext';
import { TraviAssistant } from './TraviAssistant';
import { TraviRobotLogo } from './brand/TraviRobotLogo';
import { MessageCircle } from 'lucide-react';

export const TraviDrawer: React.FC = () => {
  const { isTraviOpen, setTraviOpen } = useWorkspace();
  const reduceMotion = useReducedMotion();

  return (
    <LayoutGroup id="travi-assistant">
      <AnimatePresence initial={false}>
        {!isTraviOpen && (
          <motion.button
            type="button"
            layoutId="travi-orb"
            layout="position"
            onClick={() => setTraviOpen(true)}
            aria-label="Open TRAVI local demo assistant"
            title="Open TRAVI"
            className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full border border-indigo-300/30 bg-gradient-to-br from-indigo-500/30 via-[#121a31] to-cyan-500/20 p-1.5 pr-4 text-xs font-semibold text-white shadow-[0_12px_44px_-12px_rgba(79,70,229,0.65)] backdrop-blur-xl hover:shadow-[0_16px_54px_-12px_rgba(34,211,238,0.44)] focus-visible:outline-offset-4 sm:bottom-7 sm:right-7"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.8, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, scale: 0.72 }}
            whileHover={reduceMotion ? undefined : { y: -3, scale: 1.035 }}
            whileTap={reduceMotion ? undefined : { scale: 0.96 }}
            transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 330, damping: 27 }}
          >
            <motion.span layoutId="travi-avatar" className="trace-float relative flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-slate-950/40 shadow-[0_0_24px_rgba(34,211,238,0.2)]">
              <TraviRobotLogo className="h-10 w-10" />
              <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-[#10162a] bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
            </motion.span>
            <span className="hidden sm:inline">Ask TRAVI</span>
            <MessageCircle className="h-3.5 w-3.5 text-cyan-200" />
          </motion.button>
        )}

        {isTraviOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex justify-end bg-slate-950/65 p-0 backdrop-blur-sm sm:p-3 md:p-5"
            onClick={() => setTraviOpen(false)}
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.22 }}
          >
            <motion.div
              layoutId="travi-orb"
              layout="position"
              role="dialog"
              aria-modal="true"
              aria-label="TRAVI local demo assistant"
              className="h-full w-full max-w-xl overflow-hidden rounded-none border border-indigo-300/20 bg-[#090d18]/95 shadow-[0_30px_120px_-25px_rgba(49,46,129,0.6)] backdrop-blur-2xl sm:rounded-3xl"
              onClick={event => event.stopPropagation()}
              initial={reduceMotion ? false : { opacity: 0.8, x: 36, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0.75, x: 24, scale: 0.98 }}
              transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 29 }}
            >
              <TraviAssistant isModal onClose={() => setTraviOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
};
