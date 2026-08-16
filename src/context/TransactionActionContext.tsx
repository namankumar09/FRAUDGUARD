import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Lock,
  ShieldAlert,
  X,
  Zap,
  ArrowRight
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

export type TransactionAnalystAction = 'APPROVE' | 'STEP_UP' | 'QUARANTINE';

export interface TransactionActionRecord {
  transactionId: string;
  action: TransactionAnalystAction;
  status: 'RESOLVED_CLEAN' | 'STEP_UP_CHALLENGED' | 'BLOCKED';
  decisionText: string;
  timestamp: number;
  analyst: string;
  stepUpSimulatedOutcome?: 'PASSED' | 'FAILED' | 'PENDING';
}

interface TransactionActionContextType {
  actionRecords: Record<string, TransactionActionRecord>;
  getActionRecord: (txnId: string) => TransactionActionRecord | undefined;
  requestAction: (transaction: { id: string; transactionRef?: string; customerName?: string; riskScore?: number; amount?: number }, action: TransactionAnalystAction) => void;
  simulateStepUpOutcome: (txnId: string, outcome: 'PASSED' | 'FAILED') => Promise<void>;
  isProcessing: boolean;
}

const STORAGE_KEY = 'fraudguard_txn_analyst_actions';

const TransactionActionContext = createContext<TransactionActionContextType | undefined>(undefined);

