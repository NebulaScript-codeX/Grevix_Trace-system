import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { 
  Settings, 
  Shield, 
  User, 
  Sliders, 
  RotateCcw, 
  Database, 
  Check, 
  Save, 
  Lock,
  Download
} from 'lucide-react';

export const SettingsPrivacy: React.FC = () => {
  const { settings, updateSettings, resetDemoWorkspace, addToast, sources, memories, findings, actions, risks, timeline } = useWorkspace();
  const [userName, setUserName] = useState(settings.userName);
  const [workspaceName, setWorkspaceName] = useState(settings.workspaceName);
  const [confidenceThreshold, setConfidenceThreshold] = useState(settings.confidenceThreshold);
  const [autoDetectRisks, setAutoDetectRisks] = useState(settings.autoDetectRisks);
  const [notifyOnConflict, setNotifyOnConflict] = useState(settings.notifyOnConflict);
  const auditRetentionDays = settings.auditRetentionDays;
  const [confirmReset, setConfirmReset] = useState(false);

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      userName,
      workspaceName,
      confidenceThreshold,
      autoDetectRisks,
      notifyOnConflict
    });
    addToast('success', 'Preferences Saved', 'Workspace settings successfully updated.');
  };

  const handleExportWorkspace = () => {
    const exportBundle = {
      exportTimestamp: new Date().toISOString(),
      settings,
      sources,
      memories,
      findings,
      actions,
      risks,
      timeline
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportBundle, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `trace_workspace_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    addToast('success', 'Workspace Exported', 'Downloaded complete context JSON bundle.');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400 mb-1">
          <Settings className="w-4 h-4" />
          <span>Workspace Preferences</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Settings & Privacy</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Update your workspace name, alert preferences, saved data options, and demo records.
        </p>
      </div>

      <form onSubmit={handleSavePreferences} className="space-y-6">
        {/* Profile & Workspace */}
        <div className="p-5 rounded-2xl bg-[#0c1220] border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <User className="w-4 h-4 text-blue-400" />
            <span>Your Profile & Workspace Name</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 font-medium mb-1.5">User Full Name / Authority</label>
              <input
                type="text"
                required
                value={userName}
                onChange={e => setUserName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1.5">Workspace Title</label>
              <input
                type="text"
                required
                value={workspaceName}
                onChange={e => setWorkspaceName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Intelligence & Epistemic Controls */}
        <div className="p-5 rounded-2xl bg-[#0c1220] border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Sliders className="w-4 h-4 text-blue-400" />
            <span>Insight & Alert Preferences</span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-slate-300 font-medium">
                  Minimum Confidence for Insights
                </label>
                <span className="font-mono text-emerald-400 font-bold">{Math.round(confidenceThreshold * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="0.99"
                step="0.01"
                value={confidenceThreshold}
                onChange={e => setConfidenceThreshold(parseFloat(e.target.value))}
                className="w-full accent-blue-600 bg-slate-900 h-2 rounded-lg cursor-pointer"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Live deadline findings below this confidence level are not generated. Existing sample findings remain visible.
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <div>
                <div className="font-semibold text-white">Generate Findings for New Deadline Conflicts</div>
                <div className="text-[11px] text-slate-400">Generate live findings when an ingested source conflicts with a saved deadline.</div>
              </div>
              <input
                type="checkbox"
                checked={autoDetectRisks}
                onChange={e => setAutoDetectRisks(e.target.checked)}
                className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <div>
                <div className="font-semibold text-white">Alert Me About Conflicting Information</div>
                <div className="text-[11px] text-slate-400">Save whether you want alerts about conflicting details. Sample findings in this demo stay the same.</div>
              </div>
              <input
                type="checkbox"
                checked={notifyOnConflict}
                onChange={e => setNotifyOnConflict(e.target.checked)}
                className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Retention & Privacy Policy */}
        <div className="p-5 rounded-2xl bg-[#0c1220] border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>Saved Data & Privacy</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 font-medium mb-1.5">Activity History Retention (Planned)</label>
              <input
                type="number"
                min="7"
                max="365"
                value={auditRetentionDays}
                disabled
                aria-label="Activity history retention, planned"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-500 font-mono cursor-not-allowed"
              />
              <p className="text-[11px] text-slate-500 mt-1">Retention controls are planned; existing activity is currently kept in this browser.</p>
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1.5">Where Your Data Is Saved</label>
              <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 font-mono text-[11px]">
                This browser only
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            Your records and activity history are saved in this browser and are not sent to an external service.
          </p>
        </div>

        {/* Save button */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleExportWorkspace}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-medium transition-colors flex items-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Workspace Data</span>
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-blue-600/20 flex items-center gap-2"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>

      {/* Dangerous Operations / Demo Reset */}
      <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/20 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-rose-300">Reset Demo Workspace</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Replace current demo records with the original Project Polaris example and restart the guided scenario.
            </p>
          </div>

          <button
            onClick={() => setConfirmReset(true)}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Workspace</span>
          </button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {confirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl w-full max-w-sm p-6 shadow-2xl space-y-4 text-center">
            <h3 className="text-base font-bold text-white">Reset this demo workspace?</h3>
            <p className="text-xs text-slate-300">
              This restores the original sample records, saved details, and actions. Any changes or items you added will be replaced by the Project Polaris example.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setConfirmReset(false)}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetDemoWorkspace();
                  setConfirmReset(false);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
