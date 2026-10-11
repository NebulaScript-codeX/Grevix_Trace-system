import React from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { 
  Layers, 
  Mail, 
  Calendar, 
  FileText, 
  MessageSquare, 
  ShieldCheck, 
  Lock, 
  RefreshCw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { IntegrationService } from '../../types';

export const IntegrationsPermissions: React.FC = () => {
  const { integrations, addToast } = useWorkspace();

  const getStatusBadge = (status: IntegrationService['status']) => {
    switch (status) {
      case 'demo_only':
        return (
          <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
            DEMO SOURCE
          </span>
        );
      case 'connected':
        return (
          <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            CONNECTED
          </span>
        );
      case 'available':
        return (
          <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
            AVAILABLE
          </span>
        );
      case 'configured':
        return (
          <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
            CONFIGURED
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400">
            UNAVAILABLE
          </span>
        );
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Mail': return <Mail className="w-5 h-5 text-blue-400" />;
      case 'Calendar': return <Calendar className="w-5 h-5 text-amber-400" />;
      case 'FileText': return <FileText className="w-5 h-5 text-emerald-400" />;
      default: return <MessageSquare className="w-5 h-5 text-slate-400" />;
    }
  };

  const handleViewStatus = (integration: IntegrationService) => {
    const message = integration.status === 'demo_only'
      ? `${integration.name} is a local demo record. No remote connection or synchronization is configured.`
      : `${integration.name} is marked ${integration.status}. No remote connection or synchronization is attempted.`;
    addToast('info', 'Connector Status', message);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400 mb-1">
          <Layers className="w-4 h-4" />
          <span>Security & Connected Gateways</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Integrations & Permissions</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Audited connector credentials, data isolation boundaries, and least-privilege permission grants.
        </p>
      </div>

      {/* Trust Notice */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3 text-xs text-slate-300 leading-relaxed">
        <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-white">Strict Transparency Policy: </strong>
          TRACE never fabricates active OAuth connections to external services like Gmail or Google Calendar without real user tokens. In demo mode, simulated enterprise records are unambiguously marked as <strong>DEMO SOURCE</strong> to protect trust and epistemic integrity.
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map(integ => (
          <div
            key={integ.id}
            className="p-5 rounded-2xl bg-[#0c1220] border border-slate-800 hover:border-slate-700 transition-all space-y-4 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                  {getIcon(integ.iconName)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">{integ.name}</h3>
                  <div className="text-[11px] text-slate-500 font-mono capitalize">Category: {integ.category}</div>
                </div>
              </div>

              <div>{getStatusBadge(integ.status)}</div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {integ.description}
            </p>

            {/* Permissions list */}
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Granted Permissions:
              </div>
              <ul className="space-y-1">
                {integ.permissions.map((p, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-slate-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Capabilities */}
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Supported Capabilities:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {integ.capabilities.map((c, i) => (
                  <span key={i} className="text-[11px] px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-slate-300">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-500 font-mono">
                {integ.lastSync ? `Sync: ${integ.lastSync}` : 'Status: Offline'}
              </span>

              <button
                onClick={() => handleViewStatus(integ)}
                className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-medium border border-slate-800 transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Check Status</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
