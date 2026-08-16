import React, { useState } from 'react';
import {
  Scale,
  Sliders,
  TrendingDown,
  ShieldAlert,
  ShieldCheck,
  Zap,
  Users,
  ArrowRight,
  AlertTriangle,
  Play,
  RotateCcw
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export const CounterfactualSimulatorView: React.FC = () => {
  // Simulator Parameters
  const [transferAmount, setTransferAmount] = useState<number>(345000);
  const [decisionPolicy, setDecisionPolicy] = useState<'hard_block' | 'step_up_video' | 'cooling_period' | 'silent_allow'>('step_up_video');
  const [attackerSkillLevel, setAttackerSkillLevel] = useState<'novice' | 'intermediate' | 'advanced_syndicate'>('advanced_syndicate');

  // Calculations based on simulation variables
  const calculateOutcomes = () => {
    let lossExposure = 0;
    let customerFriction = 0;
    let riskReduction = 0;
    let contagionAccounts = 0;

    const multiplier = attackerSkillLevel === 'advanced_syndicate' ? 2.8 : attackerSkillLevel === 'intermediate' ? 1.5 : 1.0;

    switch (decisionPolicy) {
      case 'silent_allow':
        lossExposure = transferAmount * multiplier;
        customerFriction = 0;
        riskReduction = 0;
        contagionAccounts = Math.round(3 * multiplier);
        break;
      case 'cooling_period':
        lossExposure = Math.round(transferAmount * 0.08);
        customerFriction = 24;
        riskReduction = 92;
        contagionAccounts = 0;
        break;
      case 'step_up_video':
        lossExposure = 0;
        customerFriction = 12;
        riskReduction = 98;
        contagionAccounts = 0;
        break;
      case 'hard_block':
        lossExposure = 0;
        customerFriction = 68;
        riskReduction = 100;
        contagionAccounts = 0;
        break;
    }

    return { lossExposure, customerFriction, riskReduction, contagionAccounts };
  };

  const outcomes = calculateOutcomes();

  const comparisonData = [
    {
      policy: 'Silent Allow (No Action)',
      LossExposure: transferAmount * (attackerSkillLevel === 'advanced_syndicate' ? 2.8 : 1.5),
      FrictionIndex: 0,
      RiskReduction: 0,
    },
    {
      policy: '15-Min Cooling Window',
      LossExposure: Math.round(transferAmount * 0.08),
      FrictionIndex: 24,
      RiskReduction: 92,
    },
    {
      policy: 'Biometric Step-Up Challenge',
      LossExposure: 0,
      FrictionIndex: 12,
      RiskReduction: 98,
    },
    {
      policy: 'Hard Block & Freeze',
      LossExposure: 0,
      FrictionIndex: 68,
      RiskReduction: 100,
    },
  ];

  return (
    <div id="view-counterfactual-sim" className="p-4 md:p-6 space-y-6 animate-in fade-in">
      {/* Top Banner */}
      <div className="p-4 md:p-5 rounded-2xl bg-gradient-to-r from-indigo-50 via-white to-indigo-50 dark:from-[#0c1836] dark:via-[#102046] dark:to-[#0d1630] border border-indigo-200/70 dark:border-[#21355e] flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xs dark:shadow-xl transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-100 text-indigo-700 border border-indigo-300 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-500/40 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5" />
              COUNTERFACTUAL FRAUD SIMULATOR ("WHAT-IF" ENGINE)
            </span>
            <span className="text-xs text-[var(--text-muted)] font-mono">• Alternative Branch Modeling</span>
          </div>
          <h2 className="text-lg md:text-xl font-bold text-[var(--text-primary)] tracking-tight mt-1">
            Simulating Downstream Financial & Friction Impacts of Decision Branches
          </h2>
          <p className="text-xs md:text-sm text-[var(--text-secondary)] max-w-3xl leading-relaxed mt-1">
            Evaluate: <em>"What would have happened if we didn't block this transaction?"</em> vs <em>"What if we triggered a 15-minute cooling window instead of a hard block?"</em>
          </p>
        </div>

        <button
          onClick={() => {
            setTransferAmount(345000);
            setDecisionPolicy('step_up_video');
            setAttackerSkillLevel('advanced_syndicate');
          }}
          className="p-2.5 rounded-xl bg-[var(--bg-subtle)] hover:bg-[var(--bg-hover)] border border-[var(--border-color)] text-[var(--text-secondary)] text-xs font-mono flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset Parameters
        </button>
      </div>

      {/* Main Grid: Controls (Left) & Simulation Visualizer (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Simulation Controls (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xs dark:shadow-lg space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
            <h3 className="text-xs font-mono font-bold text-[var(--text-primary)] uppercase tracking-wider">
              Simulation Configuration
            </h3>
            <span className="text-[10px] font-mono text-sky-600 dark:text-sky-400">Live Recalculation</span>
          </div>

          {/* Slider: Transaction Amount */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[var(--text-muted)]">Transaction Under Test:</span>
              <span className="text-[var(--text-primary)] font-bold">₹{transferAmount.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min={25000}
              max={1500000}
              step={25000}
              value={transferAmount}
              onChange={(e) => setTransferAmount(parseInt(e.target.value))}
              className="w-full accent-sky-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-[var(--text-muted)]">
              <span>₹25,000</span>
              <span>₹7,50,000</span>
              <span>₹15,00,000</span>
            </div>
          </div>

          {/* Decision Branch Policy Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-mono text-[var(--text-muted)] uppercase">
              Tested Intervention Policy
            </label>
            <div className="grid grid-cols-1 gap-2">
              {[
                { id: 'silent_allow', title: '1. Silent Allow (Do Nothing)', desc: 'Full immediate settlement without challenge' },
                { id: 'cooling_period', title: '2. 15-Minute Cooling Hold', desc: 'Hold outbound payout while alerting genuine owner' },
                { id: 'step_up_video', title: '3. Biometric Step-Up Challenge', desc: 'Prompt for instant 3D face / voice biometric verification' },
                { id: 'hard_block', title: '4. Hard Block & Account Freeze', desc: 'Immediate session termination and manual desk review' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setDecisionPolicy(p.id as any)}
                  className={`p-3 rounded-xl border text-left transition-all text-xs ${
                    decisionPolicy === p.id
                      ? 'bg-sky-50 border-sky-400 ring-1 ring-sky-400/20 text-[var(--text-primary)] dark:bg-[#152344] dark:ring-sky-400/40'
                      : 'bg-[var(--bg-subtle)] border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
                  }`}
                >
                  <p className="font-bold text-[var(--text-primary)]">{p.title}</p>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5">{p.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Attacker Skill Level */}
          <div className="space-y-2">
            <label className="block text-xs font-mono text-[var(--text-muted)] uppercase">
              Attacker Sophistication Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'novice', label: 'Novice' },
                { id: 'intermediate', label: 'Intermediate' },
                { id: 'advanced_syndicate', label: 'Syndicate' },
              ].map((level) => (
                <button
                  key={level.id}
                  onClick={() => setAttackerSkillLevel(level.id as any)}
                  className={`py-2 rounded-lg text-xs font-mono transition-all border ${
                    attackerSkillLevel === level.id
                      ? 'bg-purple-100 text-purple-700 border-purple-400 font-bold dark:bg-purple-950 dark:text-purple-300 dark:border-purple-500'
                      : 'bg-[var(--bg-subtle)] text-[var(--text-muted)] border-[var(--border-color)]'
                  }`}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Counterfactual Outcomes & Comparison (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Outcome Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xs dark:shadow-lg">
              <span className="text-[10px] font-mono text-[var(--text-muted)] block">Downstream Loss</span>
              <p className={`text-base font-bold font-mono mt-1 ${outcomes.lossExposure > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                ₹{outcomes.lossExposure.toLocaleString('en-IN')}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xs dark:shadow-lg">
              <span className="text-[10px] font-mono text-[var(--text-muted)] block">Customer Friction</span>
              <p className={`text-base font-bold font-mono mt-1 ${outcomes.customerFriction > 40 ? 'text-amber-600 dark:text-amber-400' : 'text-sky-600 dark:text-sky-300'}`}>
                {outcomes.customerFriction}% Index
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xs dark:shadow-lg">
              <span className="text-[10px] font-mono text-[var(--text-muted)] block">Risk Reduction</span>
              <p className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                +{outcomes.riskReduction}%
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xs dark:shadow-lg">
              <span className="text-[10px] font-mono text-[var(--text-muted)] block">Contagion Drains</span>
              <p className="text-base font-bold font-mono text-purple-600 dark:text-purple-300 mt-1">
                {outcomes.contagionAccounts} Accounts
              </p>
            </div>
          </div>

          {/* Comparative Exposure Bar Chart */}
          <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xs dark:shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold text-[var(--text-primary)] uppercase tracking-wider">
                Policy Comparison: Downstream Loss vs Customer Friction
              </h3>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <XAxis dataKey="policy" stroke="#64748b" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#091122', borderColor: '#22355b', borderRadius: '8px', fontSize: '11px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Bar dataKey="LossExposure" fill="#fda4af" name="Financial Loss Exposure (₹)" />
                  <Bar dataKey="FrictionIndex" fill="#7dd3fc" name="Friction Score (0-100)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recommendation Note */}
          <div className="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-xs text-[var(--text-secondary)] space-y-1.5">
            <div className="flex items-center gap-2 text-sky-700 dark:text-sky-300 font-bold font-mono">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Optimal Policy Recommendation: Biometric Step-Up Challenge</span>
            </div>
            <p className="text-[11px] leading-relaxed text-[var(--text-secondary)]">
              Selecting <strong>Biometric Step-Up</strong> delivers a <strong>98% risk reduction</strong> with zero downstream fraud leakage while keeping customer friction to only <strong>12%</strong> (vs 68% for hard blocking).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
