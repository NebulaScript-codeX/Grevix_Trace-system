import { 
  SourceRecord, 
  MemoryRecord, 
  IntelligenceFinding, 
  ActionRecord, 
  TrustRiskRecord, 
  TimelineEvent, 
  IntegrationService, 
  WorkspaceSettings 
} from '../types';

export const initialSources: SourceRecord[] = [
  {
    id: 'src-email-polaris-kickoff',
    title: 'Project Polaris Final RFP Timeline & Guidelines',
    type: 'email',
    summary: 'Original kickoff email from Project Director Sarah Lin outlining deliverables and initial submission cutoff.',
    content: `From: Sarah Lin <s.lin@meridian-tech.org>
To: Polaris Core Team <polaris-core@meridian-tech.org>
Date: October 5, 2026, 09:30 AM
Subject: Project Polaris Final RFP Timeline & Guidelines

Hi Team,

As agreed in our steering committee session yesterday, the Project Polaris final client RFP submission deadline is firmly set for Tuesday, October 20, 2026 at 5:00 PM EST.

Key dependencies:
1. Technical architecture sign-off (Lead: David Chen)
2. Regulatory compliance review (Lead: Elena Rostova)
3. Client portal dry-run 24 hours prior to cutoff.

Please ensure all sub-system documents are indexed in TRACE.

Best,
Sarah Lin
Director of Strategic Programs`,
    sourceLabel: 'Internal Email · Sarah Lin',
    date: '2026-10-05 09:30',
    author: 'Sarah Lin',
    entities: {
      people: ['Sarah Lin', 'David Chen', 'Elena Rostova'],
      projects: ['Project Polaris'],
      deadlines: ['October 20, 2026, 5:00 PM']
    },
    extractedDetails: [
      'Original submission deadline: October 20, 2026 at 5:00 PM',
      'Architecture sign-off assigned to David Chen',
      'Compliance review assigned to Elena Rostova'
    ],
    relatedFindingIds: ['find-deadline-conflict'],
    isDemo: true
  },
  {
    id: 'src-cal-prep-session',
    title: 'Polaris Final Submission Prep & Verification Run',
    type: 'calendar',
    summary: 'Team calendar invitation booked for final review 24 hours prior to the original submission cutoff.',
    content: `Calendar Event: Project Polaris Final Submission Prep & Verification Run
Organizer: Sarah Lin <s.lin@meridian-tech.org>
Attendees: David Chen, Elena Rostova, Marcus Vance, Engineering Leads
When: Monday, October 19, 2026 · 2:00 PM - 4:00 PM EST
Location: Room 402 / Google Meet

Agenda:
1. Verification of all client submission artifacts
2. Automated compliance validation run
3. Executive sign-off ahead of tomorrow's (Oct 20) final portal submission.`,
    sourceLabel: 'Google Calendar (Simulated Import)',
    date: '2026-10-12 14:00',
    author: 'Sarah Lin',
    entities: {
      people: ['Sarah Lin', 'David Chen', 'Elena Rostova'],
      projects: ['Project Polaris'],
      deadlines: ['October 19, 2026, 2:00 PM']
    },
    extractedDetails: [
      'Preparation session scheduled for October 19, 2026 from 2:00 PM to 4:00 PM',
      'Intended as 24-hour buffer before original Oct 20 deadline',
      'Assumes final submission happens on October 20'
    ],
    relatedFindingIds: ['find-deadline-conflict', 'find-prep-inversion'],
    isDemo: true
  },
  {
    id: 'src-email-deadline-advancement',
    title: 'URGENT UPDATE: Polaris Client RFP Submission Cutoff Advanced',
    type: 'email',
    summary: 'Newer executive notification moving the final client submission cutoff earlier by 48 hours to October 18.',
    content: `From: Sarah Lin <s.lin@meridian-tech.org>
To: Polaris Core Team <polaris-core@meridian-tech.org>
Date: October 11, 2026, 08:15 AM
Subject: URGENT UPDATE: Polaris Client RFP Submission Cutoff Advanced

Team,

Please take immediate note: The Municipal Oversight Committee just notified us that the portal submission deadline for Project Polaris has been moved forward by 48 hours.

The NEW binding submission cutoff is:
Sunday, October 18, 2026 at 11:59 PM EST.

This supersedes our previous October 20 date. The portal will automatically lock at midnight Sunday.

Please adjust sprint deliverables immediately. I will check in with David and Elena this afternoon regarding readiness.

Regards,
Sarah`,
    sourceLabel: 'Internal Email · Sarah Lin (Authoritative Update)',
    date: '2026-10-11 08:15',
    author: 'Sarah Lin',
    entities: {
      people: ['Sarah Lin', 'David Chen', 'Elena Rostova'],
      projects: ['Project Polaris'],
      deadlines: ['October 18, 2026, 11:59 PM']
    },
    extractedDetails: [
      'NEW binding submission deadline: Sunday, October 18, 2026 at 11:59 PM EST',
      'Advances previous deadline by 48 hours',
      'Portal locks strictly at midnight Sunday October 18'
    ],
    relatedFindingIds: ['find-deadline-conflict', 'find-prep-inversion'],
    relatedActionIds: ['act-update-polaris-deadline', 'act-flag-prep-session'],
    isDemo: true
  },
  {
    id: 'src-doc-architecture-spec',
    title: 'Project Polaris Technical Architecture Specification v2.4',
    type: 'document',
    summary: 'Comprehensive engineering document outlining context graph schema and multi-tenant data isolation.',
    content: `PROJECT POLARIS TECHNICAL SPECIFICATION v2.4
Document Lead: David Chen (Lead Architecture Engineer)
Status: Draft - Pending Final Review

1. Overview:
Project Polaris provides deterministic personal intelligence by federating scattered contextual records across messaging, calendar, and document channels.

2. Architecture Constraints:
- Zero telemetry leakage outside customer security perimeter
- Monotonic timestamp ordering on all extracted state events
- Full cryptographic hash linking between recommendations and source records.

3. Sign-off Required:
David Chen is designated as the sole technical signatory for Cloud Data Residency Compliance before final client submission.`,
    sourceLabel: 'Technical Spec · Internal Wiki',
    date: '2026-10-08 16:45',
    author: 'David Chen',
    entities: {
      people: ['David Chen'],
      projects: ['Project Polaris']
    },
    extractedDetails: [
      'David Chen is sole signatory for cloud data residency compliance',
      'Requires deterministic hash linking on all recommendations',
      'Zero telemetry leakage requirement'
    ],
    relatedFindingIds: ['find-residency-signoff'],
    isDemo: true
  },
  {
    id: 'src-meeting-steering-notes',
    title: 'Steering Committee Sync Notes: Executive Decision Log',
    type: 'meeting',
    summary: 'Transcript and decisions from weekly executive alignment meeting with Sarah Lin and team leads.',
    content: `Meeting Date: October 09, 2026 · 10:00 AM
Attendees: Sarah Lin, David Chen, Elena Rostova

Key Decisions:
1. Decision: All external client action proposals require explicit human approval; autonomous execution without human review is prohibited.
2. Preference: Sarah Lin stated: "I prefer asynchronous updates in the morning before 10:00 AM; do not schedule ad-hoc calls before our morning triage."
3. Commitment: Elena Rostova will deliver the initial regulatory audit checklist by October 14.`,
    sourceLabel: 'Executive Meeting Notes',
    date: '2026-10-09 10:45',
    author: 'Elena Rostova',
    entities: {
      people: ['Sarah Lin', 'David Chen', 'Elena Rostova'],
      projects: ['Project Polaris']
    },
    extractedDetails: [
      'Sarah Lin prefers async briefings before 10:00 AM',
      'Human-in-the-loop approval strictly required for external actions',
      'Elena committed to audit checklist by Oct 14'
    ],
    isDemo: true
  },
  {
    id: 'src-note-personal-triage',
    title: 'Personal Executive Briefing Preferences',
    type: 'note',
    summary: 'User preference note regarding briefing cadence and priority routing.',
    content: `Note:
- Flag any deadline shift of greater than 24 hours immediately as Critical.
- Provide source diff highlighting whenever an updated email contradicts an older record.
- Keep audit log exportable for compliance review.`,
    sourceLabel: 'Personal Note',
    date: '2026-10-04 11:00',
    author: 'Workspace User',
    entities: {
      people: ['Workspace User'],
      projects: ['Project Polaris']
    },
    extractedDetails: [
      'Deadline shifts >24 hours require Critical severity',
      'Highlight diffs on contradicting sources'
    ],
    isDemo: true
  }
];

