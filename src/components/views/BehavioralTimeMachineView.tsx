import React, { useState } from 'react';
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  TrendingDown,
  Activity,
  ArrowRight
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceLine } from 'recharts';
import { useTheme } from '../../context/ThemeContext';

export const BehavioralTimeMachineView: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const [currentDay, setCurrentDay] = useState<number>(30);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const thirtyDayHistory = [
    { day: 1, label: 'Day 1', riskScore: 8, typingSpeed: 185, hesitation: 3.2, note: 'Normal onboarding baseline' },
    { day: 5, label: 'Day 5', riskScore: 10, typingSpeed: 180, hesitation: 3.0, note: 'Regular utility bill payment' },
    { day: 10, label: 'Day 10', riskScore: 9, typingSpeed: 190, hesitation: 3.4, note: 'Standard savings check' },
    { day: 15, label: 'Day 15', riskScore: 12, typingSpeed: 182, hesitation: 2.9, note: 'Normal mobile recharge' },
    { day: 20, label: 'Day 20', riskScore: 14, typingSpeed: 178, hesitation: 3.1, note: 'Routine grocery payout' },
    { day: 24, label: 'Day 24 (Inflection)', riskScore: 42, typingSpeed: 110, hesitation: 1.8, note: '⚠️ Phishing compromise occurred: Hesitation dropped 40%' },
    { day: 26, label: 'Day 26', riskScore: 58, typingSpeed: 80, hesitation: 1.2, note: 'Attacker added unknown beneficiary' },
    { day: 28, label: 'Day 28', riskScore: 74, typingSpeed: 45, hesitation: 0.6, note: 'Rehearsal: Amount checked & canceled twice' },
    { day: 30, label: 'Day 30 (Attack Day)', riskScore: 94, typingSpeed: 25, hesitation: 0.2, note: '🚨 Full account drain attempted (₹3.45 Lakhs)' },
  ];

  // Scrubber animation
  React.useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentDay((prev) => {
          if (prev >= 30) {
            setIsPlaying(false);
            return 1;
          }
          return prev + 1;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const activeDataPoint = thirtyDayHistory.reduce((prev, curr) => {
    return Math.abs(curr.day - currentDay) < Math.abs(prev.day - currentDay) ? curr : prev;
  });

  return (
    <div id="view-time-machine" className="p-4 md:p-6 space-y-6 animate-in fade-in">
      {/* Top Banner */}
      <div className="p-4 md:p-5 rounded-2xl bg-gradient-to-r from-sky-50 via-[var(--color-brand)]/10 to-blue-50 dark:from-[#0c1836] dark:via-[#102046] dark:to-[#0d1630] border border-sky-200/80 dark:border-[#21355e] flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-sm dark:shadow-xl transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-500/40 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              BEHAVIORAL TIME MACHINE (30-DAY TIMELINE SCRUBBER)
            </span>
            <span className="text-xs text-[var(--text-muted)] font-mono">• Forensic Temporal Drift Analysis</span>
          </div>
          <h2 className="text-lg md:text-xl font-bold text-[var(--text-primary)] tracking-tight mt-1">
            Replaying the Customer's 30-Day Transition from Normal to Compromised
          </h2>
          <p className="text-xs md:text-sm text-[var(--text-secondary)] max-w-3xl leading-relaxed mt-1">
            Scrub back in time across the customer's 30-day interaction history. Pinpoint the exact day the compromise occurred (<strong>Day 24: Early Warning Inflection Point — 6 days before the attack!</strong>).
          </p>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2 bg-[var(--bg-card)] p-2 rounded-xl border border-[var(--border-color)] shadow-xs">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isPlaying
                ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40'
                : 'bg-sky-600 text-white hover:bg-sky-500'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isPlaying ? 'Pause Playback' : 'Play 30-Day Drift'}
          </button>
          <button
            onClick={() => {
              setIsPlaying(false);
              setCurrentDay(1);
            }}
            className="p-1.5 rounded-lg bg-[var(--bg-subtle)] hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] transition-colors cursor-pointer"
            title="Rewind to Day 1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 30-Day Interactive Scrubber Bar */}
      <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xs dark:shadow-lg space-y-4 transition-colors">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="text-[var(--text-muted)]">Time-Machine Temporal Position:</span>
          <span className="text-sky-700 dark:text-sky-300 font-bold text-sm">
            DAY {currentDay} OF 30 ({currentDay >= 24 ? '🚨 Post-Compromise Phase' : '🟢 Baseline Phase'})
          </span>
        </div>

        <input
          type="range"
          min={1}
          max={30}
          value={currentDay}
          onChange={(e) => {
            setIsPlaying(false);
            setCurrentDay(parseInt(e.target.value));
          }}
          className="w-full accent-sky-500 cursor-pointer h-2.5 bg-[var(--bg-subtle)] rounded-lg"
        />

        <div className="flex justify-between text-[11px] font-mono text-[var(--text-muted)]">
          <span>Day 1 (Healthy Baseline)</span>
          <span className="text-[var(--color-tier-medium)] font-bold">Day 24 (⚠️ Inflection Point)</span>
          <span className="text-[var(--color-tier-high)] font-bold">Day 30 (🚨 Drain Attempt)</span>
        </div>
      </div>

      {/* Main Visualizer: 30-Day Risk & Biometric Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xs dark:shadow-lg space-y-3 transition-colors">
          <h3 className="text-xs font-mono font-bold text-[var(--text-primary)] uppercase tracking-wider">
            30-Day Behavioral Anomaly Trajectory
          </h3>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={thirtyDayHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fda4af" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#fda4af" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="label" stroke={isDark ? '#64748b' : '#94a3b8'} tick={{ fontSize: 10, fill: isDark ? '#94a3b8' : '#64748b' }} />
                <YAxis stroke={isDark ? '#64748b' : '#94a3b8'} tick={{ fontSize: 10, fill: isDark ? '#94a3b8' : '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#091122' : '#ffffff',
                    borderColor: isDark ? '#22355b' : '#e2e8f0',
                    color: isDark ? '#ffffff' : '#0f172a',
                    borderRadius: '12px',
                    fontSize: '11px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <ReferenceLine x="Day 24 (Inflection)" stroke="#d97706" strokeDasharray="3 3" label={{ value: 'Day 24 Inflection', fill: isDark ? '#fbbf24' : '#b45309', fontSize: 10 }} />
                <Area type="monotone" dataKey="riskScore" stroke="#f43f5e" strokeWidth={2} fill="url(#riskGrad)" name="Behavioral Anomaly Index" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Selected Day Status Card */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xs dark:shadow-lg space-y-4 flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
              <span className="text-xs font-mono text-[var(--text-muted)]">Scrubber Telemetry</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                activeDataPoint.riskScore > 50
                  ? 'bg-[var(--color-tier-high)]/20 text-[var(--color-tier-high)] border border-[var(--color-tier-high)]/30'
                  : 'bg-[var(--color-tier-low)]/20 text-[var(--color-tier-low)] border border-[var(--color-tier-low)]/30'
              }`}>
                {activeDataPoint.riskScore > 50 ? 'ANOMALOUS' : 'NORMAL'}
              </span>
            </div>

            <div className="mt-3 space-y-3">
              <div>
                <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">Day {currentDay} Logged Event</span>
                <p className="text-xs text-[var(--text-primary)] font-medium mt-1 leading-relaxed">
                  {activeDataPoint.note}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-color)]">
                  <span className="text-[10px] text-[var(--text-muted)] block">Risk Score</span>
                  <strong className={activeDataPoint.riskScore > 50 ? 'text-[var(--color-tier-high)]' : 'text-[var(--color-tier-low)]'}>
                    {activeDataPoint.riskScore}/100
                  </strong>
                </div>
                <div className="p-2 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-color)]">
                  <span className="text-[10px] text-[var(--text-muted)] block">Hesitation</span>
                  <strong className="text-[var(--text-primary)]">{activeDataPoint.hesitation}s</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[11px] text-[var(--text-secondary)] font-medium">
            <strong>Time Machine Key Insight:</strong> By analyzing Day 24, our engine detects early phishing drift <strong>6 days before</strong> the fraudster initiates the ₹3.45L payout on Day 30.
          </div>
        </div>
      </div>
    </div>
  );
};
