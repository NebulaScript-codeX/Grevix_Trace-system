import React, { useState, useRef, useEffect } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { TraviRobotLogo } from './brand/TraviRobotLogo';
import { 
  Send, 
  RotateCcw, 
  ExternalLink, 
  CheckCircle2, 
  Lock, 
  X,
  ChevronRight
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
    findings,
    approveAction,
    setSelectedItem,
    setActiveTab
  } = useWorkspace();

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const samplePrompts = [
    { label: "What is TRACE?", query: "What is TRACE and how does it work?" },
    { label: "Explain deadline conflict", query: "Explain the Project Polaris deadline conflict." },
    { label: "Connected records", query: "Which records are connected to this project?" },
    { label: "What should I review next?", query: "What should I review next in my workspace?" }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [traviMessages]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;
    sendTraviMessage(input);
    setInput('');
  };

  const handleCitationClick = (citation: { label: string; id: string; type: string }) => {
    if (citation.type === 'email' || citation.type === 'calendar' || citation.type === 'document') {
      const src = sources.find(s => s.id === citation.id);
      if (src) setSelectedItem({ type: 'source', item: src });
    } else if (citation.type === 'memory') {
      const mem = memories.find(m => m.id === citation.id);
      if (mem) setSelectedItem({ type: 'memory', item: mem });
    } else if (citation.type === 'action') {
      setActiveTab('action-board');
    } else if (citation.type === 'graph') {
      setActiveTab('context-graph');
    }
  };

  return (
    <div className={`flex flex-col h-full bg-[#090d18] ${isModal ? 'rounded-2xl border border-slate-800 shadow-2xl' : 'rounded-2xl border border-slate-800'}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-800/80 bg-slate-900/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TraviRobotLogo className="w-9 h-9" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-tight">TRAVI</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
                TRACE ASSISTANT
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Your context guide through connected records, conflicts, and outcomes
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetTraviChat}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors text-xs flex items-center gap-1"
            title="Reset conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Reset</span>
          </button>

          {isModal && onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Prototype Disclosure Bar */}
      <div className="px-6 py-2 bg-blue-950/20 border-b border-blue-500/10 flex items-center gap-2 text-[11px] text-blue-300">
        <Lock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
        <span>
          <strong>Grounded Prototype:</strong> TRAVI answers strictly from your current Project Polaris demo records without hallucination.
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {traviMessages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
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
                    ? 'bg-blue-600 text-white rounded-tr-sm shadow-md'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-sm shadow-sm'
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
                {msg.suggestedActionId && (
                  <div className="mt-3 p-2.5 rounded-xl bg-blue-950/40 border border-blue-500/30 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-blue-200 font-medium">
                      Action proposed: Update Project Polaris deadline to Oct 18
                    </span>
                    <button
                      onClick={() => approveAction(msg.suggestedActionId!)}
                      className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[11px] font-semibold transition-colors shrink-0 flex items-center gap-1 shadow-sm"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Approve</span>
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
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="px-6 py-2 bg-slate-950/60 border-t border-slate-800/60 flex items-center gap-2 overflow-x-auto">
        <span className="text-[11px] text-slate-500 shrink-0 font-medium">Ask TRAVI:</span>
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => sendTraviMessage(p.query)}
            className="px-2.5 py-1 text-[11px] bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg border border-slate-800 transition-colors whitespace-nowrap shrink-0"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Input Field */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-900/40">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask TRAVI about Project Polaris, deadline conflicts, evidence, or next actions..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-xl transition-colors shadow-sm"
            aria-label="Send message to TRAVI"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
