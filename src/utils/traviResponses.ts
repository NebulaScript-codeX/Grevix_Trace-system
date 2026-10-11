import {
  ActionRecord,
  IntelligenceFinding,
  MemoryRecord,
  SourceRecord,
  TraviMessage,
  TrustRiskRecord
} from '../types';

export interface TraviWorkspaceData {
  sources: SourceRecord[];
  memories: MemoryRecord[];
  findings: IntelligenceFinding[];
  actions: ActionRecord[];
  risks: TrustRiskRecord[];
}

export interface TraviResponse {
  text: string;
  sourceCitations: NonNullable<TraviMessage['sourceCitations']>;
  suggestedActionId?: string;
}

const stopWords = new Set([
  'a', 'about', 'after', 'all', 'an', 'and', 'any', 'are', 'as', 'at', 'be',
  'been', 'before', 'can', 'could', 'did', 'do', 'does', 'for', 'from', 'get',
  'give', 'has', 'have', 'how', 'i', 'in', 'is', 'it', 'its', 'me', 'my', 'of',
  'on', 'or', 'our', 'please', 'project', 'should', 'show', 'tell', 'that', 'the', 'their',
  'there', 'these', 'this', 'those', 'to', 'was', 'we', 'what', 'when', 'where',
  'exist', 'exists', 'existing',
  'which', 'who', 'why', 'will', 'with', 'would', 'you', 'your'
]);

const normalize = (value: string): string =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

const terms = (value: string): string[] =>
  normalize(value)
    .split(/\s+/)
    .filter(term => term.length > 1 && !stopWords.has(term))
    .map(term => term.endsWith('ies') && term.length > 4
      ? `${term.slice(0, -3)}y`
      : term.endsWith('s') && term.length > 4
        ? term.slice(0, -1)
        : term);

const containsAny = (value: string, patterns: RegExp[]): boolean =>
  patterns.some(pattern => pattern.test(value));

const citationsFor = (
  records: Array<{ id: string; title: string; type: string }>,
  limit = 4
) => records.slice(0, limit).map(record => ({
  label: record.title,
  id: record.id,
  type: record.type
}));

const recordMatches = (query: string, title: string, body: string): boolean => {
  const queryTerms = terms(query);
  if (queryTerms.length === 0) return false;
  const titleTerms = new Set(terms(title));
  const bodyTerms = new Set(terms(body));
  const matches = queryTerms.filter(term => titleTerms.has(term) || bodyTerms.has(term));
  return matches.length >= Math.min(2, queryTerms.length);
};

const statusLabel = (action: ActionRecord): string => {
  switch (action.status) {
    case 'pending_approval':
      return 'waiting for your approval';
    case 'suggested':
      return 'suggested; not approved yet';
    case 'approved':
      return 'approved';
    case 'in_progress':
      return 'underway';
    case 'completed':
      return 'completed';
    case 'failed':
      return 'failed';
    case 'rejected':
      return 'rejected';
    case 'cancelled':
      return 'cancelled';
  }
};

const priorityRank: Record<ActionRecord['priority'], number> = {
  urgent: 0,
  high: 1,
  medium: 2,
  low: 3
};

const isOpenAction = (action: ActionRecord): boolean =>
  action.status === 'pending_approval' || action.status === 'suggested' || action.status === 'in_progress';

const actionStateSentence = (action: ActionRecord): string =>
  `“${action.title}” is ${statusLabel(action)} (${action.priority} priority).`;

const response = (
  text: string,
  records: Array<{ id: string; title: string; type: string }> = [],
  suggestedActionId?: string
): TraviResponse => ({
  text,
  sourceCitations: citationsFor(records),
  suggestedActionId
});

const projectScope = (
  query: string,
  memories: MemoryRecord[],
  sources: SourceRecord[],
  previousUsers: string[]
): string[] => {
  const knownProjects = new Set([
    ...memories.flatMap(memory => memory.relatedEntities),
    ...sources.flatMap(source => source.entities.projects)
  ].filter(entity => /^project\b/i.test(entity)));
  const combinedText = normalize([query, ...previousUsers].join(' '));
  return [...knownProjects].filter(project => combinedText.includes(normalize(project)));
};

