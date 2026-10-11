import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { 
  Library, 
  Mail, 
  Calendar, 
  FileText, 
  Bookmark, 
  Plus, 
  Search, 
  Trash2, 
  ExternalLink,
  X,
  FileCheck2,
  Tag
} from 'lucide-react';
import { SourceRecord, SourceType } from '../../types';
import { getRecordCheckStatus } from '../../utils/workspaceChecks';

export const SourceLibrary: React.FC = () => {
  const { sources, workspaceChecks, addSource, deleteSource, setSelectedItem } = useWorkspace();
  const [typeFilter, setTypeFilter] = useState<'all' | SourceType>('all');
  const [search, setSearch] = useState('');
  const [isAddOpen, setAddOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // New source form state
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<SourceType>('email');
  const [newSummary, setNewSummary] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newDetails, setNewDetails] = useState('');

  const types: SourceType[] = ['email', 'calendar', 'document', 'meeting', 'note', 'update'];

  const filteredSources = sources.filter(s => {
    if (typeFilter !== 'all' && s.type !== typeFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!s.title.toLowerCase().includes(q) && !s.summary.toLowerCase().includes(q) && !s.content.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const extracted = newDetails
      .split('\n')
      .map(d => d.trim())
      .filter(d => d.length > 0);
    const sourceText = `${newTitle}\n${newContent}`.toLowerCase();
    const mentionedProjects = [...new Set(sources.flatMap(source =>
      Array.isArray(source.entities?.projects) ? source.entities.projects : []))]
      .filter(project => sourceText.includes(project.toLowerCase()));

    addSource({
      title: newTitle.trim(),
      type: newType,
      summary: newSummary.trim() || newContent.trim().substring(0, 100) + '...',
      content: newContent.trim(),
      sourceLabel: `Manual Ingestion · ${newAuthor || 'User'}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      author: newAuthor.trim() || undefined,
      entities: {
        people: newAuthor ? [newAuthor] : [],
        projects: mentionedProjects
      },
      extractedDetails: extracted.length > 0 ? extracted : ['User submitted context note'],
      isDemo: false
    });

    setNewTitle('');
    setNewSummary('');
    setNewContent('');
    setNewAuthor('');
    setNewDetails('');
    setAddOpen(false);
  };

  const getSourceIcon = (type: SourceType) => {
    switch (type) {
      case 'email': return <Mail className="w-4 h-4 text-blue-400" />;
      case 'calendar': return <Calendar className="w-4 h-4 text-amber-400" />;
      case 'document': return <FileText className="w-4 h-4 text-emerald-400" />;
      case 'meeting': return <FileCheck2 className="w-4 h-4 text-purple-400" />;
      default: return <Bookmark className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400 mb-1">
            <Library className="w-4 h-4" />
            <span>Workspace Sources</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Source Library</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Browse emails, calendar entries, meeting notes, documents, and other information saved in this workspace.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search sources..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 w-48"
          />
          <button
            onClick={() => setAddOpen(true)}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Source</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-[#0d1322] rounded-xl border border-slate-800 overflow-x-auto">
        <button
          onClick={() => setTypeFilter('all')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
            typeFilter === 'all'
              ? 'bg-slate-800 text-white font-semibold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          All Sources ({sources.length})
        </button>
        {types.map(t => {
          const count = sources.filter(s => s.type === t).length;
          return (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all capitalize whitespace-nowrap ${
                typeFilter === t
                  ? 'bg-slate-800 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t} ({count})
            </button>
          );
        })}
      </div>

      {/* Source Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSources.map(source => (
          <div
            key={source.id}
            className="p-5 rounded-2xl bg-[#0c1220] border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between gap-4 group shadow-sm"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  {getSourceIcon(source.type)}
                  <span className="font-semibold text-slate-300 uppercase tracking-wider text-[10px]">
                    {source.type}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-medium ${
                    source.isDemo ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  }`}>
                    {source.isDemo ? 'DEMO RECORD' : 'IMPORTED'}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white tracking-tight leading-snug">{source.title}</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {source.summary}
                </p>
              </div>

              {source.extractedDetails && source.extractedDetails.length > 0 && (
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-300 space-y-1">
                  <div className="font-semibold text-slate-400 text-[10px] uppercase tracking-wider">Extracted Details:</div>
                  <div className="truncate text-slate-300">{source.extractedDetails[0]}</div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800/60 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="truncate max-w-[160px]">{source.sourceLabel}</span>
                <span className="font-mono text-slate-500">{source.date.split(' ')[0]}</span>
              </div>
              <div
                title={getRecordCheckStatus('source', source.id, workspaceChecks, sources).explanation}
                className={`text-[10px] font-mono uppercase font-semibold ${
                  getRecordCheckStatus('source', source.id, workspaceChecks, sources).kind === 'suspicious'
                    ? 'text-rose-400'
                    : getRecordCheckStatus('source', source.id, workspaceChecks, sources).kind === 'incomplete'
                      || getRecordCheckStatus('source', source.id, workspaceChecks, sources).kind === 'invalid'
                      ? 'text-amber-400'
                      : 'text-slate-400'
                }`}
              >
                Check status: {getRecordCheckStatus('source', source.id, workspaceChecks, sources).label}
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => setSelectedItem({ type: 'source', item: source })}
                  className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Inspect Evidence</span>
                </button>

                <button
                  onClick={() => setDeletingId(source.id)}
                  className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                  title="Delete source record"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Source Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Add a Source</h3>
              <button onClick={() => setAddOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Source Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Steering Committee Follow-up"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Record Type</label>
                  <select
                    value={newType}
                    onChange={e => setNewType(e.target.value as SourceType)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500 capitalize"
                  >
                    {types.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Author / Sender</label>
                  <input
                    type="text"
                    placeholder="e.g. Sarah Lin"
                    value={newAuthor}
                    onChange={e => setNewAuthor(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Summary</label>
                <input
                  type="text"
                  placeholder="Short 1-sentence summary"
                  value={newSummary}
                  onChange={e => setNewSummary(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Full Content / Body</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Paste raw email, document text, or meeting transcript..."
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Extracted Key Details (One per line)</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Deadline adjusted to October 25&#10;Lead reviewer: David Chen"
                  value={newDetails}
                  onChange={e => setNewDetails(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setAddOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-sm"
                >
                  Index Source
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl w-full max-w-sm p-6 shadow-2xl space-y-4 text-center">
            <h3 className="text-base font-bold text-white">Delete Source Record?</h3>
            <p className="text-xs text-slate-300">
              Removing this source record will unindex its extracted facts and record an event in the audit trail.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteSource(deletingId);
                  setDeletingId(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
