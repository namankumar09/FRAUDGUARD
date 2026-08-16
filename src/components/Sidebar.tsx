import React from 'react';
import {
  Shield,
  LayoutDashboard,
  Activity,
  Fingerprint,
  Users,
  Bell,
  Sparkles,
  GitBranch,
  Dna,
  Repeat,
  GitMerge,
  Server,
  Settings,
  HelpCircle,
  MoreHorizontal,
  Zap,
  Sliders,
  Orbit,
  History,
  Database,
  Crosshair,
  Bot,
  BookOpen,
  Info,
  FolderLock,
  BarChart3,
  LogOut
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export type ViewId =
  | 'overview'
  | 'onboarding_engine'
  | 'live_transactions'
  | 'precursor_detector'
  | 'case_management'
  | 'analytics_reports'
  | 'dna_mutation'
  | 'rehearsal_detector'
  | 'behavioral_tells'
  | 'pattern_evolution'
  | 'counterfactual_sim'
  | 'next_action_prediction'
  | 'impersonation_detector'
  | 'doppelganger_cluster'
  | 'time_machine'
  | 'fraud_gravity'
  | 'dna_library'
  | 'adversarial_simulator'
  | 'ai_evasion_redteam'
  | 'cross_customer_echo'
  | 'zero_day_radar'
  | 'mutation_tree'
  | 'about_guide'
  | 'about_fraudguard';

interface SidebarProps {
  activeView: ViewId;
  onNavigate: (view: ViewId) => void;
  alertsCount?: { highRiskTxns: number; zeroDays: number };
  onOpenSettings?: () => void;
  onOpenProfile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onNavigate,
  onOpenSettings,
  onOpenProfile,
}) => {
  const { profile } = useTheme();
  const { logout, user } = useAuth();

  const handleLogout = (e: React.MouseEvent) => {
    e.stopPropagation();
    logout();
  };

  const displayName = user?.name || profile.name || 'Naman Kumar';
  const displayRole = user?.role || 'Senior Analyst';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'NM';

  return (
    <aside
      id="main-sidebar"
      className="flex w-68 bg-white dark:bg-[#0c1017] border-r border-slate-200 dark:border-[#1c2638] flex-col h-screen shrink-0 text-slate-700 dark:text-slate-300 select-none z-30 font-sans transition-colors"
    >
      {/* Brand Header */}
      <div className="p-4 pt-5 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-600 dark:text-teal-400 shadow-sm shrink-0">
            <Shield className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-white font-sans flex items-center gap-1.5">
              FraudGuard
            </h1>
            <p className="text-[10px] font-mono tracking-wider text-slate-500 dark:text-slate-400 uppercase font-semibold">
              AI FRAUD DEFENSE
            </p>
          </div>
        </div>

        {/* Monitoring Active Status Banner */}
        <div className="mt-4 px-3 py-2 rounded-xl bg-slate-100 dark:bg-[#121722] border border-slate-200 dark:border-[#1c2638] flex items-center justify-between text-xs font-mono">
          <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            Monitoring active
          </span>
          <span className="text-slate-400 dark:text-slate-500 text-[11px]">24 / 7</span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4 custom-scrollbar">
        {/* WORKSPACE SECTION */}
        <div className="space-y-1">
          <div className="px-3 pb-1 text-[11px] font-mono font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
            EVERYDAY WORKSPACE
          </div>
          
          {/* Overview */}
          <button
            id="nav-overview"
            onClick={() => onNavigate('overview')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all ${
              activeView === 'overview'
                ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-500/30 font-semibold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#151c2a]'
            }`}
          >
            <LayoutDashboard className={`w-4 h-4 shrink-0 ${activeView === 'overview' ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400 dark:text-slate-500'}`} />
            <div className="min-w-0">
              <p className="text-xs font-bold leading-tight">Overview</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">Command centre</p>
            </div>
          </button>

          {/* Check Transactions */}
          <button
            id="nav-transactions"
            onClick={() => onNavigate('live_transactions')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all ${
              activeView === 'live_transactions'
                ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-500/30 font-semibold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#151c2a]'
            }`}
          >
            <Activity className={`w-4 h-4 shrink-0 ${activeView === 'live_transactions' ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400 dark:text-slate-500'}`} />
            <div className="min-w-0">
              <p className="text-xs font-bold leading-tight">Check Transactions</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">Transaction Analysis</p>
            </div>
          </button>

          {/* Check New Customers */}
          <button
            id="nav-onboarding"
            onClick={() => onNavigate('onboarding_engine')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all ${
              activeView === 'onboarding_engine'
                ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-500/30 font-semibold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#151c2a]'
            }`}
          >
            <Fingerprint className={`w-4 h-4 shrink-0 ${activeView === 'onboarding_engine' ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400 dark:text-slate-500'}`} />
            <div className="min-w-0">
              <p className="text-xs font-bold leading-tight">Check New Customers</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">Onboarding Analysis</p>
            </div>
          </button>

          {/* Customer Profiles */}
          <button
            id="nav-customers"
            onClick={() => onNavigate('impersonation_detector')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all ${
              activeView === 'impersonation_detector'
                ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-500/30 font-semibold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#151c2a]'
            }`}
          >
            <Users className={`w-4 h-4 shrink-0 ${activeView === 'impersonation_detector' ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400 dark:text-slate-500'}`} />
            <div className="min-w-0">
              <p className="text-xs font-bold leading-tight">Customer Profiles</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">Biometric Identity</p>
            </div>
          </button>

          {/* Alerts & Investigations */}
          <button
            id="nav-alerts"
            onClick={() => onNavigate('precursor_detector')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all ${
              activeView === 'precursor_detector'
                ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-500/30 font-semibold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#151c2a]'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <Bell className={`w-4 h-4 shrink-0 ${activeView === 'precursor_detector' ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400 dark:text-slate-500'}`} />
              <div className="min-w-0">
                <p className="text-xs font-bold leading-tight">Alerts & Investigations</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">Precursor Alarms</p>
              </div>
            </div>
            <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-[10px] font-mono flex items-center justify-center font-bold shrink-0">
              4
            </span>
          </button>

          {/* Case Management & Dossiers */}
          <button
            id="nav-cases"
            onClick={() => onNavigate('case_management')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all ${
              activeView === 'case_management'
                ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-500/30 font-semibold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#151c2a]'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <FolderLock className={`w-4 h-4 shrink-0 ${activeView === 'case_management' ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400 dark:text-slate-500'}`} />
              <div className="min-w-0">
                <p className="text-xs font-bold leading-tight">Case Management</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">Forensic Dossiers</p>
              </div>
            </div>
          </button>

          {/* Analytics & Reports */}
          <button
            id="nav-analytics"
            onClick={() => onNavigate('analytics_reports')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all ${
              activeView === 'analytics_reports'
                ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-500/30 font-semibold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#151c2a]'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <BarChart3 className={`w-4 h-4 shrink-0 ${activeView === 'analytics_reports' ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400 dark:text-slate-500'}`} />
              <div className="min-w-0">
                <p className="text-xs font-bold leading-tight">Analytics & Reports</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">Risk Intelligence & Export</p>
              </div>
            </div>
          </button>

          {/* Find New Patterns */}
          <button
            id="nav-patterns"
            onClick={() => onNavigate('zero_day_radar')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all ${
              activeView === 'zero_day_radar'
                ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-500/30 font-semibold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#151c2a]'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <Sparkles className={`w-4 h-4 shrink-0 ${activeView === 'zero_day_radar' ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400 dark:text-slate-500'}`} />
              <div className="min-w-0">
                <p className="text-xs font-bold leading-tight">Find New Patterns</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">Zero-Day Radar</p>
              </div>
            </div>
            <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-[10px] font-mono flex items-center justify-center font-bold shrink-0">
              3
            </span>
          </button>
        </div>

        {/* INVESTIGATION LAB SECTION */}
        <div className="space-y-1 pt-1">
          <div className="px-3 pb-1 text-[11px] font-mono font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
            INVESTIGATION LAB
          </div>

          {[
            {
              id: 'doppelganger_cluster',
              label: 'Find Similar Accounts',
              subtitle: 'Doppelgänger Clusters',
              icon: Users,
            },
            {
              id: 'dna_mutation',
              label: 'Explore Behaviour Changes',
              subtitle: 'DNA Mutation Engine',
              icon: Dna,
            },
            {
              id: 'rehearsal_detector',
              label: 'Find Repeated Behaviour',
              subtitle: 'Rehearsal Detection',
              icon: Repeat,
            },
            {
              id: 'counterfactual_sim',
              label: 'Test What Could Happen',
              subtitle: 'Counterfactual Simulator',
              icon: GitMerge,
            },
            {
              id: 'adversarial_simulator',
              label: 'Test Fraud Scenarios',
              subtitle: 'Red-Team Simulator',
              icon: Crosshair,
            },
            {
              id: 'mutation_tree',
              label: 'Evolutionary Tree',
              subtitle: 'DNA Phylogenetic Tree',
              icon: GitBranch,
            },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id as ViewId)}
                className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-xl text-left transition-all ${
                  isActive
                    ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-500/30 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#151c2a]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-teal-500' : 'text-slate-400 dark:text-slate-500'}`} />
                <div className="min-w-0">
                  <p className="text-xs font-medium leading-tight truncate">{item.label}</p>
                  <p className="text-[9px] text-slate-400 dark:text-slate-500 truncate font-normal">{item.subtitle}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* HELP & SYSTEM SECTION */}
        <div className="space-y-1 pt-1">
          <div className="px-3 pb-1 text-[11px] font-mono font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
            HELP & SYSTEM
          </div>

          {/* How to Use FraudGuard */}
          <button
            onClick={() => onNavigate('about_guide')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all ${
              activeView === 'about_guide'
                ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 font-semibold border border-teal-200 dark:border-teal-500/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#151c2a]'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-bold leading-tight">How to Use FraudGuard</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">Step-by-step user guide</p>
            </div>
          </button>

          {/* About FraudGuard */}
          <button
            onClick={() => onNavigate('about_fraudguard')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all ${
              activeView === 'about_fraudguard'
                ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 font-semibold border border-teal-200 dark:border-teal-500/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#151c2a]'
            }`}
          >
            <BookOpen className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-bold leading-tight">About FraudGuard</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">Feature dictionary & info</p>
            </div>
          </button>

          {/* System Health */}
          <button
            onClick={() => onNavigate('time_machine')}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#151c2a] transition-all"
          >
            <div className="flex items-center gap-3 min-w-0">
              <Server className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-medium leading-tight">System Health</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">All systems nominal</p>
              </div>
            </div>
            <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0" />
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#151c2a] transition-all"
          >
            <Settings className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-medium leading-tight">Account & Settings</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">Preferences & rules</p>
            </div>
          </button>
        </div>
      </div>

      {/* User Profile Card & Log Out */}
      <div className="p-3 border-t border-slate-200 dark:border-[#1c2638] bg-slate-50/50 dark:bg-[#0c1017] space-y-2">
        <div
          onClick={onOpenProfile || onOpenSettings}
          className="flex items-center justify-between p-2 rounded-xl bg-slate-100/80 hover:bg-slate-200 dark:bg-[#121722] dark:hover:bg-[#182132] border border-slate-200 dark:border-[#1c2638] cursor-pointer transition-all"
          title="Click to view My Profile"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-mono font-bold shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate font-sans">
                {displayName}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                {displayRole}
              </p>
            </div>
          </div>
          <MoreHorizontal className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0 ml-1" />
        </div>

        {/* Dedicated Logout Action */}
        <button
          id="btn-sidebar-logout"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-rose-200/60 dark:border-rose-500/20 transition-all cursor-pointer min-h-[38px]"
          title="Log Out & Clear Session"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};
