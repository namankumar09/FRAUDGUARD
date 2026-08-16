import React, { useState } from 'react';
import {
  ShieldAlert,
  Radio,
  Sparkles,
  Zap,
  CheckCircle2,
  Lock,
  Layers,
  ArrowRight,
  TrendingDown
} from 'lucide-react';
import { MOCK_ZERO_DAYS } from '../../data/mockFraudData';
import { ZeroDayIncident } from '../../types/fraud';

export const ZeroDayRadarView: React.FC = () => {
  const [incidents, setIncidents] = useState<ZeroDayIncident[]>(MOCK_ZERO_DAYS);
  const [selectedIncident, setSelectedIncident] = useState<ZeroDayIncident>(MOCK_ZERO_DAYS[0]);
  const [quarantinedIds, setQuarantinedIds] = useState<string[]>([]);

  const handleQuarantine = (id: string) => {
    setQuarantinedIds((prev) => [...prev, id]);
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
            <span className="text-xs text-[var(--text-muted)] font-mono">• Unsupervised Novel Attack Discovery</span>
          </div>
          <h2 className="text-lg md:text-xl font-bold text-[var(--text-primary)] tracking-tight mt-1">
            Detecting Attacks That Match Neither Known Fraud nor Normal Baselines
          </h2>
          <p className="text-xs md:text-sm text-[var(--text-secondary)] max-w-3xl leading-relaxed mt-1">
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
          <h3 className="text-xs font-mono font-bold text-[var(--text-primary)] uppercase tracking-wider">
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
                      : 'bg-[var(--bg-card)] border-[var(--border-color)] hover:bg-[var(--bg-hover)]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-rose-700 bg-rose-100 px-2 py-0.5 rounded border border-rose-300 dark:text-rose-300 dark:bg-rose-950 dark:border-rose-500/40">
                      {z.strainId}
                    </span>
                    <span className="text-[10px] font-mono text-[var(--text-muted)]">{z.discoveredTime}</span>
                  </div>

                  <h4 className="text-xs font-bold text-[var(--text-primary)] mt-2">{z.strainName}</h4>
                  <p className="text-[11px] text-[var(--text-secondary)] mt-1 line-clamp-2">{z.description}</p>

                  <div className="mt-3 pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[10px] font-mono">
                    <span className="text-[var(--text-muted)]">
                      Affected: <strong className="text-[var(--text-primary)]">{z.affectedAccountsCount} accounts</strong>
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
            <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xs dark:shadow-lg space-y-5 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--border-subtle)]">
                <div>
                  <span className="text-[10px] font-mono text-rose-600 dark:text-rose-400 font-bold uppercase">
                    Zero-Day Signature: {selectedIncident.strainId}
                  </span>
                  <h3 className="text-base font-bold text-[var(--text-primary)] mt-0.5">
                    {selectedIncident.strainName}
                  </h3>
                </div>

                <button
                  disabled={quarantinedIds.includes(selectedIncident.id)}
                  onClick={() => handleQuarantine(selectedIncident.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                    quarantinedIds.includes(selectedIncident.id)
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-500/40 cursor-default'
                      : 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-200 dark:shadow-rose-950'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  {quarantinedIds.includes(selectedIncident.id)
                    ? 'Strain Quarantined'
                    : 'Deploy Ephemeral Quarantine Rule'}
                </button>
              </div>

              {/* Behavior Breakdown */}
              <div className="p-4 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-2">
                <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">
                  Unprecedented Behavioral Artifact
                </span>
                <p className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed">
                  {selectedIncident.description}
                </p>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-[var(--text-secondary)] pt-1">
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
                <div className="p-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-sky-700 dark:text-sky-300 font-mono text-[11px] leading-relaxed">
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
    </div>
  );
};
