import React, { useState } from 'react';
import {
  Compass,
  ArrowRight,
  ShieldAlert,
  Zap,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers
} from 'lucide-react';
import { MOCK_TRANSACTIONS } from '../../data/mockFraudData';

export const NextActionPredictionView: React.FC = () => {
  const [selectedTxnId, setSelectedTxnId] = useState<string>('tx-9082');

  const selectedTxn = MOCK_TRANSACTIONS.find((t) => t.id === selectedTxnId) || MOCK_TRANSACTIONS[0];
  const prediction = selectedTxn.nextActionPrediction;

  const markovTransitions = [
    { state: 'Current State: High-Risk Transfer Initiated', probability: '100%' },
    { state: `Branch A: ${prediction.predictedAction}`, probability: `${prediction.probabilityPercent}%`, isPredicted: true },
    { state: 'Branch B: Rapid Password Reset / Email Change', probability: '12%', isPredicted: false },
    { state: 'Branch C: Session Logout & Cookie Clearing', probability: '4%', isPredicted: false },
  ];

  return (
    <div id="view-next-action-prediction" className="p-4 md:p-6 space-y-6 animate-in fade-in">
      {/* Top Banner */}
      <div className="p-4 md:p-5 rounded-2xl bg-gradient-to-r from-sky-50 via-white to-sky-50 dark:from-[#0c1836] dark:via-[#102046] dark:to-[#0d1630] border border-sky-200/70 dark:border-[#21355e] flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xs dark:shadow-xl transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-sky-100 text-sky-700 border border-sky-300 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-500/40 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              NEXT ACTION STATE PREDICTION MODEL
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">• Probabilistic Behavioral Markov Transitions</span>
          </div>
          <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white tracking-tight mt-1">
            Predicting What the Attacker Will Do Next
          </h2>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed mt-1">
            Don't just evaluate the current action. Our probabilistic transition graph models the attacker's path: <strong>Current Action → Predicted Next Action (84% Probability) → Suggested Preemptive Defense</strong>.
          </p>
        </div>

        {/* Transaction Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Case:</span>
          <select
            value={selectedTxnId}
            onChange={(e) => setSelectedTxnId(e.target.value)}
            className="bg-white border border-slate-300 text-slate-900 dark:bg-[#080e1e] dark:border-[#1e2f54] dark:text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-sky-400 font-mono"
          >
            {MOCK_TRANSACTIONS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.customer.name} ({t.transactionRef})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Prediction Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Forecast Card (6 cols) */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs dark:bg-[#0c1427] dark:border-[#1b2b4c] dark:shadow-lg space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1b2b4c]">
            <h3 className="text-xs font-mono font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              Predicted Next Behavioral Step
            </h3>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-300 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-500/40">
              {prediction.probabilityPercent}% Probability
            </span>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-sky-950/40 dark:to-indigo-950/40 border border-sky-300 dark:border-sky-500/40 space-y-2">
            <span className="text-[10px] font-mono text-sky-700 dark:text-sky-400 uppercase font-bold">Highest Likelihood Transition</span>
            <p className="text-base font-bold text-slate-900 dark:text-white font-mono">
              {prediction.predictedAction}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Based on historical sequence traces across 12,000 compromise sessions, attackers exhibiting this specific hesitation cadence follow with high-velocity supplementary transfers within 90 seconds.
            </p>
          </div>

          {/* Markov State Transition Probabilities */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">
              Markov Transition Distribution
            </h4>
            {markovTransitions.map((tr, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border flex items-center justify-between text-xs font-mono ${
                  tr.isPredicted
                    ? 'bg-sky-50 border-sky-400 text-slate-900 dark:bg-[#142347] dark:text-white font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-600 dark:bg-[#091122] dark:border-[#1a2846] dark:text-slate-300'
                }`}
              >
                <span>{tr.state}</span>
                <span className={tr.isPredicted ? 'text-sky-700 dark:text-sky-300' : 'text-slate-500 dark:text-slate-400'}>{tr.probability}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Preemptive Defense & Action (6 cols) */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs dark:bg-[#0c1427] dark:border-[#1b2b4c] dark:shadow-lg space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1b2b4c]">
              <h3 className="text-xs font-mono font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <ShieldAlert className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                Preemptive Defensive Interception
              </h3>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">Proactive Armor</span>
            </div>

            <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-500/40 text-xs space-y-2">
              <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 uppercase font-bold">Automated Defensive Recommendation</span>
              <p className="text-slate-900 dark:text-white font-bold text-sm">
                {prediction.preemptiveInterventionSuggested}
              </p>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                By arming the challenge <em>before</em> the attacker initiates the secondary transfer, we collapse the attack window to zero and preserve 100% of remaining account liquidity.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-[#1b2b4c] flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Target Profile: <strong className="text-slate-900 dark:text-white">{selectedTxn.customer.name}</strong>
            </span>
            <button
              onClick={() => alert(`Preemptive challenge armed for ${selectedTxn.customer.name}`)}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-all font-mono"
            >
              Arm Preemptive Defense Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
