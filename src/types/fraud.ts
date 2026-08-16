/**
 * AegisBio Behavioral Fraud Intelligence Platform - Type Definitions
 */

export interface UserAccountProfile {
  name: string;
  email: string;
  role: string;
  title: string;
  department: string;
  timezone: string;
  lastActive: string;
  status: string;
  phone?: string;
  securityLevel?: string;
  mfaEnabled?: boolean;
}

export type RiskLevel = 'low' | 'suspicious' | 'high';

export interface KeystrokeMetric {
  key: string;
  timestamp: number;
  holdTimeMs: number;
  flightTimeMs: number;
}

export interface BehavioralBiometrics {
  typingSpeedWPM: number;
  meanKeyHoldDurationMs: number;
  flightTimeVarianceMs: number;
  backspaceCount: number;
  deleteCount: number;
  pasteCount: number;
  pasteLatencyMs: number;
  fieldRevisits: number;
  mouseVelocityMean: number;
  mouseJitterScore: number;
  scrollJerkiness: number;
  hesitationPauseCount: number;
  meanHesitationSec: number;
  formSequenceDeviationScore: number;
  repeatedCorrections: number;
  deviceFingerprint: {
    browser: string;
    os: string;
    screenResolution: string;
    hardwareConcurrency: number;
    touchSupported: boolean;
    ipCountry: string;
    asn: string;
    canvasHash: string;
    incognitoMode: boolean;
  };
}

export interface RiskSignalBreakdown {
  signalName: string;
  category: 'behavioral' | 'device' | 'transaction' | 'interaction' | 'network' | 'rehearsal';
  contribution: number; // e.g. +24
  status: 'normal' | 'elevated' | 'critical';
  details: string;
  microEvidence: string;
}

export interface DynamicRiskScore {
  totalScore: number; // 0 to 100
  riskLevel: RiskLevel;
  breakdown: RiskSignalBreakdown[];
  primaryDriver: string;
  confidence: number;
  fraudGravityScore: number; // 0 to 100
}

export interface PrecursorAction {
  id: string;
  actionSequence: number;
  actionType: string;
  targetElement: string;
  timestampOffsetSec: number; // e.g. -28s, -18s
  durationMs: number;
  anomalyScore: number; // 0 to 100
  isFlaggedPrecursor: boolean;
  behaviorNote: string;
}

export interface BehavioralDNA {
  typingRhythmScore: number; // 0 to 100
  navigationStyle: 'direct' | 'fragmented' | 'hesitant' | 'erratic' | 'scripted';
  averageHesitationSec: number;
  transactionSequencePredictability: number; // %
  fieldTraversalOrder: string[];
  clipboardPasteAffinity: number; // %
  interactionDensity: number;
  rehearsalTendency: number;
}

export interface DnaMutationComparison {
  ownerBaselineDna: BehavioralDNA;
  currentSessionDna: BehavioralDNA;
  overallMutationPercent: number; // e.g. 78%
  keyDivergences: {
    metric: string;
    historical: string | number;
    current: string | number;
    deviation: number;
    unit: string;
  }[];
}

export interface CounterfactualScenario {
  decision: 'approve' | 'step_up_mfa' | 'soft_delay' | 'block';
  label: string;
  estimatedDownstreamExposure: number; // in ₹ INR
  riskReductionPercent: number;
  predictedFraudProbability: number;
  customerFrictionScore: number; // 0-100
  predictedNetworkContagionAccounts: number;
  explanation: string;
}

export interface NextActionPrediction {
  currentStage: string;
  predictedAction: string;
  probability: number;
  probabilityPercent?: number;
  projectedTimeWindowSec: number;
  preemptiveRiskLevel: RiskLevel;
  preemptiveInterventionSuggested: string;
  supportingSignals: string[];
}

