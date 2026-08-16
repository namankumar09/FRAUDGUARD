import React, { useState, useEffect } from 'react';
import { Shield, Lock, User, Eye, EyeOff, Bot, Sparkles, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LoginScreenProps {
  onLoginSuccess?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const { login } = useAuth();
  const [username, setUsername] = useState('naman.kumar@fraudguard.bank');
  const [password, setPassword] = useState('FraudGuard#2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [isBotMode, setIsBotMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [botFilling, setBotFilling] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleStandardSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setErrorMessage('Please enter your analyst username or email.');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);
    try {
      const success = await login(username, password, 'Admin');
      if (success) {
        if (onLoginSuccess) onLoginSuccess();
      } else {
        setErrorMessage('Authentication failed. Please check credentials.');
      }
    } catch (err) {
      setErrorMessage('An unexpected error occurred during sign-in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSimulateBotContinue = async () => {
    setBotFilling(true);
    setErrorMessage('');

    // Instant, robotic 0ms uniform credential fill
    const botUser = 'bot_script_operator_9@automated-syndicate.net';
    const botPass = 'RapidBotAutomatedPass#99';

    // Rapid zero-delay sequence
    setUsername(botUser);
    setPassword(botPass);

    await new Promise((res) => setTimeout(res, 250));

    try {
      const success = await login(botUser, botPass, 'Fraud Analyst');
      if (success) {
        if (onLoginSuccess) onLoginSuccess();
      }
    } catch (err) {
      setErrorMessage('Bot simulation sign in failed.');
    } finally {
      setBotFilling(false);
    }
  };

  return (
    <div
      id="login-screen-container"
      className="min-h-screen w-full bg-[var(--bg-app)] text-[var(--text-primary)] flex flex-col items-center justify-center p-4 sm:p-6 select-none relative overflow-hidden font-sans"
    >
      {/* Subtle Background Glow Elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[var(--color-brand)]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl p-6 sm:p-8 shadow-xs dark:shadow-2xl relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--color-brand)]/10 border border-[var(--color-brand)]/30 text-[var(--color-brand)] shadow-md mb-1">
            <Shield className="w-7 h-7 text-[var(--color-brand)]" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] font-sans flex items-center justify-center gap-2">
            FraudGuard
          </h1>
          <p className="text-xs font-mono tracking-wider text-[var(--text-muted)] uppercase">
            Enterprise AI Behavioral Defense
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleStandardSignIn} className="space-y-4">
          {/* Username Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-semibold text-[var(--text-secondary)] uppercase tracking-wider block">
              Analyst Username / Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)]">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                id="login-username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="analyst@fraudguard.bank"
                className="w-full pl-10 pr-4 py-3 bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--color-brand)] rounded-xl text-xs focus:outline-none transition-colors font-mono"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-semibold text-[var(--text-secondary)] uppercase tracking-wider block">
                Password
              </label>
              <span className="text-[10px] text-[var(--color-brand)] font-mono">256-Bit TLS Guard</span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)]">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                id="login-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-3 bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--color-brand)] rounded-xl text-xs focus:outline-none transition-colors font-mono tracking-wider"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            id="btn-sign-in"
            disabled={isSubmitting || botFilling}
            className="w-full min-h-[44px] py-3 px-4 rounded-xl bg-[var(--color-brand-solid)] hover:opacity-90 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[var(--color-brand)]/10 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider with "or" */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-[var(--border-color)] w-full" />
          <span className="bg-[var(--bg-card)] px-3 text-[11px] font-mono text-[var(--text-muted)] uppercase tracking-widest absolute">
            or
          </span>
        </div>

        {/* Secondary Option: Simulate Bot Sign-In */}
        <div className="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-[var(--text-primary)] leading-tight">Simulate Bot Sign-In</p>
                <p className="text-[10px] text-[var(--text-muted)]">Rapid automated credentials fill</p>
              </div>
            </div>

            {/* Toggle Button */}
            <button
              type="button"
              id="toggle-bot-signin"
              onClick={() => setIsBotMode(!isBotMode)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isBotMode ? 'bg-purple-600' : 'bg-slate-700'
              }`}
              role="switch"
              aria-checked={isBotMode}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  isBotMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Continue Button appears/activates when Bot mode is selected */}
          {isBotMode && (
            <div className="pt-2 animate-in fade-in slide-in-from-top-2 space-y-2">
              <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-[11px] font-mono text-purple-300 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>Synthetic script armed: 0ms flight time, instant credential dump.</span>
              </div>

              <button
                type="button"
                id="btn-bot-continue"
                onClick={handleSimulateBotContinue}
                disabled={botFilling}
                className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs font-mono uppercase tracking-wider transition-all shadow-md shadow-purple-950/40 flex items-center justify-center gap-2 cursor-pointer"
              >
                {botFilling ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Executing Bot Injection...</span>
                  </>
                ) : (
                  <>
                    <Bot className="w-4 h-4" />
                    <span>Continue with Bot Fill</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="text-center">
          <p className="text-[11px] text-[var(--text-muted)] font-mono">
            Protected by Real-Time Keystroke & Biometric Telemetry
          </p>
        </div>
      </div>
    </div>
  );
};
