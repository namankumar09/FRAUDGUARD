import {
  TransactionRecord,
  FraudTell,
  FraudPatternEvolutionWeek,
  BehavioralCluster,
  BehavioralTimeMachinePoint,
  AdversarialSimulationRound,
  DnaTreeNode,
  ZeroDayIncident,
  CrossCustomerEchoEvent,
  MutationTreeNode,
  FraudDnaSignature,
} from '../types/fraud';

export const MOCK_TRANSACTIONS: TransactionRecord[] = [
  {
    id: 'tx-94210',
    transactionRef: 'TXN-94210',
    sessionCode: 'TXN-94210',
    time: '06:57',
    channel: 'UPI payment',
    accountMasked: 'Savings ...4182',
    deviceName: 'Xiaomi Redmi Note 13 Android 14',
    ipAddress: '103.21.58.12',
    timestamp: '06:57 AM',
    customer: {
      id: 'cust-94210',
      name: 'Dev Verma',
      email: 'dev.verma@finmail.in',
      accountAgeDays: 620,
      tier: 'HNI',
      avatarBg: 'bg-rose-950 text-rose-300 border border-rose-500/30',
    },
    beneficiary: {
      name: 'Apex FastLogistics Services',
      accountNumberMasked: '•••• •••• 9924',
      bankName: 'IndusInd Bank',
      addedTimestamp: '2 mins ago (06:55:02)',
      isNewBeneficiary: true,
    },
    amount: 745000,
    currency: 'INR',
    riskScore: {
      totalScore: 95,
      riskLevel: 'high',
      fraudGravityScore: 96,
      primaryDriver: 'Pasted Address in 0.4s + Rehearsal Sequence + Biometric Drift',
      confidence: 0.98,
      breakdown: [
        {
          signalName: 'Device anomaly',
          category: 'device',
          contribution: 28,
          status: 'critical',
          details: 'Device fingerprint collision detected across 3 distinct dormant accounts within 48 hrs.',
          microEvidence: 'Canvas Hash #9a88f1 and WebGL renderer matched flagged bot subnet 103.21.x.x.'
        },
        {
          signalName: 'Typing cadence divergence',
          category: 'behavioral',
          contribution: 24,
          status: 'critical',
          details: 'Typing cadence accelerated by 4.8σ with zero hesitation before transfer click.',
          microEvidence: 'Flight time dropped from 180ms to 24ms; no backspaces in complex beneficiary IFSC code.'
        },
        {
          signalName: 'Rehearsal loop',
          category: 'rehearsal',
          contribution: 18,
          status: 'critical',
          details: 'User aborted transfer 2 times and checked limits before finalizing ₹7.45L transfer.',
          microEvidence: 'Attempted ₹50k (cancelled) -> checked daily limit ₹10L -> staged ₹7.45L.'
        },
        {
          signalName: 'Interaction latency',
          category: 'interaction',
          contribution: 15,
          status: 'elevated',
          details: 'Entire 65-character residential address pasted in 0.41 seconds.',
          microEvidence: 'Zero keyup events recorded; immediate cursor hop to OTP submission input.'
        },
        {
          signalName: 'Network contagion',
          category: 'network',
          contribution: 10,
          status: 'elevated',
          details: 'Beneficiary bank branch linked to 4 mule accounts flagged in Mumbai cluster.',
          microEvidence: 'Mule routing similarity 89%.'
        }
      ]
    },
    operatorConfidence: 12,
    rehearsalDetected: true,
    discoveredTellCode: 'FD-047',
    deviceCollisionsCount: 3,
    status: 'AUTO_BLOCKED',
    flaggedReasons: [
      'Transaction limit probed (balance checked immediately before high-value transfer)',
      'Typing cadence divergence (+4.8σ from customer baseline — key hold time 28ms vs 92ms typical)',
      'Session started at 03:14 — outside the customer\'s 08:00–22:00 normal window',
      'Address pasted in 0.4s — the customer has 100% manual typing history'
    ],
    fraudGravityVectors: [
      { name: 'Rehearsal Loop', weight: 32, vectorDirection: 'inward' },
      { name: 'Keystroke Mutation', weight: 26, vectorDirection: 'inward' },
      { name: 'Device Collision', weight: 22, vectorDirection: 'inward' },
      { name: 'Clipboard Speed', weight: 12, vectorDirection: 'inward' },
      { name: 'Off-Peak Time', weight: 8, vectorDirection: 'inward' }
    ],
    precursorTimeline: [
      { id: 'p1', actionSequence: 1, actionType: 'AUTH_LOGIN', targetElement: 'Biometric/Password Gate', timestampOffsetSec: -42, durationMs: 920, anomalyScore: 12, isFlaggedPrecursor: false, behaviorNote: 'Login from new browser user-agent' },
      { id: 'p2', actionSequence: 2, actionType: 'VIEW_BALANCE', targetElement: 'Dashboard Account Card', timestampOffsetSec: -38, durationMs: 410, anomalyScore: 28, isFlaggedPrecursor: false, behaviorNote: 'Rapid glance without scrolling transaction history' },
      { id: 'p3', actionSequence: 3, actionType: 'OPEN_BENEFICIARY', targetElement: 'Add Beneficiary Modal', timestampOffsetSec: -32, durationMs: 1400, anomalyScore: 45, isFlaggedPrecursor: true, behaviorNote: 'Instant paste of IFSC code and account number' },
      { id: 'p4', actionSequence: 4, actionType: 'CANCEL_TRANSFER', targetElement: 'Transfer Dialog', timestampOffsetSec: -25, durationMs: 310, anomalyScore: 68, isFlaggedPrecursor: true, behaviorNote: 'Rehearsal Step 1: Aborted ₹50,000 trial test' },
      { id: 'p5', actionSequence: 5, actionType: 'CHECK_LIMIT', targetElement: 'Account Limits & Tier Drawer', timestampOffsetSec: -19, durationMs: 890, anomalyScore: 82, isFlaggedPrecursor: true, behaviorNote: 'Probing upper limit boundary (₹10,00,000 threshold)' },
      { id: 'p6', actionSequence: 6, actionType: 'PASTE_DETAILS', targetElement: 'Amount & Remarks Input', timestampOffsetSec: -11, durationMs: 390, anomalyScore: 91, isFlaggedPrecursor: true, behaviorNote: 'Clipboard paste latency 0.39s (Bot/Script cadence)' },
      { id: 'p7', actionSequence: 7, actionType: 'EXECUTE_TRANSFER', targetElement: 'Confirm Transfer Button', timestampOffsetSec: 0, durationMs: 180, anomalyScore: 96, isFlaggedPrecursor: true, behaviorNote: 'Confirmation click with zero cursor hesitation' }
    ],
    dnaMutation: {
      overallMutationPercent: 78,
      ownerBaselineDna: {
        typingRhythmScore: 84,
        navigationStyle: 'direct',
        averageHesitationSec: 3.4,
        transactionSequencePredictability: 92,
        fieldTraversalOrder: ['Name', 'Account', 'Confirm', 'Amount', 'OTP'],
        clipboardPasteAffinity: 8,
        interactionDensity: 42,
        rehearsalTendency: 4
      },
      currentSessionDna: {
        typingRhythmScore: 19,
        navigationStyle: 'fragmented',
        averageHesitationSec: 0.38,
        transactionSequencePredictability: 28,
        fieldTraversalOrder: ['Amount', 'Beneficiary', 'Limit', 'Cancel', 'Confirm'],
        clipboardPasteAffinity: 94,
        interactionDensity: 91,
        rehearsalTendency: 88
      },
      keyDivergences: [
        { metric: 'Typing Flight Time Variance', historical: '185 ms', current: '22 ms', deviation: 88, unit: 'ms' },
        { metric: 'Average Decision Hesitation', historical: '3.4 sec', current: '0.38 sec', deviation: 89, unit: 's' },
        { metric: 'Clipboard Paste Volume', historical: '8%', current: '94%', deviation: 86, unit: '%' },
        { metric: 'Navigation Trajectory Entropy', historical: '0.14', current: '0.89', deviation: 75, unit: 'entropy' },
        { metric: 'Form Revisit Frequency', historical: '0.2 / session', current: '4.0 / session', deviation: 95, unit: 'count' }
      ]
    },
    counterfactuals: [
      {
        decision: 'approve',
        label: 'If Approved (No Intervention)',
        estimatedDownstreamExposure: 745000,
        riskReductionPercent: 0,
        predictedFraudProbability: 95,
        customerFrictionScore: 0,
        predictedNetworkContagionAccounts: 4,
        explanation: 'Funds will instantly route through 3 nested mule accounts in 45 seconds; estimated net recovery rate <3%.'
      },
      {
        decision: 'step_up_mfa',
        label: 'If Step-Up Video Biometric Challenge',
        estimatedDownstreamExposure: 78000,
        riskReductionPercent: 71,
        predictedFraudProbability: 23,
        customerFrictionScore: 35,
        predictedNetworkContagionAccounts: 1,
        explanation: 'Forces synchronous liveness check. Fraudster bot or credential purchaser drops session in 92% of historical cases.'
      },
      {
        decision: 'soft_delay',
        label: 'If 4-Hour Behavioral Cooling Delay',
        estimatedDownstreamExposure: 42000,
        riskReductionPercent: 84,
        predictedFraudProbability: 11,
        customerFrictionScore: 18,
        predictedNetworkContagionAccounts: 0,
        explanation: 'Notifies genuine owner on verified secondary device while holding funds in escrow.'
      },
      {
        decision: 'block',
        label: 'If Immediate Hard Block & Account Quarantine',
        estimatedDownstreamExposure: 0,
        riskReductionPercent: 96,
        predictedFraudProbability: 4,
        customerFrictionScore: 65,
        predictedNetworkContagionAccounts: 0,
        explanation: 'Zero financial loss exposure. Triggers automated security desk outreach to genuine owner.'
      }
    ],
    nextActionPrediction: {
      currentStage: 'Pre-Transfer Execution',
      predictedAction: 'High-Velocity Secondary Outward Wire to Mule #4',
      probability: 91,
      probabilityPercent: 91,
      projectedTimeWindowSec: 35,
      preemptiveRiskLevel: 'high',
      preemptiveInterventionSuggested: 'Preemptively freeze tokenized UPI/IMPS rail for this session ID before secondary transaction queue dispatch.',
      supportingSignals: [
        'Checked transaction limits immediately prior to amount entry',
        'Beneficiary creation timestamp is less than 180 seconds old',
        'Simultaneous background session ping on IP 103.21.x.x'
      ]
    }
  },
  {
    id: 'tx-94395',
    transactionRef: 'TXN-94395',
    sessionCode: 'TXN-94395',
    time: '15:47',
    channel: 'IMPS transfer',
    accountMasked: 'Current ...8921',
    deviceName: 'OnePlus 11 5G Android 14',
    ipAddress: '49.36.112.44',
    timestamp: '15:47 PM',
    customer: {
      id: 'cust-94395',
      name: 'Diya Joshi',
      email: 'diya.joshi@techcorp.in',
      accountAgeDays: 410,
      tier: 'Retail',
      avatarBg: 'bg-rose-950 text-rose-300 border border-rose-500/30',
    },
    beneficiary: {
      name: 'Delta Horizon Ventures',
      accountNumberMasked: '•••• •••• 1109',
      bankName: 'HDFC Bank',
      addedTimestamp: '5 mins ago',
      isNewBeneficiary: true,
    },
    amount: 320000,
    currency: 'INR',
    riskScore: {
      totalScore: 92,
      riskLevel: 'high',
      fraudGravityScore: 94,
      primaryDriver: 'Circadian Timing Anomaly + Key Hold Variance',
      confidence: 0.96,
      breakdown: [
        { signalName: 'Device anomaly', category: 'device', contribution: 26, status: 'critical', details: 'Rooted emulator signature detected.', microEvidence: 'QEMU virtual driver hooks present.' },
        { signalName: 'Typing cadence divergence', category: 'behavioral', contribution: 22, status: 'critical', details: 'Dwell time dropped to 14ms flat (bot replay).', microEvidence: 'Synthetic timing distribution std dev <1ms.' },
        { signalName: 'Rehearsal loop', category: 'rehearsal', contribution: 18, status: 'critical', details: 'Multiple rapid preview-cancel loops.', microEvidence: '3 cancellations within 60s.' },
        { signalName: 'Interaction latency', category: 'interaction', contribution: 14, status: 'elevated', details: 'Rapid straight-line cursor vector.', microEvidence: 'Zero curve jitter.' },
        { signalName: 'Network contagion', category: 'network', contribution: 12, status: 'elevated', details: 'Shared subnet with flagged mule node.', microEvidence: 'ASN 55836.' }
      ]
    },
    operatorConfidence: 18,
    rehearsalDetected: true,
    discoveredTellCode: 'FD-042',
    deviceCollisionsCount: 2,
    status: 'AUTO_BLOCKED',
    flaggedReasons: [
      'Rooted emulator signature detected during IMPS dispatch',
      'Synthetic typing cadence with standard deviation under 1.2ms',
      'Non-linear rehearsal pattern before staging transfer amount'
    ],
    fraudGravityVectors: [
      { name: 'Emulator Hook', weight: 30, vectorDirection: 'inward' },
      { name: 'Synthetic Cadence', weight: 28, vectorDirection: 'inward' },
      { name: 'Precursor Loop', weight: 20, vectorDirection: 'inward' }
    ],
    precursorTimeline: [],
    dnaMutation: {
      overallMutationPercent: 74,
      ownerBaselineDna: { typingRhythmScore: 88, navigationStyle: 'direct', averageHesitationSec: 2.9, transactionSequencePredictability: 90, fieldTraversalOrder: [], clipboardPasteAffinity: 5, interactionDensity: 30, rehearsalTendency: 2 },
      currentSessionDna: { typingRhythmScore: 12, navigationStyle: 'scripted', averageHesitationSec: 0.1, transactionSequencePredictability: 10, fieldTraversalOrder: [], clipboardPasteAffinity: 98, interactionDensity: 96, rehearsalTendency: 92 },
      keyDivergences: []
    },
    counterfactuals: [],
    nextActionPrediction: { currentStage: 'IMPS Stage', predictedAction: 'Mule Split Transfer', probability: 88, projectedTimeWindowSec: 20, preemptiveRiskLevel: 'high', preemptiveInterventionSuggested: 'Hold funds', supportingSignals: [] }
  },
  {
    id: 'tx-95653',
    transactionRef: 'TXN-95653',
    sessionCode: 'TXN-95653',
    time: '01:15',
    channel: 'Loan prepay',
    accountMasked: 'Loan ...7712',
    deviceName: 'Apple iPhone 15 Pro iOS 17.5',
    ipAddress: '182.73.4.19',
    timestamp: '01:15 AM',
    customer: {
      id: 'cust-95653',
      name: 'Riya Joshi',
      email: 'riya.j@consult.org',
      accountAgeDays: 910,
      tier: 'Corporate',
      avatarBg: 'bg-rose-950 text-rose-300 border border-rose-500/30',
    },
    beneficiary: {
      name: 'Early Closure Settlement Escrow',
      accountNumberMasked: '•••• •••• 8841',
      bankName: 'Axis Bank',
      addedTimestamp: '10 mins ago',
      isNewBeneficiary: true,
    },
    amount: 910000,
    currency: 'INR',
    riskScore: {
      totalScore: 90,
      riskLevel: 'high',
      fraudGravityScore: 91,
      primaryDriver: 'Night-time loan prepay bypass attempt',
      confidence: 0.94,
      breakdown: [
        { signalName: 'Device anomaly', category: 'device', contribution: 24, status: 'critical', details: 'Device switch coupled with proxy IP.', microEvidence: 'VPN endpoint detected.' },
        { signalName: 'Typing cadence divergence', category: 'behavioral', contribution: 22, status: 'critical', details: 'Pasted PIN and credentials.', microEvidence: '0ms key flight.' },
        { signalName: 'Rehearsal loop', category: 'rehearsal', contribution: 18, status: 'critical', details: 'Probed loan payoff figures 4 times.', microEvidence: 'Balance query repetition.' },
        { signalName: 'Interaction latency', category: 'interaction', contribution: 14, status: 'elevated', details: 'Zero hesitation on ₹9.1L transfer.', microEvidence: 'Instant click.' },
        { signalName: 'Network contagion', category: 'network', contribution: 12, status: 'elevated', details: 'Beneficiary linked to known laundering ring.', microEvidence: 'High risk entity.' }
      ]
    },
    operatorConfidence: 22,
    rehearsalDetected: true,
    status: 'AUTO_BLOCKED',
    flaggedReasons: ['Night-time loan prepay attempt with pasted security credentials', 'Rapid limit probing during low-traffic window'],
    fraudGravityVectors: [],
    precursorTimeline: [],
    dnaMutation: { overallMutationPercent: 82, ownerBaselineDna: { typingRhythmScore: 80, navigationStyle: 'direct', averageHesitationSec: 3.1, transactionSequencePredictability: 85, fieldTraversalOrder: [], clipboardPasteAffinity: 10, interactionDensity: 35, rehearsalTendency: 5 }, currentSessionDna: { typingRhythmScore: 20, navigationStyle: 'scripted', averageHesitationSec: 0.2, transactionSequencePredictability: 20, fieldTraversalOrder: [], clipboardPasteAffinity: 95, interactionDensity: 90, rehearsalTendency: 85 }, keyDivergences: [] },
    counterfactuals: [],
    nextActionPrediction: { currentStage: 'Prepay Finalization', predictedAction: 'Secondary Loan Drawdown', probability: 89, projectedTimeWindowSec: 30, preemptiveRiskLevel: 'high', preemptiveInterventionSuggested: 'Freeze account', supportingSignals: [] }
  },
  {
    id: 'tx-94432',
    transactionRef: 'TXN-94432',
    sessionCode: 'TXN-94432',
    time: '09:30',
    channel: 'Loan prepay',
    accountMasked: 'Savings ...3301',
    deviceName: 'Samsung Galaxy S24 Ultra',
    ipAddress: '115.96.201.88',
    timestamp: '09:30 AM',
    customer: {
      id: 'cust-94432',
      name: 'Kabir Sethi',
      email: 'kabir.sethi@ventures.co',
      accountAgeDays: 520,
      tier: 'Retail',
      avatarBg: 'bg-rose-950 text-rose-300 border border-rose-500/30',
    },
    beneficiary: {
      name: 'QuickPay Lending Settlement',
      accountNumberMasked: '•••• •••• 9912',
      bankName: 'ICICI Bank',
      addedTimestamp: '1 min ago',
      isNewBeneficiary: true,
    },
    amount: 82540,
    currency: 'INR',
    riskScore: {
      totalScore: 88,
      riskLevel: 'high',
      fraudGravityScore: 89,
      primaryDriver: 'Keystroke velocity mutation + rehearsal loop',
      confidence: 0.93,
      breakdown: [
        { signalName: 'Device anomaly', category: 'device', contribution: 22, status: 'critical', details: 'Unrecognized user agent signature.', microEvidence: 'OS mismatch.' },
        { signalName: 'Typing cadence divergence', category: 'behavioral', contribution: 24, status: 'critical', details: 'Keystroke flight time dropped by 80%.', microEvidence: 'High speed.' },
        { signalName: 'Rehearsal loop', category: 'rehearsal', contribution: 18, status: 'critical', details: 'Two trial transfers aborted.', microEvidence: 'Cancelled ₹10k, ₹25k.' },
        { signalName: 'Interaction latency', category: 'interaction', contribution: 14, status: 'elevated', details: 'Swift copy-paste sequence.', microEvidence: '0.4s paste.' },
        { signalName: 'Network contagion', category: 'network', contribution: 10, status: 'elevated', details: 'Subnet risk score 78.', microEvidence: 'Contagion link.' }
      ]
    },
    operatorConfidence: 25,
    rehearsalDetected: true,
    status: 'AUTO_BLOCKED',
    flaggedReasons: ['Aborted trial transactions followed by full prepayment staging', 'Drastic keystroke flight time reduction'],
    fraudGravityVectors: [],
    precursorTimeline: [],
    dnaMutation: { overallMutationPercent: 79, ownerBaselineDna: { typingRhythmScore: 85, navigationStyle: 'direct', averageHesitationSec: 3.5, transactionSequencePredictability: 90, fieldTraversalOrder: [], clipboardPasteAffinity: 8, interactionDensity: 40, rehearsalTendency: 4 }, currentSessionDna: { typingRhythmScore: 18, navigationStyle: 'fragmented', averageHesitationSec: 0.4, transactionSequencePredictability: 25, fieldTraversalOrder: [], clipboardPasteAffinity: 92, interactionDensity: 88, rehearsalTendency: 84 }, keyDivergences: [] },
    counterfactuals: [],
    nextActionPrediction: { currentStage: 'Execution Stage', predictedAction: 'Outward IMPS Transfer', probability: 87, projectedTimeWindowSec: 25, preemptiveRiskLevel: 'high', preemptiveInterventionSuggested: 'Hold payment', supportingSignals: [] }
  },
  {
    id: 'tx-94247',
    transactionRef: 'TXN-94247',
    sessionCode: 'TXN-94247',
    time: '09:39',
    channel: 'Branch tablet',
    accountMasked: 'Retail ...5519',
    deviceName: 'Samsung Tab S9 Enterprise',
    ipAddress: '14.139.60.22',
    timestamp: '09:39 AM',
    customer: {
      id: 'cust-94247',
      name: 'Nisha Dutta',
      email: 'nisha.dutta@lawfirm.in',
      accountAgeDays: 780,
      tier: 'Retail',
      avatarBg: 'bg-rose-950 text-rose-300 border border-rose-500/30',
    },
    beneficiary: {
      name: 'Apex Merchant Hub',
      accountNumberMasked: '•••• •••• 4490',
      bankName: 'Kotak Mahindra Bank',
      addedTimestamp: '3 mins ago',
      isNewBeneficiary: true,
    },
    amount: 210000,
    currency: 'INR',
    riskScore: {
      totalScore: 86,
      riskLevel: 'high',
      fraudGravityScore: 87,
      primaryDriver: 'Branch tablet operator velocity mismatch',
      confidence: 0.92,
      breakdown: [
        { signalName: 'Device anomaly', category: 'device', contribution: 20, status: 'critical', details: 'Branch device session hijacking indicator.', microEvidence: 'Concurrent remote session.' },
        { signalName: 'Typing cadence divergence', category: 'behavioral', contribution: 22, status: 'critical', details: 'Touch pressure and cadence abnormal.', microEvidence: 'Stylus script anomaly.' },
        { signalName: 'Rehearsal loop', category: 'rehearsal', contribution: 18, status: 'critical', details: 'Staged amount modified 3 times.', microEvidence: 'Fluctuating value.' },
        { signalName: 'Interaction latency', category: 'interaction', contribution: 14, status: 'elevated', details: 'Zero hesitation between screens.', microEvidence: 'High speed.' },
        { signalName: 'Network contagion', category: 'network', contribution: 12, status: 'elevated', details: 'Flagged beneficiary network.', microEvidence: 'Cluster node.' }
      ]
    },
    operatorConfidence: 28,
    rehearsalDetected: true,
    status: 'AUTO_BLOCKED',
    flaggedReasons: ['Branch tablet interaction signature indicates automated script injection', 'Rapid modification of staging parameters'],
    fraudGravityVectors: [],
    precursorTimeline: [],
    dnaMutation: { overallMutationPercent: 76, ownerBaselineDna: { typingRhythmScore: 82, navigationStyle: 'direct', averageHesitationSec: 3.2, transactionSequencePredictability: 88, fieldTraversalOrder: [], clipboardPasteAffinity: 6, interactionDensity: 38, rehearsalTendency: 3 }, currentSessionDna: { typingRhythmScore: 22, navigationStyle: 'erratic', averageHesitationSec: 0.5, transactionSequencePredictability: 30, fieldTraversalOrder: [], clipboardPasteAffinity: 88, interactionDensity: 82, rehearsalTendency: 80 }, keyDivergences: [] },
    counterfactuals: [],
    nextActionPrediction: { currentStage: 'Staging Stage', predictedAction: 'Secondary Wire Dispatch', probability: 85, projectedTimeWindowSec: 40, preemptiveRiskLevel: 'high', preemptiveInterventionSuggested: 'Trigger OTP challenge', supportingSignals: [] }
  },
  {
    id: 'tx-95135',
    transactionRef: 'TXN-95135',
    sessionCode: 'TXN-95135',
    time: '04:49',
    channel: 'NEFT transfer',
    accountMasked: 'Savings ...8190',
    deviceName: 'Vivo X90 Pro Android 14',
    ipAddress: '106.195.42.11',
    timestamp: '04:49 AM',
    customer: {
      id: 'cust-95135',
      name: 'Vikram Verma',
      email: 'vikram.verma@consult.in',
      accountAgeDays: 450,
      tier: 'Retail',
      avatarBg: 'bg-rose-950 text-rose-300 border border-rose-500/30',
    },
    beneficiary: {
      name: 'Nexus Alpha Remittance',
      accountNumberMasked: '•••• •••• 3318',
      bankName: 'State Bank of India',
      addedTimestamp: '15 mins ago',
      isNewBeneficiary: true,
    },
    amount: 185000,
    currency: 'INR',
    riskScore: {
      totalScore: 84,
      riskLevel: 'high',
      fraudGravityScore: 85,
      primaryDriver: 'Early morning NEFT batch anomaly + clipboard paste',
      confidence: 0.91,
      breakdown: [
        { signalName: 'Device anomaly', category: 'device', contribution: 20, status: 'critical', details: 'Location spoofing mock GPS active.', microEvidence: 'Mock coordinates.' },
        { signalName: 'Typing cadence divergence', category: 'behavioral', contribution: 20, status: 'critical', details: 'Cadence variance spiked +3.6σ.', microEvidence: 'Erratic timing.' },
        { signalName: 'Rehearsal loop', category: 'rehearsal', contribution: 16, status: 'critical', details: 'Limit query 30s prior.', microEvidence: 'Probed max NEFT.' },
        { signalName: 'Interaction latency', category: 'interaction', contribution: 16, status: 'elevated', details: 'Pasted IFSC and Account in 0.3s.', microEvidence: 'Bulk paste.' },
        { signalName: 'Network contagion', category: 'network', contribution: 12, status: 'elevated', details: 'Mule receiver node link.', microEvidence: 'Cluster #7.' }
      ]
    },
    operatorConfidence: 30,
    rehearsalDetected: true,
    status: 'AUTO_BLOCKED',
    flaggedReasons: ['Mock GPS active on device', 'Bulk pasted IFSC and account details in 0.3s'],
    fraudGravityVectors: [],
    precursorTimeline: [],
    dnaMutation: { overallMutationPercent: 75, ownerBaselineDna: { typingRhythmScore: 80, navigationStyle: 'direct', averageHesitationSec: 3.0, transactionSequencePredictability: 86, fieldTraversalOrder: [], clipboardPasteAffinity: 12, interactionDensity: 40, rehearsalTendency: 4 }, currentSessionDna: { typingRhythmScore: 25, navigationStyle: 'fragmented', averageHesitationSec: 0.6, transactionSequencePredictability: 35, fieldTraversalOrder: [], clipboardPasteAffinity: 90, interactionDensity: 80, rehearsalTendency: 78 }, keyDivergences: [] },
    counterfactuals: [],
    nextActionPrediction: { currentStage: 'Pre-Authorization', predictedAction: 'IMPS Burst Dispatch', probability: 84, projectedTimeWindowSec: 35, preemptiveRiskLevel: 'high', preemptiveInterventionSuggested: 'Hold session', supportingSignals: [] }
  },
  {
    id: 'tx-95505',
    transactionRef: 'TXN-95505',
    sessionCode: 'TXN-95505',
    time: '22:03',
    channel: 'IMPS transfer',
    accountMasked: 'Savings ...1102',
    deviceName: 'Google Pixel 8 Pro',
    ipAddress: '157.34.88.92',
    timestamp: '22:03 PM',
    customer: {
      id: 'cust-95505',
      name: 'Diya Dutta',
      email: 'diya.dutta@capital.in',
      accountAgeDays: 680,
      tier: 'HNI',
      avatarBg: 'bg-rose-950 text-rose-300 border border-rose-500/30',
    },
    beneficiary: {
      name: 'Zenith Global Exchange',
      accountNumberMasked: '•••• •••• 7721',
      bankName: 'Canara Bank',
      addedTimestamp: '4 mins ago',
      isNewBeneficiary: true,
    },
    amount: 440000,
    currency: 'INR',
    riskScore: {
      totalScore: 82,
      riskLevel: 'high',
      fraudGravityScore: 83,
      primaryDriver: 'Circadian shift + Rapid clipboard paste',
      confidence: 0.90,
      breakdown: [
        { signalName: 'Device anomaly', category: 'device', contribution: 18, status: 'critical', details: 'New device hardware fingerprint.', microEvidence: 'Unrecognized canvas.' },
        { signalName: 'Typing cadence divergence', category: 'behavioral', contribution: 22, status: 'critical', details: 'Flight time 18ms vs 120ms baseline.', microEvidence: 'High speed.' },
        { signalName: 'Rehearsal loop', category: 'rehearsal', contribution: 16, status: 'critical', details: 'Two failed OTP attempts before retry.', microEvidence: 'Rehearsed OTP.' },
        { signalName: 'Interaction latency', category: 'interaction', contribution: 14, status: 'elevated', details: 'Zero pause before clicking confirm.', microEvidence: 'Instant click.' },
        { signalName: 'Network contagion', category: 'network', contribution: 12, status: 'elevated', details: 'Beneficiary linked to 2 mule accounts.', microEvidence: 'Mule routing.' }
      ]
    },
    operatorConfidence: 32,
    rehearsalDetected: true,
    status: 'AUTO_BLOCKED',
    flaggedReasons: ['New device hardware fingerprint with zero prior history', 'Rehearsed OTP entry with rapid clipboard paste'],
    fraudGravityVectors: [],
    precursorTimeline: [],
    dnaMutation: { overallMutationPercent: 73, ownerBaselineDna: { typingRhythmScore: 84, navigationStyle: 'direct', averageHesitationSec: 3.3, transactionSequencePredictability: 89, fieldTraversalOrder: [], clipboardPasteAffinity: 10, interactionDensity: 42, rehearsalTendency: 5 }, currentSessionDna: { typingRhythmScore: 28, navigationStyle: 'fragmented', averageHesitationSec: 0.7, transactionSequencePredictability: 40, fieldTraversalOrder: [], clipboardPasteAffinity: 86, interactionDensity: 78, rehearsalTendency: 75 }, keyDivergences: [] },
    counterfactuals: [],
    nextActionPrediction: { currentStage: 'IMPS Finalize', predictedAction: 'Beneficiary Account Flush', probability: 82, projectedTimeWindowSec: 45, preemptiveRiskLevel: 'high', preemptiveInterventionSuggested: 'Step-up verification', supportingSignals: [] }
  },
  {
    id: 'tx-95690',
    transactionRef: 'TXN-95690',
    sessionCode: 'TXN-95690',
    time: '13:00',
    channel: 'UPI payment',
    accountMasked: 'Savings ...4918',
    deviceName: 'Realme GT 5 Pro',
    ipAddress: '122.161.70.35',
    timestamp: '13:00 PM',
    customer: {
      id: 'cust-95690',
      name: 'Tara Iyer',
      email: 'tara.iyer@finanalytics.com',
      accountAgeDays: 590,
      tier: 'Retail',
      avatarBg: 'bg-rose-950 text-rose-300 border border-rose-500/30',
    },
    beneficiary: {
      name: 'QuickMule P2P Collector',
      accountNumberMasked: '•••• •••• 6632',
      bankName: 'Paytm Payments Bank',
      addedTimestamp: '1 min ago',
      isNewBeneficiary: true,
    },
    amount: 97000,
    currency: 'INR',
    riskScore: {
      totalScore: 80,
      riskLevel: 'high',
      fraudGravityScore: 81,
      primaryDriver: 'High-frequency UPI burst + typing acceleration',
      confidence: 0.89,
      breakdown: [
        { signalName: 'Device anomaly', category: 'device', contribution: 18, status: 'critical', details: 'Multiple accounts logged in on single device.', microEvidence: 'App clone detected.' },
        { signalName: 'Typing cadence divergence', category: 'behavioral', contribution: 20, status: 'critical', details: 'Cadence variance +3.2σ.', microEvidence: 'Speed typing.' },
        { signalName: 'Rehearsal loop', category: 'rehearsal', contribution: 16, status: 'critical', details: 'Limit checked immediately before dispatch.', microEvidence: 'Probed UPI limit.' },
        { signalName: 'Interaction latency', category: 'interaction', contribution: 14, status: 'elevated', details: 'Pasted VPA handle in 0.2s.', microEvidence: 'Instant VPA.' },
        { signalName: 'Network contagion', category: 'network', contribution: 12, status: 'elevated', details: 'Paytm mule wallet node.', microEvidence: 'Flagged wallet.' }
      ]
    },
    operatorConfidence: 35,
    rehearsalDetected: true,
    status: 'AUTO_BLOCKED',
    flaggedReasons: ['App clone detected with multiple parallel account logins', 'Instant VPA paste and rapid limit probing'],
    fraudGravityVectors: [],
    precursorTimeline: [],
    dnaMutation: { overallMutationPercent: 70, ownerBaselineDna: { typingRhythmScore: 81, navigationStyle: 'direct', averageHesitationSec: 3.1, transactionSequencePredictability: 87, fieldTraversalOrder: [], clipboardPasteAffinity: 9, interactionDensity: 39, rehearsalTendency: 4 }, currentSessionDna: { typingRhythmScore: 30, navigationStyle: 'fragmented', averageHesitationSec: 0.8, transactionSequencePredictability: 42, fieldTraversalOrder: [], clipboardPasteAffinity: 84, interactionDensity: 75, rehearsalTendency: 72 }, keyDivergences: [] },
    counterfactuals: [],
    nextActionPrediction: { currentStage: 'UPI Broadcast', predictedAction: 'Sub-limit UPI Micro-Transactions', probability: 81, projectedTimeWindowSec: 20, preemptiveRiskLevel: 'high', preemptiveInterventionSuggested: 'Freeze UPI handle', supportingSignals: [] }
  },
  {
    id: 'tx-95098',
    transactionRef: 'TXN-95098',
    sessionCode: 'TXN-95098',
    time: '05:30',
    channel: 'UPI',
    accountMasked: 'Savings ...8812',
    deviceName: 'Samsung Galaxy A54',
    ipAddress: '103.241.12.9',
    timestamp: '05:30 AM',
    customer: { id: 'cust-95098', name: 'Sana Reddy', email: 'sana.r@design.co', accountAgeDays: 310, tier: 'Retail', avatarBg: 'bg-rose-950 text-rose-300 border border-rose-500/30' },
    beneficiary: { name: 'Mule Merchant Node', accountNumberMasked: '•••• •••• 1092', bankName: 'Federal Bank', addedTimestamp: '10 mins ago', isNewBeneficiary: true },
    amount: 275000,
    currency: 'INR',
    riskScore: { totalScore: 79, riskLevel: 'high', fraudGravityScore: 80, primaryDriver: 'Circadian shift + Paste velocity', confidence: 0.88, breakdown: [] },
    operatorConfidence: 38,
    rehearsalDetected: true,
    status: 'AUTO_BLOCKED',
    flaggedReasons: ['Session active at 05:30 outside regular profile'],
    fraudGravityVectors: [],
    precursorTimeline: [],
    dnaMutation: { overallMutationPercent: 68, ownerBaselineDna: { typingRhythmScore: 80, navigationStyle: 'direct', averageHesitationSec: 3.0, transactionSequencePredictability: 85, fieldTraversalOrder: [], clipboardPasteAffinity: 10, interactionDensity: 40, rehearsalTendency: 5 }, currentSessionDna: { typingRhythmScore: 35, navigationStyle: 'fragmented', averageHesitationSec: 0.9, transactionSequencePredictability: 45, fieldTraversalOrder: [], clipboardPasteAffinity: 80, interactionDensity: 70, rehearsalTendency: 68 }, keyDivergences: [] },
    counterfactuals: [],
    nextActionPrediction: { currentStage: 'UPI Execution', predictedAction: 'Repeat Transfer', probability: 79, projectedTimeWindowSec: 30, preemptiveRiskLevel: 'high', preemptiveInterventionSuggested: 'Trigger 2FA', supportingSignals: [] }
  },
  {
    id: 'tx-95394',
    transactionRef: 'TXN-95394',
    sessionCode: 'TXN-95394',
    time: '14:25',
    channel: 'Branch tablet',
    accountMasked: 'Corporate ...2930',
    deviceName: 'Lenovo Tab P12 Pro',
    ipAddress: '115.112.44.18',
    timestamp: '14:25 PM',
    customer: { id: 'cust-95394', name: 'Kabir Reddy', email: 'kabir.reddy@infra.in', accountAgeDays: 820, tier: 'Corporate', avatarBg: 'bg-rose-950 text-rose-300 border border-rose-500/30' },
    beneficiary: { name: 'Kisan Global Supply', accountNumberMasked: '•••• •••• 9918', bankName: 'Bank of Baroda', addedTimestamp: '15 mins ago', isNewBeneficiary: true },
    amount: 650000,
    currency: 'INR',
    riskScore: { totalScore: 78, riskLevel: 'high', fraudGravityScore: 79, primaryDriver: 'Device interaction divergence', confidence: 0.87, breakdown: [] },
    operatorConfidence: 40,
    rehearsalDetected: true,
    status: 'AUTO_BLOCKED',
    flaggedReasons: ['Branch tablet touch pattern deviation'],
    fraudGravityVectors: [],
    precursorTimeline: [],
    dnaMutation: { overallMutationPercent: 66, ownerBaselineDna: { typingRhythmScore: 82, navigationStyle: 'direct', averageHesitationSec: 3.2, transactionSequencePredictability: 88, fieldTraversalOrder: [], clipboardPasteAffinity: 8, interactionDensity: 38, rehearsalTendency: 4 }, currentSessionDna: { typingRhythmScore: 38, navigationStyle: 'erratic', averageHesitationSec: 1.0, transactionSequencePredictability: 48, fieldTraversalOrder: [], clipboardPasteAffinity: 78, interactionDensity: 68, rehearsalTendency: 65 }, keyDivergences: [] },
    counterfactuals: [],
    nextActionPrediction: { currentStage: 'Branch Staging', predictedAction: 'High-Value RTGS', probability: 78, projectedTimeWindowSec: 60, preemptiveRiskLevel: 'high', preemptiveInterventionSuggested: 'Hold branch authorization', supportingSignals: [] }
  },
  {
    id: 'tx-95372',
    transactionRef: 'TXN-95372',
    sessionCode: 'TXN-95372',
    time: '08:34',
    channel: 'Mobile app',
    accountMasked: 'Savings ...9102',
    deviceName: 'OnePlus 10 Pro',
    ipAddress: '49.207.18.52',
    timestamp: '08:34 AM',
    customer: { id: 'cust-95372', name: 'Aditi Sharma', email: 'aditi.sharma@health.in', accountAgeDays: 490, tier: 'Retail', avatarBg: 'bg-rose-950 text-rose-300 border border-rose-500/30' },
    beneficiary: { name: 'Alpha Retail Escrow', accountNumberMasked: '•••• •••• 8820', bankName: 'Yes Bank', addedTimestamp: '2 mins ago', isNewBeneficiary: true },
    amount: 545000,
    currency: 'INR',
    riskScore: { totalScore: 77, riskLevel: 'high', fraudGravityScore: 78, primaryDriver: 'Pasted IFSC + High velocity', confidence: 0.86, breakdown: [] },
    operatorConfidence: 42,
    rehearsalDetected: false,
    status: 'AUTO_BLOCKED',
    flaggedReasons: ['Pasted IFSC and instant payment click'],
    fraudGravityVectors: [],
    precursorTimeline: [],
    dnaMutation: { overallMutationPercent: 65, ownerBaselineDna: { typingRhythmScore: 80, navigationStyle: 'direct', averageHesitationSec: 3.0, transactionSequencePredictability: 86, fieldTraversalOrder: [], clipboardPasteAffinity: 10, interactionDensity: 40, rehearsalTendency: 5 }, currentSessionDna: { typingRhythmScore: 40, navigationStyle: 'fragmented', averageHesitationSec: 1.1, transactionSequencePredictability: 50, fieldTraversalOrder: [], clipboardPasteAffinity: 75, interactionDensity: 65, rehearsalTendency: 60 }, keyDivergences: [] },
    counterfactuals: [],
    nextActionPrediction: { currentStage: 'Mobile Transfer', predictedAction: 'Second Beneficiary Add', probability: 77, projectedTimeWindowSec: 40, preemptiveRiskLevel: 'high', preemptiveInterventionSuggested: 'Hold funds', supportingSignals: [] }
  },
  {
    id: 'tx-95881',
    transactionRef: 'TXN-95881',
    sessionCode: 'TXN-95881',
    time: '19:12',
    channel: 'Branch tablet',
    accountMasked: 'Retail ...7741',
    deviceName: 'iPad Air 5th Gen',
    ipAddress: '122.176.90.14',
    timestamp: '19:12 PM',
    customer: { id: 'cust-95881', name: 'Kunal Sharma', email: 'kunal.sharma@logistics.in', accountAgeDays: 520, tier: 'Retail', avatarBg: 'bg-rose-950 text-rose-300 border border-rose-500/30' },
    beneficiary: { name: 'Metro Freight Hub', accountNumberMasked: '•••• •••• 3301', bankName: 'Axis Bank', addedTimestamp: '12 mins ago', isNewBeneficiary: true },
    amount: 390000,
    currency: 'INR',
    riskScore: { totalScore: 75, riskLevel: 'high', fraudGravityScore: 76, primaryDriver: 'Cadence divergence on tablet', confidence: 0.85, breakdown: [] },
    operatorConfidence: 45,
    rehearsalDetected: false,
    status: 'AUTO_BLOCKED',
    flaggedReasons: ['Cadence divergence and unusual evening timing'],
    fraudGravityVectors: [],
    precursorTimeline: [],
    dnaMutation: { overallMutationPercent: 63, ownerBaselineDna: { typingRhythmScore: 83, navigationStyle: 'direct', averageHesitationSec: 3.1, transactionSequencePredictability: 88, fieldTraversalOrder: [], clipboardPasteAffinity: 8, interactionDensity: 39, rehearsalTendency: 4 }, currentSessionDna: { typingRhythmScore: 42, navigationStyle: 'erratic', averageHesitationSec: 1.2, transactionSequencePredictability: 52, fieldTraversalOrder: [], clipboardPasteAffinity: 72, interactionDensity: 62, rehearsalTendency: 58 }, keyDivergences: [] },
    counterfactuals: [],
    nextActionPrediction: { currentStage: 'Branch Verification', predictedAction: 'Finalize Payment', probability: 75, projectedTimeWindowSec: 50, preemptiveRiskLevel: 'high', preemptiveInterventionSuggested: 'Require supervisor sign-off', supportingSignals: [] }
  },
  {
    id: 'tx-95818',
    transactionRef: 'TXN-95818',
    sessionCode: 'TXN-95818',
    time: '06:14',
    channel: 'Net banking',
    accountMasked: 'Savings ...6610',
    deviceName: 'MacBook Pro macOS 14.4',
    ipAddress: '103.88.20.101',
    timestamp: '06:14 AM',
    customer: { id: 'cust-95818', name: 'Ananya Menon', email: 'ananya.menon@creative.org', accountAgeDays: 610, tier: 'Retail', avatarBg: 'bg-rose-950 text-rose-300 border border-rose-500/30' },
    beneficiary: { name: 'Oceanic Supply Solutions', accountNumberMasked: '•••• •••• 9904', bankName: 'HDFC Bank', addedTimestamp: '20 mins ago', isNewBeneficiary: true },
    amount: 810000,
    currency: 'INR',
    riskScore: { totalScore: 74, riskLevel: 'high', fraudGravityScore: 75, primaryDriver: 'Early morning net banking wire', confidence: 0.84, breakdown: [] },
    operatorConfidence: 46,
    rehearsalDetected: false,
    status: 'AUTO_BLOCKED',
    flaggedReasons: ['Early morning high-value net banking wire with abnormal key dwell'],
    fraudGravityVectors: [],
    precursorTimeline: [],
    dnaMutation: { overallMutationPercent: 62, ownerBaselineDna: { typingRhythmScore: 82, navigationStyle: 'direct', averageHesitationSec: 3.2, transactionSequencePredictability: 87, fieldTraversalOrder: [], clipboardPasteAffinity: 10, interactionDensity: 40, rehearsalTendency: 4 }, currentSessionDna: { typingRhythmScore: 44, navigationStyle: 'fragmented', averageHesitationSec: 1.3, transactionSequencePredictability: 54, fieldTraversalOrder: [], clipboardPasteAffinity: 70, interactionDensity: 60, rehearsalTendency: 55 }, keyDivergences: [] },
    counterfactuals: [],
    nextActionPrediction: { currentStage: 'Wire Staging', predictedAction: 'Execute Outward Wire', probability: 74, projectedTimeWindowSec: 45, preemptiveRiskLevel: 'high', preemptiveInterventionSuggested: 'Hold for morning desk', supportingSignals: [] }
  },
  {
    id: 'tx-95913',
    transactionRef: 'TXN-95913',
    sessionCode: 'TXN-95913',
    time: '01:58',
    channel: 'UPI',
    accountMasked: 'Savings ...5542',
    deviceName: 'iQOO 12 Android 14',
    ipAddress: '14.143.18.90',
    timestamp: '01:58 AM',
    customer: { id: 'cust-95913', name: 'Rohan Verma', email: 'rohan.verma@tech.com', accountAgeDays: 440, tier: 'Retail', avatarBg: 'bg-rose-950 text-rose-300 border border-rose-500/30' },
    beneficiary: { name: 'Rapid UPI Pool Node', accountNumberMasked: '•••• •••• 1184', bankName: 'ICICI Bank', addedTimestamp: '1 min ago', isNewBeneficiary: true },
    amount: 690000,
    currency: 'INR',
    riskScore: { totalScore: 72, riskLevel: 'high', fraudGravityScore: 73, primaryDriver: 'Night-time UPI high-value spike', confidence: 0.83, breakdown: [] },
    operatorConfidence: 48,
    rehearsalDetected: false,
    status: 'AUTO_BLOCKED',
    flaggedReasons: ['Night-time UPI high-value transfer outside user profile'],
    fraudGravityVectors: [],
    precursorTimeline: [],
    dnaMutation: { overallMutationPercent: 60, ownerBaselineDna: { typingRhythmScore: 81, navigationStyle: 'direct', averageHesitationSec: 3.0, transactionSequencePredictability: 86, fieldTraversalOrder: [], clipboardPasteAffinity: 9, interactionDensity: 39, rehearsalTendency: 4 }, currentSessionDna: { typingRhythmScore: 46, navigationStyle: 'fragmented', averageHesitationSec: 1.4, transactionSequencePredictability: 56, fieldTraversalOrder: [], clipboardPasteAffinity: 68, interactionDensity: 58, rehearsalTendency: 52 }, keyDivergences: [] },
    counterfactuals: [],
    nextActionPrediction: { currentStage: 'UPI Authorization', predictedAction: 'Second UPI Request', probability: 72, projectedTimeWindowSec: 25, preemptiveRiskLevel: 'high', preemptiveInterventionSuggested: 'Hold transaction', supportingSignals: [] }
  },
  {
    id: 'tx-95431',
    transactionRef: 'TXN-95431',
    sessionCode: 'TXN-95431',
    time: '11:24',
    channel: 'Mobile app',
    accountMasked: 'Savings ...3320',
    deviceName: 'Xiaomi 13 Pro',
    ipAddress: '103.111.45.8',
    timestamp: '11:24 AM',
    customer: { id: 'cust-95431', name: 'Riya Reddy', email: 'riya.reddy@capital.org', accountAgeDays: 530, tier: 'Retail', avatarBg: 'bg-rose-950 text-rose-300 border border-rose-500/30' },
    beneficiary: { name: 'Falcon Logistics Escrow', accountNumberMasked: '•••• •••• 7731', bankName: 'IndusInd Bank', addedTimestamp: '8 mins ago', isNewBeneficiary: true },
    amount: 92540,
    currency: 'INR',
    riskScore: { totalScore: 70, riskLevel: 'high', fraudGravityScore: 71, primaryDriver: 'Rehearsal loop + Paste acceleration', confidence: 0.82, breakdown: [] },
    operatorConfidence: 50,
    rehearsalDetected: true,
    status: 'AUTO_BLOCKED',
    flaggedReasons: ['Rehearsal sequence detected on mobile app'],
    fraudGravityVectors: [],
    precursorTimeline: [],
    dnaMutation: { overallMutationPercent: 58, ownerBaselineDna: { typingRhythmScore: 82, navigationStyle: 'direct', averageHesitationSec: 3.1, transactionSequencePredictability: 87, fieldTraversalOrder: [], clipboardPasteAffinity: 8, interactionDensity: 38, rehearsalTendency: 4 }, currentSessionDna: { typingRhythmScore: 48, navigationStyle: 'erratic', averageHesitationSec: 1.5, transactionSequencePredictability: 58, fieldTraversalOrder: [], clipboardPasteAffinity: 65, interactionDensity: 56, rehearsalTendency: 50 }, keyDivergences: [] },
    counterfactuals: [],
    nextActionPrediction: { currentStage: 'Mobile Checkout', predictedAction: 'Finalize Transfer', probability: 70, projectedTimeWindowSec: 35, preemptiveRiskLevel: 'high', preemptiveInterventionSuggested: 'Hold funds', supportingSignals: [] }
  },
  {
    id: 'tx-95861',
    transactionRef: 'TXN-95861',
    sessionCode: 'TXN-95861',
    time: '10:15',
    channel: 'Mobile app',
    accountMasked: 'Retail ...4491',
    deviceName: 'Motorola Edge 40',
    ipAddress: '49.36.19.82',
    timestamp: '10:15 AM',
    customer: { id: 'cust-95861', name: 'Tara Rao', email: 'tara.rao@media.in', accountAgeDays: 410, tier: 'Retail', avatarBg: 'bg-amber-950 text-amber-300 border border-amber-500/30' },
    beneficiary: { name: 'Apex Media Subscriptions', accountNumberMasked: '•••• •••• 9920', bankName: 'HDFC Bank', addedTimestamp: '2 days ago', isNewBeneficiary: false },
    amount: 62540,
    currency: 'INR',
    riskScore: { totalScore: 68, riskLevel: 'suspicious', fraudGravityScore: 69, primaryDriver: 'Unusual amount + slight keystroke variance', confidence: 0.81, breakdown: [] },
    operatorConfidence: 55,
    rehearsalDetected: false,
    status: 'PENDING_REVIEW',
    flaggedReasons: ['Amount higher than 30-day average for this merchant'],
    fraudGravityVectors: [],
    precursorTimeline: [],
    dnaMutation: { overallMutationPercent: 48, ownerBaselineDna: { typingRhythmScore: 84, navigationStyle: 'direct', averageHesitationSec: 3.2, transactionSequencePredictability: 88, fieldTraversalOrder: [], clipboardPasteAffinity: 10, interactionDensity: 40, rehearsalTendency: 4 }, currentSessionDna: { typingRhythmScore: 56, navigationStyle: 'direct', averageHesitationSec: 2.1, transactionSequencePredictability: 68, fieldTraversalOrder: [], clipboardPasteAffinity: 45, interactionDensity: 48, rehearsalTendency: 32 }, keyDivergences: [] },
    counterfactuals: [],
    nextActionPrediction: { currentStage: 'Merchant Payment', predictedAction: 'Complete Checkout', probability: 68, projectedTimeWindowSec: 40, preemptiveRiskLevel: 'suspicious', preemptiveInterventionSuggested: 'Standard OTP step-up', supportingSignals: [] }
  },
  {
    id: 'tx-95629',
    transactionRef: 'TXN-95629',
    sessionCode: 'TXN-95629',
    time: '16:56',
    channel: 'Net banking',
    accountMasked: 'Corporate ...1192',
    deviceName: 'Dell Latitude Windows 11',
    ipAddress: '182.71.55.20',
    timestamp: '16:56 PM',
    customer: { id: 'cust-95629', name: 'Meera Nair', email: 'meera.nair@corp.in', accountAgeDays: 780, tier: 'Corporate', avatarBg: 'bg-amber-950 text-amber-300 border border-amber-500/30' },
    beneficiary: { name: 'Zenith Tech Vendor', accountNumberMasked: '•••• •••• 5519', bankName: 'Kotak Bank', addedTimestamp: '1 day ago', isNewBeneficiary: false },
    amount: 750000,
    currency: 'INR',
    riskScore: { totalScore: 66, riskLevel: 'suspicious', fraudGravityScore: 67, primaryDriver: 'Corporate net banking cadence shift', confidence: 0.80, breakdown: [] },
    operatorConfidence: 58,
    rehearsalDetected: false,
    status: 'PENDING_REVIEW',
    flaggedReasons: ['Corporate payment initiated from new office subnet'],
    fraudGravityVectors: [],
    precursorTimeline: [],
    dnaMutation: { overallMutationPercent: 44, ownerBaselineDna: { typingRhythmScore: 85, navigationStyle: 'direct', averageHesitationSec: 3.3, transactionSequencePredictability: 90, fieldTraversalOrder: [], clipboardPasteAffinity: 8, interactionDensity: 42, rehearsalTendency: 3 }, currentSessionDna: { typingRhythmScore: 60, navigationStyle: 'direct', averageHesitationSec: 2.3, transactionSequencePredictability: 72, fieldTraversalOrder: [], clipboardPasteAffinity: 40, interactionDensity: 46, rehearsalTendency: 28 }, keyDivergences: [] },
    counterfactuals: [],
    nextActionPrediction: { currentStage: 'Corporate Authorization', predictedAction: 'Dual Sign-Off', probability: 66, projectedTimeWindowSec: 60, preemptiveRiskLevel: 'suspicious', preemptiveInterventionSuggested: 'Require secondary approver', supportingSignals: [] }
  },
  {
    id: 'tx-95682',
    transactionRef: 'TXN-95682',
    sessionCode: 'TXN-95682',
    time: '08:44',
    channel: 'Branch tablet',
    accountMasked: 'Savings ...8831',
    deviceName: 'iPad 10th Gen',
    ipAddress: '14.139.50.81',
    timestamp: '08:44 AM',
    customer: { id: 'cust-95682', name: 'Ananya Rao', email: 'ananya.rao@consult.co', accountAgeDays: 520, tier: 'Retail', avatarBg: 'bg-amber-950 text-amber-300 border border-amber-500/30' },
    beneficiary: { name: 'Kiran Estate Services', accountNumberMasked: '•••• •••• 4410', bankName: 'SBI', addedTimestamp: '3 hours ago', isNewBeneficiary: true },
    amount: 585000,
    currency: 'INR',
    riskScore: { totalScore: 64, riskLevel: 'suspicious', fraudGravityScore: 65, primaryDriver: 'Branch tablet hesitation elevation', confidence: 0.79, breakdown: [] },
    operatorConfidence: 60,
    rehearsalDetected: false,
    status: 'PENDING_REVIEW',
    flaggedReasons: ['High hesitation pause before signature input'],
    fraudGravityVectors: [],
    precursorTimeline: [],
    dnaMutation: { overallMutationPercent: 42, ownerBaselineDna: { typingRhythmScore: 82, navigationStyle: 'direct', averageHesitationSec: 3.0, transactionSequencePredictability: 88, fieldTraversalOrder: [], clipboardPasteAffinity: 10, interactionDensity: 40, rehearsalTendency: 4 }, currentSessionDna: { typingRhythmScore: 62, navigationStyle: 'direct', averageHesitationSec: 2.5, transactionSequencePredictability: 74, fieldTraversalOrder: [], clipboardPasteAffinity: 38, interactionDensity: 44, rehearsalTendency: 25 }, keyDivergences: [] },
    counterfactuals: [],
    nextActionPrediction: { currentStage: 'Branch Staging', predictedAction: 'Submit Transfer', probability: 64, projectedTimeWindowSec: 50, preemptiveRiskLevel: 'suspicious', preemptiveInterventionSuggested: 'Verify ID document', supportingSignals: [] }
  },
  {
    id: 'tx-95166',
    transactionRef: 'TXN-95166',
    sessionCode: 'TXN-95166',
    time: '17:14',
    channel: 'Mobile app',
    accountMasked: 'Savings ...2901',
    deviceName: 'iPhone 14 Plus',
    ipAddress: '157.34.19.44',
    timestamp: '17:14 PM',
    customer: { id: 'cust-95166', name: 'Aarav Nair', email: 'aarav.nair@agency.in', accountAgeDays: 640, tier: 'Retail', avatarBg: 'bg-amber-950 text-amber-300 border border-amber-500/30' },
    beneficiary: { name: 'Apex Digital Hosting', accountNumberMasked: '•••• •••• 6619', bankName: 'Axis Bank', addedTimestamp: '1 month ago', isNewBeneficiary: false },
    amount: 440000,
    currency: 'INR',
    riskScore: { totalScore: 62, riskLevel: 'suspicious', fraudGravityScore: 63, primaryDriver: 'Slight timing mismatch on mobile', confidence: 0.78, breakdown: [] },
    operatorConfidence: 62,
    rehearsalDetected: false,
    status: 'PENDING_REVIEW',
    flaggedReasons: ['Flight time variance slightly elevated'],
    fraudGravityVectors: [],
    precursorTimeline: [],
    dnaMutation: { overallMutationPercent: 40, ownerBaselineDna: { typingRhythmScore: 84, navigationStyle: 'direct', averageHesitationSec: 3.2, transactionSequencePredictability: 89, fieldTraversalOrder: [], clipboardPasteAffinity: 8, interactionDensity: 41, rehearsalTendency: 3 }, currentSessionDna: { typingRhythmScore: 64, navigationStyle: 'direct', averageHesitationSec: 2.6, transactionSequencePredictability: 76, fieldTraversalOrder: [], clipboardPasteAffinity: 35, interactionDensity: 42, rehearsalTendency: 22 }, keyDivergences: [] },
    counterfactuals: [],
    nextActionPrediction: { currentStage: 'Mobile Payment', predictedAction: 'Confirm UPI', probability: 62, projectedTimeWindowSec: 30, preemptiveRiskLevel: 'suspicious', preemptiveInterventionSuggested: 'Standard biometric touch', supportingSignals: [] }
  },
  {
    id: 'tx-95469',
    transactionRef: 'TXN-95469',
    sessionCode: 'TXN-95469',
    time: '05:02',
    channel: 'UPI',
    accountMasked: 'Savings ...7781',
    deviceName: 'Nothing Phone 2',
    ipAddress: '103.22.90.11',
    timestamp: '05:02 AM',
    customer: { id: 'cust-95469', name: 'Kabir Verma', email: 'kabir.v@studio.co', accountAgeDays: 480, tier: 'Retail', avatarBg: 'bg-amber-950 text-amber-300 border border-amber-500/30' },
    beneficiary: { name: 'Studio Equipment Supplier', accountNumberMasked: '•••• •••• 2290', bankName: 'IndusInd Bank', addedTimestamp: '2 days ago', isNewBeneficiary: false },
    amount: 725000,
    currency: 'INR',
    riskScore: { totalScore: 60, riskLevel: 'suspicious', fraudGravityScore: 61, primaryDriver: 'Early morning UPI execution', confidence: 0.77, breakdown: [] },
    operatorConfidence: 65,
    rehearsalDetected: false,
    status: 'PENDING_REVIEW',
    flaggedReasons: ['Early morning transfer of substantial value'],
    fraudGravityVectors: [],
    precursorTimeline: [],
    dnaMutation: { overallMutationPercent: 38, ownerBaselineDna: { typingRhythmScore: 83, navigationStyle: 'direct', averageHesitationSec: 3.1, transactionSequencePredictability: 88, fieldTraversalOrder: [], clipboardPasteAffinity: 9, interactionDensity: 40, rehearsalTendency: 4 }, currentSessionDna: { typingRhythmScore: 66, navigationStyle: 'direct', averageHesitationSec: 2.7, transactionSequencePredictability: 78, fieldTraversalOrder: [], clipboardPasteAffinity: 32, interactionDensity: 40, rehearsalTendency: 20 }, keyDivergences: [] },
    counterfactuals: [],
    nextActionPrediction: { currentStage: 'UPI Auth', predictedAction: 'Enter MPIN', probability: 60, projectedTimeWindowSec: 20, preemptiveRiskLevel: 'suspicious', preemptiveInterventionSuggested: 'Trigger standard MPIN', supportingSignals: [] }
  },
  {
    id: 'tx-95648',
    transactionRef: 'TXN-95648',
    sessionCode: 'TXN-95648',
    time: '13:58',
    channel: 'Net banking',
    accountMasked: 'Savings ...3319',
    deviceName: 'HP Spectre x360 Windows 11',
    ipAddress: '122.160.40.89',
    timestamp: '13:58 PM',
    customer: { id: 'cust-95648', name: 'Ishaan Kapoor', email: 'ishaan.k@enterprise.in', accountAgeDays: 710, tier: 'Retail', avatarBg: 'bg-amber-950 text-amber-300 border border-amber-500/30' },
    beneficiary: { name: 'Kapoor Trade Associates', accountNumberMasked: '•••• •••• 8840', bankName: 'HDFC Bank', addedTimestamp: '3 months ago', isNewBeneficiary: false },
    amount: 680000,
    currency: 'INR',
    riskScore: { totalScore: 58, riskLevel: 'suspicious', fraudGravityScore: 59, primaryDriver: 'Minor dwell time acceleration', confidence: 0.75, breakdown: [] },
    operatorConfidence: 68,
    rehearsalDetected: false,
    status: 'PENDING_REVIEW',
    flaggedReasons: ['Minor deviation in keystroke timing'],
    fraudGravityVectors: [],
    precursorTimeline: [],
    dnaMutation: { overallMutationPercent: 35, ownerBaselineDna: { typingRhythmScore: 85, navigationStyle: 'direct', averageHesitationSec: 3.3, transactionSequencePredictability: 90, fieldTraversalOrder: [], clipboardPasteAffinity: 8, interactionDensity: 41, rehearsalTendency: 3 }, currentSessionDna: { typingRhythmScore: 68, navigationStyle: 'direct', averageHesitationSec: 2.8, transactionSequencePredictability: 80, fieldTraversalOrder: [], clipboardPasteAffinity: 28, interactionDensity: 38, rehearsalTendency: 18 }, keyDivergences: [] },
    counterfactuals: [],
    nextActionPrediction: { currentStage: 'Net Banking Auth', predictedAction: 'Submit OTP', probability: 58, projectedTimeWindowSec: 35, preemptiveRiskLevel: 'suspicious', preemptiveInterventionSuggested: 'Standard OTP verification', supportingSignals: [] }
  },
  {
    id: 'tx-95281',
    transactionRef: 'TXN-95281',
    sessionCode: 'TXN-95281',
    time: '14:15',
    channel: 'Mobile app',
    accountMasked: 'Savings ...9941',
    deviceName: 'iPhone 15 iOS 17.5',
    ipAddress: '103.21.14.90',
    timestamp: '14:15 PM',
    customer: { id: 'cust-95281', name: 'Aditi Dutta', email: 'aditi.dutta@consult.org', accountAgeDays: 850, tier: 'Retail', avatarBg: 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' },
    beneficiary: { name: 'Tata Power Electricity Bill', accountNumberMasked: '•••• •••• 1002', bankName: 'SBI', addedTimestamp: '2 years ago', isNewBeneficiary: false },
    amount: 192000,
    currency: 'INR',
    riskScore: { totalScore: 18, riskLevel: 'low', fraudGravityScore: 15, primaryDriver: 'Clean recurring bill payment signature', confidence: 0.99, breakdown: [] },
    operatorConfidence: 96,
    rehearsalDetected: false,
    status: 'APPROVED',
    flaggedReasons: ['Normal baseline verified across all 8 biometric dimensions'],
    fraudGravityVectors: [],
    precursorTimeline: [],
    dnaMutation: { overallMutationPercent: 8, ownerBaselineDna: { typingRhythmScore: 88, navigationStyle: 'direct', averageHesitationSec: 3.4, transactionSequencePredictability: 94, fieldTraversalOrder: [], clipboardPasteAffinity: 5, interactionDensity: 42, rehearsalTendency: 2 }, currentSessionDna: { typingRhythmScore: 86, navigationStyle: 'direct', averageHesitationSec: 3.3, transactionSequencePredictability: 92, fieldTraversalOrder: [], clipboardPasteAffinity: 6, interactionDensity: 41, rehearsalTendency: 2 }, keyDivergences: [] },
    counterfactuals: [],
    nextActionPrediction: { currentStage: 'Completed', predictedAction: 'Return to Dashboard', probability: 95, projectedTimeWindowSec: 10, preemptiveRiskLevel: 'low', preemptiveInterventionSuggested: 'Clean authorization', supportingSignals: [] }
  },
  {
    id: 'tx-9081',
    transactionRef: 'TXN-2026-9081-IN',
    timestamp: '3 mins ago (14:49:10)',
    customer: {
      id: 'cust-4412',
      name: 'Ananya Deshmukh',
      email: 'ananya.deshmukh@tcs.com',
      accountAgeDays: 410,
      tier: 'Retail',
      avatarBg: 'bg-amber-950 text-amber-300 border border-amber-500/30',
    },
    beneficiary: {
      name: 'Aditi Deshmukh (Sister)',
      accountNumberMasked: '•••• •••• 4401',
      bankName: 'HDFC Bank',
      addedTimestamp: '6 months ago',
      isNewBeneficiary: false,
    },
    amount: 18500,
    currency: 'INR',
    riskScore: {
      totalScore: 64,
      riskLevel: 'suspicious',
      fraudGravityScore: 67,
      primaryDriver: 'Circadian Timing Anomaly + Typing Cadence Shift',
      confidence: 0.88,
      breakdown: [
        {
          signalName: 'Behavioral Deviation',
          category: 'behavioral',
          contribution: 22,
          status: 'elevated',
          details: 'Session started at 02:45 AM (normal active window 09:00 - 21:00).',
          microEvidence: 'Hesitation intervals doubled (6.1s vs normal 2.8s).'
        },
        {
          signalName: 'Device Anomaly',
          category: 'device',
          contribution: 14,
          status: 'normal',
          details: 'Known mobile device (iPhone 15 Pro), but battery level drained to 4% with sudden portrait-landscape toggles.',
          microEvidence: 'Gyroscope jitter consistent with high agitation.'
        },
        {
          signalName: 'Interaction Anomaly',
          category: 'interaction',
          contribution: 18,
          status: 'elevated',
          details: 'Repeated backspaces on OTP entry (4 attempts).',
          microEvidence: 'User typed and deleted OTP digits repeatedly.'
        },
        {
          signalName: 'Transaction Context',
          category: 'transaction',
          contribution: 10,
          status: 'normal',
          details: 'Existing trusted beneficiary, but unusual timing for this transfer size.',
          microEvidence: 'Historical transfers to Aditi occur on 1st of month.'
        }
      ]
    },
    operatorConfidence: 58,
    rehearsalDetected: false,
    discoveredTellCode: 'FD-052',
    deviceCollisionsCount: 0,
    status: 'STEP_UP_CHALLENGED',
    flaggedReasons: [
      'Uncharacteristic 02:45 AM transaction window for a standard retail profile',
      'Elevated typing hesitation (6.1s average between fields)',
      'Multiple corrections and repeated edits in payment remarks field'
    ],
    fraudGravityVectors: [
      { name: 'Circadian Anomaly', weight: 24, vectorDirection: 'inward' },
      { name: 'Hesitation Spike', weight: 20, vectorDirection: 'inward' },
      { name: 'Repeated Corrections', weight: 15, vectorDirection: 'inward' },
      { name: 'Known Beneficiary', weight: 12, vectorDirection: 'outward' }
    ],
    precursorTimeline: [
      { id: 'p20', actionSequence: 1, actionType: 'AUTH_LOGIN', targetElement: 'FaceID Gate', timestampOffsetSec: -65, durationMs: 1200, anomalyScore: 10, isFlaggedPrecursor: false, behaviorNote: 'Successful biometric authentication' },
      { id: 'p21', actionSequence: 2, actionType: 'VIEW_TRANSACTIONS', targetElement: 'Statement View', timestampOffsetSec: -50, durationMs: 4200, anomalyScore: 15, isFlaggedPrecursor: false, behaviorNote: 'Normal browsing of previous month ledger' },
      { id: 'p22', actionSequence: 3, actionType: 'SELECT_BENEFICIARY', targetElement: 'Saved Contacts List', timestampOffsetSec: -30, durationMs: 2800, anomalyScore: 22, isFlaggedPrecursor: false, behaviorNote: 'Selected sister profile from pre-existing contacts' },
      { id: 'p23', actionSequence: 4, actionType: 'REPEATED_CORRECTIONS', targetElement: 'Remarks Field', timestampOffsetSec: -12, durationMs: 3800, anomalyScore: 62, isFlaggedPrecursor: true, behaviorNote: 'Typed, deleted, and retyped remarks 3 times' }
    ],
    dnaMutation: {
      overallMutationPercent: 44,
      ownerBaselineDna: {
        typingRhythmScore: 78,
        navigationStyle: 'direct',
        averageHesitationSec: 2.8,
        transactionSequencePredictability: 88,
        fieldTraversalOrder: ['Select', 'Amount', 'Remarks', 'OTP'],
        clipboardPasteAffinity: 5,
        interactionDensity: 38,
        rehearsalTendency: 2
      },
      currentSessionDna: {
        typingRhythmScore: 52,
        navigationStyle: 'hesitant',
        averageHesitationSec: 6.1,
        transactionSequencePredictability: 72,
        fieldTraversalOrder: ['Statement', 'Select', 'Remarks', 'Amount', 'OTP'],
        clipboardPasteAffinity: 4,
        interactionDensity: 62,
        rehearsalTendency: 12
      },
      keyDivergences: [
        { metric: 'Hesitation Duration', historical: '2.8 sec', current: '6.1 sec', deviation: 54, unit: 's' },
        { metric: 'Typing Pace', historical: '48 WPM', current: '26 WPM', deviation: 45, unit: 'wpm' }
      ]
    },
    counterfactuals: [
      {
        decision: 'approve',
        label: 'If Approved',
        estimatedDownstreamExposure: 18500,
        riskReductionPercent: 0,
        predictedFraudProbability: 38,
        customerFrictionScore: 0,
        predictedNetworkContagionAccounts: 0,
        explanation: 'Low risk of external syndicate contagion; might be coerced or under duress.'
      },
      {
        decision: 'step_up_mfa',
        label: 'If Step-Up Push Notification & Silent Behavioral Confirmation',
        estimatedDownstreamExposure: 2000,
        riskReductionPercent: 82,
        predictedFraudProbability: 6,
        customerFrictionScore: 12,
        predictedNetworkContagionAccounts: 0,
        explanation: 'Protects against coercive social engineering while keeping genuine customer friction low.'
      }
    ],
    nextActionPrediction: {
      currentStage: 'Step-Up Verification',
      predictedAction: 'Customer Will Complete Push Auth within 15 Seconds',
      probability: 78,
      probabilityPercent: 78,
      projectedTimeWindowSec: 15,
      preemptiveRiskLevel: 'suspicious',
      preemptiveInterventionSuggested: 'Issue conversational confirmation prompt: "Transferring ₹18,500 to Aditi Deshmukh".',
      supportingSignals: ['Verified historical beneficiary', 'Matching hardware Secure Enclave signature']
    }
  },
  {
    id: 'tx-9080',
    transactionRef: 'TXN-2026-9080-IN',
    timestamp: '8 mins ago (14:44:02)',
    customer: {
      id: 'cust-1092',
      name: 'Rohan Kulkarni',
      email: 'rohan.k@fintechdynamics.io',
      accountAgeDays: 1200,
      tier: 'Corporate',
      avatarBg: 'bg-sky-950 text-sky-300 border border-sky-500/30',
    },
    beneficiary: {
      name: 'Amazon Web Services Inc.',
      accountNumberMasked: '•••• •••• 1002',
      bankName: 'Citibank N.A.',
      addedTimestamp: '2 years ago',
      isNewBeneficiary: false,
    },
    amount: 142000,
    currency: 'INR',
    riskScore: {
      totalScore: 12,
      riskLevel: 'low',
      fraudGravityScore: 10,
      primaryDriver: 'Deterministic Routine Corporate Recurring Bill',
      confidence: 0.98,
      breakdown: [
        {
          signalName: 'Behavioral Consistency',
          category: 'behavioral',
          contribution: 2,
          status: 'normal',
          details: 'Typing rhythm matches historical baseline within 96% confidence interval.',
          microEvidence: 'Mean key hold time 112ms, flight variance <8ms.'
        },
        {
          signalName: 'Device Biometrics',
          category: 'device',
          contribution: 3,
          status: 'normal',
          details: 'Registered corporate MacBook Pro with hardware key attestation.',
          microEvidence: 'Zero device collisions; known static office IP.'
        },
        {
          signalName: 'Sequence Regularity',
          category: 'transaction',
          contribution: 4,
          status: 'normal',
          details: 'Exact recurring monthly invoice settlement cadence.',
          microEvidence: 'Monthly variance <3%.'
        }
      ]
    },
    operatorConfidence: 97,
    rehearsalDetected: false,
    deviceCollisionsCount: 0,
    status: 'APPROVED',
    flaggedReasons: ['Deterministic match with legitimate corporate owner behavioral DNA profile'],
    fraudGravityVectors: [
      { name: 'Historical DNA Match', weight: 40, vectorDirection: 'outward' },
      { name: 'Hardware Attestation', weight: 35, vectorDirection: 'outward' },
      { name: 'Known Beneficiary', weight: 25, vectorDirection: 'outward' }
    ],
    precursorTimeline: [
      { id: 'p30', actionSequence: 1, actionType: 'AUTH_SSO', targetElement: 'Okta SAML', timestampOffsetSec: -30, durationMs: 400, anomalyScore: 2, isFlaggedPrecursor: false, behaviorNote: 'Corporate SSO seamless pass' },
      { id: 'p31', actionSequence: 2, actionType: 'INVOICE_UPLOAD', targetElement: 'Vendor Pay', timestampOffsetSec: -20, durationMs: 1200, anomalyScore: 4, isFlaggedPrecursor: false, behaviorNote: 'Standard drag-and-drop vendor invoice' },
      { id: 'p32', actionSequence: 3, actionType: 'APPROVE_PAYMENT', targetElement: 'Approve Modal', timestampOffsetSec: 0, durationMs: 800, anomalyScore: 3, isFlaggedPrecursor: false, behaviorNote: 'Natural cursor deceleration curve' }
    ],
    dnaMutation: {
      overallMutationPercent: 4,
      ownerBaselineDna: {
        typingRhythmScore: 92,
        navigationStyle: 'direct',
        averageHesitationSec: 1.4,
        transactionSequencePredictability: 96,
        fieldTraversalOrder: ['Login', 'Invoice', 'Verify', 'Approve'],
        clipboardPasteAffinity: 2,
        interactionDensity: 24,
        rehearsalTendency: 0
      },
      currentSessionDna: {
        typingRhythmScore: 91,
        navigationStyle: 'direct',
        averageHesitationSec: 1.5,
        transactionSequencePredictability: 95,
        fieldTraversalOrder: ['Login', 'Invoice', 'Verify', 'Approve'],
        clipboardPasteAffinity: 2,
        interactionDensity: 25,
        rehearsalTendency: 0
      },
      keyDivergences: [
        { metric: 'Typing Rhythm Score', historical: '92', current: '91', deviation: 1, unit: 'pts' }
      ]
    },
    counterfactuals: [
      {
        decision: 'approve',
        label: 'Approved Straight Through',
        estimatedDownstreamExposure: 0,
        riskReductionPercent: 99,
        predictedFraudProbability: 0.2,
        customerFrictionScore: 0,
        predictedNetworkContagionAccounts: 0,
        explanation: 'Frictionless settlement; optimal user experience.'
      }
    ],
    nextActionPrediction: {
      currentStage: 'Completed',
      predictedAction: 'Logout or Download PDF Receipt',
      probability: 95,
      probabilityPercent: 95,
      projectedTimeWindowSec: 10,
      preemptiveRiskLevel: 'low',
      preemptiveInterventionSuggested: 'None required.',
      supportingSignals: ['Historical post-transaction habit']
    }
  },
  {
    id: 'tx-9079',
    transactionRef: 'TXN-2026-9079-IN',
    timestamp: '15 mins ago (14:37:44)',
    customer: {
      id: 'cust-6701',
      name: 'Sunita Mehra',
      email: 'sunita.mehra@outlook.com',
      accountAgeDays: 520,
      tier: 'Retail',
      avatarBg: 'bg-rose-950 text-rose-300 border border-rose-500/30',
    },
    beneficiary: {
      name: 'CryptoGateway Global Pay',
      accountNumberMasked: '•••• •••• 7719',
      bankName: 'Federal Bank',
      addedTimestamp: '5 mins before txn',
      isNewBeneficiary: true,
    },
    amount: 490000,
    currency: 'INR',
    riskScore: {
      totalScore: 94,
      riskLevel: 'high',
      fraudGravityScore: 96,
      primaryDriver: 'Zero-Day Polymorphic Sequence + Rapid Rehearsal + 0.2s Confirmation',
      confidence: 0.97,
      breakdown: [
        {
          signalName: 'Zero-Day Polymorphic Echo',
          category: 'behavioral',
          contribution: 30,
          status: 'critical',
          details: 'Behavior matches first-seen Zero-Day Pattern #ZD-73 across 6 unlinked accounts.',
          microEvidence: 'Exact 3-step rehearsal: open -> stage amount -> abort -> inquiry limit -> execute.'
        },
        {
          signalName: 'Impersonation Discrepancy',
          category: 'behavioral',
          contribution: 28,
          status: 'critical',
          details: 'Current operator keystroke hold time (42ms) is 3.8x faster than Sunita Mehra historical (160ms).',
          microEvidence: 'Zero touch jitter on mobile; indicative of emulator or USB automation.'
        },
        {
          signalName: 'Velocity & Value Spike',
          category: 'transaction',
          contribution: 20,
          status: 'critical',
          details: 'Account balance liquidation: ₹4.9L out of ₹5.02L total liquid balance.',
          microEvidence: '97.6% wallet drain.'
        },
        {
          signalName: 'Device Subnet Jump',
          category: 'device',
          contribution: 16,
          status: 'elevated',
          details: 'Residential proxy tunnel routing via European exit node.',
          microEvidence: 'TCP handshake round-trip latency mismatch (310ms vs declared local IP).'
        }
      ]
    },
    operatorConfidence: 14,
    rehearsalDetected: true,
    discoveredTellCode: 'FD-102',
    deviceCollisionsCount: 6,
    status: 'AUTO_BLOCKED',
    flaggedReasons: [
      'Account liquidation pattern (97.6% of account balance transferred to newly minted beneficiary)',
      'Biometric profile matches automated script emulator with synthetic touch injection',
      'Zero-Day Polymorphic Tell discovered 14 minutes ago spreading across 6 accounts'
    ],
    fraudGravityVectors: [
      { name: 'Balance Drain', weight: 32, vectorDirection: 'inward' },
      { name: 'Zero-Day Cluster', weight: 26, vectorDirection: 'inward' },
      { name: 'Emulator Touch Profile', weight: 22, vectorDirection: 'inward' },
      { name: 'Proxy Latency Gap', weight: 16, vectorDirection: 'inward' }
    ],
    precursorTimeline: [
      { id: 'p40', actionSequence: 1, actionType: 'AUTH_SESSION_HIJACK', targetElement: 'Session Cookie Ingestion', timestampOffsetSec: -55, durationMs: 100, anomalyScore: 88, isFlaggedPrecursor: true, behaviorNote: 'Instant session restore without credentials entry' },
      { id: 'p41', actionSequence: 2, actionType: 'CHECK_MAX_BALANCE', targetElement: 'Wallet Summary', timestampOffsetSec: -45, durationMs: 210, anomalyScore: 75, isFlaggedPrecursor: true, behaviorNote: 'Instantaneous element query via DOM traversal' },
      { id: 'p42', actionSequence: 3, actionType: 'REHEARSAL_LIMIT_PROBE', targetElement: 'Transfer Gate', timestampOffsetSec: -30, durationMs: 450, anomalyScore: 92, isFlaggedPrecursor: true, behaviorNote: 'Rehearsal: staged ₹10k trial, immediately cancelled' },
      { id: 'p43', actionSequence: 4, actionType: 'PASTE_MAX_VALUE', targetElement: 'Amount Input', timestampOffsetSec: -12, durationMs: 140, anomalyScore: 97, isFlaggedPrecursor: true, behaviorNote: 'Pasted ₹4,90,000 in 0.14 seconds' },
      { id: 'p44', actionSequence: 5, actionType: 'CONFIRM_CLICK', targetElement: 'Submit Button', timestampOffsetSec: 0, durationMs: 80, anomalyScore: 99, isFlaggedPrecursor: true, behaviorNote: 'Sub-100ms click trigger without visual scanning' }
    ],
    dnaMutation: {
      overallMutationPercent: 93,
      ownerBaselineDna: {
        typingRhythmScore: 74,
        navigationStyle: 'hesitant',
        averageHesitationSec: 4.8,
        transactionSequencePredictability: 82,
        fieldTraversalOrder: ['Overview', 'Beneficiary', 'Amount', 'Review', 'OTP'],
        clipboardPasteAffinity: 12,
        interactionDensity: 32,
        rehearsalTendency: 6
      },
      currentSessionDna: {
        typingRhythmScore: 8,
        navigationStyle: 'scripted',
        averageHesitationSec: 0.15,
        transactionSequencePredictability: 12,
        fieldTraversalOrder: ['Direct_DOM_Invoke'],
        clipboardPasteAffinity: 99,
        interactionDensity: 98,
        rehearsalTendency: 95
      },
      keyDivergences: [
        { metric: 'Decision Hesitation', historical: '4.8 sec', current: '0.15 sec', deviation: 96, unit: 's' },
        { metric: 'Touch Contact Surface', historical: '14.2 mm²', current: '0.0 mm² (Emulator)', deviation: 100, unit: 'mm²' },
        { metric: 'DNA Drift Index', historical: 'Baseline', current: '+93% Mutation', deviation: 93, unit: '%' }
      ]
    },
    counterfactuals: [
      {
        decision: 'approve',
        label: 'If Approved',
        estimatedDownstreamExposure: 490000,
        riskReductionPercent: 0,
        predictedFraudProbability: 98,
        customerFrictionScore: 0,
        predictedNetworkContagionAccounts: 8,
        explanation: 'Instant wire into cryptocurrency mixing bridge; irreversible capital flight.'
      },
      {
        decision: 'block',
        label: 'If Instant Hard Quarantine',
        estimatedDownstreamExposure: 0,
        riskReductionPercent: 99,
        predictedFraudProbability: 1,
        customerFrictionScore: 40,
        predictedNetworkContagionAccounts: 0,
        explanation: '100% loss prevented. Saved ₹4,90,000 for retail customer Sunita Mehra.'
      }
    ],
    nextActionPrediction: {
      currentStage: 'Quarantined',
      predictedAction: 'Fraudster Bot Will Rotate IP and Target Account #cust-6702',
      probability: 94,
      probabilityPercent: 94,
      projectedTimeWindowSec: 60,
      preemptiveRiskLevel: 'high',
      preemptiveInterventionSuggested: 'Propagate behavioral signature #FD-102 to all active API edge nodes in cluster.',
      supportingSignals: ['Syndicate cluster propagation signature']
    }
  }
];

export const MOCK_FRAUD_TELLS: FraudTell[] = [
  {
    id: 'tell-1',
    code: 'FD-047',
    name: 'Rapid Rehearsal Transfer Loop',
    discoveryDate: '2026-08-12',
    category: 'REHEARSAL',
    description: 'Beneficiary revisit ≥ 3 times, cancellation ≥ 2 times, and decision latency < 1.0 second on high-value transfer.',
    observedCorrelationMultiplier: 6.2,
    modelConfidencePercent: 94,
    triggerRule: 'rehearsal_count >= 2 && confirmation_latency_ms < 1000 && beneficiary_age_min < 15',
    occurrencesCount: 142,
    status: 'ACTIVE_MONITORING',
    sampleIncidentId: 'tx-9082'
  },
  {
    id: 'tell-2',
    code: 'FD-052',
    name: 'Clipboard Blast with Zero Hesitation',
    discoveryDate: '2026-08-13',
    category: 'CLIPBOARD',
    description: 'Pasting entire complex 60+ char address/account payload in <0.45 seconds followed by instantaneous form tab progression.',
    observedCorrelationMultiplier: 4.8,
    modelConfidencePercent: 91,
    triggerRule: 'paste_duration_ms < 450 && keyup_event_count == 0 && next_field_hop_ms < 200',
    occurrencesCount: 89,
    status: 'DEPLOYED_TO_EDGE',
    sampleIncidentId: 'tx-9082'
  },
  {
    id: 'tell-3',
    code: 'FD-089',
    name: 'Synthetic Cadence & Low-Entropy Flight',
    discoveryDate: '2026-08-14',
    category: 'CADENCE',
    description: 'Inter-key flight time variance <10ms across 40 keystrokes (robotic script execution mimicking human typing).',
    observedCorrelationMultiplier: 8.1,
    modelConfidencePercent: 98,
    triggerRule: 'flight_time_variance_ms < 12 && total_keystrokes > 30',
    occurrencesCount: 215,
    status: 'AUTO_BLOCKED',
    sampleIncidentId: 'tx-9079'
  },
  {
    id: 'tell-4',
    code: 'FD-102',
    name: 'Zero-Day Account Liquidation Probe',
    discoveryDate: '2026-08-15 (Today)',
    category: 'ZERO_DAY',
    description: 'Immediate balance check followed by transfer amount set to 95-99% of total liquid funds within 18s of login.',
    observedCorrelationMultiplier: 9.4,
    modelConfidencePercent: 96,
    triggerRule: 'balance_drain_ratio > 0.95 && session_duration_to_txn_sec < 25',
    occurrencesCount: 17,
    status: 'CANDIDATE_RULE',
    sampleIncidentId: 'tx-9079'
  },
  {
    id: 'tell-5',
    code: 'FD-114',
    name: 'Circadian Agitation & Tremor Burst',
    discoveryDate: '2026-08-10',
    category: 'LATENCY',
    description: 'Extreme hesitation spikes (>6s) combined with repeated field corrections during off-peak hours (02:00-05:00 AM).',
    observedCorrelationMultiplier: 3.9,
    modelConfidencePercent: 86,
    triggerRule: 'circadian_hour in [2,3,4,5] && mean_hesitation_sec > 5.5 && backspace_count > 6',
    occurrencesCount: 64,
    status: 'ACTIVE_MONITORING',
    sampleIncidentId: 'tx-9081'
  }
];

export const MOCK_PATTERN_EVOLUTION: FraudPatternEvolutionWeek[] = [
  {
    week: 'Week 1',
    dateRange: 'Jul 15 - Jul 21',
    patternA: 85,
    patternAB: 12,
    patternC: 3,
    patternD: 0,
    dominantStrain: 'Pattern A (Crude High-Speed Script)',
    mutationSummary: 'Fraudsters used un-throttled bots typing at 120 WPM; caught easily by basic velocity rules.',
    mitigationRuleId: 'RULE-VEL-01'
  },
  {
    week: 'Week 2',
    dateRange: 'Jul 22 - Jul 28',
    patternA: 42,
    patternAB: 48,
    patternC: 10,
    patternD: 0,
    dominantStrain: 'Pattern A + B (Script + Rehearsal Staging)',
    mutationSummary: 'Attackers adapted by inserting pre-transfer limit inquiries and cancelling small test transfers first.',
    mitigationRuleId: 'RULE-REH-04'
  },
  {
    week: 'Week 3',
    dateRange: 'Jul 29 - Aug 04',
    patternA: 8,
    patternAB: 26,
    patternC: 62,
    patternD: 4,
    dominantStrain: 'Pattern C (Human-Mimicking Jitter + Fast Paste)',
    mutationSummary: 'Pattern A virtually vanished. Attackers introduced Gaussian noise in keystrokes and switched to clipboard blasts.',
    mitigationRuleId: 'RULE-CLIP-09'
  },
  {
    week: 'Week 4 (Current)',
    dateRange: 'Aug 05 - Aug 15',
    patternA: 2,
    patternAB: 14,
    patternC: 38,
    patternD: 46,
    dominantStrain: 'Pattern D (Polymorphic Zero-Day & Subnet Echo)',
    mutationSummary: 'Coordinated syndicate campaigns propagating across unrelated customer accounts using shared micro-tells.',
    mitigationRuleId: 'RULE-ECHO-12'
  }
];

export const MOCK_BEHAVIORAL_CLUSTERS: BehavioralCluster[] = [
  {
    id: 'cluster-alpha',
    clusterName: 'Syndicate "Hydra-7" Operator Group',
    accountCount: 52,
    similarityScore: 93.4,
    sharedOperatorSignature: 'OP-SIG: Keystroke Hold=38ms, Bezier Mouse Control P1(12,84), Zero-Hover Submit',
    primarySubnet: '103.21.58.0/24 (ASN 45218)',
    typingCadenceFingerprint: 'SYNTH-CADENCE-v4.2',
    automationProbability: 97,
    firstSeen: '2026-08-14 02:15 AM',
    lastActive: '12 mins ago',
    accounts: [
      { accountId: 'ACC-1002', accountHolder: 'Rajesh V. (Compromised)', transactionAmount: 340000, status: 'Quarantined' },
      { accountId: 'ACC-1003', accountHolder: 'Kavita M. (Compromised)', transactionAmount: 490000, status: 'Quarantined' },
      { accountId: 'ACC-1004', accountHolder: 'Farhan A. (Compromised)', transactionAmount: 280000, status: 'Under Investigation' },
      { accountId: 'ACC-1005', accountHolder: 'Sneha P. (Compromised)', transactionAmount: 310000, status: 'Flagged' },
      { accountId: 'ACC-1006', accountHolder: 'Gaurav S. (Compromised)', transactionAmount: 450000, status: 'Quarantined' }
    ]
  },
  {
    id: 'cluster-beta',
    clusterName: 'Mule Account Consolidation Farm',
    accountCount: 28,
    similarityScore: 88.2,
    sharedOperatorSignature: 'OP-SIG: Instant IFSC Paste (0.32s) -> Zero Remarks -> High Frequency Refresh',
    primarySubnet: '45.112.90.0/24 (VPN Exit Hub)',
    typingCadenceFingerprint: 'CLIP-BLAST-FAST-v2',
    automationProbability: 89,
    firstSeen: '2026-08-13 18:30 PM',
    lastActive: '45 mins ago',
    accounts: [
      { accountId: 'ACC-2091', accountHolder: 'Pooja T. (Mule)', transactionAmount: 180000, status: 'Quarantined' },
      { accountId: 'ACC-2092', accountHolder: 'Deepak B. (Mule)', transactionAmount: 220000, status: 'Quarantined' },
      { accountId: 'ACC-2093', accountHolder: 'Manish R. (Mule)', transactionAmount: 195000, status: 'Flagged' }
    ]
  }
];

export const MOCK_TIME_MACHINE_DATA: BehavioralTimeMachinePoint[] = [
  {
    day: 1,
    label: 'Day 1',
    date: 'July 16, 2026',
    eventDescription: 'Normal routine session: paid electricity bill, checked mutual funds.',
    typingRhythmDeviation: 2,
    navigationFragmentScore: 4,
    hesitationShiftSec: 0.1,
    deviceChanged: false,
    rehearsalScore: 0,
    cumulativeRisk: 8,
    earlyWarningTriggered: false,
    systemVerdict: 'Legitimate Owner (Baseline Calibrated)'
  },
  {
    day: 12,
    label: 'Day 12',
    date: 'July 28, 2026',
    eventDescription: 'Minor behavioral drift: slightly faster navigation, salary credit query.',
    typingRhythmDeviation: 8,
    navigationFragmentScore: 12,
    hesitationShiftSec: -0.3,
    deviceChanged: false,
    rehearsalScore: 0,
    cumulativeRisk: 14,
    earlyWarningTriggered: false,
    systemVerdict: 'Normal Variance'
  },
  {
    day: 19,
    label: 'Day 19',
    date: 'Aug 04, 2026',
    eventDescription: 'New device enrolled (Windows Chrome) from same ISP residential subnet.',
    typingRhythmDeviation: 22,
    navigationFragmentScore: 28,
    hesitationShiftSec: -0.9,
    deviceChanged: true,
    rehearsalScore: 5,
    cumulativeRisk: 34,
    earlyWarningTriggered: false,
    systemVerdict: 'Low-Risk Device Expansion'
  },
  {
    day: 24,
    label: 'Day 24',
    date: 'Aug 09, 2026',
    eventDescription: '⚠️ Early Signal: Beneficiary added at 03:20 AM without subsequent transfer.',
    typingRhythmDeviation: 46,
    navigationFragmentScore: 54,
    hesitationShiftSec: -2.1,
    deviceChanged: false,
    rehearsalScore: 35,
    cumulativeRisk: 58,
    earlyWarningTriggered: true,
    systemVerdict: '🚨 Early Warning: Behavioral Drift Detected (6 Days Before Attack)'
  },
  {
    day: 28,
    label: 'Day 28',
    date: 'Aug 13, 2026',
    eventDescription: '🎭 Rehearsal Behavior: Staged ₹25,000 transfer, cancelled, checked ₹5L transfer limit.',
    typingRhythmDeviation: 68,
    navigationFragmentScore: 78,
    hesitationShiftSec: -2.9,
    deviceChanged: false,
    rehearsalScore: 82,
    cumulativeRisk: 79,
    earlyWarningTriggered: true,
    systemVerdict: '🔴 Critical Precursor: Rehearsal Loop Confirmed'
  },
  {
    day: 30,
    label: 'Day 30 (Today)',
    date: 'Aug 15, 2026',
    eventDescription: '💥 Fraud Attempt Executed: ₹3,45,000 transfer with 0.4s pasted address & zero hesitation.',
    typingRhythmDeviation: 91,
    navigationFragmentScore: 94,
    hesitationShiftSec: -3.2,
    deviceChanged: true,
    rehearsalScore: 96,
    cumulativeRisk: 94,
    earlyWarningTriggered: true,
    systemVerdict: '🛑 Intercepted & Auto-Blocked by AegisBio Engine'
  }
];

export const MOCK_DNA_TREE: DnaTreeNode = {
  id: 'dna-root',
  code: 'DNA-GEN-0',
  name: 'Root Behavioral Threat Landscape',
  level: 0,
  mutationDate: '2026-06-01',
  description: 'Baseline taxonomy of automated and credential-stuffing financial fraud vectors.',
  riskFactor: 50,
  status: 'Active',
  children: [
    {
      id: 'dna-pa',
      code: 'Pattern A',
      name: 'High-Velocity Script Automation',
      level: 1,
      parentCode: 'DNA-GEN-0',
      mutationDate: '2026-07-01',
      description: 'Headless browser automation injecting static fields without delays.',
      riskFactor: 65,
      status: 'Mitigated',
      children: [
        {
          id: 'dna-pa1',
          code: 'Pattern A1',
          name: 'Gaussian Delay Throttled Script',
          level: 2,
          parentCode: 'Pattern A',
          mutationDate: '2026-07-15',
          description: 'Added 100ms-300ms random delays between form fields to evade simple velocity checks.',
          riskFactor: 74,
          status: 'Mitigated',
        },
        {
          id: 'dna-pa2',
          code: 'Pattern A2',
          name: 'Rehearsal-Armed Probe Agent',
          level: 2,
          parentCode: 'Pattern A',
          mutationDate: '2026-07-28',
          description: 'Introduced pre-transaction cancellation and account limit queries before execution.',
          riskFactor: 88,
          status: 'Active',
          children: [
            {
              id: 'dna-pa21',
              code: 'Pattern A2.1',
              name: 'Sub-Threshold Multi-Leg Rehearsal',
              level: 3,
              parentCode: 'Pattern A2',
              mutationDate: '2026-08-08',
              description: 'Splits rehearsals across multiple beneficiary drafts to avoid single-form thresholds.',
              riskFactor: 92,
              status: 'Active',
              children: [
                {
                  id: 'dna-pa211',
                  code: 'Pattern A2.1.1 (FD-047)',
                  name: 'Polymorphic Rehearsal with Bezier Jitter',
                  level: 4,
                  parentCode: 'Pattern A2.1',
                  mutationDate: '2026-08-14',
                  description: 'State-of-the-art evasive strain combining micro-cancellations, curved mouse jitter, and rapid clipboard bursts.',
                  riskFactor: 98,
                  status: 'Evolving'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'dna-pb',
      code: 'Pattern B',
      name: 'Human Operator Account Takeover (ATO)',
      level: 1,
      parentCode: 'DNA-GEN-0',
      mutationDate: '2026-07-10',
      description: 'Manual credential abuse by human fraudster call centers.',
      riskFactor: 70,
      status: 'Active',
      children: [
        {
          id: 'dna-pb1',
          code: 'Pattern B1',
          name: 'Script-Assisted Copy-Paste ATO',
          level: 2,
          parentCode: 'Pattern B',
          mutationDate: '2026-07-22',
          description: 'Human operator using clipboard macros to rapidly inject victim and mule details.',
          riskFactor: 82,
          status: 'Active',
        },
        {
          id: 'dna-pb2',
          code: 'Pattern B2 (FD-114)',
          name: 'Circadian Coercion & Panic Cadence',
          level: 2,
          parentCode: 'Pattern B',
          mutationDate: '2026-08-05',
          description: 'Victim operating phone under live telephone scam coercion; high hesitation and tremor.',
          riskFactor: 86,
          status: 'Evolving'
        }
      ]
    }
  ]
};

export const MOCK_ZERO_DAY_INCIDENTS: ZeroDayIncident[] = [
  {
    id: 'zd-73',
    patternCode: 'Pattern #ZD-73',
    strainId: 'ZD-73',
    strainName: 'Frictionless Card-Entry Automaton',
    discoveredAt: 'Today at 02:17 AM',
    discoveredTime: 'Today at 02:17 AM',
    description:
      'A previously unseen behavioral topology showing zero keystroke hesitation while entering a 16-digit recipient card number, followed by an inhumanly fast Beneficiary → Limit Check → Balance → Confirm loop, with an identical mouse curve inflection point repeated across unrelated accounts.',
    accountsAffected: 7,
    affectedAccountsCount: 7,
    behavioralSimilarity: 89.2,
    fraudProbability: 92.4,
    connectedDevices: 5,
    characteristics: [
      'Zero keystroke hesitation on 16-digit recipient card number',
      'Sudden rapid navigation loop: Beneficiary -> Limit Check -> Balance -> Confirm in <14s',
      'Cross-account identical mouse curve trajectory inflection point (x: 412, y: 198)',
      'No prior matching signature in historical rule catalog'
    ],
    candidateRule:
      "IF field.holdTimeMs < 12 ON card_number AND navigation.sequence == ['beneficiary','limit_check','balance','confirm'] AND navigation.durationSec < 14 AND mouse.curveInflection ~= (412, 198 ±6px) THEN flag='ZD-73_CANDIDATE', action='STEP_UP_MFA'",
    investigatorNotes: 'Suspected new zero-day automation tool deployed by Syndicate Hydra-7 targeting retail banking API.',
    isContained: true
  },
  {
    id: 'zd-74',
    patternCode: 'Pattern #ZD-74',
    strainId: 'ZD-74',
    strainName: 'Synthetic Multi-Tab Invoice Skimmer',
    discoveredAt: 'Yesterday at 22:45 PM',
    discoveredTime: 'Yesterday at 22:45 PM',
    description:
      'Simultaneous multi-tab session initiation across four unrelated corporate accounts, each with an identical 3.4-second dwell time on the tax invoice download button and a synthetic touch radius of exactly 0.0mm, consistent with a headless Chrome container rather than a human operator.',
    accountsAffected: 4,
    affectedAccountsCount: 4,
    behavioralSimilarity: 94.1,
    fraudProbability: 86.8,
    connectedDevices: 3,
    characteristics: [
      'Simultaneous multi-tab session initiation across 4 unrelated corporate accounts',
      'Identical 3.4-second dwell time on tax invoice download button',
      'Synthetic touch radius exactly 0.0mm (headless Chrome container)'
    ],
    candidateRule:
      "IF session.concurrentTabs >= 4 AND touch.radiusMm == 0.0 AND dwellTime('invoice_download') ~= 3.4s (±0.1s) ACROSS accounts.unrelated THEN flag='ZD-74_CANDIDATE', action='SOFT_DELAY'",
    investigatorNotes: 'Automated invoice scraper attempting secondary payroll diversion.',
    isContained: true
  }
];

export const MOCK_CROSS_CUSTOMER_ECHO: CrossCustomerEchoEvent[] = [
  {
    id: 'echo-1',
    originCustomer: 'Customer A (K. Sen, Mumbai)',
    echoCustomer: 'Customer B (R. Nair, Bengaluru)',
    similarityPercent: 78.4,
    lagTimeHours: 48,
    propagationPath: ['Subnet 103.21.x.x', 'Rehearsal Sequence Pattern #4', 'Clipboard Delay <0.4s'],
    strainFingerprint: 'FD-SYNTH-ECHO-88',
    threatRadius: 'Spreading'
  },
  {
    id: 'echo-2',
    originCustomer: 'Customer B (R. Nair, Bengaluru)',
    echoCustomer: 'Customer C (T. Verma, Delhi)',
    similarityPercent: 81.9,
    lagTimeHours: 19,
    propagationPath: ['Zero-Day Sequence ZD-73', 'Mule Routing Cluster IndusInd-IND', 'Bezier Curve #91'],
    strainFingerprint: 'FD-SYNTH-ECHO-88',
    threatRadius: 'High Velocity Viral'
  },
  {
    id: 'echo-3',
    originCustomer: 'Customer C (T. Verma, Delhi)',
    echoCustomer: 'Customer D (M. Joshi, Pune)',
    similarityPercent: 92.1,
    lagTimeHours: 6,
    propagationPath: ['Automated Rehearsal Loop', 'Limit Boundary Probe', 'Direct Token Drain'],
    strainFingerprint: 'FD-SYNTH-ECHO-88',
    threatRadius: 'High Velocity Viral'
  }
];

export const MOCK_ADVERSARIAL_ROUNDS: AdversarialSimulationRound[] = [
  {
    round: 1,
    fraudsterStrategy: 'Basic Headless Playwright Script',
    evasionTechnique: 'Static fast typing (110 WPM), zero delays',
    simulatedJitterMs: 0,
    proxyRotation: false,
    detectorIntercepted: true,
    detectionConfidence: 99.4,
    blueTeamCounterRule: 'Rule #VEL-01: Flag typing speed > 90 WPM with flight variance < 15ms.',
    armsRaceAdvantage: 'BLUE_TEAM'
  },
  {
    round: 2,
    fraudsterStrategy: 'Randomized Sleep Injection',
    evasionTechnique: 'Added 500ms fixed delay between input focus and typing start',
    simulatedJitterMs: 12,
    proxyRotation: false,
    detectorIntercepted: true,
    detectionConfidence: 94.2,
    blueTeamCounterRule: 'Rule #HES-03: Differentiate human cognitive pause from static synthetic sleep.',
    armsRaceAdvantage: 'BLUE_TEAM'
  },
  {
    round: 3,
    fraudsterStrategy: 'Gaussian Keystroke Jitter + Bezier Mouse',
    evasionTechnique: 'Simulated Gaussian curve on keydown-keyup + 3-point Bezier mouse trajectory',
    simulatedJitterMs: 140,
    proxyRotation: true,
    detectorIntercepted: false,
    detectionConfidence: 61.0,
    blueTeamCounterRule: '⚠️ Red-Team Breach: Bypassed basic cadence filters with synthetic curve smoothing.',
    armsRaceAdvantage: 'RED_TEAM'
  },
  {
    round: 4,
    fraudsterStrategy: 'Multi-Step Rehearsal & Limit Probing',
    evasionTechnique: 'Staged 2 cancelled micro-transfers before payload execution',
    simulatedJitterMs: 180,
    proxyRotation: true,
    detectorIntercepted: true,
    detectionConfidence: 96.8,
    blueTeamCounterRule: 'Rule #REH-04 (Tell FD-047): Intercept non-linear rehearsal action sequences.',
    armsRaceAdvantage: 'BLUE_TEAM'
  },
  {
    round: 5,
    fraudsterStrategy: 'Polymorphic Zero-Day & Subnet Echo',
    evasionTechnique: 'Rotating cross-customer payload across 4 residential ASN nodes',
    simulatedJitterMs: 220,
    proxyRotation: true,
    detectorIntercepted: true,
    detectionConfidence: 93.1,
    blueTeamCounterRule: 'Rule #ECHO-12: Cross-Customer Behavioral Echo Correlation Model activated.',
    armsRaceAdvantage: 'BLUE_TEAM'
  }
];

export const MOCK_TREE_ROOT: MutationTreeNode = {
  id: 'dna-strain-0',
  name: 'Pattern 0: Ancestral Clipboard Automation',
  discoveredDate: 'Jun 2026',
  severity: 'medium',
  description: 'Ancestral programmatic copy-paste attack scripts executing simple form automation without latency or mouse curves.',
  mutationDetails: 'Original strain observed across early credential stuffing waves. Scripted DOM node injection with zero user-interaction events.',
  children: [
    {
      id: 'dna-strain-1',
      name: 'Pattern A: Jitter-Throttled Script',
      discoveredDate: 'Jul 2026',
      severity: 'high',
      description: 'First evolutionary mutation adding randomized artificial delay intervals (100-300ms) between input field events.',
      mutationDetails: 'Developed in response to static inter-key velocity filters. Introduced Gaussian delay distributions to mimic human keypress hold times.',
      children: [
        {
          id: 'dna-strain-1a',
          name: 'Pattern A1: Bezier Mouse Curve Emulation',
          discoveredDate: 'Jul 28, 2026',
          severity: 'high',
          description: 'Synthesizes cubic Bezier curve trajectories for mouse movements to bypass simple cursor coordinate anomaly detectors.',
          mutationDetails: 'Calculates dynamic anchor points and deceleration curves around target buttons to emulate human muscle tremor.',
          children: [
            {
              id: 'dna-strain-1a1',
              name: 'Pattern A1.1: Rehearsal Probe Branch',
              discoveredDate: 'Aug 04, 2026',
              severity: 'critical',
              description: 'Multi-step dry-run staging: tests beneficiary addition and small cancellations to verify fraud rules before full account drain.',
              mutationDetails: 'First observed incorporating intent probing. Probes system balance ceilings and velocity rules 1-4 days prior to attack execution.'
            }
          ]
        },
        {
          id: 'dna-strain-1b',
          name: 'Pattern A2: Subnet Distributed Echo',
          discoveredDate: 'Aug 08, 2026',
          severity: 'critical',
          description: 'Synchronized cross-customer payload dissemination using residential ASN proxy rotation and shared micro-behavioral cadence.',
          mutationDetails: 'Syndicate-level multi-account orchestration spreading identical micro-cadence signatures across unrelated victim accounts.',
          children: [
            {
              id: 'dna-strain-1b1',
              name: 'Pattern A2.1.1 (FD-047): Polymorphic Echo & Clipboard Blast',
              discoveredDate: 'Aug 14, 2026',
              severity: 'critical',
              description: 'State-of-the-art evasive strain combining micro-cancellations, curved mouse jitter, and sub-0.4s clipboard bursts.',
              mutationDetails: 'Extreme stealth hybrid. Bypasses 98% of legacy static rule engines; captured exclusively through AegisBio behavioral DNA graph analysis.'
            }
          ]
        }
      ]
    },
    {
      id: 'dna-strain-2',
      name: 'Pattern B: Coercion & Human Operator Strain',
      discoveredDate: 'Jul 2026',
      severity: 'high',
      description: 'Human-operated attacks under live telecom scam guidance or remote-desktop social engineering.',
      mutationDetails: 'Characterized by extreme hesitation pauses (>6s), irregular backspace bursts, and nocturnal timing spikes.',
      children: [
        {
          id: 'dna-strain-2a',
          name: 'Pattern B1 (FD-114): Circadian Tremor & Agitation',
          discoveredDate: 'Aug 10, 2026',
          severity: 'high',
          description: 'Panic cadence exhibited by legitimate account holders under phone coercion during 02:00-05:00 AM windows.',
          mutationDetails: 'Biometric pressure and hesitation spikes indicate psychological duress; dynamic AI intervention triggers protective cooling delay.'
        }
      ]
    }
  ]
};

export const MOCK_DNA_SIGNATURES: FraudDnaSignature[] = [
  {
    id: 'sig-1',
    code: 'FD-047',
    name: 'Rapid Rehearsal Transfer Loop',
    category: 'Rehearsal Sequence',
    severity: 'critical',
    description: 'Beneficiary revisit >= 3 times, cancellation >= 2 times, and decision latency < 1.0s on high-value transfer.',
    ruleDefinitionYaml: `rule_id: FD-047
name: Rapid_Rehearsal_Transfer_Loop
version: 2.4.0
threat_category: INTENT_REHEARSAL
confidence_threshold: 0.94
conditions:
  - match_all:
      - field: session.rehearsal_sequence_detected
        operator: equals
        value: true
      - field: session.pre_txn_cancellation_count
        operator: gte
        value: 2
      - field: session.submit_decision_latency_ms
        operator: lte
        value: 1000
      - field: beneficiary.age_in_session_minutes
        operator: lte
        value: 15
actions:
  - trigger_alert: HIGH_SEVERITY
  - inject_challenge: STEP_UP_BIOMETRIC_OR_DELAY
  - tag_cluster: SYNDICATE_REHEARSAL_GROUP`
  },
  {
    id: 'sig-2',
    code: 'FD-052',
    name: 'Clipboard Blast with Zero Hesitation',
    category: 'Input Anomaly',
    severity: 'critical',
    description: 'Pasting entire complex 60+ char address/account payload in <0.45s followed by instantaneous form tab progression.',
    ruleDefinitionYaml: `rule_id: FD-052
name: Clipboard_Blast_Zero_Hesitation
version: 1.8.0
threat_category: CLIPBOARD_INJECTION
confidence_threshold: 0.91
conditions:
  - match_all:
      - field: input.paste_duration_ms
        operator: lte
        value: 450
      - field: input.inter_keystroke_event_count
        operator: equals
        value: 0
      - field: input.next_field_hop_latency_ms
        operator: lte
        value: 200
actions:
  - trigger_alert: ELEVATED_SEVERITY
  - calculate_dna_mutation: true
  - quarantine_outward_wire: true`
  },
  {
    id: 'sig-3',
    code: 'FD-089',
    name: 'Synthetic Cadence & Low-Entropy Flight',
    category: 'Robotic Cadence',
    severity: 'critical',
    description: 'Inter-key flight time variance <10ms across 40 keystrokes (robotic script execution mimicking human typing).',
    ruleDefinitionYaml: `rule_id: FD-089
name: Synthetic_Cadence_Low_Entropy
version: 3.1.2
threat_category: SCRIPT_AUTOMATION
confidence_threshold: 0.98
conditions:
  - match_all:
      - field: biometrics.flight_time_variance_ms
        operator: lte
        value: 12
      - field: biometrics.total_keystrokes_captured
        operator: gte
        value: 30
      - field: biometrics.key_hold_time_standard_deviation
        operator: lte
        value: 4.5
actions:
  - trigger_alert: CRITICAL_BLOCK
  - immediate_action: AUTO_BLOCK_SESSION
  - notify_soc_analysts: true`
  },
  {
    id: 'sig-4',
    code: 'FD-102',
    name: 'Zero-Day Account Liquidation Probe',
    category: 'Zero-Day Pattern',
    severity: 'critical',
    description: 'Immediate balance check followed by transfer amount set to 95-99% of total liquid funds within 18s of login.',
    ruleDefinitionYaml: `rule_id: FD-102
name: Zero_Day_Account_Liquidation_Probe
version: 1.0.0
threat_category: LIQUIDATION_PROBE
confidence_threshold: 0.96
conditions:
  - match_all:
      - field: transaction.balance_drain_ratio
        operator: gte
        value: 0.95
      - field: session.duration_until_payment_sec
        operator: lte
        value: 25
      - field: session.has_prior_balance_check
        operator: equals
        value: true
actions:
  - trigger_alert: CRITICAL_EMERGENCY
  - freeze_payout_rail: UPI_AND_IMPS
  - trigger_automated_owner_callback: true`
  },
  {
    id: 'sig-5',
    code: 'FD-114',
    name: 'Circadian Agitation & Coercion Cadence',
    category: 'Human Duress / Scam',
    severity: 'high',
    description: 'Extreme hesitation spikes (>6s) combined with repeated field corrections during off-peak hours (02:00-05:00 AM).',
    ruleDefinitionYaml: `rule_id: FD-114
name: Circadian_Agitation_Coercion_Cadence
version: 2.0.1
threat_category: TELECOM_SCAM_COERCION
confidence_threshold: 0.86
conditions:
  - match_all:
      - field: session.local_hour
        operator: in_range
        value: [2, 5]
      - field: biometrics.mean_hesitation_sec
        operator: gte
        value: 5.5
      - field: input.backspace_count
        operator: gte
        value: 6
actions:
  - trigger_alert: SOCIAL_ENGINEERING_PROTECTION
  - soft_delay_hours: 4
  - display_scam_warning_modal: true`
  }
];

// Aliases for component imports
export const MOCK_TELLS = MOCK_FRAUD_TELLS;
export const MOCK_ZERO_DAYS = MOCK_ZERO_DAY_INCIDENTS;
export const MOCK_ECHO_PROPAGATIONS = MOCK_CROSS_CUSTOMER_ECHO;
export const MOCK_DOPPELGANGER_CLUSTERS = MOCK_BEHAVIORAL_CLUSTERS;

