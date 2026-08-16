import React, { useState } from 'react';
import {
  Zap,
  Play,
  Pause,
  RotateCcw,
  Clock,
  ShieldAlert,
  CheckCircle2,
  ArrowRight,
  TrendingDown,
  Info
} from 'lucide-react';
import { MOCK_TRANSACTIONS } from '../../data/mockFraudData';

export const PrecursorDetectorView: React.FC = () => {
  const sampleTxn = MOCK_TRANSACTIONS[0]; // Vikramaditya Sharma (₹3.45L)
  const steps = sampleTxn.precursorTimeline;

  const [activeStepIndex, setActiveStepIndex] = useState(steps.length - 1);
  const [isPlaying, setIsPlaying] = useState(false);

  // Playback timer
  React.useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setActiveStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, steps.length]);

  const currentStep = steps[activeStepIndex];

  return (
    <div id="view-precursor-detector" className="p-4 md:p-6 space-y-6 animate-in fade-in transition-colors">
      {/* Banner */}
      <div className="p-4 md:p-5 rounded-2xl bg-white dark:bg-[#121721] border border-slate-200 dark:border-[#1c2638] flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              FRAUD "PRECURSOR" INTENT DETECTOR
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">• 10–30 Actions Before Transaction</span>
          </div>
          <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white tracking-tight mt-1 font-sans">
            Detecting Fraud Intent 18 Seconds Before Execution
          </h2>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed mt-1">
            Instead of detecting fraud only when the transaction button is pressed, our model evaluates the <strong>10–30 interaction steps prior to it</strong> (e.g. Login → View Balance → Open Beneficiary → Cancel → Check Limit → Paste Details → Transfer).
          </p>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-[#0c1017] p-2 rounded-xl border border-slate-200 dark:border-[#1c2638]">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
              isPlaying
                ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40'
                : 'bg-teal-600 text-white hover:bg-teal-500 dark:bg-teal-500 dark:text-slate-950 dark:hover:bg-teal-400'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isPlaying ? 'Pause Simulation' : 'Simulate Timeline'}
          </button>
          <button
            onClick={() => {
              setIsPlaying(false);
              setActiveStepIndex(0);
            }}
            className="p-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-[#182132] dark:hover:bg-[#1f2c42] text-slate-700 dark:text-slate-300"
            title="Reset to Step 1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Early Intent Warning Callout */}
      <div className="p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-950/40 border border-amber-500/40 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-600 dark:text-amber-300 font-bold shrink-0">
            ⚠️
          </div>
          <div>
            <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200 font-mono">
              Potential Fraudulent Intent Detected 18 Seconds Before Transaction
            </h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5">
              Sequence model tagged <strong>Non-Linear Rehearsal Staging & Clipboard Injection</strong> at offset <strong className="text-amber-600 dark:text-amber-400 font-mono">-18.0s</strong> (Action #5).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs shrink-0">
          <div className="p-2 rounded-xl bg-white dark:bg-[#0c1017] border border-slate-200 dark:border-[#1c2638]">
            <span className="text-[10px] text-slate-500 dark:text-slate-400">Precursor Lead Time:</span>
            <p className="text-sm font-bold text-amber-600 dark:text-amber-300">18.4 seconds</p>
          </div>
          <div className="p-2 rounded-xl bg-white dark:bg-[#0c1017] border border-slate-200 dark:border-[#1c2638]">
            <span className="text-[10px] text-slate-500 dark:text-slate-400">Sequence Risk:</span>
            <p className="text-sm font-bold text-rose-600 dark:text-rose-400">96 / 100</p>
          </div>
        </div>
      </div>

      {/* Interactive Step Timeline Scrubber */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#121721] border border-slate-200 dark:border-[#1c2638] shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Reconstructed User Micro-Action Trajectory
          </h3>
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
            Step {activeStepIndex + 1} of {steps.length}
          </span>
        </div>

        {/* Step Progression Visualizer */}
        <div className="grid grid-cols-2 md:grid-cols-7 gap-2">
          {steps.map((step, idx) => {
            const isCurrent = idx === activeStepIndex;
            const isPast = idx <= activeStepIndex;
            return (
              <button
                key={step.id}
                onClick={() => {
                  setIsPlaying(false);
                  setActiveStepIndex(idx);
                }}
                className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-teal-50 dark:bg-teal-950/50 border-teal-500 ring-2 ring-teal-500/40 shadow-xs'
                    : isPast
                    ? 'bg-slate-50 dark:bg-[#0c1017] border-slate-200 dark:border-[#1c2638] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#161f2e]'
                    : 'bg-slate-50/50 dark:bg-[#080d1a] border-slate-200 dark:border-[#16233d] text-slate-400 dark:text-slate-500 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400">
                      #{step.actionSequence}
                    </span>
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        step.isFlaggedPrecursor
                          ? 'bg-rose-500/10 text-rose-600 dark:text-rose-300 border border-rose-500/30'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {step.timestampOffsetSec}s
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white mt-1.5 truncate">
                    {step.actionType}
                  </p>
                </div>

                <div className="mt-3 pt-1.5 border-t border-slate-200 dark:border-[#1c2638] text-[10px] font-mono flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">{step.durationMs}ms</span>
                  <span className={step.anomalyScore > 60 ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-slate-500 dark:text-slate-400'}>
                    {step.anomalyScore}%
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Step Forensic Detail Card */}
        {currentStep && (
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0c1017] border border-slate-200 dark:border-[#1c2638] grid grid-cols-1 md:grid-cols-3 gap-4 text-xs animate-in fade-in">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase">Action Sequence Stage</span>
              <p className="text-base font-bold text-slate-900 dark:text-white font-mono">
                #{currentStep.actionSequence}: {currentStep.actionType}
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-xs">
                Timestamp Offset: <strong className="text-teal-600 dark:text-teal-300 font-mono">{currentStep.timestampOffsetSec} seconds</strong> before payment confirmation.
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase">Interaction Analysis</span>
              <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                {currentStep.behaviorNote}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                Target Element: {currentStep.targetElement} (Dwell: {currentStep.durationMs}ms)
              </p>
            </div>

            <div className="space-y-1 md:text-right flex flex-col md:items-end justify-center">
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase">Step Anomaly Severity</span>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-mono font-bold border ${
                  currentStep.anomalyScore > 70
                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-300 border-rose-500/30'
                    : 'bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/30'
                }`}
              >
                Anomaly Index: {currentStep.anomalyScore}/100
              </span>
              {currentStep.isFlaggedPrecursor && (
                <span className="text-[10px] text-rose-600 dark:text-rose-400 font-mono font-semibold">
                  ⚠️ Pre-Fraud Signal Correlated
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