export const initialMemories: MemoryRecord[] = [
  {
    id: 'mem-polaris-deadline',
    title: 'Project Polaris Client Submission Deadline',
    category: 'deadlines',
    value: 'October 20, 2026, 5:00 PM',
    sourceRef: 'Source A: Project Polaris Final RFP Timeline & Guidelines (Email, Oct 5)',
    sourceId: 'src-email-polaris-kickoff',
    createdAt: '2026-10-05 09:35',
    updatedAt: '2026-10-05 09:35',
    verificationStatus: 'unverified',
    relatedEntities: ['Project Polaris', 'Sarah Lin']
  },
  {
    id: 'mem-polaris-prep-session',
    title: 'Polaris Verification Dry-Run Session',
    category: 'commitments',
    value: 'October 19, 2026, 2:00 PM - 4:00 PM',
    sourceRef: 'Source B: Polaris Final Submission Prep (Calendar, Oct 12)',
    sourceId: 'src-cal-prep-session',
    createdAt: '2026-10-12 14:05',
    updatedAt: '2026-10-12 14:05',
    verificationStatus: 'verified',
    relatedEntities: ['Project Polaris', 'Sarah Lin', 'David Chen']
  },
  {
    id: 'mem-sarah-comms-pref',
    title: 'Sarah Lin Communication Cadence',
    category: 'preferences',
    value: 'Prefers morning asynchronous briefings before 10:00 AM; no ad-hoc morning calls',
    sourceRef: 'Steering Committee Sync Notes (Meeting, Oct 9)',
    sourceId: 'src-meeting-steering-notes',
    createdAt: '2026-10-09 10:50',
    updatedAt: '2026-10-09 10:50',
    verificationStatus: 'verified',
    relatedEntities: ['Sarah Lin']
  },
  {
    id: 'mem-david-arch-signoff',
    title: 'Cloud Data Residency Authority',
    category: 'commitments',
    value: 'David Chen is designated sole technical authority for cloud data residency sign-off',
    sourceRef: 'Technical Architecture Specification v2.4 (Document, Oct 8)',
    sourceId: 'src-doc-architecture-spec',
    createdAt: '2026-10-08 17:00',
    updatedAt: '2026-10-08 17:00',
    verificationStatus: 'verified',
    relatedEntities: ['David Chen', 'Project Polaris']
  },
  {
    id: 'mem-polaris-scope',
    title: 'Project Polaris Core Architecture Purpose',
    category: 'projects',
    value: 'Context-aware intelligence federation with deterministic auditability and zero telemetry leakage',
    sourceRef: 'Technical Architecture Specification v2.4 (Document, Oct 8)',
    sourceId: 'src-doc-architecture-spec',
    createdAt: '2026-10-08 17:05',
    updatedAt: '2026-10-08 17:05',
    verificationStatus: 'verified',
    relatedEntities: ['Project Polaris']
  },
  {
    id: 'mem-human-in-the-loop',
    title: 'Autonomous Execution Guardrail',
    category: 'decisions',
    value: 'All external client action proposals require explicit user approval prior to execution',
    sourceRef: 'Steering Committee Sync Notes (Meeting, Oct 9)',
    sourceId: 'src-meeting-steering-notes',
    createdAt: '2026-10-09 10:52',
    updatedAt: '2026-10-09 10:52',
    verificationStatus: 'verified',
    relatedEntities: ['Project Polaris', 'Workspace User']
  }
];