export const TransactionActionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [actionRecords, setActionRecords] = useState<Record<string, TransactionActionRecord>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse txn actions from localStorage', e);
    }
    return {};
  });

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [targetTxn, setTargetTxn] = useState<{ id: string; transactionRef?: string; customerName?: string; riskScore?: number; amount?: number } | null>(null);
  const [pendingAction, setPendingAction] = useState<TransactionAnalystAction | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(actionRecords));
    } catch (e) {
      console.error('Failed to save txn action records:', e);
    }
  }, [actionRecords]);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const getActionRecord = (txnId: string): TransactionActionRecord | undefined => {
    if (!txnId) return undefined;
    return actionRecords[txnId];
  };

  const requestAction = (
    transaction: { id: string; transactionRef?: string; customerName?: string; riskScore?: number; amount?: number },
    action: TransactionAnalystAction
  ) => {
    setTargetTxn(transaction);
    setPendingAction(action);
    setErrorMessage(null);
    setConfirmModalOpen(true);
  };

  const executeConfirmedAction = async () => {
    if (!targetTxn || !pendingAction) return;

    setIsProcessing(true);
    setErrorMessage(null);

    const analystName = user?.name || 'Naman Kumar';
    const now = Date.now();

    try {
      // 1. Sync to backend database
      await api.updateTransactionDecision(
        targetTxn.id,
        pendingAction,
        `Analyst ${analystName} confirmed action [${pendingAction}]`,
        analystName
      );

      // 2. Map status and decision text
      let status: 'RESOLVED_CLEAN' | 'STEP_UP_CHALLENGED' | 'BLOCKED' = 'RESOLVED_CLEAN';
      let decisionText = 'Approved — Analyst Override';
      let toast = 'Transaction approved with analyst override.';

      if (pendingAction === 'STEP_UP') {
        status = 'STEP_UP_CHALLENGED';
        decisionText = 'Step-Up Required';
        toast = 'Step-up challenge triggered.';
      } else if (pendingAction === 'QUARANTINE') {
        status = 'BLOCKED';
        decisionText = 'Quarantined & Blocked';
        toast = 'Transaction quarantined and blocked.';
      }

      // 3. Update local state
      setActionRecords((prev) => ({
        ...prev,
        [targetTxn.id]: {
          transactionId: targetTxn.id,
          action: pendingAction,
          status,
          decisionText,
          timestamp: now,
          analyst: analystName,
          stepUpSimulatedOutcome: pendingAction === 'STEP_UP' ? 'PENDING' : undefined,
        },
      }));

      setToastMessage(toast);
      setConfirmModalOpen(false);
      setTargetTxn(null);
      setPendingAction(null);
    } catch (err: any) {
      if (pendingAction === 'APPROVE') {
        setErrorMessage("We couldn't approve this transaction. Please try again.");
      } else if (pendingAction === 'STEP_UP') {
        setErrorMessage("We couldn't trigger the step-up challenge. Please try again.");
      } else {
        setErrorMessage("We couldn't quarantine this transaction. Please try again.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const simulateStepUpOutcome = async (txnId: string, outcome: 'PASSED' | 'FAILED') => {
    setIsProcessing(true);
    try {
      await new Promise((r) => setTimeout(r, 400));
      setActionRecords((prev) => {
        const existing = prev[txnId];
        if (!existing) return prev;
        return {
          ...prev,
          [txnId]: {
            ...existing,
            stepUpSimulatedOutcome: outcome,
            decisionText: outcome === 'PASSED' ? 'Step-Up Passed (Verified)' : 'Step-Up Failed (Quarantined)',
            status: outcome === 'PASSED' ? 'RESOLVED_CLEAN' : 'BLOCKED',
          },
        };
      });

      setToastMessage(outcome === 'PASSED' ? 'Step-up challenge passed successfully.' : 'Step-up challenge failed. Transaction quarantined.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <TransactionActionContext.Provider
      value={{
        actionRecords,
        getActionRecord,
        requestAction,
        simulateStepUpOutcome,
        isProcessing,
      }}
    >
      {children}

      {/* Global Toast */}
      {toastMessage && (
        <div
          id="toast-txn-action"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xl border border-slate-700 dark:border-slate-200 animate-in fade-in slide-in-from-bottom-3 font-sans text-xs font-semibold"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* CONFIRMATION MODAL */}
      {confirmModalOpen && targetTxn && pendingAction && (
        <div
          id="modal-confirm-txn-action"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => !isProcessing && setConfirmModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-[#0e1422] border border-slate-200 dark:border-[#223354] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100 font-sans transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-5 border-b border-slate-100 dark:border-[#1c2944] bg-slate-50/70 dark:bg-[#0a0f1b] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                    pendingAction === 'APPROVE'
                      ? 'bg-emerald-500/10 dark:bg-emerald-500/20 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                      : pendingAction === 'STEP_UP'
                      ? 'bg-amber-500/10 dark:bg-amber-500/20 border-amber-500/30 text-amber-600 dark:text-amber-400'
                      : 'bg-rose-500/10 dark:bg-rose-500/20 border-rose-500/30 text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {pendingAction === 'APPROVE' && <CheckCircle2 className="w-5 h-5" />}
                  {pendingAction === 'STEP_UP' && <AlertTriangle className="w-5 h-5" />}
                  {pendingAction === 'QUARANTINE' && <Lock className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {pendingAction === 'APPROVE' && 'Approve this transaction?'}
                    {pendingAction === 'STEP_UP' && 'Trigger a step-up challenge?'}
                    {pendingAction === 'QUARANTINE' && 'Quarantine and block this transaction?'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                    Txn: {targetTxn.transactionRef || targetTxn.id} {targetTxn.customerName ? `• ${targetTxn.customerName}` : ''}
                  </p>
                </div>
              </div>
              <button
                disabled={isProcessing}
                onClick={() => setConfirmModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#162238] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
              <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {pendingAction === 'APPROVE' &&
                  'This will override the current fraud decision and mark this transaction as approved. The original risk assessment will remain available for review.'}
                {pendingAction === 'STEP_UP' &&
                  'The customer will need to complete an additional verification step before this transaction can continue.'}
                {pendingAction === 'QUARANTINE' &&
                  'This will stop the transaction and mark it for investigation. The transaction will remain blocked until an analyst reviews it.'}
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
                onClick={() => setConfirmModalOpen(false)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white dark:bg-[#162238] border border-slate-200 dark:border-[#223354] hover:bg-slate-100 dark:hover:bg-[#1f2e4c] text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={executeConfirmedAction}
                className={`w-full sm:w-auto px-4 py-2 rounded-xl text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  pendingAction === 'APPROVE'
                    ? 'bg-emerald-600 hover:bg-emerald-500'
                    : pendingAction === 'STEP_UP'
                    ? 'bg-amber-600 hover:bg-amber-500'
                    : 'bg-rose-600 hover:bg-rose-500'
                }`}
              >
                {pendingAction === 'APPROVE' && (
                  <span>{isProcessing ? 'Approving...' : 'Confirm Approval'}</span>
                )}
                {pendingAction === 'STEP_UP' && (
                  <span>{isProcessing ? 'Triggering challenge...' : 'Trigger Challenge'}</span>
                )}
                {pendingAction === 'QUARANTINE' && (
                  <span>{isProcessing ? 'Quarantining...' : 'Confirm Hard Block'}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </TransactionActionContext.Provider>
  );
};

export const useTransactionAction = (): TransactionActionContextType => {
  const context = useContext(TransactionActionContext);
  if (!context) {
    throw new Error('useTransactionAction must be used within a TransactionActionProvider');
  }
  return context;
};
