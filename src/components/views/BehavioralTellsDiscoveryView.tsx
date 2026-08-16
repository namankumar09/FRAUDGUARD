import React, { useState } from 'react';
import {
  Sparkles,
  ShieldAlert,
  Search,
  CheckCircle2,
  TrendingUp,
  Brain,
  Filter,
  ArrowRight,
  Layers,
  Info
} from 'lucide-react';
import { MOCK_TELLS } from '../../data/mockFraudData';
import { FraudTell } from '../../types/fraud';

export const BehavioralTellsDiscoveryView: React.FC = () => {
  const [tells, setTells] = useState<FraudTell[]>(MOCK_TELLS);
  const [selectedTell, setSelectedTell] = useState<FraudTell>(MOCK_TELLS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredTells = tells.filter((tell) => {
    const matchesCategory = filterCategory === 'all' || tell.category === filterCategory;
    const matchesQuery =
      tell.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tell.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tell.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div id="view-behavioral-tells" className="p-4 md:p-6 space-y-6 animate-in fade-in">
      {/* Top Banner */}
      <div className="p-4 md:p-5 rounded-2xl bg-gradient-to-r from-sky-50 via-white to-sky-50 dark:from-[#0c1836] dark:via-[#102046] dark:to-[#0d1630] border border-sky-200/70 dark:border-[#21355e] flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xs dark:shadow-xl transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-sky-100 text-sky-700 border border-sky-300 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-500/40 flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5" />
              AUTOMATED BEHAVIORAL "TELLS" DISCOVERY (DIGITAL LIE DETECTOR)
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">• Unsupervised Correlation Multipliers</span>
          </div>
          <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white tracking-tight mt-1">
            Discovering Subtle Micro-Tells Correlated with Fraudulent Intent
          </h2>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed mt-1">
            Like a poker player having a physical tell, fraudsters exhibit subconscious digital micro-behaviors: <strong>checking balance 3 times before payment (4.2x risk)</strong>, rapidly hovering between cancel and confirm, or zero hesitation on 16-digit card numbers.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200 dark:bg-[#091122] dark:border-[#1b2b4c]">
            <span className="text-[10px] text-slate-500 dark:text-slate-400">Discovered Tells:</span>
            <p className="text-base font-bold text-sky-700 dark:text-sky-300">{tells.length} Active</p>
          </div>
          <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 dark:bg-[#091122] dark:border-[#1b2b4c]">
            <span className="text-[10px] text-slate-500 dark:text-slate-400">Top Multiplier:</span>
            <p className="text-base font-bold text-rose-600 dark:text-rose-400">6.2x</p>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Discovered Tells List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Filter & Search */}
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 dark:bg-[#0c1427] dark:border-[#1b2b4c] space-y-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search tells (e.g. FD-047, rehearsal, balance)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-300 text-slate-900 placeholder-slate-400 rounded-xl pl-8 pr-3 py-2 text-xs focus:outline-none focus:border-sky-400 dark:bg-[#080e1e] dark:border-[#1e2f54] dark:text-white dark:placeholder-slate-500"
              />
            </div>

            <div className="flex gap-1.5 overflow-x-auto text-xs">
              {['all', 'cognitive', 'rehearsal', 'biometric', 'device'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg font-mono text-[11px] capitalize whitespace-nowrap transition-all ${
                    filterCategory === cat
                      ? 'bg-sky-100 text-sky-700 border border-sky-300 dark:bg-sky-500/20 dark:text-sky-300 dark:border-sky-500/40 font-bold'
                      : 'bg-slate-50 text-slate-500 hover:text-slate-900 border-slate-200 dark:bg-[#091122] dark:text-slate-400 dark:hover:text-white dark:border-[#1a2846]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Tells Cards */}
          <div className="space-y-3 max-h-[580px] overflow-y-auto custom-scrollbar pr-1">
            {filteredTells.map((tell) => {
              const isSelected = selectedTell?.id === tell.id;
              return (
                <div
                  key={tell.id}
                  onClick={() => setSelectedTell(tell)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-sky-50 border-sky-400 shadow-md ring-1 ring-sky-400/20 dark:bg-[#121f3d] dark:border-sky-400/60 dark:shadow-lg dark:shadow-sky-950/40 dark:ring-sky-400/30'
                      : 'bg-white border-slate-200 hover:bg-slate-50 dark:bg-[#0c1427] dark:border-[#1b2b4c] dark:hover:bg-[#0f1a35]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200 dark:text-sky-300 dark:bg-[#14203a] dark:border-[#203358]">
                        {tell.code}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{tell.name}</h4>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-100 text-rose-700 border border-rose-300 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-500/40">
                      {tell.correlationRiskMultiplier}x Multiplier
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                    {tell.description}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-[#1a2846] flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400">
                    <span>Confidence: <strong className="text-slate-900 dark:text-white">{tell.confidencePercent}%</strong></span>
                    <span>Observed in <strong className="text-slate-700 dark:text-slate-200">{tell.frequencyObserved}</strong> txns</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Tell Deep Analysis & Mathematical Weighting (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {selectedTell && (
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs dark:bg-[#0c1427] dark:border-[#1b2b4c] dark:shadow-lg space-y-5">
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-[#1b2b4c]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-700 text-[11px] font-mono font-bold border border-sky-300 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-500/40">
                      {selectedTell.code}
                    </span>
                    <span className="capitalize text-xs font-mono text-slate-500 dark:text-slate-400">
                      Category: {selectedTell.category}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                    {selectedTell.name}
                  </h3>
                </div>

                <span className="px-3 py-1 rounded-xl bg-gradient-to-r from-rose-100 to-purple-100 border border-rose-300 text-rose-700 dark:from-rose-950 dark:to-purple-950 dark:border-rose-500/50 dark:text-rose-300 font-mono text-xs font-bold">
                  {selectedTell.correlationRiskMultiplier}x Fraud Risk Multiplier
                </span>
              </div>

              {/* Description & Mechanics */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300 uppercase">
                  Subconscious Behavioral Mechanic
                </h4>
                <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed bg-slate-50 border border-slate-200 p-3.5 rounded-xl dark:bg-[#091122] dark:border-[#1a2846]">
                  {selectedTell.description}
                </p>
              </div>

              {/* Key Trigger Metric */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 dark:bg-[#080e1e] dark:border-[#1e2f54] space-y-1">
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase">Deterministic Signal Trigger Formula</span>
                <p className="text-xs font-mono text-amber-700 dark:text-amber-300 font-semibold">
                  {selectedTell.triggerMetric}
                </p>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 dark:bg-[#080e1e] dark:border-[#192642]">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Risk Multiplier</span>
                  <p className="text-lg font-bold text-rose-600 dark:text-rose-400 mt-0.5">{selectedTell.correlationRiskMultiplier}x</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 dark:bg-[#080e1e] dark:border-[#192642]">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Confidence</span>
                  <p className="text-lg font-bold text-sky-700 dark:text-sky-300 mt-0.5">{selectedTell.confidencePercent}%</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 dark:bg-[#080e1e] dark:border-[#192642]">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Historical Samples</span>
                  <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">{selectedTell.frequencyObserved}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 dark:bg-[#080e1e] dark:border-[#192642]">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">First Discovered</span>
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-300 mt-1">{selectedTell.firstDiscoveredDate}</p>
                </div>
              </div>

              {/* Explainability Sample */}
              <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-800 dark:bg-purple-950/20 dark:border-purple-500/30 dark:text-purple-200 text-xs leading-relaxed">
                <strong>Why this is a Digital Tell:</strong> When an unauthorized operator gains control of a banking session, their attention is divided between executing the drain script and avoiding detection. This cognitive load produces measurable timing aberrations (e.g. hesitation drops to near-zero for automated inputs while navigational hesitation spikes).
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
