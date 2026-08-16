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
      <div className="p-5 md:p-6 rounded-3xl bg-white dark:bg-[#121721] border border-slate-200 dark:border-[#1c2638] shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/30 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                FIND SIMILAR ACCOUNTS
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">• Bot Farm & Cluster Finder</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Detect multiple accounts operated by the same fraud actor
            </h2>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs shrink-0">
            <span className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#0c1017] border border-slate-200 dark:border-[#1c2638] text-slate-800 dark:text-slate-200 font-bold">
              👥 {totalFlaggedAccounts} Linked Accounts
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#0c1017] border border-slate-200 dark:border-[#1c2638] text-rose-600 dark:text-rose-400 font-bold">
              ₹{(totalVolumeRisk / 100000).toFixed(1)}L At Risk
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
              Finds groups of accounts that have the exact same subconscious typing rhythm, click timing, and device habits.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0c1017] border border-slate-200 dark:border-[#1c2638] space-y-1">
            <span className="font-bold text-teal-700 dark:text-teal-400 font-mono text-[10px] uppercase block">
              2. What should I look for?
            </span>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Select a cluster on the left and see how many accounts share the same operator signature and timing delays.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0c1017] border border-slate-200 dark:border-[#1c2638] space-y-1">
            <span className="font-bold text-teal-700 dark:text-teal-400 font-mono text-[10px] uppercase block">
              3. What can I do?
            </span>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Click <strong>"Bulk Contain All Accounts"</strong> to freeze the entire bot network in one click before money is transferred.
            </p>
          </div>
        </div>
      </div>

      {/* Action Notification Toast */}
      {actionSuccessMsg && (
        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-mono flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{actionSuccessMsg}</span>
          </div>
          <button
            onClick={() => setActionSuccessMsg(null)}
            className="text-[10px] uppercase tracking-wider text-emerald-700 dark:text-emerald-300 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Grid: Clusters List (Left) & Cluster Detail View (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Cluster Catalog (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-[#121721] border border-slate-200 dark:border-[#1c2638] space-y-3 shadow-xs">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search cluster, signature, account..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#0c1017] border border-slate-200 dark:border-[#1c2638] rounded-xl pl-8 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px] flex items-center gap-1 font-medium">
                <Filter className="w-3 h-3" /> Filter:
              </span>
              <div className="flex gap-1.5">
                {(['all', 'high', 'critical'] as const).map((sev) => (
                  <button
                    key={sev}
                    onClick={() => setFilterSeverity(sev)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono capitalize transition-all ${
                      filterSeverity === sev
                        ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-500/30 font-bold'
                        : 'bg-slate-50 dark:bg-[#0c1017] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-[#1c2638]'
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
                      ? 'bg-teal-50/40 dark:bg-[#151f30] border-teal-400 dark:border-teal-500/60 shadow-md ring-1 ring-teal-400/30'
                      : 'bg-white dark:bg-[#121721] border-slate-200 dark:border-[#1c2638] hover:bg-slate-50 dark:hover:bg-[#161f2e]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-600 dark:text-teal-400">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white font-sans">
                          {cluster.clusterName}
                        </h4>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                          {cluster.accounts.length} linked accounts
                        </span>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                        isContained
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {isContained ? '🔒 Contained' : `${cluster.similarityScore}% Match`}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2">
                    {cluster.description}
                  </p>

                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-[#1c2638] flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400">
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
            <div className="p-5 md:p-6 rounded-2xl bg-white dark:bg-[#121721] border border-slate-200 dark:border-[#1c2638] shadow-xs space-y-5">
              {/* Header & Bulk Containment Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-[#1c2638]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-500 uppercase">
                      CLUSTER DETAILS
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/30">
                      {selectedCluster.id}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                    {selectedCluster.clusterName}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleBulkContainment(selectedCluster.id)}
                    disabled={containedClusterIds.includes(selectedCluster.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold font-mono flex items-center gap-1.5 transition-all shadow-xs ${
                      containedClusterIds.includes(selectedCluster.id)
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 opacity-80'
                        : 'bg-teal-600 hover:bg-teal-500 text-white'
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
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0c1017] border border-slate-200 dark:border-[#1c2638]">
                  <span className="text-[10px] font-mono text-slate-500">LINKED ACCOUNTS</span>
                  <p className="text-base font-bold font-mono text-slate-900 dark:text-white mt-0.5">
                    {selectedCluster.accounts.length} Users
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0c1017] border border-slate-200 dark:border-[#1c2638]">
                  <span className="text-[10px] font-mono text-slate-500">MATCH CONFIDENCE</span>
                  <p className="text-base font-bold font-mono text-teal-600 dark:text-teal-400 mt-0.5">
                    {selectedCluster.similarityScore}%
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0c1017] border border-slate-200 dark:border-[#1c2638]">
                  <span className="text-[10px] font-mono text-slate-500">FINGERPRINT</span>
                  <p className="text-xs font-mono font-bold text-slate-900 dark:text-white mt-1 truncate">
                    {selectedCluster.sharedOperatorSignature}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0c1017] border border-slate-200 dark:border-[#1c2638]">
                  <span className="text-[10px] font-mono text-slate-500">BOT SUB-NETWORK</span>
                  <p className="text-xs font-mono font-bold text-slate-900 dark:text-white mt-1">
                    {selectedCluster.primarySubnet}
                  </p>
                </div>
              </div>

              {/* Connected Accounts Table */}
              <div className="space-y-2">
                <span className="text-xs font-bold font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Accounts Connected to this Bot Ring:
                </span>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-sans">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-[#1c2638] text-slate-500 dark:text-slate-400 font-mono text-[10px]">
                        <th className="pb-2 font-semibold">ACCOUNT HOLDER</th>
                        <th className="pb-2 font-semibold">ACCOUNT ID</th>
                        <th className="pb-2 font-semibold">AMOUNT</th>
                        <th className="pb-2 font-semibold">STATUS</th>
                        <th className="pb-2 font-semibold text-right">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-[#1c2638]">
                      {selectedCluster.accounts.map((acc) => {
                        const isQuarantined =
                          quarantinedAccountIds.includes(acc.accountId) ||
                          containedClusterIds.includes(selectedCluster.id);

                        return (
                          <tr key={acc.accountId} className="hover:bg-slate-50 dark:hover:bg-[#161f2e]">
                            <td className="py-2.5 font-semibold text-slate-900 dark:text-white">
                              {acc.accountHolder}
                            </td>
                            <td className="py-2.5 font-mono text-slate-500 dark:text-slate-400">
                              {acc.accountId}
                            </td>
                            <td className="py-2.5 font-mono font-semibold text-slate-900 dark:text-white">
                              ₹{(acc.transactionAmount || 120000).toLocaleString('en-IN')}
                            </td>
                            <td className="py-2.5">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                                  isQuarantined
                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                                    : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30'
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
                                    ? 'text-slate-400 cursor-not-allowed'
                                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-[#182132] text-slate-700 dark:text-slate-200'
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
            <div className="p-8 text-center rounded-2xl bg-white dark:bg-[#121721] border border-slate-200 dark:border-[#1c2638] text-xs text-slate-500">
              Select a cluster on the left to inspect its accounts and take action.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
