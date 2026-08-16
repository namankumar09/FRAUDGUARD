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
 * Behavioral signal knowledge base — mechanism-first explanations the assistant
 * draws on so it explains WHY a signal indicates fraud or legitimacy, not just
 * a dictionary definition and never a UI click-through.
 */
const SIGNAL_KNOWLEDGE_BASE = `
BEHAVIORAL SIGNAL KNOWLEDGE BASE (use to explain mechanisms, never as a raw definition dump):
- Keystroke Flight Variance / inter-key timing: the spread of time between consecutive keystrokes. Genuine humans produce irregular, biomechanically-driven timing (commonly 25-50ms+ variance). Scripted/bot input is generated programmatically and lands near-uniform (often under ~10ms variance) because there is no hand moving between keys. Near-zero variance is one of the strongest automation signals available.
- Digraph consistency (timing for specific two-character sequences, e.g. "th", "he"): real people have a distinct, repeatable timing "signature" per character pair from biomechanical hand movement; scripted input has no such signature.
- Clipboard Paste Latency / immediate paste on focus: how quickly a paste event happens after a field is focused. Genuine users usually look at a field before entering data; a paste landing within ~500ms of focus, before any typing, indicates an automated fill rather than a human reviewing the field.
- Field order deviation: how far the actual fill order deviates from the visual top-to-bottom form order. Humans skip around and jump back to fix earlier fields; scripts iterate a fixed field list in rigid order, so near-zero deviation is a strong automation indicator.
- Backspace / correction rate: corrections per keystroke. Humans make natural typos and fix them; a rate near zero on a long field is atypical for real typing.
- Focus loss count: how many times focus left the form before submit (e.g. switching to another tab/app). Elevated counts can indicate a multi-window fraud workflow or scripted context-switching.
- Mouse movement count: raw pointer motion during the session. Very low motion alongside otherwise-normal keyboard activity can suggest headless/automated input, since real users generate incidental mouse movement even when mostly typing.
- Field revisit count: how many times a filled field was returned to. Humans revisit to double-check or correct; scripts fill each field exactly once.
- Device Fingerprint Collision: multiple distinct customer accounts sharing the same canvas/device fingerprint within a short window — a strong indicator of a bot farm or mule network on shared infrastructure.
- Precursor / Rehearsal Sequence: balance checks, cancel/retry loops, or limit probes shortly before a transaction. Genuine users rarely "rehearse" a payment; repeated abort-then-retry patterns suggest the actor is testing detection thresholds.
- ML Anomaly Score: the model's own confidence (0.0-1.0) that a session deviates from the customer's established baseline, calibrated directly from the model's decision boundary — it can never contradict the final risk tier, because the tier is derived from this score.
- Risk Score (0-100): the calibrated combination of every signal's weighted contribution — the model's own output, not an arbitrary human scale.
`;

/**
 * AI Assistant Chat
 */
