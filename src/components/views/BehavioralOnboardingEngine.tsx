import React, { useState, useEffect, useRef } from 'react';
import {
  UserCheck,
  Zap,
  MousePointer,
  Clock,
  Delete,
  Copy,
  Activity,
  ShieldCheck,
  ShieldAlert,
  Smartphone,
  RefreshCw,
  Sparkles,
  Info,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface FieldMetric {
  name: string;
  dwellTimeMs: number;
  keystrokes: number;
  backspaces: number;
  pastes: number;
  revisits: number;
  meanFlightTimeMs: number;
}

export const BehavioralOnboardingEngine: React.FC = () => {
  // Form values
  const [formData, setFormData] = useState({
    fullName: '',
    idNumber: '', // PAN / SSN / Aadhaar
    email: '',
    phone: '',
    address: '',
    monthlyIncome: '',
  });

  // Real-time telemetry metrics state
  const [activeField, setActiveField] = useState<string | null>(null);
  const [fieldMetrics, setFieldMetrics] = useState<Record<string, FieldMetric>>({
    fullName: { name: 'Full Legal Name', dwellTimeMs: 0, keystrokes: 0, backspaces: 0, pastes: 0, revisits: 0, meanFlightTimeMs: 0 },
    idNumber: { name: 'Identity ID Number', dwellTimeMs: 0, keystrokes: 0, backspaces: 0, pastes: 0, revisits: 0, meanFlightTimeMs: 0 },
    email: { name: 'Email Address', dwellTimeMs: 0, keystrokes: 0, backspaces: 0, pastes: 0, revisits: 0, meanFlightTimeMs: 0 },
    phone: { name: 'Mobile Phone', dwellTimeMs: 0, keystrokes: 0, backspaces: 0, pastes: 0, revisits: 0, meanFlightTimeMs: 0 },
    address: { name: 'Residential Address', dwellTimeMs: 0, keystrokes: 0, backspaces: 0, pastes: 0, revisits: 0, meanFlightTimeMs: 0 },
    monthlyIncome: { name: 'Annual / Monthly Income', dwellTimeMs: 0, keystrokes: 0, backspaces: 0, pastes: 0, revisits: 0, meanFlightTimeMs: 0 },
  });

  // Global Biometric aggregates
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [totalBackspaces, setTotalBackspaces] = useState(0);
  const [totalPastes, setTotalPastes] = useState(0);
  const [mouseMovesCount, setMouseMovesCount] = useState(0);
  const [mouseVelocitySum, setMouseVelocitySum] = useState(0);
  const [hesitationPauses, setHesitationPauses] = useState(0);
  const [formSequence, setFormSequence] = useState<string[]>([]);
  const [sessionStartTime] = useState<number>(Date.now());
  const [lastKeystrokeTime, setLastKeystrokeTime] = useState<number | null>(null);
  const [flightTimes, setFlightTimes] = useState<number[]>([]);
  const [simulatedProfileCreated, setSimulatedProfileCreated] = useState(false);

  // Active focus tracking
  const focusStartTimeRef = useRef<number>(0);
  const lastMousePosRef = useRef<{ x: number; y: number; time: number } | null>(null);

  // Measure dwell time when switching fields
  const handleFieldFocus = (fieldKey: string) => {
    setActiveField(fieldKey);
    focusStartTimeRef.current = Date.now();

    // Track sequence
    if (!formSequence.includes(fieldKey)) {
      setFormSequence((prev) => [...prev, fieldKey]);
    }

    setFieldMetrics((prev) => ({
      ...prev,
      [fieldKey]: {
        ...prev[fieldKey],
        revisits: prev[fieldKey].revisits + 1,
      },
    }));
  };

  const handleFieldBlur = (fieldKey: string) => {
    const elapsed = Date.now() - focusStartTimeRef.current;
    setFieldMetrics((prev) => ({
      ...prev,
      [fieldKey]: {
        ...prev[fieldKey],
        dwellTimeMs: prev[fieldKey].dwellTimeMs + elapsed,
      },
    }));
  };

  // Keystroke dynamics (flight time, backspaces)
  const handleKeyDown = (e: React.KeyboardEvent, fieldKey: string) => {
    const now = Date.now();
    setTotalKeystrokes((prev) => prev + 1);

    if (lastKeystrokeTime) {
      const flight = now - lastKeystrokeTime;
      if (flight < 2000) {
        setFlightTimes((prev) => [...prev.slice(-30), flight]);
      }
      if (flight > 1200) {
        setHesitationPauses((prev) => prev + 1);
      }
    }
    setLastKeystrokeTime(now);

    const isBackspace = e.key === 'Backspace' || e.key === 'Delete';
    if (isBackspace) {
      setTotalBackspaces((prev) => prev + 1);
    }

    setFieldMetrics((prev) => ({
      ...prev,
      [fieldKey]: {
        ...prev[fieldKey],
        keystrokes: prev[fieldKey].keystrokes + 1,
        backspaces: isBackspace ? prev[fieldKey].backspaces + 1 : prev[fieldKey].backspaces,
      },
    }));
  };

  // Copy-Paste Detector
  const handlePaste = (fieldKey: string) => {
    setTotalPastes((prev) => prev + 1);
    setFieldMetrics((prev) => ({
      ...prev,
      [fieldKey]: {
        ...prev[fieldKey],
        pastes: prev[fieldKey].pastes + 1,
      },
    }));
  };

  // Mouse trajectory tracker
  const handleMouseMove = (e: React.MouseEvent) => {
    const now = Date.now();
    if (lastMousePosRef.current) {
      const dx = e.clientX - lastMousePosRef.current.x;
      const dy = e.clientY - lastMousePosRef.current.y;
      const dt = now - lastMousePosRef.current.time || 1;
      const velocity = Math.sqrt(dx * dx + dy * dy) / dt;
      setMouseVelocitySum((prev) => prev + velocity);
    }
    lastMousePosRef.current = { x: e.clientX, y: e.clientY, time: now };
    setMouseMovesCount((prev) => prev + 1);
  };

  // Human vs Bot Auto-Fill Simulation
  const fillSampleNormalHuman = () => {
    setFormData({
      fullName: 'Vikramaditya Sharma',
      idNumber: 'ABCDE1234F',
      email: 'vikram.sharma@example.com',
      phone: '+91 98765 43210',
      address: 'Flat 12B, Palm Grove Residency, Indiranagar, Bengaluru 560038',
      monthlyIncome: '₹2,50,000',
    });
    setTotalKeystrokes(148);
    setTotalBackspaces(14);
    setTotalPastes(1);
    setFlightTimes([160, 210, 145, 190, 240, 180, 210, 130, 260, 150]);
    setHesitationPauses(3);
    setMouseMovesCount(240);
    setFormSequence(['fullName', 'idNumber', 'phone', 'email', 'address', 'monthlyIncome']);
  };

  const fillSampleBotScript = () => {
    setFormData({
      fullName: 'Bot Automated Runner',
      idNumber: 'XYZ998811',
      email: 'bot_farm_883@tempmail.org',
      phone: '+91 91111 22222',
      address: 'Industrial Node 44, Bulk Data Center, Pune 411001',
      monthlyIncome: '₹50,00,000',
    });
    setTotalKeystrokes(18); // Pasted instantly
    setTotalBackspaces(0);
    setTotalPastes(6);
    setFlightTimes([12, 14, 11, 10, 15]); // Inhuman microsecond speed
    setHesitationPauses(0);
    setMouseMovesCount(4); // No natural curve
    setFormSequence(['fullName', 'email', 'idNumber', 'phone', 'address', 'monthlyIncome']);
  };

  const resetSandbox = () => {
    setFormData({
      fullName: '',
      idNumber: '',
      email: '',
      phone: '',
      address: '',
      monthlyIncome: '',
    });
    setTotalKeystrokes(0);
    setTotalBackspaces(0);
    setTotalPastes(0);
    setFlightTimes([]);
    setHesitationPauses(0);
    setMouseMovesCount(0);
    setMouseVelocitySum(0);
    setFormSequence([]);
    setSimulatedProfileCreated(false);
  };

  // Calculated Metrics
  const avgFlightTime = flightTimes.length > 0 ? Math.round(flightTimes.reduce((a, b) => a + b, 0) / flightTimes.length) : 0;
  const flightVariance = flightTimes.length > 1
    ? Math.round(Math.sqrt(flightTimes.map((x) => Math.pow(x - avgFlightTime, 2)).reduce((a, b) => a + b, 0) / flightTimes.length))
    : 0;

  const isRoboticCadence = totalPastes >= 3 || (avgFlightTime > 0 && avgFlightTime < 35);
  const botRiskScore = Math.min(
    100,
    Math.max(
      4,
      (totalPastes * 22) +
        (avgFlightTime > 0 && avgFlightTime < 40 ? 45 : 0) +
        (flightVariance > 0 && flightVariance < 10 ? 35 : 0) +
        (formSequence.length > 4 && totalBackspaces === 0 && totalKeystrokes > 20 ? 18 : 0)
    )
  );

  const handleGenerateProfile = () => {
    setSimulatedProfileCreated(true);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
  };

  return (
    <div
      id="view-onboarding-engine"
      onMouseMove={handleMouseMove}
      className="p-4 md:p-6 space-y-6 animate-in fade-in select-none transition-colors"
    >
      {/* Header Banner */}
      <div className="p-4 md:p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5" />
              LIVE BEHAVIORAL ONBOARDING ENGINE
            </span>
            <span className="text-xs text-[var(--text-muted)] font-mono">• Established Biometric Foundation</span>
          </div>
          <h2 className="text-lg md:text-xl font-bold text-[var(--text-primary)] tracking-tight mt-1 font-sans">
            Real-Time Biometric KYC Telemetry & Behavioral Profile Synthesis
          </h2>
          <p className="text-xs md:text-sm text-[var(--text-secondary)] max-w-3xl leading-relaxed mt-1">
            Instead of relying purely on static KYC documents (which can be forged or purchased), our engine creates a <strong>Living Behavioral Profile</strong> by measuring your keystroke rhythm, flight variance, copy-paste velocity, pause friction, and device fingerprint.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={fillSampleNormalHuman}
            className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-mono font-semibold transition-all"
          >
            Load Human Persona
          </button>
          <button
            onClick={fillSampleBotScript}
            className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs font-mono font-semibold transition-all"
          >
            Load Bot / Script Persona
          </button>
          <button
            onClick={resetSandbox}
            className="p-2 rounded-lg bg-[var(--bg-subtle)] hover:bg-[var(--bg-hover)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            title="Reset Sandbox"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Form Sandbox (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
            <div>
              <h3 className="text-xs font-mono font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Live Customer Onboarding Form (Type or Paste Below to Test)
              </h3>
              <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                Every keystroke, hold duration, backspace, and cursor movement is recorded live.
              </p>
            </div>
            {activeField && (
              <span className="px-2 py-0.5 rounded bg-[var(--color-brand)]/10 text-[var(--color-brand-strong)] text-[10px] font-mono border border-[var(--color-brand)]/30">
                Focus: {activeField}
              </span>
            )}
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block text-[var(--text-secondary)] font-medium mb-1 flex justify-between">
                <span>1. Full Legal Name (as per Govt ID)</span>
                <span className="text-[10px] font-mono text-slate-500">
                  {fieldMetrics.fullName.keystrokes} keys • {fieldMetrics.fullName.backspaces} corrections
                </span>
              </label>
              <input
                id="input-fullname"
                type="text"
                placeholder="e.g. Vikramaditya Sharma"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                onFocus={() => handleFieldFocus('fullName')}
                onBlur={() => handleFieldBlur('fullName')}
                onKeyDown={(e) => handleKeyDown(e, 'fullName')}
                onPaste={() => handlePaste('fullName')}
                className="w-full bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl px-3.5 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--color-brand)] transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[var(--text-secondary)] font-medium mb-1 flex justify-between">
                  <span>2. Govt ID / PAN / SSN</span>
                  <span className="text-[10px] font-mono text-slate-500">{fieldMetrics.idNumber.keystrokes} keys</span>
                </label>
                <input
                  id="input-idnumber"
                  type="text"
                  placeholder="e.g. ABCDE1234F"
                  value={formData.idNumber}
                  onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                  onFocus={() => handleFieldFocus('idNumber')}
                  onBlur={() => handleFieldBlur('idNumber')}
                  onKeyDown={(e) => handleKeyDown(e, 'idNumber')}
                  onPaste={() => handlePaste('idNumber')}
                  className="w-full bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl px-3.5 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--color-brand)] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[var(--text-secondary)] font-medium mb-1 flex justify-between">
                  <span>3. Mobile Phone</span>
                  <span className="text-[10px] font-mono text-slate-500">{fieldMetrics.phone.keystrokes} keys</span>
                </label>
                <input
                  id="input-phone"
                  type="text"
                  placeholder="e.g. +91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  onFocus={() => handleFieldFocus('phone')}
                  onBlur={() => handleFieldBlur('phone')}
                  onKeyDown={(e) => handleKeyDown(e, 'phone')}
                  onPaste={() => handlePaste('phone')}
                  className="w-full bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl px-3.5 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--color-brand)] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[var(--text-secondary)] font-medium mb-1 flex justify-between">
                <span>4. Email Address</span>
                <span className="text-[10px] font-mono text-slate-500">{fieldMetrics.email.keystrokes} keys</span>
              </label>
              <input
                id="input-email"
                type="email"
                placeholder="e.g. vikram.sharma@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                onFocus={() => handleFieldFocus('email')}
                onBlur={() => handleFieldBlur('email')}
                onKeyDown={(e) => handleKeyDown(e, 'email')}
                onPaste={() => handlePaste('email')}
                className="w-full bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl px-3.5 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--color-brand)] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[var(--text-secondary)] font-medium mb-1 flex justify-between">
                <span>5. Residential Address (Test Copy-Paste Detection)</span>
                <span className="text-[10px] font-mono text-slate-500">
                  {fieldMetrics.address.pastes > 0 ? (
                    <strong className="text-amber-600 dark:text-amber-400">⚠️ {fieldMetrics.address.pastes} Paste Detected</strong>
                  ) : (
                    'Manual typing'
                  )}
                </span>
              </label>
              <textarea
                id="input-address"
                rows={2}
                placeholder="e.g. Flat 12B, Palm Grove Residency, Indiranagar, Bengaluru 560038"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                onFocus={() => handleFieldFocus('address')}
                onBlur={() => handleFieldBlur('address')}
                onKeyDown={(e) => handleKeyDown(e, 'address')}
                onPaste={() => handlePaste('address')}
                className="w-full bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl px-3.5 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--color-brand)] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[var(--text-secondary)] font-medium mb-1 flex justify-between">
                <span>6. Monthly Income Range</span>
                <span className="text-[10px] font-mono text-slate-500">{fieldMetrics.monthlyIncome.keystrokes} keys</span>
              </label>
              <input
                id="input-income"
                type="text"
                placeholder="e.g. ₹2,50,000"
                value={formData.monthlyIncome}
                onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
                onFocus={() => handleFieldFocus('monthlyIncome')}
                onBlur={() => handleFieldBlur('monthlyIncome')}
                onKeyDown={(e) => handleKeyDown(e, 'monthlyIncome')}
                onPaste={() => handlePaste('monthlyIncome')}
                className="w-full bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl px-3.5 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--color-brand)] transition-colors"
              />
            </div>

            <div className="pt-2">
              <button
                id="btn-generate-behavioral-profile"
                onClick={handleGenerateProfile}
                className="w-full py-3 rounded-xl bg-[var(--color-brand-solid)] hover:opacity-90 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Synthesize & Calibrate Behavioral DNA Profile
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Real-time Live Biometric Telemetry (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Live Synthetic Bot vs Human Scoring Gauge */}
          <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold text-[var(--text-primary)] uppercase tracking-wider">
                Real-Time Behavioral Verdict
              </h3>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                  botRiskScore > 50
                    ? 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/30'
                    : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                }`}
              >
                {botRiskScore > 50 ? 'AUTOMATION / SCRIPT RISK' : 'AUTHENTIC HUMAN OPERATOR'}
              </span>
            </div>

            {/* Risk Gauge Bar */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-[var(--text-muted)]">Automation / Bot Probability:</span>
                <span className={botRiskScore > 50 ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-emerald-600 dark:text-emerald-400 font-bold'}>
                  {botRiskScore}%
                </span>
              </div>
              <div className="w-full h-3 bg-[var(--bg-subtle)] rounded-full overflow-hidden border border-[var(--border-color)] p-0.5">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    botRiskScore > 50
                      ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                      : 'bg-gradient-to-r from-[var(--color-tier-low)] to-[var(--color-brand)]'
                  }`}
                  style={{ width: `${botRiskScore}%` }}
                />
              </div>
            </div>

            {/* Micro Metrics Grid */}
            <div className="grid grid-cols-2 gap-2.5 pt-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)]">
                <span className="text-[10px] text-[var(--text-muted)] flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[var(--color-brand)]" /> Mean Flight Time:
                </span>
                <p className="text-sm font-bold text-[var(--text-primary)] mt-1">{avgFlightTime} ms</p>
                <span className="text-[9px] text-slate-500">Human norm: 120-280ms</span>
              </div>

              <div className="p-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)]">
                <span className="text-[10px] text-[var(--text-muted)] flex items-center gap-1">
                  <Activity className="w-3 h-3 text-purple-600 dark:text-purple-400" /> Flight Variance:
                </span>
                <p className="text-sm font-bold text-[var(--text-primary)] mt-1">±{flightVariance} ms</p>
                <span className="text-[9px] text-slate-500">Low variance = Bot</span>
              </div>

              <div className="p-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)]">
                <span className="text-[10px] text-[var(--text-muted)] flex items-center gap-1">
                  <Copy className="w-3 h-3 text-amber-600 dark:text-amber-400" /> Clipboard Pastes:
                </span>
                <p className={`text-sm font-bold mt-1 ${totalPastes > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-[var(--text-secondary)]'}`}>
                  {totalPastes} events
                </p>
                <span className="text-[9px] text-slate-500">Address/PAN paste</span>
              </div>

              <div className="p-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)]">
                <span className="text-[10px] text-[var(--text-muted)] flex items-center gap-1">
                  <Delete className="w-3 h-3 text-rose-600 dark:text-rose-400" /> Corrections:
                </span>
                <p className="text-sm font-bold text-[var(--text-primary)] mt-1">{totalBackspaces} backspaces</p>
                <span className="text-[9px] text-slate-500">Cognitive hesitation</span>
              </div>
            </div>

            {/* Mouse & Trajectory Telemetry */}
            <div className="p-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-xs font-mono space-y-1.5">
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span>Mouse Micro-Events:</span>
                <span className="text-[var(--color-brand)] font-bold">{mouseMovesCount} points</span>
              </div>
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span>Hesitation Pauses (&gt;1.2s):</span>
                <span className="text-amber-600 dark:text-amber-300 font-bold">{hesitationPauses} instances</span>
              </div>
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span>Form Navigation Order:</span>
                <span className="text-[var(--text-muted)] text-[10px] truncate max-w-[160px]">
                  {formSequence.join(' → ') || 'None yet'}
                </span>
              </div>
            </div>

            {/* Device & Hardware Fingerprint Box */}
            <div className="p-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-xs font-mono space-y-1">
              <div className="flex items-center gap-1.5 text-[var(--text-muted)] text-[11px] mb-1">
                <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                <span>Captured Device Fingerprint</span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Screen: <b className="text-[var(--text-primary)]">{window.innerWidth}x{window.innerHeight}</b> • Concurrency: <b className="text-[var(--text-primary)]">{navigator.hardwareConcurrency || 8} cores</b>
              </p>
              <p className="text-[10px] text-[var(--text-muted)] truncate">
                Canvas Hash: #4f882a1 • Touch: {('ontouchstart' in window) ? 'Yes' : 'No (Mouse/Trackpad)'}
              </p>
            </div>
          </div>

          {/* Profile Calibration Success Box */}
          {simulatedProfileCreated && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-2 animate-in fade-in">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold font-mono">
                <CheckCircle2 className="w-4 h-4" />
                <span>BEHAVIORAL DNA BASELINE GENERATED</span>
              </div>
              <p className="text-[var(--text-secondary)] leading-relaxed text-[11px]">
                A baseline typing rhythm score of <strong>{Math.max(10, 100 - botRiskScore)}%</strong> and mean flight time of <strong>{avgFlightTime}ms</strong> has been calibrated. Any future account takeover with mismatched biometrics will trigger immediate Step-Up Verification!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
