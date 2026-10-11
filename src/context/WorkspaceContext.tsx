import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  SourceRecord,
  MemoryRecord,
  IntelligenceFinding,
  ActionRecord,
  TrustRiskRecord,
  TimelineEvent,
  IntegrationService,
  WorkspaceSettings,
  NavigationTab,
  TraviMessage
} from '../types';
import {
  initialSources,
  initialMemories,
  initialFindings,
  initialActions,
  initialRisks,
  initialTimeline,
  initialIntegrations,
  initialSettings
} from '../data/initialWorkspace';
import { buildTraviResponse } from '../utils/traviResponses';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message: string;
}

interface WorkspaceContextType {
  sources: SourceRecord[];
  memories: MemoryRecord[];
  findings: IntelligenceFinding[];
  actions: ActionRecord[];
  risks: TrustRiskRecord[];
  timeline: TimelineEvent[];
  integrations: IntegrationService[];
  settings: WorkspaceSettings;
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isDemoModalOpen: boolean;
  setDemoModalOpen: (open: boolean) => void;
  demoStep: number;
  setDemoStep: (step: number) => void;
  
  // TRAVI Assistant State
  isTraviOpen: boolean;
  setTraviOpen: (open: boolean) => void;
  traviMessages: TraviMessage[];
  sendTraviMessage: (text: string) => void;
  resetTraviChat: () => void;
  
  toasts: ToastMessage[];
  addToast: (type: 'success' | 'warning' | 'info' | 'error', title: string, message: string) => void;
  removeToast: (id: string) => void;

  // Selected item modal/drawer for deep inspection
  selectedItem: { type: 'source' | 'memory' | 'finding' | 'action' | 'risk'; item: any } | null;
  setSelectedItem: (item: { type: 'source' | 'memory' | 'finding' | 'action' | 'risk'; item: any } | null) => void;

  // CRUD & State actions
  approveAction: (actionId: string) => void;
  rejectAction: (actionId: string, reason?: string) => void;
  executeActionSimulation: (actionId: string) => void;
  reviewFinding: (findingId: string) => void;
  resolveFinding: (findingId: string) => void;
  dismissFinding: (findingId: string) => void;
  reviewRisk: (riskId: string) => void;
  mitigateRisk: (riskId: string) => void;
  
  addMemory: (memory: Omit<MemoryRecord, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateMemory: (id: string, updates: Partial<MemoryRecord>) => void;
  deleteMemory: (id: string) => void;

  addSource: (source: Omit<SourceRecord, 'id'>) => void;
  updateSource: (id: string, updates: Partial<SourceRecord>) => void;
  deleteSource: (id: string) => void;

  updateSettings: (updates: Partial<WorkspaceSettings>) => void;
  resetDemoWorkspace: () => void;

  // Metrics
  metrics: {
    totalSources: number;
    totalMemories: number;
    openFindings: number;
    pendingActions: number;
    verifiedActions: number;
    unreviewedRisks: number;
    criticalFindings: number;
  };
}

const STORAGE_KEY = 'trace_workspace_state_v1';

const readStoredArray = <T,>(key: string, fallback: T[]): T[] => {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return fallback;

    const parsed: unknown = JSON.parse(saved);
    if (!Array.isArray(parsed)) {
      throw new TypeError(`Stored value for "${key}" is not an array.`);
    }
    return parsed as T[];
  } catch (error) {
    console.error(`Unable to restore TRACE data for "${key}". Using the demo data instead.`, error);
    return fallback;
  }
};

const readStoredObject = <T extends object>(key: string): Partial<T> => {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return {};

    const parsed: unknown = JSON.parse(saved);
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      throw new TypeError(`Stored value for "${key}" is not an object.`);
    }
    return parsed as Partial<T>;
  } catch (error) {
    console.error(`Unable to restore TRACE settings for "${key}". Using the defaults instead.`, error);
    return {};
  }
};

