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

const datePattern =
  /\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{1,2},?\s+\d{4}\b|\b\d{4}-\d{2}-\d{2}\b/gi;

const canonicalDate = (value: string): string | undefined => {
  const iso = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  let year: number;
  let month: number;
  let day: number;

  if (iso) {
    year = Number(iso[1]);
    month = Number(iso[2]);
    day = Number(iso[3]);
  } else {
    const named = value.match(/^([A-Za-z]+)\s+(\d{1,2}),?\s+(\d{4})$/);
    if (!named) return undefined;
    const monthNumber = new Map([
      ['jan', 1], ['feb', 2], ['mar', 3], ['apr', 4], ['may', 5], ['jun', 6],
      ['jul', 7], ['aug', 8], ['sep', 9], ['oct', 10], ['nov', 11], ['dec', 12]
    ]).get(named[1].slice(0, 3).toLowerCase());
    if (!monthNumber) return undefined;
    month = monthNumber;
    day = Number(named[2]);
    year = Number(named[3]);
  }

  const parsed = new Date(Date.UTC(year, month - 1, day));
  if (parsed.getUTCFullYear() !== year
    || parsed.getUTCMonth() !== month - 1
    || parsed.getUTCDate() !== day) return undefined;
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

const extractDates = (value: string): string[] => {
  const matches = value.match(datePattern) ?? [];
  return [...new Set(matches.map(date => canonicalDate(date)).filter((date): date is string => Boolean(date)))];
};

const deadlineDateKey = (value: string, suffix: string): string | undefined => {
  const dateKey = canonicalDate(value);
  if (!dateKey) return undefined;
  const time = suffix.match(/^\s*,?\s*(?:at\s+)?(\d{1,2})(?::(\d{2}))?\s*(AM|PM)\b/i);
  if (time) {
    let hour = Number(time[1]) % 12;
    if (time[3].toUpperCase() === 'PM') hour += 12;
    return `${dateKey}T${String(hour).padStart(2, '0')}:${time[2] ?? '00'}`;
  }
  const twentyFourHourTime = suffix.match(/^\s*,?\s*(?:T\s*)?(?:at\s+)?([01]?\d|2[0-3]):([0-5]\d)\b/);
  return twentyFourHourTime
    ? `${dateKey}T${String(Number(twentyFourHourTime[1])).padStart(2, '0')}:${twentyFourHourTime[2]}`
    : dateKey;
};

export const getDeadlineDateKeys = (value: string): string[] => {
  const matches = [...value.matchAll(new RegExp(datePattern.source, 'gi'))];
  return [...new Set(matches.flatMap(match => {
    const key = deadlineDateKey(match[0], value.slice((match.index ?? 0) + match[0].length));
    return key ? [key] : [];
  }))];
};

export const deadlineValuesAgree = (first: string, second: string): boolean => {
  const firstKeys = getDeadlineDateKeys(first);
  const secondKeys = getDeadlineDateKeys(second);
  return firstKeys.some(firstKey => secondKeys.some(secondKey => {
    const [firstDate, firstTime] = firstKey.split('T');
    const [secondDate, secondTime] = secondKey.split('T');
    return firstDate === secondDate && (!firstTime || !secondTime || firstTime === secondTime);
  }));
};

const deadlineValue = (value: string, suffix: string): string => {
  const time = suffix.match(/^\s*,?\s*(?:at\s+)?\d{1,2}(?::\d{2})?\s*(?:AM|PM)\b/i)
    ?? suffix.match(/^\s*,?\s*(?:T\s*)?(?:at\s+)?(?:[01]?\d|2[0-3]):[0-5]\d\b/);
  return time ? `${value} ${time[0].trim()}` : value;
};

export const extractDeadlineValuesFromText = (value: string): string[] => {
  const lines = value.split(/\r?\n/);
  const claims: Array<{ value: string; segment: string }> = [];

  lines.forEach((line, lineIndex) => {
    const segments = line.split(/(?<=[.!?])\s+/);
    for (const segment of segments) {
      const cueIndex = segment.search(/\b(?:deadline|due date|cutoff|submission)\b/i);
      if (cueIndex < 0) continue;
      const matches = [...segment.matchAll(new RegExp(datePattern.source, 'gi'))];
      const afterCue = matches.filter(match => (match.index ?? -1) >= cueIndex);
      const selected = afterCue.length > 0
        ? /\bfrom\b[\s\S]*\bto\b/i.test(segment) ? afterCue[afterCue.length - 1] : afterCue[0]
        : matches.length === 1 ? matches[0] : undefined;
      const historicalOnly = /\b(?:previous|former|old|original|superseded)\b/i.test(segment)
        && !/\b(?:new|updated|revised|binding|current|changed to|advanced to)\b/i.test(segment);
      if (!historicalOnly && selected?.[0] && canonicalDate(selected[0])) {
        const selectedIndex = selected.index ?? 0;
        claims.push({
          value: deadlineValue(selected[0], segment.slice(selectedIndex + selected[0].length)),
          segment
        });
      }

      if (segment.trimEnd().endsWith(':')) {
        const nextLine = lines.slice(lineIndex + 1).find(candidate => candidate.trim());
        const nextDate = nextLine?.match(datePattern)?.[0];
        if (!historicalOnly && nextDate && canonicalDate(nextDate)) {
          const nextDateIndex = nextLine?.indexOf(nextDate) ?? 0;
          claims.push({
            value: deadlineValue(nextDate, nextLine?.slice(nextDateIndex + nextDate.length) ?? ''),
            segment
          });
        }
      }
    }
  });

  const uniqueValues = [...new Map(claims.map(claim =>
    [getDeadlineDateKeys(claim.value)[0], claim.value])).values()];
  if (uniqueValues.length <= 1) return uniqueValues;
  const currentClaims = claims.filter(claim =>
    /\b(?:new|updated|revised|binding|current|changed to|advanced to|moved forward|moved back)\b/i.test(claim.segment)
    && !/\b(?:previous|former|old|original|superseded)\b/i.test(claim.segment));
  const currentValues = [...new Map(currentClaims.map(claim =>
    [getDeadlineDateKeys(claim.value)[0], claim.value])).values()];
  return currentValues.length === 1 ? currentValues : [];
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
    const memoryDates = getDeadlineDateKeys(trimmed(memory.value));
    if (memoryDates.length === 0) continue;
    const candidates = safeSources.filter(candidate => {
      if (!projectNames.some(project => valuesOf(candidate.entities?.projects).includes(project))) return false;
      if (candidate.type === 'calendar'
        && !/\b(deadline|cutoff)\b/i.test(trimmed(candidate.title))) return false;
      const sourceClaimsDeadline = /\b(deadline|due date|cutoff|submission)\b/i
        .test(`${trimmed(candidate.title)} ${trimmed(candidate.summary)} ${trimmed(candidate.content)}`);
      return sourceClaimsDeadline && extractDeadlineValuesFromText(candidate.content).length > 0;
    });
    const claims = candidates.flatMap(candidate => {
      const dates = extractDeadlineValuesFromText(candidate.content);
      return dates.map(date => ({ candidate, date }));
    });
    const sourceTimestamps = candidates.map(candidate => Date.parse(candidate.date)).filter(Number.isFinite);
    const latestTimestamp = sourceTimestamps.length ? Math.max(...sourceTimestamps) : undefined;
    const currentClaims = latestTimestamp === undefined
      ? claims
      : claims.filter(claim => Date.parse(claim.candidate.date) === latestTimestamp);
    const conflicts: string[] = [];
    const conflictingSourceIds: string[] = [];
    const linkedSource = safeSources.find(item => item.id === memory.sourceId);
    for (const claim of currentClaims) {
      if (deadlineValuesAgree(trimmed(memory.value), claim.date)) continue;
      conflicts.push(`Current deadline evidence: “${trimmed(claim.candidate.title)}” (${claim.candidate.id}) — ${claim.date}`);
      conflictingSourceIds.push(claim.candidate.id);
    }
    if (conflicts.length > 0) {
      checks.push(memoryCheck(
        memory,
        'conflict',
        'Deadline information disagrees',
        'The latest dated source claim for this project gives a different deadline from the saved detail. Compare the cited records before changing the memory.',
        [
          `Saved detail: “${trimmed(memory.title)}” (${memory.id}) — ${trimmed(memory.value)}${linkedSource ? ` (source: ${trimmed(linkedSource.title)}, ${linkedSource.id})` : ''}`,
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
      const claimText = `${trimmed(source.title)} ${trimmed(source.summary)} ${trimmed(source.content)}`;
      const deadlineValues = extractDeadlineValuesFromText(source.content);
      if (deadlineValues.length === 0 || !/\b(deadline|due date|cutoff|submission)\b/i.test(claimText)) return [];
      const dates = [...new Set(deadlineValues.flatMap(getDeadlineDateKeys))];
      return dates.length > 0 ? [{ source, deadlineValues, dates }] : [];
    });
    const sourceClaims = claims.flatMap(claim =>
      claim.deadlineValues.map(value => ({ source: claim.source, value })));
    const hasConflict = sourceClaims.some((claim, index) =>
      sourceClaims.slice(index + 1).some(other => !deadlineValuesAgree(claim.value, other.value)));
    if (!hasConflict || claims.length < 2) continue;
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
  const recordChecks = checks.filter(check =>
    check.recordType === recordType && check.recordId === recordId
    || recordType === 'source' && check.kind === 'conflict' && check.sourceIds.includes(recordId));
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
