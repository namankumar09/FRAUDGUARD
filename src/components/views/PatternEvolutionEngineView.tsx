import React, { useState } from 'react';
import {
  TrendingUp,
  GitBranch,
  Layers,
  ArrowRight,
  ShieldAlert,
  Clock,
  Sparkles,
  Zap,
  Info
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export const PatternEvolutionEngineView: React.FC = () => {
  const [activeWeek, setActiveWeek] = useState<number>(4);

  const weeklyTrendData = [
    { week: 'Week 1', strainA: 120, strainB: 10, strainC: 0, strainD: 0 },
    { week: 'Week 2', strainA: 145, strainB: 65, strainC: 5, strainD: 0 },
    { week: 'Week 3', strainA: 90, strainB: 180, strainC: 110, strainD: 15 },
    { week: 'Week 4 (Current)', strainA: 35, strainB: 120, strainC: 240, strainD: 195 },
  ];

  const evolutionaryStages = [
    {
      week: 1,
      name: 'Stage 1: Direct Clipboard Injection (Strain Alpha)',
      description: 'Attackers pasted stolen card and PAN credentials directly with standard 0.4s dwell time.',
      countermeasure: 'Rule FD-001 deployed: Trigger challenge on clipboard paste under 800ms.',
      evasionTactic: 'Attackers recognized paste blocks and introduced synthetic keystroke replay software.',
      riskVolume: '₹4.2 Lakhs',
      color: '#38bdf8',
    },
    {
      week: 2,
      name: 'Stage 2: Synthetic Keystroke Replay (Strain Beta)',
      description: 'Replaced paste with simulated keystrokes, but with fixed 15ms flight intervals.',
      countermeasure: 'Model FD-044 deployed: Uncovered robotic zero-variance flight times (variance < 4ms).',
      evasionTactic: 'Attackers added artificial Gaussian jitter and random backspace deletions.',
      riskVolume: '₹8.9 Lakhs',
      color: '#a78bfa',
    },
    {
      week: 3,
      name: 'Stage 3: Jittered Rehearsal Sequences (Strain Gamma)',
      description: 'Attackers added 2-3 practice cancellations and simulated human mouse drift.',
      countermeasure: 'Model FD-078 deployed: Flagged 3 practice aborts in 10 minutes as Rehearsal Loop.',
      evasionTactic: 'Attackers migrated to multi-account synchronized doppelgänger clusters.',
      riskVolume: '₹14.6 Lakhs',
      color: '#f472b6',
    },
    {
      week: 4,
      name: 'Stage 4: Cross-Account Polymorphic Echo (Strain Delta)',
      description: 'Coordinated 50+ dormant accounts executing staggered micro-transactions across rotating subnets.',
      countermeasure: 'Engine FD-112 deployed: Cross-customer echo graph & unsupervised zero-day radar.',
      evasionTactic: 'Continuous AI arms race with automated Red-Team synthetic evasion generation.',
      riskVolume: '₹22.1 Lakhs',
      color: '#fb7185',
    },
  ];

  return (
    <div id="view-pattern-evolution" className="p-4 md:p-6 space-y-6 animate-in fade-in">
      {/* Top Banner */}
      <div className="p-4 md:p-5 rounded-2xl bg-gradient-to-r from-purple-50 via-white to-purple-50 dark:from-[#0c1836] dark:via-[#102046] dark:to-[#0d1630] border border-purple-200/70 dark:border-[#21355e] flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xs dark:shadow-xl transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-purple-100 text-purple-700 border border-purple-300 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-500/40 flex items-center gap-1.5">
              <GitBranch className="w-3.5 h-3.5" />
              FRAUD PATTERN EVOLUTION ENGINE
            </span>
            <span className="text-xs text-[var(--text-muted)] font-mono">• 4-Week Evolutionary Mutation Tracking</span>
          </div>
          <h2 className="text-lg md:text-xl font-bold text-[var(--text-primary)] tracking-tight mt-1">
            Tracking How Attack Strategies Branch & Mutate Over Time
          </h2>
          <p className="text-xs md:text-sm text-[var(--text-secondary)] max-w-3xl leading-relaxed mt-1">
            Fraud does not stay constant. As soon as a defensive rule is deployed, attackers mutate their cadence: <strong>Week 1 (Paste) → Week 2 (Replay) → Week 3 (Jitter Rehearsal) → Week 4 (Polymorphic Echo)</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 dark:bg-[#091122] dark:border-[#1b2b4c] dark:text-purple-300">
            🧬 4 Active Strains Mapped
          </span>
        </div>
      </div>

      {/* Evolutionary Chart */}
      <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xs dark:shadow-lg space-y-4 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-mono font-bold text-[var(--text-primary)] uppercase tracking-wider">
              Evolutionary Strain Replacement Longitudinal Chart
            </h3>
            <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
              As older strains are intercepted by behavioral filters, mutated successor strains emerge.
            </p>
          </div>
          <span className="text-[10px] font-mono text-slate-600 bg-slate-100 border-slate-300 dark:text-slate-400 dark:bg-[#121f3d] dark:border-[#1f3054] px-2 py-1 rounded border">
            Weekly Aggregates
          </span>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="gradB" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#a78bfa" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="gradC" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f472b6" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#f472b6" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="gradD" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fb7185" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#fb7185" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="week" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ backgroundColor: '#091122', borderColor: '#22355b', borderRadius: '8px', fontSize: '11px' }} />
              <Area type="monotone" dataKey="strainA" stackId="1" stroke="#38bdf8" fill="url(#gradA)" name="Strain Alpha (Direct Paste)" />
              <Area type="monotone" dataKey="strainB" stackId="1" stroke="#a78bfa" fill="url(#gradB)" name="Strain Beta (Synthetic Replay)" />
              <Area type="monotone" dataKey="strainC" stackId="1" stroke="#f472b6" fill="url(#gradC)" name="Strain Gamma (Jitter Rehearsal)" />
              <Area type="monotone" dataKey="strainD" stackId="1" stroke="#fb7185" fill="url(#gradD)" name="Strain Delta (Polymorphic Echo)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Evolutionary Stages Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {evolutionaryStages.map((stage) => {
          const isSelected = activeWeek === stage.week;
          return (
            <div
              key={stage.week}
              onClick={() => setActiveWeek(stage.week)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-sky-50 border-sky-400 shadow-md ring-1 ring-sky-400/30 dark:bg-[#121f3d] dark:shadow-xl'
                  : 'bg-[var(--bg-card)] border-[var(--border-color)] hover:bg-[var(--bg-hover)]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
                  <span className="font-mono font-bold text-xs" style={{ color: stage.color }}>
                    Week {stage.week}
                  </span>
                  <span className="text-[10px] font-mono text-[var(--text-muted)]">{stage.riskVolume} intercepted</span>
                </div>

                <h4 className="text-xs font-bold text-[var(--text-primary)] mt-2 leading-snug">{stage.name}</h4>
                <p className="text-[11px] text-[var(--text-secondary)] mt-2 leading-relaxed">{stage.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] space-y-2 text-[10px] font-mono">
                <div className="p-2 rounded bg-emerald-50 text-emerald-700 dark:bg-[#091122] dark:text-emerald-300">
                  <strong>Defensive Counter:</strong> {stage.countermeasure}
                </div>
                <div className="p-2 rounded bg-rose-50 text-rose-700 dark:bg-[#1f1224] dark:text-rose-300">
                  <strong>Attacker Reaction:</strong> {stage.evasionTactic}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
