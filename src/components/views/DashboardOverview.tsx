import React, { useState, useEffect } from 'react';
import {
  Activity,
  AlertTriangle,
  AlertCircle,
  Users,
  BarChart3,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  Clock,
  Shield,
  Zap,
  ArrowRight,
  Download,
  RefreshCw,
  Database,
  Layers,
  Sparkles,
  ShieldAlert,
  MoreVertical,
  Lock,
  Unlock,
  ShieldCheck,
  Flame,
  KeyRound
} from 'lucide-react';
import { TransactionRecord, FraudTell, ZeroDayIncident } from '../../types/fraud';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { ViewId } from '../Sidebar';
import { api } from '../../services/api';
import { useTheme } from '../../context/ThemeContext';
import { useTransactionAction } from '../../context/TransactionActionContext';
import { useContainment } from '../../context/ContainmentContext';

interface DashboardOverviewProps {
  transactions: TransactionRecord[];
  tells: FraudTell[];
  zeroDays: ZeroDayIncident[];
  onSelectTransaction: (txn: TransactionRecord) => void;
  onNavigate: (view: ViewId) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  transactions: initialTransactions,
  tells,
  zeroDays,
  onSelectTransaction,
  onNavigate,
}) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const { actionRecords, requestAction } = useTransactionAction();
  const { isSessionContained } = useContainment();

  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [exported, setExported] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);

  // Close action menus when clicking outside
  useEffect(() => {
    const handleOutside = () => setOpenActionMenuId(null);
    window.addEventListener('click', handleOutside);
    return () => window.removeEventListener('click', handleOutside);
  }, []);

  // Fetch real analytics and transactions from backend database
  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const analyticsRes = await api.getAnalytics().catch(() => null);

      if (analyticsRes?.success) {
        setAnalyticsData(analyticsRes);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Compute live metrics from database or fallback gracefully
  const totalScanned = analyticsData?.metrics?.totalAnalyzed || 500;
  const suspiciousCount = analyticsData?.metrics?.suspiciousCount || 42;
  const highRiskCount = analyticsData?.metrics?.highRiskCount || 28;
  const monitoredCustomers = analyticsData?.metrics?.activeCustomersCount || 100;
  const fraudRate = analyticsData?.metrics?.fraudRate || '5.6%';

  // Dynamic Donut Data computed from real database distribution
  const donutData = analyticsData?.riskDistribution
    ? [
        {
          name: 'Normal (0-29)',
          value: analyticsData.riskDistribution[0]?.count || 380,
          color: '#2dd4bf',
          pct: Math.round(((analyticsData.riskDistribution[0]?.count || 380) / Math.max(1, totalScanned)) * 100),
        },
        {
          name: 'Suspicious (30-59)',
          value: analyticsData.riskDistribution[1]?.count || 85,
          color: '#fbbf24',
          pct: Math.round(((analyticsData.riskDistribution[1]?.count || 85) / Math.max(1, totalScanned)) * 100),
        },
        {
          name: 'High & Critical (60-100)',
          value: (analyticsData.riskDistribution[2]?.count || 20) + (analyticsData.riskDistribution[3]?.count || 15),
          color: '#f87171',
          pct: Math.round((((analyticsData.riskDistribution[2]?.count || 20) + (analyticsData.riskDistribution[3]?.count || 15)) / Math.max(1, totalScanned)) * 100),
        },
      ]
    : [
        { name: 'Normal', value: 78, color: '#2dd4bf', pct: 78 },
        { name: 'Suspicious', value: 17, color: '#fbbf24', pct: 17 },
        { name: 'High risk', value: 5, color: '#f87171', pct: 5 },
      ];

  // Dynamic Weekly Trend data computed from backend or structured baseline
  const weeklyTrendData = analyticsData?.timelineData?.map((item: any) => ({
    day: item.time.split(' ')[0],
    normal: item.total - item.suspicious - item.blocked,
    suspicious: item.suspicious,
    highRisk: item.blocked,
  })) || [
    { day: '06:00', normal: 37, suspicious: 3, highRisk: 2 },
    { day: '09:00', normal: 75, suspicious: 8, highRisk: 5 },
    { day: '12:00', normal: 102, suspicious: 14, highRisk: 9 },
    { day: '15:00', normal: 92, suspicious: 11, highRisk: 7 },
    { day: '18:00', normal: 84, suspicious: 7, highRisk: 4 },
    { day: '21:00', normal: 49, suspicious: 9, highRisk: 6 },
    { day: 'Live', normal: 24, suspicious: 4, highRisk: 2 },
  ];

  const handleExport = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(
        JSON.stringify(
          {
            report: 'FraudGuard Executive Overview Snapshot',
            timestamp: new Date().toISOString(),
            dataset: 'Synthetic Demo Data (Enterprise Seeded)',
            metrics: analyticsData?.metrics || {
              totalAnalyzed: totalScanned,
              suspiciousCount,
              highRiskCount,
              monitoredCustomers,
              fraudRate,
            },
            distribution: donutData,
            recentTransactions: initialTransactions.slice(0, 10),
          },
          null,
          2
        )
      );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `fraudguard-executive-snapshot-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setExported(true);
    setTimeout(() => setExported(false), 2500);
  };

  // Filter transactions for table. Always use the fully-shaped TransactionRecord[]
  // prop (same data LiveTransactionStream uses) rather than the raw DB rows fetched
  // above — the detail modal needs the nested riskScore/customer/beneficiary/etc.
  // shape that only initialTransactions provides.
  const displayTxns = initialTransactions;
  const filteredTxns = displayTxns.filter((t) => {
    const level = t.riskLevel || t.riskScore?.riskLevel;
    if (filterRisk === 'high') return level === 'high' || level === 'critical';
    if (filterRisk === 'suspicious') return level === 'suspicious' || level === 'medium';
    if (filterRisk === 'low') return level === 'low';
    return true;
  });

  return (
    <div id="view-dashboard-overview" className="p-4 md:p-6 lg:p-8 space-y-6 animate-in fade-in transition-colors">
      {/* 1. GREETING & DATASET STATUS HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[var(--text-muted)] uppercase">
            <span>LIVE RISK INTELLIGENCE</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1 text-[var(--color-brand)] bg-[var(--color-brand)]/10 px-2 py-0.5 rounded-full border border-[var(--color-brand)]/20">
              <Database className="w-3 h-3" />
              Synthetic Demo Data
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] tracking-tight mt-1 font-sans">
            Fraud Operations & Risk Command
          </h2>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadDashboardData}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--bg-subtle)] hover:bg-[var(--bg-hover)] border border-[var(--border-color)] text-xs font-semibold text-[var(--text-secondary)] transition-all shadow-xs cursor-pointer"
            title="Refresh database metrics"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Sync DB</span>
          </button>

          <button
            id="btn-export-snapshot"
            onClick={handleExport}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--bg-subtle)] hover:bg-[var(--bg-hover)] border border-[var(--border-color)] text-xs font-semibold text-[var(--text-secondary)] transition-all shadow-xs cursor-pointer"
          >
            <BarChart3 className="w-4 h-4 text-[var(--color-brand)]" />
            <span>{exported ? 'Snapshot Exported!' : 'Export snapshot'}</span>
          </button>
        </div>
      </div>

      {/* 2. THE 4 REAL METRIC CARDS CONNECTED TO DATABASE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: TRANSACTIONS ANALYSED */}
        <div
          onClick={() => onNavigate('live_transactions')}
          className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] flex flex-col justify-between shadow-xs transition-all hover:border-[var(--color-brand)]/50 cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-[var(--text-muted)] uppercase tracking-wider">
              TRANSACTIONS ANALYSED
            </span>
            <div className="w-8 h-8 rounded-xl bg-[var(--color-brand)]/10 border border-[var(--color-brand)]/30 flex items-center justify-center text-[var(--color-brand)] group-hover:scale-110 transition-transform">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-4">
            <span className="text-2xl md:text-3xl font-bold font-sans text-[var(--text-primary)] tracking-tight">
              {Number(totalScanned).toLocaleString()}
            </span>
            <span className="text-xs font-mono font-semibold text-[var(--color-brand-strong)] flex items-center gap-0.5">
              Live DB <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
        </div>

        {/* Card 2: SUSPICIOUS ACTIVITIES */}
        <div
          onClick={() => onNavigate('live_transactions')}
          className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] flex flex-col justify-between shadow-xs transition-all hover:border-[var(--color-tier-medium)]/50 cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-[var(--text-muted)] uppercase tracking-wider">
              SUSPICIOUS ACTIVITIES
            </span>
            <div className="w-8 h-8 rounded-xl bg-[var(--color-tier-medium)]/10 border border-[var(--color-tier-medium)]/30 flex items-center justify-center text-[var(--color-tier-medium)] group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-4">
            <span className="text-2xl md:text-3xl font-bold font-sans text-[var(--text-primary)] tracking-tight">
              {Number(suspiciousCount).toLocaleString()}
            </span>
            <span className="text-xs font-mono font-semibold text-[var(--color-tier-medium)]">
              {totalScanned > 0 ? ((suspiciousCount / totalScanned) * 100).toFixed(1) : '0'}% of total
            </span>
          </div>
        </div>

        {/* Card 3: HIGH-RISK & CRITICAL CASES */}
        <div
          onClick={() => onNavigate('case_management')}
          className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] flex flex-col justify-between shadow-xs transition-all hover:border-[var(--color-tier-high)]/50 cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-[var(--text-muted)] uppercase tracking-wider">
              HIGH-RISK CASES
            </span>
            <div className="w-8 h-8 rounded-xl bg-[var(--color-tier-high)]/10 border border-[var(--color-tier-high)]/30 flex items-center justify-center text-[var(--color-tier-high)] group-hover:scale-110 transition-transform">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-4">
            <span className="text-2xl md:text-3xl font-bold font-sans text-[var(--text-primary)] tracking-tight">
              {Number(highRiskCount).toLocaleString()}
            </span>
            <span className="text-xs font-mono font-semibold text-[var(--color-tier-high)] flex items-center gap-0.5">
              {analyticsData?.metrics?.activeCasesCount || 4} open dossiers <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
        </div>

        {/* Card 4: CUSTOMERS MONITORED */}
        <div
          onClick={() => onNavigate('impersonation_detector')}
          className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] flex flex-col justify-between shadow-xs transition-all hover:border-purple-500/50 cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-[var(--text-muted)] uppercase tracking-wider">
              CUSTOMERS MONITORED
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-4">
            <span className="text-2xl md:text-3xl font-bold font-sans text-[var(--text-primary)] tracking-tight">
              {Number(monitoredCustomers).toLocaleString()}
            </span>
            <span className="text-xs font-mono font-semibold text-purple-700 dark:text-purple-300">
              Baselines active
            </span>
          </div>
        </div>
      </div>

      {/* 3. MAIN VISUALIZATION ROW (2/3 Risk activity trend + 1/3 Risk distribution donut) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Risk Activity Trend (2 Columns) */}
        <div className="lg:col-span-2 p-5 md:p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xs flex flex-col justify-between transition-colors">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4">
              <div>
                <div className="text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase tracking-wider">
                  VOLUME & INCIDENT VELOCITY
                </div>
                <h3 className="text-base font-bold text-[var(--text-primary)] font-sans mt-0.5">
                  Risk activity trend
                </h3>
              </div>

              {/* Chart Legend */}
              <div className="flex items-center gap-4 text-xs font-sans">
                <span className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                  <span className="w-2 h-2 rounded-full bg-[#2dd4bf]" />
                  Normal
                </span>
                <span className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                  <span className="w-2 h-2 rounded-full bg-[#fbbf24]" />
                  Suspicious
                </span>
                <span className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                  <span className="w-2 h-2 rounded-full bg-[#f87171]" />
                  High risk
                </span>
              </div>
            </div>

            {/* Spline Line Chart */}
            <div className="h-64 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="day" stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={11} tickLine={false} axisLine={{ stroke: isDark ? '#334155' : '#e2e8f0' }} />
                  <YAxis stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#121721' : '#ffffff',
                      borderColor: isDark ? '#1c2638' : '#e2e8f0',
                      borderRadius: '12px',
                      color: isDark ? '#fff' : '#0f172a',
                      fontSize: '12px',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Line type="monotone" dataKey="normal" stroke="#2dd4bf" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: '#2dd4bf' }} />
                  <Line type="monotone" dataKey="suspicious" stroke="#fbbf24" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: '#fbbf24' }} />
                  <Line type="monotone" dataKey="highRisk" stroke="#f87171" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: '#f87171' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right: Risk Distribution Donut (1 Column) */}
        <div className="p-5 md:p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xs flex flex-col justify-between transition-colors">
          <div>
            <div className="text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase tracking-wider">
              CURRENT RISK PROFILE
            </div>
            <h3 className="text-base font-bold text-[var(--text-primary)] font-sans mt-0.5">
              Risk distribution
            </h3>
          </div>

          {/* Donut Chart with Center Text */}
          <div className="relative flex items-center justify-center my-2">
            <div className="w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {donutData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="absolute flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-bold font-sans text-[var(--text-primary)]">
                {totalScanned}
              </span>
              <span className="text-[9px] font-mono text-[var(--text-muted)] tracking-wider">
                TRANSACTIONS
              </span>
            </div>
          </div>

          {/* Breakdown percentage legend */}
          <div className="space-y-2 pt-2 border-t border-[var(--border-subtle)] text-xs">
            {donutData.map((d: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[var(--text-secondary)]">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                  {d.name}
                </span>
                <span className="font-mono font-bold text-[var(--text-primary)]">
                  {d.pct || 0}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. SIGNAL SUMMARY & LIVE ACTIVITY TABLE */}
      <div className="p-5 md:p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xs space-y-4 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)]">
          <div>
            <div className="text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase tracking-wider">
              REAL-TIME TRANSACTION STREAM
            </div>
            <h3 className="text-base font-bold text-[var(--text-primary)] font-sans mt-0.5">
              Live Monitored Transaction Feed
            </h3>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              onClick={() => setFilterRisk('all')}
              className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                filterRisk === 'all'
                  ? 'bg-[var(--bg-hover)] text-[var(--text-primary)] font-bold'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterRisk('high')}
              className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                filterRisk === 'high'
                  ? 'bg-[var(--color-tier-high)]/20 text-[var(--color-tier-high)] border border-[var(--color-tier-high)]/40 font-bold'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              High Risk 🔴
            </button>
            <button
              onClick={() => setFilterRisk('suspicious')}
              className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                filterRisk === 'suspicious'
                  ? 'bg-[var(--color-tier-medium)]/20 text-[var(--color-tier-medium)] border border-[var(--color-tier-medium)]/40 font-bold'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              Suspicious 🟡
            </button>
          </div>
        </div>

        {/* Transaction Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] text-[var(--text-muted)] font-mono text-[11px]">
                <th className="pb-3 font-semibold">REFERENCE</th>
                <th className="pb-3 font-semibold">CUSTOMER</th>
                <th className="pb-3 font-semibold">AMOUNT</th>
                <th className="pb-3 font-semibold">PRIMARY SIGNAL</th>
                <th className="pb-3 font-semibold">RISK SCORE</th>
                <th className="pb-3 font-semibold">ACTION STATE</th>
                <th className="pb-3 font-semibold text-right">CONTROLS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {filteredTxns.slice(0, 8).map((txn: any) => {
                const score = txn.riskScore?.totalScore ?? txn.riskScore ?? 15;
                const level = txn.riskLevel || txn.riskScore?.riskLevel || 'low';
                const isHigh = level === 'high' || level === 'critical' || score >= 60;
                const isSuspicious = (level === 'suspicious' || level === 'medium' || (score >= 30 && score < 60)) && !isHigh;
                const customerName = txn.customerName || txn.customer?.name || 'Customer';
                const primaryDriver = txn.primaryDriver || txn.riskScore?.primaryDriver || 'Standard Baseline Transaction';
                const ref = txn.transactionRef || txn.id;
                const txnId = txn.id || ref;
                const sessionId = txn.sessionId || txn.customer?.sessionId || txn.id;

                const recordedAction = actionRecords[txnId];
                const contained = isSessionContained(sessionId);

                return (
                  <tr
                    key={txn.id}
                    onClick={() => onSelectTransaction(txn)}
                    className="hover:bg-[var(--bg-hover)] cursor-pointer transition-colors"
                  >
                    <td className="py-3 font-mono font-bold text-[var(--text-primary)]">
                      <div className="flex items-center gap-1.5">
                        <span>{ref}</span>
                        {contained && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-[var(--color-tier-medium)]/10 text-[var(--color-tier-medium)] border border-[var(--color-tier-medium)]/30 flex items-center gap-1" title="Session Contained">
                            <Lock className="w-2.5 h-2.5" />
                            Contained
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 text-[var(--text-secondary)]">
                      {customerName}
                    </td>
                    <td className="py-3 font-mono font-semibold text-[var(--text-primary)]">
                      ₹{Number(txn.amount || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 text-[var(--text-secondary)] max-w-xs truncate">
                      {primaryDriver}
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[11px] font-bold ${
                          isHigh
                            ? 'bg-[var(--color-tier-high)]/10 text-[var(--color-tier-high)] border border-[var(--color-tier-high)]/30'
                            : isSuspicious
                            ? 'bg-[var(--color-tier-medium)]/10 text-[var(--color-tier-medium)] border border-[var(--color-tier-medium)]/30'
                            : 'bg-[var(--color-tier-low)]/10 text-[var(--color-tier-low)] border border-[var(--color-tier-low)]/30'
                        }`}
                      >
                        {score}/100 {isHigh ? '🔴' : isSuspicious ? '🟡' : '🟢'}
                      </span>
                    </td>
                    <td className="py-3">
                      {recordedAction ? (
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono text-[10px] font-bold ${
                            recordedAction.action === 'APPROVE'
                              ? 'bg-[var(--color-tier-low-bg)] text-[var(--color-tier-low)] border border-[var(--color-tier-low-border)]'
                              : recordedAction.action === 'STEP_UP'
                              ? 'bg-[var(--color-tier-medium-bg)] text-[var(--color-tier-medium)] border border-[var(--color-tier-medium-border)]'
                              : 'bg-[var(--color-tier-high-bg)] text-[var(--color-tier-high)] border border-[var(--color-tier-high-border)]'
                          }`}
                        >
                          {recordedAction.action === 'APPROVE' && <CheckCircle2 className="w-3 h-3 text-[var(--color-tier-low)]" />}
                          {recordedAction.action === 'STEP_UP' && <KeyRound className="w-3 h-3 text-[var(--color-tier-medium)]" />}
                          {recordedAction.action === 'QUARANTINE' && <ShieldAlert className="w-3 h-3 text-[var(--color-tier-high)]" />}
                          {recordedAction.action === 'APPROVE' && 'Override: Approved'}
                          {recordedAction.action === 'STEP_UP' && 'Step-Up Challenge'}
                          {recordedAction.action === 'QUARANTINE' && 'Quarantined & Blocked'}
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-[var(--text-muted)]">
                          {isHigh ? 'Pending Triage' : 'Automated Evaluation'}
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-right">
                      <div className="relative inline-block text-left" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onSelectTransaction(txn)}
                            className="p-1.5 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                            title="Inspect forensic dossier"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setOpenActionMenuId(openActionMenuId === txnId ? null : txnId)}
                            className="p-1.5 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                            title="Perform Quick Action"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Dropdown Menu */}
                        {openActionMenuId === txnId && (
                          <div className="absolute right-0 mt-1 w-56 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-xl p-1.5 text-xs z-50 animate-in fade-in slide-in-from-top-1 font-sans">
                            <div className="px-2.5 py-1 text-[10px] font-mono text-[var(--text-muted)] border-b border-[var(--border-subtle)] mb-1">
                              Action on {ref}
                            </div>

                            <button
                              onClick={() => {
                                setOpenActionMenuId(null);
                                requestAction(
                                  {
                                    id: txnId,
                                    transactionRef: ref,
                                    customerName,
                                    amount: txn.amount,
                                    riskScore: score,
                                  },
                                  'APPROVE'
                                );
                              }}
                              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left text-[var(--color-tier-low)] hover:bg-[var(--color-tier-low-bg)] transition-colors font-medium cursor-pointer"
                            >
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>Approve (Override)</span>
                            </button>

                            <button
                              onClick={() => {
                                setOpenActionMenuId(null);
                                requestAction(
                                  {
                                    id: txnId,
                                    transactionRef: ref,
                                    customerName,
                                    amount: txn.amount,
                                    riskScore: score,
                                  },
                                  'STEP_UP'
                                );
                              }}
                              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left text-[var(--color-tier-medium)] hover:bg-[var(--color-tier-medium-bg)] transition-colors font-medium cursor-pointer"
                            >
                              <KeyRound className="w-3.5 h-3.5" />
                              <span>Trigger Step-Up Challenge</span>
                            </button>

                            <button
                              onClick={() => {
                                setOpenActionMenuId(null);
                                requestAction(
                                  {
                                    id: txnId,
                                    transactionRef: ref,
                                    customerName,
                                    amount: txn.amount,
                                    riskScore: score,
                                  },
                                  'QUARANTINE'
                                );
                              }}
                              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left text-[var(--color-tier-high)] hover:bg-[var(--color-tier-high-bg)] transition-colors font-medium cursor-pointer"
                            >
                              <ShieldAlert className="w-3.5 h-3.5" />
                              <span>Quarantine & Hard Block</span>
                            </button>

                            <div className="pt-1 border-t border-[var(--border-subtle)] mt-1">
                              <button
                                onClick={() => {
                                  setOpenActionMenuId(null);
                                  onSelectTransaction(txn);
                                }}
                                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors cursor-pointer"
                              >
                                <ArrowRight className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                                <span>Inspect Full Dossier</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

