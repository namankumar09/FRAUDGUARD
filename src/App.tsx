import React, { useState, useEffect } from 'react';
import { Sidebar, ViewId } from './components/Sidebar';
import { Header } from './components/Header';
import { TransactionDetailModal } from './components/modals/TransactionDetailModal';
import { SettingsAndAccountModal } from './components/modals/SettingsAndAccountModal';
import { UserProfileModal } from './components/modals/UserProfileModal';
import { FraudGuardAssistant } from './components/FraudGuardAssistant';

// Views
import { DashboardOverview } from './components/views/DashboardOverview';
import { BehavioralOnboardingEngine } from './components/views/BehavioralOnboardingEngine';
import { LiveTransactionStream } from './components/views/LiveTransactionStream';
import { PrecursorDetectorView } from './components/views/PrecursorDetectorView';
import { BehavioralDnaMutationView } from './components/views/BehavioralDnaMutationView';
import { FraudRehearsalDetectorView } from './components/views/FraudRehearsalDetectorView';
import { BehavioralTellsDiscoveryView } from './components/views/BehavioralTellsDiscoveryView';
import { PatternEvolutionEngineView } from './components/views/PatternEvolutionEngineView';
import { CounterfactualSimulatorView } from './components/views/CounterfactualSimulatorView';
import { NextActionPredictionView } from './components/views/NextActionPredictionView';
import { ImpersonationDetectorView } from './components/views/ImpersonationDetectorView';
import { DoppelgangerClusterView } from './components/views/DoppelgangerClusterView';
import { BehavioralTimeMachineView } from './components/views/BehavioralTimeMachineView';
import { FraudGravityEngineView } from './components/views/FraudGravityEngineView';
import { FraudDnaLibraryView } from './components/views/FraudDnaLibraryView';
import { AdversarialRedTeamSimulatorView } from './components/views/AdversarialRedTeamSimulatorView';
import { AIEvasionAnalysisView } from './components/views/AIEvasionAnalysisView';
import { CrossCustomerEchoView } from './components/views/CrossCustomerEchoView';
import { ZeroDayRadarView } from './components/views/ZeroDayRadarView';
import { DnaMutationTreeView } from './components/views/DnaMutationTreeView';
import { AboutAndDocumentationView } from './components/views/AboutAndDocumentationView';
import { AboutFraudGuardView } from './components/views/AboutFraudGuardView';
import { CaseManagementView } from './components/views/CaseManagementView';
import { AnalyticsAndReportsView } from './components/views/AnalyticsAndReportsView';
import { LoginScreen } from './components/LoginScreen';
import { useAuth } from './context/AuthContext';
import { useDeviceDetection } from './hooks/useDeviceDetection';
import { api } from './services/api';

// Mock Data & Types
import {
  MOCK_TRANSACTIONS,
  MOCK_TELLS,
  MOCK_ZERO_DAYS,
} from './data/mockFraudData';
import { TransactionRecord } from './types/fraud';

