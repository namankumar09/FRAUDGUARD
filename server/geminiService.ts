import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { DbCase, DbCustomer, DbTransaction } from './db';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

export function isAiReady(): boolean {
  return !!ai;
}

/**
 * AI Assistant Chat
 */
export async function generateAssistantReply(
  userMessage: string,
  history: Array<{ role: 'user' | 'assistant'; content: string }>,
  currentContext?: {
    view?: string;
    transactionId?: string;
    customerId?: string;
    caseId?: string;
  }
): Promise<string> {
  if (!ai) {
    // Intelligent domain fallback
    const lower = userMessage.toLowerCase();
    if (lower.includes('alert') || lower.includes('investigat')) {
      return "To investigate an alert in FraudGuard:\n1. Open 'Alerts & Investigations' from the left sidebar.\n2. Click on any alert (e.g. Critical or High Risk).\n3. Review the trigger reason (e.g. fast clipboard paste or high velocity).\n4. Choose an action: Quarantine to block immediately, Step-Up for OTP verification, or create a Case.";
    }
    if (lower.includes('transaction') || lower.includes('payment') || lower.includes('flag')) {
      return "To review a payment:\n1. Open 'Check Transactions' in the navigation.\n2. Filter by High Risk or Suspicious to find anomalies.\n3. Click on the transaction row to inspect the real signals, ML anomaly score, and customer baseline.\n4. Click 'Block' or 'Step-Up OTP' to take real action.";
    }
    if (lower.includes('customer') || lower.includes('profile')) {
      return "To check customer identity:\n1. Go to 'Customer Profiles'.\n2. Search the customer name or ID.\n3. Compare their biometric typing cadence baseline against their latest session.\n4. If there's an abrupt deviation, it signals potential account takeover.";
    }
    if (lower.includes('score') || lower.includes('risk score') || lower.includes('what does')) {
      return "FraudGuard Risk Scores explained:\n• 0–29 (Low): Safe, legitimate activity aligned with customer baseline.\n• 30–59 (Medium): Minor anomaly detected (e.g. slight amount shift). Requires Step-Up challenge.\n• 60–79 (High): Serious indicators (e.g. novel device + rapid paste). Analyst review required.\n• 80–100 (Critical): Severe fraud signals (e.g. headless bot + rehearsal aborts). Automatically blocked.";
    }
    return "I am the FraudGuard AI Assistant! Ask me anything about investigating alerts, reviewing transactions, checking customer typing biometrics, or creating investigation cases.";
  }

  try {
    const systemPrompt = `You are FraudGuard Assistant, the expert AI for FraudGuard (an enterprise AI behavioural fraud detection & risk intelligence platform).
Your role is to explain fraud signals, guide analysts step-by-step, explain risk scores, and answer questions in simple, friendly, professional English.
Never use complicated jargon without immediately explaining it.
Current UI Context: ${JSON.stringify(currentContext || {})}
If the user asks why something was flagged, explain the specific factors (amount vs baseline, clipboard paste velocity, device fingerprint, rehearsal aborts, ML anomaly score).
Keep answers concise, clear, and actionable with numbered steps where appropriate.`;

    const chatText = (history || [])
      .slice(-6)
      .map((h) => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.content}`)
      .join('\n');

    const fullPrompt = `${systemPrompt}\n\nChat History:\n${chatText}\n\nUser Question: ${userMessage}\n\nAssistant Response:`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: fullPrompt,
    });

    return response.text || 'I am ready to help you analyze fraud risk and navigate FraudGuard.';
  } catch (err) {
    console.error('[Gemini] Assistant error:', err);
    return "FraudGuard helps you find unusual transactions, check customer profiles, and investigate suspicious alerts. You can open any transaction to see its complete risk breakdown.";
  }
}

/**
 * Explain Risk for a specific transaction
 */
export async function explainTransactionRisk(
  txn: DbTransaction,
  cust?: DbCustomer
): Promise<{
  summary: string;
  keyDrivers: string[];
  recommendedAction: string;
  investigatorNotes: string;
}> {
  if (!ai) {
    return {
      summary: `Transaction ${txn.id} was flagged with a risk score of ${txn.riskScore}/100 (${txn.riskLevel.toUpperCase()}). The primary driver is "${txn.primaryDriver}". The transfer of ₹${txn.amount.toLocaleString('en-IN')} is ${(txn.amount / Math.max(1, cust?.avgTransactionAmount || 12000)).toFixed(1)}x higher than typical customer spending.`,
      keyDrivers: txn.signals.map((s) => `${s.signalName}: ${s.details}`),
      recommendedAction:
        txn.riskScore >= 80
          ? 'Quarantine transaction immediately and freeze outbound payee settlements.'
          : txn.riskScore >= 60
          ? 'Trigger mandatory step-up biometric KYC challenge and request customer confirmation.'
          : 'Approve transaction; activity is within tolerable baseline variance.',
      investigatorNotes: `Check whether device ${txn.deviceId} matches any known bot syndicate clusters in Doppelgänger detection.`,
    };
  }

  try {
    const prompt = `You are a Senior Financial Crimes & Forensic Fraud Intelligence AI.
Analyze this transaction and produce a clear, professional investigator explanation.

Transaction Details:
${JSON.stringify({
  id: txn.id,
  customerName: txn.customerName,
  amount: txn.amount,
  currency: txn.currency,
  paymentMethod: txn.paymentMethod,
  country: txn.country,
  deviceId: txn.deviceId,
  deviceType: txn.deviceType,
  riskScore: txn.riskScore,
  riskLevel: txn.riskLevel,
  decision: txn.decision,
  primaryDriver: txn.primaryDriver,
  signals: txn.signals,
  mlAnomalyScore: txn.mlAnomalyScore,
  behavioralCadenceMs: txn.behavioralCadenceMs,
  clipboardPasteLatencySec: txn.clipboardPasteLatencySec,
  failedLoginAttempts: txn.failedLoginAttemptsRecent,
  customerBaselineAmount: cust?.avgTransactionAmount,
})}

Respond in strict JSON format with:
- "summary": (2-3 concise sentences explaining why the payment was flagged in plain English)
- "keyDrivers": (array of 3-4 bullet strings highlighting the most dangerous signals)
- "recommendedAction": (clear instruction: Block, Step-Up Challenge, or Approve)
- "investigatorNotes": (actionable advice for the human analyst)`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return {
      summary: parsed.summary || `Transaction evaluated with risk score ${txn.riskScore}/100.`,
      keyDrivers: Array.isArray(parsed.keyDrivers) ? parsed.keyDrivers : txn.signals.map((s) => s.signalName),
      recommendedAction: parsed.recommendedAction || (txn.riskScore >= 70 ? 'Block / Quarantine' : 'Step-Up OTP'),
      investigatorNotes: parsed.investigatorNotes || 'Review recent session logs.',
    };
  } catch (err) {
    console.error('[Gemini] Explain risk error:', err);
    return {
      summary: `Transaction ${txn.id} has a calculated risk score of ${txn.riskScore}/100. Key factor: ${txn.primaryDriver}.`,
      keyDrivers: txn.signals.map((s) => s.signalName),
      recommendedAction: txn.riskScore >= 70 ? 'Block transaction' : 'Review customer details',
      investigatorNotes: 'Verify customer contact details.',
    };
  }
}

/**
 * Summarize Customer Behavior Profile
 */
export async function summarizeCustomerProfile(
  customer: DbCustomer,
  recentTxns: DbTransaction[]
): Promise<string> {
  if (!ai) {
    return `Customer ${customer.name} (${customer.id}) has been active for ${customer.accountAgeDays} days with ${customer.transactionCount} total transactions (₹${customer.totalAmount.toLocaleString('en-IN')}). Current risk status is ${customer.status} with a risk score of ${customer.riskScore}/100. Baseline typing cadence is ${customer.biometricBaselineCadenceMs}ms. ${customer.behaviorSummary}`;
  }

  try {
    const prompt = `You are a Fraud Intelligence Analyst AI.
Write a clear 3-paragraph behavioral profile summary of this bank customer for an investigation dossier.

Customer:
${JSON.stringify({
  id: customer.id,
  name: customer.name,
  country: customer.country,
  accountAgeDays: customer.accountAgeDays,
  riskScore: customer.riskScore,
  riskLevel: customer.riskLevel,
  transactionCount: customer.transactionCount,
  avgAmount: customer.avgTransactionAmount,
  status: customer.status,
  biometricCadence: customer.biometricBaselineCadenceMs,
  behaviorSummary: customer.behaviorSummary,
  recentTransactions: recentTxns.slice(0, 5).map((t) => ({
    id: t.id,
    amount: t.amount,
    riskScore: t.riskScore,
    decision: t.decision,
    primaryDriver: t.primaryDriver,
  })),
})}

Provide plain, professional, executive-ready text.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
    });

    return response.text || customer.behaviorSummary;
  } catch (err) {
    return customer.behaviorSummary;
  }
}