export async function generateAssistantReply(
  userMessage: string,
  history: Array<{ role: 'user' | 'assistant'; content: string }>,
  currentContext?: {
    view?: string;
    transaction?: {
      id?: string;
      transactionRef?: string;
      amount?: number;
      currency?: string;
      riskScore?: number;
      riskLevel?: string;
      decision?: string;
      primaryDriver?: string;
      confidence?: number;
      fraudGravityScore?: number;
      signals?: Array<{
        signalName?: string;
        category?: string;
        contribution?: number;
        status?: string;
        details?: string;
        microEvidence?: string;
      }>;
    };
    customerId?: string;
    caseId?: string;
  }
): Promise<string> {
  const txn = currentContext?.transaction;

  if (!ai) {
    // Grounded fallback when Gemini isn't configured: use real context data if present.
    if (txn && txn.riskScore !== undefined) {
      const topSignals = (txn.signals || [])
        .slice()
        .sort((a, b) => (b.contribution || 0) - (a.contribution || 0))
        .slice(0, 3);
      const signalLines = topSignals
        .map(
          (s) =>
            `- **${s.signalName}** (${s.category}, contribution +${s.contribution}, ${s.status}): ${s.details}${
              s.microEvidence ? ` — evidence: ${s.microEvidence}` : ''
            }`
        )
        .join('\n');
      return `This session (${txn.transactionRef || txn.id}) has a risk score of **${txn.riskScore}/100** (${(txn.riskLevel || '').toUpperCase()}), decision: **${txn.decision}**.\n\nThe primary driver is **${txn.primaryDriver}**. Top contributing signals:\n${signalLines || '- No signal breakdown available for this session.'}\n\nEach signal is weighted by how far it deviates from this customer's own established baseline — that combined deviation is what produces the ${txn.riskScore}/100 score.`;
    }
    const lower = userMessage.toLowerCase();
    if (lower.includes('score') || lower.includes('risk score') || lower.includes('what does')) {
      return "FraudGuard's risk score (0-100) is a calibrated combination of every behavioral signal's weighted contribution — not an arbitrary scale.\n- **0-29 (Low)**: activity aligned with the customer's established baseline.\n- **30-59 (Medium)**: a measurable deviation (e.g. a timing or paste-pattern anomaly) requiring step-up verification.\n- **60-79 (High)**: multiple compounding signals (e.g. near-zero keystroke variance plus a device fingerprint collision) requiring analyst review.\n- **80-100 (Critical)**: severe, high-confidence automation or account-takeover signals — auto-blocked.\n\nOpen a specific transaction or session and ask me \"why was this flagged\" and I'll walk through its actual numbers.";
    }
    return "I'm the FraudGuard Assistant — open a specific transaction, alert, or onboarding session and ask me why it was flagged; I'll explain the actual signals and numbers behind that decision, not just how to click around the UI.";
  }

  try {
    const contextBlock = txn
      ? `CURRENT SESSION/TRANSACTION IN VIEW (real data — you MUST ground your answer in these exact values when relevant, never invent numbers, never describe UI navigation to "find" this data since it's already provided here):
${JSON.stringify(txn, null, 2)}
`
      : `No specific transaction/session is currently in view (context: ${JSON.stringify({ view: currentContext?.view || 'unknown' })}). If the user asks about a specific session's numbers, ask them to open that transaction first — do not invent numbers.`;

    const systemPrompt = `You are FraudGuard Assistant, the expert AI for FraudGuard (an enterprise behavioral fraud detection & risk intelligence platform).

Your job is to explain the MECHANISM behind fraud signals and risk decisions — what the data actually shows and why it indicates fraud or legitimacy. You are not a UI tour guide: never respond with instructions like "click X in the sidebar" or "open the Y page" unless the user is explicitly asking how to navigate somewhere with no session data available to answer their real question.

${SIGNAL_KNOWLEDGE_BASE}

${contextBlock}

Rules:
- If a transaction/session is in view and the user asks why it was flagged, what its risk means, or anything about "this" session, you MUST cite its exact real values (risk score, risk level, decision, primary driver, and the specific signals with their real contribution/details/microEvidence) and explain the mechanism — e.g. "This session's [signal] shows [real value], which is [why that indicates fraud/legitimacy]," not a generic instruction to go look it up.
- Never fabricate a number that isn't in the provided context.
- Use markdown formatting where it helps: **bold** for key numbers/terms, short bullet lists for multiple signals. Avoid numbered click-through steps.
- Keep answers focused and readable — a few sentences or a short list, not a wall of text.`;

    const chatText = (history || [])
      .slice(-6)
      .map((h) => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.content}`)
      .join('\n');

    const fullPrompt = `${systemPrompt}\n\nChat History:\n${chatText}\n\nUser Question: ${userMessage}\n\nAssistant Response:`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: fullPrompt,
    });

    return response.text || 'I am ready to help you analyze fraud risk in FraudGuard — open a transaction and ask me why it was flagged.';
  } catch (err) {
    console.error('[Gemini] Assistant error:', err);
    return "FraudGuard helps you find unusual transactions, check customer profiles, and investigate suspicious alerts. Open a specific transaction and ask me why it was flagged for a real, data-grounded explanation.";
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
