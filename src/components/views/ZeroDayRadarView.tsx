import React, { useState } from 'react';
import {
  ShieldAlert,
  Radio,
  Sparkles,
  Zap,
  CheckCircle2,
  Lock,
  Unlock,
  Layers,
  ArrowRight,
  TrendingDown,
  X
} from 'lucide-react';
import { MOCK_ZERO_DAYS } from '../../data/mockFraudData';
import { ZeroDayIncident } from '../../types/fraud';

export const ZeroDayRadarView: React.FC = () => {
  const [incidents, setIncidents] = useState<ZeroDayIncident[]>(MOCK_ZERO_DAYS);
  const [selectedIncident, setSelectedIncident] = useState<ZeroDayIncident>(MOCK_ZERO_DAYS[0]);
  const [quarantinedIds, setQuarantinedIds] = useState<string[]>([]);
  const [confirmAction, setConfirmAction] = useState<{ type: 'deploy' | 'release'; incident: ZeroDayIncident } | null>(null);

  const requestDeploy = (incident: ZeroDayIncident) => setConfirmAction({ type: 'deploy', incident });
  const requestRelease = (incident: ZeroDayIncident) => setConfirmAction({ type: 'release', incident });

  const confirmDeploy = (id: string) => {
    setQuarantinedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setConfirmAction(null);
  };

  const confirmRelease = (id: string) => {
    setQuarantinedIds((prev) => prev.filter((qid) => qid !== id));
    setConfirmAction(null);
  };

  return (
    <div id="view-zero-day-radar" className="p-4 md:p-6 space-y-6 animate-in fade-in">
      {/* Top Banner */}
      <div className="p-4 md:p-5 rounded-2xl bg-gradient-to-r from-rose-50 via-white to-rose-50 dark:from-[#0c1836] dark:via-[#102046] dark:to-[#0d1630] border border-rose-200/70 dark:border-[#21355e] flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xs dark:shadow-xl transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-100 text-rose-700 border border-rose-300 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-500/40 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              ZERO-DAY BEHAVIORAL ANOMALY RADAR
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">• Unsupervised Novel Attack Discovery</span>
          </div>
          <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white tracking-tight mt-1">
            Detecting Attacks That Match Neither Known Fraud nor Normal Baselines
          </h2>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed mt-1">
            Rule-based engines only catch what they've seen before. Our unsupervised clustering flags <strong>unprecedented behavioral topologies</strong> (Zero-Days) in real-time and auto-synthesizes candidate defense signatures.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 dark:bg-[#091122] dark:border-[#1b2b4c] dark:text-purple-300">
            🧬 {incidents.length} Zero-Day Strains Flagged
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Zero-Day Incidents List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-xs font-mono font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Unsupervised Zero-Day Incidents
          </h3>

          <div className="space-y-3">
            {incidents.map((z) => {
              const isSelected = selectedIncident?.id === z.id;
              const isQuarantined = quarantinedIds.includes(z.id);

              return (
                <div
                  key={z.id}
                  onClick={() => setSelectedIncident(z)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-rose-50 border-rose-400 shadow-md ring-1 ring-rose-400/30 dark:bg-[#121f3d] dark:shadow-xl'
                      : 'bg-white border-slate-200 hover:bg-slate-50 dark:bg-[#0c1427] dark:border-[#1b2b4c] dark:hover:bg-[#0f1a35]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-rose-700 bg-rose-100 px-2 py-0.5 rounded border border-rose-300 dark:text-rose-300 dark:bg-rose-950 dark:border-rose-500/40">
                      {z.strainId}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">{z.discoveredTime}</span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-2">{z.strainName}</h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">{z.description}</p>

                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-[#1a2846] flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-500 dark:text-slate-400">
                      Affected: <strong className="text-slate-900 dark:text-white">{z.affectedAccountsCount} accounts</strong>
                    </span>
                    <span className={isQuarantined ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-amber-600 dark:text-amber-400'}>
                      {isQuarantined ? '🛡️ Quarantined' : '🔴 Uncontained'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Deep Incident Breakdown & Auto-Signature (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {selectedIncident && (
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs dark:bg-[#0c1427] dark:border-[#1b2b4c] dark:shadow-lg space-y-5 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-[#1b2b4c]">
                <div>
                  <span className="text-[10px] font-mono text-rose-600 dark:text-rose-400 font-bold uppercase">
                    Zero-Day Signature: {selectedIncident.strainId}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                    {selectedIncident.strainName}
                  </h3>
                </div>

                {quarantinedIds.includes(selectedIncident.id) ? (
                  <div className="flex items-center gap-2">
                    <span className="px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-500/40">
                      <Lock className="w-3.5 h-3.5" />
                      Strain Quarantined
                    </span>
                    <button
                      onClick={() => requestRelease(selectedIncident)}
                      className="px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 bg-white border border-rose-300 text-rose-600 hover:bg-rose-50 dark:bg-[#0c1427] dark:border-rose-500/40 dark:text-rose-400 dark:hover:bg-rose-950/30 cursor-pointer"
                    >
                      <Unlock className="w-3.5 h-3.5" />
                      Release Quarantine
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => requestDeploy(selectedIncident)}
                    className="px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-200 dark:shadow-rose-950 cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    Deploy Ephemeral Quarantine Rule
                  </button>
                )}
              </div>

              {/* Behavior Breakdown */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 dark:bg-[#080e1e] dark:border-[#1e2f54] space-y-2">
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase">
                  Unprecedented Behavioral Artifact
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
                  {selectedIncident.description}
                </p>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-600 dark:text-slate-300 pt-1">
                  <span>Anomaly Distance: <b className="text-rose-600 dark:text-rose-400">4.8 Sigma from baseline</b></span>
                  <span>Clustered Nodes: <b className="text-sky-600 dark:text-sky-300">{selectedIncident.affectedAccountsCount} Accounts</b></span>
                </div>
              </div>

              {/* Auto-Synthesized Candidate Rule */}
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-purple-700 dark:text-purple-300 uppercase flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  Auto-Synthesized Candidate Rule
                </span>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sky-700 dark:bg-[#070c1a] dark:border-[#182644] dark:text-sky-300 font-mono text-[11px] leading-relaxed">
                  {selectedIncident.candidateRule}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-800 dark:bg-purple-950/20 dark:border-purple-500/30 dark:text-purple-200">
                <strong>Discovery Mechanism:</strong> Unsupervised DBSCAN density clustering tagged this cohort because their joint hesitation-flight distribution fell outside all 2,400 established cluster centroids.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Deploy / Release Confirmation Dialog */}
      {confirmAction && (
        <div
          id="modal-zero-day-quarantine-confirm"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setConfirmAction(null)}
        >
          <div
            className="bg-white border border-slate-200 dark:bg-[#0c1427] dark:border-[#1b2b4c] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden text-slate-900 dark:text-white font-sans transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-5 border-b border-slate-100 dark:border-[#1b2b4c] bg-slate-50 dark:bg-[#080e1e] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    confirmAction.type === 'deploy'
                      ? 'bg-rose-100 border border-rose-300 text-rose-600 dark:bg-rose-500/10 dark:border-rose-500/30 dark:text-rose-400'
                      : 'bg-emerald-100 border border-emerald-300 text-emerald-600 dark:bg-emerald-500/10 dark:border-emerald-500/30 dark:text-emerald-400'
                  }`}
                >
                  {confirmAction.type === 'deploy' ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {confirmAction.type === 'deploy'
                      ? 'Deploy quarantine rule for this strain?'
                      : 'Release this strain from quarantine?'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                    Strain: {confirmAction.incident.strainId}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setConfirmAction(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#182132] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5">
              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {confirmAction.type === 'deploy'
                  ? `This flags all accounts matching this behavioral signature (currently ${confirmAction.incident.affectedAccountsCount} accounts) for review and blocks matching new sessions until released. This action can be reversed at any time from this same screen.`
                  : 'Accounts matching this signature will no longer be automatically flagged. This does not delete the incident record or undo the original detection — only the quarantine action.'}
              </p>
            </div>

            {/* Actions */}
            <div className="p-4 bg-slate-50 dark:bg-[#080e1e] border-t border-slate-100 dark:border-[#1b2b4c] flex flex-col sm:flex-row items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setConfirmAction(null)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 dark:bg-[#0c1427] dark:border-[#1b2b4c] dark:hover:bg-[#0f1a35] dark:text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              {confirmAction.type === 'deploy' ? (
                <button
                  type="button"
                  onClick={() => confirmDeploy(confirmAction.incident.id)}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Confirm Deploy</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => confirmRelease(confirmAction.incident.id)}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Confirm Release</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
