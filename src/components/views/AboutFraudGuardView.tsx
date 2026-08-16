import React, { useState } from 'react';
import {
  HelpCircle,
  Shield,
  Search,
  CheckCircle2,
  ArrowRight,
  Activity,
  Fingerprint,
  Users,
  Bell,
  Sparkles,
  Dna,
  RotateCcw,
  Scale,
  Crosshair,
  Server,
  Brain,
  GitBranch,
  Layers,
  Bot
} from 'lucide-react';
import { ViewId } from '../Sidebar';

interface AboutFraudGuardViewProps {
  onNavigate: (view: ViewId) => void;
}

export const AboutFraudGuardView: React.FC<AboutFraudGuardViewProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'essential' | 'investigation' | 'simulation'>('all');

  const allFeatures = [
    {
      id: 'overview',
      name: 'Overview',
      subtitle: 'Main Dashboard',
      category: 'essential',
      icon: Layers,
      color: 'teal',
      whatItDoes:
        'Gives you a single screen summary of everything happening across your system right now, including total transactions, active alerts, and monitored accounts.',
      whenToUse:
        'Use this when you first open FraudGuard to get a quick summary and see if any high-risk cases need your attention.',
      howToUse: [
        'Open Overview from the left menu.',
        'Check the key metric cards (Transactions Checked, High Risk Cases, and New Patterns).',
        'Review the recent alerts list on the right.',
        'Click on any high-risk card or alert to start investigating.',
      ],
    },
    {
      id: 'live_transactions',
      name: 'Check Transactions',
      subtitle: 'Transaction Analysis',
      category: 'essential',
      icon: Activity,
      color: 'blue',
      whatItDoes:
        'Helps you find payments and transfers that look unusual or suspicious in real time.',
      whenToUse:
        'Use this when you want to check whether a specific payment, customer transfer, or group of payments looks safe or suspicious.',
      howToUse: [
        'Open Check Transactions from the left sidebar.',
        'Filter by High Risk, Suspicious, or Low Risk.',
        'Click on any transaction row or card to open its full details.',
        'Review the amount, recipient, and the specific reasons it was flagged.',
        'Click "Quarantine" to block it or "Approve" if it is legitimate.',
      ],
    },
    {
      id: 'onboarding_engine',
      name: 'Check New Customers',
      subtitle: 'Onboarding Analysis',
      category: 'essential',
      icon: Fingerprint,
      color: 'emerald',
      whatItDoes:
        'Checks how new customers fill out forms to spot automated bots and fake accounts during sign-up.',
      whenToUse:
        'Use this when onboarding new users to make sure real humans are creating the accounts, rather than automated scripts.',
      howToUse: [
        'Open Check New Customers from the sidebar.',
        'Try typing in the interactive form or click "Load Bot Persona" to test.',
        'Watch the Bot Probability meter and typing timing graphs update live.',
        'Review whether the user typed naturally or used instant robotic pasting.',
        'Set automated approval or manual review thresholds.',
      ],
    },
    {
      id: 'impersonation_detector',
      name: 'Customer Profiles',
      subtitle: 'Biometric Identity & Account Takeover',
      category: 'investigation',
      icon: Users,
      color: 'indigo',
      whatItDoes:
        'Helps you understand a single customer by comparing their current typing and mouse habits against their normal historical profile.',
      whenToUse:
        'Use this when you suspect someone else might be logging into a customer’s account without permission.',
      howToUse: [
        'Open Customer Profiles.',
        'Search or click on a customer from the list.',
        'Look at the Biometric Match Score (higher score means it is the real customer).',
        'Compare their typical typing speed against their current session.',
        'If the match is low, mark the account for identity verification.',
      ],
    },
    {
      id: 'precursor_detector',
      name: 'Alerts & Investigations',
      subtitle: 'Precursor Intent Sequences',
      category: 'investigation',
      icon: Bell,
      color: 'rose',
      whatItDoes:
        'Shows what an attacker did 10 to 30 steps before pressing the pay button (like checking account limits, aborting, and fast-pasting).',
      whenToUse:
        'Use this when you receive an alert and need to see the exact timeline of actions leading up to a suspicious payment.',
      howToUse: [
        'Open Alerts & Investigations.',
        'Select an active alert from the list.',
        'Walk through the step-by-step timeline of actions taken by the user.',
        'Look for suspicious preparation steps, such as repeated canceled transfers.',
        'Choose whether to block the session or request verification.',
      ],
    },
    {
      id: 'zero_day_radar',
      name: 'Find New Patterns',
      subtitle: 'Zero-Day Anomaly Radar',
      category: 'investigation',
      icon: Sparkles,
      color: 'purple',
      whatItDoes:
        'Spots brand-new fraud tricks and uncataloged attack styles that have never been seen before in your system.',
      whenToUse:
        'Use this when you want to discover emerging fraud tactics before they become widespread across multiple accounts.',
      howToUse: [
        'Open Find New Patterns from the left menu.',
        'Review the newly discovered anomaly clusters on the radar grid.',
        'Read the simple explanation of what unusual action the group performed.',
        'Click "Deploy Defense Rule" to block that specific pattern immediately.',
      ],
    },
    {
      id: 'doppelganger_cluster',
      name: 'Find Similar Accounts',
      subtitle: 'Doppelgänger Bot Clusters',
      category: 'investigation',
      icon: Users,
      color: 'amber',
      whatItDoes:
        'Finds multiple different accounts that are being operated by the exact same fraud actor or bot farm.',
      whenToUse:
        'Use this when you believe a fraud group is using multiple fake names or stolen identities to drain money.',
      howToUse: [
        'Open Find Similar Accounts.',
        'Select a cluster from the left list (e.g. Cluster Alpha).',
        'See all accounts linked by identical typing intervals and timing.',
        'Click "Bulk Contain All Accounts" to freeze the entire bot ring in one click.',
      ],
    },
    {
      id: 'dna_mutation',
      name: 'Explore Behaviour Changes',
      subtitle: 'DNA Mutation Engine',
      category: 'investigation',
      icon: Dna,
      color: 'cyan',
      whatItDoes:
        'Compares a customer’s normal daily digital habits against any sudden changes that indicate an account takeover.',
      whenToUse:
        'Use this when an account has sudden activity that feels out of character for that specific person.',
      howToUse: [
        'Open Explore Behaviour Changes.',
        'Select a customer to view their baseline behavioral polygon.',
        'Check which habits changed (e.g. time of day, typing rhythm, device).',
        'Review how far their current session has drifted from normal.',
      ],
    },
    {
      id: 'rehearsal_detector',
      name: 'Find Repeated Behaviour',
      subtitle: 'Rehearsal & Practice Loop Detection',
      category: 'investigation',
      icon: RotateCcw,
      color: 'orange',
      whatItDoes:
        'Catches fraudsters when they "practice" adding recipients and cancelling test payments right before trying a large theft.',
      whenToUse:
        'Use this to stop an attack before any real money is transferred out of the bank.',
      howToUse: [
        'Open Find Repeated Behaviour.',
        'Inspect accounts flagged for practice cancellations within 10 minutes.',
        'View the sequence of test attempts.',
        'Enforce an automatic 15-minute cooling hold to protect the account.',
      ],
    },
    {
      id: 'counterfactual_sim',
      name: 'Test What Could Happen',
      subtitle: 'Counterfactual Simulator',
      category: 'simulation',
      icon: Scale,
      color: 'emerald',
      whatItDoes:
        'Lets you test "what-if" scenarios to see how changing a rule would affect both fraud prevention and normal customer convenience.',
      whenToUse:
        'Use this before creating or changing a fraud policy to make sure you will not accidentally block innocent customers.',
      howToUse: [
        'Open Test What Could Happen.',
        'Adjust the transfer amount and the policy option (Hard Block vs Step-Up).',
        'Look at the calculated financial savings versus customer friction.',
        'Choose the best balanced rule for your team.',
      ],
    },
    {
      id: 'adversarial_simulator',
      name: 'Test Fraud Scenarios',
      subtitle: 'Red-Team Simulator',
      category: 'simulation',
      icon: Crosshair,
      color: 'rose',
      whatItDoes:
        'Pits simulated bot attacks against your current security rules to find weaknesses before real attackers do.',
      whenToUse:
        'Use this to stress-test your system and see where your defenses need strengthening.',
      howToUse: [
        'Open Test Fraud Scenarios.',
        'Adjust the Bot Mimicry slider and Defense Strictness slider.',
        'Click "Run Simulation Round" to see if the bot managed to sneak through.',
        'Apply the recommended rule updates to close the gap.',
      ],
    },
  ];

  const filteredFeatures = allFeatures.filter((feat) => {
    const matchesCategory = activeFilter === 'all' || feat.category === activeFilter;
    const matchesSearch =
      feat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feat.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feat.whatItDoes.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feat.whenToUse.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="view-about-fraudguard" className="p-4 md:p-6 space-y-6 animate-in fade-in transition-colors font-sans">
      {/* Top Banner */}
      <div className="p-5 md:p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="space-y-2 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[var(--color-brand)]/10 text-[var(--color-brand-strong)] border border-[var(--color-brand)]/30 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[var(--color-brand)]" />
              ABOUT FRAUDGUARD
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">• Complete Product Guide</span>
          </div>

          <h2 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] tracking-tight">
            Understand what FraudGuard does and how each tool helps you find suspicious activity
          </h2>

          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <strong>FraudGuard</strong> is an AI-powered fraud detection and investigation platform. It helps teams find unusual behaviour, review suspicious activity, understand customer risk, and investigate possible fraud in simple, easy-to-understand steps.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--color-brand-bg)] border border-[var(--color-brand-border)] shrink-0 space-y-2 max-w-xs">
          <div className="flex items-center gap-2 text-[var(--color-brand-strong)] text-xs font-bold font-mono">
            <Bot className="w-4 h-4 text-[var(--color-brand)]" />
            NEED INSTANT HELP?
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
            You can also ask the floating <strong>FraudGuard Assistant</strong> in the bottom right corner any question in plain English.
          </p>
        </div>
      </div>

      {/* Search and Category Filter Bar */}
      <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="What do you need help with? (e.g. check transaction, high risk, similar accounts)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--color-brand)]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 sm:pb-0">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-xl font-medium text-xs transition-colors shrink-0 ${
                activeFilter === 'all'
                  ? 'bg-[var(--color-brand-solid)] text-white font-bold'
                  : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
              }`}
            >
              All Features ({allFeatures.length})
            </button>
            <button
              onClick={() => setActiveFilter('essential')}
              className={`px-3 py-1.5 rounded-xl font-medium text-xs transition-colors shrink-0 ${
                activeFilter === 'essential'
                  ? 'bg-[var(--color-brand-solid)] text-white font-bold'
                  : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
              }`}
            >
              Everyday Tools
            </button>
            <button
              onClick={() => setActiveFilter('investigation')}
              className={`px-3 py-1.5 rounded-xl font-medium text-xs transition-colors shrink-0 ${
                activeFilter === 'investigation'
                  ? 'bg-[var(--color-brand-solid)] text-white font-bold'
                  : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
              }`}
            >
              Investigation Tools
            </button>
            <button
              onClick={() => setActiveFilter('simulation')}
              className={`px-3 py-1.5 rounded-xl font-medium text-xs transition-colors shrink-0 ${
                activeFilter === 'simulation'
                  ? 'bg-[var(--color-brand-solid)] text-white font-bold'
                  : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
              }`}
            >
              Testing & Scenarios
            </button>
          </div>
        </div>
      </div>

      {/* Feature Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredFeatures.map((feat) => {
          const Icon = feat.icon;
          return (
            <div
              key={feat.id}
              className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
            >
              <div className="space-y-3">
                {/* Title & Icon Header */}
                <div className="flex items-start justify-between gap-2 pb-2 border-b border-slate-100 dark:border-[#1c2638]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-brand)]/10 border border-[var(--color-brand)]/30 flex items-center justify-center text-[var(--color-brand)] shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[var(--text-primary)] font-sans">
                        {feat.name}
                      </h3>
                      <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                        {feat.subtitle}
                      </p>
                    </div>
                  </div>
                </div>

                {/* What it does */}
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-brand-strong)] font-mono block mb-1">
                    What it does:
                  </span>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium">
                    {feat.whatItDoes}
                  </p>
                </div>

                {/* When should I use it */}
                <div className="p-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] font-mono block">
                    When should I use it?
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {feat.whenToUse}
                  </p>
                </div>

                {/* How to use it */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-800 dark:text-slate-300 font-mono block">
                    How to use it:
                  </span>
                  <ol className="space-y-1 pl-4 list-decimal text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {feat.howToUse.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-slate-100 dark:border-[#1c2638] flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400">Ready to try?</span>
                <button
                  onClick={() => onNavigate(feat.id as ViewId)}
                  className="px-3.5 py-1.5 rounded-xl bg-[var(--color-brand-bg)] hover:opacity-80 border border-[var(--color-brand-border)] text-[var(--color-brand-strong)] text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <span>Open {feat.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}

        {filteredFeatures.length === 0 && (
          <div className="col-span-2 p-8 text-center rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs text-slate-500">
            No features found matching "{searchQuery}". Try searching for "transaction", "alert", or "customer".
          </div>
        )}
      </div>
    </div>
  );
};
