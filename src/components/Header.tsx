import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  Sun,
  Moon,
  Activity,
  User,
  Settings,
  HelpCircle,
  LogOut,
  CheckCheck,
  ChevronRight,
  Shield,
  AlertTriangle,
  Sparkles,
  Users,
  Menu,
  X,
  LayoutDashboard,
  Fingerprint,
  FolderLock,
  BarChart3,
  Dna,
  Repeat,
  GitMerge,
  Crosshair,
  GitBranch,
  BookOpen,
  Bot,
  Orbit,
  History,
  Database,
  Sliders,
  Zap
} from 'lucide-react';
import { ViewId } from './Sidebar';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  activeView: ViewId;
  onNavigate: (view: ViewId) => void;
  onResetData: () => void;
  isSimulating: boolean;
  onToggleSimulation: () => void;
  investigatorMode: boolean;
  onToggleInvestigatorMode: () => void;
  onOpenSettings: () => void;
  onOpenProfile: () => void;
  isMobile: boolean;
}

interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  timestamp: string;
  isRead: boolean;
  type: 'danger' | 'warning' | 'info';
  view: ViewId;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  onNavigate,
  isSimulating,
  onToggleSimulation,
  onOpenSettings,
  onOpenProfile,
  isMobile,
}) => {
  const { resolvedTheme, setThemeMode, profile } = useTheme();
  const { logout, user } = useAuth();
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [loggedOutToast, setLoggedOutToast] = useState(false);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'High-Risk Payment Flagged (#TXN-9082)',
      desc: 'Sudden ₹3.45L transfer with rapid paste (0.4s) & high risk score.',
      timestamp: '2 mins ago',
      isRead: false,
      type: 'danger',
      view: 'live_transactions',
    },
    {
      id: 'notif-2',
      title: 'New Suspicious Accounts Connected',
      desc: '3 accounts in Cluster Alpha exhibit identical bot typing intervals.',
      timestamp: '14 mins ago',
      isRead: false,
      type: 'warning',
      view: 'doppelganger_cluster',
    },
    {
      id: 'notif-3',
      title: 'Zero-Day Attack Pattern Discovered',
      desc: 'Pattern #ZD-73 synthesized into candidate quarantine rule.',
      timestamp: '1 hour ago',
      isRead: false,
      type: 'info',
      view: 'zero_day_radar',
    },
    {
      id: 'notif-4',
      title: 'Practice Rehearsal Loop Detected',
      desc: 'Account #ACC-4491 attempted 4 cancellations before transfer.',
      timestamp: '3 hours ago',
      isRead: true,
      type: 'warning',
      view: 'rehearsal_detector',
    },
  ]);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotificationPopup(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close the mobile drawer if the viewport crosses back into desktop layout
  useEffect(() => {
    if (!isMobile) setIsHamburgerOpen(false);
  }, [isMobile]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleLogout = () => {
    setShowProfileMenu(false);
    setIsHamburgerOpen(false);
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

  const handleDrawerNavigate = (view: ViewId) => {
    onNavigate(view);
    setIsHamburgerOpen(false);
  };

  const viewTitles: Record<ViewId, { title: string; subtitle: string }> = {
    overview: {
      title: 'Overview',
      subtitle: 'Command centre for monitored accounts and live activity',
    },
    live_transactions: {
      title: 'Check Transactions',
      subtitle: 'Review payments and inspect why they were flagged',
    },
    onboarding_engine: {
      title: 'Check New Customers',
      subtitle: 'Spot bot signups and fake registrations during onboarding',
    },
    impersonation_detector: {
      title: 'Customer Profiles',
      subtitle: 'Check customer identity and verify typing rhythms',
    },
    precursor_detector: {
      title: 'Alerts & Investigations',
      subtitle: 'Look at actions taken before payment execution',
    },
    case_management: {
      title: 'Case Management & Dossiers',
      subtitle: 'Forensic investigation dossiers, linked evidence, and analyst notes',
    },
    analytics_reports: {
      title: 'Analytics, Risk Trends & Reports',
      subtitle: 'Real-time database analytics and exportable regulatory audit reports',
    },
    zero_day_radar: {
      title: 'Find New Patterns',
      subtitle: 'Discover brand-new fraud tricks never seen before',
    },
    dna_mutation: {
      title: 'Explore Behaviour Changes',
      subtitle: 'Compare customer baseline against current activity',
    },
    rehearsal_detector: {
      title: 'Find Repeated Behaviour',
      subtitle: 'Catch fraudsters practicing cancellations before attack',
    },
    behavioral_tells: {
      title: 'Behavioral Tells',
      subtitle: 'Digital lie detector and micro-hesitation discovery',
    },
    pattern_evolution: {
      title: 'Pattern Evolution',
      subtitle: 'Track how fraud methods change over time',
    },
    counterfactual_sim: {
      title: 'Test What Could Happen',
      subtitle: 'Simulate rule changes and balance savings vs user friction',
    },
    next_action_prediction: {
      title: 'Next Action Prediction',
      subtitle: 'Forecast what an attacker will try next',
    },
    doppelganger_cluster: {
      title: 'Find Similar Accounts',
      subtitle: 'Identify multiple accounts run by the same bot operator',
    },
    time_machine: {
      title: 'Behavioral Time Machine',
      subtitle: '30-day temporal drift scrubber and playback',
    },
    fraud_gravity: {
      title: 'Fraud Gravity Model',
      subtitle: 'Visual gravitational decision model for risk',
    },
    dna_library: {
      title: 'Fraud DNA Library',
      subtitle: 'Rule repository and threat taxonomy',
    },
    adversarial_simulator: {
      title: 'Test Fraud Scenarios',
      subtitle: 'Red-Team bot attacks vs adaptive security filters',
    },
    ai_evasion_redteam: {
      title: 'AI Evasion Red-Team',
      subtitle: 'AI intelligence finding rule blind spots',
    },
    cross_customer_echo: {
      title: 'Cross-Customer Echo',
      subtitle: 'Track attack contagion across customer accounts',
    },
    mutation_tree: {
      title: 'Evolutionary Tree',
      subtitle: 'Branching tree tracing fraud strain genealogy',
    },
    about_guide: {
      title: 'How to Use FraudGuard',
      subtitle: 'Step-by-step user guide to review activity',
    },
    about_fraudguard: {
      title: 'About FraudGuard',
      subtitle: 'Understand what FraudGuard does and how each tool works',
    },
  };

  const currentViewMeta = viewTitles[activeView] || {
    title: 'Overview',
    subtitle: 'Command centre for monitored accounts and live activity',
  };

  return (
    <header
      id="main-header"
      className="h-16 bg-white dark:bg-[#0c1017] border-b border-slate-200 dark:border-[#1c2638] px-4 md:px-6 flex items-center justify-between z-20 shrink-0 sticky top-0 shadow-xs transition-colors font-sans"
    >
      {/* Title & Subtitle */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="min-w-0">
          <div className="text-[10px] font-mono tracking-widest text-slate-500 dark:text-slate-400 uppercase font-semibold">
            FRAUDGUARD DEFENSE
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <h1 className="text-sm md:text-base font-bold text-slate-900 dark:text-white tracking-tight truncate">
              {currentViewMeta.title}
            </h1>
            <span className="text-slate-400 dark:text-slate-600 hidden sm:inline">•</span>
            <p className="text-[12px] text-slate-500 dark:text-slate-400 truncate hidden md:block">
              {currentViewMeta.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Top Right Controls */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Light / Dark Mode Toggle */}
        <div
          id="theme-toggle-container"
          className="flex items-center bg-slate-100 dark:bg-[#121722] border border-slate-200 dark:border-[#1c2638] rounded-xl p-0.5 shadow-2xs"
        >
          <button
            id="btn-theme-light"
            onClick={() => setThemeMode('light')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              resolvedTheme === 'light'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200 font-bold'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
            title="Switch to Light Mode"
            aria-label="Light Mode"
          >
            <Sun className={`w-3.5 h-3.5 ${resolvedTheme === 'light' ? 'text-amber-500' : 'text-slate-400'}`} />
            <span className="text-[11px] font-mono">Light</span>
          </button>

          <button
            id="btn-theme-dark"
            onClick={() => setThemeMode('dark')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              resolvedTheme === 'dark'
                ? 'bg-[#1c2638] text-teal-300 shadow-xs border border-teal-500/30 font-bold'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
            title="Switch to Dark Mode"
            aria-label="Dark Mode"
          >
            <Moon className={`w-3.5 h-3.5 ${resolvedTheme === 'dark' ? 'text-teal-400' : 'text-slate-400'}`} />
            <span className="text-[11px] font-mono">Dark</span>
          </button>
        </div>

        {/* Live Stream Toggle */}
        <button
          id="btn-toggle-stream"
          onClick={onToggleSimulation}
          className={`px-3 py-1.5 rounded-xl border transition-all text-xs font-mono flex items-center gap-1.5 ${
            isSimulating
              ? 'bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-500/30 text-teal-700 dark:text-teal-300 font-bold shadow-2xs'
              : 'bg-slate-100 dark:bg-[#121722] border-slate-200 dark:border-[#1c2638] text-slate-500'
          }`}
          title="Toggle Simulation Stream"
        >
          <Activity className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">{isSimulating ? 'Live Stream: ON' : 'Live Stream: OFF'}</span>
        </button>

        {/* NOTIFICATION BELL & DROPDOWN */}
        <div className="relative" ref={notifRef}>
          <button
            id="btn-header-bell"
            onClick={() => setShowNotificationPopup(!showNotificationPopup)}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#121722] dark:hover:bg-[#182132] border border-slate-200 dark:border-[#1c2638] text-slate-700 dark:text-slate-300 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white dark:border-[#0c1017]" />
            )}
          </button>

          {/* Notification Menu Panel */}
          {showNotificationPopup && (
            <div className="absolute right-0 mt-2 w-84 sm:w-96 bg-white dark:bg-[#121722] border border-slate-200 dark:border-[#1c2638] rounded-2xl shadow-2xl p-4 text-xs z-50 animate-in fade-in slide-in-from-top-2 font-sans">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1c2638] mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[11px] text-teal-600 dark:text-teal-400 hover:underline font-medium flex items-center gap-1"
                  >
                    <CheckCheck className="w-3 h-3" />
                    Mark all read
                  </button>
                )}
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto custom-scrollbar">
                {notifications.map((notif) => {
                  return (
                    <div
                      key={notif.id}
                      onClick={() => {
                        markAsRead(notif.id);
                        onNavigate(notif.view);
                        setShowNotificationPopup(false);
                      }}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-1 ${
                        !notif.isRead
                          ? 'bg-slate-50 dark:bg-[#161f30] border-teal-300/50 dark:border-teal-500/40'
                          : 'bg-white dark:bg-[#0f1522] border-slate-200 dark:border-[#1c2638] opacity-80'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-bold text-xs text-slate-900 dark:text-white leading-tight">
                          {notif.title}
                        </p>
                        <span className="text-[9px] font-mono text-slate-400 shrink-0">
                          {notif.timestamp}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                        {notif.desc}
                      </p>
                      <div className="pt-1 flex items-center justify-between text-[10px] text-teal-600 dark:text-teal-400 font-mono font-semibold">
                        <span>Click to review</span>
                        <ChevronRight className="w-3 h-3" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* USER PROFILE DROPDOWN MENU */}
        <div className="relative" ref={profileRef}>
          <button
            id="btn-header-profile"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-9 h-9 rounded-xl bg-teal-600 hover:bg-teal-500 text-white flex items-center justify-center text-xs font-mono font-bold transition-all shadow-xs min-h-[38px] min-w-[38px]"
            title="User Account"
          >
            {initials}
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#121722] border border-slate-200 dark:border-[#1c2638] rounded-2xl shadow-2xl p-3 text-xs z-50 animate-in fade-in slide-in-from-top-2 font-sans">
              {/* User Identity */}
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#161f30] border border-slate-200 dark:border-[#1c2638] mb-2 space-y-0.5">
                <p className="font-bold text-xs text-slate-900 dark:text-white">
                  {displayName}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate">
                  {user?.email || profile.email || 'naman.analyst@fraudguard.bank'}
                </p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/30">
                  {displayRole}
                </span>
              </div>

              {/* Menu items */}
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onOpenProfile();
                  }}
                  className="w-full min-h-[40px] flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#182132] transition-colors cursor-pointer"
                >
                  <User className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span className="font-medium text-xs">My Profile</span>
                </button>

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onOpenSettings();
                  }}
                  className="w-full min-h-[40px] flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#182132] transition-colors cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span className="font-medium text-xs">Account Settings</span>
                </button>

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onNavigate('about_guide');
                  }}
                  className="w-full min-h-[40px] flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#182132] transition-colors cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4 text-slate-400" />
                  <span className="font-medium text-xs">How to Use Guide</span>
                </button>

                <div className="pt-1 border-t border-slate-100 dark:border-[#1c2638]">
                  <button
                    id="btn-profile-menu-logout"
                    onClick={handleLogout}
                    className="w-full min-h-[40px] flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="font-semibold text-xs">Log Out</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* TOP-RIGHT HAMBURGER MENU BUTTON (MOBILE ONLY) */}
        {isMobile && (
          <div className="relative">
            <button
              id="btn-header-hamburger"
              onClick={() => setIsHamburgerOpen(!isHamburgerOpen)}
              className={`min-h-[44px] min-w-[44px] p-2.5 rounded-xl border transition-all flex items-center justify-center cursor-pointer shadow-xs ${
                isHamburgerOpen
                  ? 'bg-teal-500/15 border-teal-500/40 text-teal-600 dark:text-teal-400'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-[#121722] dark:hover:bg-[#182132] border-slate-200 dark:border-[#1c2638] text-slate-700 dark:text-slate-300'
              }`}
              title={isHamburgerOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-label="Navigation Menu"
            >
              {isHamburgerOpen ? (
                <X className="w-5 h-5 text-teal-600 dark:text-teal-400 transition-transform duration-200 rotate-90" />
              ) : (
                <Menu className="w-5 h-5 transition-transform duration-200" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* SLIDE-IN NAVIGATION DRAWER (MOBILE ONLY) */}
      {isMobile && isHamburgerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-200">
          {/* Dark Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsHamburgerOpen(false)}
          />

          {/* Slide-over Container */}
          <div
            ref={hamburgerRef}
            className="relative w-full max-w-sm sm:max-w-md bg-white dark:bg-[#0c1017] border-l border-slate-200 dark:border-[#1c2638] h-full shadow-2xl flex flex-col z-50 animate-in slide-in-from-right duration-250 font-sans pb-safe pt-safe"
          >
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-200 dark:border-[#1c2638] flex items-center justify-between bg-slate-50/80 dark:bg-[#121722]/80 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0">
                  <Shield className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                    FraudGuard Navigation
                  </h2>
                  <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    All Workspaces & Tools
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsHamburgerOpen(false)}
                className="p-2 min-h-[44px] min-w-[44px] rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#1c2638] transition-colors flex items-center justify-center cursor-pointer"
                title="Close Menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Nav Item List */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 custom-scrollbar">
              {/* EVERYDAY WORKSPACE */}
              <div className="space-y-1">
                <div className="px-3 pb-1 text-[11px] font-mono font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                  EVERYDAY WORKSPACE
                </div>

                {[
                  { id: 'overview', label: 'Overview', desc: 'Command centre & KPI metrics', icon: LayoutDashboard },
                  { id: 'live_transactions', label: 'Check Transactions', desc: 'Live Stream & Dossier Review', icon: Activity },
                  { id: 'onboarding_engine', label: 'Check New Customers', desc: 'Onboarding Analysis & Bot Signups', icon: Fingerprint },
                  { id: 'impersonation_detector', label: 'Customer Profiles', desc: 'Biometric Identity & Dynamics', icon: Users },
                  { id: 'precursor_detector', label: 'Alerts & Investigations', desc: 'Precursor Alarms & Intent', icon: Bell, badge: '4' },
                  { id: 'case_management', label: 'Case Management', desc: 'Forensic Dossiers & Evidence', icon: FolderLock },
                  { id: 'analytics_reports', label: 'Analytics & Reports', desc: 'Risk Intelligence & Export', icon: BarChart3 },
                  { id: 'zero_day_radar', label: 'Find New Patterns', desc: 'Zero-Day Radar & Threat Discovery', icon: Sparkles, badge: '3' },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleDrawerNavigate(item.id as ViewId)}
                      className={`w-full min-h-[46px] flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                        isActive
                          ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-500/30 font-semibold shadow-xs'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#151c2a]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400 dark:text-slate-500'}`} />
                        <div className="min-w-0">
                          <p className="text-xs font-bold leading-tight truncate">{item.label}</p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{item.desc}</p>
                        </div>
                      </div>
                      {item.badge && (
                        <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-[10px] font-mono flex items-center justify-center font-bold shrink-0 ml-2">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* INVESTIGATION LAB */}
              <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-[#1c2638]">
                <div className="px-3 pb-1 text-[11px] font-mono font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                  INVESTIGATION LAB
                </div>

                {[
                  { id: 'doppelganger_cluster', label: 'Find Similar Accounts', desc: 'Doppelgänger Clusters', icon: Users },
                  { id: 'dna_mutation', label: 'Explore Behaviour Changes', desc: 'DNA Mutation Engine', icon: Dna },
                  { id: 'rehearsal_detector', label: 'Find Repeated Behaviour', desc: 'Rehearsal Detection', icon: Repeat },
                  { id: 'counterfactual_sim', label: 'Test What Could Happen', desc: 'Counterfactual Simulator', icon: GitMerge },
                  { id: 'adversarial_simulator', label: 'Test Fraud Scenarios', desc: 'Red-Team Simulator', icon: Crosshair },
                  { id: 'mutation_tree', label: 'Evolutionary Tree', desc: 'DNA Phylogenetic Tree', icon: GitBranch },
                  { id: 'ai_evasion_redteam', label: 'AI Evasion Red-Team', desc: 'Adversarial AI Analyzer', icon: Bot },
                  { id: 'cross_customer_echo', label: 'Cross-Customer Echo', desc: 'Threat Contagion Graph', icon: Orbit },
                  { id: 'behavioral_tells', label: 'Behavioral Tells', desc: 'Micro-Hesitations & Tells', icon: Zap },
                  { id: 'next_action_prediction', label: 'Next Action Prediction', desc: 'Intent Forecasting', icon: Sliders },
                  { id: 'time_machine', label: 'Behavioral Time Machine', desc: 'Temporal Drift Playback', icon: History },
                  { id: 'fraud_gravity', label: 'Fraud Gravity Model', desc: 'Gravitational Risk Vectoring', icon: Orbit },
                  { id: 'dna_library', label: 'Fraud DNA Library', desc: 'Threat Rules Taxonomy', icon: Database },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleDrawerNavigate(item.id as ViewId)}
                      className={`w-full min-h-[44px] flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all cursor-pointer ${
                        isActive
                          ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-500/30 font-semibold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#151c2a]'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-teal-500' : 'text-slate-400 dark:text-slate-500'}`} />
                      <div className="min-w-0">
                        <p className="text-xs font-medium leading-tight truncate">{item.label}</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{item.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* HELP & SETTINGS */}
              <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-[#1c2638]">
                <div className="px-3 pb-1 text-[11px] font-mono font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                  HELP & SYSTEM
                </div>

                <button
                  onClick={() => handleDrawerNavigate('about_guide')}
                  className={`w-full min-h-[44px] flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                    activeView === 'about_guide'
                      ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 font-semibold border border-teal-200 dark:border-teal-500/30'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#151c2a]'
                  }`}
                >
                  <HelpCircle className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold leading-tight">How to Use FraudGuard</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Step-by-step user guide</p>
                  </div>
                </button>

                <button
                  onClick={() => handleDrawerNavigate('about_fraudguard')}
                  className={`w-full min-h-[44px] flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                    activeView === 'about_fraudguard'
                      ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 font-semibold border border-teal-200 dark:border-teal-500/30'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#151c2a]'
                  }`}
                >
                  <BookOpen className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold leading-tight">About FraudGuard</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Feature dictionary & info</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setIsHamburgerOpen(false);
                    onOpenSettings();
                  }}
                  className="w-full min-h-[44px] flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#151c2a] transition-all cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium leading-tight">Account & Settings</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Preferences & rules</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Bottom Profile Area & Log Out Button */}
            <div className="p-4 border-t border-slate-200 dark:border-[#1c2638] bg-slate-50 dark:bg-[#121722] space-y-3 shrink-0">
              <div
                onClick={() => {
                  setIsHamburgerOpen(false);
                  onOpenProfile();
                }}
                className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-[#0e1628] border border-slate-200 dark:border-[#1c2638] cursor-pointer hover:border-teal-500/40 transition-colors"
                title="View Profile"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center text-xs font-mono font-bold shrink-0">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {displayName}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate font-mono">
                      {user?.email || profile.email || 'naman.analyst@fraudguard.bank'}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/10 text-teal-700 dark:text-teal-300 font-bold border border-teal-500/30 shrink-0">
                  {displayRole}
                </span>
              </div>

              {/* Log Out Button */}
              <button
                id="btn-drawer-logout"
                onClick={handleLogout}
                className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-xs font-bold font-sans flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99]"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
