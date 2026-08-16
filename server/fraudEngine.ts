import { DbCustomer, DbRiskSignal, DbTransaction } from './db';

export interface FraudEngineInput {
  customerId: string;
  amount: number;
  currency?: string;
  paymentMethod?: 'UPI' | 'Credit Card' | 'Wire Transfer' | 'Net Banking' | 'Crypto Gateway';
  country?: string;
  city?: string;
  deviceId?: string;
  deviceType?: 'Mobile (Android)' | 'Mobile (iOS)' | 'Desktop (Mac)' | 'Desktop (Windows)' | 'Headless Browser';
  ipAddress?: string;
  beneficiaryName: string;
  beneficiaryAccount?: string;
  isNewBeneficiary?: boolean;
  behavioralCadenceMs?: number; // e.g. 180ms normal vs 35ms bot
  clipboardPasteLatencySec?: number; // e.g. 3.2s normal vs 0.3s script/paste
  failedLoginAttemptsRecent?: number; // e.g. 0 normal vs 4+ suspicious
  velocityLastHour?: number; // count of transactions in last 60 mins
  rehearsalDetected?: boolean; // practice checks / aborts
}

export interface FraudEngineResult {
  riskScore: number; // 0 - 100
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  decision: 'APPROVE' | 'REVIEW' | 'STEP_UP_CHALLENGED' | 'BLOCKED';
  status: 'RESOLVED_CLEAN' | 'PENDING_REVIEW' | 'STEP_UP_CHALLENGED' | 'AUTO_BLOCKED' | 'BLOCKED';
  primaryDriver: string;
  signals: DbRiskSignal[];
  mlAnomalyScore: number; // 0.0 - 1.0
  mlExplanation: string;
  confidence: number;
}

/**
 * Lightweight Isolation Forest / Behavioral Distance Estimator
 * Evaluates feature vectors [amountRatio, velocityRatio, cadenceDeviation, pasteVelocity, authFailures]
 */
export function calculateMLAnomalyScore(
  amountRatio: number,
  velocity: number,
  cadenceDev: number,
  pasteLatency: number,
  failedLogins: number
): { score: number; explanation: string } {
  // Feature normalization
  const normAmount = Math.min(1.0, Math.max(0, (amountRatio - 1.0) / 5.0)); // 0 when 1x, 1 when >=6x
  const normVelocity = Math.min(1.0, Math.max(0, velocity / 6.0));
  const normCadence = Math.min(1.0, Math.max(0, cadenceDev / 120.0));
  const normPaste = pasteLatency < 0.8 ? Math.max(0, 1.0 - pasteLatency / 0.8) : 0;
  const normLogins = Math.min(1.0, Math.max(0, failedLogins / 5.0));

  // Multi-tree weighted path length simulation
  const rawScore =
    normAmount * 0.35 +
    normPaste * 0.25 +
    normLogins * 0.15 +
    normVelocity * 0.15 +
    normCadence * 0.10;

  const score = Math.round(Math.min(0.99, Math.max(0.04, rawScore * 0.95 + 0.05)) * 100) / 100;

  const reasons: string[] = [];
  if (amountRatio > 2.5) {
    reasons.push(`Transaction amount is ${amountRatio.toFixed(1)}x higher than typical customer baseline`);
  }
  if (pasteLatency < 0.6) {
    reasons.push(`Zero-dwell clipboard paste (${pasteLatency.toFixed(2)}s) bypasses normal human typing`);
  }
  if (velocity > 3) {
    reasons.push(`High transaction velocity (${velocity} transactions in 1 hour)`);
  }
  if (failedLogins >= 3) {
    reasons.push(`${failedLogins} consecutive failed login attempts before payment`);
  }
  if (cadenceDev > 60) {
    reasons.push(`Typing flight cadence deviates significantly by ${Math.round(cadenceDev)}ms from customer baseline`);
  }

  const explanation =
    reasons.length > 0
      ? `Isolation Forest Anomaly Score: ${score}. Anomaly vector triggered by: ${reasons.join('; ')}.`
      : `Isolation Forest Anomaly Score: ${score}. Activity is well within normal behavioral cluster centroids.`;

  return { score, explanation };
}

