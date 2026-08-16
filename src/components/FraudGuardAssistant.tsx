import React, { useState, useRef, useEffect } from 'react';
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
}

export const FraudGuardAssistant: React.FC<FraudGuardAssistantProps> = ({ onNavigate }) => {
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
      const response = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query.trim(),
          conversationHistory: messages.map((m) => ({ role: m.role, content: m.content })),
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
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-teal-600 hover:bg-teal-500 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 font-sans"
        aria-label="Open FraudGuard Assistant"
      >
        <div className="relative">
          <Bot className="w-5 h-5" />
          <span className="w-2.5 h-2.5 bg-emerald-400 border-2 border-teal-600 rounded-full absolute -top-0.5 -right-0.5 animate-pulse" />
        </div>
        <div className="text-left hidden sm:block">
          <div className="text-xs font-bold leading-tight">FraudGuard Assistant</div>
          <div className="text-[10px] text-teal-100 font-normal">Ask anything • Simple English</div>
        </div>
      </button>

      {/* Floating Chat Window */}
      {isOpen && (
        <div
          id="assistant-chat-window"
          className="fixed bottom-20 right-4 sm:right-6 w-[94vw] sm:w-[420px] h-[560px] max-h-[82vh] bg-white dark:bg-[#0f1523] border border-slate-200 dark:border-[#1c2638] rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200 font-sans"
        >
          {/* Header */}
          <div className="p-3.5 bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-white flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-500/10 dark:bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-600 dark:text-teal-400">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold tracking-tight flex items-center gap-1.5 text-slate-900 dark:text-white">
                  FraudGuard Assistant
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-teal-50 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-500/30 font-semibold">
                    AI Online
                  </span>
                </h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Ask me anything about using FraudGuard</p>
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
                className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Clear conversation"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Close Assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar bg-slate-50/50 dark:bg-[#0c1017]">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div key={msg.id} className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
                  {!isUser && (
                    <div className="w-7 h-7 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div className={`max-w-[84%] space-y-2`}>
                    <div
                      className={`p-3 rounded-2xl text-xs leading-relaxed ${
                        isUser
                          ? 'bg-teal-600 text-white rounded-tr-xs shadow-xs font-medium'
                          : 'bg-white dark:bg-[#141b2b] text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-[#1e2a40] rounded-tl-xs shadow-xs whitespace-pre-line'
                      }`}
                    >
                      {msg.content}
                    </div>

                    {/* Direct Page Link Button if Assistant suggested a view */}
                    {!isUser && msg.suggestedView && (
                      <button
                        onClick={() => {
                          onNavigate(msg.suggestedView!);
                          setIsOpen(false);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/40 dark:hover:bg-teal-900/60 border border-teal-200 dark:border-teal-500/40 text-teal-700 dark:text-teal-300 text-[11px] font-bold transition-colors shadow-2xs"
                      >
                        <span>{msg.suggestedViewLabel || 'Go to page'}</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    )}

                    <span className="text-[9px] text-slate-400 dark:text-slate-500 px-1 font-mono block">
                      {msg.timestamp}
                    </span>
                  </div>

                  {isUser && (
                    <div className="w-7 h-7 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-bold">
                      NM
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex gap-2.5 items-center">
                <div className="w-7 h-7 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="p-3 rounded-2xl bg-white dark:bg-[#141b2b] border border-slate-200 dark:border-[#1e2a40] text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                  <span>Thinking of a simple explanation...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Question Chips */}
          <div className="p-2 border-t border-slate-200 dark:border-[#1c2638] bg-slate-100/70 dark:bg-[#101624] overflow-x-auto whitespace-nowrap custom-scrollbar flex gap-1.5">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q.query)}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#182132] hover:bg-teal-50 dark:hover:bg-teal-950/40 border border-slate-200 dark:border-[#223048] hover:border-teal-300 dark:hover:border-teal-500/40 text-[10px] text-slate-700 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-300 transition-all shrink-0 font-medium"
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
            className="p-3 bg-white dark:bg-[#0f1523] border-t border-slate-200 dark:border-[#1c2638] flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask how to check a payment, alert, or score..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 px-3.5 py-2 bg-slate-50 dark:bg-[#090d16] border border-slate-200 dark:border-[#1c2638] rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-teal-500"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="p-2 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-40 disabled:hover:bg-teal-600 text-white transition-all shadow-xs shrink-0"
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
