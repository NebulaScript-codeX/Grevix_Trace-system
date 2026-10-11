import React, { useState, useMemo, useCallback } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  Node, 
  Edge, 
  MarkerType,
  useNodesState,
  useEdgesState
} from '@xyflow/react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { 
  Network, 
  Search, 
  Filter, 
  Layers, 
  Maximize2, 
  X, 
  ExternalLink,
  Mail,
  Calendar,
  FileText,
  User,
  Briefcase,
  Clock,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const ContextGraph: React.FC = () => {
  const { sources, memories, findings, actions, setSelectedItem } = useWorkspace();
  const [selectedGraphNode, setSelectedGraphNode] = useState<{ id: string; label: string; type: string; details: any } | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  // Dynamically compute nodes & edges from actual workspace records!
  const { initialNodes, initialEdges } = useMemo(() => {
    const rawNodes: Node[] = [];
    const rawEdges: Edge[] = [];

    // Core Project node
    rawNodes.push({
      id: 'proj-polaris',
      position: { x: 420, y: 220 },
      data: { 
        label: 'Project Polaris', 
        type: 'Project',
        subtitle: 'Enterprise Context AI & RFP',
        meta: { id: 'proj-polaris', title: 'Project Polaris' }
      },
      style: {
        background: '#1e293b',
        color: '#f8fafc',
        border: '2px solid #3b82f6',
        borderRadius: '14px',
        padding: '12px 18px',
        fontWeight: 'bold',
        fontSize: '13px',
        boxShadow: '0 8px 24px -4px rgba(59, 130, 246, 0.25)',
        width: 200
      }
    });

    // People Nodes
    const people = [
      { id: 'person-sarah', name: 'Sarah Lin', role: 'Project Director', x: 120, y: 80 },
      { id: 'person-david', name: 'David Chen', role: 'Lead Architect', x: 720, y: 80 },
      { id: 'person-elena', name: 'Elena Rostova', role: 'Compliance Lead', x: 80, y: 380 }
    ];

    people.forEach(p => {
      rawNodes.push({
        id: p.id,
        position: { x: p.x, y: p.y },
        data: { 
          label: p.name, 
          type: 'Person',
          subtitle: p.role,
          meta: p
        },
        style: {
          background: '#0f172a',
          color: '#e2e8f0',
          border: '1px solid #64748b',
          borderRadius: '12px',
          padding: '10px 14px',
          fontSize: '12px',
          width: 170
        }
      });

      rawEdges.push({
        id: `edge-${p.id}-polaris`,
        source: p.id,
        target: 'proj-polaris',
        label: 'LEADS / CONTRIBUTES',
        style: { stroke: '#64748b', strokeWidth: 1.5 },
        labelStyle: { fill: '#94a3b8', fontSize: 10, fontWeight: 600 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#64748b' }
      });
    });

    // Source Records Nodes
    sources.forEach((src, idx) => {
      let x = 120;
      let y = 200;
      let borderCol = '#475569';

      if (src.id === 'src-email-polaris-kickoff') {
        x = 100;
        y = 220;
        borderCol = '#38bdf8';
      } else if (src.id === 'src-email-deadline-advancement') {
        x = 420;
        y = 40;
        borderCol = '#f43f5e';
      } else if (src.id === 'src-cal-prep-session') {
        x = 720;
        y = 260;
        borderCol = '#fbbf24';
      } else if (src.id === 'src-doc-architecture-spec') {
        x = 720;
        y = 420;
      } else {
        x = 420;
        y = 440;
      }

      rawNodes.push({
        id: src.id,
        position: { x, y },
        data: { 
          label: src.title.length > 28 ? src.title.slice(0, 26) + '...' : src.title, 
          type: src.type.toUpperCase(),
          subtitle: src.date,
          meta: src
        },
        style: {
          background: '#0f172a',
          color: '#f1f5f9',
          border: `1.5px solid ${borderCol}`,
          borderRadius: '12px',
          padding: '10px 14px',
          fontSize: '11px',
          width: 190
        }
      });

      if (src.id === 'src-email-polaris-kickoff') {
        rawEdges.push({
          id: `edge-sarah-${src.id}`,
          source: 'person-sarah',
          target: src.id,
          label: 'AUTHORED',
          style: { stroke: '#475569' },
          labelStyle: { fill: '#94a3b8', fontSize: 9 }
        });
        rawEdges.push({
          id: `edge-${src.id}-polaris`,
          source: src.id,
          target: 'proj-polaris',
          label: 'SPECIFIES OCT 20',
          style: { stroke: '#38bdf8' },
          labelStyle: { fill: '#38bdf8', fontSize: 9, fontWeight: 600 }
        });
      }

      if (src.id === 'src-email-deadline-advancement') {
        rawEdges.push({
          id: `edge-sarah-${src.id}`,
          source: 'person-sarah',
          target: src.id,
          label: 'AUTHORED UPDATE',
          style: { stroke: '#f43f5e' },
          labelStyle: { fill: '#f43f5e', fontSize: 9, fontWeight: 700 }
        });
        rawEdges.push({
          id: `edge-${src.id}-polaris`,
          source: src.id,
          target: 'proj-polaris',
          label: 'ADVANCES TO OCT 18',
          style: { stroke: '#f43f5e', strokeWidth: 2 },
          labelStyle: { fill: '#f43f5e', fontSize: 9, fontWeight: 700 }
        });
      }

      if (src.id === 'src-cal-prep-session') {
        rawEdges.push({
          id: `edge-${src.id}-polaris`,
          source: src.id,
          target: 'proj-polaris',
          label: 'PREP RUN (OCT 19)',
          style: { stroke: '#fbbf24' },
          labelStyle: { fill: '#fbbf24', fontSize: 9, fontWeight: 600 }
        });
      }
    });

    // Deadlines & Memories Nodes
    const polarisDeadline = memories.find(m => m.id === 'mem-polaris-deadline');
    if (polarisDeadline) {
      const isVerified = polarisDeadline.verificationStatus === 'verified';
      rawNodes.push({
        id: 'mem-polaris-deadline-node',
        position: { x: 420, y: -70 },
        data: {
          label: `Deadline: ${polarisDeadline.value}`,
          type: 'DEADLINE',
          subtitle: `Status: ${polarisDeadline.verificationStatus}`,
          meta: polarisDeadline
        },
        style: {
          background: isVerified ? '#064e3b' : '#451a03',
          color: '#ffffff',
          border: isVerified ? '2px solid #10b981' : '2px solid #f59e0b',
          borderRadius: '12px',
          padding: '10px 14px',
          fontSize: '11px',
          fontWeight: 600,
          width: 210
        }
      });

      rawEdges.push({
        id: 'edge-deadline-polaris',
        source: 'mem-polaris-deadline-node',
        target: 'proj-polaris',
        label: isVerified ? 'VERIFIED DEADLINE' : 'CONTESTED DEADLINE',
        style: { stroke: isVerified ? '#10b981' : '#f59e0b', strokeDasharray: isVerified ? undefined : '5,5' },
        labelStyle: { fill: isVerified ? '#10b981' : '#f59e0b', fontSize: 9, fontWeight: 700 }
      });
    }

    return { initialNodes: rawNodes, initialEdges: rawEdges };
  }, [sources, memories]);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  // Filter nodes based on type and search query
  const displayedNodes = useMemo(() => {
    return nodes.filter(n => {
      if (typeFilter !== 'all') {
        const nodeType = String(n.data?.type || '');
        if (nodeType.toLowerCase() !== typeFilter.toLowerCase()) return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        const label = String(n.data.label || '').toLowerCase();
        const sub = String(n.data.subtitle || '').toLowerCase();
        if (!label.includes(q) && !sub.includes(q)) return false;
      }
      return true;
    });
  }, [nodes, typeFilter, search]);

  const onNodeClick = useCallback((_: any, node: Node) => {
    setSelectedGraphNode({
      id: node.id,
      label: String(node.data.label),
      type: String(node.data.type),
      details: node.data.meta
    });
  }, []);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400 mb-1">
            <Network className="w-4 h-4" />
            <span>Interactive Relationship Topology</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Context Graph</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Visualize semantic links between people, emails, calendar events, technical specifications, and active deadlines.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search graph nodes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 w-44"
          />

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Node Types</option>
            <option value="project">Projects</option>
            <option value="person">People</option>
            <option value="email">Emails</option>
            <option value="calendar">Calendar</option>
            <option value="deadline">Deadlines</option>
          </select>
        </div>
      </div>

      {/* Graph Canvas Container */}
      <div className="relative h-[620px] rounded-2xl bg-[#090d18] border border-slate-800 overflow-hidden shadow-inner">
        {/* Canvas Legend */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-3 p-2 bg-slate-900/90 border border-slate-800 rounded-xl text-[11px] text-slate-300 backdrop-blur-md">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Project
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400" /> People
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Authoritative Update
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Prep Session
          </span>
        </div>

        {/* ReactFlow Interactive Canvas */}
        <ReactFlow
          nodes={displayedNodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          fitView
          colorMode="dark"
          attributionPosition="bottom-right"
        >
          <Background color="#1e293b" gap={20} size={1} />
          <Controls 
            className="!bg-slate-900 !border-slate-800 !fill-white" 
            showInteractive={false}
          />
        </ReactFlow>

        {/* Slide-out Node Detail Drawer */}
        {selectedGraphNode && (
          <div className="absolute top-4 right-4 z-20 w-80 max-h-[90%] bg-slate-900/95 border border-slate-700/80 rounded-2xl p-5 shadow-2xl backdrop-blur-md overflow-y-auto space-y-4 animate-in fade-in duration-150">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-blue-400">
                  {selectedGraphNode.type} Node
                </span>
                <h4 className="text-sm font-bold text-white mt-0.5 leading-snug">
                  {selectedGraphNode.label}
                </h4>
              </div>
              <button
                onClick={() => setSelectedGraphNode(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {selectedGraphNode.details && (
              <div className="space-y-3 text-xs">
                {selectedGraphNode.details.summary && (
                  <div>
                    <div className="text-[11px] text-slate-400 font-semibold mb-1">Summary</div>
                    <p className="text-slate-300 leading-relaxed bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      {selectedGraphNode.details.summary}
                    </p>
                  </div>
                )}

                {selectedGraphNode.details.value && (
                  <div>
                    <div className="text-[11px] text-slate-400 font-semibold mb-1">Stored Memory Value</div>
                    <p className="text-emerald-300 font-mono font-semibold bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      {selectedGraphNode.details.value}
                    </p>
                  </div>
                )}

                {selectedGraphNode.details.date && (
                  <div className="text-slate-400 font-mono text-[11px]">
                    Timestamp: {selectedGraphNode.details.date}
                  </div>
                )}

                {selectedGraphNode.details.author && (
                  <div className="text-slate-400 text-[11px]">
                    Author: <span className="text-slate-200">{selectedGraphNode.details.author}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-800">
                  <button
                    onClick={() => {
                      if (selectedGraphNode.type.toLowerCase() === 'email' || selectedGraphNode.type.toLowerCase() === 'calendar' || selectedGraphNode.type.toLowerCase() === 'document') {
                        setSelectedItem({ type: 'source', item: selectedGraphNode.details });
                      } else if (selectedGraphNode.type.toLowerCase() === 'deadline') {
                        setSelectedItem({ type: 'memory', item: selectedGraphNode.details });
                      }
                    }}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open Record Details</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
