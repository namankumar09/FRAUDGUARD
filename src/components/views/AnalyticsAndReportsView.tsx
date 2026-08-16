import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  ShieldAlert,
  Users,
  Download,
  FileSpreadsheet,
  Globe,
  Clock,
  Sparkles,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  CartesianGrid,
  Legend
} from 'recharts';
import { api } from '../../services/api';

export const AnalyticsAndReportsView: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [exporting, setExporting] = useState<string | null>(null);

  const loadAnalytics = async () => {
    setIsLoading(true);
    try {
      const res = await api.getAnalytics();
      if (res.success) {
        setData(res);
      }
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const handleExport = async (type: string, format: 'csv' | 'json') => {
    setExporting(type);
    try {
      if (format === 'csv') {
        window.open(`/api/reports/generate?type=${type}&format=csv`, '_blank');
      } else {
        const res = await fetch(`/api/reports/generate?type=${type}&format=json`);
        const json = await res.json();
        const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `fraudguard_${type}_${Date.now()}.json`;
        a.click();
      }
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* 3-Part Guidance */}
      <div className="p-4 bg-white dark:bg-[#121722] rounded-xl border border-slate-200 dark:border-[#1c2638] shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <span className="text-[11px] font-mono font-bold uppercase text-teal-600 dark:text-teal-400">1. What this does</span>
            <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">
              Computes real-time risk intelligence, geographic distribution, signal frequency, and exportable regulatory audit reports directly from the database.
            </p>
          </div>
          <div>
            <span className="text-[11px] font-mono font-bold uppercase text-amber-600 dark:text-amber-400">2. What should I look for?</span>
            <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">
              Sudden spikes in high-risk transaction hours, high-velocity signals, and high fraud-rate countries.
            </p>
          </div>
          <div>
            <span className="text-[11px] font-mono font-bold uppercase text-indigo-600 dark:text-indigo-400">3. What can I do?</span>
            <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">
              Export executive CSV reports, download JSON forensic summaries, or review top triggering risk signals.
            </p>
          </div>
        </div>
      </div>

      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            Analytics, Risk Trends & Reports
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time analytics engine computed dynamically from persistent transaction records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadAnalytics}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-[#182030] hover:bg-slate-200 dark:hover:bg-[#223048] text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Metrics
          </button>

          <button
            onClick={() => handleExport('fraud_summary', 'csv')}
            disabled={exporting !== null}
            className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Export Fraud Summary (CSV)
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      {data?.metrics && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-white dark:bg-[#121722] rounded-xl border border-slate-200 dark:border-[#1c2638] shadow-xs">
            <span className="text-[11px] font-mono uppercase font-semibold text-slate-400">Total Scanned Volume</span>
            <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">
              ₹{Number(data.metrics.totalVolume || 0).toLocaleString('en-IN')}
            </p>
            <span className="text-[11px] text-teal-600 dark:text-teal-400 mt-1 block">
              {data.metrics.totalAnalyzed} total transactions in DB
            </span>
          </div>

          <div className="p-4 bg-white dark:bg-[#121722] rounded-xl border border-slate-200 dark:border-[#1c2638] shadow-xs">
            <span className="text-[11px] font-mono uppercase font-semibold text-slate-400">Fraud Detection Rate</span>
            <p className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-1">
              {data.metrics.fraudRate}
            </p>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
              {data.metrics.highRiskCount} high-risk flagged transactions
            </span>
          </div>

          <div className="p-4 bg-white dark:bg-[#121722] rounded-xl border border-slate-200 dark:border-[#1c2638] shadow-xs">
            <span className="text-[11px] font-mono uppercase font-semibold text-slate-400">Loss Prevented</span>
            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              ₹{Number(data.metrics.totalPreventedFraud || 0).toLocaleString('en-IN')}
            </p>
            <span className="text-[11px] text-emerald-500 mt-1 block">
              Protected by automated quarantines
            </span>
          </div>

          <div className="p-4 bg-white dark:bg-[#121722] rounded-xl border border-slate-200 dark:border-[#1c2638] shadow-xs">
            <span className="text-[11px] font-mono uppercase font-semibold text-slate-400">Average Risk Score</span>
            <p className="text-xl font-bold text-teal-600 dark:text-teal-400 mt-1">
              {data.metrics.avgRiskScore} / 100
            </p>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
              {data.metrics.activeCustomersCount} monitored customers
            </span>
          </div>
        </div>
      )}

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Activity Over Time (Area Chart) */}
        <div className="lg:col-span-8 bg-white dark:bg-[#121722] p-5 rounded-xl border border-slate-200 dark:border-[#1c2638] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                24-Hour Velocity & Risk Quarantine Trends
              </h3>
              <p className="text-xs text-slate-400">Transaction counts vs flagged high-risk quarantines</p>
            </div>
            <span className="text-[11px] font-mono text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 px-2.5 py-1 rounded-md border border-teal-200 dark:border-teal-800/40">
              Live DB Feed
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.timelineData || []}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorBlocked" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#121722',
                    borderColor: '#1c2638',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="total" stroke="#0d9488" strokeWidth={2} fillOpacity={1} fill="url(#colorTotal)" name="Total Scanned" />
                <Area type="monotone" dataKey="blocked" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorBlocked)" name="Quarantined Risk" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution Breakdown (Pie Chart) */}
        <div className="lg:col-span-4 bg-white dark:bg-[#121722] p-5 rounded-xl border border-slate-200 dark:border-[#1c2638] space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              Risk Severity Distribution
            </h3>
            <p className="text-xs text-slate-400">Categorization across all transactions</p>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.riskDistribution || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {(data?.riskDistribution || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#121722',
                    borderColor: '#1c2638',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {(data?.riskDistribution || []).map((item: any) => (
              <div key={item.name} className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-50 dark:bg-[#182030]">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.fill }} />
                <span className="truncate text-slate-700 dark:text-slate-300">{item.name}: <strong>{item.count}</strong></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Secondary Row: Top Signals & Geographic Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top Risk Signals Frequency */}
        <div className="lg:col-span-6 bg-white dark:bg-[#121722] p-5 rounded-xl border border-slate-200 dark:border-[#1c2638] space-y-4 text-left">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Top Triggering Risk Signals in Database
          </h3>
          <p className="text-xs text-slate-400">Most frequent anomaly drivers flagged by the fraud engine</p>

          <div className="space-y-3">
            {(data?.topSignals || []).map((sig: any, idx: number) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>{sig.name}</span>
                  <span className="font-mono text-teal-600 dark:text-teal-400">{sig.count} triggers</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-[#1c2638] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-teal-500 h-full rounded-full"
                    style={{ width: `${Math.min(100, (sig.count / Math.max(1, data?.metrics?.totalAnalyzed || 100)) * 300)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Geographic Breakdown Table */}
        <div className="lg:col-span-6 bg-white dark:bg-[#121722] p-5 rounded-xl border border-slate-200 dark:border-[#1c2638] space-y-4 text-left">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              Volume & Fraud Rate by Country
            </h3>
            <button
              onClick={() => handleExport('alerts_report', 'csv')}
              className="text-xs text-teal-600 dark:text-teal-400 hover:underline font-semibold"
            >
              Export Alerts CSV
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-[#1c2638] text-slate-400 font-mono text-[11px]">
                  <th className="pb-2">Country</th>
                  <th className="pb-2">Transactions</th>
                  <th className="pb-2">Total Volume</th>
                  <th className="pb-2 text-right">Fraud Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1c2638]">
                {(data?.countryBreakdown || []).slice(0, 6).map((c: any) => (
                  <tr key={c.country}>
                    <td className="py-2.5 font-semibold text-slate-900 dark:text-white">{c.country}</td>
                    <td className="py-2.5 text-slate-600 dark:text-slate-300">{c.count}</td>
                    <td className="py-2.5 text-slate-600 dark:text-slate-300">₹{Number(c.volume).toLocaleString('en-IN')}</td>
                    <td className="py-2.5 text-right font-bold text-amber-600 dark:text-amber-400">{c.fraudRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