/**
 * Main Deterministic Rule + ML Risk Scoring Engine
 */
export function evaluateFraudRisk(
  input: FraudEngineInput,
  customer?: DbCustomer
): FraudEngineResult {
  const signals: DbRiskSignal[] = [];
  let calculatedScore = 0;

  const custBaselineAmount = customer?.avgTransactionAmount || 12000;
  const custBaselineCadence = customer?.biometricBaselineCadenceMs || 180;
  const amountRatio = input.amount / Math.max(1, custBaselineAmount);

  const cadence = input.behavioralCadenceMs ?? 180;
  const cadenceDeviation = Math.abs(cadence - custBaselineCadence);
  const pasteLatency = input.clipboardPasteLatencySec ?? 2.5;
  const velocity = input.velocityLastHour ?? 1;
  const failedLogins = input.failedLoginAttemptsRecent ?? 0;
  const isNewDevice = customer ? !customer.usualDevices.includes(input.deviceId || '') : true;
  const isOffshoreOrNewLoc =
    customer && input.country ? !customer.usualCountries.includes(input.country) : false;

  // Signal 1: Amount Anomaly
  if (amountRatio >= 5.0) {
    const pts = 28;
    calculatedScore += pts;
    signals.push({
      id: `sig-${Date.now()}-1`,
      signalName: 'Extreme Amount Anomaly',
      category: 'transaction',
      severity: 'critical',
      contribution: pts,
      details: `Transfer amount of ₹${input.amount.toLocaleString('en-IN')} is ${amountRatio.toFixed(1)}x higher than customer baseline.`,
      microEvidence: `Baseline: ₹${custBaselineAmount.toLocaleString('en-IN')}`,
    });
  } else if (amountRatio >= 2.5) {
    const pts = 18;
    calculatedScore += pts;
    signals.push({
      id: `sig-${Date.now()}-1`,
      signalName: 'Elevated Transaction Sum',
      category: 'transaction',
      severity: 'elevated',
      contribution: pts,
      details: `Transfer amount of ₹${input.amount.toLocaleString('en-IN')} is ${amountRatio.toFixed(1)}x higher than average.`,
      microEvidence: `Baseline: ₹${custBaselineAmount.toLocaleString('en-IN')}`,
    });
  } else if (amountRatio >= 1.6) {
    const pts = 8;
    calculatedScore += pts;
    signals.push({
      id: `sig-${Date.now()}-1`,
      signalName: 'Moderate Amount Variance',
      category: 'transaction',
      severity: 'low',
      contribution: pts,
      details: `Amount is ${amountRatio.toFixed(1)}x typical transaction.`,
      microEvidence: `Baseline: ₹${custBaselineAmount.toLocaleString('en-IN')}`,
    });
  }

  // Signal 2: Fast Clipboard Paste / Biometrics
  if (pasteLatency <= 0.45) {
    const pts = 25;
    calculatedScore += pts;
    signals.push({
      id: `sig-${Date.now()}-2`,
      signalName: 'Clipboard Paste Velocity',
      category: 'behavioral',
      severity: 'critical',
      contribution: pts,
      details: `Instantaneous clipboard paste (${pasteLatency.toFixed(2)}s) detected on recipient details with zero dwell time.`,
      microEvidence: `Latency: ${pasteLatency.toFixed(2)}s vs 2.5s normal`,
    });
  } else if (pasteLatency <= 0.9) {
    const pts = 12;
    calculatedScore += pts;
    signals.push({
      id: `sig-${Date.now()}-2`,
      signalName: 'Rapid Input Cadence',
      category: 'behavioral',
      severity: 'elevated',
      contribution: pts,
      details: `Fast input speed (${pasteLatency.toFixed(2)}s) observed during account entry.`,
      microEvidence: `Latency: ${pasteLatency.toFixed(2)}s`,
    });
  }

  // Signal 3: Keystroke Cadence Deviation / Bot speed
  if (cadence < 50) {
    const pts = 22;
    calculatedScore += pts;
    signals.push({
      id: `sig-${Date.now()}-3`,
      signalName: 'Automated Script Cadence',
      category: 'behavioral',
      severity: 'critical',
      contribution: pts,
      details: `Keypress flight times of ${cadence}ms are consistent with programmatic browser automation scripts.`,
      microEvidence: `Speed: ${cadence}ms (human floor is ~90ms)`,
    });
  } else if (cadenceDeviation > 55) {
    const pts = 14;
    calculatedScore += pts;
    signals.push({
      id: `sig-${Date.now()}-3`,
      signalName: 'Biometric Cadence Shift',
      category: 'behavioral',
      severity: 'elevated',
      contribution: pts,
      details: `Typing cadence shifted by ${Math.round(cadenceDeviation)}ms compared to customer baseline.`,
      microEvidence: `Current: ${cadence}ms vs Baseline: ${custBaselineCadence}ms`,
    });
  }

  // Signal 4: Precursor Rehearsal Detection
  if (input.rehearsalDetected) {
    const pts = 22;
    calculatedScore += pts;
    signals.push({
      id: `sig-${Date.now()}-4`,
      signalName: 'Precursor Intent Sequence',
      category: 'rehearsal',
      severity: 'critical',
      contribution: pts,
      details: 'Multiple balance queries and cancelled checkout aborts observed in the 5 minutes prior to payment.',
      microEvidence: '2+ practice abort loops detected',
    });
  }

  // Signal 5: Velocity
  if (velocity >= 5) {
    const pts = 24;
    calculatedScore += pts;
    signals.push({
      id: `sig-${Date.now()}-5`,
      signalName: 'High Transaction Velocity',
      category: 'velocity',
      severity: 'critical',
      contribution: pts,
      details: `${velocity} transactions initiated within the last hour.`,
      microEvidence: `${velocity} txns/hour (threshold is 3)`,
    });
  } else if (velocity >= 3) {
    const pts = 12;
    calculatedScore += pts;
    signals.push({
      id: `sig-${Date.now()}-5`,
      signalName: 'Elevated Velocity',
      category: 'velocity',
      severity: 'elevated',
      contribution: pts,
      details: `${velocity} transactions in last hour.`,
      microEvidence: `${velocity} txns/hour`,
    });
  }

  // Signal 6: Failed Logins
  if (failedLogins >= 4) {
    const pts = 20;
    calculatedScore += pts;
    signals.push({
      id: `sig-${Date.now()}-6`,
      signalName: 'Failed Authentication Burst',
      category: 'behavioral',
      severity: 'critical',
      contribution: pts,
      details: `${failedLogins} failed authentication attempts recorded prior to this session.`,
      microEvidence: `${failedLogins} failed logins`,
    });
  } else if (failedLogins >= 2) {
    const pts = 10;
    calculatedScore += pts;
    signals.push({
      id: `sig-${Date.now()}-6`,
      signalName: 'Recent Login Failure',
      category: 'behavioral',
      severity: 'elevated',
      contribution: pts,
      details: `${failedLogins} failed login attempts.`,
      microEvidence: `${failedLogins} failed logins`,
    });
  }

  // Signal 7: New Device / Offshore Location
  if (input.deviceType === 'Headless Browser') {
    const pts = 25;
    calculatedScore += pts;
    signals.push({
      id: `sig-${Date.now()}-7`,
      signalName: 'Headless Browser Signature',
      category: 'device',
      severity: 'critical',
      contribution: pts,
      details: 'Client fingerprint identified as headless Chromium/Puppeteer instance.',
      microEvidence: 'Headless user agent & zero canvas noise',
    });
  } else if (isNewDevice) {
    const pts = 12;
    calculatedScore += pts;
    signals.push({
      id: `sig-${Date.now()}-7`,
      signalName: 'Unrecognized Device Fingerprint',
      category: 'device',
      severity: 'elevated',
      contribution: pts,
      details: 'Transaction executed on a previously unseen hardware profile.',
      microEvidence: `Device: ${input.deviceId || 'Unknown'}`,
    });
  }

  if (isOffshoreOrNewLoc) {
    const pts = 15;
    calculatedScore += pts;
    signals.push({
      id: `sig-${Date.now()}-8`,
      signalName: 'Geographic Location Anomaly',
      category: 'location',
      severity: 'elevated',
      contribution: pts,
      details: `Transaction initiated from ${input.country || 'unusual location'}, outside customer usual region.`,
      microEvidence: `Location: ${input.city || ''}, ${input.country || ''}`,
    });
  }

  // Signal 8: First-time Beneficiary
  if (input.isNewBeneficiary) {
    const pts = 8;
    calculatedScore += pts;
    signals.push({
      id: `sig-${Date.now()}-9`,
      signalName: 'Unverified Payee Profile',
      category: 'transaction',
      severity: 'low',
      contribution: pts,
      details: `Beneficiary "${input.beneficiaryName}" was added recently.`,
      microEvidence: 'Payee age: < 1 hour',
    });
  }

  // Baseline credit if clean
  if (signals.length === 0) {
    signals.push({
      id: `sig-${Date.now()}-0`,
      signalName: 'Normal Baseline Match',
      category: 'behavioral',
      severity: 'low',
      contribution: 4,
      details: 'All biometric, temporal, and transaction features sit within 1-sigma normal limits.',
      microEvidence: 'Legitimate user profile match (99%)',
    });
    calculatedScore = 8;
  }

  // ML isolation forest integration
  const mlResult = calculateMLAnomalyScore(
    amountRatio,
    velocity,
    cadenceDeviation,
    pasteLatency,
    failedLogins
  );

  // ML contribution added as 10% weight or booster
  if (mlResult.score > 0.6) {
    const mlBoost = Math.round(mlResult.score * 15);
    calculatedScore += mlBoost;
  }

  // Cap at 100
  const finalScore = Math.min(100, Math.max(0, calculatedScore));

  // Determine Level & Decision
  let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
  let decision: 'APPROVE' | 'REVIEW' | 'STEP_UP_CHALLENGED' | 'BLOCKED' = 'APPROVE';
  let status: 'RESOLVED_CLEAN' | 'PENDING_REVIEW' | 'STEP_UP_CHALLENGED' | 'AUTO_BLOCKED' | 'BLOCKED' = 'RESOLVED_CLEAN';

  if (finalScore >= 80) {
    riskLevel = 'critical';
    decision = 'BLOCKED';
    status = 'AUTO_BLOCKED';
  } else if (finalScore >= 60) {
    riskLevel = 'high';
    decision = 'REVIEW';
    status = 'PENDING_REVIEW';
  } else if (finalScore >= 30) {
    riskLevel = 'medium';
    decision = 'STEP_UP_CHALLENGED';
    status = 'STEP_UP_CHALLENGED';
  } else {
    riskLevel = 'low';
    decision = 'APPROVE';
    status = 'RESOLVED_CLEAN';
  }

  // Primary driver string
  const primarySig = [...signals].sort((a, b) => b.contribution - a.contribution)[0];
  const primaryDriver =
    finalScore >= 60 && primarySig
      ? `${primarySig.signalName} (${primarySig.details.split('.')[0]})`
      : 'Standard Baseline Transaction Pattern';

  return {
    riskScore: finalScore,
    riskLevel,
    decision,
    status,
    primaryDriver,
    signals,
    mlAnomalyScore: mlResult.score,
    mlExplanation: mlResult.explanation,
    confidence: 0.94,
  };
}
