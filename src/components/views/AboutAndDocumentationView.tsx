import React from 'react';
import {
  HelpCircle,
  Shield,
  ArrowRight,
  CheckCircle2,
  Bell,
  Activity,
  Users,
  Sparkles,
  Scale,
  Bot,
  AlertTriangle,
  FileCheck,
  Search,
  BookOpen
} from 'lucide-react';
import { ViewId } from '../Sidebar';

interface AboutAndDocumentationViewProps {
  onNavigate: (view: ViewId) => void;
}

export const AboutAndDocumentationView: React.FC<AboutAndDocumentationViewProps> = ({ onNavigate }) => {
  const quickStarters = [
    {
      situation: 'I received an alert',
      actionText: 'Open Alerts & Investigations',
      viewId: 'precursor_detector' as ViewId,
      icon: Bell,
      color: 'rose',
    },
    {
      situation: 'I want to check a payment',
      actionText: 'Open Check Transactions',
      viewId: 'live_transactions' as ViewId,
      icon: Activity,
      color: 'blue',
    },
    {
      situation: 'I want to check a customer',
      actionText: 'Open Customer Profiles',
      viewId: 'impersonation_detector' as ViewId,
      icon: Users,
      color: 'indigo',
    },
    {
      situation: 'I see unusual behaviour',
      actionText: 'Open Find New Patterns',
      viewId: 'zero_day_radar' as ViewId,
      icon: Sparkles,
      color: 'purple',
    },
    {
      situation: 'I think multiple accounts may be connected',
      actionText: 'Open Find Similar Accounts',
      viewId: 'doppelganger_cluster' as ViewId,
      icon: Users,
      color: 'amber',
    },
    {
      situation: 'I want to test a possible situation',
      actionText: 'Open Test What Could Happen',
      viewId: 'counterfactual_sim' as ViewId,
      icon: Scale,
      color: 'emerald',
    },
  ];

  return (
    <div id="view-how-to-use" className="p-4 md:p-6 space-y-6 animate-in fade-in transition-colors font-sans">
      {/* Top Banner */}
      <div className="p-5 md:p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[var(--color-brand)]/10 text-[var(--color-brand-strong)] border border-[var(--color-brand)]/30 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-[var(--color-brand)]" />
              OPERATIONAL USER GUIDE
            </span>
            <span className="text-xs text-[var(--text-muted)] font-mono">• Simple Step-by-Step Instructions</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] tracking-tight mt-1">
            How to Use FraudGuard
          </h2>
          <p className="text-xs md:text-sm text-[var(--text-secondary)] max-w-3xl leading-relaxed mt-1">
            Follow these simple steps to review activity and find possible fraud. You do not need any technical background — just follow the checklist below.
          </p>
        </div>

        <button
          onClick={() => onNavigate('about_fraudguard')}
          className="px-4 py-2.5 rounded-2xl bg-[var(--color-brand-bg)] hover:opacity-80 border border-[var(--color-brand-border)] text-[var(--color-brand-strong)] text-xs font-bold font-mono flex items-center gap-2 transition-colors shadow-xs shrink-0"
        >
          <BookOpen className="w-4 h-4" />
          <span>View All Features in Detail →</span>
        </button>
      </div>

      {/* "NOT SURE WHERE TO START?" QUICK DECISION BOX */}
      <div className="p-5 md:p-6 rounded-3xl bg-gradient-to-br from-[var(--color-brand-bg)]/80 via-[var(--bg-card)] to-[var(--bg-subtle)] border border-[var(--color-brand-border)] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[var(--color-brand)]" />
              Not sure where to start?
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Click what you want to do right now and FraudGuard will take you straight to the right tool:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickStarters.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                onClick={() => onNavigate(item.viewId)}
                className="p-3.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--color-brand)] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div className="space-y-1.5">
                  <span className="text-[11px] font-mono text-[var(--text-muted)] block">
                    {item.situation}
                  </span>
                  <p className="text-xs font-bold text-[var(--text-primary)] group-hover:text-[var(--color-brand)] transition-colors flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5 text-[var(--color-brand)] shrink-0" />
                    {item.actionText}
                  </p>
                </div>
                <div className="pt-2 mt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[10px] font-mono text-[var(--color-brand)] font-semibold">
                  <span>Launch tool</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}

          {/* Assistant option */}
          <div className="p-3.5 rounded-2xl bg-[var(--color-brand-solid)] text-white border border-[var(--color-brand-solid)]/70 shadow-sm flex flex-col justify-between">
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono text-white/80 block">
                I don't know what anything means
              </span>
              <p className="text-xs font-bold flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-white shrink-0" />
                Ask the AI Assistant
              </p>
            </div>
            <p className="text-[10px] text-white/80 mt-2 pt-2 border-t border-white/20">
              Click the green bubble in the bottom right corner anytime to chat.
            </p>
          </div>
        </div>
      </div>

      {/* 8-STEP SIMPLE GUIDE */}
      <div className="space-y-4">
        <h3 className="text-sm font-mono font-bold text-[var(--text-primary)] uppercase tracking-wider">
          The 8 Simple Steps to Review Activity
        </h3>

        <div className="space-y-4">
          {/* STEP 1 */}
          <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-[var(--color-brand-solid)] text-white flex items-center justify-center text-xs font-mono font-bold shrink-0">
                  1
                </span>
                <h4 className="text-sm font-bold text-[var(--text-primary)]">
                  Step 1: Start with Overview
                </h4>
              </div>
              <button
                onClick={() => onNavigate('overview')}
                className="px-3 py-1 rounded-xl bg-[var(--bg-subtle)] hover:bg-[var(--bg-hover)] text-xs font-bold text-[var(--color-brand-strong)] font-mono transition-colors self-start sm:self-auto"
              >
                Go to Overview →
              </button>
            </div>

            <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium">
              Start here to see what is happening across the entire system. Check the main four numbers:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)]">
                <span className="text-[10px] text-[var(--text-muted)]">Transactions Checked:</span>
                <p className="text-sm font-bold text-[var(--text-primary)]">All payments</p>
              </div>
              <div className="p-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)]">
                <span className="text-[10px] text-[var(--text-muted)]">Suspicious Activity:</span>
                <p className="text-sm font-bold text-[var(--color-tier-medium)]">Needs a quick look</p>
              </div>
              <div className="p-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)]">
                <span className="text-[10px] text-[var(--text-muted)]">High-Risk Cases:</span>
                <p className="text-sm font-bold text-[var(--color-tier-high)]">Immediate review</p>
              </div>
              <div className="p-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)]">
                <span className="text-[10px] text-[var(--text-muted)]">Monitored Accounts:</span>
                <p className="text-sm font-bold text-[var(--color-brand)]">Under protection</p>
              </div>
            </div>

            <p className="text-xs text-[var(--text-muted)]">
              💡 <em>If you see a number that looks unusual, open that section to learn more.</em>
            </p>
          </div>

          {/* STEP 2 */}
          <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-[var(--color-brand-solid)] text-white flex items-center justify-center text-xs font-mono font-bold shrink-0">
                  2
                </span>
                <h4 className="text-sm font-bold text-[var(--text-primary)]">
                  Step 2: Check Alerts
                </h4>
              </div>
              <button
                onClick={() => onNavigate('precursor_detector')}
                className="px-3 py-1 rounded-xl bg-[var(--bg-subtle)] hover:bg-[var(--bg-hover)] text-xs font-bold text-[var(--color-brand-strong)] font-mono transition-colors self-start sm:self-auto"
              >
                Open Alerts & Investigations →
              </button>
            </div>

            <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium">
              Here you can see activity that may need your attention. Follow these 4 easy steps:
            </p>

            <ol className="list-decimal pl-5 space-y-1 text-xs text-[var(--text-secondary)] leading-relaxed">
              <li>Open an alert from the list.</li>
              <li>Read why it was flagged (e.g. repeated cancellations or fast copy-pasting).</li>
              <li>Check the related customer or payment.</li>
              <li>Decide whether it needs further review, blocking, or approval.</li>
            </ol>
          </div>

          {/* STEP 3 */}
          <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-[var(--color-brand-solid)] text-white flex items-center justify-center text-xs font-mono font-bold shrink-0">
                  3
                </span>
                <h4 className="text-sm font-bold text-[var(--text-primary)]">
                  Step 3: Check Transactions
                </h4>
              </div>
              <button
                onClick={() => onNavigate('live_transactions')}
                className="px-3 py-1 rounded-xl bg-[var(--bg-subtle)] hover:bg-[var(--bg-hover)] text-xs font-bold text-[var(--color-brand-strong)] font-mono transition-colors self-start sm:self-auto"
              >
                Open Check Transactions →
              </button>
            </div>

            <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium">
              Use this page to find transactions that look unusual. Look for:
            </p>

            <ul className="list-disc pl-5 space-y-1 text-xs text-[var(--text-secondary)]">
              <li><strong>Large amounts:</strong> Transfers that are much higher than normal.</li>
              <li><strong>Repeated payments:</strong> Multiple transfers sent to the same payee within minutes.</li>
              <li><strong>Unusual timing:</strong> Activity happening at 3 AM or from a new device.</li>
              <li><strong>Unusual behaviour:</strong> Pasting account numbers in less than half a second.</li>
            </ul>
          </div>

          {/* STEP 4 */}
          <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-[var(--color-brand-solid)] text-white flex items-center justify-center text-xs font-mono font-bold shrink-0">
                  4
                </span>
                <h4 className="text-sm font-bold text-[var(--text-primary)]">
                  Step 4: Check a Customer
                </h4>
              </div>
              <button
                onClick={() => onNavigate('impersonation_detector')}
                className="px-3 py-1 rounded-xl bg-[var(--bg-subtle)] hover:bg-[var(--bg-hover)] text-xs font-bold text-[var(--color-brand-strong)] font-mono transition-colors self-start sm:self-auto"
              >
                Open Customer Profiles →
              </button>
            </div>

            <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium">
              Use this page when you want to understand one customer in detail:
            </p>

            <ol className="list-decimal pl-5 space-y-1 text-xs text-[var(--text-secondary)]">
              <li>Find the customer by name or account ID.</li>
              <li>Open their profile.</li>
              <li>Check their recent activity.</li>
              <li>Look for unusual behaviour (like changes in typing cadence).</li>
              <li>Review their overall risk level.</li>
            </ol>
          </div>

          {/* STEP 5 */}
          <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-[var(--color-brand-solid)] text-white flex items-center justify-center text-xs font-mono font-bold shrink-0">
                  5
                </span>
                <h4 className="text-sm font-bold text-[var(--text-primary)]">
                  Step 5: Find New Patterns
                </h4>
              </div>
              <button
                onClick={() => onNavigate('zero_day_radar')}
                className="px-3 py-1 rounded-xl bg-[var(--bg-subtle)] hover:bg-[var(--bg-hover)] text-xs font-bold text-[var(--color-brand-strong)] font-mono transition-colors self-start sm:self-auto"
              >
                Open Find New Patterns →
              </button>
            </div>

            <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium">
              Use this when you want to find unusual behaviour that may not have been seen before. FraudGuard groups strange new activity automatically so you can block new attack methods before they spread.
            </p>
          </div>

          {/* STEP 6 */}
          <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-[var(--color-brand-solid)] text-white flex items-center justify-center text-xs font-mono font-bold shrink-0">
                  6
                </span>
                <h4 className="text-sm font-bold text-[var(--text-primary)]">
                  Step 6: Find Similar Accounts
                </h4>
              </div>
              <button
                onClick={() => onNavigate('doppelganger_cluster')}
                className="px-3 py-1 rounded-xl bg-[var(--bg-subtle)] hover:bg-[var(--bg-hover)] text-xs font-bold text-[var(--color-brand-strong)] font-mono transition-colors self-start sm:self-auto"
              >
                Open Find Similar Accounts →
              </button>
            </div>

            <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium">
              Use this to find multiple accounts that behave in very similar ways. Even if scammers use different fake names and IP addresses, their subconscious typing and click timing link them together.
            </p>
          </div>

          {/* STEP 7 */}
          <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-[var(--color-brand-solid)] text-white flex items-center justify-center text-xs font-mono font-bold shrink-0">
                  7
                </span>
                <h4 className="text-sm font-bold text-[var(--text-primary)]">
                  Step 7: Test What Could Happen
                </h4>
              </div>
              <button
                onClick={() => onNavigate('counterfactual_sim')}
                className="px-3 py-1 rounded-xl bg-[var(--bg-subtle)] hover:bg-[var(--bg-hover)] text-xs font-bold text-[var(--color-brand-strong)] font-mono transition-colors self-start sm:self-auto"
              >
                Open Test What Could Happen →
              </button>
            </div>

            <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium">
              Use this to see how a situation would change if something were different. You can test different rule choices (like blocking vs asking for extra verification) to see estimated money saved without bothering normal users.
            </p>
          </div>

          {/* STEP 8 */}
          <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xs space-y-3">
            <div className="flex items-center gap-2.5 pb-2 border-b border-[var(--border-subtle)]">
              <span className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xs font-mono font-bold shrink-0">
                8
              </span>
              <h4 className="text-sm font-bold text-[var(--text-primary)]">
                Step 8: Finish Your Review
              </h4>
            </div>

            <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium">
              When you have reviewed the information, choose what action to take:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-sans">
              <div className="p-3 rounded-xl bg-[var(--color-tier-low-bg)] border border-[var(--color-tier-low-border)] space-y-1">
                <span className="font-bold text-[var(--color-tier-low)] block">✅ Approve Transfer</span>
                <p className="text-[11px] text-[var(--text-secondary)]">If the payment is verified and matches normal customer habits.</p>
              </div>

              <div className="p-3 rounded-xl bg-[var(--color-tier-medium-bg)] border border-[var(--color-tier-medium-border)] space-y-1">
                <span className="font-bold text-[var(--color-tier-medium)] block">⚠️ Step-Up / Review</span>
                <p className="text-[11px] text-[var(--text-secondary)]">Ask the customer for biometric or OTP re-verification.</p>
              </div>

              <div className="p-3 rounded-xl bg-[var(--color-tier-high-bg)] border border-[var(--color-tier-high-border)] space-y-1">
                <span className="font-bold text-[var(--color-tier-high)] block">🛑 Quarantine / Block</span>
                <p className="text-[11px] text-[var(--text-secondary)]">Immediately stop payment and freeze compromised session.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
