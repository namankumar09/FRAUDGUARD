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
      <div className="p-4 md:p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[var(--color-tier-medium-bg)] text-[var(--color-tier-medium)] border border-[var(--color-tier-medium-border)] flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              FRAUD "PRECURSOR" INTENT DETECTOR
            </span>
            <span className="text-xs text-[var(--text-muted)] font-mono">• 10–30 Actions Before Transaction</span>
          </div>
          <h2 className="text-lg md:text-xl font-bold text-[var(--text-primary)] tracking-tight mt-1 font-sans">
            Detecting Fraud Intent 18 Seconds Before Execution
          </h2>
          <p className="text-xs md:text-sm text-[var(--text-secondary)] max-w-3xl leading-relaxed mt-1">
            Instead of detecting fraud only when the transaction button is pressed, our model evaluates the <strong>10–30 interaction steps prior to it</strong> (e.g. Login → View Balance → Open Beneficiary → Cancel → Check Limit → Paste Details → Transfer).
          </p>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2 bg-[var(--bg-subtle)] p-2 rounded-xl border border-[var(--border-color)]">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
              isPlaying
                ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40'
                : 'bg-[var(--color-brand-solid)] text-white hover:opacity-90'
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
            className="p-1.5 rounded-lg bg-[var(--bg-subtle)] hover:bg-[var(--bg-hover)] text-[var(--text-secondary)]"
            title="Reset to Step 1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Early Intent Warning Callout */}
      <div className="p-4 rounded-2xl bg-[var(--color-tier-medium-bg)] border border-[var(--color-tier-medium-border)] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-tier-medium)]/20 border border-[var(--color-tier-medium)]/40 flex items-center justify-center text-[var(--color-tier-medium)] font-bold shrink-0">
            ⚠️
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--color-tier-medium)] font-mono">
              Potential Fraudulent Intent Detected 18 Seconds Before Transaction
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Sequence model tagged <strong>Non-Linear Rehearsal Staging & Clipboard Injection</strong> at offset <strong className="text-[var(--color-tier-medium)] font-mono">-18.0s</strong> (Action #5).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs shrink-0">
          <div className="p-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
            <span className="text-[10px] text-[var(--text-muted)]">Precursor Lead Time:</span>
            <p className="text-sm font-bold text-[var(--color-tier-medium)]">18.4 seconds</p>
          </div>
          <div className="p-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
            <span className="text-[10px] text-[var(--text-muted)]">Sequence Risk:</span>
            <p className="text-sm font-bold text-[var(--color-tier-high)]">96 / 100</p>
          </div>
        </div>
      </div>

      {/* Interactive Step Timeline Scrubber */}
      <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono font-bold text-[var(--text-primary)] uppercase tracking-wider">
            Reconstructed User Micro-Action Trajectory
          </h3>
          <span className="text-xs font-mono text-[var(--text-muted)]">
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
                    ? 'bg-[var(--color-brand-bg)] border-[var(--color-brand)] ring-2 ring-[var(--color-brand)]/40 shadow-xs'
                    : isPast
                    ? 'bg-[var(--bg-subtle)] border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
                    : 'bg-[var(--bg-subtle)]/50 border-[var(--border-color)] text-[var(--text-muted)] opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-[var(--text-muted)]">
                      #{step.actionSequence}
                    </span>
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        step.isFlaggedPrecursor
                          ? 'bg-[var(--color-tier-high)]/10 text-[var(--color-tier-high)] border border-[var(--color-tier-high)]/30'
                          : 'bg-[var(--bg-subtle)] text-[var(--text-muted)]'
                      }`}
                    >
                      {step.timestampOffsetSec}s
                    </span>
                  </div>
                  <p className="text-xs font-bold text-[var(--text-primary)] mt-1.5 truncate">
                    {step.actionType}
                  </p>
                </div>

                <div className="mt-3 pt-1.5 border-t border-[var(--border-color)] text-[10px] font-mono flex justify-between">
                  <span className="text-[var(--text-muted)]">{step.durationMs}ms</span>
                  <span className={step.anomalyScore > 60 ? 'text-[var(--color-tier-high)] font-bold' : 'text-[var(--text-muted)]'}>
                    {step.anomalyScore}%
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Step Forensic Detail Card */}
        {currentStep && (
          <div className="p-4 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] grid grid-cols-1 md:grid-cols-3 gap-4 text-xs animate-in fade-in">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">Action Sequence Stage</span>
              <p className="text-base font-bold text-[var(--text-primary)] font-mono">
                #{currentStep.actionSequence}: {currentStep.actionType}
              </p>
              <p className="text-[var(--text-secondary)] text-xs">
                Timestamp Offset: <strong className="text-[var(--color-brand)] font-mono">{currentStep.timestampOffsetSec} seconds</strong> before payment confirmation.
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">Interaction Analysis</span>
              <p className="text-[var(--text-secondary)] font-medium leading-relaxed">
                {currentStep.behaviorNote}
              </p>
              <p className="text-[11px] text-[var(--text-muted)] font-mono">
                Target Element: {currentStep.targetElement} (Dwell: {currentStep.durationMs}ms)
              </p>
            </div>

            <div className="space-y-1 md:text-right flex flex-col md:items-end justify-center">
              <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">Step Anomaly Severity</span>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-mono font-bold border ${
                  currentStep.anomalyScore > 70
                    ? 'bg-[var(--color-tier-high)]/10 text-[var(--color-tier-high)] border-[var(--color-tier-high)]/30'
                    : 'bg-[var(--color-brand)]/10 text-[var(--color-brand-strong)] border-[var(--color-brand)]/30'
                }`}
              >
                Anomaly Index: {currentStep.anomalyScore}/100
              </span>
              {currentStep.isFlaggedPrecursor && (
                <span className="text-[10px] text-[var(--color-tier-high)] font-mono font-semibold">
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
