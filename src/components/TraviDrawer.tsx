import React from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { TraviAssistant } from './TraviAssistant';

export const TraviDrawer: React.FC = () => {
  const { isTraviOpen, setTraviOpen } = useWorkspace();

  if (!isTraviOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-xl h-full shadow-2xl animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <TraviAssistant isModal={true} onClose={() => setTraviOpen(false)} />
      </div>
    </div>
  );
};