const relevantRecords = <T extends { title: string }>(
  query: string,
  records: T[],
  body: (record: T) => string
): T[] => {
  const queryTerms = terms(query);
  if (queryTerms.length === 0) return [];
  return records
    .map(record => {
      const titleTerms = new Set(terms(record.title));
      const bodyTerms = new Set(terms(body(record)));
      const titleMatches = queryTerms.filter(term => titleTerms.has(term)).length;
      const bodyMatches = queryTerms.filter(term => bodyTerms.has(term)).length;
      return {
        record,
        score: titleMatches * 4 + bodyMatches,
        relevant: titleMatches > 0 || bodyMatches >= Math.min(2, queryTerms.length)
      };
    })
    .filter(result => result.relevant)
    .sort((a, b) => b.score - a.score)
    .map(result => result.record);
};

export const buildTraviResponse = (
  rawQuestion: string,
  history: TraviMessage[],
  data: TraviWorkspaceData
): TraviResponse => {
  const question = rawQuestion.trim();
  const normalizedQuestion = normalize(question);
  const previousUsers = history
    .filter(message => message.sender === 'user')
    .slice(-4)
    .map(message => message.text);
  const isFollowUp = /^(and|also|what about|how about|when is|where is|who is|why is|what was|what does that|can you explain that|tell me more|its|their|those|it\b)/i.test(question)
    || terms(question).length <= 2;
  const retrievalQuestion = isFollowUp && previousUsers.length > 0
    ? `${previousUsers[previousUsers.length - 1]} ${question}`
    : question;
  const lowered = question.toLowerCase();
  const citations: Array<{ id: string; title: string; type: string }> = [];

  if (/^(hi|hello|hey|good morning|good afternoon|good evening)\b/.test(normalizedQuestion)) {
    return response('Hello! I can look up and explain the sources, saved details, concerns, and actions in this TRACE workspace. I use simple local rules, not an AI model.');
  }

  if (containsAny(lowered, [/\bwhat is trace\b/, /\babout trace\b/, /\bwhat can you do\b/, /\bhow does trace work\b/])) {
    return response('TRACE keeps your sources, saved project details, concerns, and suggested actions together so you can see how they relate. I can search these local records and summarize them. I do not use an AI model or change records for you.', [
      ...data.memories.filter(memory => /projects|facts/.test(memory.category)).slice(0, 1).map(memory => ({
        id: memory.id, title: memory.title, type: 'memory'
      }))
    ]);
  }

  const isTaskQuery = containsAny(lowered, [
    /\btask(s)?\b/, /\baction(s)?\b/, /\bto do(s)?\b/, /\bfollow ups?\b/,
    /\bwhat should i\b/, /\bnext step(s)?\b/, /\bpriorit(y|ies)\b/, /\bdependenc(y|ies)\b/,
    /\bturn .+ into\b/
  ]);
  const isStatusQuestion = containsAny(lowered, [
    /\bexist(s|ing)?\b/, /\bstatus\b/, /\bcomplete(d)?\b/, /\bincomplete\b/,
    /\bfinished\b/, /\bapproved\b/, /\bpending\b/, /\bopen\b/
  ]);
  const asksPriority = containsAny(lowered, [/\bwhat should i\b/, /\bnext step(s)?\b/, /\bpriorit(y|ies)\b/]);
  const asksForTaskList = containsAny(lowered, [/\bwhat tasks?\b/, /\blist\b/, /\bshow\b/, /\bwhich actions?\b/]);
  const asksToCreateTasks = containsAny(lowered, [/\bturn\b/, /\bconvert\b/, /\bmake\b/, /\bcreate\b/, /\bextract\b/]) && isTaskQuery;

  const projectNames = projectScope(retrievalQuestion, data.memories, data.sources, previousUsers);
  const explicitProject = question.match(/\bproject\s+([a-z0-9][a-z0-9-]*)/i)?.[1];
  const knownProjectMention = explicitProject && [...data.memories.flatMap(memory => memory.relatedEntities),
    ...data.sources.flatMap(source => source.entities.projects)]
    .some(project => normalize(project) === normalize(`Project ${explicitProject}`));
  const projectFilter = (entities: string[]): boolean =>
    (!explicitProject || Boolean(knownProjectMention))
    && (projectNames.length === 0 || projectNames.some(project =>
      entities.some(entity => normalize(entity) === normalize(project))));

  if (isTaskQuery) {
    const actionQueryTokens = terms(question).filter(term => ![
      'task', 'action', 'todo', 'follow', 'up', 'next', 'step', 'status', 'exist',
      'prior', 'turn', 'convert', 'make', 'creat', 'extract', 'into', 'review',
      'incomplet', 'pending', 'open', 'approv', 'finish', 'complet', 'done', 'list', 'show'
    ].includes(term));
    const specificallyNamed = actionQueryTokens.length > 0;
    const actionRecords = data.actions.filter(action => {
      const actionTerms = new Set(terms(`${action.title} ${action.explanation} ${action.relatedEntityIds.join(' ')}`));
      const namedMatches = actionQueryTokens.filter(term => actionTerms.has(term));
      const sufficientlyMatched = namedMatches.length >= Math.min(2, actionQueryTokens.length);
      return projectFilter(action.relatedEntityIds) && sufficientlyMatched;
    });
    const asksPending = containsAny(lowered, [/\bpending\b/, /\bopen\b/, /\bincomplete\b/]);
    const matchedActions = actionRecords.length > 0
      ? actionRecords
      : asksPriority || asksForTaskList || asksToCreateTasks || !specificallyNamed
        ? data.actions.filter(action => projectFilter(action.relatedEntityIds))
        : [];

    if (specificallyNamed && matchedActions.length === 0) {
      if (asksToCreateTasks) {
        const relatedSources = relevantRecords(retrievalQuestion, data.sources, source =>
          `${source.summary} ${source.content} ${source.extractedDetails.join(' ')}`).slice(0, 2);
        return response(
          relatedSources.length
            ? `I found related information, but there is no action for “${question}” in the workspace. I have not created any tasks. Check the linked records and decide whether to add one.`
            : `I couldn't find information or an existing action for “${question}”, so I can't make a reliable task from it. I have not added anything.`,
          relatedSources.map(source => ({ id: source.id, title: source.title, type: source.type }))
        );
      }
      const relatedSources = relevantRecords(retrievalQuestion, data.sources, source =>
        `${source.summary} ${source.content} ${source.extractedDetails.join(' ')}`).slice(0, 2);
      return response(
        `I couldn't find an action matching “${question}” in this workspace. It may still be mentioned in a source record.${relatedSources.length ? ` Related record${relatedSources.length === 1 ? '' : 's'}: ${relatedSources.map(source => `“${source.title}”`).join(', ')}.` : ''}`,
        relatedSources.map(source => ({ id: source.id, title: source.title, type: source.type }))
      );
    }

    if (matchedActions.length === 0) {
      return response('Which project or task should I check?');
    }

    const displayedActions = asksPending
      ? matchedActions.filter(isOpenAction)
      : matchedActions;
    if (displayedActions.length === 0) {
      return response('There are no pending actions recorded for this project.', matchedActions.slice(0, 4).map(action => ({
        id: action.id, title: action.title, type: 'action'
      })));
    }
    const sortedActions = [...displayedActions].sort((a, b) => priorityRank[a.priority] - priorityRank[b.priority]);
    const openActions = sortedActions.filter(isOpenAction);
    const actionLines = sortedActions.slice(0, 6).map(action => `• ${actionStateSentence(action)}`);
    const taskCitations = sortedActions.slice(0, 4).map(action => ({
      id: action.id, title: action.title, type: 'action'
    }));
    const linkedFindings = data.findings.filter(finding =>
      sortedActions.some(action => action.findingId === finding.id));

    let taskAnswer: string;
    if (asksToCreateTasks) {
      taskAnswer = openActions.length
        ? `I found these existing actions that could be used as a checklist. I have not created or changed any tasks:\n${openActions.slice(0, 5).map(action => `• ${action.title} — ${statusLabel(action)}; ${action.priority} priority.`).join('\n')}`
        : 'I found no open actions to turn into a checklist. I have not created any tasks.';
    } else if (asksPriority) {
      taskAnswer = openActions.length
        ? `Start with the highest-priority open action already in the workspace:\n${openActions.slice(0, 3).map((action, index) => `${index + 1}. ${action.title} — ${statusLabel(action)}.`).join('\n')}\nThese are existing actions, not new tasks.`
        : 'There are no open actions recorded for this project. I can’t infer a new task from the available records.';
    } else {
      taskAnswer = `Here ${sortedActions.length === 1 ? 'is the matching action' : 'are the matching actions'} in the workspace:\n${actionLines.join('\n')}`;
    }

    const evidenceNote = linkedFindings.find(finding =>
      finding.category === 'conflict' || finding.category === 'dependency');
    if (evidenceNote && containsAny(lowered, [/\bdependenc(y|ies)\b/, /\bconflict\b/, /\bdeadline\b/, /\bschedule\b/])) {
      taskAnswer += `\n\nRelated insight (${evidenceNote.status}): ${evidenceNote.explanation}`;
      taskCitations.push(...evidenceNote.sourceIds.flatMap(id => {
        const source = data.sources.find(item => item.id === id);
        return source ? [{ id: source.id, title: source.title, type: source.type }] : [];
      }));
    }

    return response(taskAnswer, taskCitations, openActions[0]?.id);
  }

  const asksDeadline = containsAny(lowered, [/\bdeadline\b/, /\bdue date\b/, /\bcutoff\b/, /\bsubmission\b/, /\bwhen is\b/, /\bby when\b/, /\bdate\b/]);
  const asksConflicts = containsAny(lowered, [/\bconflict(s)?\b/, /\bdisagree\b/, /\bcontradict(ion|s|ory)?\b/, /\bchanged\b/, /\bupdate\b/]);

  if (asksDeadline || asksConflicts) {
    if (explicitProject && !knownProjectMention) {
      return response(`There is no information about Project ${explicitProject} in this workspace, so I can't check its deadline or conflicts.`);
    }

    const scopedSources = data.sources.filter(source =>
      projectFilter(source.entities.projects)
      && (source.entities.deadlines?.length
        || source.type === 'calendar' && recordMatches(retrievalQuestion, source.title, source.summary)));
    const scopedMemories = data.memories.filter(memory =>
      projectFilter(memory.relatedEntities)
      && (memory.category === 'deadlines' || memory.category === 'commitments')
      && recordMatches(retrievalQuestion, memory.title, `${memory.value} ${memory.relatedEntities.join(' ')}`));
    const scopedFindings = data.findings.filter(finding =>
      projectFilter(finding.relatedEntities.projects)
      && (finding.category === 'conflict' || finding.category === 'dependency')
      && (recordMatches(retrievalQuestion, finding.title, `${finding.explanation} ${finding.relatedEntities.projects.join(' ')}`)
        || projectNames.length > 0));
    const matchingRisks = data.risks.filter(risk =>
      projectFilter(risk.supportingSourceIds.flatMap(id =>
        data.sources.find(source => source.id === id)?.entities.projects ?? []))
      && recordMatches(retrievalQuestion, risk.category, risk.explanation));

    if (scopedSources.length === 0 && scopedMemories.length === 0 && scopedFindings.length === 0 && matchingRisks.length === 0) {
      return response(`I couldn't confirm a matching deadline or conflict${projectNames.length ? ` for ${projectNames.join(', ')}` : ''}. Which project or deadline should I check?`);
    }

    const conflictFinding = scopedFindings.find(finding => finding.category === 'conflict');
    const dependencyFinding = scopedFindings.find(finding => finding.category === 'dependency');
    const memory = scopedMemories.find(item => item.category === 'deadlines');
    const updateSource = scopedSources.find(source =>
      /supersed|new binding|new deadline|advanced/i.test(`${source.title} ${source.summary} ${source.content}`));
    const sourcesByDate = [...scopedSources].sort((a, b) => b.date.localeCompare(a.date));
    const deadlineClaims = scopedSources
      .filter(source => (source.entities.deadlines?.length ?? 0) > 0
        && (source.type !== 'calendar' || /\b(deadline|cutoff|due date)\b/i.test(source.title)))
      .map(source => `• ${source.title} (${source.date}): ${source.entities.deadlines?.join('; ')}`)
      .slice(0, 4);
    const conflict = conflictFinding || (deadlineClaims.length > 1 && new Set(
      scopedSources.flatMap(source => source.entities.deadlines ?? [])
    ).size > 1);
    let answer = '';

    if (conflict) {
      answer = `The saved records disagree${projectNames.length ? ` about ${projectNames.join(', ')}` : ''}:\n${deadlineClaims.join('\n') || conflictFinding?.explanation || ''}`;
      if (memory) {
        answer += `\n\nThe saved project detail still says “${memory.value}” and is marked ${memory.verificationStatus === 'unverified' ? 'not confirmed' : memory.verificationStatus}.`;
      }
      if (updateSource) {
        answer += ` The newer source says it replaces the earlier date. It gives ${updateSource.entities.deadlines?.join('; ') || 'an updated deadline'}. This is the latest date in the sources, but the saved project detail has not been updated yet.`;
      }
      const relevantAction = data.actions.find(action =>
        action.proposedChange?.targetId === memory?.id
        || (conflictFinding && action.findingId === conflictFinding.id));
      if (relevantAction) {
        answer += ` The related action is ${statusLabel(relevantAction)}; ${relevantAction.status === 'completed' || relevantAction.status === 'approved' ? 'check the saved project detail to confirm the change.' : 'the change has not been applied.'}`;
        citations.push({ id: relevantAction.id, title: relevantAction.title, type: 'action' });
      }
      if (dependencyFinding) {
        answer += `\n\nSchedule impact: ${dependencyFinding.explanation}`;
      }
      if (conflictFinding) {
        citations.push(...conflictFinding.sourceIds.flatMap(id => {
          const source = data.sources.find(item => item.id === id);
          return source ? [{ id: source.id, title: source.title, type: source.type }] : [];
        }));
        citations.push({ id: conflictFinding.id, title: conflictFinding.title, type: 'risk' });
      }
    } else if (memory) {
      answer = `The saved project detail for ${memory.title} is “${memory.value}” (${memory.verificationStatus === 'unverified' ? 'not confirmed' : memory.verificationStatus}).`;
      if (sourcesByDate[0]) answer += ` The latest matching source is “${sourcesByDate[0].title}” dated ${sourcesByDate[0].date}.`;
    } else if (deadlineClaims.length) {
      answer = `The matching source${deadlineClaims.length === 1 ? ' says' : 's say'}:\n${deadlineClaims.join('\n')}`;
    } else {
      answer = matchingRisks.map(risk => `${risk.category}: ${risk.explanation} (status: ${risk.status}).`).join('\n');
    }

    citations.push(...scopedSources.slice(0, 3).map(source => ({
      id: source.id, title: source.title, type: source.type
    })));
    citations.push(...scopedMemories.slice(0, 1).map(item => ({
      id: item.id, title: item.title, type: 'memory'
    })));
    const proposedUpdate = data.actions.find(action =>
      action.proposedChange?.targetId === memory?.id && isOpenAction(action));
    return response(answer, citations, proposedUpdate?.id);
  }

  if (isFollowUp && previousUsers.length > 0 && terms(question).length === 0) {
    return response('I’m not sure what “that” refers to here. Which record, task, or project should I check?');
  }

  const asksForRecords = containsAny(lowered, [
    /\brecord(s)?\b/, /\bsource(s)?\b/, /\bdocument(s)?\b/, /\bconnected\b/,
    /\bfind\b/, /\bsearch\b/, /\bwho is\b/, /\bwhat is\b/, /\bshow me\b/
  ]);
  if (/\bconnected\b/.test(lowered) && /\b(project|this|these)\b/.test(lowered)) {
    const knownProjects = [...new Set([
      ...data.sources.flatMap(source => source.entities.projects),
      ...data.memories.flatMap(memory => memory.relatedEntities.filter(entity => /^project\b/i.test(entity)))
    ])];
    const selectedProjects = projectNames.length > 0 ? projectNames : knownProjects;
    if (selectedProjects.length !== 1) {
      return response(`I found ${knownProjects.length} projects here. Which project's related records would you like to see?`);
    }
    const selectedProject = selectedProjects[0];
    const linkedSources = data.sources.filter(source => source.entities.projects.includes(selectedProject));
    const linkedMemories = data.memories.filter(memory => memory.relatedEntities.includes(selectedProject));
    const linkedFindings = data.findings.filter(finding => finding.relatedEntities.projects.includes(selectedProject));
    const linkedActions = data.actions.filter(action => action.relatedEntityIds.includes(selectedProject));
    const connectedRecords = [
      ...linkedSources.map(source => ({ id: source.id, title: source.title, type: source.type, kind: 'Source' })),
      ...linkedMemories.map(memory => ({ id: memory.id, title: memory.title, type: 'memory', kind: 'Memory' })),
      ...linkedFindings.map(finding => ({ id: finding.id, title: finding.title, type: 'risk', kind: 'Finding' })),
      ...linkedActions.map(action => ({ id: action.id, title: action.title, type: 'action', kind: 'Action' }))
    ];
    if (connectedRecords.length === 0) {
      return response(`I couldn't find records explicitly linked to ${selectedProject}.`);
    }
    return response(
      `Records linked to ${selectedProject} (${connectedRecords.length}):\n${connectedRecords.slice(0, 12).map(record => `• ${record.kind}: ${record.title}`).join('\n')}`,
      connectedRecords
    );
  }

  const matchedSources = relevantRecords(retrievalQuestion, data.sources, source =>
    `${source.summary} ${source.content} ${source.extractedDetails.join(' ')} ${source.entities.people.join(' ')} ${source.entities.projects.join(' ')}`);
  const matchedMemories = relevantRecords(retrievalQuestion, data.memories, memory =>
    `${memory.value} ${memory.category} ${memory.relatedEntities.join(' ')}`);
  const matchedFindings = relevantRecords(retrievalQuestion, data.findings, finding =>
    `${finding.explanation} ${finding.whyItMatters} ${finding.relatedEntities.projects.join(' ')} ${finding.relatedEntities.people.join(' ')}`);
  const matchedActions = relevantRecords(retrievalQuestion, data.actions, action =>
    `${action.explanation} ${action.priority} ${action.status} ${action.relatedEntityIds.join(' ')}`);
  const recordResults = [
    ...matchedSources.slice(0, 3).map(source => ({
      id: source.id, title: source.title, type: source.type,
      line: `• Source: “${source.title}” (${source.date}). ${source.summary}`
    })),
    ...matchedMemories.slice(0, 2).map(memory => ({
      id: memory.id, title: memory.title, type: 'memory',
      line: `• Saved detail: ${memory.title} — ${memory.value} (${memory.verificationStatus === 'unverified' ? 'not confirmed' : memory.verificationStatus}).`
    })),
    ...matchedFindings.slice(0, 2).map(finding => ({
      id: finding.id, title: finding.title, type: 'risk',
      line: `• Insight (${finding.status}): ${finding.title} — ${finding.explanation}`
    })),
    ...matchedActions.slice(0, 2).map(action => ({
      id: action.id, title: action.title, type: 'action',
      line: `• Action (${statusLabel(action)}): ${action.title}.`
    }))
  ];

  if (recordResults.length > 0) {
    return response(
      `${asksForRecords ? 'Here is what I found' : 'Here is what the saved information says'}:\n${recordResults.map(record => record.line).join('\n')}`,
      recordResults
    );
  }

  if (!asksForRecords && !asksDeadline && !asksConflicts && !isTaskQuery) {
    return response('I can answer questions about information saved in this TRACE workspace. What project, person, source, or action should I look up?');
  }

  return response(`I couldn't find “${question}” in this workspace. I can only answer using information saved here, such as sources, project details, insights, concerns, and actions.`);
};