export const initialFindings: IntelligenceFinding[] = [
  {
    id: 'find-deadline-conflict',
    title: 'Outdated Submission Deadline for Project Polaris',
    explanation: 'A newer email from Sarah Lin on October 11 (Source C) advances the submission cutoff to Sunday, October 18 at 11:59 PM. The workspace memory and prep schedule currently record the superseded deadline of October 20 at 5:00 PM (Source A).',
    severity: 'critical',
    category: 'conflict',
    confidence: 0.98,
    supportingEvidence: [
      'Source C (Oct 11, 08:15 AM): "The NEW binding submission cutoff is Sunday, October 18, 2026 at 11:59 PM EST. This supersedes our previous October 20 date."',
      'Source A (Oct 05, 09:30 AM): "final client RFP submission deadline is firmly set for Tuesday, October 20, 2026 at 5:00 PM EST."'
    ],
    sourceIds: ['src-email-polaris-kickoff', 'src-email-deadline-advancement'],
    relatedEntities: {
      people: ['Sarah Lin'],
      projects: ['Project Polaris'],
      tasks: ['Client RFP Submission']
    },
    whyItMatters: 'If the deadline remains recorded as October 20, team deliverables will miss the portal cutoff on Sunday night (Oct 18), risking complete RFP disqualification.',
    recommendedActionId: 'act-update-polaris-deadline',
    status: 'open',
    detectedAt: '2026-10-11 08:30'
  },
  {
    id: 'find-prep-inversion',
    title: 'Preparation Calendar Session Scheduled After Actual Deadline',
    explanation: 'The team calendar event "Polaris Final Submission Prep" (Source B) is scheduled for Monday, October 19 at 2:00 PM. Following the deadline advance to Sunday, October 18 (Source C), this verification session now falls 14 hours after the portal closes.',
    severity: 'warning',
    category: 'dependency',
    confidence: 0.94,
    supportingEvidence: [
      'Source B: Calendar invite scheduled for Monday, October 19, 2026 (2:00 PM - 4:00 PM)',
      'Source C: Submission deadline advanced to Sunday, October 18, 2026 (11:59 PM)'
    ],
    sourceIds: ['src-cal-prep-session', 'src-email-deadline-advancement'],
    relatedEntities: {
      people: ['Sarah Lin', 'David Chen', 'Elena Rostova'],
      projects: ['Project Polaris']
    },
    whyItMatters: 'A final dry-run conducted after the portal has already locked cannot catch omissions or resolve blockers.',
    recommendedActionId: 'act-flag-prep-session',
    status: 'open',
    detectedAt: '2026-10-11 08:35'
  },
  {
    id: 'find-residency-signoff',
    title: 'Unresolved Technical Sign-off for Data Residency',
    explanation: 'David Chen is designated as sole signatory for Cloud Data Residency in Architecture Spec v2.4, but no formal affirmation artifact has been filed.',
    severity: 'advisory',
    category: 'followup',
    confidence: 0.88,
    supportingEvidence: [
      'Source D: Section 3 specifies David Chen as sole signatory prior to client portal submission.'
    ],
    sourceIds: ['src-doc-architecture-spec'],
    relatedEntities: {
      people: ['David Chen'],
      projects: ['Project Polaris']
    },
    whyItMatters: 'Client submission package requires signed technical compliance attestation.',
    recommendedActionId: 'act-request-residency-signoff',
    status: 'open',
    detectedAt: '2026-10-10 11:20'
  }
];