const initialTraviMessage: TraviMessage = {
  id: 'travi-welcome',
  sender: 'travi',
  text: 'Hello! I am TRAVI, TRACE’s local demo assistant. I use predefined keyword responses and search the records in this browser workspace; I am not a connected AI service.',
  timestamp: 'Ready',
  sourceCitations: [
    { label: 'Project Polaris Workspace', id: 'src-email-polaris-kickoff', type: 'email' }
  ]
};

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sources, setSources] = useState<SourceRecord[]>(() =>
    readStoredArray(`${STORAGE_KEY}_sources`, initialSources)
  );
  const [memories, setMemories] = useState<MemoryRecord[]>(() =>
    readStoredArray(`${STORAGE_KEY}_memories`, initialMemories)
  );
  const [findings, setFindings] = useState<IntelligenceFinding[]>(() =>
    readStoredArray(`${STORAGE_KEY}_findings`, initialFindings)
  );
  const [actions, setActions] = useState<ActionRecord[]>(() =>
    readStoredArray(`${STORAGE_KEY}_actions`, initialActions)
  );
  const [risks, setRisks] = useState<TrustRiskRecord[]>(() =>
    readStoredArray(`${STORAGE_KEY}_risks`, initialRisks)
  );
  const [timeline, setTimeline] = useState<TimelineEvent[]>(() =>
    readStoredArray(`${STORAGE_KEY}_timeline`, initialTimeline)
  );
  const [integrations, setIntegrations] = useState<IntegrationService[]>(() =>
    readStoredArray(`${STORAGE_KEY}_integrations`, initialIntegrations)
      .filter(integration => String(integration.category) !== 'ai')
  );
  const [settings, setSettings] = useState<WorkspaceSettings>(() => ({
    ...initialSettings,
    ...readStoredObject<WorkspaceSettings>(`${STORAGE_KEY}_settings`)
  }));

  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isDemoModalOpen, setDemoModalOpen] = useState<boolean>(false);
  const [demoStep, setDemoStep] = useState<number>(1);
  const [selectedItem, setSelectedItem] = useState<{ type: 'source' | 'memory' | 'finding' | 'action' | 'risk'; item: any } | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // TRAVI Assistant State
  const [isTraviOpen, setTraviOpen] = useState<boolean>(false);
  const [traviMessages, setTraviMessages] = useState<TraviMessage[]>(() =>
    readStoredArray(`${STORAGE_KEY}_travi_messages`, [initialTraviMessage])
  );

  const resetTraviChat = () => {
    setTraviMessages([
      {
        id: 'travi-welcome-reset',
        sender: 'travi',
        text: 'Conversation reset. I am TRAVI, your local demo assistant. Ask about records in this workspace to see predefined keyword-based responses.',
        timestamp: 'Just now'
      }
    ]);
  };

  const sendTraviMessage = (userText: string) => {
    const trimmed = userText.trim();
    if (!trimmed) return;

    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: 'user' as const,
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const answer = buildTraviResponse(trimmed, traviMessages, {
      sources,
      memories,
      findings,
      actions,
      risks
    });
    const traviReply: TraviMessage = {
      id: `trv-${Date.now()}`,
      sender: 'travi',
      text: answer.text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sourceCitations: answer.sourceCitations,
      suggestedActionId: answer.suggestedActionId
    };

    setTraviMessages(prev => [...prev, userMsg, traviReply]);
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_sources`, JSON.stringify(sources));
      localStorage.setItem(`${STORAGE_KEY}_memories`, JSON.stringify(memories));
      localStorage.setItem(`${STORAGE_KEY}_findings`, JSON.stringify(findings));
      localStorage.setItem(`${STORAGE_KEY}_actions`, JSON.stringify(actions));
      localStorage.setItem(`${STORAGE_KEY}_risks`, JSON.stringify(risks));
      localStorage.setItem(`${STORAGE_KEY}_timeline`, JSON.stringify(timeline));
      localStorage.setItem(`${STORAGE_KEY}_integrations`, JSON.stringify(integrations));
      localStorage.setItem(`${STORAGE_KEY}_settings`, JSON.stringify(settings));
      localStorage.setItem(`${STORAGE_KEY}_travi_messages`, JSON.stringify(traviMessages));
    } catch (error) {
      console.error('Unable to save TRACE workspace data in browser storage.', error);
    }
  }, [sources, memories, findings, actions, risks, timeline, integrations, settings, traviMessages]);

  const addToast = (type: 'success' | 'warning' | 'info' | 'error', title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const logTimelineEvent = (event: Omit<TimelineEvent, 'id' | 'timestamp'>) => {
    const newEvent: TimelineEvent = {
      ...event,
      id: `ev-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setTimeline(prev => [newEvent, ...prev]);
  };

  // Approve action & execute verified update
  const approveAction = (actionId: string) => {
    const targetAction = actions.find(a => a.id === actionId);
    if (!targetAction) return;

    let updatedValueSummary = '';
    // Apply proposed change if defined
    if (targetAction.proposedChange) {
      const { targetId, field, toValue, fromValue } = targetAction.proposedChange;
      setMemories(prev =>
        prev.map(mem => {
          if (mem.id === targetId) {
            updatedValueSummary = `${mem.title}: "${fromValue}" → "${toValue}"`;
            return {
              ...mem,
              [field]: toValue,
              verificationStatus: 'verified',
              updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
              sourceRef: 'Updated & verified from Source C (Sarah Lin Email, Oct 11)'
            };
          }
          return mem;
        })
      );
    }

    // Update Action status
    const executionTimestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
    setActions(prev =>
      prev.map(a => {
        if (a.id === actionId) {
          return {
            ...a,
            status: 'completed',
            approvalStatus: 'approved',
            executionResult: {
              executedAt: executionTimestamp,
              message: targetAction.proposedChange 
                ? `Successfully synchronized workspace deadline to ${targetAction.proposedChange.toValue}` 
                : 'Action approved and executed deterministically in workspace.',
              isSimulation: true,
              verified: true
            }
          };
        }
        return a;
      })
    );

    // If related to finding, update finding status
    if (targetAction.findingId) {
      setFindings(prev =>
        prev.map(f => {
          if (f.id === targetAction.findingId) {
            return {
              ...f,
              status: 'resolved',
              resolvedAt: executionTimestamp
            };
          }
          return f;
        })
      );
    }

    // If related to risk, mark as mitigated
    if (targetAction.id === 'act-update-polaris-deadline') {
      setRisks(prev =>
        prev.map(r => {
          if (r.id === 'risk-deadline-conflict') {
            return {
              ...r,
              status: 'mitigated'
            };
          }
          return r;
        })
      );
    }

    // Log to Timeline
    logTimelineEvent({
      eventType: 'action_approved',
      description: `Approved & executed: ${targetAction.title}`,
      relatedRecordId: actionId,
      recordType: 'action',
      previousState: targetAction.proposedChange?.fromValue,
      newState: targetAction.proposedChange?.toValue,
      result: 'Verified in workspace memory. Finding resolved.',
      actor: settings.userName
    });

    addToast(
      'success',
      'Action Approved & Verified',
      updatedValueSummary 
        ? `Applied update: ${updatedValueSummary}` 
        : `Approved "${targetAction.title}"`
    );
  };

  const rejectAction = (actionId: string, reason?: string) => {
    const targetAction = actions.find(a => a.id === actionId);
    if (!targetAction) return;

    setActions(prev =>
      prev.map(a => (a.id === actionId ? { ...a, status: 'rejected', approvalStatus: 'rejected' } : a))
    );

    logTimelineEvent({
      eventType: 'action_rejected',
      description: `Rejected action: ${targetAction.title}${reason ? ` (${reason})` : ''}`,
      relatedRecordId: actionId,
      recordType: 'action',
      result: 'Action marked as rejected. No changes applied.',
      actor: settings.userName
    });

    addToast('info', 'Action Rejected', `Proposed action "${targetAction.title}" was declined.`);
  };

  const executeActionSimulation = (actionId: string) => {
    approveAction(actionId);
  };

  const reviewFinding = (findingId: string) => {
    const finding = findings.find(f => f.id === findingId);
    if (!finding) return;

    setFindings(prev =>
      prev.map(f => (f.id === findingId ? { ...f, status: 'reviewed' } : f))
    );

    logTimelineEvent({
      eventType: 'finding_detected',
      description: `Reviewed intelligence finding: ${finding.title}`,
      relatedRecordId: findingId,
      recordType: 'finding',
      actor: settings.userName
    });

    addToast('info', 'Finding Reviewed', `Marked "${finding.title}" as reviewed.`);
  };

  const resolveFinding = (findingId: string) => {
    const finding = findings.find(f => f.id === findingId);
    if (!finding) return;

    setFindings(prev =>
      prev.map(f => (f.id === findingId ? { ...f, status: 'resolved', resolvedAt: new Date().toISOString() } : f))
    );

    logTimelineEvent({
      eventType: 'finding_resolved',
      description: `Manually resolved finding: ${finding.title}`,
      relatedRecordId: findingId,
      recordType: 'finding',
      actor: settings.userName
    });

    addToast('success', 'Finding Resolved', `Marked "${finding.title}" as resolved.`);
  };

  const dismissFinding = (findingId: string) => {
    const finding = findings.find(f => f.id === findingId);
    if (!finding) return;

    setFindings(prev =>
      prev.map(f => (f.id === findingId ? { ...f, status: 'dismissed' } : f))
    );

    logTimelineEvent({
      eventType: 'finding_detected',
      description: `Dismissed finding: ${finding.title}`,
      relatedRecordId: findingId,
      recordType: 'finding',
      actor: settings.userName
    });

    addToast('info', 'Finding Dismissed', `Dismissed "${finding.title}".`);
  };

  const reviewRisk = (riskId: string) => {
    const risk = risks.find(r => r.id === riskId);
    if (!risk) return;

    setRisks(prev =>
      prev.map(r => (r.id === riskId ? { ...r, status: 'reviewed' } : r))
    );

    logTimelineEvent({
      eventType: 'risk_reviewed',
      description: `Reviewed trust risk: ${risk.category} - ${risk.explanation.substring(0, 40)}...`,
      relatedRecordId: riskId,
      recordType: 'risk',
      actor: settings.userName
    });

    addToast('info', 'Risk Reviewed', `Recorded review for risk item.`);
  };

  const mitigateRisk = (riskId: string) => {
    setRisks(prev =>
      prev.map(r => (r.id === riskId ? { ...r, status: 'mitigated' } : r))
    );

    logTimelineEvent({
      eventType: 'risk_reviewed',
      description: `Marked risk ${riskId} as mitigated`,
      relatedRecordId: riskId,
      recordType: 'risk',
      actor: settings.userName
    });

    addToast('success', 'Risk Mitigated', `Risk record marked as mitigated.`);
  };

  const addMemory = (memoryData: Omit<MemoryRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const newMemory: MemoryRecord = {
      ...memoryData,
      id: `mem-${Date.now()}`,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    setMemories(prev => [newMemory, ...prev]);

    logTimelineEvent({
      eventType: 'memory_created',
      description: `Created memory: ${newMemory.title}`,
      relatedRecordId: newMemory.id,
      recordType: 'memory',
      newState: newMemory.value,
      actor: settings.userName
    });

    addToast('success', 'Memory Saved', `Added "${newMemory.title}" to Memory Center.`);
  };

  const updateMemory = (id: string, updates: Partial<MemoryRecord>) => {
    const existing = memories.find(m => m.id === id);
    if (!existing) return;

    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
    setMemories(prev =>
      prev.map(m => (m.id === id ? { ...m, ...updates, updatedAt: timestamp } : m))
    );

    logTimelineEvent({
      eventType: 'memory_edited',
      description: `Updated memory: ${existing.title}`,
      relatedRecordId: id,
      recordType: 'memory',
      previousState: existing.value,
      newState: updates.value || existing.value,
      actor: settings.userName
    });

    addToast('success', 'Memory Updated', `Changes saved to "${existing.title}".`);
  };

  const deleteMemory = (id: string) => {
    const existing = memories.find(m => m.id === id);
    if (!existing) return;

    setMemories(prev => prev.filter(m => m.id !== id));

    logTimelineEvent({
      eventType: 'memory_deleted',
      description: `Deleted memory: ${existing.title}`,
      relatedRecordId: id,
      recordType: 'memory',
      previousState: existing.value,
      actor: settings.userName
    });

    addToast('warning', 'Memory Removed', `Deleted "${existing.title}".`);
  };

  const addSource = (sourceData: Omit<SourceRecord, 'id'>) => {
    const newSource: SourceRecord = {
      ...sourceData,
      id: `src-${Date.now()}`
    };

    setSources(prev => [newSource, ...prev]);

    logTimelineEvent({
      eventType: 'source_added',
      description: `Added source record: ${newSource.title} (${newSource.type})`,
      relatedRecordId: newSource.id,
      recordType: 'source',
      actor: settings.userName
    });

    addToast('success', 'Source Indexed', `Indexed "${newSource.title}".`);
  };

  const updateSource = (id: string, updates: Partial<SourceRecord>) => {
    const existing = sources.find(s => s.id === id);
    if (!existing) return;

    setSources(prev =>
      prev.map(s => (s.id === id ? { ...s, ...updates } : s))
    );

    addToast('success', 'Source Updated', `Updated "${existing.title}".`);
  };

  const deleteSource = (id: string) => {
    const existing = sources.find(s => s.id === id);
    if (!existing) return;

    setSources(prev => prev.filter(s => s.id !== id));

    logTimelineEvent({
      eventType: 'source_deleted',
      description: `Deleted source: ${existing.title}`,
      relatedRecordId: id,
      recordType: 'source',
      actor: settings.userName
    });

    addToast('warning', 'Source Removed', `Removed source record "${existing.title}".`);
  };

  const updateSettings = (updates: Partial<WorkspaceSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
    addToast('info', 'Settings Updated', 'Workspace preferences updated.');
  };

  const resetDemoWorkspace = () => {
    setSources(initialSources);
    setMemories(initialMemories);
    setFindings(initialFindings);
    setActions(initialActions);
    setRisks(initialRisks);
    setTimeline([
      {
        id: `ev-reset-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        eventType: 'workspace_reset',
        description: 'Demo Workspace restored to initial deterministic state (The Missing Deadline Update scenario ready)',
        actor: 'User'
      },
      ...initialTimeline
    ]);
    setIntegrations(initialIntegrations);
    setSettings(initialSettings);
    setTraviMessages([initialTraviMessage]);
    setDemoStep(1);

    try {
      localStorage.removeItem(`${STORAGE_KEY}_sources`);
      localStorage.removeItem(`${STORAGE_KEY}_memories`);
      localStorage.removeItem(`${STORAGE_KEY}_findings`);
      localStorage.removeItem(`${STORAGE_KEY}_actions`);
      localStorage.removeItem(`${STORAGE_KEY}_risks`);
      localStorage.removeItem(`${STORAGE_KEY}_timeline`);
      localStorage.removeItem(`${STORAGE_KEY}_integrations`);
      localStorage.removeItem(`${STORAGE_KEY}_settings`);
      localStorage.removeItem(`${STORAGE_KEY}_travi_messages`);
    } catch (error) {
      console.error('Unable to clear saved TRACE workspace data.', error);
    }

    addToast(
      'success',
      'Workspace Reset Complete',
      'Restored initial Project Polaris records. Ready for demo walkthrough.'
    );
  };

  // Live metrics derived from actual state
  const metrics = {
    totalSources: sources.length,
    totalMemories: memories.length,
    openFindings: findings.filter(f => f.status === 'open').length,
    pendingActions: actions.filter(a => a.status === 'pending_approval' || a.status === 'suggested').length,
    verifiedActions: actions.filter(a => a.status === 'approved' || a.status === 'completed').length,
    unreviewedRisks: risks.filter(r => r.status === 'unreviewed').length,
    criticalFindings: findings.filter(f => f.severity === 'critical' && f.status === 'open').length
  };

  return (
    <WorkspaceContext.Provider
      value={{
        sources,
        memories,
        findings,
        actions,
        risks,
        timeline,
        integrations,
        settings,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        isDemoModalOpen,
        setDemoModalOpen,
        demoStep,
        setDemoStep,
        isTraviOpen,
        setTraviOpen,
        traviMessages,
        sendTraviMessage,
        resetTraviChat,
        toasts,
        addToast,
        removeToast,
        selectedItem,
        setSelectedItem,
        approveAction,
        rejectAction,
        executeActionSimulation,
        reviewFinding,
        resolveFinding,
        dismissFinding,
        reviewRisk,
        mitigateRisk,
        addMemory,
        updateMemory,
        deleteMemory,
        addSource,
        updateSource,
        deleteSource,
        updateSettings,
        resetDemoWorkspace,
        metrics
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};