/**
 * Summarize Investigation Case
 */
export async function summarizeInvestigationCase(
  caseItem: DbCase,
  relatedTxns: DbTransaction[],
  relatedCusts: DbCustomer[]
): Promise<string> {
  if (!ai) {
    return `Investigation Case ${caseItem.caseRef} ("${caseItem.title}") is currently ${caseItem.status.toUpperCase()} with ${caseItem.priority.toUpperCase()} priority, assigned to ${caseItem.assignedTo}. It links ${relatedTxns.length} transactions totaling ₹${relatedTxns.reduce((a, b) => a + b.amount, 0).toLocaleString('en-IN')} across ${relatedCusts.length} accounts. Case description: ${caseItem.description}`;
  }

  try {
    const prompt = `You are a Lead Financial Crimes Case Summarizer.
Generate a structured case executive briefing for this fraud investigation.

Case Data:
${JSON.stringify({
  ref: caseItem.caseRef,
  title: caseItem.title,
  description: caseItem.description,
  priority: caseItem.priority,
  status: caseItem.status,
  assignedTo: caseItem.assignedTo,
  tags: caseItem.tags,
  notes: caseItem.notes,
  transactions: relatedTxns.map((t) => ({ id: t.id, amount: t.amount, risk: t.riskScore, driver: t.primaryDriver })),
  customers: relatedCusts.map((c) => ({ id: c.id, name: c.name, risk: c.riskScore })),
})}

Format with:
- Case Overview
- Key Evidence & Behavioral Anomaly Breakdown
- Current Status & Recommended Next Milestones`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
    });

    return response.text || caseItem.description;
  } catch (err) {
    return caseItem.description;
  }
}
