import React, { useState } from 'react';
import {
  Radio,
  Share2,
  TrendingUp,
  ShieldAlert,
  Users,
  ArrowRight,
  Clock,
  Sparkles,
  Layers
} from 'lucide-react';
import { MOCK_ECHO_PROPAGATIONS } from '../../data/mockFraudData';

export const CrossCustomerEchoView: React.FC = () => {
  const [echoes] = useState(MOCK_ECHO_PROPAGATIONS);
  const [selectedEcho, setSelectedEcho] = useState(MOCK_ECHO_PROPAGATIONS[0]);

  return (
    <div id="view-cross-customer-echo" className="p-4 md:p-6 space-y-6 animate-in fade-in">
      {/* Top Banner */}
      <div className="p-4 md:p-5 rounded-2xl bg-gradient-to-r from-[#0c1836] via-[#102046] to-[#0d1630] border border-[#21355e] flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-purple-950 text-purple-300 border border-purple-500/40 flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5" />
              CROSS-CUSTOMER BEHAVIORAL ECHO RADAR
            </span>
            <span className="text-xs text-slate-400 font-mono">• Viral Attack Propagation Engine</span>
          </div>
          <h2 className="text-lg md:text-xl font-bold text-white tracking-tight mt-1">
            Tracking How Attack Strains Travel Between Unrelated Accounts
          </h2>
          <p className="text-xs md:text-sm text-slate-300 max-w-3xl leading-relaxed mt-1">
            When an uncataloged attack pattern appears on Customer A, does it echo onto Customer B, C, and D within minutes? Our graph models <strong>viral behavioral contagion across independent customer accounts</strong>.
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-[#091122] border border-[#1b2b4c] text-center font-mono">
          <span className="text-[10px] text-slate-400 block">Propagation Speed</span>
          <p className="text-xl font-bold text-rose-400 mt-0.5">{selectedEcho.propagationSpeed}</p>
          <span className="text-[10px] text-amber-400">Viral Contagion Active</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Propagation Trails (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
            Active Behavioral Propagation Chains
          </h3>

          <div className="space-y-3">
            {echoes.map((e) => {
              const isSelected = selectedEcho?.id === e.id;
              return (
                <div
                  key={e.id}
                  onClick={() => setSelectedEcho(e)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#121f3d] border-purple-400 shadow-xl ring-1 ring-purple-400/30'
                      : 'bg-[#0c1427] border-[#1b2b4c] hover:bg-[#0f1a35]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-purple-300 bg-purple-950 px-2 py-0.5 rounded border border-purple-500/40">
                      {e.echoPatternId}
                    </span>
                    <span className="text-[10px] font-mono text-rose-400 font-bold">
                      {e.propagationSpeed}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white mt-2">{e.name}</h4>
                  <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">{e.description}</p>

                  <div className="mt-3 pt-2 border-t border-[#1a2846] flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>Patient Zero: <strong className="text-emerald-400">{e.originCustomer}</strong></span>
                    <span>Echoes: <strong className="text-white">{e.echoVictims.length}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Propagation Chain Visualization (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {selectedEcho && (
            <div className="p-5 rounded-2xl bg-[#0c1427] border border-[#1b2b4c] shadow-lg space-y-5">
              <div className="pb-3 border-b border-[#1b2b4c]">
                <span className="text-[10px] font-mono text-purple-400 font-bold uppercase">
                  Contagion Dossier: {selectedEcho.echoPatternId}
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">{selectedEcho.name}</h3>
                <p className="text-xs text-slate-300 mt-1">{selectedEcho.description}</p>
              </div>

              {/* Patient Zero -> Echo Chain Visual */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                  Chronological Contagion Graph
                </h4>

                {/* Patient Zero */}
                <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-xs font-mono">
                      P0
                    </span>
                    <div>
                      <p className="font-bold text-white">Patient Zero: {selectedEcho.originCustomer}</p>
                      <span className="text-[10px] text-slate-400 font-mono">Initial attack strain execution • T+0:00</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-900 text-emerald-200 text-[10px] font-mono font-bold">
                    ORIGIN
                  </span>
                </div>

                {/* Echo Victims */}
                <div className="space-y-2 pl-4 border-l-2 border-purple-500/40">
                  {selectedEcho.echoVictims.map((v, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#091122] border border-[#1c2c4d] flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-purple-400 font-bold">↳ T+{v.timeDeltaMinutes}m</span>
                        <span className="font-medium text-white">{v.customerName}</span>
                      </div>
                      <span className="font-mono text-[10px] text-rose-300 bg-rose-950 px-2 py-0.5 rounded border border-rose-500/40">
                        {v.similarity}% Exact Strain Match
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Automatic Network Quarantine Alert */}
              <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 text-xs text-rose-200 leading-relaxed">
                <strong>Automatic Network Containment:</strong> Once an uncataloged strain echoes to &ge;2 unrelated accounts within 30 minutes, AegisBio automatically creates an ephemeral firewall signature deployed to all 24,900 accounts.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
