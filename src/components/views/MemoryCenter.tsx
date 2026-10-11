import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { 
  Bookmark, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  X
} from 'lucide-react';
import { MemoryCategory, MemoryRecord } from '../../types';

export const MemoryCenter: React.FC = () => {
  const { 
    memories, 
    addMemory, 
    updateMemory, 
    deleteMemory, 
    setSelectedItem 
  } = useWorkspace();

  const [categoryFilter, setCategoryFilter] = useState<'all' | MemoryCategory>('all');
  const [search, setSearch] = useState('');
  
  // Modals state
  const [isAddOpen, setAddOpen] = useState(false);
  const [editingMemory, setEditingMemory] = useState<MemoryRecord | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // New Memory Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<MemoryCategory>('facts');
  const [newValue, setNewValue] = useState('');
  const [newSourceRef, setNewSourceRef] = useState('');

  const categories: MemoryCategory[] = [
    'people', 
    'projects', 
    'decisions', 
    'preferences', 
    'commitments', 
    'deadlines', 
    'facts'
  ];

  const filteredMemories = memories.filter(m => {
    if (categoryFilter !== 'all' && m.category !== categoryFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!m.title.toLowerCase().includes(q) && !m.value.toLowerCase().includes(q) && !m.sourceRef.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newValue.trim()) return;

    addMemory({
      title: newTitle.trim(),
      category: newCategory,
      value: newValue.trim(),
      sourceRef: newSourceRef.trim() || 'Manual user entry in Memory Center',
      verificationStatus: 'verified',
      relatedEntities: []
    });

    setNewTitle('');
    setNewValue('');
    setNewSourceRef('');
    setAddOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMemory) return;

    updateMemory(editingMemory.id, {
      title: editingMemory.title,
      category: editingMemory.category,
      value: editingMemory.value,
      verificationStatus: editingMemory.verificationStatus
    });

    setEditingMemory(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400 mb-1">
            <Bookmark className="w-4 h-4" />
            <span>Saved Project Information</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Memory Center</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Keep useful project details, decisions, preferences, deadlines, and commitments here so you can find and update them later.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search memories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 w-48"
          />
          <button
            onClick={() => setAddOpen(true)}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Project Detail</span>
          </button>
        </div>
      </div>

      {/* Categories Filter Bar */}
      <div className="flex items-center gap-1 p-1 bg-[#0d1322] rounded-xl border border-slate-800 overflow-x-auto">
        <button
          onClick={() => setCategoryFilter('all')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
            categoryFilter === 'all'
              ? 'bg-slate-800 text-white font-semibold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          All Details ({memories.length})
        </button>
        {categories.map(cat => {
          const count = memories.filter(m => m.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all capitalize whitespace-nowrap ${
                categoryFilter === cat
                  ? 'bg-slate-800 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat === 'commitments' ? 'Commitments & tasks' : cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Grid of Memories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMemories.map(mem => (
          <div
            key={mem.id}
            className="p-5 rounded-2xl bg-[#0c1220] border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between gap-4 group"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                  {mem.category === 'commitments' ? 'Commitments & tasks' : mem.category}
                </span>
                <span className={`text-[10px] font-mono uppercase font-semibold flex items-center gap-1 ${
                  mem.verificationStatus === 'verified' ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {mem.verificationStatus === 'verified' ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                  <span>{mem.verificationStatus === 'verified' ? 'Confirmed' : mem.verificationStatus === 'unverified' ? 'Needs checking' : 'Inferred'}</span>
                </span>
              </div>

              <h3 className="text-sm font-bold text-white tracking-tight leading-snug">{mem.title}</h3>
              <p className="text-xs text-slate-200 bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 leading-relaxed font-medium">
                {mem.value}
              </p>
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-800/60">
              <div className="text-[11px] text-slate-500 truncate" title={mem.sourceRef}>
                Source: {mem.sourceRef}
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-[10px] text-slate-500 font-mono">Updated: {mem.updatedAt.split(' ')[0]}</span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingMemory(mem)}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    title="Edit saved detail"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeletingId(mem.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors"
                    title="Delete saved detail"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setSelectedItem({ type: 'memory', item: mem })}
                    className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-colors"
                    title="View saved detail"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Memory Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Save Project Detail</h3>
              <button onClick={() => setAddOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Detail Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Elena Rostova Compliance Deliverable"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value as MemoryCategory)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500 capitalize"
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Context Value / Stored Fact</label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Initial regulatory audit checklist due on October 14, 2026."
                  value={newValue}
                  onChange={e => setNewValue(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Source Reference</label>
                <input
                  type="text"
                  placeholder="e.g. Steering Committee Meeting Notes, Item #3"
                  value={newSourceRef}
                  onChange={e => setNewSourceRef(e.target.value)}
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
                  Save to Context
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Memory Modal */}
      {editingMemory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Edit Saved Detail</h3>
              <button onClick={() => setEditingMemory(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editingMemory.title}
                  onChange={e => setEditingMemory({ ...editingMemory, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Stored Value</label>
                <textarea
                  required
                  rows={3}
                  value={editingMemory.value}
                  onChange={e => setEditingMemory({ ...editingMemory, value: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Verification Status</label>
                <select
                  value={editingMemory.verificationStatus}
                  onChange={e => setEditingMemory({ ...editingMemory, verificationStatus: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500 capitalize"
                >
                  <option value="verified">Confirmed</option>
                  <option value="unverified">Needs checking</option>
                  <option value="inferred">Inferred</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingMemory(null)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-sm"
                >
                  Save Changes
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
            <h3 className="text-base font-bold text-white">Delete this saved detail?</h3>
            <p className="text-xs text-slate-300">
              This will remove this memory from your workspace context and record a deletion event in the audit log.
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
                  deleteMemory(deletingId);
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
