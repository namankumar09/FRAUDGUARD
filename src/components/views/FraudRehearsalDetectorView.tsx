import React, { useState } from 'react';
import {
  RotateCcw,
  ShieldAlert,
  AlertTriangle,
  Play,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface RehearsalEvent {
  id: string;
  time: string;
  action: string;
  details: string;
  riskPoints: number;
}

export const FraudRehearsalDetectorView: React.FC = () => {
  // Interactive Practice Sandbox State
  const [beneficiary, setBeneficiary] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [events, setEvents] = useState<RehearsalEvent[]>([]);
  const [practiceCancellations, setPracticeCancellations] = useState(0);
  const [limitChecks, setLimitChecks] = useState(0);
  const [amountModifications, setAmountModifications] = useState(0);

  const addEvent = (action: string, details: string, riskPoints: number) => {
    const newEvent: RehearsalEvent = {
      id: Math.random().toString(36).substr(2, 9),
      time: new Date().toLocaleTimeString(),
      action,
      details,
      riskPoints,
    };
    setEvents((prev) => [newEvent, ...prev]);
  };

  const handleAddBeneficiary = () => {
    if (!beneficiary) return;
    addEvent('Add Beneficiary', `Added target beneficiary: ${beneficiary}`, 15);
  };

  const handleCancelTransfer = () => {
    setPracticeCancellations((c) => c + 1);
    addEvent('Cancel Transfer Flow', `User initiated transfer but clicked "Abort/Cancel" on final review modal`, 28);
  };

  const handleCheckLimit = () => {
    setLimitChecks((l) => l + 1);
    addEvent('Check Daily Transfer Limit', `Probed settings/limits page: Daily IMPS Limit = ₹5,00,000`, 22);
  };

  const handleChangeAmount = (newVal: string) => {
    setTransferAmount(newVal);
    setAmountModifications((m) => m + 1);
    if (amountModifications > 1) {
      addEvent('Rehearsal Amount Modification', `Changed tentative transfer sum to ₹${newVal}`, 18);
    }
  };

  const resetPlayground = () => {
    setBeneficiary('');
    setTransferAmount('');
    setEvents([]);
    setPracticeCancellations(0);
    setLimitChecks(0);
    setAmountModifications(0);
  };

  const totalRehearsalRisk = Math.min(
    100,
    practiceCancellations * 32 + limitChecks * 24 + amountModifications * 12 + (events.length > 3 ? 20 : 0)
  );

  const isRehearsalTriggered = practiceCancellations >= 2 || totalRehearsalRisk >= 65;

  const simulateAttackerPlaybook = () => {
    resetPlayground();
    setTimeout(() => {
      setBeneficiary('Unknown Mules Pvt Ltd');
      addEvent('Add Beneficiary', 'Added unverified mule beneficiary: Unknown Mules Pvt Ltd', 15);
    }, 400);

    setTimeout(() => {
      setLimitChecks(1);
      addEvent('Check Daily Transfer Limit', 'Navigated to Account Profile → Probed Daily Max IMPS Limit (₹5,00,000)', 24);
    }, 1000);

    setTimeout(() => {
      setTransferAmount('490000');
      setAmountModifications(1);
      addEvent('Test Amount Input', 'Entered max limit test amount ₹4,90,000', 18);
    }, 1600);

    setTimeout(() => {
      setPracticeCancellations(1);
      addEvent('Cancel Transfer Stage 1', 'Reached OTP screen and aborted without typing OTP', 30);
    }, 2200);

    setTimeout(() => {
      setPracticeCancellations(2);
      addEvent('Cancel Transfer Stage 2', 'Re-entered flow with ₹4,85,000 and canceled at biometric review', 35);
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
    }, 2800);
  };

  return (
    <div id="view-rehearsal-detector" className="p-4 md:p-6 space-y-6 animate-in fade-in">
      {/* Top Banner */}
      <div className="p-4 md:p-5 rounded-2xl bg-gradient-to-r from-amber-50 via-white to-amber-50 dark:from-[#0c1836] dark:via-[#102046] dark:to-[#0d1630] border border-amber-200/70 dark:border-[#21355e] flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xs dark:shadow-xl transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-950 text-amber-300 border border-amber-500/40 flex items-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5" />
              FRAUD REHEARSAL & PRACTICE LOOP DETECTOR
            </span>
            <span className="text-xs text-slate-400 font-mono">• Non-Linear Execution Interception</span>
          </div>
          <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white tracking-tight mt-1">
            Catching Attackers While They "Practice" Before Transferring
          </h2>
          <p className="text-xs md:text-sm text-slate-300 max-w-3xl leading-relaxed mt-1">
            Fraudsters frequently practice transactions before draining funds: adding beneficiaries, probing limits, entering amounts then aborting, or staging OTP screens. <strong>3 practice actions in 10 minutes</strong> triggers an immediate silent hold.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={simulateAttackerPlaybook}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-bold text-xs font-mono shadow-md flex items-center gap-1.5 transition-all"
          >
            <Play className="w-3.5 h-3.5" />
            Auto-Run Attacker Rehearsal Playbook
          </button>
          <button
            onClick={resetPlayground}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-500 hover:text-slate-900 dark:bg-[#14203a] dark:hover:bg-[#1a2c52] dark:border-[#203358] dark:text-slate-400 dark:hover:text-white"
            title="Reset Sandbox"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Alarm Status Banner */}
      {isRehearsalTriggered ? (
        <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-500/60 shadow-xl flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/50 flex items-center justify-center text-rose-300 text-xl font-bold">
              🎭
            </div>
            <div>
              <h3 className="text-sm font-bold text-rose-200 font-mono">
                CRITICAL REHEARSAL PATTERN FLAGGED (REHEARSAL SCORE: {totalRehearsalRisk}/100)
              </h3>
              <p className="text-xs text-rose-300/90 mt-0.5">
                Session triggered <strong>{practiceCancellations} aborted checkout flows</strong> and limit probing within 5 minutes. Account placed in proactive 15-minute cooling hold.
              </p>
            </div>
          </div>
          <span className="px-3 py-1.5 rounded-xl bg-rose-900 text-rose-200 font-mono text-xs font-bold border border-rose-500">
            PROACTIVE HOLD ACTIVE
          </span>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            <div>
              <h4 className="text-xs font-bold text-emerald-300 font-mono">Rehearsal Sensor: NORMAL</h4>
              <p className="text-[11px] text-slate-300">Interact with the practice transfer playground below to test detection thresholds.</p>
            </div>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-bold">
            Risk: {totalRehearsalRisk}%
          </span>
        </div>
      )}

      {/* Main Grid: Interactive Sandbox (Left) & Real-Time Event Audit (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Practice Playground (6 cols) */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs dark:bg-[#0c1427] dark:border-[#1b2b4c] dark:shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1b2b4c]">
            <h3 className="text-xs font-mono font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Interactive Practice Transfer Sandbox
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Step-by-step Probing</span>
          </div>

          <div className="space-y-3.5 text-xs">
            {/* Step 1: Beneficiary */}
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                1. Target Beneficiary / Payee
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Mule Account 9908"
                  value={beneficiary}
                  onChange={(e) => setBeneficiary(e.target.value)}
                  className="flex-1 bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 dark:bg-[#080f22] dark:border-[#1e2f54] dark:text-white focus:outline-none focus:border-sky-400"
                />
                <button
                  onClick={handleAddBeneficiary}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 dark:bg-[#14203a] dark:hover:bg-[#1a2c52] dark:text-slate-200 dark:border-[#203358] font-mono text-xs"
                >
                  Add Payee
                </button>
              </div>
            </div>

            {/* Step 2: Probing Limit */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 dark:bg-[#080e1e] dark:border-[#1a2846] flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono text-slate-400 block">Probe Max Account Limits</span>
                <span className="text-xs text-slate-200">Daily IMPS Limit: ₹5,00,000 / day</span>
              </div>
              <button
                onClick={handleCheckLimit}
                className="px-3 py-1.5 rounded-lg bg-amber-950/80 hover:bg-amber-900 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold"
              >
                Inspect Limits (Probed: {limitChecks}x)
              </button>
            </div>

            {/* Step 3: Enter Amount & Abort */}
            <div>
              <label className="block text-slate-300 font-medium mb-1 flex justify-between">
                <span>2. Transfer Sum (₹)</span>
                <span className="text-[10px] font-mono text-slate-500">
                  Modifications: {amountModifications}x
                </span>
              </label>
              <input
                type="number"
                placeholder="e.g. 480000"
                value={transferAmount}
                onChange={(e) => handleChangeAmount(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 dark:bg-[#080f22] dark:border-[#1e2f54] dark:text-white focus:outline-none focus:border-sky-400 font-mono"
              />
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleCancelTransfer}
                className="py-2.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 text-rose-300 font-bold text-xs font-mono transition-all flex items-center justify-center gap-1.5"
              >
                Simulate Abort/Cancel (Count: {practiceCancellations})
              </button>
              <button
                onClick={() => addEvent('Execute Payment', `Initiated final payment authorization for ₹${transferAmount || 0}`, 50)}
                className="py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                Submit Payment
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Rehearsal Audit Trail (6 cols) */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs dark:bg-[#0c1427] dark:border-[#1b2b4c] dark:shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1b2b4c]">
            <h3 className="text-xs font-mono font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              Real-Time Practice Action Audit Log
            </h3>
            <span className="text-[10px] font-mono text-slate-400">{events.length} Actions Logged</span>
          </div>

          <div className="space-y-2.5 max-h-[380px] overflow-y-auto custom-scrollbar pr-1">
            {events.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs border border-dashed border-slate-300 dark:border-[#1e2f54] rounded-xl">
                No practice actions recorded yet. Use the playground on the left or click "Auto-Run Attacker Playbook".
              </div>
            ) : (
              events.map((ev) => (
                <div
                  key={ev.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 dark:bg-[#091122] dark:border-[#1c2c4d] flex items-start justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{ev.action}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{ev.time}</span>
                    </div>
                    <p className="text-slate-300 text-[11px] mt-1">{ev.details}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/40 text-[10px] font-mono font-bold shrink-0">
                    +{ev.riskPoints} Risk
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
