import React, { useState } from 'react';
import {
  Compass,
  Orbit,
  TrendingDown,
  ShieldAlert,
  Sliders,
  Layers,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const FraudGravityEngineView: React.FC = () => {
  const [deviceRisk, setDeviceRisk] = useState<number>(85);
  const [biometricRisk, setBiometricRisk] = useState<number>(78);
  const [sequenceRisk, setSequenceRisk] = useState<number>(90);
  const [velocityRisk, setVelocityRisk] = useState<number>(65);

  const calculateTotalGravity = () => {
    return Math.min(100, Math.round((deviceRisk * 0.25) + (biometricRisk * 0.35) + (sequenceRisk * 0.25) + (velocityRisk * 0.15)));
  };

  const gravityScore = calculateTotalGravity();

  return (
    <div id="view-fraud-gravity" className="p-4 md:p-6 space-y-6 animate-in fade-in">
      {/* Top Banner */}
      <div className="p-4 md:p-5 rounded-2xl bg-gradient-to-r from-purple-50 via-white to-purple-50 dark:from-[#0c1836] dark:via-[#102046] dark:to-[#0d1630] border border-purple-200/70 dark:border-[#21355e] flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xs dark:shadow-xl transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-purple-100 text-purple-700 border border-purple-300 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-500/40 flex items-center gap-1.5">
              <Orbit className="w-3.5 h-3.5" />
              FRAUD GRAVITY VISUAL DECISION MODEL
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">• Multi-Vector Gravitational Pull</span>
          </div>
          <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white tracking-tight mt-1">
            Visualizing the Gravitational Pull of Independent Risk Signals
          </h2>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed mt-1">
            Instead of a static checklist, risk signals act as <strong>gravitational attractors</strong> pulling the session toward the "Fraud Event Horizon". When cumulative gravity exceeds escape velocity, proactive intervention triggers.
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-purple-50 border border-purple-200 dark:bg-[#091122] dark:border-[#1b2b4c] text-center font-mono">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Aggregate Inward Pull</span>
          <p className="text-2xl font-bold text-purple-700 dark:text-purple-300 mt-0.5">{gravityScore} G</p>
          <span className="text-[10px] text-rose-600 dark:text-rose-400">Event Horizon Breached</span>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Gravity Simulation Orbital Canvas (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs dark:bg-[#0c1427] dark:border-[#1b2b4c] dark:shadow-lg flex flex-col items-center justify-center relative overflow-hidden min-h-[380px]">
          {/* Orbital Rings */}
          <div className="w-72 h-72 rounded-full border border-purple-500/20 absolute flex items-center justify-center animate-spin" style={{ animationDuration: '30s' }}>
            <div className="w-4 h-4 rounded-full bg-sky-400 absolute -top-2 shadow-lg shadow-sky-500" title="Biometric Vector" />
          </div>
          <div className="w-52 h-52 rounded-full border border-rose-500/30 absolute flex items-center justify-center animate-spin" style={{ animationDuration: '20s' }}>
            <div className="w-4 h-4 rounded-full bg-rose-400 absolute -bottom-2 shadow-lg shadow-rose-500" title="Sequence Rehearsal" />
          </div>
          <div className="w-32 h-32 rounded-full border border-amber-500/40 absolute flex items-center justify-center animate-spin" style={{ animationDuration: '10s' }}>
            <div className="w-3.5 h-3.5 rounded-full bg-amber-400 absolute -left-2 shadow-lg shadow-amber-500" title="Device Collision" />
          </div>

          {/* Central Black Hole (Fraud Event Horizon) */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-900 via-rose-950 to-black border-2 border-rose-500/80 shadow-2xl shadow-rose-950 flex flex-col items-center justify-center text-center p-2 z-10">
            <span className="text-[9px] font-mono text-rose-300 font-bold">EVENT HORIZON</span>
            <span className="text-xs font-bold text-white font-mono">{gravityScore}%</span>
          </div>

          <p className="absolute bottom-3 text-slate-500 dark:text-slate-400 text-xs font-mono">
            Gravitational Vector Map: 4 Active Attractor Nodes
          </p>
        </div>

        {/* Right Column: Attractor Weighting Controls (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs dark:bg-[#0c1427] dark:border-[#1b2b4c] dark:shadow-lg space-y-4">
          <h3 className="text-xs font-mono font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Attractor Vector Mass Controls
          </h3>

          <div className="space-y-4 text-xs font-mono">
            <div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300 mb-1">
                <span>1. Biometric DNA Drift Mass (35% weight):</span>
                <span className="text-sky-700 dark:text-sky-300 font-bold">{biometricRisk} G</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={biometricRisk}
                onChange={(e) => setBiometricRisk(parseInt(e.target.value))}
                className="w-full accent-sky-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300 mb-1">
                <span>2. Precursor Rehearsal Mass (25% weight):</span>
                <span className="text-rose-700 dark:text-rose-300 font-bold">{sequenceRisk} G</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={sequenceRisk}
                onChange={(e) => setSequenceRisk(parseInt(e.target.value))}
                className="w-full accent-rose-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300 mb-1">
                <span>3. Device Collision Mass (25% weight):</span>
                <span className="text-amber-700 dark:text-amber-300 font-bold">{deviceRisk} G</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={deviceRisk}
                onChange={(e) => setDeviceRisk(parseInt(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300 mb-1">
                <span>4. Velocity Multiplier Mass (15% weight):</span>
                <span className="text-purple-700 dark:text-purple-300 font-bold">{velocityRisk} G</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={velocityRisk}
                onChange={(e) => setVelocityRisk(parseInt(e.target.value))}
                className="w-full accent-purple-400 cursor-pointer"
              />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-800 dark:bg-purple-950/20 dark:border-purple-500/30 dark:text-purple-200 text-xs leading-relaxed">
            <strong>Gravity Model Physics:</strong> Rather than simple additive thresholds, gravity models capture non-linear exponential pull. When two attractors cross 75G simultaneously, the escape probability drops to zero.
          </div>
        </div>
      </div>
    </div>
  );
};
