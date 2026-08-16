import React from 'react';
import {
  X,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Clock,
  User,
  Smartphone,
  Zap,
  ArrowRight,
  TrendingDown,
  Layers,
  FileText,
  Copy,
  Info,
  Scale,
  Lock,
  Unlock,
  KeyRound,
  ShieldCheck
} from 'lucide-react';
import { TransactionRecord } from '../../types/fraud';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { useTransactionAction } from '../../context/TransactionActionContext';
import { useContainment } from '../../context/ContainmentContext';
import { useTheme } from '../../context/ThemeContext';

interface TransactionDetailModalProps {
  transaction: TransactionRecord | null;
  onClose: () => void;
  onTakeAction?: (txnId: string, action: 'QUARANTINE' | 'STEP_UP' | 'APPROVE') => void;
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  transaction,
  onClose,
  onTakeAction,
}) => {
  const [activeTab, setActiveTab] = React.useState<'overview' | 'precursor' | 'dna' | 'counterfactual'>('overview');
  const [copied, setCopied] = React.useState(false);

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const { actionRecords, requestAction } = useTransactionAction();
  const { isSessionContained, requestContainSession, requestReleaseSession, getContainmentInfo } = useContainment();

  if (!transaction) return null;

  const txnId = transaction.id || transaction.transactionRef;
  const sessionId = (transaction as any).sessionId || transaction.customer?.id || txnId;
  const recordedAction = actionRecords[txnId];
  const isContained = isSessionContained(sessionId);
  const containmentRecord = getContainmentInfo(sessionId);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const executeAction = (action: 'APPROVE' | 'STEP_UP' | 'QUARANTINE') => {
    requestAction(
      {
        id: txnId,
        transactionRef: transaction.transactionRef || txnId,
        customerName: transaction.customer?.name,
        amount: transaction.amount,
        riskScore: transaction.riskScore?.totalScore || 80,
      },
      action
    );
    if (onTakeAction) {
      onTakeAction(txnId, action);
    }
  };

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'high':
        return (
          <span className="px-2.5 py-1 rounded-full bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
            HIGH RISK ({transaction.riskScore.totalScore}/100) 🔴
          </span>
        );
      case 'suspicious':
        return (
          <span className="px-2.5 py-1 rounded-full bg-amber-950/80 border border-amber-500/50 text-amber-300 text-xs font-mono font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            SUSPICIOUS ({transaction.riskScore.totalScore}/100) 🟡
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            LOW RISK ({transaction.riskScore.totalScore}/100) 🟢
          </span>
        );
    }
  };

  const radarData = [
    {
      subject: 'Typing Rhythm',
      Owner: transaction.dnaMutation.ownerBaselineDna.typingRhythmScore,
      CurrentSession: transaction.dnaMutation.currentSessionDna.typingRhythmScore,
    },
    {
      subject: 'Hesitation Latency',
      Owner: Math.min(100, transaction.dnaMutation.ownerBaselineDna.averageHesitationSec * 25),
      CurrentSession: Math.min(100, transaction.dnaMutation.currentSessionDna.averageHesitationSec * 25),
    },
    {
      subject: 'Sequence Regularity',
      Owner: transaction.dnaMutation.ownerBaselineDna.transactionSequencePredictability,
      CurrentSession: transaction.dnaMutation.currentSessionDna.transactionSequencePredictability,
    },
    {
      subject: 'Manual Input (vs Paste)',
      Owner: 100 - transaction.dnaMutation.ownerBaselineDna.clipboardPasteAffinity,
      CurrentSession: 100 - transaction.dnaMutation.currentSessionDna.clipboardPasteAffinity,
    },
    {
      subject: 'Low Rehearsal Tendency',
      Owner: 100 - transaction.dnaMutation.ownerBaselineDna.rehearsalTendency,
      CurrentSession: 100 - transaction.dnaMutation.currentSessionDna.rehearsalTendency,
    },
  ];

  return (
    <div
      id="txn-detail-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-white dark:bg-[#0b1428] border border-slate-200 dark:border-[#22355b] rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl text-slate-800 dark:text-slate-200 overflow-hidden transition-colors">
        {/* Modal Header */}
        <div className="p-4 md:p-6 border-b border-slate-200 dark:border-[#1c2c4d] bg-slate-50 dark:bg-[#070d1e] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-sky-500/10 border border-blue-200 dark:border-sky-500/30 flex items-center justify-center text-blue-600 dark:text-sky-300">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-base md:text-lg font-bold text-slate-900 dark:text-white font-mono">
                  Forensic Dossier: {transaction.transactionRef}
                </h2>
                <button
                  onClick={() => handleCopy(transaction.transactionRef)}
                  className="text-slate-400 hover:text-blue-600 dark:hover:text-sky-300 p-1 text-xs"
                  title="Copy Ref"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                {copied && <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Copied!</span>}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                <span>{transaction.timestamp}</span>
                <span>•</span>
                <span>Customer: <strong className="text-slate-800 dark:text-slate-200">{transaction.customer.name}</strong> ({transaction.customer.id})</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {getRiskBadge(transaction.riskScore.riskLevel)}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#142038] dark:hover:bg-[#1b2b4d] text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-slate-200 dark:border-[#1c2c4d] bg-white dark:bg-[#080f22] flex gap-2 overflow-x-auto">
          {[
            { id: 'overview', label: '1. Forensic Signals & Explainability', icon: Layers },
            { id: 'precursor', label: '2. Precursor Intent Sequence', icon: Zap },
            { id: 'dna', label: '3. Behavioral DNA Mutation Radar', icon: User },
            { id: 'counterfactual', label: '4. Counterfactual "What-If" Matrix', icon: Scale },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 whitespace-nowrap transition-all ${
                  isActive
                    ? 'border-blue-600 dark:border-sky-400 text-blue-600 dark:text-sky-300 bg-blue-50/50 dark:bg-sky-950/20'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-50/50 dark:bg-[#091124]">
          {/* TAB 1: OVERVIEW & EXPLAINABILITY */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* PRIMARY FLAGGED REASONS - "Why was this flagged?" */}
              <div className="p-4 rounded-xl bg-rose-50 dark:bg-gradient-to-r dark:from-rose-950/50 dark:via-[#101a33] dark:to-purple-950/40 border border-rose-200 dark:border-rose-500/40">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  <h3 className="text-xs font-mono font-bold tracking-wide text-rose-800 dark:text-rose-300 uppercase">
                    Forensic Explanation Layer: Why Was This Flagged?
                  </h3>
                </div>
                <div className="space-y-2 mt-2">
                  {transaction.flaggedReasons.map((reason, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-rose-900 dark:text-rose-100/90 font-medium">
                      <span className="text-rose-600 dark:text-rose-400 mt-0.5">•</span>
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
                {transaction.discoveredTellCode && (
                  <div className="mt-3 pt-2.5 border-t border-rose-200 dark:border-rose-500/30 flex items-center justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-300">Discovered Behavioral Tell Marker:</span>
                    <span className="font-mono px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-200 border border-purple-300 dark:border-purple-500/40 font-bold">
                      {transaction.discoveredTellCode} (Rapid Rehearsal Transfer)
                    </span>
                  </div>
                )}
              </div>

              {/* Transaction Key Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-white dark:bg-[#0e1933] border border-slate-200 dark:border-[#1b2b4c] shadow-xs">
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Transfer Amount</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white font-mono mt-0.5 tabular-nums">
                    ₹{transaction.amount.toLocaleString('en-IN')}
                  </p>
                  <span className="text-[10px] text-amber-600 dark:text-amber-300 font-medium">97.6% of wallet balance</span>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-[#0e1933] border border-slate-200 dark:border-[#1b2b4c] shadow-xs">
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Identity Confidence</p>
                  <p className="text-lg font-bold text-rose-600 dark:text-rose-400 font-mono mt-0.5">
                    {transaction.operatorConfidence}%
                  </p>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Owner Biometric Match</span>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-[#0e1933] border border-slate-200 dark:border-[#1b2b4c] shadow-xs">
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Device Collision Index</p>
                  <p className="text-lg font-bold text-amber-600 dark:text-amber-300 font-mono mt-0.5">
                    {transaction.deviceCollisionsCount} Accounts
                  </p>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Linked to Flagged Subnet</span>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-[#0e1933] border border-slate-200 dark:border-[#1b2b4c] shadow-xs">
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Fraud Gravity Score</p>
                  <p className="text-lg font-bold text-purple-600 dark:text-purple-300 font-mono mt-0.5">
                    {transaction.riskScore.fraudGravityScore}/100
                  </p>
                  <span className="text-[10px] text-purple-600 dark:text-purple-400">Critical Inward Pull</span>
                </div>
              </div>

              {/* DYNAMIC RISK SCORE BREAKDOWN TABLE */}
              <div>
                <h3 className="text-xs font-mono font-bold text-blue-700 dark:text-sky-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Dynamic Risk Score Component Breakdown</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">Additive Weighting Model</span>
                </h3>
                <div className="border border-slate-200 dark:border-[#1b2b4c] rounded-xl overflow-hidden bg-white dark:bg-[#0a1226] shadow-xs">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-[#0e1a38] text-slate-600 dark:text-slate-400 font-mono text-[11px] border-b border-slate-200 dark:border-[#1b2b4c]">
                        <th className="p-2.5">Signal Component</th>
                        <th className="p-2.5">Category</th>
                        <th className="p-2.5 text-right">Contribution</th>
                        <th className="p-2.5">Forensic Micro-Evidence</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-[#162340]">
                      {transaction.riskScore.breakdown.map((sig, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-[#111e3d] transition-colors">
                          <td className="p-2.5 font-medium text-slate-900 dark:text-white">{sig.signalName}</td>
                          <td className="p-2.5">
                            <span className="capitalize px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-[#162446] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#22355e]">
                              {sig.category}
                            </span>
                          </td>
                          <td className="p-2.5 text-right font-mono font-bold text-rose-600 dark:text-rose-400">
                            +{sig.contribution}
                          </td>
                          <td className="p-2.5 text-slate-700 dark:text-slate-300">
                            <p className="font-medium text-slate-800 dark:text-slate-200">{sig.details}</p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">{sig.microEvidence}</p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Beneficiary & Routing Dossier */}
              <div className="p-4 rounded-xl bg-white dark:bg-[#0a1329] border border-slate-200 dark:border-[#1c2c4d] grid grid-cols-1 md:grid-cols-2 gap-4 text-xs shadow-xs">
                <div>
                  <h4 className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">Target Beneficiary</h4>
                  <p className="text-slate-900 dark:text-white font-bold text-sm mt-1">{transaction.beneficiary.name}</p>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5 font-mono">{transaction.beneficiary.bankName} • {transaction.beneficiary.accountNumberMasked}</p>
                  <span className="inline-block mt-2 px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/40 text-[10px] font-mono font-medium">
                    New Beneficiary (Added {transaction.beneficiary.addedTimestamp})
                  </span>
                </div>
                <div>
                  <h4 className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">Preemptive Intervention</h4>
                  <p className="text-blue-700 dark:text-sky-300 font-semibold mt-1">
                    {transaction.nextActionPrediction.predictedAction}
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                    {transaction.nextActionPrediction.preemptiveInterventionSuggested}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRECURSOR SEQUENCE TIMELINE */}
          {activeTab === 'precursor' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-500/30 text-amber-800 dark:text-amber-200 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>
                    <strong>Fraud "Precursor" Detector:</strong> Detected intent sequence 18 seconds before transaction execution.
                  </span>
                </div>
                <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/60 border border-amber-300 dark:border-amber-500/40">
                  7 Precursor Actions
                </span>
              </div>

              <div className="space-y-3 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-slate-200 dark:before:bg-[#1f3054]">
                {transaction.precursorTimeline.map((item) => (
                  <div key={item.id} className="flex items-start gap-4 relative">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono text-xs font-bold shrink-0 z-10 ${
                        item.isFlaggedPrecursor
                          ? 'bg-rose-600 text-white dark:bg-rose-950 dark:border dark:border-rose-500 dark:text-rose-300 shadow-xs'
                          : 'bg-white dark:bg-[#0f1b36] border border-slate-200 dark:border-[#21355c] text-slate-500 dark:text-slate-400 shadow-xs'
                      }`}
                    >
                      {item.timestampOffsetSec}s
                    </div>
                    <div
                      className={`flex-1 p-3 rounded-xl border shadow-xs ${
                        item.isFlaggedPrecursor
                          ? 'bg-rose-50/70 dark:bg-[#151c36] border-rose-200 dark:border-rose-500/40 text-slate-900 dark:text-slate-200'
                          : 'bg-white dark:bg-[#0c152b] border-slate-200 dark:border-[#1b2b4c] text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                          #{item.actionSequence} {item.actionType}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                            Dwell: {item.durationMs}ms
                          </span>
                          <span
                            className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                              item.anomalyScore > 70
                                ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-500/40'
                                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                            }`}
                          >
                            Risk: {item.anomalyScore}%
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 font-medium">{item.behaviorNote}</p>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">Target: {item.targetElement}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: BEHAVIORAL DNA MUTATION RADAR */}
          {activeTab === 'dna' && (
            <div className="space-y-6">
              <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-500/30 text-purple-900 dark:text-purple-200 text-xs flex items-center justify-between">
                <div>
                  <strong className="text-purple-800 dark:text-purple-300">Living Behavioral DNA Mutation:</strong> 78% Divergence from genuine account owner historical baseline.
                </div>
                <span className="px-2.5 py-1 rounded bg-purple-100 dark:bg-purple-900/60 font-mono font-bold text-purple-800 dark:text-purple-200 border border-purple-300 dark:border-purple-500/40">
                  MUTATION: {transaction.dnaMutation.overallMutationPercent}%
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Radar Chart */}
                <div className="h-64 bg-white dark:bg-[#091124] rounded-xl border border-slate-200 dark:border-[#1c2c4d] p-2 flex flex-col items-center justify-center shadow-xs">
                  <div className="flex gap-4 text-xs mb-1 font-mono">
                    <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Owner DNA
                    </span>
                    <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-medium">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Current Session
                    </span>
                  </div>
                  <ResponsiveContainer width="100%" height="90%">
                    <RadarChart data={radarData}>
                      <PolarGrid stroke={isDark ? '#1e293b' : '#e2e8f0'} />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: isDark ? '#94a3b8' : '#475569', fontSize: 10 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} stroke={isDark ? '#475569' : '#cbd5e1'} />
                      <Radar name="Owner" dataKey="Owner" stroke="#10b981" fill="#10b981" fillOpacity={0.25} />
                      <Radar name="CurrentSession" dataKey="CurrentSession" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.4} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                {/* Key Divergences List */}
                <div className="space-y-3">
                  <h4 className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Divergence Telemetry Breakdown
                  </h4>
                  {transaction.dnaMutation.keyDivergences.map((div, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-white dark:bg-[#0e1933] border border-slate-200 dark:border-[#1c2c4d] text-xs shadow-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-slate-900 dark:text-white">{div.metric}</span>
                        <span className="text-rose-600 dark:text-rose-400 font-mono font-bold">+{div.deviation}% shift</span>
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-mono">
                        <span>Baseline: <strong className="text-emerald-600 dark:text-emerald-400">{div.historical}</strong></span>
                        <span>Current: <strong className="text-rose-600 dark:text-rose-400">{div.current}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: COUNTERFACTUAL "WHAT-IF" SIMULATOR */}
          {activeTab === 'counterfactual' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-sky-950/30 border border-blue-200 dark:border-sky-500/30 text-blue-900 dark:text-sky-200 text-xs">
                <strong>Counterfactual Simulator:</strong> "What would have happened if we didn't intervene?" Simulates downstream financial loss exposure and customer friction for each decision branch.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {transaction.counterfactuals.map((sim, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border flex flex-col justify-between shadow-xs ${
                      sim.decision === 'approve'
                        ? 'bg-rose-50/70 dark:bg-rose-950/20 border-rose-200 dark:border-rose-500/40 text-slate-900 dark:text-slate-200'
                        : sim.decision === 'block'
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-500/40 text-slate-900 dark:text-slate-200'
                        : 'bg-indigo-50/70 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-500/40 text-slate-900 dark:text-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white font-mono">{sim.label}</h4>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                            sim.decision === 'approve'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-500'
                              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500'
                          }`}
                        >
                          {sim.decision}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 mt-2 leading-relaxed">{sim.explanation}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200 dark:border-white/10 space-y-1.5 text-xs font-mono">
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Downstream Loss Exposure:</span>
                        <span className="font-bold text-rose-600 dark:text-rose-400">₹{sim.estimatedDownstreamExposure.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Predicted Fraud Probability:</span>
                        <span className="font-bold text-amber-600 dark:text-amber-300">{sim.predictedFraudProbability}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Risk Reduction:</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">+{sim.riskReductionPercent}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Network Contagion Accounts:</span>
                        <span className="text-slate-800 dark:text-slate-200">{sim.predictedNetworkContagionAccounts}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 md:p-5 border-t border-slate-200 dark:border-[#1c2c4d] bg-slate-50 dark:bg-[#070d1e] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="text-xs text-slate-600 dark:text-slate-400 font-mono">
              Status: <span className="text-slate-900 dark:text-white font-bold">{transaction.status}</span>
            </div>

            {recordedAction && (
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-mono text-xs font-bold ${
                  recordedAction.action === 'APPROVE'
                    ? 'bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/30'
                    : recordedAction.action === 'STEP_UP'
                    ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                    : 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/30'
                }`}
              >
                {recordedAction.action === 'APPROVE' && <CheckCircle2 className="w-3.5 h-3.5" />}
                {recordedAction.action === 'STEP_UP' && <KeyRound className="w-3.5 h-3.5" />}
                {recordedAction.action === 'QUARANTINE' && <ShieldAlert className="w-3.5 h-3.5" />}
                Recorded Action: {recordedAction.action}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Contain Session Toggle */}
            <button
              onClick={() => {
                if (isContained) {
                  requestReleaseSession(sessionId);
                } else {
                  requestContainSession({
                    sessionId,
                    sessionRef: (transaction as any).sessionId || sessionId,
                    customerName: transaction.customer?.name,
                    riskTier: transaction.riskScore?.level || 'high',
                  });
                }
              }}
              className={`px-3 py-2 rounded-lg font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                isContained
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 border border-slate-300 dark:border-slate-700'
                  : 'bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 border border-amber-300 dark:border-amber-500/40 text-amber-800 dark:text-amber-300'
              }`}
            >
              {isContained ? (
                <>
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Uncontain Session</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Contain Active Session</span>
                </>
              )}
            </button>

            <button
              onClick={() => executeAction('APPROVE')}
              className="px-3.5 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950 dark:hover:bg-emerald-900 border border-emerald-200 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-300 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Approve (Override)</span>
            </button>

            <button
              onClick={() => executeAction('STEP_UP')}
              className="px-3.5 py-2 rounded-lg bg-amber-50 hover:bg-amber-100 dark:bg-amber-950 dark:hover:bg-amber-900 border border-amber-200 dark:border-amber-500/40 text-amber-700 dark:text-amber-300 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Trigger Step-Up Challenge</span>
            </button>

            <button
              onClick={() => executeAction('QUARANTINE')}
              className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Quarantine & Hard Block</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
