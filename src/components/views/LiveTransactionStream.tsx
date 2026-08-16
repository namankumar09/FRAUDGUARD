import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Zap,
  Sparkles,
  Activity,
  Plus,
  RefreshCw,
  X,
  LayoutGrid,
  List,
  RotateCcw,
  SlidersHorizontal,
  ExternalLink,
  AlertOctagon,
  ArrowUpDown,
} from 'lucide-react';
import { TransactionRecord } from '../../types/fraud';
import { MOCK_TRANSACTIONS } from '../../data/mockFraudData';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface LiveTransactionStreamProps {
  transactions?: TransactionRecord[];
  onSelectTransaction?: (txn: TransactionRecord) => void;
}

// Transform any backend DB transaction or mock transaction into a rich TransactionRecord
function mapToTransactionRecord(item: any, fallbackIndex = 0): TransactionRecord {
  const fallback = MOCK_TRANSACTIONS[fallbackIndex % MOCK_TRANSACTIONS.length];
  const isHigh = item.riskLevel === 'high' || item.riskLevel === 'critical' || (Number(item.riskScore) >= 60);
  const isSuspicious = !isHigh && (item.riskLevel === 'suspicious' || item.riskLevel === 'medium' || (Number(item.riskScore) >= 30));
  const totalScore = typeof item.riskScore === 'object' && item.riskScore?.totalScore !== undefined
    ? Number(item.riskScore.totalScore)
    : Number(item.riskScore ?? (isHigh ? 88 : isSuspicious ? 48 : 14));

  const country = item.country || item.behavioralBiometrics?.deviceFingerprint?.ipCountry || fallback.behavioralBiometrics?.deviceFingerprint?.ipCountry || 'India';
  const paymentMethod = item.paymentMethod || item.channel || 'UPI';

  return {
    id: item.id || `tx-${Date.now()}-${fallbackIndex}`,
    transactionRef: item.transactionRef || item.sessionCode || item.id || `TXN-${10000 + fallbackIndex}`,
    sessionCode: item.sessionCode || item.transactionRef || item.id,
    time: item.time || item.timestamp || 'Just now',
    timestamp: item.timestamp || item.time || 'Just now',
    channel: paymentMethod,
    accountMasked: item.accountMasked || item.beneficiaryAccount || 'Savings ...4182',
    deviceName: item.deviceType || item.deviceName || 'Android Mobile',
    ipAddress: item.ipAddress || '103.21.58.12',
    amount: Number(item.amount || 25000),
    currency: item.currency || 'INR',
    country: country,
    paymentMethod: paymentMethod,
    status: item.status || (isHigh ? 'AUTO_BLOCKED' : 'PENDING_REVIEW'),
    decision: item.decision || (isHigh ? 'QUARANTINE' : isSuspicious ? 'STEP_UP' : 'APPROVE'),
    customer: {
      id: item.customerId || item.customer?.id || `cust-${1000 + fallbackIndex}`,
      name: item.customerName || item.customer?.name || 'Rahul Verma',
      email: item.customerEmail || item.customer?.email || 'customer.secure@bank.in',
      accountAgeDays: item.customer?.accountAgeDays || 180,
      tier: item.customer?.tier || 'Retail',
      avatarBg: item.customer?.avatarBg || (isHigh ? 'bg-rose-950 text-rose-300 border border-rose-500/30' : 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'),
    },
    beneficiary: {
      name: item.beneficiaryName || item.beneficiary?.name || 'Instant Remittance Payee',
      accountNumberMasked: item.beneficiaryAccount || item.beneficiary?.accountNumberMasked || '•••• •••• 5521',
      bankName: item.beneficiary?.bankName || 'Axis Express Net',
      addedTimestamp: item.beneficiary?.addedTimestamp || '5 mins ago',
      isNewBeneficiary: item.isNewBeneficiary !== undefined ? !!item.isNewBeneficiary : (item.beneficiary?.isNewBeneficiary ?? true),
    },
    riskScore: {
      totalScore,
      riskLevel: isHigh ? 'high' : isSuspicious ? 'suspicious' : 'low',
      primaryDriver: item.primaryDriver || item.riskScore?.primaryDriver || (isHigh ? 'Rapid Rehearsal Transfer & Automated Paste Spike' : 'Standard Baseline Profile'),
      fraudGravityScore: item.riskScore?.fraudGravityScore ?? (isHigh ? 92 : isSuspicious ? 52 : 18),
      confidence: item.riskScore?.confidence ?? 0.95,
      breakdown: (item.signals && item.signals.length > 0)
        ? item.signals.map((s: any) => ({
            signalName: s.signalName || 'Risk Indicator',
            category: s.category || 'behavioral',
            contribution: Number(s.contribution || 15),
            status: s.severity === 'critical' ? 'critical' : s.severity === 'elevated' ? 'elevated' : 'normal',
            details: s.details || 'Biometric variance detected',
            microEvidence: s.microEvidence || 'Telemetry anomaly',
          }))
        : (item.riskScore?.breakdown || fallback.riskScore.breakdown),
    },
    flaggedReasons: item.flaggedReasons || (isHigh ? [item.primaryDriver || 'Unusual payment anomaly detected'] : ['Parameters within baseline tolerance']),
    operatorConfidence: item.operatorConfidence ?? (isHigh ? 24 : 92),
    deviceCollisionsCount: item.deviceCollisionsCount ?? (isHigh ? 2 : 0),
    rehearsalDetected: item.rehearsalDetected ?? isHigh,
    fraudGravityVectors: item.fraudGravityVectors || fallback.fraudGravityVectors,
    precursorTimeline: item.precursorTimeline || fallback.precursorTimeline,
    dnaMutation: item.dnaMutation || fallback.dnaMutation,
    counterfactuals: item.counterfactuals || fallback.counterfactuals,
    nextActionPrediction: item.nextActionPrediction || fallback.nextActionPrediction,
    behavioralBiometrics: {
      typingSpeedWPM: item.behavioralBiometrics?.typingSpeedWPM ?? 42,
      meanKeyHoldDurationMs: item.behavioralBiometrics?.meanKeyHoldDurationMs ?? 95,
      flightTimeVarianceMs: item.behavioralBiometrics?.flightTimeVarianceMs ?? 18,
      backspaceCount: item.behavioralBiometrics?.backspaceCount ?? (isHigh ? 6 : 1),
      deleteCount: item.behavioralBiometrics?.deleteCount ?? 0,
      pasteCount: item.behavioralBiometrics?.pasteCount ?? (isHigh ? 3 : 1),
      pasteLatencyMs: item.clipboardPasteLatencySec ? Math.round(item.clipboardPasteLatencySec * 1000) : (item.behavioralBiometrics?.pasteLatencyMs ?? (isHigh ? 340 : 1850)),
      fieldRevisits: item.behavioralBiometrics?.fieldRevisits ?? (isHigh ? 3 : 0),
      mouseVelocityMean: item.behavioralBiometrics?.mouseVelocityMean ?? 480,
      mouseJitterScore: item.behavioralBiometrics?.mouseJitterScore ?? (isHigh ? 78 : 12),
      scrollJerkiness: item.behavioralBiometrics?.scrollJerkiness ?? (isHigh ? 65 : 15),
      hesitationPauseCount: item.behavioralBiometrics?.hesitationPauseCount ?? (isHigh ? 4 : 1),
      meanHesitationSec: item.behavioralBiometrics?.meanHesitationSec ?? (isHigh ? 3.2 : 0.8),
      formSequenceDeviationScore: item.behavioralBiometrics?.formSequenceDeviationScore ?? (isHigh ? 82 : 12),
      repeatedCorrections: item.failedLoginAttemptsRecent ?? (item.behavioralBiometrics?.repeatedCorrections ?? (isHigh ? 3 : 0)),
      deviceFingerprint: {
        browser: item.behavioralBiometrics?.deviceFingerprint?.browser || (isHigh ? 'Chrome Headless 122' : 'Chrome Mobile 122'),
        os: item.behavioralBiometrics?.deviceFingerprint?.os || (item.deviceType?.includes('Android') ? 'Android 14' : 'Windows 11'),
        screenResolution: item.behavioralBiometrics?.deviceFingerprint?.screenResolution || '1080x2400',
        hardwareConcurrency: item.behavioralBiometrics?.deviceFingerprint?.hardwareConcurrency || 8,
        touchSupported: item.behavioralBiometrics?.deviceFingerprint?.touchSupported ?? true,
        ipCountry: country,
        asn: item.behavioralBiometrics?.deviceFingerprint?.asn || (isHigh ? 'AS9009 M247 VPN' : 'AS55836 Reliance Jio'),
        canvasHash: item.deviceId || item.behavioralBiometrics?.deviceFingerprint?.canvasHash || 'cv_89f02b',
        incognitoMode: item.behavioralBiometrics?.deviceFingerprint?.incognitoMode ?? isHigh,
      },
    },
  };
}

export const LiveTransactionStream: React.FC<LiveTransactionStreamProps> = ({
  transactions: propTransactions,
  onSelectTransaction,
}) => {
  const { user, isReadOnly } = useAuth();
  const [rawTransactions, setRawTransactions] = useState<TransactionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTxn, setSelectedTxn] = useState<TransactionRecord | null>(null);

  // View Mode: Split Dossier view or Dense Table view
  const [viewMode, setViewMode] = useState<'split' | 'table'>('split');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<'all' | 'high' | 'suspicious' | 'low'>('all');
  const [selectedDecisionFilter, setSelectedDecisionFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [selectedCountryFilter, setSelectedCountryFilter] = useState<string>('all');
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>('all');
  const [selectedAmountFilter, setSelectedAmountFilter] = useState<string>('all');
  const [selectedPaymentMethodFilter, setSelectedPaymentMethodFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'highest_risk' | 'highest_amount' | 'lowest_risk'>('newest');

  // AI Explanation State
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Action feedback message
  const [actionToast, setActionToast] = useState<{ message: string; type: 'success' | 'warn' | 'error' } | null>(null);

  // Create / Test New Transaction Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCustName, setNewCustName] = useState('Rahul Verma');
  const [newCustEmail, setNewCustEmail] = useState('rahul.verma@example.com');
  const [newCustCountry, setNewCustCountry] = useState('India');
  const [newAmount, setNewAmount] = useState('75000');
  const [newBeneficiary, setNewBeneficiary] = useState('CryptoNode Global FX');
  const [newPaymentMethod, setNewPaymentMethod] = useState('UPI');
  const [newPasteLatency, setNewPasteLatency] = useState(350);
  const [newHesitations, setNewHesitations] = useState(4);
  const [newIsNewDevice, setNewIsNewDevice] = useState(true);
  const [newIsVpn, setNewIsVpn] = useState(true);
  const [newFailedLogins, setNewFailedLogins] = useState(3);
  const [isCreatingTxn, setIsCreatingTxn] = useState(false);

  const showToast = (message: string, type: 'success' | 'warn' | 'error' = 'success') => {
    setActionToast({ message, type });
    setTimeout(() => setActionToast(null), 3500);
  };

  // Load Transactions from Backend Database
  const loadTransactions = async () => {
    setIsLoading(true);
    try {
      // Build query params
      const params: any = {
        limit: 100,
        sort: sortBy,
      };

      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (selectedRiskFilter !== 'all') params.riskLevel = selectedRiskFilter;
      if (selectedDecisionFilter !== 'all') params.decision = selectedDecisionFilter;
      if (selectedStatusFilter !== 'all') params.status = selectedStatusFilter;
      if (selectedCountryFilter !== 'all') params.country = selectedCountryFilter;
      if (selectedPaymentMethodFilter !== 'all') params.paymentMethod = selectedPaymentMethodFilter;
      if (selectedDateFilter !== 'all') params.dateRange = selectedDateFilter;

      if (selectedAmountFilter === '<25k') {
        params.maxAmount = 25000;
      } else if (selectedAmountFilter === '25k-100k') {
        params.minAmount = 25000;
        params.maxAmount = 100000;
      } else if (selectedAmountFilter === '>100k') {
        params.minAmount = 100000;
      }

      const res = await api.getTransactions(params);

      if (res.success && Array.isArray(res.transactions) && res.transactions.length > 0) {
        const mapped = res.transactions.map((t: any, idx: number) => mapToTransactionRecord(t, idx));
        setRawTransactions(mapped);
        if (!selectedTxn && mapped.length > 0) {
          setSelectedTxn(mapped[0]);
        } else if (selectedTxn) {
          const matched = mapped.find((t: TransactionRecord) => t.id === selectedTxn.id);
          if (matched) setSelectedTxn(matched);
        }
      } else if (propTransactions && propTransactions.length > 0) {
        setRawTransactions(propTransactions);
        if (!selectedTxn) setSelectedTxn(propTransactions[0]);
      } else {
        const fallbackList = MOCK_TRANSACTIONS.map((t, i) => mapToTransactionRecord(t, i));
        setRawTransactions(fallbackList);
        if (!selectedTxn) setSelectedTxn(fallbackList[0]);
      }
    } catch (err) {
      console.warn('LiveTransactionStream fetch warning, using fallback dataset:', err);
      if (propTransactions && propTransactions.length > 0) {
        setRawTransactions(propTransactions);
        if (!selectedTxn) setSelectedTxn(propTransactions[0]);
      } else {
        const fallbackList = MOCK_TRANSACTIONS.map((t, i) => mapToTransactionRecord(t, i));
        setRawTransactions(fallbackList);
        if (!selectedTxn) setSelectedTxn(fallbackList[0]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Sync when filters change
  useEffect(() => {
    loadTransactions();
  }, [
    searchQuery,
    selectedRiskFilter,
    selectedDecisionFilter,
    selectedStatusFilter,
    selectedCountryFilter,
    selectedDateFilter,
    selectedAmountFilter,
    selectedPaymentMethodFilter,
    sortBy,
  ]);

  // Client-Side Multi-Filter Computation for instant fluid search & filter changes
  const filteredTransactions = useMemo(() => {
    let list = [...rawTransactions];

    // 1. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((t) => {
        const idMatch = t.id?.toLowerCase().includes(q) || t.transactionRef?.toLowerCase().includes(q) || t.sessionCode?.toLowerCase().includes(q);
        const custMatch = t.customer?.name?.toLowerCase().includes(q) || t.customer?.id?.toLowerCase().includes(q) || t.customer?.email?.toLowerCase().includes(q);
        const beneMatch = t.beneficiary?.name?.toLowerCase().includes(q) || t.beneficiary?.accountNumberMasked?.toLowerCase().includes(q);
        const countryMatch = (t.country || t.behavioralBiometrics?.deviceFingerprint?.ipCountry || '').toLowerCase().includes(q);
        const methodMatch = (t.channel || t.paymentMethod || '').toLowerCase().includes(q);
        const driverMatch = t.riskScore?.primaryDriver?.toLowerCase().includes(q);
        const ipMatch = t.ipAddress?.includes(q);
        return idMatch || custMatch || beneMatch || countryMatch || methodMatch || driverMatch || ipMatch;
      });
    }

    // 2. Risk Level
    if (selectedRiskFilter !== 'all') {
      list = list.filter((t) => {
        if (selectedRiskFilter === 'high') {
          return t.riskScore.riskLevel === 'high' || t.riskScore.totalScore >= 60;
        }
        if (selectedRiskFilter === 'suspicious') {
          return (t.riskScore.riskLevel === 'suspicious' || (t.riskScore.totalScore >= 30 && t.riskScore.totalScore < 60)) && t.riskScore.riskLevel !== 'high';
        }
        if (selectedRiskFilter === 'low') {
          return t.riskScore.riskLevel === 'low' || t.riskScore.totalScore < 30;
        }
        return true;
      });
    }

    // 3. Decision Filter
    if (selectedDecisionFilter !== 'all') {
      list = list.filter((t) => t.decision === selectedDecisionFilter);
    }

    // 4. Status Filter
    if (selectedStatusFilter !== 'all') {
      list = list.filter((t) => t.status === selectedStatusFilter);
    }

    // 5. Country Filter
    if (selectedCountryFilter !== 'all') {
      list = list.filter((t) => (t.country || t.behavioralBiometrics?.deviceFingerprint?.ipCountry || '').toLowerCase() === selectedCountryFilter.toLowerCase());
    }

    // 6. Payment Method Filter
    if (selectedPaymentMethodFilter !== 'all') {
      list = list.filter((t) => (t.channel || t.paymentMethod || '').toLowerCase().includes(selectedPaymentMethodFilter.toLowerCase()));
    }

    // 7. Amount Filter
    if (selectedAmountFilter === '<25k') {
      list = list.filter((t) => t.amount < 25000);
    } else if (selectedAmountFilter === '25k-100k') {
      list = list.filter((t) => t.amount >= 25000 && t.amount <= 100000);
    } else if (selectedAmountFilter === '>100k') {
      list = list.filter((t) => t.amount > 100000);
    }

    // 8. Sorting
    if (sortBy === 'highest_risk') {
      list.sort((a, b) => b.riskScore.totalScore - a.riskScore.totalScore);
    } else if (sortBy === 'lowest_risk') {
      list.sort((a, b) => a.riskScore.totalScore - b.riskScore.totalScore);
    } else if (sortBy === 'highest_amount') {
      list.sort((a, b) => b.amount - a.amount);
    }

    return list;
  }, [
    rawTransactions,
    searchQuery,
    selectedRiskFilter,
    selectedDecisionFilter,
    selectedStatusFilter,
    selectedCountryFilter,
    selectedPaymentMethodFilter,
    selectedAmountFilter,
    sortBy,
  ]);

  // Unique lists for dropdowns
  const availableCountries = useMemo(() => {
    const set = new Set<string>();
    rawTransactions.forEach((t) => {
      const c = t.country || t.behavioralBiometrics?.deviceFingerprint?.ipCountry;
      if (c) set.add(c);
    });
    return Array.from(set).sort();
  }, [rawTransactions]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchQuery.trim()) count++;
    if (selectedRiskFilter !== 'all') count++;
    if (selectedDecisionFilter !== 'all') count++;
    if (selectedStatusFilter !== 'all') count++;
    if (selectedCountryFilter !== 'all') count++;
    if (selectedDateFilter !== 'all') count++;
    if (selectedAmountFilter !== 'all') count++;
    if (selectedPaymentMethodFilter !== 'all') count++;
    return count;
  }, [
    searchQuery,
    selectedRiskFilter,
    selectedDecisionFilter,
    selectedStatusFilter,
    selectedCountryFilter,
    selectedDateFilter,
    selectedAmountFilter,
    selectedPaymentMethodFilter,
  ]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedRiskFilter('all');
    setSelectedDecisionFilter('all');
    setSelectedStatusFilter('all');
    setSelectedCountryFilter('all');
    setSelectedDateFilter('all');
    setSelectedAmountFilter('all');
    setSelectedPaymentMethodFilter('all');
    setSortBy('newest');
  };

  const handleDecision = async (decision: 'APPROVE' | 'STEP_UP' | 'QUARANTINE') => {
    if (!selectedTxn || isReadOnly) return;

    const newStatus = decision === 'APPROVE' ? 'APPROVED' : decision === 'STEP_UP' ? 'STEP_UP_CHALLENGED' : 'AUTO_BLOCKED';

    // Optimistic UI update
    const updatedTxn: TransactionRecord = {
      ...selectedTxn,
      status: newStatus,
      decision: decision,
    };

    setSelectedTxn(updatedTxn);
    setRawTransactions((prev) => prev.map((t) => (t.id === selectedTxn.id ? updatedTxn : t)));

    try {
      const res = await api.updateTransactionDecision(
        selectedTxn.id,
        decision,
        `Analyst manual forensic decision [${decision}] by ${user?.name || 'Naman Kumar'}`,
        user?.name || 'Naman Kumar'
      );
      if (res.success) {
        showToast(`Transaction ${selectedTxn.transactionRef} marked as ${decision}`, 'success');
      }
    } catch (err) {
      console.error('Decision update error:', err);
      showToast(`Action recorded locally for ${selectedTxn.transactionRef}`, 'warn');
    }
  };

  const handleExplainAi = async () => {
    if (!selectedTxn) return;
    setIsAiLoading(true);
    setAiExplanation(null);
    try {
      const res = await api.explainTransactionWithAi(selectedTxn.id);
      if (res.success && res.explanation) {
        setAiExplanation(res.explanation);
      } else {
        setAiExplanation(
          `Forensic Synthesis for ${selectedTxn.transactionRef}:\n` +
          `• Risk Level: ${selectedTxn.riskScore.riskLevel.toUpperCase()} (${selectedTxn.riskScore.totalScore}/100)\n` +
          `• Primary Driver: ${selectedTxn.riskScore.primaryDriver}\n` +
          `• Behavioral Indicators: Paste latency ${selectedTxn.behavioralBiometrics?.pasteLatencyMs ?? 340}ms, ` +
          `${selectedTxn.behavioralBiometrics?.hesitationPauseCount ?? 4} hesitation pauses, and ${selectedTxn.behavioralBiometrics?.formSequenceDeviationScore ?? 82}% form deviation.\n` +
          `• Recommended Investigator Action: ${selectedTxn.riskScore.totalScore >= 60 ? 'Quarantine account and verify device fingerprint against mule clusters.' : 'Proceed with low risk monitoring.'}`
        );
      }
    } catch (err) {
      console.error('AI explanation failed:', err);
      setAiExplanation(
        `Gemini AI Diagnostic for ${selectedTxn.transactionRef}:\n` +
        `Flagged ${selectedTxn.riskScore.breakdown.length} anomalous signals including ${selectedTxn.riskScore.primaryDriver}. ` +
        `Device originated from ${selectedTxn.country || selectedTxn.behavioralBiometrics?.deviceFingerprint?.ipCountry || 'Flagged Subnet'} with high velocity cadence.`
      );
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleCreateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingTxn(true);
    try {
      const payload = {
        amount: parseFloat(newAmount) || 50000,
        currency: 'INR',
        paymentMethod: newPaymentMethod,
        customer: {
          name: newCustName,
          email: newCustEmail,
          country: newCustCountry,
          riskTier: 'Tier 1 Standard',
        },
        beneficiary: {
          name: newBeneficiary,
          accountNumber: `ACC-FX-${Math.floor(100000 + Math.random() * 900000)}`,
          bankName: 'Global Settlement Route',
          country: newCustCountry === 'India' ? 'Singapore' : 'United States',
          isNew: true,
        },
        behavioralBiometrics: {
          pasteLatencyMs: newPasteLatency,
          pasteCount: newPasteLatency < 800 ? 3 : 1,
          hesitationPauseCount: newHesitations,
          meanHesitationSec: newHesitations > 2 ? 3.4 : 1.1,
          formSequenceDeviationScore: newIsNewDevice ? 85 : 20,
          repeatedCorrections: newFailedLogins > 1 ? 4 : 0,
          deviceFingerprint: {
            browser: newIsNewDevice ? 'Chrome Headless 122' : 'Chrome 122.0',
            os: 'Windows 11',
            screenResolution: '1920x1080',
            hardwareConcurrency: 8,
            touchSupported: false,
            ipCountry: newIsVpn ? 'Romania' : newCustCountry,
            asn: newIsVpn ? 'AS9009 M247 VPN' : 'AS55836 Reliance Jio',
            canvasHash: 'cv_778942a',
            incognitoMode: newIsNewDevice,
          },
        },
      };

      const res = await api.createTransaction(payload);
      if (res.success && res.transaction) {
        const createdRecord = mapToTransactionRecord(res.transaction, 0);
        setRawTransactions((prev) => [createdRecord, ...prev]);
        setSelectedTxn(createdRecord);
        setShowCreateModal(false);
        showToast(`Evaluated transaction: Risk Score ${createdRecord.riskScore.totalScore}/100`, 'success');
      }
    } catch (err) {
      console.error('Create transaction failed:', err);
      showToast('Failed to evaluate payment. Check network connection.', 'error');
    } finally {
      setIsCreatingTxn(false);
    }
  };

  const getRiskBadge = (level: string, score: number) => {
    switch (level) {
      case 'high':
      case 'critical':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-red-100 dark:bg-red-950/60 border border-red-200 dark:border-red-800/40 text-red-700 dark:text-red-400 text-xs font-mono font-bold flex items-center gap-1.5 whitespace-nowrap shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            HIGH ({score}/100) 🔴
          </span>
        );
      case 'suspicious':
      case 'medium':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/40 text-amber-700 dark:text-amber-400 text-xs font-mono font-bold flex items-center gap-1.5 whitespace-nowrap shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            SUSPICIOUS ({score}/100) 🟡
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-400 text-xs font-mono font-bold flex items-center gap-1.5 whitespace-nowrap shadow-2xs">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            LOW ({score}/100) 🟢
          </span>
        );
    }
  };

  const getDecisionBadge = (decision?: string) => {
    switch (decision) {
      case 'QUARANTINE':
      case 'BLOCKED':
        return 'bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/40';
      case 'STEP_UP':
      case 'REVIEW':
        return 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/40';
      case 'APPROVE':
      case 'APPROVED':
        return 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'AUTO_BLOCKED':
      case 'BLOCKED':
        return 'bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/40';
      case 'STEP_UP_CHALLENGED':
        return 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/40';
      case 'APPROVED':
      case 'RESOLVED_CLEAN':
        return 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40';
      default:
        return 'bg-sky-100 dark:bg-sky-950/50 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800/40';
    }
  };

  return (
    <div id="view-live-stream" className="p-4 md:p-6 space-y-5 animate-in fade-in transition-colors font-sans max-w-[1600px] mx-auto">
      {/* Action Toast Alert */}
      {actionToast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-3 text-xs font-semibold animate-in slide-in-from-top-3 ${
          actionToast.type === 'success'
            ? 'bg-emerald-900 text-emerald-100 border-emerald-600'
            : actionToast.type === 'warn'
            ? 'bg-amber-900 text-amber-100 border-amber-600'
            : 'bg-red-900 text-red-100 border-red-600'
        }`}>
          {actionToast.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-amber-400" />}
          <span>{actionToast.message}</span>
        </div>
      )}

      {/* Top Banner Header */}
      <div className="p-5 md:p-6 rounded-3xl bg-white dark:bg-[#121721] border border-slate-200 dark:border-[#1c2638] shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/30 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                TRANSACTION INTELLIGENCE & FORENSIC STREAM
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Live Database Stream
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Real-time payment risk evaluation, behavioral signals, and investigator controls
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* View Mode Toggle */}
            <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-[#0c1017] border border-slate-200 dark:border-[#1c2638]">
              <button
                onClick={() => setViewMode('split')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'split'
                    ? 'bg-white dark:bg-[#1a2233] text-teal-700 dark:text-teal-300 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                }`}
                title="Split Dossier View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                Split View
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-[#1a2233] text-teal-700 dark:text-teal-300 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                }`}
                title="Full Table View"
              >
                <List className="w-3.5 h-3.5" />
                Table View
              </button>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Test / Evaluate Payment
            </button>

            <button
              onClick={loadTransactions}
              className="p-2 bg-slate-100 dark:bg-[#182030] hover:bg-slate-200 dark:hover:bg-[#223048] rounded-xl text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              title="Refresh and sync transactions feed"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Live Metrics Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 dark:border-[#1c2638] text-xs font-mono">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0c1017] border border-slate-200 dark:border-[#1c2638]">
            <span className="text-[10px] text-slate-400 block uppercase">Total Monitored</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              {rawTransactions.length} Transactions
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0c1017] border border-slate-200 dark:border-[#1c2638]">
            <span className="text-[10px] text-slate-400 block uppercase">High Risk (🔴)</span>
            <span className="text-sm font-bold text-red-600 dark:text-red-400">
              {rawTransactions.filter((t) => t.riskScore.riskLevel === 'high' || t.riskScore.totalScore >= 60).length} Flagged
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0c1017] border border-slate-200 dark:border-[#1c2638]">
            <span className="text-[10px] text-slate-400 block uppercase">Suspicious (🟡)</span>
            <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
              {rawTransactions.filter((t) => t.riskScore.riskLevel === 'suspicious' || (t.riskScore.totalScore >= 30 && t.riskScore.totalScore < 60)).length} Under Review
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0c1017] border border-slate-200 dark:border-[#1c2638]">
            <span className="text-[10px] text-slate-400 block uppercase">Low Risk (🟢)</span>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
              {rawTransactions.filter((t) => t.riskScore.riskLevel === 'low' || t.riskScore.totalScore < 30).length} Clean
            </span>
          </div>
        </div>
      </div>

      {/* Comprehensive Search & Multi-Filter Control Panel */}
      <div className="p-4 md:p-5 rounded-3xl bg-white dark:bg-[#121721] border border-slate-200 dark:border-[#1c2638] shadow-xs space-y-4">
        {/* Search Row */}
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Transaction ID, Customer Name, Customer ID, Payee, Email, IP, or Driver..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#0c1017] border border-slate-200 dark:border-[#1c2638] rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-50 dark:bg-[#0c1017] border border-slate-200 dark:border-[#1c2638] rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-teal-500"
              >
                <option value="newest">Newest First</option>
                <option value="highest_risk">Highest Risk Score</option>
                <option value="highest_amount">Highest Amount</option>
                <option value="lowest_risk">Lowest Risk Score</option>
              </select>
            </div>

            {activeFiltersCount > 0 && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50 hover:bg-rose-100 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                Reset ({activeFiltersCount})
              </button>
            )}
          </div>
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 pt-2 border-t border-slate-100 dark:border-[#1c2638] text-xs">
          {/* Risk Level */}
          <div>
            <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Risk Level</label>
            <select
              value={selectedRiskFilter}
              onChange={(e) => setSelectedRiskFilter(e.target.value as any)}
              className="w-full bg-slate-50 dark:bg-[#0c1017] border border-slate-200 dark:border-[#1c2638] rounded-xl px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-teal-500 font-semibold"
            >
              <option value="all">All Risk Levels</option>
              <option value="high">🔴 High Risk (60+)</option>
              <option value="suspicious">🟡 Suspicious (30-59)</option>
              <option value="low">🟢 Low Risk (&lt;30)</option>
            </select>
          </div>

          {/* Decision */}
          <div>
            <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Decision</label>
            <select
              value={selectedDecisionFilter}
              onChange={(e) => setSelectedDecisionFilter(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#0c1017] border border-slate-200 dark:border-[#1c2638] rounded-xl px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-teal-500 font-semibold"
            >
              <option value="all">All Decisions</option>
              <option value="APPROVE">Approve</option>
              <option value="STEP_UP">Step-Up OTP</option>
              <option value="QUARANTINE">Quarantine</option>
              <option value="BLOCKED">Blocked</option>
              <option value="PENDING">Pending</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Status</label>
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#0c1017] border border-slate-200 dark:border-[#1c2638] rounded-xl px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-teal-500 font-semibold"
            >
              <option value="all">All Statuses</option>
              <option value="PENDING_REVIEW">Pending Review</option>
              <option value="AUTO_BLOCKED">Auto Blocked</option>
              <option value="APPROVED">Approved</option>
              <option value="STEP_UP_CHALLENGED">Step-Up Challenged</option>
              <option value="RESOLVED_CLEAN">Resolved Clean</option>
            </select>
          </div>

          {/* Country */}
          <div>
            <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Country</label>
            <select
              value={selectedCountryFilter}
              onChange={(e) => setSelectedCountryFilter(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#0c1017] border border-slate-200 dark:border-[#1c2638] rounded-xl px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-teal-500 font-semibold"
            >
              <option value="all">All Countries</option>
              {availableCountries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Amount Range */}
          <div>
            <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Amount Range</label>
            <select
              value={selectedAmountFilter}
              onChange={(e) => setSelectedAmountFilter(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#0c1017] border border-slate-200 dark:border-[#1c2638] rounded-xl px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-teal-500 font-semibold"
            >
              <option value="all">All Amounts</option>
              <option value="<25k">Under ₹25,000</option>
              <option value="25k-100k">₹25,000 – ₹1,00,000</option>
              <option value=">100k">Above ₹1,00,000</option>
            </select>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Payment Method</label>
            <select
              value={selectedPaymentMethodFilter}
              onChange={(e) => setSelectedPaymentMethodFilter(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#0c1017] border border-slate-200 dark:border-[#1c2638] rounded-xl px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-teal-500 font-semibold"
            >
              <option value="all">All Methods</option>
              <option value="UPI">UPI</option>
              <option value="NetBanking">NetBanking / IMPS</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Crypto">Crypto FX</option>
            </select>
          </div>
        </div>

        {/* Status Count Feedback */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono pt-1">
          <span>
            Showing <strong>{filteredTransactions.length}</strong> of <strong>{rawTransactions.length}</strong> transactions
          </span>
          {activeFiltersCount > 0 && (
            <span className="text-teal-600 dark:text-teal-400 font-semibold">
              Filtered by {activeFiltersCount} active filter{activeFiltersCount > 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* VIEW MODE 1: SPLIT DOSSIER VIEW (Default) */}
      {viewMode === 'split' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Transaction Feed Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="space-y-3 max-h-[720px] overflow-y-auto custom-scrollbar pr-1">
              {isLoading ? (
                <div className="p-12 text-center text-xs text-slate-400 bg-white dark:bg-[#121721] rounded-3xl border border-slate-200 dark:border-[#1c2638]">
                  <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-teal-500" />
                  Loading live database transactions...
                </div>
              ) : filteredTransactions.length === 0 ? (
                <div className="p-12 text-center text-xs text-slate-400 bg-white dark:bg-[#121721] rounded-3xl border border-slate-200 dark:border-[#1c2638] space-y-3">
                  <SlidersHorizontal className="w-6 h-6 mx-auto text-slate-300 dark:text-slate-600" />
                  <p>No transactions match your search and filter criteria.</p>
                  <button
                    onClick={handleResetFilters}
                    className="px-4 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 text-xs font-semibold border border-teal-200 dark:border-teal-800/40"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                filteredTransactions.map((txn) => {
                  const isSelected = selectedTxn?.id === txn.id;
                  return (
                    <div
                      key={txn.id}
                      onClick={() => {
                        setSelectedTxn(txn);
                        setAiExplanation(null);
                      }}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                        isSelected
                          ? 'bg-teal-50/50 dark:bg-teal-950/30 border-teal-500 dark:border-teal-500/60 shadow-xs ring-1 ring-teal-500/40'
                          : 'bg-white dark:bg-[#121721] border-slate-200 dark:border-[#1c2638] hover:border-slate-300 dark:hover:border-[#28364e]'
                      }`}
                    >
                      {/* Top Header */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                            {txn.transactionRef}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase ${getDecisionBadge(txn.decision)}`}>
                            {txn.decision || 'PENDING'}
                          </span>
                          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md border ${getStatusBadge(txn.status)}`}>
                            {txn.status}
                          </span>
                        </div>
                        {getRiskBadge(txn.riskScore.riskLevel, txn.riskScore.totalScore)}
                      </div>

                      {/* Middle: Customer & Amount */}
                      <div className="flex items-center justify-between text-xs mb-2">
                        <div className="min-w-0 pr-2">
                          <p className="font-semibold text-slate-900 dark:text-white truncate">
                            {txn.customer.name}
                            <span className="text-[10px] font-mono text-slate-400 ml-1">({txn.customer.id})</span>
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            To: {txn.beneficiary.name}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                            ₹{Number(txn.amount).toLocaleString('en-IN')}
                          </p>
                          <p className="text-[10px] text-slate-400">{txn.timestamp}</p>
                        </div>
                      </div>

                      {/* Bottom Footer Details */}
                      <div className="pt-2 border-t border-slate-100 dark:border-[#1c2638] flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-2 truncate max-w-[240px]">
                          <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-mono">
                            {txn.channel || txn.paymentMethod || 'UPI'}
                          </span>
                          <span className="truncate">
                            {txn.country || txn.behavioralBiometrics?.deviceFingerprint?.ipCountry || 'India'}
                          </span>
                        </div>
                        <span className="text-teal-600 dark:text-teal-400 font-semibold flex items-center gap-0.5 shrink-0">
                          Inspect <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Selected Transaction Forensic Inspector (7 cols) */}
          <div className="lg:col-span-7">
            {selectedTxn ? (
              <div className="bg-white dark:bg-[#121721] rounded-3xl border border-slate-200 dark:border-[#1c2638] p-6 space-y-6 shadow-xs text-left">
                {/* Header & Quick Action Buttons */}
                <div className="border-b border-slate-100 dark:border-[#1c2638] pb-5 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 px-2.5 py-1 rounded-lg border border-teal-200 dark:border-teal-800/40">
                        {selectedTxn.transactionRef}
                      </span>
                      {getRiskBadge(selectedTxn.riskScore.riskLevel, selectedTxn.riskScore.totalScore)}
                      <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md border ${getStatusBadge(selectedTxn.status)}`}>
                        {selectedTxn.status}
                      </span>
                    </div>

                    {/* Investigator Action Bar */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDecision('APPROVE')}
                        disabled={isReadOnly}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-1"
                        title="Mark transaction approved and release funds"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleDecision('STEP_UP')}
                        disabled={isReadOnly}
                        className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-1"
                        title="Challenge customer with multi-factor biometric OTP"
                      >
                        <ShieldAlert className="w-3.5 h-3.5" />
                        Step-Up OTP
                      </button>
                      <button
                        onClick={() => handleDecision('QUARANTINE')}
                        disabled={isReadOnly}
                        className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-1"
                        title="Quarantine transaction and freeze suspicious beneficiary"
                      >
                        <AlertOctagon className="w-3.5 h-3.5" />
                        Quarantine / Block
                      </button>
                      {onSelectTransaction && (
                        <button
                          onClick={() => onSelectTransaction(selectedTxn)}
                          className="p-1.5 bg-slate-100 dark:bg-[#182030] hover:bg-slate-200 dark:hover:bg-[#223048] rounded-xl text-slate-600 dark:text-slate-300 transition-colors"
                          title="Open in full screen modal"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Primary Grid Specs */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0c1017] border border-slate-200 dark:border-[#1c2638]">
                      <span className="text-[10px] font-mono text-slate-400 block uppercase">Payment Amount</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white text-base">
                        ₹{Number(selectedTxn.amount).toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                        {selectedTxn.currency} via {selectedTxn.channel || selectedTxn.paymentMethod}
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0c1017] border border-slate-200 dark:border-[#1c2638]">
                      <span className="text-[10px] font-mono text-slate-400 block uppercase">Customer</span>
                      <span className="font-semibold text-slate-900 dark:text-white truncate block">
                        {selectedTxn.customer.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono truncate block mt-0.5">
                        {selectedTxn.customer.email}
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0c1017] border border-slate-200 dark:border-[#1c2638]">
                      <span className="text-[10px] font-mono text-slate-400 block uppercase">Beneficiary Payee</span>
                      <span className="font-semibold text-slate-900 dark:text-white truncate block">
                        {selectedTxn.beneficiary.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono truncate block mt-0.5">
                        {selectedTxn.beneficiary.accountNumberMasked}
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0c1017] border border-slate-200 dark:border-[#1c2638]">
                      <span className="text-[10px] font-mono text-slate-400 block uppercase">Origin / Device</span>
                      <span className="font-semibold text-slate-900 dark:text-white truncate block">
                        {selectedTxn.country || selectedTxn.behavioralBiometrics?.deviceFingerprint?.ipCountry || 'India'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono truncate block mt-0.5">
                        {selectedTxn.behavioralBiometrics?.deviceFingerprint?.os || 'Mobile OS'} • {selectedTxn.ipAddress}
                      </span>
                    </div>
                  </div>

                  {/* Primary Risk Driver Callout */}
                  <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-xs">
                    <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-semibold mb-1">
                      <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                      <span>Primary Risk Driver:</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-mono text-xs">
                      {selectedTxn.riskScore.primaryDriver}
                    </p>
                  </div>
                </div>

                {/* Gemini AI Synthesis Card */}
                <div className="p-4 bg-gradient-to-br from-teal-50/80 to-indigo-50/80 dark:from-teal-950/20 dark:to-indigo-950/20 rounded-3xl border border-teal-200/60 dark:border-teal-500/30 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        Gemini AI Risk Synthesis & Forensic Explanation
                      </h4>
                    </div>
                    <button
                      onClick={handleExplainAi}
                      disabled={isAiLoading}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
                    >
                      <Sparkles className={`w-3.5 h-3.5 ${isAiLoading ? 'animate-spin' : ''}`} />
                      {isAiLoading ? 'Synthesizing...' : 'Explain Risk with AI'}
                    </button>
                  </div>

                  {aiExplanation ? (
                    <div className="p-3.5 bg-white dark:bg-[#121721] rounded-2xl border border-teal-100 dark:border-teal-900/40 text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line font-sans">
                      {aiExplanation}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Click the button above to request real-time behavioral forensic explanation synthesized by Gemini AI analyzing anomaly weights, cadence drift, and mule networks.
                    </p>
                  )}
                </div>

                {/* Forensic Signals Breakdown */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-mono font-bold uppercase text-slate-500 dark:text-slate-400">
                      Risk Signal Breakdown ({selectedTxn.riskScore.breakdown.length} Signals)
                    </h4>
                    <span className="text-[11px] font-mono text-slate-400">
                      Confidence: {Math.round(selectedTxn.riskScore.confidence * 100)}%
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedTxn.riskScore.breakdown.map((sig, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0c1017] border border-slate-200 dark:border-[#1c2638] text-xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 dark:text-white truncate pr-2">
                            {sig.signalName}
                          </span>
                          <span
                            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full shrink-0 ${
                              sig.status === 'critical'
                                ? 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/40'
                                : sig.status === 'elevated'
                                ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40'
                                : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            +{sig.contribution} pts
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-normal">
                          {sig.details}
                        </p>
                        <span className="text-[10px] font-mono text-teal-600 dark:text-teal-400 block pt-1">
                          Evidence: {sig.microEvidence}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Behavioral Biometrics Forensic Telemetry */}
                <div className="p-4 rounded-3xl bg-slate-50 dark:bg-[#0c1017] border border-slate-200 dark:border-[#1c2638] space-y-3">
                  <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase block">
                    Behavioral Biometrics Telemetry
                  </span>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs font-mono">
                    <div className="p-2.5 rounded-xl bg-white dark:bg-[#121721] border border-slate-200 dark:border-[#1c2638]">
                      <span className="text-[10px] text-slate-400 block">Paste Latency</span>
                      <span className={`font-bold text-sm ${(selectedTxn.behavioralBiometrics?.pasteLatencyMs ?? 0) < 600 ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>
                        {selectedTxn.behavioralBiometrics?.pasteLatencyMs ?? 340} ms
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white dark:bg-[#121721] border border-slate-200 dark:border-[#1c2638]">
                      <span className="text-[10px] text-slate-400 block">Hesitation Pauses</span>
                      <span className="font-bold text-slate-900 dark:text-white text-sm">
                        {selectedTxn.behavioralBiometrics?.hesitationPauseCount ?? 3} pauses
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white dark:bg-[#121721] border border-slate-200 dark:border-[#1c2638]">
                      <span className="text-[10px] text-slate-400 block">Seq. Deviation</span>
                      <span className={`font-bold text-sm ${(selectedTxn.behavioralBiometrics?.formSequenceDeviationScore ?? 0) > 50 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-white'}`}>
                        {selectedTxn.behavioralBiometrics?.formSequenceDeviationScore ?? 25}%
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white dark:bg-[#121721] border border-slate-200 dark:border-[#1c2638]">
                      <span className="text-[10px] text-slate-400 block">Typing Speed</span>
                      <span className="font-bold text-slate-900 dark:text-white text-sm">
                        {selectedTxn.behavioralBiometrics?.typingSpeedWPM ?? 45} WPM
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-[#121721] rounded-3xl border border-slate-200 dark:border-[#1c2638] p-16 text-center text-slate-400 text-xs">
                Select a payment from the list to view its complete forensic telemetry and investigator controls.
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW MODE 2: DENSE DATA TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="bg-white dark:bg-[#121721] rounded-3xl border border-slate-200 dark:border-[#1c2638] shadow-xs overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-[#1c2638] bg-slate-50/80 dark:bg-[#0c1017] text-slate-500 dark:text-slate-400 font-mono text-[11px] uppercase">
                  <th className="py-3.5 px-4 font-semibold">Transaction ID</th>
                  <th className="py-3.5 px-4 font-semibold">Customer</th>
                  <th className="py-3.5 px-4 font-semibold">Beneficiary Payee</th>
                  <th className="py-3.5 px-4 font-semibold">Amount</th>
                  <th className="py-3.5 px-4 font-semibold">Method</th>
                  <th className="py-3.5 px-4 font-semibold">Country</th>
                  <th className="py-3.5 px-4 font-semibold">Risk Score</th>
                  <th className="py-3.5 px-4 font-semibold">Decision</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1c2638]">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-slate-400 text-xs">
                      No transactions match your search filters.
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((txn) => {
                    const isSelected = selectedTxn?.id === txn.id;
                    return (
                      <tr
                        key={txn.id}
                        onClick={() => {
                          setSelectedTxn(txn);
                          setAiExplanation(null);
                        }}
                        className={`hover:bg-slate-50 dark:hover:bg-[#161d2a] cursor-pointer transition-colors ${
                          isSelected ? 'bg-teal-50/50 dark:bg-teal-950/30 font-medium' : ''
                        }`}
                      >
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap">
                          {txn.transactionRef}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <p className="font-semibold text-slate-900 dark:text-white">{txn.customer.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{txn.customer.id}</p>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap text-slate-700 dark:text-slate-300">
                          {txn.beneficiary.name}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap">
                          ₹{Number(txn.amount).toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[10px]">
                            {txn.channel || txn.paymentMethod || 'UPI'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 dark:text-slate-400">
                          {txn.country || txn.behavioralBiometrics?.deviceFingerprint?.ipCountry || 'India'}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {getRiskBadge(txn.riskScore.riskLevel, txn.riskScore.totalScore)}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded-md border text-[10px] font-bold uppercase ${getDecisionBadge(txn.decision)}`}>
                            {txn.decision || 'PENDING'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded-md border text-[10px] font-mono ${getStatusBadge(txn.status)}`}>
                            {txn.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap text-right space-x-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTxn(txn);
                              if (onSelectTransaction) onSelectTransaction(txn);
                            }}
                            className="px-2.5 py-1 bg-teal-50 dark:bg-teal-950/50 hover:bg-teal-100 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800/50 rounded-lg text-[11px] font-semibold transition-colors"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Create & Evaluate New Transaction */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#121721] border border-slate-200 dark:border-[#1c2638] rounded-3xl w-full max-w-xl p-6 space-y-4 shadow-2xl text-left max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  Evaluate New Test Payment
                </h3>
                <p className="text-xs text-slate-400">
                  Enter parameters to test real server-side risk scoring and ML anomaly detection
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTransaction} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newCustName}
                    onChange={(e) => setNewCustName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0c1017] border border-slate-200 dark:border-[#1c2638] rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Customer Email
                  </label>
                  <input
                    type="email"
                    required
                    value={newCustEmail}
                    onChange={(e) => setNewCustEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0c1017] border border-slate-200 dark:border-[#1c2638] rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Amount (INR ₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0c1017] border border-slate-200 dark:border-[#1c2638] rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={newPaymentMethod}
                    onChange={(e) => setNewPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0c1017] border border-slate-200 dark:border-[#1c2638] rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="UPI">UPI</option>
                    <option value="NetBanking">NetBanking / IMPS</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Crypto FX">Crypto FX</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    required
                    value={newCustCountry}
                    onChange={(e) => setNewCustCountry(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0c1017] border border-slate-200 dark:border-[#1c2638] rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Beneficiary Payee Name
                </label>
                <input
                  type="text"
                  required
                  value={newBeneficiary}
                  onChange={(e) => setNewBeneficiary(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0c1017] border border-slate-200 dark:border-[#1c2638] rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0c1017] border border-slate-200 dark:border-[#1c2638] space-y-3">
                <span className="font-mono font-bold text-slate-500 dark:text-slate-400 uppercase text-[11px] block">
                  Simulate Behavioral & Anomaly Signals
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 mb-1">
                      Clipboard Paste Latency ({newPasteLatency} ms)
                    </label>
                    <input
                      type="range"
                      min={100}
                      max={3000}
                      step={50}
                      value={newPasteLatency}
                      onChange={(e) => setNewPasteLatency(parseInt(e.target.value))}
                      className="w-full accent-teal-500"
                    />
                    <span className="text-[10px] text-slate-400">
                      {newPasteLatency < 500 ? '⚡ Ultra-fast automated paste (<500ms)' : '✍️ Normal manual typing / paste'}
                    </span>
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 mb-1">
                      Hesitation Pauses: {newHesitations}
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={10}
                      value={newHesitations}
                      onChange={(e) => setNewHesitations(parseInt(e.target.value))}
                      className="w-full accent-teal-500"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newIsNewDevice}
                      onChange={(e) => setNewIsNewDevice(e.target.checked)}
                      className="rounded accent-teal-500"
                    />
                    <span>Unrecognized New Device</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newIsVpn}
                      onChange={(e) => setNewIsVpn(e.target.checked)}
                      className="rounded accent-teal-500"
                    />
                    <span>Foreign VPN / Datacenter IP</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-[#182030] text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingTxn}
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-2 shadow-xs"
                >
                  {isCreatingTxn ? 'Evaluating...' : 'Run Engine & Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
