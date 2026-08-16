import React, { useState } from 'react';
import {
  Users,
  ShieldAlert,
  Server,
  Zap,
  CheckCircle2,
  Lock,
  Layers,
  ArrowRight,
  Filter,
  RefreshCw,
  Search,
  AlertTriangle,
  Radio,
  Cpu,
  Fingerprint,
  Shield
} from 'lucide-react';
import { MOCK_DOPPELGANGER_CLUSTERS } from '../../data/mockFraudData';
import { BehavioralCluster } from '../../types/fraud';

export const DoppelgangerClusterView: React.FC = () => {
  const [clusters, setClusters] = useState<BehavioralCluster[]>(MOCK_DOPPELGANGER_CLUSTERS);
  const [selectedClusterId, setSelectedClusterId] = useState<string>(
    MOCK_DOPPELGANGER_CLUSTERS[0]?.id || ''
  );
  const [containedClusterIds, setContainedClusterIds] = useState<string[]>([]);
  const [quarantinedAccountIds, setQuarantinedAccountIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'high' | 'critical'>('all');
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const selectedCluster = clusters.find((c) => c.id === selectedClusterId) || clusters[0];

  const handleBulkContainment = (clusterId: string) => {
    if (!containedClusterIds.includes(clusterId)) {
      setContainedClusterIds((prev) => [...prev, clusterId]);
      const current = clusters.find((c) => c.id === clusterId);
      if (current) {
        setQuarantinedAccountIds((prev) => [
          ...prev,
          ...current.accounts.map((a) => a.accountId)
        ]);
        setActionSuccessMsg(`Successfully contained cluster "${current.clusterName}" and placed all connected accounts into security lockdown.`);
        setTimeout(() => setActionSuccessMsg(null), 4500);
      }
    }
  };

  const handleSingleAccountQuarantine = (accountId: string) => {
    if (!quarantinedAccountIds.includes(accountId)) {
      setQuarantinedAccountIds((prev) => [...prev, accountId]);
      setActionSuccessMsg(`Account #${accountId} successfully quarantined and locked.`);
      setTimeout(() => setActionSuccessMsg(null), 3500);
    }
  };

  const handleResetClusters = () => {
    setContainedClusterIds([]);
    setQuarantinedAccountIds([]);
    setActionSuccessMsg('Reset all simulated cluster containment states.');
    setTimeout(() => setActionSuccessMsg(null), 3000);
  };

  const filteredClusters = clusters.filter((c) => {
    const matchesSearch =
      c.clusterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.sharedOperatorSignature.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.primarySubnet.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.accounts.some((a) => a.accountHolder.toLowerCase().includes(searchQuery.toLowerCase()) || a.accountId.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (filterSeverity === 'high') return matchesSearch && c.similarityScore >= 85 && c.similarityScore < 92;
    if (filterSeverity === 'critical') return matchesSearch && c.similarityScore >= 92;
    return matchesSearch;
  });

  const totalFlaggedAccounts = clusters.reduce((acc, c) => acc + (c.accountCount || c.accounts.length), 0);
  const totalVolumeRisk = clusters.reduce((acc, c) => {
    return acc + c.accounts.reduce((sub, a) => sub + (a.transactionAmount || 0), 0);
  }, 0);

  return (
    <div id="view-doppelganger-cluster" className="p-4 md:p-6 space-y-6 animate-in fade-in transition-colors font-sans">
      {/* 3-Part User Friendly Top Header */}
      <div className="p-5 md:p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[var(--color-brand)]/10 text-[var(--color-brand-strong)] border border-[var(--color-brand)]/30 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[var(--color-brand)]" />
                FIND SIMILAR ACCOUNTS
              </span>
              <span className="text-xs text-[var(--text-muted)] font-mono">• Bot Farm & Cluster Finder</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] tracking-tight">
              Detect multiple accounts operated by the same fraud actor
            </h2>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs shrink-0">
            <span className="px-3 py-1.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--text-secondary)] font-bold">
              👥 {totalFlaggedAccounts} Linked Accounts
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--color-tier-high)] font-bold">
              ₹{(totalVolumeRisk / 100000).toFixed(1)}L At Risk
            </span>
          </div>
        </div>

        {/* 3 User-Friendly Helper Questions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-[var(--border-subtle)] text-xs">
          <div className="p-3 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-1">
            <span className="font-bold text-[var(--color-brand-strong)] font-mono text-[10px] uppercase block">
              1. What this does
            </span>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Finds groups of accounts that have the exact same subconscious typing rhythm, click timing, and device habits.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-1">
            <span className="font-bold text-[var(--color-brand-strong)] font-mono text-[10px] uppercase block">
              2. What should I look for?
            </span>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Select a cluster on the left and see how many accounts share the same operator signature and timing delays.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-1">
            <span className="font-bold text-[var(--color-brand-strong)] font-mono text-[10px] uppercase block">
              3. What can I do?
            </span>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Click <strong>"Bulk Contain All Accounts"</strong> to freeze the entire bot network in one click before money is transferred.
            </p>
          </div>
        </div>
      </div>

      {/* Action Notification Toast */}
      {actionSuccessMsg && (
        <div className="p-3 rounded-2xl bg-[var(--color-tier-low-bg)] border border-[var(--color-tier-low-border)] text-[var(--color-tier-low)] text-xs font-mono flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[var(--color-tier-low)]" />
            <span>{actionSuccessMsg}</span>
          </div>
          <button
            onClick={() => setActionSuccessMsg(null)}
            className="text-[10px] uppercase tracking-wider text-[var(--color-tier-low)] hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Grid: Clusters List (Left) & Cluster Detail View (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Cluster Catalog (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-3 shadow-xs">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search cluster, signature, account..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl pl-8 pr-3 py-2 text-xs text-[var(--text-primary)] placeholder-slate-400 focus:outline-none focus:border-[var(--color-brand)]"
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-[var(--text-muted)] font-mono text-[11px] flex items-center gap-1 font-medium">
                <Filter className="w-3 h-3" /> Filter:
              </span>
              <div className="flex gap-1.5">
                {(['all', 'high', 'critical'] as const).map((sev) => (
                  <button
                    key={sev}
                    onClick={() => setFilterSeverity(sev)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono capitalize transition-all ${
                      filterSeverity === sev
                        ? 'bg-[var(--color-brand-bg)] text-[var(--color-brand-strong)] border border-[var(--color-brand-border)] font-bold'
                        : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)]'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Cluster Cards List */}
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
            {filteredClusters.map((cluster) => {
              const isSelected = selectedCluster?.id === cluster.id;
              const isContained = containedClusterIds.includes(cluster.id);

              return (
                <div
                  key={cluster.id}
                  onClick={() => setSelectedClusterId(cluster.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--color-brand-bg)] border-[var(--color-brand)] shadow-md ring-1 ring-[var(--color-brand)]/30'
                      : 'bg-[var(--bg-card)] border-[var(--border-color)] hover:bg-[var(--bg-hover)]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-[var(--color-brand)]/10 border border-[var(--color-brand)]/30 flex items-center justify-center text-[var(--color-brand)]">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[var(--text-primary)] font-sans">
                          {cluster.clusterName}
                        </h4>
                        <span className="text-[10px] text-[var(--text-muted)] font-mono">
                          {cluster.accounts.length} linked accounts
                        </span>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                        isContained
                          ? 'bg-[var(--color-tier-low-bg)] text-[var(--color-tier-low)] border-[var(--color-tier-low-border)]'
                          : 'bg-[var(--color-tier-high-bg)] text-[var(--color-tier-high)] border border-[var(--color-tier-high-border)]'
                      }`}
                    >
                      {isContained ? '🔒 Contained' : `${cluster.similarityScore}% Match`}
                    </span>
                  </div>

                  <p className="text-xs text-[var(--text-secondary)] mt-2 line-clamp-2">
                    {cluster.description}
                  </p>

                  <div className="mt-3 pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)]">
                    <span>Sig: {cluster.sharedOperatorSignature.substring(0, 16)}...</span>
                    <span>Subnet: {cluster.primarySubnet}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Cluster Breakdown & Quarantine Action (7 Cols) */}
        <div className="lg:col-span-7">
          {selectedCluster ? (
            <div className="p-5 md:p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xs space-y-5">
              {/* Header & Bulk Containment Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--border-subtle)]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[var(--text-muted)] uppercase">
                      CLUSTER DETAILS
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[var(--color-brand)]/10 text-[var(--color-brand-strong)] border border-[var(--color-brand)]/30">
                      {selectedCluster.id}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[var(--text-primary)] mt-1">
                    {selectedCluster.clusterName}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleBulkContainment(selectedCluster.id)}
                    disabled={containedClusterIds.includes(selectedCluster.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold font-mono flex items-center gap-1.5 transition-all shadow-xs ${
                      containedClusterIds.includes(selectedCluster.id)
                        ? 'bg-[var(--color-tier-low-bg)] text-[var(--color-tier-low)] border border-[var(--color-tier-low-border)] opacity-80'
                        : 'bg-[var(--color-brand-solid)] hover:opacity-90 text-white'
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>
                      {containedClusterIds.includes(selectedCluster.id)
                        ? 'Cluster Contained'
                        : 'Bulk Contain All Accounts'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Cluster Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-sans">
                <div className="p-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)]">
                  <span className="text-[10px] font-mono text-[var(--text-muted)]">LINKED ACCOUNTS</span>
                  <p className="text-base font-bold font-mono text-[var(--text-primary)] mt-0.5">
                    {selectedCluster.accounts.length} Users
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)]">
                  <span className="text-[10px] font-mono text-[var(--text-muted)]">MATCH CONFIDENCE</span>
                  <p className="text-base font-bold font-mono text-[var(--color-brand)] mt-0.5">
                    {selectedCluster.similarityScore}%
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)]">
                  <span className="text-[10px] font-mono text-[var(--text-muted)]">FINGERPRINT</span>
                  <p className="text-xs font-mono font-bold text-[var(--text-primary)] mt-1 truncate">
                    {selectedCluster.sharedOperatorSignature}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)]">
                  <span className="text-[10px] font-mono text-[var(--text-muted)]">BOT SUB-NETWORK</span>
                  <p className="text-xs font-mono font-bold text-[var(--text-primary)] mt-1">
                    {selectedCluster.primarySubnet}
                  </p>
                </div>
              </div>

              {/* Connected Accounts Table */}
              <div className="space-y-2">
                <span className="text-xs font-bold font-mono uppercase tracking-wider text-[var(--text-secondary)]">
                  Accounts Connected to this Bot Ring:
                </span>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-sans">
                    <thead>
                      <tr className="border-b border-[var(--border-subtle)] text-[var(--text-muted)] font-mono text-[10px]">
                        <th className="pb-2 font-semibold">ACCOUNT HOLDER</th>
                        <th className="pb-2 font-semibold">ACCOUNT ID</th>
                        <th className="pb-2 font-semibold">AMOUNT</th>
                        <th className="pb-2 font-semibold">STATUS</th>
                        <th className="pb-2 font-semibold text-right">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-subtle)]">
                      {selectedCluster.accounts.map((acc) => {
                        const isQuarantined =
                          quarantinedAccountIds.includes(acc.accountId) ||
                          containedClusterIds.includes(selectedCluster.id);

                        return (
                          <tr key={acc.accountId} className="hover:bg-[var(--bg-hover)]">
                            <td className="py-2.5 font-semibold text-[var(--text-primary)]">
                              {acc.accountHolder}
                            </td>
                            <td className="py-2.5 font-mono text-[var(--text-muted)]">
                              {acc.accountId}
                            </td>
                            <td className="py-2.5 font-mono font-semibold text-[var(--text-primary)]">
                              ₹{(acc.transactionAmount || 120000).toLocaleString('en-IN')}
                            </td>
                            <td className="py-2.5">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                                  isQuarantined
                                    ? 'bg-[var(--color-tier-low-bg)] text-[var(--color-tier-low)] border border-[var(--color-tier-low-border)]'
                                    : 'bg-[var(--color-tier-high-bg)] text-[var(--color-tier-high)] border border-[var(--color-tier-high-border)]'
                                }`}
                              >
                                {isQuarantined ? '🔒 Quarantined' : 'Active / Vulnerable'}
                              </span>
                            </td>
                            <td className="py-2.5 text-right">
                              <button
                                onClick={() => handleSingleAccountQuarantine(acc.accountId)}
                                disabled={isQuarantined}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                                  isQuarantined
                                    ? 'text-[var(--text-muted)] cursor-not-allowed'
                                    : 'bg-[var(--bg-subtle)] hover:bg-[var(--bg-hover)] text-[var(--text-secondary)]'
                                }`}
                              >
                                {isQuarantined ? 'Locked' : 'Lock Account'}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs text-[var(--text-muted)]">
              Select a cluster on the left to inspect its accounts and take action.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