export function App() {
  const { isAuthenticated } = useAuth();
  const { isMobile } = useDeviceDetection();
  const [activeView, setActiveView] = useState<ViewId>('overview');
  const [transactions, setTransactions] = useState<TransactionRecord[]>(MOCK_TRANSACTIONS);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionRecord | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [investigatorMode, setInvestigatorMode] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);

  // Synchronize with backend API on mount
  useEffect(() => {
    const fetchLiveTxns = async () => {
      try {
        const res = await api.getTransactions({ limit: 50 });
        if (res.success && res.transactions && res.transactions.length > 0) {
          // If we got DB transactions, map into rich TransactionRecords
          const mapped: TransactionRecord[] = res.transactions.map((dbT: any, idx: number) => {
            const template = MOCK_TRANSACTIONS[idx % MOCK_TRANSACTIONS.length];
            const isHigh = dbT.riskLevel === 'high' || dbT.riskLevel === 'critical' || dbT.riskScore >= 60;
            const isSuspicious = !isHigh && (dbT.riskLevel === 'medium' || dbT.riskLevel === 'suspicious' || dbT.riskScore >= 30);
            return {
              ...template,
              id: dbT.id,
              transactionRef: dbT.transactionRef || dbT.id,
              amount: Number(dbT.amount),
              currency: dbT.currency || 'INR',
              timestamp: dbT.timestamp || 'Just now',
              status: dbT.status || (isHigh ? 'AUTO_BLOCKED' : 'PENDING_REVIEW'),
              customer: {
                ...template.customer,
                id: dbT.customerId || template.customer.id,
                name: dbT.customerName || template.customer.name,
                email: dbT.customerEmail || template.customer.email,
              },
              beneficiary: {
                ...template.beneficiary,
                name: dbT.beneficiaryName || template.beneficiary.name,
                accountNumberMasked: dbT.beneficiaryAccount || template.beneficiary.accountNumberMasked,
              },
              riskScore: {
                totalScore: Number(dbT.riskScore || 15),
                riskLevel: isHigh ? 'high' : isSuspicious ? 'suspicious' : 'low',
                primaryDriver: dbT.primaryDriver || template.riskScore.primaryDriver,
                fraudGravityScore: isHigh ? 88 : 24,
                confidence: 0.94,
                breakdown: dbT.signals && dbT.signals.length > 0
                  ? dbT.signals.map((s: any) => ({
                      signalName: s.signalName,
                      category: s.category || 'behavioral',
                      contribution: s.contribution || 15,
                      status: s.severity === 'critical' ? 'critical' : s.severity === 'elevated' ? 'elevated' : 'normal',
                      details: s.details || '',
                      microEvidence: s.microEvidence || '',
                    }))
                  : template.riskScore.breakdown,
              },
            };
          });
          setTransactions(mapped);
        }
      } catch (err) {
        console.error('Failed to sync initial transactions from API:', err);
      }
    };
    fetchLiveTxns();
  }, []);

  // Background Synthetic Transaction Generator when Simulation is ON
  useEffect(() => {
    let interval: any;
    if (isSimulating) {
      interval = setInterval(() => {
        // Randomly generate synthetic live event
        const randomNames = ['Aditya Varma', 'Priya Kulkarni', 'Mohan Das', 'Kavita Menon', 'Rohan Gupta', 'Deepak Joshi'];
        const randomAmount = Math.floor(Math.random() * 250000) + 15000;
        const isHigh = Math.random() > 0.75;
        const isSuspicious = !isHigh && Math.random() > 0.5;

        const newTxn: TransactionRecord = {
          id: `tx-${Date.now()}`,
          transactionRef: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
          timestamp: 'Just now',
          customer: {
            id: `CUST-${Math.floor(100 + Math.random() * 900)}`,
            name: randomNames[Math.floor(Math.random() * randomNames.length)],
            email: 'customer.secure@bank.in',
            avatarBg: isHigh ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300',
            tier: 'Retail',
            accountAgeDays: (Math.floor(Math.random() * 48) + 6) * 30,
          },
          beneficiary: {
            name: 'Instant Remittance Payee',
            bankName: 'Axis Express Net',
            accountNumberMasked: `•••• •••• ${Math.floor(1000 + Math.random() * 9000)}`,
            addedTimestamp: '2 mins ago',
            isNewBeneficiary: true,
          },
          amount: randomAmount,
          currency: 'INR',
          status: isHigh ? 'AUTO_BLOCKED' : 'PENDING_REVIEW',
          riskScore: {
            totalScore: isHigh ? Math.floor(Math.random() * 15) + 85 : isSuspicious ? Math.floor(Math.random() * 20) + 55 : Math.floor(Math.random() * 25) + 10,
            riskLevel: isHigh ? 'high' : isSuspicious ? 'suspicious' : 'low',
            primaryDriver: isHigh ? 'Rapid Rehearsal Transfer & 0.4s Paste' : 'Standard Baseline Transaction',
            fraudGravityScore: isHigh ? 88 : 24,
            confidence: 0.94,
            breakdown: [
              { signalName: 'Keystroke Flight Variance', category: 'behavioral', contribution: isHigh ? 28 : 4, status: isHigh ? 'critical' : 'normal', details: 'Inter-key flight distribution variance', microEvidence: '12ms flight latency' },
              { signalName: 'Precursor Intent Sequence', category: 'rehearsal', contribution: isHigh ? 24 : 3, status: isHigh ? 'critical' : 'normal', details: 'Balance check & rehearsal cancellations', microEvidence: '2 cancel flows in 3m' },
              { signalName: 'Device Collision Network', category: 'device', contribution: isHigh ? 22 : 2, status: isHigh ? 'critical' : 'normal', details: 'Shared canvas fingerprint match', microEvidence: '4 accounts on subnet' },
              { signalName: 'Transaction Sum Ratio', category: 'transaction', contribution: isHigh ? 16 : 3, status: isHigh ? 'elevated' : 'normal', details: 'Transferring 88% of liquid balance', microEvidence: 'Outflow velocity spike' },
            ],
          },
          flaggedReasons: isHigh
            ? [
                'Clipboard paste detected on PAN field with 0.3s dwell time (FD-001)',
                'Customer probed account limits and aborted checkout 2 times within 4 minutes (FD-047)',
                'Device canvas fingerprint collision across 3 previously flagged mule accounts (FD-089)',
              ]
            : ['Normal behavioral biometric parameters within 1-sigma variance'],
          operatorConfidence: isHigh ? 22 : 94,
          deviceCollisionsCount: isHigh ? 3 : 0,
          rehearsalDetected: isHigh,
          fraudGravityVectors: MOCK_TRANSACTIONS[0].fraudGravityVectors,
          precursorTimeline: MOCK_TRANSACTIONS[0].precursorTimeline,
          dnaMutation: MOCK_TRANSACTIONS[0].dnaMutation,
          counterfactuals: MOCK_TRANSACTIONS[0].counterfactuals,
          nextActionPrediction: MOCK_TRANSACTIONS[0].nextActionPrediction,
        };

        setTransactions((prev) => [newTxn, ...prev.slice(0, 49)]); // Keep latest 50 txns
      }, 7000);
    }
    return () => clearInterval(interval);
  }, [isSimulating]);

  const handleTakeAction = async (txnId: string, action: 'QUARANTINE' | 'STEP_UP' | 'APPROVE') => {
    // Update local state immediately for instant UX feedback
    setTransactions((prev) =>
      prev.map((t) => {
        if (t.id === txnId) {
          return {
            ...t,
            status: action === 'QUARANTINE' ? 'BLOCKED' : action === 'STEP_UP' ? 'STEP_UP_CHALLENGED' : 'RESOLVED_CLEAN',
          };
        }
        return t;
      })
    );

    // Sync to backend database API
    try {
      await api.updateTransactionDecision(
        txnId,
        action,
        `Forensic review action [${action}] applied from dossier modal`,
        'Naman Kumar'
      );
    } catch (err) {
      console.warn('Backend decision update note:', err);
    }

    setSelectedTransaction(null);
  };

  const handleResetData = () => {
    setTransactions(MOCK_TRANSACTIONS);
  };

  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={() => setActiveView('overview')} />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f8fafc] dark:bg-[#0c1017] text-slate-900 dark:text-slate-100 font-sans transition-colors">
      {/* Side Navigation Panel (desktop/browser only) */}
      {!isMobile && (
        <Sidebar
          activeView={activeView}
          onNavigate={(view) => setActiveView(view)}
          alertsCount={{ highRiskTxns: transactions.filter((t) => t.riskScore.riskLevel === 'high').length, zeroDays: MOCK_ZERO_DAYS.length }}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
        />
      )}

      {/* Main App Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        {/* Global Top Header */}
        <Header
          activeView={activeView}
          onNavigate={(view) => setActiveView(view)}
          onResetData={handleResetData}
          isSimulating={isSimulating}
          onToggleSimulation={() => setIsSimulating(!isSimulating)}
          investigatorMode={investigatorMode}
          onToggleInvestigatorMode={() => setInvestigatorMode(!investigatorMode)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
          isMobile={isMobile}
        />

        {/* Scrollable View Container */}
        <main className="flex-1 overflow-y-auto custom-scrollbar bg-[#f8fafc] dark:bg-[#0c1017] text-slate-900 dark:text-slate-100 transition-colors">
          {activeView === 'overview' && (
            <DashboardOverview
              transactions={transactions}
              tells={MOCK_TELLS}
              zeroDays={MOCK_ZERO_DAYS}
              onSelectTransaction={(txn) => setSelectedTransaction(txn)}
              onNavigate={(view) => setActiveView(view)}
            />
          )}

          {activeView === 'onboarding_engine' && <BehavioralOnboardingEngine />}

          {activeView === 'live_transactions' && (
            <LiveTransactionStream
              transactions={transactions}
              onSelectTransaction={(txn) => setSelectedTransaction(txn)}
            />
          )}

          {activeView === 'precursor_detector' && <PrecursorDetectorView />}

          {activeView === 'case_management' && <CaseManagementView />}

          {activeView === 'analytics_reports' && <AnalyticsAndReportsView />}

          {activeView === 'dna_mutation' && <BehavioralDnaMutationView />}

          {activeView === 'rehearsal_detector' && <FraudRehearsalDetectorView />}

          {activeView === 'behavioral_tells' && <BehavioralTellsDiscoveryView />}

          {activeView === 'pattern_evolution' && <PatternEvolutionEngineView />}

          {activeView === 'counterfactual_sim' && <CounterfactualSimulatorView />}

          {activeView === 'next_action_prediction' && <NextActionPredictionView />}

          {activeView === 'impersonation_detector' && <ImpersonationDetectorView />}

          {activeView === 'doppelganger_cluster' && <DoppelgangerClusterView />}

          {activeView === 'time_machine' && <BehavioralTimeMachineView />}

          {activeView === 'fraud_gravity' && <FraudGravityEngineView />}

          {activeView === 'dna_library' && <FraudDnaLibraryView />}

          {activeView === 'adversarial_simulator' && <AdversarialRedTeamSimulatorView />}

          {activeView === 'ai_evasion_redteam' && <AIEvasionAnalysisView />}

          {activeView === 'cross_customer_echo' && <CrossCustomerEchoView />}

          {activeView === 'zero_day_radar' && <ZeroDayRadarView />}

          {activeView === 'mutation_tree' && <DnaMutationTreeView />}

          {activeView === 'about_guide' && (
            <AboutAndDocumentationView onNavigate={(view) => setActiveView(view)} />
          )}

          {activeView === 'about_fraudguard' && (
            <AboutFraudGuardView onNavigate={(view) => setActiveView(view)} />
          )}
        </main>
      </div>

      {/* Floating AI Assistant for Simple Q&A and Guidance */}
      <FraudGuardAssistant onNavigate={(view) => setActiveView(view)} />

      {/* Forensic Deep Dive Modal */}
      {selectedTransaction && (
        <TransactionDetailModal
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
          onTakeAction={handleTakeAction}
        />
      )}

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onOpenSettings={() => {
          setIsProfileOpen(false);
          setIsSettingsOpen(true);
        }}
      />

      {/* Settings, Modes & Account Details Modal */}
      <SettingsAndAccountModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onResetSimulationData={handleResetData}
      />
    </div>
  );
}

export default App;
