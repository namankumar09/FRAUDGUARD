import React, { useState } from 'react';
import {
  GitFork,
  Dna,
  GitBranch,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Layers,
  Info
} from 'lucide-react';
import { MOCK_TREE_ROOT } from '../../data/mockFraudData';
import { MutationTreeNode } from '../../types/fraud';

export const DnaMutationTreeView: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<MutationTreeNode>(MOCK_TREE_ROOT.children?.[0].children?.[0] || MOCK_TREE_ROOT);

  const renderTree = (node: MutationTreeNode, depth = 0) => {
    const isSelected = selectedNode?.id === node.id;

    return (
      <div key={node.id} className="space-y-2">
        <div
          onClick={() => setSelectedNode(node)}
          className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs ${
            isSelected
              ? 'bg-purple-50 border-purple-400 ring-2 ring-purple-400/40 text-slate-900 font-bold dark:bg-[#152447] dark:text-white'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-[#091122] dark:border-[#1b2b4c] dark:text-slate-300 dark:hover:bg-[#0e1b38]'
          }`}
          style={{ marginLeft: `${depth * 20}px` }}
        >
          <div className="flex items-center gap-2">
            <span className="text-purple-600 dark:text-purple-400 font-mono font-bold">🧬 {node.name}</span>
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">({node.discoveredDate})</span>
          </div>
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
              node.severity === 'critical'
                ? 'bg-rose-100 text-rose-700 border border-rose-300 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-500/40'
                : 'bg-amber-100 text-amber-700 border border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-500/40'
            }`}
          >
            {node.severity.toUpperCase()}
          </span>
        </div>

        {node.children && node.children.map((child) => renderTree(child, depth + 1))}
      </div>
    );
  };

  return (
    <div id="view-mutation-tree" className="p-4 md:p-6 space-y-6 animate-in fade-in">
      {/* Top Banner */}
      <div className="p-4 md:p-5 rounded-2xl bg-gradient-to-r from-purple-50 via-white to-purple-50 dark:from-[#0c1836] dark:via-[#102046] dark:to-[#0d1630] border border-purple-200/70 dark:border-[#21355e] flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xs dark:shadow-xl transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-purple-100 text-purple-700 border border-purple-300 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-500/40 flex items-center gap-1.5">
              <GitFork className="w-3.5 h-3.5" />
              FRAUD DNA MUTATION PHYLOGENETIC TREE
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">• Evolutionary Threat Genealogy</span>
          </div>
          <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white tracking-tight mt-1">
            Visualizing the Evolutionary Genealogy of Fraud Strains
          </h2>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed mt-1">
            Just like viral biology, financial fraud strategies mutate from ancestral strains: <strong>Pattern A (Ancestral Clipboard) → A1/A2 → A2.1 (Jitter Rehearsal) → A2.1.1 (Polymorphic Echo)</strong>.
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-purple-50 border border-purple-200 dark:bg-[#091122] dark:border-[#1b2b4c] text-center font-mono">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Genealogical Depth</span>
          <p className="text-xl font-bold text-purple-700 dark:text-purple-300 mt-0.5">Generation 4</p>
          <span className="text-[10px] text-sky-600 dark:text-sky-400">12 Lineages Mapped</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Tree Hierarchy (6 cols) */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs dark:bg-[#0c1427] dark:border-[#1b2b4c] dark:shadow-lg space-y-3 transition-colors">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-[#1b2b4c]">
            <h3 className="text-xs font-mono font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Phylogenetic Branching Tree
            </h3>
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Click node to inspect</span>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar pr-1">
            {renderTree(MOCK_TREE_ROOT)}
          </div>
        </div>

        {/* Right Column: Node Forensic Dossier (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {selectedNode && (
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs dark:bg-[#0c1427] dark:border-[#1b2b4c] dark:shadow-lg space-y-5 transition-colors">
              <div className="pb-3 border-b border-slate-100 dark:border-[#1b2b4c]">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400 font-bold uppercase">
                    Strain ID: {selectedNode.id}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">• Discovered: {selectedNode.discoveredDate}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">{selectedNode.name}</h3>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase">Mutation Description</span>
                <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed bg-slate-50 border-slate-200 dark:bg-[#080e1e] p-3 rounded-xl border dark:border-[#1a2846]">
                  {selectedNode.description}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 dark:bg-purple-950/30 dark:border-purple-500/40 text-xs space-y-1.5">
                <span className="font-mono font-bold text-purple-700 dark:text-purple-300 uppercase text-[11px] block">
                  🧬 Mutation Mechanism & Genetic Drift
                </span>
                <p className="text-purple-900/90 dark:text-purple-100/90 text-xs leading-relaxed">
                  {selectedNode.mutationDetails}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-500/30 text-xs flex items-center justify-between text-emerald-700 dark:text-emerald-200">
                <span>Phylogenetic Match Filter: Active</span>
                <span className="font-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400">100% Lineage Traced</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
