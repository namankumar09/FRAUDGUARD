import React, { useState } from 'react';
import {
  X,
  Palette,
  User,
  Shield,
  Sliders,
  Bell,
  Sun,
  Moon,
  Laptop,
  Check,
  Fingerprint,
  Key,
  Lock,
  RefreshCw,
  Download,
  Sparkles,
  Zap,
  Globe,
  SlidersHorizontal,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useTheme, ThemeMode, ColorPreset } from '../../context/ThemeContext';

interface SettingsAndAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetSimulationData?: () => void;
}

export const SettingsAndAccountModal: React.FC<SettingsAndAccountModalProps> = ({
  isOpen,
  onClose,
  onResetSimulationData,
}) => {
  const {
    themeMode,
    resolvedTheme,
    setThemeMode,
    colorPreset,
    setColorPreset,
    highContrast,
    setHighContrast,
    profile,
    updateProfile,
    resetSettingsToDefault,
  } = useTheme();

  const [activeTab, setActiveTab] = useState<'appearance' | 'account' | 'security' | 'engine' | 'notifications'>('appearance');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [exportNotice, setExportNotice] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleExportLogs = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      app: "Fraud Buddy",
      exportedAt: new Date().toISOString(),
      user: profile,
      theme: { themeMode, resolvedTheme, colorPreset, highContrast },
      telemetry: "Enterprise Session Active",
    }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `fraud-buddy-audit-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 3000);
  };

  return (
    <div
      id="settings-account-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-white dark:bg-[#091124] border border-slate-200 dark:border-[#1d2f57] rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl text-slate-800 dark:text-slate-100 overflow-hidden transition-colors">
        {/* Modal Header */}
        <div className="p-4 md:p-5 border-b border-slate-200 dark:border-[#19284d] bg-slate-50 dark:bg-[#070e20] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1e0e38] via-[#0c1938] to-[#1c2e12] border border-[#3b1d64] dark:border-[#581c87]/50 flex items-center justify-center text-purple-300 shadow-xs">
              <SlidersHorizontal className="w-5 h-5 text-purple-300 dark:text-purple-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base md:text-lg font-bold text-slate-900 dark:text-white font-sans tracking-tight">
                  Settings & Account Center
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-100 dark:bg-[#23123d] text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-[#581c87]/60 font-semibold">
                  FRAUD BUDDY CONTROL
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Customize appearance themes, biometric security, operator profile, and AI fraud thresholds
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {saveSuccess && (
              <span className="hidden sm:inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" /> Saved!
              </span>
            )}
            <button
              id="btn-close-settings"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#121f3d] dark:hover:bg-[#192b54] text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Layout: Left Tabs + Right Content */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
          {/* Sidebar Tabs */}
          <div className="w-full md:w-56 border-b md:border-b-0 md:border-r border-slate-200 dark:border-[#19284d] bg-slate-50/50 dark:bg-[#070e20]/80 p-2 md:p-3 flex md:flex-col gap-1 overflow-x-auto shrink-0 font-sans">
            {[
              { id: 'appearance', label: 'Theme & Modes', icon: Palette },
              { id: 'account', label: 'Account Details', icon: User },
              { id: 'security', label: 'Biometrics & 2FA', icon: Shield },
              { id: 'engine', label: 'Fraud Engine AI', icon: Sliders },
              { id: 'notifications', label: 'Alerts & Webhooks', icon: Bell },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`settings-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-[#182647] dark:bg-[#13203c] text-white font-bold shadow-xs border-l-2 border-purple-500 dark:border-purple-400'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/50 dark:hover:bg-[#0e172e]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400 dark:text-purple-300' : 'text-slate-400 dark:text-slate-500'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}

            <div className="hidden md:block mt-auto pt-4 border-t border-slate-200 dark:border-[#19284d] space-y-2">
              <button
                onClick={resetSettingsToDefault}
                className="w-full flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-mono text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-[#101b36] transition-colors"
                title="Reset all settings to default"
              >
                <RefreshCw className="w-3 h-3" />
                Reset Defaults
              </button>
            </div>
          </div>

          {/* Tab Content Panel */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar bg-white dark:bg-[#091124] text-slate-800 dark:text-slate-100 transition-colors space-y-6">
            
            {/* 1. THEME & APPEARANCE TAB */}
            {activeTab === 'appearance' && (
              <div className="space-y-6 animate-in fade-in">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-2">
                    <Palette className="w-4 h-4 text-purple-500" />
                    Theme Mode Selection
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Choose between crisp White / Light mode, rich Dark Blue & Purple dark mode, or automatic System Default mode.
                  </p>
                </div>

                {/* 3 Core Theme Options: Dark, Light (White), System Default */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Dark Mode */}
                  <button
                    id="theme-opt-dark"
                    onClick={() => setThemeMode('dark')}
                    className={`p-3.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                      themeMode === 'dark'
                        ? 'bg-[#0f1b38] border-purple-500 shadow-md ring-2 ring-purple-500/20 text-white'
                        : 'bg-slate-50 dark:bg-[#070e20] border-slate-200 dark:border-[#1a2b4f] hover:border-slate-400 dark:hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-8 h-8 rounded-xl bg-[#23123d] border border-[#581c87] flex items-center justify-center text-purple-300">
                        <Moon className="w-4 h-4" />
                      </div>
                      {themeMode === 'dark' && (
                        <span className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs">
                          <Check className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-xs">Dark Theme</div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Deep dark blue & purple command canvas
                      </p>
                    </div>
                  </button>

                  {/* Light / White Mode */}
                  <button
                    id="theme-opt-light"
                    onClick={() => setThemeMode('light')}
                    className={`p-3.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                      themeMode === 'light'
                        ? 'bg-blue-50/70 border-blue-600 shadow-md ring-2 ring-blue-500/20 text-slate-900'
                        : 'bg-slate-50 dark:bg-[#070e20] border-slate-200 dark:border-[#1a2b4f] hover:border-slate-400 dark:hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-8 h-8 rounded-xl bg-white border border-slate-300 flex items-center justify-center text-amber-500 shadow-2xs">
                        <Sun className="w-4 h-4" />
                      </div>
                      {themeMode === 'light' && (
                        <span className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs">
                          <Check className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-xs">White / Light Theme</div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Crisp, clean high-contrast white layout
                      </p>
                    </div>
                  </button>

                  {/* System Default Mode */}
                  <button
                    id="theme-opt-system"
                    onClick={() => setThemeMode('system')}
                    className={`p-3.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                      themeMode === 'system'
                        ? 'bg-purple-50 dark:bg-[#151c36] border-purple-500 shadow-md ring-2 ring-purple-500/20 text-slate-900 dark:text-white'
                        : 'bg-slate-50 dark:bg-[#070e20] border-slate-200 dark:border-[#1a2b4f] hover:border-slate-400 dark:hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-[#1f2d4e] flex items-center justify-center text-slate-700 dark:text-slate-200">
                        <Laptop className="w-4 h-4" />
                      </div>
                      {themeMode === 'system' && (
                        <span className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs">
                          <Check className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-xs">System Default</div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Auto-syncs with your OS ({resolvedTheme})
                      </p>
                    </div>
                  </button>
                </div>

                {/* Color Palette Presets */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-mono font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Color Accent Palette Preset
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      {
                        id: 'signature',
                        name: 'Fraud Buddy Signature',
                        desc: 'Dark Blue, Dark Purple, Olive Green, Light Red & Cognac Orange',
                        colors: ['#0b1736', '#23123d', '#526f33', '#ef4444', '#451a03'],
                      },
                      {
                        id: 'emerald',
                        name: 'Cyber Emerald',
                        desc: 'Deep Navy base with vivid Emerald and Mint matrix',
                        colors: ['#051214', '#064e3b', '#10b981', '#34d399', '#022c22'],
                      },
                      {
                        id: 'amethyst',
                        name: 'Imperial Amethyst',
                        desc: 'Velvet Midnight Purple with Royal Orchid accents',
                        colors: ['#120a2a', '#3b0764', '#7e22ce', '#c084fc', '#581c87'],
                      },
                      {
                        id: 'monochrome',
                        name: 'Titanium Slate',
                        desc: 'Strictly neutral graphite, titanium and carbon surfaces',
                        colors: ['#09090b', '#27272a', '#52525b', '#a1a1aa', '#f4f4f5'],
                      },
                    ].map((preset) => (
                      <div
                        key={preset.id}
                        onClick={() => setColorPreset(preset.id as ColorPreset)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          colorPreset === preset.id
                            ? 'bg-slate-100 dark:bg-[#121f3d] border-purple-500 dark:border-purple-400 ring-1 ring-purple-500/30'
                            : 'bg-slate-50 dark:bg-[#070e20] border-slate-200 dark:border-[#1a2b4f] hover:bg-slate-100/80 dark:hover:bg-[#0e172e]'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white font-sans flex items-center gap-2">
                            {preset.name}
                            {colorPreset === preset.id && (
                              <span className="text-[10px] text-purple-600 dark:text-purple-400 font-mono font-semibold">
                                Active
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{preset.desc}</p>
                          <div className="flex items-center gap-1.5 mt-2">
                            {preset.colors.map((c, i) => (
                              <span
                                key={i}
                                className="w-3.5 h-3.5 rounded-full border border-black/20 shadow-2xs"
                                style={{ backgroundColor: c }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Accessibility & Display Controls */}
                <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-[#19284d]">
                  <h4 className="text-xs font-mono font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Visual & Accessibility Toggles
                  </h4>
                  <div className="space-y-2">
                    <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#070e20] border border-slate-200 dark:border-[#1a2b4f] cursor-pointer">
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">High-Contrast Data Borders</div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">Increase border definition across metric cards and signal charts</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={highContrast}
                        onChange={(e) => setHighContrast(e.target.checked)}
                        className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#070e20] border border-slate-200 dark:border-[#1a2b4f] cursor-pointer">
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">Tabular Telemetry Numbers</div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">Fixed-width numerical alignment for millisecond latencies and INR sums</p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked={true}
                        className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* 2. ACCOUNT DETAILS TAB */}
            {activeTab === 'account' && (
              <div className="space-y-6 animate-in fade-in">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-2">
                    <User className="w-4 h-4 text-purple-500" />
                    Operator Profile & Credentials
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Manage your verified identity, administrative clearance, and enterprise directory credentials.
                  </p>
                </div>

                {/* Profile Badge Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 via-slate-50 to-blue-50 dark:from-[#1b0c2e] dark:via-[#0c1630] dark:to-[#071328] border border-purple-200 dark:border-[#381d61] flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#23123d] to-[#0c1938] border-2 border-purple-400/50 flex items-center justify-center text-white text-xl font-bold font-mono shadow-md">
                    {profile.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">{profile.name}</h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-100 dark:bg-[#1c2e12] text-emerald-800 dark:text-[#84a35c] border border-emerald-300 dark:border-[#364f24] font-semibold">
                        AUTHENTICATED
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-mono mt-0.5">{profile.email}</p>
                    <p className="text-[11px] text-purple-700 dark:text-purple-300 mt-1 font-semibold">
                      {profile.role} • {profile.securityTier}
                    </p>
                  </div>
                </div>

                {/* Editable Account Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-600 dark:text-slate-400">Full Name</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => updateProfile({ name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#070e20] border border-slate-300 dark:border-[#1d2f57] text-xs font-sans text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-600 dark:text-slate-400">Email Address</label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => updateProfile({ email: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#070e20] border border-slate-300 dark:border-[#1d2f57] text-xs font-sans text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-600 dark:text-slate-400">Role Title</label>
                    <input
                      type="text"
                      value={profile.role}
                      onChange={(e) => updateProfile({ role: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#070e20] border border-slate-300 dark:border-[#1d2f57] text-xs font-sans text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-600 dark:text-slate-400">Organization & Network</label>
                    <input
                      type="text"
                      value={profile.organization}
                      onChange={(e) => updateProfile({ organization: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#070e20] border border-slate-300 dark:border-[#1d2f57] text-xs font-sans text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                {/* Session Telemetry Status */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#070e20] border border-slate-200 dark:border-[#1d2f57] space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-500 dark:text-slate-400">Live Active Node</span>
                    <span className="font-semibold text-slate-900 dark:text-white">Cloud Run Asia-Southeast1 (Container #ais-dev)</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-500 dark:text-slate-400">Session IP Protocol</span>
                    <span className="font-semibold text-slate-900 dark:text-white">135.35.89.43 • HTTPS TLS 1.3 Strict</span>
                  </div>
                </div>

                <button
                  onClick={handleSave}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition-all shadow-xs"
                >
                  Save Profile Changes
                </button>
              </div>
            )}

            {/* 3. BIOMETRICS & 2FA TAB */}
            {activeTab === 'security' && (
              <div className="space-y-6 animate-in fade-in">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-2">
                    <Shield className="w-4 h-4 text-purple-500" />
                    Biometrics & Hardware Security Keys
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Continuous neuromuscular biometrics and FIDO2 / WebAuthn cryptographic keys guarding your session.
                  </p>
                </div>

                {/* Biometric Card */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#070e20] border border-slate-200 dark:border-[#1d2f57] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#1c2e12] border border-[#364f24] flex items-center justify-center text-[#84a35c]">
                        <Fingerprint className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">
                          Continuous Keystroke Biometric Signature
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          99.8% match rate • 14ms inter-key flight variance enrolled
                        </p>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-emerald-100 dark:bg-[#1c2e12] text-emerald-800 dark:text-[#84a35c] border border-emerald-300 dark:border-[#364f24] font-bold">
                      ACTIVE
                    </span>
                  </div>
                </div>

                {/* Yubikey Card */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#070e20] border border-slate-200 dark:border-[#1d2f57] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#23123d] border border-[#581c87] flex items-center justify-center text-purple-300">
                        <Key className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">
                          Hardware Token (YubiKey 5C NFC)
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          FIDO2 / WebAuthn Hardware Security Slot #1
                        </p>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-purple-100 dark:bg-[#23123d] text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-[#581c87] font-bold">
                      ENROLLED
                    </span>
                  </div>
                </div>

                {/* Inactivity Auto-Lock */}
                <div className="space-y-2">
                  <label className="text-xs font-mono text-slate-700 dark:text-slate-300">
                    Session Inactivity Auto-Lock
                  </label>
                  <select
                    value={profile.autoLockMinutes}
                    onChange={(e) => updateProfile({ autoLockMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#070e20] border border-slate-300 dark:border-[#1d2f57] text-xs font-sans text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value={15}>15 Minutes of Inactivity</option>
                    <option value={30}>30 Minutes of Inactivity (Recommended)</option>
                    <option value={60}>60 Minutes of Inactivity</option>
                    <option value={120}>2 Hours</option>
                    <option value={0}>Never (Demo Mode)</option>
                  </select>
                </div>
              </div>
            )}

            {/* 4. FRAUD ENGINE AI TAB */}
            {activeTab === 'engine' && (
              <div className="space-y-6 animate-in fade-in">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-purple-500" />
                    AI Fraud Engine Thresholds
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Calibrate decision boundaries for step-up biometric challenges, auto-quarantine, and simulation streaming speed.
                  </p>
                </div>

                {/* Step Up Slider */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#070e20] border border-slate-200 dark:border-[#1d2f57] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      Step-Up Challenge Sensitivity Threshold
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                      Score &gt; {profile.stepUpThreshold}/100
                    </span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="90"
                    value={profile.stepUpThreshold}
                    onChange={(e) => updateProfile({ stepUpThreshold: Number(e.target.value) })}
                    className="w-full accent-amber-500"
                  />
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Sessions scoring above this threshold trigger biometric re-authentication or push verification.
                  </p>
                </div>

                {/* Auto Quarantine Slider */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#070e20] border border-slate-200 dark:border-[#1d2f57] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      Auto-Quarantine Risk Threshold
                    </span>
                    <span className="text-xs font-mono font-bold text-[#ef4444] dark:text-[#f87171]">
                      Score &gt; {profile.autoQuarantineThreshold}/100
                    </span>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="98"
                    value={profile.autoQuarantineThreshold}
                    onChange={(e) => updateProfile({ autoQuarantineThreshold: Number(e.target.value) })}
                    className="w-full accent-red-500"
                  />
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    High-confidence malicious attacks are instantly quarantined before balance egress occurs.
                  </p>
                </div>

                {/* Reset Data Button */}
                {onResetSimulationData && (
                  <div className="p-4 rounded-2xl bg-[#3b1402]/20 border border-[#7c2d12]/40 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">Reset Synthetic Dataset</div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Reload default transactions, tells, and zero-day threat patterns</p>
                    </div>
                    <button
                      onClick={() => {
                        onResetSimulationData();
                        handleSave();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#451a03] hover:bg-[#5c2404] text-amber-200 border border-[#7c2d12] text-xs font-mono font-semibold"
                    >
                      Reset State
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 5. NOTIFICATIONS & EXPORT TAB */}
            {activeTab === 'notifications' && (
              <div className="space-y-6 animate-in fade-in">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-2">
                    <Bell className="w-4 h-4 text-purple-500" />
                    Alert Broadcasts & Audit Logs
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Manage real-time push alerts, Webhook receivers, and export compliance audit trails.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#070e20] border border-slate-200 dark:border-[#1a2b4f] cursor-pointer">
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">Critical High-Risk Push Notification</div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Real-time alert banner whenever a transaction &gt;85 risk score is detected</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={profile.pushNotifications}
                      onChange={(e) => updateProfile({ pushNotifications: e.target.checked })}
                      className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#070e20] border border-slate-200 dark:border-[#1a2b4f] cursor-pointer">
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">Auditory Alert Ping</div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Play soft chime on zero-day pattern discovery or high-risk quarantine</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={profile.soundAlerts}
                      onChange={(e) => updateProfile({ soundAlerts: e.target.checked })}
                      className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                    />
                  </label>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-600 dark:text-slate-400">Webhook Dispatch Endpoint</label>
                  <input
                    type="text"
                    value={profile.webhookUrl}
                    onChange={(e) => updateProfile({ webhookUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#070e20] border border-slate-300 dark:border-[#1d2f57] text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-[#19284d] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">Compliance Audit Trail Export</div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Download formatted JSON with full configuration and session proofs</p>
                  </div>
                  <button
                    onClick={handleExportLogs}
                    className="px-3.5 py-2 rounded-xl bg-[#23123d] hover:bg-[#321957] text-purple-200 border border-[#581c87] text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export Audit JSON
                  </button>
                </div>
                {exportNotice && (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-mono">
                    ✓ Audit JSON successfully generated and downloaded.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 md:p-4 border-t border-slate-200 dark:border-[#19284d] bg-slate-50 dark:bg-[#070e20] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
            <span className="w-2 h-2 rounded-full bg-[#526f33] dark:bg-[#84a35c]" />
            Fraud Buddy Sovereign Guard Active
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-[#152342] dark:hover:bg-[#1d315c] text-slate-800 dark:text-slate-200 font-semibold text-xs transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
