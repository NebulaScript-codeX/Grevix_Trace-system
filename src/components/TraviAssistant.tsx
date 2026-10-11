import React, { useState, useRef, useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { useWorkspace } from '../context/WorkspaceContext';
import { TraviRobotLogo } from './brand/TraviRobotLogo';
import { 
  Send, 
  RotateCcw, 
  ExternalLink, 
  CheckCircle2, 
  Lock, 
  X
} from 'lucide-react';

interface TraviAssistantProps {
  isModal?: boolean;
  onClose?: () => void;
}

export const TraviAssistant: React.FC<TraviAssistantProps> = ({ isModal = false, onClose }) => {
  const { 
    traviMessages, 
    sendTraviMessage, 
    resetTraviChat, 
    sources, 
    memories, 
    actions,
    approveAction,
    setSelectedItem,
    setActiveTab
  } = useWorkspace();

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!isModal || !onClose) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModal, onClose]);

  const samplePrompts = [
    { label: "What is TRACE?", query: "What is TRACE and how does it work?" },
    { label: "Explain deadline conflict", query: "Explain the Project Polaris deadline conflict." },
    { label: "Connected records", query: "Which records are connected to this project?" },
    { label: "What should I review next?", query: "What should I review next in my workspace?" }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  }, [traviMessages, reduceMotion]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;
    sendTraviMessage(input);
    setInput('');
  };

  const handleCitationClick = (citation: { label: string; id: string; type: string }) => {
    const source = sources.find(record => record.id === citation.id);
    if (source) {
      setSelectedItem({ type: 'source', item: source });
    } else if (citation.type === 'memory') {
      const mem = memories.find(m => m.id === citation.id);
      if (mem) setSelectedItem({ type: 'memory', item: mem });
    } else if (citation.type === 'action') {
      setActiveTab('action-board');
    } else if (citation.type === 'graph') {
      setActiveTab('context-graph');
    } else if (citation.type === 'risk') {
      setActiveTab('trust-risk');
    } else if (citation.type === 'source') {
      setActiveTab('source-library');
    }
  };

  return (
    <div className={`relative flex h-full flex-col overflow-hidden bg-[radial-gradient(ellipse_at_top_right,rgba(79,70,229,0.12),transparent_42%),linear-gradient(155deg,#0d1325,#080c17_72%)] ${isModal ? 'border-0 sm:rounded-3xl' : 'rounded-2xl border border-indigo-400/15'}`}>
      {/* Header */}
      <div className="relative flex items-center justify-between border-b border-indigo-200/10 bg-white/[0.025] px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <motion.span layoutId="travi-avatar" className="relative flex h-10 w-10 items-center justify-center rounded-full border border-cyan-200/20 bg-indigo-500/10 shadow-[0_0_28px_rgba(99,102,241,0.26)]">
            <motion.span
              className="block h-9 w-9"
              animate={reduceMotion ? undefined : { y: [0, -2, 0], filter: ['drop-shadow(0 0 4px rgba(34,211,238,.16))', 'drop-shadow(0 0 10px rgba(34,211,238,.34))', 'drop-shadow(0 0 4px rgba(34,211,238,.16))'] }}
              transition={{ duration: 4.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <TraviRobotLogo className="h-full w-full" />
            </motion.span>
          </motion.span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-tight">TRAVI</h2>
              <span className="rounded-full border border-cyan-300/20 bg-gradient-to-r from-indigo-400/10 to-cyan-400/10 px-2 py-0.5 text-[9px] font-mono font-bold tracking-wider text-cyan-200">
                LOCAL DEMO
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Ask about the information saved in this workspace
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetTraviChat}
            className="flex items-center gap-1 rounded-lg border border-white/5 p-1.5 text-xs text-slate-400 transition-colors hover:border-indigo-300/20 hover:bg-indigo-400/10 hover:text-white"
            title="Reset conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Reset</span>
          </button>

          {isModal && onClose && (
            <button
              onClick={onClose}
              aria-label="Close TRAVI assistant"
              className="rounded-lg border border-white/5 p-1.5 text-slate-400 transition-colors hover:border-rose-300/20 hover:bg-rose-400/10 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Prototype Disclosure Bar */}
      <div className="flex items-center gap-2 border-b border-indigo-300/10 bg-gradient-to-r from-indigo-500/[0.08] via-blue-500/[0.04] to-transparent px-4 py-2 text-[10px] text-blue-200/90 sm:px-6 sm:text-[11px]">
        <Lock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
        <span>
          <strong>Local demo assistant:</strong> TRAVI uses simple keyword rules to search this workspace. It is not an AI service.
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:p-6">
        {traviMessages.map((msg) => {
          const isUser = msg.sender === 'user';
          const suggestedAction = msg.suggestedActionId
            ? actions.find(action => action.id === msg.suggestedActionId)
            : undefined;
          const canApproveSuggestedAction = suggestedAction?.status === 'pending_approval'
            || suggestedAction?.status === 'suggested';
          return (
            <motion.div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
              initial={reduceMotion ? false : { opacity: 0, y: 8, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: reduceMotion ? 0 : 0.22, ease: 'easeOut' }}
            >
              {/* Avatar */}
              {isUser ? (
                <div className="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold bg-blue-600 text-white shadow-sm">
                  YOU
                </div>
              ) : (
                <TraviRobotLogo className="w-7 h-7 shrink-0" />
              )}

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-tr-sm shadow-[0_10px_28px_-16px_rgba(59,130,246,0.7)]'
                    : 'border border-indigo-200/[0.09] bg-white/[0.035] text-slate-200 rounded-tl-sm shadow-sm'
                }`}
              >
                <div className="whitespace-pre-line font-sans">
                  {msg.text}
                </div>

                {/* Citations if available */}
                {msg.sourceCitations && msg.sourceCitations.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 space-y-1">
                    <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                      Grounded Evidence & Record Citations:
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {msg.sourceCitations.map((cit, i) => (
                        <button
                          key={i}
                          onClick={() => handleCitationClick(cit)}
                          className="px-2 py-1 rounded bg-slate-950 hover:bg-slate-800 text-blue-400 hover:text-blue-300 text-[11px] font-mono border border-slate-800 flex items-center gap-1 transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>{cit.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Inline Action Callout if suggested */}
                {msg.suggestedActionId && suggestedAction && (
                  <div className="mt-3 p-2.5 rounded-xl bg-blue-950/40 border border-blue-500/30 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-blue-200 font-medium">
                      {suggestedAction.title}
                    </span>
                    <button
                      onClick={() => approveAction(suggestedAction.id)}
                      disabled={!canApproveSuggestedAction}
                      className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-[11px] font-semibold transition-colors shrink-0 flex items-center gap-1 shadow-sm"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{canApproveSuggestedAction ? 'Approve' : 'Reviewed'}</span>
                    </button>
                  </div>
                )}

                <div
                  className={`mt-1.5 text-[10px] font-mono ${
                    isUser ? 'text-blue-200/80 text-right' : 'text-slate-500'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </motion.div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="flex items-center gap-2 overflow-x-auto border-t border-white/[0.06] bg-slate-950/35 px-4 py-2 sm:px-6">
        <span className="text-[11px] text-slate-500 shrink-0 font-medium">Ask TRAVI:</span>
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => sendTraviMessage(p.query)}
            className="shrink-0 whitespace-nowrap rounded-full border border-indigo-200/10 bg-white/[0.035] px-2.5 py-1 text-[10px] text-slate-300 transition-colors hover:border-cyan-200/20 hover:bg-indigo-400/10 hover:text-white sm:text-[11px]"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Input Field */}
      <div className="border-t border-indigo-200/10 bg-slate-950/45 p-3 sm:p-4">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask TRAVI about Project Polaris, deadline conflicts, evidence, or next actions..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 rounded-xl border border-indigo-200/10 bg-black/25 px-4 py-3 text-xs text-white placeholder-slate-500 focus:border-cyan-300/40 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="rounded-xl border border-blue-300/20 bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 text-white shadow-[0_8px_22px_-12px_rgba(99,102,241,0.75)] transition hover:shadow-[0_10px_30px_-10px_rgba(34,211,238,0.55)] disabled:opacity-40"
            aria-label="Send message to TRAVI"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