export const initialActions: ActionRecord[] = [
  {
    id: 'act-update-polaris-deadline',
    title: 'Update Project Polaris Submission Deadline to October 18, 2026',
    explanation: 'Update the workspace memory record for Project Polaris client submission deadline from October 20, 2026 (5:00 PM) to October 18, 2026 (11:59 PM) based on verified email Source C.',
    findingId: 'find-deadline-conflict',
    relatedEntityIds: ['mem-polaris-deadline', 'Project Polaris'],
    priority: 'urgent',
    status: 'pending_approval',
    createdAt: '2026-10-11 08:32',
    approvalStatus: 'unreviewed',
    proposedChange: {
      targetType: 'memory',
      targetId: 'mem-polaris-deadline',
      field: 'value',
      fromValue: 'October 20, 2026, 5:00 PM',
      toValue: 'October 18, 2026, 11:59 PM'
    }
  },
  {
    id: 'act-flag-prep-session',
    title: 'Flag Prep Session for Schedule Adjustment',
    explanation: 'Tag the October 19 preparation calendar session with a schedule conflict flag, noting that it should be held on or before October 17.',
    findingId: 'find-prep-inversion',
    relatedEntityIds: ['src-cal-prep-session', 'Project Polaris'],
    priority: 'high',
    status: 'suggested',
    createdAt: '2026-10-11 08:36',
    approvalStatus: 'unreviewed'
  },
  {
    id: 'act-request-residency-signoff',
    title: 'Generate Data Residency Affirmation Checklist for David Chen',
    explanation: 'Assemble data residency compliance checklist for David Chen to review during the next morning triage.',
    findingId: 'find-residency-signoff',
    relatedEntityIds: ['David Chen', 'src-doc-architecture-spec'],
    priority: 'medium',
    status: 'suggested',
    createdAt: '2026-10-10 11:25',
    approvalStatus: 'unreviewed'
  }
];

