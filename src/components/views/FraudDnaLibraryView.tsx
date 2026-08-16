import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Download,
  Copy,
  CheckCircle2,
  Filter,
  ShieldAlert,
  Code2,
  FileCode2,
  Layers,
  Sparkles
} from 'lucide-react';
import { MOCK_DNA_SIGNATURES } from '../../data/mockFraudData';
import { FraudDnaSignature } from '../../types/fraud';

export const FraudDnaLibraryView: React.FC = () => {
  const [signatures, setSignatures] = useState<FraudDnaSignature[]>(MOCK_DNA_SIGNATURES);
  const [selectedSignature, setSelectedSignature] = useState<FraudDnaSignature>(MOCK_DNA_SIGNATURES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  const filteredSignatures = signatures.filter((sig) => {
    return (
      sig.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sig.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sig.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleCopyRule = (ruleCode: string) => {
    navigator.clipboard.writeText(ruleCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportAllJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(signatures, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'aegisbio_fraud_dna_catalog.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div id="view-dna-library" className="p-4 md:p-6 space-y-6 animate-in fade-in">
      {/* Top Banner */}
      <div className="p-4 md:p-5 rounded-2xl bg-gradient-to-r from-sky-50 via-white to-sky-50 dark:from-[#0c1836] dark:via-[#102046] dark:to-[#0d1630] border border-sky-200/70 dark:border-[#21355e] flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xs dark:shadow-xl transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-sky-950 text-sky-300 border border-sky-500/40 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              FRAUD DNA SIGNATURE CATALOG & RULES REPOSITORY
            </span>
            <span className="text-xs text-slate-400 font-mono">• Continuous Threat Intelligence Taxonomy</span>
          </div>
          <h2 className="text-lg md:text-xl font-bold text-[var(--text-primary)] tracking-tight mt-1">
            Global Repository of Discovered Behavioral Fraud Signatures
          </h2>
          <p className="text-xs md:text-sm text-slate-300 max-w-3xl leading-relaxed mt-1">
            Browse our taxonomy of cataloged behavioral attack strains (FD-001 through FD-120), inspect their YAML/JSON rules, and deploy them across distributed banking edge nodes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportAllJson}
            className="px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs font-mono shadow-md flex items-center gap-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5" /> Export Catalog JSON
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Signature Catalog List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search DNA catalog by ID, name, or attack type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[var(--bg-card)] border border-slate-300 rounded-xl pl-8 pr-3 py-2 text-xs text-[var(--text-primary)] placeholder-slate-400 dark:border-[#1e2f54] dark:placeholder-slate-500 focus:outline-none focus:border-sky-400"
            />
          </div>

          <div className="space-y-3 max-h-[580px] overflow-y-auto custom-scrollbar pr-1">
            {filteredSignatures.map((sig) => {
              const isSelected = selectedSignature?.id === sig.id;
              return (
                <div
                  key={sig.id}
                  onClick={() => setSelectedSignature(sig)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-sky-50 border-sky-400 shadow-md ring-1 ring-sky-400/20 dark:bg-[#121f3d] dark:shadow-xl dark:ring-1 dark:ring-sky-400/30'
                      : 'bg-[var(--bg-card)] border-[var(--border-color)] hover:bg-[var(--bg-hover)]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200 dark:text-sky-300 dark:bg-[#14203a] dark:border-[#203358]">
                      {sig.code}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 capitalize">
                      {sig.category}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-[var(--text-primary)] mt-1.5">{sig.name}</h4>
                  <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">{sig.description}</p>

                  <div className="mt-2.5 pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-400">Severity: <b className="text-rose-400 uppercase">{sig.severity}</b></span>
                    <span className="text-emerald-400">🟢 Edge Deployed</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Signature Rule Inspector & Code View (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {selectedSignature && (
            <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xs dark:shadow-lg space-y-5">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--border-subtle)]">
                <div>
                  <span className="text-[10px] font-mono text-sky-400 uppercase font-bold">
                    Signature Code: {selectedSignature.code}
                  </span>
                  <h3 className="text-base font-bold text-[var(--text-primary)] mt-0.5">
                    {selectedSignature.name}
                  </h3>
                </div>

                <button
                  onClick={() => handleCopyRule(selectedSignature.ruleDefinitionYaml)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 text-xs font-mono text-[var(--text-secondary)] dark:bg-[#14203a] dark:hover:bg-[#1c2e54] dark:border-[#203358] flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copied ? 'Rule Copied!' : 'Copy YAML Rule'}
                </button>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Description & Threat Scope</span>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed bg-[var(--bg-subtle)] p-3 rounded-xl border border-[var(--border-color)]">
                  {selectedSignature.description}
                </p>
              </div>

              {/* YAML / JSON Rule Definition */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-sky-400" />
                    Executable Edge Engine Rule (YAML)
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">Live Evaluator</span>
                </div>

                <pre className="p-4 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-sky-700 dark:text-sky-300 font-mono text-[11px] overflow-x-auto leading-relaxed">
                  {selectedSignature.ruleDefinitionYaml}
                </pre>
              </div>

              {/* Edge Deployment Status */}
              <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs flex items-center justify-between text-emerald-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Rule deployed across all 18 production banking gateway clusters.</span>
                </div>
                <span className="font-mono text-[10px] font-bold bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-500/40">
                  Latency: 0.18ms
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
