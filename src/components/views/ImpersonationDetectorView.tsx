import React, { useState } from 'react';
import {
  Fingerprint,
  UserCheck,
  UserX,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  Shield,
  HelpCircle
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export const ImpersonationDetectorView: React.FC = () => {
  const [testText, setTestText] = useState('');
  const [flightTimes, setFlightTimes] = useState<number[]>([]);
  const [lastTime, setLastTime] = useState<number | null>(null);

  const sampleOwnerCadence = [160, 185, 210, 150, 195, 230, 175, 190, 205, 170];
  const sampleRogueCadence = [35, 42, 28, 30, 38, 25, 40, 32, 29, 36]; // Automated script or thief

  const handleKeyDown = () => {
    const now = Date.now();
    if (lastTime) {
      const flight = now - lastTime;
      if (flight < 1500) {
        setFlightTimes((prev) => [...prev.slice(-9), flight]);
      }
    }
    setLastTime(now);
  };

  const loadPreset = (type: 'owner' | 'rogue') => {
    if (type === 'owner') {
      setFlightTimes([...sampleOwnerCadence]);
      setTestText('Verified genuine account owner typing sample.');
    } else {
      setFlightTimes([...sampleRogueCadence]);
      setTestText('Automated script or rogue operator paste sequence.');
    }
  };

  const chartData = (flightTimes.length >= 5 ? flightTimes : sampleRogueCadence).map((val, idx) => ({
    keystroke: `Key ${idx + 1}`,
    OwnerCadence: sampleOwnerCadence[idx % sampleOwnerCadence.length],
    CurrentOperator: val,
  }));

  const avgCurrentFlight = flightTimes.length > 0
    ? Math.round(flightTimes.reduce((a, b) => a + b, 0) / flightTimes.length)
    : 34;

  const identityConfidenceScore = Math.max(12, Math.min(99, 100 - Math.abs(avgCurrentFlight - 185) * 0.5));
  const isMatch = identityConfidenceScore >= 65;

  return (
    <div id="view-impersonation-detector" className="p-4 md:p-6 space-y-6 animate-in fade-in transition-colors font-sans">
      {/* 3-Part User Friendly Top Header */}
      <div className="p-5 md:p-6 rounded-3xl bg-white dark:bg-[#121721] border border-slate-200 dark:border-[#1c2638] shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/30 flex items-center gap-1.5">
                <Fingerprint className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                CUSTOMER PROFILES & BIOMETRIC IDENTITY
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">• Account Takeover Check</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Verify if the real customer is using the account
            </h2>
          </div>

          {/* Biometric Confidence Gauge */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0c1017] border border-slate-200 dark:border-[#1c2638] text-center font-mono shrink-0">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider block font-bold">
              Identity Match Score
            </span>
            <p className={`text-2xl font-bold mt-0.5 ${!isMatch ? 'text-rose-600 dark:text-rose-400' : 'text-teal-600 dark:text-teal-400'}`}>
              {Math.round(identityConfidenceScore)}%
            </p>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
              {isMatch ? '🟢 Verified Owner' : '🔴 Impersonation Likely'}
            </span>
          </div>
        </div>

        {/* 3 User-Friendly Helper Questions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-slate-100 dark:border-[#1c2638] text-xs">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0c1017] border border-slate-200 dark:border-[#1c2638] space-y-1">
            <span className="font-bold text-teal-700 dark:text-teal-400 font-mono text-[10px] uppercase block">
              1. What this does
            </span>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Compares the person typing right now against the genuine customer's unique neuromuscular typing rhythm.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0c1017] border border-slate-200 dark:border-[#1c2638] space-y-1">
            <span className="font-bold text-teal-700 dark:text-teal-400 font-mono text-[10px] uppercase block">
              2. What should I look for?
            </span>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Look at the blue vs orange lines below. If the orange line is far below the blue line, it means automated fast pasting or a different person.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0c1017] border border-slate-200 dark:border-[#1c2638] space-y-1">
            <span className="font-bold text-teal-700 dark:text-teal-400 font-mono text-[10px] uppercase block">
              3. What can I do?
            </span>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              If the score is below 60%, click "Request Biometric Verification" or freeze the session to prevent unauthorized transfers.
            </p>
          </div>
        </div>
      </div>

      {/* Main Interactive Work Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Typing Simulator */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-white dark:bg-[#121721] border border-slate-200 dark:border-[#1c2638] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Try Interactive Typing Test
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/30">
              Live Biometrics
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300">
            Type anything in the box below to test your own live cadence, or click one of the pre-loaded profiles:
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => loadPreset('owner')}
              className="flex-1 py-1.5 px-3 rounded-xl bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/40 dark:hover:bg-teal-900/60 border border-teal-200 dark:border-teal-500/40 text-teal-700 dark:text-teal-300 text-xs font-semibold transition-colors"
            >
              👤 Load Real Owner Rhythm
            </button>
            <button
              onClick={() => loadPreset('rogue')}
              className="flex-1 py-1.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-500/40 text-rose-700 dark:text-rose-300 text-xs font-semibold transition-colors"
            >
              🤖 Load Impersonator Bot
            </button>
          </div>

          <textarea
            rows={3}
            value={testText}
            onChange={(e) => setTestText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type here continuously to calculate your live flight times..."
            className="w-full p-3 rounded-xl bg-slate-50 dark:bg-[#0c1017] border border-slate-200 dark:border-[#1c2638] text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 resize-none font-mono"
          />

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0c1017] border border-slate-200 dark:border-[#1c2638] space-y-1.5 text-xs font-mono">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400 text-[11px]">Average Flight Latency:</span>
              <span className="font-bold text-slate-900 dark:text-white">{avgCurrentFlight} ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400 text-[11px]">Owner Historical Baseline:</span>
              <span className="text-teal-600 dark:text-teal-400 font-bold">185 ms ± 22ms</span>
            </div>
          </div>
        </div>

        {/* Right: Real-time Cadence Chart */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-white dark:bg-[#121721] border border-slate-200 dark:border-[#1c2638] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Typing Cadence Comparison Graph
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                Blue = Genuine Customer · Orange = Current Live Operator
              </p>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <XAxis dataKey="keystroke" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} domain={[0, 260]} unit="ms" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#121721',
                    borderColor: '#1c2638',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line
                  type="monotone"
                  dataKey="OwnerCadence"
                  name="Genuine Owner Baseline"
                  stroke="#2dd4bf"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#2dd4bf' }}
                />
                <Line
                  type="monotone"
                  dataKey="CurrentOperator"
                  name="Current Live Session"
                  stroke={isMatch ? '#38bdf8' : '#f87171'}
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: isMatch ? '#38bdf8' : '#f87171' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Action buttons */}
          <div className="pt-2 border-t border-slate-100 dark:border-[#1c2638] flex items-center justify-between">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              Status: {isMatch ? 'Normal session' : 'Risk flag raised'}
            </span>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#182132] text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors">
                Request Step-Up Verification
              </button>
              <button className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold transition-colors">
                Approve Session
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
