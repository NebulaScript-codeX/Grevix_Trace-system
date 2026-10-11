import React, { useState, useMemo } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { 
  Search, 
  Library, 
  Bookmark, 
  Lightbulb, 
  CheckSquare, 
  ShieldAlert, 
  ArrowRight,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const UniversalSearch: React.FC = () => {
  const { sources, memories, findings, actions, risks, setSelectedItem } = useWorkspace();
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'sources' | 'memories' | 'findings' | 'actions' | 'risks'>('all');

  const results = useMemo(() => {
    if (!query.trim()) return [];

    const q = query.toLowerCase();
    const list: {
      id: string;
      category: 'sources' | 'memories' | 'findings' | 'actions' | 'risks';
      title: string;
      snippet: string;
      raw: any;
      meta: string;
    }[] = [];

    // Search Sources
    if (categoryFilter === 'all' || categoryFilter === 'sources') {
      sources.forEach(s => {
        if (
          s.title.toLowerCase().includes(q) ||
          s.summary.toLowerCase().includes(q) ||
          s.content.toLowerCase().includes(q) ||
          s.author?.toLowerCase().includes(q)
        ) {
          list.push({
            id: s.id,
            category: 'sources',
            title: s.title,
            snippet: s.summary || s.content.substring(0, 140) + '...',
            raw: s,
            meta: `${s.type.toUpperCase()} · ${s.date}`
          });
        }
      });
    }

    // Search Memories
    if (categoryFilter === 'all' || categoryFilter === 'memories') {
      memories.forEach(m => {
        if (
          m.title.toLowerCase().includes(q) ||
          m.value.toLowerCase().includes(q) ||
          m.sourceRef.toLowerCase().includes(q)
        ) {
          list.push({
            id: m.id,
            category: 'memories',
            title: m.title,
            snippet: m.value,
            raw: m,
            meta: `MEMORY · ${m.category.toUpperCase()}`
          });
        }
      });
    }

    // Search Findings
    if (categoryFilter === 'all' || categoryFilter === 'findings') {
      findings.forEach(f => {
        if (
          f.title.toLowerCase().includes(q) ||
          f.explanation.toLowerCase().includes(q) ||
          f.whyItMatters.toLowerCase().includes(q)
        ) {
          list.push({
            id: f.id,
            category: 'findings',
            title: f.title,
            snippet: f.explanation,
            raw: f,
            meta: `FINDING · ${f.severity.toUpperCase()} (${Math.round(f.confidence * 100)}%)`
          });
        }
      });
    }

    // Search Actions
    if (categoryFilter === 'all' || categoryFilter === 'actions') {
      actions.forEach(a => {
        if (
          a.title.toLowerCase().includes(q) ||
          a.explanation.toLowerCase().includes(q)
        ) {
          list.push({
            id: a.id,
            category: 'actions',
            title: a.title,
            snippet: a.explanation,
            raw: a,
            meta: `ACTION · ${a.priority.toUpperCase()} · ${a.status.toUpperCase()}`
          });
        }
      });
    }

    // Search Risks
    if (categoryFilter === 'all' || categoryFilter === 'risks') {
      risks.forEach(r => {
        if (
          r.category.toLowerCase().includes(q) ||
          r.explanation.toLowerCase().includes(q) ||
          r.suggestedResolution.toLowerCase().includes(q)
        ) {
          list.push({
            id: r.id,
            category: 'risks',
            title: `${r.category}: ${r.explanation.substring(0, 50)}...`,
            snippet: r.explanation,
            raw: r,
            meta: `RISK · ${r.severity.toUpperCase()} · ${r.status.toUpperCase()}`
          });
        }
      });
    }

    return list;
  }, [query, categoryFilter, sources, memories, findings, actions, risks]);

  const highlightMatches = (text: string, term: string) => {
    if (!term.trim()) return text;
    const parts = text.split(new RegExp(`(${term})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === term.toLowerCase() ? (
        <mark key={i} className="bg-blue-500/30 text-blue-200 px-0.5 rounded font-semibold">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'sources': return <Library className="w-4 h-4 text-blue-400" />;
      case 'memories': return <Bookmark className="w-4 h-4 text-emerald-400" />;
      case 'findings': return <Lightbulb className="w-4 h-4 text-amber-400" />;
      case 'actions': return <CheckSquare className="w-4 h-4 text-purple-400" />;
      case 'risks': return <ShieldAlert className="w-4 h-4 text-rose-400" />;
      default: return <Search className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400 mb-1">
          <Search className="w-4 h-4" />
          <span>Cross-Context Federation</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Universal Search</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Search seamlessly across ingested emails, calendar events, preserved memories, intelligence findings, and pending actions.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="relative">
        <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          autoFocus
          placeholder="Search by keywords, person name, project, deadline (e.g. 'October 18', 'Sarah Lin', 'deadline', 'prep', 'compliance')..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 bg-[#0c1220] border border-slate-800 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 shadow-xl"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300 px-2 py-1 bg-slate-800 rounded-md"
          >
            Clear
          </button>
        )}
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 p-1 bg-[#0d1322] rounded-xl border border-slate-800 overflow-x-auto text-xs">
        {(['all', 'sources', 'memories', 'findings', 'actions', 'risks'] as const).map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all capitalize whitespace-nowrap ${
              categoryFilter === cat
                ? 'bg-slate-800 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Suggested Quick Queries if empty */}
      {!query && (
        <div className="p-8 rounded-2xl bg-[#0c1220] border border-slate-800 space-y-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Suggested Search Queries</span>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            {['October 18', 'October 20', 'Sarah Lin', 'Prep Session', 'David Chen', 'Data Residency', 'Steering Committee'].map(sq => (
              <button
                key={sq}
                onClick={() => setQuery(sq)}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors"
              >
                "{sq}"
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Results */}
      {query && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Found <strong className="text-white font-mono">{results.length}</strong> matching records</span>
            <span className="font-mono">Query: "{query}"</span>
          </div>

          {results.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[#0c1220] border border-slate-800 space-y-2">
              <Search className="w-8 h-8 text-slate-600 mx-auto" />
              <h3 className="text-sm font-semibold text-white">No Matching Records Found</h3>
              <p className="text-xs text-slate-400">
                No sources, memories, findings, or actions match "{query}". Try broader search terms.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {results.map(item => (
                <div
                  key={`${item.category}-${item.id}`}
                  onClick={() => {
                    const typeMap: Record<string, any> = {
                      sources: 'source',
                      memories: 'memory',
                      findings: 'finding',
                      actions: 'action',
                      risks: 'risk'
                    };
                    setSelectedItem({ type: typeMap[item.category], item: item.raw });
                  }}
                  className="p-4 rounded-xl bg-[#0c1220] border border-slate-800 hover:border-blue-500/40 transition-all cursor-pointer space-y-2 group"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(item.category)}
                      <span className="font-mono text-[10px] uppercase font-bold text-slate-400">
                        {item.meta}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 group-hover:text-blue-400 transition-colors flex items-center gap-1">
                      <span>View details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                    {highlightMatches(item.title, query)}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {highlightMatches(item.snippet, query)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
