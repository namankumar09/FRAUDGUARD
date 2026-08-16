import React, { createContext, useContext, useState, useEffect } from 'react';
import { Lock, Unlock, AlertTriangle, ShieldAlert, X, CheckCircle2 } from 'lucide-react';
import { useAuth } from './AuthContext';

export interface ContainmentRecord {
  sessionId: string;
  contained: boolean;
  containedAt: number; // timestamp
  containedBy: string;
  releasedAt?: number;
  releasedBy?: string;
  sessionRef?: string;
  customerName?: string;
  riskTier?: 'low' | 'medium' | 'high';
}

interface ContainmentContextType {
  containmentMap: Record<string, ContainmentRecord>;
  isSessionContained: (sessionId: string) => boolean;
  getContainmentInfo: (sessionId: string) => ContainmentRecord | undefined;
  requestContainSession: (session: { sessionId: string; sessionRef?: string; customerName?: string; riskTier?: string }) => void;
  requestReleaseSession: (sessionId: string) => void;
  containSessionDirect: (sessionId: string, sessionRef?: string, customerName?: string, riskTier?: string) => Promise<boolean>;
  releaseSessionDirect: (sessionId: string) => Promise<boolean>;
}

const STORAGE_KEY = 'fraudguard_session_containment_state';

const ContainmentContext = createContext<ContainmentContextType | undefined>(undefined);

