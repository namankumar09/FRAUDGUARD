import React, { useState } from 'react';
import {
  Swords,
  Play,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Zap,
  Sliders,
  Sparkles,
  Bot,
  UserCheck
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { useTheme } from '../../context/ThemeContext';

export const AdversarialRedTeamSimulatorView: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const [isSimulating, setIsSimulating] = useState(false);
  const [round, setRound] = useState(1);
  const [botMimicryLevel, setBotMimicryLevel] = useState<number>(60);
  const [defenseStrictness, setDefenseStrictness] = useState<number>(75);

  const [history, setHistory] = useState([
    { round: 1, RedTeamEvasionRate: 45, BlueTeamCatchRate: 85 },
    { round: 2, RedTeamEvasionRate: 60, BlueTeamCatchRate: 78 },
    { round: 3, RedTeamEvasionRate: 35, BlueTeamCatchRate: 92 },
  ]);

  const [logs, setLogs] = useState<string[]>([
    'Round 1: Red-Team deployed Gaussian jitter on flight times. Blue-Team adjusted variance window.',
    'Round 2: Red-Team introduced 2-second hesitation before card input. Blue-Team caught cursor jitter irregularity.',
    'Round 3: Blue-Team deployed phylogenetic strain matching. Intercepted 94% of synthetic bot transactions.',
  ]);

  const runNextRound = () => {
    const nextRound = round + 1;
    const evasion = Math.max(10, Math.min(95, Math.round(botMimicryLevel * 1.1 - defenseStrictness * 0.4 + (Math.random() * 20 - 10))));
    const catchRate = 100 - evasion;

    setHistory((prev) => [...prev, { round: nextRound, RedTeamEvasionRate: evasion, BlueTeamCatchRate: catchRate }]);
    setRound(nextRound);

    const redTactic = evasion > 50
      ? `Round ${nextRound}: Red-Team adapted with non-linear bezier curves and random backspaces (${evasion}% evasion).`
      : `Round ${nextRound}: Blue-Team biometrics intercepted Red-Team bot farm (${catchRate}% catch rate).`;

    setLogs((prev) => [redTactic, ...prev]);
  };

  const resetWar = () => {
    setRound(1);
    setHistory([
      { round: 1, RedTeamEvasionRate: 45, BlueTeamCatchRate: 85 },
      { round: 2, RedTeamEvasionRate: 60, BlueTeamCatchRate: 78 },
      { round: 3, RedTeamEvasionRate: 35, BlueTeamCatchRate: 92 },
    ]);
    setLogs([
      'Round 1: Red-Team deployed Gaussian jitter on flight times. Blue-Team adjusted variance window.',
      'Round 2: Red-Team introduced 2-second hesitation before card input. Blue-Team caught cursor jitter irregularity.',
      'Round 3: Blue-Team deployed phylogenetic strain matching. Intercepted 94% of synthetic bot transactions.',
    ]);
  };

  return (
    <div id="view-adversarial-simulator" className="p-4 md:p-6 space-y-6 animate-in fade-in">
      {/* Top Banner */}
      <div className="p-4 md:p-5 rounded-2xl bg-gradient-to-r from-rose-50 via-amber-50 to-orange-50 dark:from-[#0c1836] dark:via-[#102046] dark:to-[#0d1630] border border-rose-200/80 dark:border-[#21355e] flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-sm dark:shadow-xl transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-500/40 flex items-center gap-1.5">
              <Swords className="w-3.5 h-3.5" />
              ADVERSARIAL FRAUD ARMS RACE SIMULATOR (RED VS BLUE)
            </span>
            <span className="text-xs text-[var(--text-muted)] font-mono">• Live Interactive Bot Mimicry Arena</span>
          </div>
          <h2 className="text-lg md:text-xl font-bold text-[var(--text-primary)] tracking-tight mt-1">
            Red-Team Synthetic Attacker Bot vs Blue-Team Behavioral Biometrics
          </h2>
          <p className="text-xs md:text-sm text-[var(--text-secondary)] max-w-3xl leading-relaxed mt-1">
            Simulate how attackers continually upgrade their automation bots with synthetic human jitter, pauses, and mouse bezier curves, while our defensive AI learns to detect their underlying algorithmic artifacts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={runNextRound}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-bold text-xs font-mono shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5" /> Run Next Arms Race Round (Round {round + 1})
          </button>
          <button
            onClick={resetWar}
            className="p-2 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            title="Reset Simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Line Chart showing Evasion vs Catch (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xs dark:shadow-lg space-y-4 transition-colors">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold text-[var(--text-primary)] uppercase tracking-wider">
              Arms Race Trajectory: Red Evasion Rate vs Blue Interception Rate
            </h3>
            <span className="text-[10px] font-mono text-[var(--color-brand)] font-bold">Round {round} Active</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="round" stroke={isDark ? '#64748b' : '#94a3b8'} tick={{ fontSize: 10, fill: isDark ? '#94a3b8' : '#64748b' }} unit=" R" />
                <YAxis stroke={isDark ? '#64748b' : '#94a3b8'} tick={{ fontSize: 10, fill: isDark ? '#94a3b8' : '#64748b' }} unit="%" />
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
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Line type="monotone" dataKey="RedTeamEvasionRate" stroke="#f43f5e" strokeWidth={2.5} name="Red-Team Evasion Rate (%)" />
                <Line type="monotone" dataKey="BlueTeamCatchRate" stroke="#0284c7" strokeWidth={2.5} name="Blue-Team Catch Rate (%)" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Interactive Parameters Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[var(--border-subtle)] text-xs font-mono">
            <div>
              <div className="flex justify-between text-[var(--text-secondary)] mb-1">
                <span>Red Bot Human-Mimicry Level:</span>
                <span className="text-rose-600 dark:text-rose-400 font-bold">{botMimicryLevel}%</span>
              </div>
              <input
                type="range"
                min={20}
                max={95}
                value={botMimicryLevel}
                onChange={(e) => setBotMimicryLevel(parseInt(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between text-[var(--text-secondary)] mb-1">
                <span>Blue Defensive Strictness:</span>
                <span className="text-sky-600 dark:text-sky-300 font-bold">{defenseStrictness}%</span>
              </div>
              <input
                type="range"
                min={30}
                max={95}
                value={defenseStrictness}
                onChange={(e) => setDefenseStrictness(parseInt(e.target.value))}
                className="w-full accent-sky-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Arms Race Live Combat Log (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xs dark:shadow-lg space-y-4 flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
              <h3 className="text-xs font-mono font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
                <Bot className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
                Combat Logs & Tactical Shifts
              </h3>
              <span className="text-[10px] font-mono text-[var(--text-muted)]">{logs.length} Rounds</span>
            </div>

            <div className="space-y-2.5 max-h-[300px] overflow-y-auto custom-scrollbar pr-1 mt-3">
              {logs.map((log, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-xs font-mono leading-relaxed text-[var(--text-secondary)]"
                >
                  {log}
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-500/30 text-[11px] text-purple-900 dark:text-purple-200 font-medium">
            <strong>Defensive Advantage:</strong> Even when Red bots inject simulated flight pauses, their higher-order entropy and mouse micro-accelerations deviate from human physical limits.
          </div>
        </div>
      </div>
    </div>
  );
};
