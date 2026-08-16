import React, { useState, useRef, useEffect } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ChevronRight,
  Shield,
  HelpCircle,
  ExternalLink,
  Minimize2,
  Maximize2,
  RefreshCw
} from 'lucide-react';
import { ViewId } from './Sidebar';
import { TransactionRecord } from '../types/fraud';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedView?: ViewId;
  suggestedViewLabel?: string;
}

interface FraudGuardAssistantProps {
  onNavigate: (view: ViewId) => void;
  activeView?: ViewId;
  selectedTransaction?: TransactionRecord | null;
}

function renderMarkdown(content: string): string {
  const html = marked.parse(content, { breaks: true, async: false }) as string;
  return DOMPurify.sanitize(html);
}

export const FraudGuardAssistant: React.FC<FraudGuardAssistantProps> = ({
  onNavigate,
  activeView,
  selectedTransaction,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content:
        'Hello! I am your FraudGuard Assistant. I can help you understand risk scores, check suspicious transactions, investigate alerts, or find any feature in simple English. What would you like help with today?',
      timestamp: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    { label: 'How do I check a transaction?', query: 'How do I check a transaction in FraudGuard?' },
    { label: 'What does high risk mean?', query: 'What does a high risk score mean and what should I do?' },
    { label: 'How do I investigate an alert?', query: 'How do I investigate an alert step by step?' },
    { label: 'What are similar accounts?', query: 'What are similar accounts (Doppelgänger clusters)?' },
    { label: 'I am not sure where to start', query: 'I am new here. Where should I start in FraudGuard?' },
  ];

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim() || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const context: Record<string, any> = { view: activeView };
      if (selectedTransaction) {
        context.transaction = {
          id: selectedTransaction.id,
          transactionRef: selectedTransaction.transactionRef,
          amount: selectedTransaction.amount,
          currency: selectedTransaction.currency,
          riskScore: selectedTransaction.riskScore.totalScore,
          riskLevel: selectedTransaction.riskScore.riskLevel,
          decision: selectedTransaction.decision || selectedTransaction.status,
          primaryDriver: selectedTransaction.riskScore.primaryDriver,
          confidence: selectedTransaction.riskScore.confidence,
          fraudGravityScore: selectedTransaction.riskScore.fraudGravityScore,
          signals: selectedTransaction.riskScore.breakdown.map((s) => ({
            signalName: s.signalName,
            category: s.category,
            contribution: s.contribution,
            status: s.status,
            details: s.details,
            microEvidence: s.microEvidence,
          })),
        };
      }

      const response = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query.trim(),
          conversationHistory: messages.map((m) => ({ role: m.role, content: m.content })),
          context,
        }),
      });

      const data = await response.json();
      let replyText = data.reply || 'I am here to help. You can check transactions, investigate alerts, or view customer profiles.';
      
      // Determine helpful quick action link based on keywords
      let suggestedView: ViewId | undefined;
      let suggestedViewLabel: string | undefined;
      const lower = query.toLowerCase() + ' ' + replyText.toLowerCase();

      if (lower.includes('transaction') || lower.includes('payment')) {
        suggestedView = 'live_transactions';
        suggestedViewLabel = 'Open Check Transactions';
      } else if (lower.includes('alert') || lower.includes('investigat')) {
        suggestedView = 'precursor_detector';
        suggestedViewLabel = 'Open Alerts & Investigations';
      } else if (lower.includes('customer') || lower.includes('profile')) {
        suggestedView = 'impersonation_detector';
        suggestedViewLabel = 'Open Customer Profiles';
      } else if (lower.includes('similar') || lower.includes('cluster') || lower.includes('bot')) {
        suggestedView = 'doppelganger_cluster';
        suggestedViewLabel = 'Open Find Similar Accounts';
      } else if (lower.includes('guide') || lower.includes('start') || lower.includes('how to')) {
        suggestedView = 'about_guide';
        suggestedViewLabel = 'Open How to Use FraudGuard';
      }

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedView,
        suggestedViewLabel,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content:
          'To review activity, start by clicking "Overview" or "Check Transactions" in the left menu. If an item is marked High Risk, click on it to see why it was flagged and choose an action.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedView: 'overview',
        suggestedViewLabel: 'Open Overview',
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Trigger Button */}
      <button
        id="btn-open-assistant"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-[var(--color-brand-solid)] hover:opacity-90 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 font-sans"
        aria-label="Open FraudGuard Assistant"
      >
        <div className="relative">
          <Bot className="w-5 h-5" />
          <span className="w-2.5 h-2.5 bg-emerald-400 border-2 border-[var(--color-brand-solid)] rounded-full absolute -top-0.5 -right-0.5 animate-pulse" />
        </div>
        <div className="text-left hidden sm:block">
          <div className="text-xs font-bold leading-tight">FraudGuard Assistant</div>
          <div className="text-[10px] text-white/75 font-normal">Ask anything • Simple English</div>
        </div>
      </button>

      {/* Floating Chat Window */}
      {isOpen && (
        <div
          id="assistant-chat-window"
          className="fixed bottom-20 right-4 sm:right-6 w-[94vw] sm:w-[420px] h-[560px] max-h-[82vh] bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200 font-sans"
        >
          {/* Header */}
          <div className="p-3.5 bg-[var(--bg-subtle)] text-[var(--text-primary)] flex items-center justify-between border-b border-[var(--border-color)]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[var(--color-brand)]/10 border border-[var(--color-brand)]/30 flex items-center justify-center text-[var(--color-brand)]">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold tracking-tight flex items-center gap-1.5 text-[var(--text-primary)]">
                  FraudGuard Assistant
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-[var(--color-brand-bg)] text-[var(--color-brand-strong)] border border-[var(--color-brand-border)] font-semibold">
                    AI Online
                  </span>
                </h3>
                <p className="text-[10px] text-[var(--text-muted)]">Ask me anything about using FraudGuard</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() =>
                  setMessages([
                    {
                      id: 'welcome-reset',
                      role: 'assistant',
                      content: 'Chat refreshed! How can I help you use FraudGuard today?',
                      timestamp: 'Just now',
                    },
                  ])
                }
                className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-hover)] transition-colors cursor-pointer"
                title="Clear conversation"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-hover)] transition-colors cursor-pointer"
                title="Close Assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar bg-[var(--bg-app)]/50">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div key={msg.id} className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
                  {!isUser && (
                    <div className="w-7 h-7 rounded-xl bg-[var(--color-brand)]/10 border border-[var(--color-brand)]/30 text-[var(--color-brand)] flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div className={`max-w-[84%] space-y-2`}>
                    <div
                      className={`p-3 rounded-2xl text-xs leading-relaxed ${
                        isUser
                          ? 'bg-[var(--color-brand-solid)] text-white rounded-tr-xs shadow-xs font-medium'
                          : 'bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-tl-xs shadow-xs assistant-markdown'
                      }`}
                    >
                      {isUser ? (
                        msg.content
                      ) : (
                        <div dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }} />
                      )}
                    </div>

                    {/* Direct Page Link Button if Assistant suggested a view */}
                    {!isUser && msg.suggestedView && (
                      <button
                        onClick={() => {
                          onNavigate(msg.suggestedView!);
                          setIsOpen(false);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--color-brand-bg)] hover:bg-[var(--color-brand)]/15 border border-[var(--color-brand-border)] text-[var(--color-brand-strong)] text-[11px] font-bold transition-colors shadow-2xs"
                      >
                        <span>{msg.suggestedViewLabel || 'Go to page'}</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    )}

                    <span className="text-[9px] text-[var(--text-muted)] px-1 font-mono block">
                      {msg.timestamp}
                    </span>
                  </div>

                  {isUser && (
                    <div className="w-7 h-7 rounded-xl bg-[var(--bg-subtle)] text-[var(--text-secondary)] flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-bold">
                      NM
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex gap-2.5 items-center">
                <div className="w-7 h-7 rounded-xl bg-[var(--color-brand)]/10 border border-[var(--color-brand)]/30 text-[var(--color-brand)] flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="p-3 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs text-[var(--text-muted)] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[var(--color-brand)] animate-pulse" />
                  <span>Thinking of a simple explanation...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Question Chips */}
          <div className="p-2 border-t border-[var(--border-color)] bg-[var(--bg-subtle)] overflow-x-auto whitespace-nowrap custom-scrollbar flex gap-1.5">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q.query)}
                className="px-2.5 py-1 rounded-lg bg-[var(--bg-card)] hover:bg-[var(--color-brand-bg)] border border-[var(--border-color)] hover:border-[var(--color-brand-border)] text-[10px] text-[var(--text-secondary)] hover:text-[var(--color-brand-strong)] transition-all shrink-0 font-medium"
              >
                {q.label}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-[var(--bg-card)] border-t border-[var(--border-color)] flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask how to check a payment, alert, or score..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 px-3.5 py-2 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--color-brand)]"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="p-2 rounded-xl bg-[var(--color-brand-solid)] hover:opacity-90 disabled:opacity-40 text-white transition-all shadow-xs shrink-0"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
