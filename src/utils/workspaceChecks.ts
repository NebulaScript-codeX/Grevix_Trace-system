import type {
  MemoryRecord,
  SourceRecord,
  TrustRiskRecord
} from '../types';

export type WorkspaceCheckKind =
  | 'incomplete'
  | 'invalid'
  | 'conflict'
  | 'suspicious'
  | 'unverified';

export interface WorkspaceCheck {
  id: string;
  kind: WorkspaceCheckKind;
  title: string;
  recordType: 'source' | 'memory';
  recordId: string;
  recordTitle: string;
  explanation: string;
  evidence: string[];
  sourceIds: string[];
  nextStep: string;
}

export interface RecordCheckStatus {
  label: string;
  explanation: string;
  kind: WorkspaceCheckKind | 'evidence';
}

const isText = (value: unknown): value is string => typeof value === 'string';
const trimmed = (value: unknown): string => isText(value) ? value.trim() : '';

const valuesOf = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter(isText).map(item => item.trim()).filter(Boolean) : [];

const normalize = (value: string): string => value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

const checkId = (kind: WorkspaceCheckKind, id: string): string => `${kind}-${id}`;

const sourceCheck = (
  source: SourceRecord,
  kind: WorkspaceCheckKind,
  title: string,
  explanation: string,
  evidence: string[],
  nextStep: string,
  relatedSourceIds: string[] = []
): WorkspaceCheck => ({
  id: checkId(kind, source.id),
  kind,
  title,
  recordType: 'source',
  recordId: source.id,
  recordTitle: trimmed(source.title) || 'Untitled source',
  explanation,
  evidence,
  sourceIds: [...new Set([source.id, ...relatedSourceIds])],
  nextStep
});

const memoryCheck = (
  memory: MemoryRecord,
  kind: WorkspaceCheckKind,
  title: string,
  explanation: string,
  evidence: string[],
  nextStep: string,
  relatedSourceIds: string[] = []
): WorkspaceCheck => ({
  id: checkId(kind, memory.id),
  kind,
  title,
  recordType: 'memory',
  recordId: memory.id,
  recordTitle: trimmed(memory.title) || 'Untitled saved detail',
  explanation,
  evidence,
  sourceIds: [...new Set(relatedSourceIds)],
  nextStep
});

const isValidDate = (value: string): boolean => {
  if (!value) return false;
  const isoDate = value.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T\s].*)?$/);
  if (isoDate) {
    const [, year, month, day] = isoDate;
    const parsed = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
    if (parsed.getUTCFullYear() !== Number(year)
      || parsed.getUTCMonth() !== Number(month) - 1
      || parsed.getUTCDate() !== Number(day)) return false;
  }
  const date = new Date(value);
  return Number.isFinite(date.getTime());
};

const extractDates = (value: string): string[] => {
  const matches = value.match(
    /\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{1,2}(?:,?\s+\d{4})?|\b\d{4}-\d{2}-\d{2}\b|\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b/gi
  ) ?? [];
  return [...new Set(matches.map(date => normalize(date)))];
};