export const initialRisks: TrustRiskRecord[] = [
  {
    id: 'risk-deadline-conflict',
    category: 'Deadline Discrepancy',
    severity: 'critical',
    explanation: 'Conflicting dates detected between Source A (Oct 05) and Source C (Oct 11). Newer email explicitly states a 48-hour earlier cutoff.',
    supportingSourceIds: ['src-email-polaris-kickoff', 'src-email-deadline-advancement'],
    conflictingValues: {
      labelA: 'Source A (Original Kickoff Email)',
      valueA: 'October 20, 2026 · 5:00 PM EST',
      sourceAId: 'src-email-polaris-kickoff',
      labelB: 'Source C (Authoritative Update Email)',
      valueB: 'October 18, 2026 · 11:59 PM EST',
      sourceBId: 'src-email-deadline-advancement'
    },
    lastUpdated: '2026-10-11 08:15',
    confidence: 0.98,
    suggestedResolution: 'Accept Source C as the authoritative update. Apply pending action to synchronize workspace memory.',
    status: 'unreviewed'
  },
  {
    id: 'risk-prep-inversion',
    category: 'Schedule Ordering Inversion',
    severity: 'high',
    explanation: 'Milestone preparation calendar event is currently scheduled to take place after the submission deadline.',
    supportingSourceIds: ['src-cal-prep-session', 'src-email-deadline-advancement'],
    conflictingValues: {
      labelA: 'Preparation Run (Calendar)',
      valueA: 'October 19, 2026 · 2:00 PM',
      sourceAId: 'src-cal-prep-session',
      labelB: 'Submission Cutoff (Updated Email)',
      valueB: 'October 18, 2026 · 11:59 PM',
      sourceBId: 'src-email-deadline-advancement'
    },
    lastUpdated: '2026-10-11 08:35',
    confidence: 0.94,
    suggestedResolution: 'Reschedule preparation session to Friday, October 16 or Saturday, October 17.',
    status: 'unreviewed'
  },
  {
    id: 'risk-unverified-memory',
    category: 'Unverified Memory Record',
    severity: 'medium',
    explanation: 'Memory record "Project Polaris Client Submission Deadline" holds an unverified status due to conflicting incoming records.',
    supportingSourceIds: ['src-email-polaris-kickoff', 'src-email-deadline-advancement'],
    lastUpdated: '2026-10-11 08:30',
    confidence: 0.91,
    suggestedResolution: 'Review and confirm updated memory value via Action Board approval.',
    status: 'unreviewed'
  }
];

