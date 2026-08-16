import React, { useState } from 'react';
import {
  Dna,
  User,
  Sliders,
  TrendingDown,
  Activity,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
import { MOCK_TRANSACTIONS } from '../../data/mockFraudData';

export const BehavioralDnaMutationView: React.FC = () => {
  const [selectedTxnId, setSelectedTxnId] = useState<string>('tx-9082');
  const [mutationDriftMultiplier, setMutationDriftMultiplier] = useState<number>(1);

  const selectedTxn = MOCK_TRANSACTIONS.find((t) => t.id === selectedTxnId) || MOCK_TRANSACTIONS[0];
  const dnaComparison = selectedTxn.dnaMutation;

  const adjustedMutationScore = Math.min(100, Math.round(dnaComparison.overallMutationPercent * mutationDriftMultiplier));

  const radarData = [
    {
      metric: 'Typing Rhythm',
      BaselineDNA: dnaComparison.ownerBaselineDna.typingRhythmScore,
      CurrentDNA: Math.max(5, dnaComparison.currentSessionDna.typingRhythmScore * (2 - mutationDriftMultiplier)),
    },
    {
      metric: 'Decision Hesitation',
      BaselineDNA: Math.min(100, dnaComparison.ownerBaselineDna.averageHesitationSec * 25),
      CurrentDNA: Math.min(100, dnaComparison.currentSessionDna.averageHesitationSec * 25 * mutationDriftMultiplier),
    },
    {
      metric: 'Sequence Regularity',
      BaselineDNA: dnaComparison.ownerBaselineDna.transactionSequencePredictability,
      CurrentDNA: Math.max(10, dnaComparison.currentSessionDna.transactionSequencePredictability / mutationDriftMultiplier),
    },
    {
      metric: 'Manual Input Cadence',
      BaselineDNA: 100 - dnaComparison.ownerBaselineDna.clipboardPasteAffinity,
      CurrentDNA: Math.max(5, (100 - dnaComparison.currentSessionDna.clipboardPasteAffinity) / mutationDriftMultiplier),
    },
    {
      metric: 'Trajectory Smoothness',
      BaselineDNA: 100 - dnaComparison.ownerBaselineDna.rehearsalTendency,
      CurrentDNA: Math.max(5, (100 - dnaComparison.currentSessionDna.rehearsalTendency) / mutationDriftMultiplier),
    },
  ];

  return (
    <div id="view-dna-mutation" className="p-4 md:p-6 space-y-6 animate-in fade-in">
      {/* Top Banner */}
      <div className="p-4 md:p-5 rounded-2xl bg-gradient-to-r from-purple-50 via-white to-purple-50 dark:from-[#0c1836] dark:via-[#102046] dark:to-[#0d1630] border border-purple-200/70 dark:border-[#21355e] flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xs dark:shadow-xl transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-purple-950 text-purple-300 border border-purple-500/40 flex items-center gap-1.5">
              <Dna className="w-3.5 h-3.5" />
              LIVING BEHAVIORAL DNA MUTATION ENGINE
            </span>
            <span className="text-xs text-slate-400 font-mono">• Continuous Adaptive Baseline</span>
          </div>
          <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white tracking-tight mt-1">
            Detecting How a Person's Behavior Evolves Over Time
          </h2>
          <p className="text-xs md:text-sm text-slate-300 max-w-3xl leading-relaxed mt-1">
            Rather than creating a static snapshot, we model a <strong>living behavioral DNA</strong>. In every session: Old DNA → New behavior → Difference → Risk. This detects gradual drift, sudden credential takeover, and subtle impersonation.
          </p>
        </div>

        {/* Customer Profile Picker */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">Profile:</span>
          <select
            value={selectedTxnId}
            onChange={(e) => setSelectedTxnId(e.target.value)}
            className="bg-white border border-slate-300 text-slate-900 dark:bg-[#080e1e] dark:border-[#1e2f54] dark:text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-sky-400 font-mono"
          >
            {MOCK_TRANSACTIONS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.customer.name} ({t.dnaMutation.overallMutationPercent}% Mutation)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* DNA Mutation Score Callout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs dark:bg-[#0c1427] dark:border-[#1b2b4c] dark:shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">Overall DNA Mutation Drift</span>
            <Dna className="w-4 h-4 text-purple-400" />
          </div>
          <div className="my-2">
            <p className="text-3xl font-bold text-purple-300 font-mono">
              🧬 {adjustedMutationScore}%
            </p>
            <span className="text-[11px] text-rose-400 font-semibold">
              {adjustedMutationScore > 60 ? 'Severe Biometric Mutation Detected' : 'Normal Variance Threshold'}
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-[#070d1e] h-2.5 rounded-full overflow-hidden border border-slate-200 dark:border-[#192642]">
            <div
              className={`h-full rounded-full ${
                adjustedMutationScore > 60 ? 'bg-gradient-to-r from-purple-500 to-rose-500' : 'bg-emerald-400'
              }`}
              style={{ width: `${adjustedMutationScore}%` }}
            />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs dark:bg-[#0c1427] dark:border-[#1b2b4c] dark:shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">Navigation Style Shift</span>
            <Activity className="w-4 h-4 text-sky-400" />
          </div>
          <div className="my-2 space-y-1">
            <p className="text-xs text-slate-400">
              Historical: <strong className="text-emerald-400 uppercase font-mono">{dnaComparison.ownerBaselineDna.navigationStyle}</strong>
            </p>
            <p className="text-xs text-slate-400">
              Current Session: <strong className="text-rose-400 uppercase font-mono">{dnaComparison.currentSessionDna.navigationStyle}</strong>
            </p>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            Navigation Trajectory Entropy: <strong className="text-sky-300">0.89 (Fragmented)</strong>
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs dark:bg-[#0c1427] dark:border-[#1b2b4c] dark:shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">Hesitation Latency Drift</span>
            <Sliders className="w-4 h-4 text-amber-400" />
          </div>
          <div className="my-2 space-y-1 font-mono">
            <p className="text-xs text-slate-400">
              Baseline: <strong className="text-emerald-400">{dnaComparison.ownerBaselineDna.averageHesitationSec}s</strong>
            </p>
            <p className="text-xs text-slate-400">
              Current: <strong className="text-rose-400">{dnaComparison.currentSessionDna.averageHesitationSec}s</strong>
            </p>
          </div>
          <span className="text-[10px] text-amber-400 font-mono">
            89% reduction in contemplation latency
          </span>
        </div>
      </div>

      {/* Main Comparison: Radar Chart & Divergences */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Radar Chart (6 cols) */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs dark:bg-[#0c1427] dark:border-[#1b2b4c] dark:shadow-lg flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Living DNA Biometric Polygon
            </h3>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Historical Owner DNA
              </span>
              <span className="flex items-center gap-1.5 text-rose-400">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400" /> Current Session DNA
              </span>
            </div>
          </div>

          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#1e2f52" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#334155" />
                <Radar name="BaselineDNA" dataKey="BaselineDNA" stroke="#34d399" fill="#34d399" fillOpacity={0.25} />
                <Radar name="CurrentDNA" dataKey="CurrentDNA" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Interactive Drift Simulation Slider */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 dark:bg-[#080e1e] dark:border-[#1a2846] space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Simulate Attacker Mutation Variance:</span>
              <span className="text-sky-300 font-bold">{mutationDriftMultiplier.toFixed(1)}x Drift</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={mutationDriftMultiplier}
              onChange={(e) => setMutationDriftMultiplier(parseFloat(e.target.value))}
              className="w-full accent-sky-400 cursor-pointer"
            />
          </div>
        </div>

        {/* Divergences Table & Living Gene Profile (6 cols) */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs dark:bg-[#0c1427] dark:border-[#1b2b4c] dark:shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Gene-by-Gene Mutation Matrix
            </h3>
            <span className="text-[10px] font-mono text-purple-300 bg-purple-950 px-2 py-0.5 rounded border border-purple-500/40">
              5 Key Divergences Flagged
            </span>
          </div>

          <div className="space-y-2.5">
            {dnaComparison.keyDivergences.map((div, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 dark:bg-[#091122] dark:border-[#1c2c4d] space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900 dark:text-white">{div.metric}</span>
                  <span className="font-mono text-rose-400 font-bold text-xs">
                    +{Math.round(div.deviation * mutationDriftMultiplier)}% Mutation
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-1">
                  <div className="p-1.5 rounded bg-slate-50 text-slate-600 dark:bg-[#0f1a35] dark:text-slate-300">
                    <span className="text-slate-500 text-[10px] block">Historical Baseline</span>
                    <strong className="text-emerald-400">{div.historical}</strong>
                  </div>
                  <div className="p-1.5 rounded bg-slate-50 text-slate-600 dark:bg-[#1f162b] dark:text-slate-300">
                    <span className="text-slate-500 text-[10px] block">Observed Session</span>
                    <strong className="text-rose-400">{div.current}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/30 text-xs text-purple-200 leading-relaxed">
            <strong>DNA Model Verdict:</strong> Customer {selectedTxn.customer.name}'s current session exhibits an irreconcilable <strong>{adjustedMutationScore}% mutation</strong> in hesitation and typing mechanics. The account is either actively compromised or being operated under severe external script assistance.
          </div>
        </div>
      </div>
    </div>
  );
};