const checkSuspiciousContent = (source: SourceRecord): WorkspaceCheck | undefined => {
  const content = `${trimmed(source.title)}\n${trimmed(source.summary)}\n${trimmed(source.content)}`;
  const indicators: string[] = [];
  const urls = content.match(/https?:\/\/[^\s<>"')\]]+/gi) ?? [];
  const shortener = /^(?:https?:\/\/)?(?:bit\.ly|tinyurl\.com|t\.co|goo\.gl|ow\.ly|is\.gd|buff\.ly)\//i;
  const rawIp = /^https?:\/\/(?:\d{1,3}\.){3}\d{1,3}(?::\d+)?(?:\/|$)/i;
  for (const url of urls) {
    if (shortener.test(url)) indicators.push(`Uses a shortened link: ${url}`);
    else if (rawIp.test(url)) indicators.push(`Link points directly to an IP address: ${url}`);
  }

  const paymentRequest = content.match(/\b(?:wire transfer|gift cards?|cryptocurrency|bitcoin|payment|bank account)\b/i)?.[0];
  const urgencyLanguage = content.match(/\b(?:urgent|immediately|today|right now|confidential|secret|bypass|do not tell)\b/i)?.[0];
  if (paymentRequest && urgencyLanguage) {
    indicators.push(`Mentions “${paymentRequest}” together with urgency or secrecy language (“${urgencyLanguage}”).`);
  }

  if (source.type === 'email') {
    const sender = content.match(/^\s*From:\s*([^<\r\n]+)(?:<([^>\r\n]+)>)?/im);
    const declaredAuthor = trimmed(source.author);
    const senderName = trimmed(sender?.[1]);
    if (declaredAuthor && senderName
      && normalize(declaredAuthor) !== normalize(senderName)
      && !normalize(senderName).includes(normalize(declaredAuthor))
      && !normalize(declaredAuthor).includes(normalize(senderName))) {
      indicators.push(`The record lists “${declaredAuthor}” as author, but its From line names “${senderName}”.`);
    }
  }

  if (indicators.length === 0) return undefined;
  return sourceCheck(
    source,
    'suspicious',
    'Potentially suspicious — review before trusting',
    'This is a warning based on visible patterns only. It does not prove the content is spam or malicious.',
    indicators,
    'Check the sender using a known contact method and open links only after confirming they are expected.'
  );
};

export const analyzeWorkspace = (
  sources: SourceRecord[],
  memories: MemoryRecord[]
): WorkspaceCheck[] => {
  const checks: WorkspaceCheck[] = [];
  const safeSources = Array.isArray(sources) ? sources.filter(source => source && typeof source === 'object') : [];
  const safeMemories = Array.isArray(memories) ? memories.filter(memory => memory && typeof memory === 'object') : [];

  for (const source of safeSources) {
    if (source.type && !['email', 'document', 'meeting', 'calendar', 'note', 'update'].includes(source.type)) {
      checks.push(sourceCheck(
        source,
        'invalid',
        'Source type is not recognized',
        'The stored source type does not match a type TRACE supports.',
        [`Stored source type: “${String(source.type)}”`],
        'Choose a supported source type when correcting this record.'
      ));
    }

    const missing = [
      ['Title', source.title],
      ['Content', source.content],
      ['Source type', source.type],
      ['Date', source.date],
      ['Source / sender', source.sourceLabel]
    ].filter(([, value]) => !trimmed(value)).map(([label]) => label);
    if (missing.length > 0) {
      checks.push(sourceCheck(
        source,
        'incomplete',
        'Incomplete source record',
        `Required information is missing: ${missing.join(', ')}. Without it, TRACE may not be able to identify, date, or assess this source.`,
        [`Missing required fields: ${missing.join(', ')}`],
        'Edit the source and add the missing information. Optional summary, author, and extracted details are not required.'
      ));
    }

    const sourceDate = trimmed(source.date);
    if (sourceDate && !isValidDate(sourceDate)) {
      checks.push(sourceCheck(
        source,
        'invalid',
        'Date could not be read',
        'The source has a date value, but it is not in a date format this check can read. This is a format problem, not proof that the date itself is false.',
        [`Stored date: “${sourceDate}”`],
        'Check the original record and correct the date format.'
      ));
    }

    const suspicious = checkSuspiciousContent(source);
    if (suspicious) checks.push(suspicious);
  }

  for (const memory of safeMemories) {
    if (memory.category && !['people', 'projects', 'decisions', 'preferences', 'commitments', 'deadlines', 'facts'].includes(memory.category)) {
      checks.push(memoryCheck(
        memory,
        'invalid',
        'Saved detail category is not recognized',
        'The stored category does not match a category TRACE supports.',
        [`Stored category: “${String(memory.category)}”`],
        'Choose a supported category when correcting this record.'
      ));
    }

    const missing = [
      ['Detail name', memory.title],
      ['Saved value', memory.value],
      ['Category', memory.category],
      ['Source reference', memory.sourceRef]
    ].filter(([, value]) => !trimmed(value)).map(([label]) => label);
    if (missing.length > 0) {
      checks.push(memoryCheck(
        memory,
        'incomplete',
        'Incomplete saved detail',
        `Required information is missing: ${missing.join(', ')}. A source reference is needed to trace where this detail came from.`,
        [`Missing required fields: ${missing.join(', ')}`],
        'Edit the saved detail and add the missing information. A linked source ID is optional.'
      ));
    }

    const source = safeSources.find(item => item.id === memory.sourceId);
    if (memory.sourceId && !source) {
      checks.push(memoryCheck(
        memory,
        'unverified',
        'Source reference is unavailable',
        `This detail points to source “${memory.sourceId}”, which is not present in the workspace. Its value cannot be checked against that source.`,
        [`Missing linked source: ${memory.sourceId}`],
        'Add the source record or update the source reference.'
      ));
    }

    if (memory.category !== 'deadlines' || !trimmed(memory.value)) continue;
    const projectNames = valuesOf(memory.relatedEntities).filter(entity => /^project\b/i.test(entity));
    const memoryDates = extractDates(trimmed(memory.value));
    if (memoryDates.length === 0) continue;
    const candidates = safeSources.filter(candidate => {
      if (!projectNames.some(project => valuesOf(candidate.entities?.projects).includes(project))) return false;
      if (candidate.type === 'calendar'
        && !/\b(deadline|cutoff)\b/i.test(trimmed(candidate.title))) return false;
      const sourceClaimsDeadline = /\b(deadline|due date|cutoff|submission)\b/i
        .test(`${trimmed(candidate.title)} ${trimmed(candidate.summary)} ${trimmed(candidate.content)}`);
      return sourceClaimsDeadline && (Array.isArray(candidate.entities?.deadlines)
        ? candidate.entities.deadlines.length > 0
        : true);
    });
    const conflicts: string[] = [];
    const conflictingSourceIds: string[] = [];
    const linkedSource = safeSources.find(item => item.id === memory.sourceId);
    for (const candidate of candidates) {
      const sourceDates = extractDates(valuesOf(candidate.entities?.deadlines).join('\n'));
      const differs = sourceDates.some(date => !memoryDates.includes(date));
      if (!differs) continue;
      conflicts.push(`Different source: “${trimmed(candidate.title)}” — ${valuesOf(candidate.entities?.deadlines).join('; ') || sourceDates.join('; ')}`);
      conflictingSourceIds.push(candidate.id);
    }
    if (conflicts.length > 0) {
      checks.push(memoryCheck(
        memory,
        'conflict',
        'Deadline information disagrees',
        'A source for the same project gives a different date. The disagreement needs review; this check cannot decide which date is correct.',
        [
          `Saved detail: “${trimmed(memory.title)}” — ${trimmed(memory.value)}${linkedSource ? ` (source: ${trimmed(linkedSource.title)})` : ''}`,
          ...conflicts
        ],
        'Compare the original records and confirm which date is current before updating the saved detail.',
        [memory.sourceId, ...conflictingSourceIds].filter((id): id is string => Boolean(id))
      ));
    }
  }

  const deadlineMemories = safeMemories.filter(memory =>
    memory.category === 'deadlines' && trimmed(memory.value) && extractDates(trimmed(memory.value)).length > 0);
  const projects = new Set(safeSources.flatMap(source => valuesOf(source.entities?.projects)));
  for (const project of projects) {
    if (deadlineMemories.some(memory => valuesOf(memory.relatedEntities).includes(project))) continue;
    const claims = safeSources.flatMap(source => {
      if (!valuesOf(source.entities?.projects).includes(project)) return [];
      if (source.type === 'calendar'
        && !/\b(deadline|cutoff)\b/i.test(trimmed(source.title))) return [];
      const deadlineValues = valuesOf(source.entities?.deadlines);
      const claimText = `${trimmed(source.title)} ${trimmed(source.summary)} ${trimmed(source.content)}`;
      if (deadlineValues.length === 0 || !/\b(deadline|due date|cutoff|submission)\b/i.test(claimText)) return [];
      const dates = [...new Set(deadlineValues.flatMap(extractDates))];
      return dates.length > 0 ? [{ source, deadlineValues, dates }] : [];
    });
    if (new Set(claims.flatMap(claim => claim.dates)).size < 2 || claims.length < 2) continue;
    const first = claims[0];
    checks.push(sourceCheck(
      first.source,
      'conflict',
      'Sources give different project deadlines',
      `Sources linked to ${project} give different dates. This check does not determine which date is current.`,
      claims.map(claim => `“${trimmed(claim.source.title)}” lists ${claim.deadlineValues.join('; ')}.`),
      'Open the source records and confirm the current deadline before changing the workspace.',
      claims.slice(1).map(claim => claim.source.id)
    ));
  }

  return checks.filter((check, index, all) =>
    all.findIndex(item => item.id === check.id && item.explanation === check.explanation) === index);
};

export const getRecordCheckStatus = (
  recordType: 'source' | 'memory',
  recordId: string,
  checks: WorkspaceCheck[],
  sources: SourceRecord[],
  memory?: MemoryRecord
): RecordCheckStatus => {
  const recordChecks = checks.filter(check => check.recordType === recordType && check.recordId === recordId);
  const priority: WorkspaceCheckKind[] = ['conflict', 'suspicious', 'invalid', 'incomplete', 'unverified'];
  const selected = priority
    .map(kind => recordChecks.find(check => check.kind === kind))
    .find((check): check is WorkspaceCheck => Boolean(check));

  if (selected) {
    const labels: Record<WorkspaceCheckKind, string> = {
      conflict: 'Conflicting',
      suspicious: 'Suspicious — Needs Review',
      invalid: 'Needs Review',
      incomplete: 'Incomplete',
      unverified: 'Unverified'
    };
    return { label: labels[selected.kind], explanation: selected.explanation, kind: selected.kind };
  }

  if (recordType === 'memory' && memory?.sourceId) {
    const linked = sources.find(source => source.id === memory.sourceId);
    if (linked && normalize(`${trimmed(linked.content)} ${valuesOf(linked.extractedDetails).join(' ')}`)
      .includes(normalize(trimmed(memory.value)))) {
      return {
        label: 'Unverified — matches cited source',
        explanation: 'The saved value appears in its cited source. This confirms the source matches the saved value, not that the source itself is correct.',
        kind: 'evidence'
      };
    }
  }

  return {
    label: 'Unverified',
    explanation: 'No available check confirms this information is correct. TRACE does not verify facts against external services.',
    kind: 'unverified'
  };
};

export const workspaceChecksAsRisks = (checks: WorkspaceCheck[]): TrustRiskRecord[] =>
  checks.map(check => ({
    id: `workspace-check-${check.id}`,
    category: check.kind === 'conflict' ? 'Conflicting information'
      : check.kind === 'suspicious' ? 'Potentially suspicious content'
        : check.kind === 'invalid' ? 'Invalid field format'
          : check.kind === 'incomplete' ? 'Missing required information'
            : 'Unverified information',
    severity: check.kind === 'conflict' || check.kind === 'suspicious' ? 'high' : 'medium',
    explanation: check.explanation,
    supportingSourceIds: check.sourceIds,
    lastUpdated: '',
    confidence: 1,
    suggestedResolution: check.nextStep,
    status: 'unreviewed'
  }));