export interface TransactionRecord {
  id: string;
  transactionRef: string;
  sessionCode?: string;
  time?: string;
  channel?: string;
  accountMasked?: string;
  deviceName?: string;
  ipAddress?: string;
  timestamp: string;
  customer: {
    id: string;
    name: string;
    email: string;
    accountAgeDays: number;
    tier: 'Retail' | 'HNI' | 'Corporate' | 'Merchant';
    avatarBg: string;
  };
  beneficiary: {
    name: string;
    accountNumberMasked: string;
    bankName: string;
    addedTimestamp: string;
    isNewBeneficiary: boolean;
  };
  amount: number;
  currency: string;
  riskScore: DynamicRiskScore;
  precursorTimeline: PrecursorAction[];
  dnaMutation: DnaMutationComparison;
  operatorConfidence: number; // e.g. 34% (is this the real account owner?)
  counterfactuals: CounterfactualScenario[];
  nextActionPrediction: NextActionPrediction;
  flaggedReasons: string[];
  fraudGravityVectors: {
    name: string;
    weight: number;
    vectorDirection: 'inward' | 'outward';
  }[];
  deviceCollisionsCount?: number;
  rehearsalDetected: boolean;
  discoveredTellCode?: string;
  decision?: 'APPROVE' | 'STEP_UP' | 'QUARANTINE' | 'BLOCKED' | 'PENDING';
  country?: string;
  paymentMethod?: string;
  behavioralBiometrics?: BehavioralBiometrics;
  status: 'PENDING_REVIEW' | 'AUTO_BLOCKED' | 'APPROVED' | 'STEP_UP_CHALLENGED' | 'RESOLVED_CLEAN';
}

export interface FraudTell {
  id: string;
  code: string; // e.g. FD-047
  name: string;
  discoveryDate: string;
  category: 'LATENCY' | 'CLIPBOARD' | 'REHEARSAL' | 'CADENCE' | 'CLUSTER' | 'ZERO_DAY';
  description: string;
  observedCorrelationMultiplier: number; // e.g. 6.2x
  modelConfidencePercent: number; // e.g. 94%
  triggerRule: string;
  occurrencesCount: number;
  status: 'ACTIVE_MONITORING' | 'CANDIDATE_RULE' | 'AUTO_BLOCKED' | 'DEPLOYED_TO_EDGE';
  sampleIncidentId: string;
}

export interface FraudPatternEvolutionWeek {
  week: string;
  dateRange: string;
  patternA: number; // Rapid Script
  patternAB: number; // Script + Human Rehearsal
  patternC: number; // Low-latency Micro-Consolidation
  patternD: number; // Zero-Day Polymorphic Echo
  dominantStrain: string;
  mutationSummary: string;
  mitigationRuleId: string;
}

export interface BehavioralCluster {
  id: string;
  clusterName: string;
  accountCount: number;
  similarityScore: number; // e.g. 92%
  sharedOperatorSignature: string;
  primarySubnet: string;
  typingCadenceFingerprint: string;
  automationProbability: number;
  accounts: {
    accountId: string;
    accountHolder: string;
    transactionAmount: number;
    status: 'Flagged' | 'Under Investigation' | 'Quarantined';
  }[];
  firstSeen: string;
  lastActive: string;
}

export interface BehavioralTimeMachinePoint {
  day: number;
  label: string;
  date: string;
  eventDescription: string;
  typingRhythmDeviation: number;
  navigationFragmentScore: number;
  hesitationShiftSec: number;
  deviceChanged: boolean;
  rehearsalScore: number;
  cumulativeRisk: number;
  earlyWarningTriggered: boolean;
  systemVerdict: string;
}

export interface AdversarialSimulationRound {
  round: number;
  fraudsterStrategy: string;
  evasionTechnique: string;
  simulatedJitterMs: number;
  proxyRotation: boolean;
  detectorIntercepted: boolean;
  detectionConfidence: number;
  blueTeamCounterRule: string;
  armsRaceAdvantage: 'RED_TEAM' | 'BLUE_TEAM';
}

export interface MutationTreeNode {
  id: string;
  name: string;
  discoveredDate: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  mutationDetails: string;
  children?: MutationTreeNode[];
}

export interface FraudDnaSignature {
  id: string;
  code: string;
  name: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  ruleDefinitionYaml: string;
}

export interface DnaTreeNode {
  id: string;
  code: string;
  name: string;
  level: number;
  parentCode?: string;
  mutationDate: string;
  description: string;
  riskFactor: number;
  status: 'Active' | 'Evolving' | 'Mitigated';
  children?: DnaTreeNode[];
}

export interface ZeroDayIncident {
  id: string;
  patternCode: string;
  strainId: string;
  strainName: string;
  discoveredAt: string;
  discoveredTime: string;
  description: string;
  accountsAffected: number;
  affectedAccountsCount: number;
  behavioralSimilarity: number;
  fraudProbability: number;
  connectedDevices: number;
  characteristics: string[];
  candidateRule: string;
  investigatorNotes: string;
  isContained: boolean;
}

export interface CrossCustomerEchoEvent {
  id: string;
  originCustomer: string;
  echoCustomer: string;
  similarityPercent: number;
  lagTimeHours: number;
  propagationPath: string[];
  strainFingerprint: string;
  threatRadius: 'Localized' | 'Spreading' | 'High Velocity Viral';
}