export const ContainmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  // Seeded sample contained sessions for realistic enterprise demo
  const [containmentMap, setContainmentMap] = useState<Record<string, ContainmentRecord>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse containment from localStorage', e);
    }
    // Default initial mock containment for demo
    const now = Date.now();
    return {
      'sess-bot-901': {
        sessionId: 'sess-bot-901',
        contained: true,
        containedAt: now - 3600000 * 3, // 3 hrs ago
        containedBy: 'Naman Kumar',
        sessionRef: 'SESS-2026-901',
        customerName: 'Devansh Singhal',
        riskTier: 'high',
      },
    };
  });

  // Modal Dialog states
  const [containModalOpen, setContainModalOpen] = useState(false);
  const [releaseModalOpen, setReleaseModalOpen] = useState(false);
  const [targetSession, setTargetSession] = useState<{ sessionId: string; sessionRef?: string; customerName?: string; riskTier?: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(containmentMap));
    } catch (e) {
      console.error('Failed to save containment state:', e);
    }
  }, [containmentMap]);

  // Auto-hide toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const isSessionContained = (sessionId: string): boolean => {
    if (!sessionId) return false;
    return !!containmentMap[sessionId]?.contained;
  };

  const getContainmentInfo = (sessionId: string): ContainmentRecord | undefined => {
    if (!sessionId) return undefined;
    return containmentMap[sessionId];
  };

  const requestContainSession = (session: { sessionId: string; sessionRef?: string; customerName?: string; riskTier?: string }) => {
    setTargetSession(session);
    setErrorMessage(null);
    setContainModalOpen(true);
  };

  const requestReleaseSession = (sessionId: string) => {
    const info = containmentMap[sessionId];
    setTargetSession({
      sessionId,
      sessionRef: info?.sessionRef || sessionId,
      customerName: info?.customerName || 'Customer',
      riskTier: info?.riskTier || 'high',
    });
    setErrorMessage(null);
    setReleaseModalOpen(true);
  };

  const containSessionDirect = async (sessionId: string, sessionRef?: string, customerName?: string, riskTier?: string): Promise<boolean> => {
    setIsProcessing(true);
    setErrorMessage(null);
    try {
      // Small latency for realistic async state
      await new Promise((r) => setTimeout(r, 450));

      const now = Date.now();
      const analystName = user?.name || 'Naman Kumar';

      setContainmentMap((prev) => ({
        ...prev,
        [sessionId]: {
          sessionId,
          contained: true,
          containedAt: now,
          containedBy: analystName,
          sessionRef: sessionRef || sessionId,
          customerName: customerName || 'Customer',
          riskTier: (riskTier as any) || 'high',
        },
      }));

      // Sync with audit log or backend if supported
      try {
        await fetch('/api/audit-logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'CONTAIN_SESSION',
            resource: 'Session',
            resourceId: sessionId,
            details: `Session ${sessionId} contained by ${analystName}`,
            timestamp: new Date().toISOString(),
          }),
        }).catch(() => {});
      } catch (e) {}

      setToastMessage('Session contained successfully.');
      setContainModalOpen(false);
      setTargetSession(null);
      return true;
    } catch (err) {
      setErrorMessage("We couldn't contain this session. Please try again.");
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const releaseSessionDirect = async (sessionId: string): Promise<boolean> => {
    setIsProcessing(true);
    setErrorMessage(null);
    try {
      await new Promise((r) => setTimeout(r, 450));

      const now = Date.now();
      const analystName = user?.name || 'Naman Kumar';

      setContainmentMap((prev) => {
        const existing = prev[sessionId];
        if (!existing) return prev;
        return {
          ...prev,
          [sessionId]: {
            ...existing,
            contained: false,
            releasedAt: now,
            releasedBy: analystName,
          },
        };
      });

      try {
        await fetch('/api/audit-logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'RELEASE_SESSION_CONTAINMENT',
            resource: 'Session',
            resourceId: sessionId,
            details: `Session ${sessionId} released from containment by ${analystName}`,
            timestamp: new Date().toISOString(),
          }),
        }).catch(() => {});
      } catch (e) {}

      setToastMessage('Session released from containment.');
      setReleaseModalOpen(false);
      setTargetSession(null);
      return true;
    } catch (err) {
      setErrorMessage("We couldn't release this session. Please try again.");
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ContainmentContext.Provider
      value={{
        containmentMap,
        isSessionContained,
        getContainmentInfo,
        requestContainSession,
        requestReleaseSession,
        containSessionDirect,
        releaseSessionDirect,
      }}
    >
      {children}

      {/* Global Toast Notification */}
      {toastMessage && (
        <div
          id="toast-containment"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xl border border-slate-700 dark:border-slate-200 animate-in fade-in slide-in-from-bottom-3 font-sans text-xs font-semibold"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. CONFIRM CONTAINMENT DIALOG */}
      {containModalOpen && targetSession && (
        <div
          id="modal-contain-session"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => !isProcessing && setContainModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-[#0e1422] border border-slate-200 dark:border-[#223354] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100 font-sans transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-5 border-b border-slate-100 dark:border-[#1c2944] bg-slate-50/70 dark:bg-[#0a0f1b] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 dark:bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-600 dark:text-rose-400">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Contain this session?
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                    Session: {targetSession.sessionRef || targetSession.sessionId}
                  </p>
                </div>
              </div>
              <button
                disabled={isProcessing}
                onClick={() => setContainModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#162238] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
              <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Containing this session marks the associated onboarding attempt as blocked pending review. In a production system, this would freeze any account actions tied to this session until an analyst clears it. This action can be reversed at any time from the same screen.
              </p>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/40 text-xs text-rose-700 dark:text-rose-300 font-medium">
                  {errorMessage}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="p-4 bg-slate-50/70 dark:bg-[#0a0f1b] border-t border-slate-100 dark:border-[#1c2944] flex flex-col sm:flex-row items-center justify-end gap-2.5">
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => setContainModalOpen(false)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white dark:bg-[#162238] border border-slate-200 dark:border-[#223354] hover:bg-slate-100 dark:hover:bg-[#1f2e4c] text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => containSessionDirect(targetSession.sessionId, targetSession.sessionRef, targetSession.customerName, targetSession.riskTier)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{isProcessing ? 'Containing...' : 'Confirm Contain'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. CONFIRM RELEASE DIALOG */}
      {releaseModalOpen && targetSession && (
        <div
          id="modal-release-session"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => !isProcessing && setReleaseModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-[#0e1422] border border-slate-200 dark:border-[#223354] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100 font-sans transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-5 border-b border-slate-100 dark:border-[#1c2944] bg-slate-50/70 dark:bg-[#0a0f1b] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Unlock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Release this session from containment?
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                    Session: {targetSession.sessionRef || targetSession.sessionId}
                  </p>
                </div>
              </div>
              <button
                disabled={isProcessing}
                onClick={() => setReleaseModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#162238] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
              <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                This session will return to normal review status. This does not undo the original risk assessment — only the containment action.
              </p>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/40 text-xs text-rose-700 dark:text-rose-300 font-medium">
                  {errorMessage}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="p-4 bg-slate-50/70 dark:bg-[#0a0f1b] border-t border-slate-100 dark:border-[#1c2944] flex flex-col sm:flex-row items-center justify-end gap-2.5">
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => setReleaseModalOpen(false)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white dark:bg-[#162238] border border-slate-200 dark:border-[#223354] hover:bg-slate-100 dark:hover:bg-[#1f2e4c] text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => releaseSessionDirect(targetSession.sessionId)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Unlock className="w-3.5 h-3.5" />
                <span>{isProcessing ? 'Releasing...' : 'Confirm Release'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </ContainmentContext.Provider>
  );
};

export const useContainment = (): ContainmentContextType => {
  const context = useContext(ContainmentContext);
  if (!context) {
    throw new Error('useContainment must be used within a ContainmentProvider');
  }
  return context;
};