export const initialTimeline: TimelineEvent[] = [
  {
    id: 'ev-01',
    timestamp: '2026-10-05 09:30',
    eventType: 'source_added',
    description: 'Indexed Source A: Project Polaris Final RFP Timeline & Guidelines (Email)',
    relatedRecordId: 'src-email-polaris-kickoff',
    recordType: 'source',
    actor: 'System Ingestion'
  },
  {
    id: 'ev-02',
    timestamp: '2026-10-05 09:35',
    eventType: 'memory_created',
    description: 'Extracted memory: Project Polaris Client Submission Deadline (October 20, 2026)',
    relatedRecordId: 'mem-polaris-deadline',
    recordType: 'memory',
    newState: 'October 20, 2026, 5:00 PM',
    actor: 'Context Engine'
  },
  {
    id: 'ev-03',
    timestamp: '2026-10-08 16:45',
    eventType: 'source_added',
    description: 'Indexed Technical Architecture Specification v2.4 (Document)',
    relatedRecordId: 'src-doc-architecture-spec',
    recordType: 'source',
    actor: 'System Ingestion'
  },
  {
    id: 'ev-04',
    timestamp: '2026-10-09 10:45',
    eventType: 'source_added',
    description: 'Indexed Steering Committee Sync Notes (Meeting)',
    relatedRecordId: 'src-meeting-steering-notes',
    recordType: 'source',
    actor: 'System Ingestion'
  },
  {
    id: 'ev-05',
    timestamp: '2026-10-11 08:15',
    eventType: 'source_added',
    description: 'Indexed Source C: URGENT UPDATE: Polaris Client RFP Submission Cutoff Advanced (Email)',
    relatedRecordId: 'src-email-deadline-advancement',
    recordType: 'source',
    actor: 'System Ingestion'
  },
  {
    id: 'ev-06',
    timestamp: '2026-10-11 08:30',
    eventType: 'finding_detected',
    description: 'Detected Critical Conflict: Outdated Submission Deadline for Project Polaris (Source C vs Source A)',
    relatedRecordId: 'find-deadline-conflict',
    recordType: 'finding',
    actor: 'Intelligence Engine'
  },
  {
    id: 'ev-07',
    timestamp: '2026-10-11 08:32',
    eventType: 'action_suggested',
    description: 'Recommended Action: Update Project Polaris Submission Deadline to October 18, 2026',
    relatedRecordId: 'act-update-polaris-deadline',
    recordType: 'action',
    actor: 'Intelligence Engine'
  }
];

export const initialIntegrations: IntegrationService[] = [
  {
    id: 'int-email-demo',
    name: 'Corporate Email Gateway',
    category: 'email',
    status: 'demo_only',
    permissions: ['Read inbox metadata', 'Read project email threads', 'Extract attachments'],
    lastSync: '2026-10-11 08:15 (Simulated)',
    capabilities: ['Inbound thread extraction', 'Sender entity linking', 'Deadline date detection'],
    description: 'Demo source containing simulated executive emails and client correspondence.',
    iconName: 'Mail'
  },
  {
    id: 'int-calendar-demo',
    name: 'Executive Calendar Service',
    category: 'calendar',
    status: 'demo_only',
    permissions: ['Read primary calendar', 'Read meeting attendees and agendas'],
    lastSync: '2026-10-11 08:00 (Simulated)',
    capabilities: ['Schedule timeline extraction', 'Prep session dependency mapping', 'Conflict detection'],
    description: 'Demo calendar feed providing team reviews and milestone meetings.',
    iconName: 'Calendar'
  },
  {
    id: 'int-drive-demo',
    name: 'Document & Knowledge Wiki',
    category: 'documents',
    status: 'demo_only',
    permissions: ['Read workspace specifications', 'Version comparison'],
    lastSync: '2026-10-10 18:30 (Simulated)',
    capabilities: ['Technical spec indexing', 'Ownership and RACI extraction', 'Compliance check'],
    description: 'Demo document repository containing technical architecture specifications.',
    iconName: 'FileText'
  },
  {
    id: 'int-slack',
    name: 'Team Collaboration Channels',
    category: 'collaboration',
    status: 'unavailable',
    permissions: ['Read public channels'],
    capabilities: ['Async channel triage'],
    description: 'Real integration unavailable in current environment. Requires OAuth credential provisioning.',
    iconName: 'MessageSquare'
  }
];

export const initialSettings: WorkspaceSettings = {
  userName: 'Lead Director',
  userRole: 'Enterprise Program Lead',
  workspaceName: 'Demo Workspace: Project Polaris',
  confidenceThreshold: 0.85,
  autoDetectRisks: true,
  notifyOnConflict: true,
  auditRetentionDays: 90,
  demoModeActive: true,
  theme: 'midnight'
};
