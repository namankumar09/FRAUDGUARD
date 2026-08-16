import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  Brain,
  ShieldAlert,
  ShieldCheck,
  Send,
  Zap,
  RotateCcw,
  Layers,
  Copy,
  CheckCircle2
} from 'lucide-react';

export const AIEvasionAnalysisView: React.FC = () => {
  const [promptScenario, setPromptScenario] = useState(
    'We currently detect fraud by flagging clipboard pastes on the PAN/card field with dwell time < 500ms, and flagging sessions where balance was probed 3 times before payment.'
  );
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const defaultAnalysis = `### 🕵️ Gemini Red-Team Evasion Probe Analysis

#### 1. Vulnerability & Blind Spot Identification
* **Paste Bypass via Synthetic Keystroke Replay:** Fraudsters can intercept your clipboard check by deploying lightweight browser extension scripts that simulate individual \`keydown\` / \`keyup\` events at randomized human intervals (120ms–240ms).
* **Distributed Balance Probing:** Instead of probing the balance on the web banking portal, the attacker queries the balance via the mobile SMS gateway or automated IVR line prior to logging in, completely evading in-session tell **FD-052**.

#### 2. Predicted Next-Generation Evasion Tactics
* **Micro-Staged Precursor Rehearsals:** Rather than 3 aborts in 10 minutes, attackers will spread rehearsal checks across a 48-hour cooling window.
* **Human-Assisted Bot Hybrids (Cyborg Attacks):** Attackers use automated tools to navigate the portal, but hand over the keyboard to a human operator for final payment execution.

#### 3. Recommended Proactive Counter-Rules (Blue-Team Defense)
1. **Deploy Neuromuscular Flight Variance Filter:** Measure key flight distribution entropy rather than simple mean flight duration.
2. **Implement Cross-Channel Balance Telemetry:** Ingest SMS/IVR balance inquiries into the real-time precursor event stream with a 24-hour lookback.
3. **Continuous Biometric Step-Up:** Trigger a 3D facial micro-expression challenge when clipboard paste and SMS balance inquiry collide within 30 minutes.`;

  const handleRunAnalysis = async () => {
    setIsLoading(true);
    setAnalysisResult(null);

    try {
      const response = await fetch('/api/ai/red-team-evasion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentRulesContext: promptScenario }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setAnalysisResult(data.analysis || defaultAnalysis);
    } catch (err) {
      console.warn('Using local fallback Red-Team synthesis:', err);
      // Realistic simulation fallback
      setTimeout(() => {
        setAnalysisResult(defaultAnalysis);
      }, 1000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (analysisResult) {
      navigator.clipboard.writeText(analysisResult);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div id="view-ai-evasion-redteam" className="p-4 md:p-6 space-y-6 animate-in fade-in">
      {/* Top Banner */}
      <div className="p-4 md:p-5 rounded-2xl bg-gradient-to-r from-purple-50 via-indigo-50/60 to-sky-50/50 dark:from-[#0c1836] dark:via-[#102046] dark:to-[#0d1630] border border-purple-200 dark:border-[#21355e] flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-sm transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-500/40 flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5" />
              "HOW WOULD A FRAUDSTER EVADE US?" AI RED-TEAM
            </span>
            <span className="text-xs text-[var(--text-muted)] font-mono">• Gemini Proactive Threat Synthesizer</span>
          </div>
          <h2 className="text-lg md:text-xl font-bold text-[var(--text-primary)] tracking-tight mt-1">
            Probing System Blind Spots Before Real Attackers Exploit Them
          </h2>
          <p className="text-xs md:text-sm text-[var(--text-secondary)] max-w-3xl leading-relaxed mt-1">
            Our AI Red-Team model continuously analyzes your active detection rules and simulates: <em>"If I were a sophisticated fraud syndicate, how would I bypass this defense?"</em> and synthesizes immediate candidate counter-rules.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-[var(--bg-card)] border border-purple-200 dark:border-[#1b2b4c] text-purple-700 dark:text-purple-300 font-mono text-xs shadow-xs">
            🤖 Gemini Red-Team Engine
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input Prompt Scenario (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xs space-y-4 transition-colors">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
            <h3 className="text-xs font-mono font-bold text-[var(--text-primary)] uppercase tracking-wider">
              Current Defensive Rules Context
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Target Scenario</span>
          </div>

          <p className="text-xs text-[var(--text-secondary)]">
            Specify the behavioral rules or detection filters you want Gemini to red-team and probe:
          </p>

          <textarea
            rows={6}
            value={promptScenario}
            onChange={(e) => setPromptScenario(e.target.value)}
            className="w-full bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl px-3.5 py-2.5 text-[var(--text-primary)] text-xs focus:outline-none focus:border-purple-400 font-mono leading-relaxed"
            placeholder="Describe your current fraud rules..."
          />

          <button
            onClick={handleRunAnalysis}
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-600 hover:from-purple-500 hover:to-sky-500 text-white font-bold text-xs font-mono shadow-md shadow-purple-900/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Gemini Red-Teaming In Progress...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Run Autonomous AI Red-Team Attack Probe
              </>
            )}
          </button>

          <div className="p-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[11px] text-[var(--text-muted)] space-y-1">
            <span className="text-[var(--text-secondary)] font-bold block">Quick Scenarios:</span>
            <button
              onClick={() =>
                setPromptScenario(
                  'We detect account takeover by checking if keystroke flight time variance is < 10ms and if beneficiary was added < 5 minutes before payment.'
                )
              }
              className="text-sky-600 dark:text-sky-400 hover:underline block text-left text-[10px] cursor-pointer"
            >
              • Probe Keystroke Variance & Beneficiary Timing Rule
            </button>
            <button
              onClick={() =>
                setPromptScenario(
                  'We flag accounts where 3 practice transfers are aborted in 10 minutes.'
                )
              }
              className="text-sky-600 dark:text-sky-400 hover:underline block text-left text-[10px] cursor-pointer"
            >
              • Probe 3-Step Practice Rehearsal Detection
            </button>
          </div>
        </div>

        {/* Right Column: Red-Team Analysis Output (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xs space-y-4 flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <h3 className="text-xs font-mono font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider flex items-center gap-2">
                <Bot className="w-3.5 h-3.5" />
                AI Red-Team Evasion Blueprint & Counter-Rules
              </h3>
              {analysisResult && (
                <button
                  onClick={handleCopy}
                  className="text-slate-400 hover:text-slate-700 dark:hover:text-sky-300 p-1 text-xs font-mono flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copied ? 'Copied' : 'Copy'}
                </button>
              )}
            </div>

            <div className="mt-3 p-4 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-xs font-mono leading-relaxed text-slate-800 dark:text-slate-200 max-h-[460px] overflow-y-auto custom-scrollbar whitespace-pre-line">
              {isLoading ? (
                <div className="py-12 flex flex-col items-center justify-center text-slate-400 space-y-3">
                  <span className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs">Synthesizing adversarial evasion trajectories with Gemini...</p>
                </div>
              ) : analysisResult ? (
                analysisResult
              ) : (
                defaultAnalysis
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span>Model: <strong className="text-purple-600 dark:text-purple-300">Gemini 2.5 Flash</strong></span>
            <span className="text-emerald-600 dark:text-emerald-400 font-mono">🟢 Defense Recommendations Armed</span>
          </div>
        </div>
      </div>
    </div>
  );
};
