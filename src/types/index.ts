export type SourceType = 'email' | 'document' | 'meeting' | 'calendar' | 'note' | 'update';

export interface SourceRecord {
  id: string;
  title: string;
  type: SourceType;
  summary: string;
  content: string;
  sourceLabel: string;
  date: string;
  author?: string;
  entities: {
    people: string[];
    projects: string[];
    deadlines?: string[];
  };
  extractedDetails: string[];
  relatedFindingIds?: string[];
  relatedActionIds?: string[];
  isDemo: boolean;
}

export type MemoryCategory = 
  | 'people' 
  | 'projects' 
  | 'decisions' 
  | 'preferences' 
  | 'commitments' 
  | 'deadlines' 
  | 'facts';

export interface MemoryRecord {
  id: string;
  title: string;
  category: MemoryCategory;
  value: string;
  sourceRef: string;
  sourceId?: string;
  createdAt: string;
  updatedAt: string;
  verificationStatus: 'verified' | 'unverified' | 'inferred';
  relatedEntities: string[];
}

export type FindingSeverity = 'critical' | 'warning' | 'advisory';
export type FindingCategory = 'conflict' | 'outdated' | 'followup' | 'dependency' | 'confirmation';
export type FindingStatus = 'open' | 'reviewed' | 'resolved' | 'dismissed';

export interface IntelligenceFinding {
  id: string;
  title: string;
  explanation: string;
  severity: FindingSeverity;
  category: FindingCategory;
  confidence: number; // 0 to 1
  supportingEvidence: string[];
  sourceIds: string[];
  relatedEntities: {
    people: string[];
    projects: string[];
    tasks?: string[];
  };
  whyItMatters: string;
  recommendedActionId?: string;
  status: FindingStatus;
  detectedAt: string;
  resolvedAt?: string;
}

export type ActionStatus = 
  | 'suggested' 
  | 'pending_approval' 
  | 'approved' 
  | 'in_progress' 
  | 'completed' 
  | 'failed' 
  | 'rejected' 
  | 'cancelled';

export type ActionPriority = 'urgent' | 'high' | 'medium' | 'low';

export interface ActionRecord {
  id: string;
  title: string;
  explanation: string;
  findingId?: string;
  relatedEntityIds: string[];
  priority: ActionPriority;
  status: ActionStatus;
  createdAt: string;
  approvalStatus: 'unreviewed' | 'approved' | 'rejected';
  proposedChange?: {
    targetType: 'memory' | 'source' | 'project' | 'schedule';
    targetId: string;
    field: string;
    fromValue: string;
    toValue: string;
  };
  executionResult?: {
    executedAt: string;
    message: string;
    isSimulation: boolean;
    verified: boolean;
  };
}

export type RiskSeverity = 'critical' | 'high' | 'medium' | 'low';
export type RiskStatus = 'unreviewed' | 'reviewed' | 'mitigated';

export interface TrustRiskRecord {
  id: string;
  category: string;
  severity: RiskSeverity;
  explanation: string;
  supportingSourceIds: string[];
  conflictingValues?: {
    labelA: string;
    valueA: string;
    sourceAId: string;
    labelB: string;
    valueB: string;
    sourceBId: string;
  };
  lastUpdated: string;
  confidence: number;
  suggestedResolution: string;
  status: RiskStatus;
}

export type TimelineEventType = 
  | 'source_added'
  | 'source_deleted'
  | 'memory_created'
  | 'memory_edited'
  | 'memory_deleted'
  | 'finding_detected'
  | 'finding_resolved'
  | 'action_suggested'
  | 'action_approved'
  | 'action_rejected'
  | 'action_executed'
  | 'risk_reviewed'
  | 'workspace_reset';

export interface TimelineEvent {
  id: string;
  timestamp: string;
  eventType: TimelineEventType;
  description: string;
  relatedRecordId?: string;
  recordType?: string;
  previousState?: string;
  newState?: string;
  result?: string;
  actor: string;
}

export interface IntegrationService {
  id: string;
  name: string;
  category: 'email' | 'calendar' | 'documents' | 'meetings' | 'collaboration' | 'ai';
  status: 'demo_only' | 'available' | 'configured' | 'connected' | 'unavailable';
  permissions: string[];
  lastSync?: string;
  capabilities: string[];
  description: string;
  iconName: string;
}

export interface WorkspaceSettings {
  userName: string;
  userRole: string;
  workspaceName: string;
  confidenceThreshold: number;
  autoDetectRisks: boolean;
  notifyOnConflict: boolean;
  auditRetentionDays: number;
  demoModeActive: boolean;
  theme: 'dark' | 'midnight';
}

export type NavigationTab = 
  | 'home'
  | 'command-center'
  | 'intelligence-center'
  | 'memory-center'
  | 'context-graph'
  | 'action-board'
  | 'source-library'
  | 'trust-risk'
  | 'universal-search'
  | 'timeline-audit'
  | 'integrations'
  | 'settings'
  | 'travi';

export interface TraviMessage {
  id: string;
  sender: 'user' | 'travi';
  text: string;
  timestamp: string;
  relatedRecordIds?: string[];
  suggestedActionId?: string;
  sourceCitations?: { label: string; id: string; type: string }[];
}

