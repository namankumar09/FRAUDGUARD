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
      <div className="p-5 md:p-6 rounded-3xl bg-white dark:bg-[#121721] border border-slate-200 dark:border-[#1c2638] shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/30 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              OPERATIONAL USER GUIDE
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">• Simple Step-by-Step Instructions</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight mt-1">
            How to Use FraudGuard
          </h2>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed mt-1">
            Follow these simple steps to review activity and find possible fraud. You do not need any technical background — just follow the checklist below.
          </p>
        </div>

        <button
          onClick={() => onNavigate('about_fraudguard')}
          className="px-4 py-2.5 rounded-2xl bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/40 dark:hover:bg-teal-900/60 border border-teal-200 dark:border-teal-500/40 text-teal-700 dark:text-teal-300 text-xs font-bold font-mono flex items-center gap-2 transition-colors shadow-xs shrink-0"
        >
          <BookOpen className="w-4 h-4" />
          <span>View All Features in Detail →</span>
        </button>
      </div>

      {/* "NOT SURE WHERE TO START?" QUICK DECISION BOX */}
      <div className="p-5 md:p-6 rounded-3xl bg-gradient-to-br from-teal-50/80 via-white to-slate-50 dark:from-[#0f172a] dark:via-[#111927] dark:to-[#0c1017] border border-teal-200/80 dark:border-teal-500/30 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              Not sure where to start?
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
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
                className="p-3.5 rounded-2xl bg-white dark:bg-[#151f30] border border-slate-200 dark:border-[#22324c] hover:border-teal-400 dark:hover:border-teal-500/60 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div className="space-y-1.5">
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 block">
                    {item.situation}
                  </span>
                  <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                    {item.actionText}
                  </p>
                </div>
                <div className="pt-2 mt-2 border-t border-slate-100 dark:border-[#1e2d45] flex items-center justify-between text-[10px] font-mono text-teal-600 dark:text-teal-400 font-semibold">
                  <span>Launch tool</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}

          {/* Assistant option */}
          <div className="p-3.5 rounded-2xl bg-teal-600 text-white border border-teal-500 shadow-sm flex flex-col justify-between">
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono text-teal-100 block">
                I don't know what anything means
              </span>
              <p className="text-xs font-bold flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-white shrink-0" />
                Ask the AI Assistant
              </p>
            </div>
            <p className="text-[10px] text-teal-100 mt-2 pt-2 border-t border-teal-500/60">
              Click the green bubble in the bottom right corner anytime to chat.
            </p>
          </div>
        </div>
      </div>

      {/* 8-STEP SIMPLE GUIDE */}
      <div className="space-y-4">
        <h3 className="text-sm font-mono font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          The 8 Simple Steps to Review Activity
        </h3>

        <div className="space-y-4">
          {/* STEP 1 */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#121721] border border-slate-200 dark:border-[#1c2638] shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-[#1c2638]">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-teal-600 text-white flex items-center justify-center text-xs font-mono font-bold shrink-0">
                  1
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Step 1: Start with Overview
                </h4>
              </div>
              <button
                onClick={() => onNavigate('overview')}
                className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#182132] text-xs font-bold text-teal-700 dark:text-teal-300 font-mono transition-colors self-start sm:self-auto"
              >
                Go to Overview →
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Start here to see what is happening across the entire system. Check the main four numbers:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0c1017] border border-slate-200 dark:border-[#1c2638]">
                <span className="text-[10px] text-slate-500">Transactions Checked:</span>
                <p className="text-sm font-bold text-slate-900 dark:text-white">All payments</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0c1017] border border-slate-200 dark:border-[#1c2638]">
                <span className="text-[10px] text-slate-500">Suspicious Activity:</span>
                <p className="text-sm font-bold text-amber-600 dark:text-amber-400">Needs a quick look</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0c1017] border border-slate-200 dark:border-[#1c2638]">
                <span className="text-[10px] text-slate-500">High-Risk Cases:</span>
                <p className="text-sm font-bold text-rose-600 dark:text-rose-400">Immediate review</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0c1017] border border-slate-200 dark:border-[#1c2638]">
                <span className="text-[10px] text-slate-500">Monitored Accounts:</span>
                <p className="text-sm font-bold text-teal-600 dark:text-teal-400">Under protection</p>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              💡 <em>If you see a number that looks unusual, open that section to learn more.</em>
            </p>
          </div>

          {/* STEP 2 */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#121721] border border-slate-200 dark:border-[#1c2638] shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-[#1c2638]">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-teal-600 text-white flex items-center justify-center text-xs font-mono font-bold shrink-0">
                  2
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Step 2: Check Alerts
                </h4>
              </div>
              <button
                onClick={() => onNavigate('precursor_detector')}
                className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#182132] text-xs font-bold text-teal-700 dark:text-teal-300 font-mono transition-colors self-start sm:self-auto"
              >
                Open Alerts & Investigations →
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Here you can see activity that may need your attention. Follow these 4 easy steps:
            </p>

            <ol className="list-decimal pl-5 space-y-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <li>Open an alert from the list.</li>
              <li>Read why it was flagged (e.g. repeated cancellations or fast copy-pasting).</li>
              <li>Check the related customer or payment.</li>
              <li>Decide whether it needs further review, blocking, or approval.</li>
            </ol>
          </div>

          {/* STEP 3 */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#121721] border border-slate-200 dark:border-[#1c2638] shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-[#1c2638]">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-teal-600 text-white flex items-center justify-center text-xs font-mono font-bold shrink-0">
                  3
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Step 3: Check Transactions
                </h4>
              </div>
              <button
                onClick={() => onNavigate('live_transactions')}
                className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#182132] text-xs font-bold text-teal-700 dark:text-teal-300 font-mono transition-colors self-start sm:self-auto"
              >
                Open Check Transactions →
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Use this page to find transactions that look unusual. Look for:
            </p>

            <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600 dark:text-slate-300">
              <li><strong>Large amounts:</strong> Transfers that are much higher than normal.</li>
              <li><strong>Repeated payments:</strong> Multiple transfers sent to the same payee within minutes.</li>
              <li><strong>Unusual timing:</strong> Activity happening at 3 AM or from a new device.</li>
              <li><strong>Unusual behaviour:</strong> Pasting account numbers in less than half a second.</li>
            </ul>
          </div>

          {/* STEP 4 */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#121721] border border-slate-200 dark:border-[#1c2638] shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-[#1c2638]">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-teal-600 text-white flex items-center justify-center text-xs font-mono font-bold shrink-0">
                  4
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Step 4: Check a Customer
                </h4>
              </div>
              <button
                onClick={() => onNavigate('impersonation_detector')}
                className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#182132] text-xs font-bold text-teal-700 dark:text-teal-300 font-mono transition-colors self-start sm:self-auto"
              >
                Open Customer Profiles →
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Use this page when you want to understand one customer in detail:
            </p>

            <ol className="list-decimal pl-5 space-y-1 text-xs text-slate-600 dark:text-slate-300">
              <li>Find the customer by name or account ID.</li>
              <li>Open their profile.</li>
              <li>Check their recent activity.</li>
              <li>Look for unusual behaviour (like changes in typing cadence).</li>
              <li>Review their overall risk level.</li>
            </ol>
          </div>

          {/* STEP 5 */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#121721] border border-slate-200 dark:border-[#1c2638] shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-[#1c2638]">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-teal-600 text-white flex items-center justify-center text-xs font-mono font-bold shrink-0">
                  5
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Step 5: Find New Patterns
                </h4>
              </div>
              <button
                onClick={() => onNavigate('zero_day_radar')}
                className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#182132] text-xs font-bold text-teal-700 dark:text-teal-300 font-mono transition-colors self-start sm:self-auto"
              >
                Open Find New Patterns →
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Use this when you want to find unusual behaviour that may not have been seen before. FraudGuard groups strange new activity automatically so you can block new attack methods before they spread.
            </p>
          </div>

          {/* STEP 6 */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#121721] border border-slate-200 dark:border-[#1c2638] shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-[#1c2638]">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-teal-600 text-white flex items-center justify-center text-xs font-mono font-bold shrink-0">
                  6
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Step 6: Find Similar Accounts
                </h4>
              </div>
              <button
                onClick={() => onNavigate('doppelganger_cluster')}
                className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#182132] text-xs font-bold text-teal-700 dark:text-teal-300 font-mono transition-colors self-start sm:self-auto"
              >
                Open Find Similar Accounts →
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Use this to find multiple accounts that behave in very similar ways. Even if scammers use different fake names and IP addresses, their subconscious typing and click timing link them together.
            </p>
          </div>

          {/* STEP 7 */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#121721] border border-slate-200 dark:border-[#1c2638] shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-[#1c2638]">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-teal-600 text-white flex items-center justify-center text-xs font-mono font-bold shrink-0">
                  7
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Step 7: Test What Could Happen
                </h4>
              </div>
              <button
                onClick={() => onNavigate('counterfactual_sim')}
                className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#182132] text-xs font-bold text-teal-700 dark:text-teal-300 font-mono transition-colors self-start sm:self-auto"
              >
                Open Test What Could Happen →
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Use this to see how a situation would change if something were different. You can test different rule choices (like blocking vs asking for extra verification) to see estimated money saved without bothering normal users.
            </p>
          </div>

          {/* STEP 8 */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#121721] border border-slate-200 dark:border-[#1c2638] shadow-xs space-y-3">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-[#1c2638]">
              <span className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xs font-mono font-bold shrink-0">
                8
              </span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Step 8: Finish Your Review
              </h4>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              When you have reviewed the information, choose what action to take:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-sans">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
                <span className="font-bold text-emerald-800 dark:text-emerald-300 block">✅ Approve Transfer</span>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">If the payment is verified and matches normal customer habits.</p>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1">
                <span className="font-bold text-amber-800 dark:text-amber-300 block">⚠️ Step-Up / Review</span>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">Ask the customer for biometric or OTP re-verification.</p>
              </div>

              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-1">
                <span className="font-bold text-rose-800 dark:text-rose-300 block">🛑 Quarantine / Block</span>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">Immediately stop payment and freeze compromised session.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
