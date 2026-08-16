import React, { useState, useEffect } from 'react';
import {
  FolderLock,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Clock,
  User,
  Tag,
  ArrowUpRight,
  Send,
  Shield,
  FileText,
  Layers,
  ChevronRight,
  Sparkles,
  ExternalLink,
  MessageSquare,
  Lock,
  Unlock,
  ShieldAlert
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useContainment } from '../../context/ContainmentContext';
import { useTheme } from '../../context/ThemeContext';

export interface CaseItem {
  id: string;
  caseRef: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'Open' | 'Investigating' | 'Escalated' | 'Resolved' | 'False Positive' | 'Confirmed Fraud';
  assignedTo: string;
  relatedTransactionIds: string[];
  relatedCustomerIds: string[];
  tags: string[];
  notes: Array<{
    id: string;
    authorName: string;
    authorRole: string;
    note: string;
    createdAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
  resolutionSummary?: string;
}

export const CaseManagementView: React.FC = () => {
  const { user, isReadOnly } = useAuth();
  const { isSessionContained, requestContainSession, requestReleaseSession, getContainmentInfo } = useContainment();
  const { resolvedTheme } = useTheme();

  const [cases, setCases] = useState<CaseItem[]>([]);
  const [selectedCase, setSelectedCase] = useState<CaseItem | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // New Note state
  const [newNote, setNewNote] = useState('');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);

  // AI Briefing
  const [aiBriefing, setAiBriefing] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Create Case Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCaseTitle, setNewCaseTitle] = useState('');
  const [newCaseDesc, setNewCaseDesc] = useState('');
  const [newCasePriority, setNewCasePriority] = useState<'low' | 'medium' | 'high' | 'critical'>('high');
  const [newCaseAssignee, setNewCaseAssignee] = useState(user?.name || 'Naman Kumar');
  const [newCaseTags, setNewCaseTags] = useState('Mule Ring, High Amount');

  const loadCases = async () => {
    setIsLoading(true);
    try {
      const res = await api.getCases({
        search,
        status: statusFilter,
        priority: priorityFilter,
      });
      if (res.success && res.cases) {
        setCases(res.cases);
        if (!selectedCase && res.cases.length > 0) {
          setSelectedCase(res.cases[0]);
        } else if (selectedCase) {
          const fresh = res.cases.find((c: CaseItem) => c.id === selectedCase.id);
          if (fresh) setSelectedCase(fresh);
        }
      }
    } catch (err) {
      console.error('Failed to load cases:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCases();
  }, [search, statusFilter, priorityFilter]);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase || !newNote.trim() || isReadOnly) return;

    setIsSubmittingNote(true);
    try {
      const res = await api.addCaseNote(
        selectedCase.id,
        newNote.trim(),
        user?.name || 'Naman Kumar',
        user?.role || 'Fraud Analyst'
      );
      if (res.success) {
        setNewNote('');
        loadCases();
      }
    } catch (err) {
      console.error('Failed to add note:', err);
    } finally {
      setIsSubmittingNote(false);
    }
  };

  const handleStatusChange = async (newStatus: CaseItem['status']) => {
    if (!selectedCase || isReadOnly) return;
    try {
      await api.updateCase(selectedCase.id, { status: newStatus });
      loadCases();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCaseTitle.trim() || isReadOnly) return;

    try {
      const tagList = newCaseTags.split(',').map((t) => t.trim()).filter(Boolean);
      const res = await api.createCase({
        title: newCaseTitle.trim(),
        description: newCaseDesc.trim(),
        priority: newCasePriority,
        assignedTo: newCaseAssignee,
        tags: tagList,
      });

      if (res.success) {
        setShowCreateModal(false);
        setNewCaseTitle('');
        setNewCaseDesc('');
        loadCases();
      }
    } catch (err) {
      console.error('Failed to create case:', err);
    }
  };

  const handleGenerateAiBriefing = async () => {
    if (!selectedCase) return;
    setIsAiLoading(true);
    setAiBriefing(null);
    try {
      const res = await api.summarizeCaseWithAi(selectedCase.id);
      if (res.success && res.briefing) {
        setAiBriefing(res.briefing);
      }
    } catch (err) {
      console.error('AI briefing failed:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case 'critical':
        return 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/40';
      case 'high':
        return 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/40';
      case 'medium':
        return 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/40';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-700';
    }
  };

  const getStatusBadge = (s: string) => {
    switch (s) {
      case 'Resolved':
        return 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40';
      case 'Confirmed Fraud':
        return 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/40';
      case 'Escalated':
        return 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800/40';
      case 'Investigating':
        return 'bg-cyan-100 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800/40';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top 3-Part Operational Guide */}
      <div className="p-4 bg-white dark:bg-[#121722] rounded-xl border border-slate-200 dark:border-[#1c2638] shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <span className="text-[11px] font-mono font-bold uppercase text-teal-600 dark:text-teal-400">1. What this does</span>
            <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">
              Provides real investigation case dossiers linking suspect transactions, mule accounts, and forensic investigator notes.
            </p>
          </div>
          <div>
            <span className="text-[11px] font-mono font-bold uppercase text-amber-600 dark:text-amber-400">2. What should I look for?</span>
            <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">
              Case status (Open vs Investigating), assigned analyst, linked transaction sums, and timeline notes.
            </p>
          </div>
          <div>
            <span className="text-[11px] font-mono font-bold uppercase text-indigo-600 dark:text-indigo-400">3. What can I do?</span>
            <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">
              Add forensic notes, generate AI executive briefings, update case status, or create new syndication cases.
            </p>
          </div>
        </div>
      </div>

      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FolderLock className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            Case Management & Dossiers
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real investigation tracking with persistent database state and evidence timeline.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            disabled={isReadOnly}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create Investigation Case
          </button>
        </div>
      </div>

      {/* Main 2-Column Split: Cases List & Selected Case Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Cases List */}
        <div className="lg:col-span-5 space-y-4">
          {/* Filters */}
          <div className="bg-white dark:bg-[#121722] p-4 rounded-xl border border-slate-200 dark:border-[#1c2638] space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search cases by title, ref, or tag..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-[#182030] border border-slate-200 dark:border-[#223048] rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-1/2 text-xs py-1.5 px-2 bg-slate-50 dark:bg-[#182030] border border-slate-200 dark:border-[#223048] rounded-lg text-slate-700 dark:text-slate-300"
              >
                <option value="all">All Statuses</option>
                <option value="Open">Open</option>
                <option value="Investigating">Investigating</option>
                <option value="Escalated">Escalated</option>
                <option value="Resolved">Resolved</option>
                <option value="Confirmed Fraud">Confirmed Fraud</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-1/2 text-xs py-1.5 px-2 bg-slate-50 dark:bg-[#182030] border border-slate-200 dark:border-[#223048] rounded-lg text-slate-700 dark:text-slate-300"
              >
                <option value="all">All Priorities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          {/* Cases List Items */}
          <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar">
            {isLoading ? (
              <div className="p-8 text-center text-xs text-slate-400">Loading cases from database...</div>
            ) : cases.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 bg-white dark:bg-[#121722] rounded-xl border border-slate-200 dark:border-[#1c2638]">
                No cases found matching the search criteria.
              </div>
            ) : (
              cases.map((c) => {
                const isSelected = selectedCase?.id === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCase(c)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'bg-teal-50/50 dark:bg-teal-950/30 border-teal-500 dark:border-teal-500/60 shadow-xs'
                        : 'bg-white dark:bg-[#121722] border-slate-200 dark:border-[#1c2638] hover:border-slate-300 dark:hover:border-[#2a3850]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[11px] font-mono font-bold text-teal-600 dark:text-teal-400">
                        {c.caseRef}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${getPriorityBadge(c.priority)}`}>
                          {c.priority}
                        </span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getStatusBadge(c.status)}`}>
                          {c.status}
                        </span>
                      </div>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 mb-1">
                      {c.title}
                    </h4>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
                      {c.description}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-[#1c2638] pt-2">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {c.assignedTo}
                      </span>
                      <span>{c.notes.length} notes</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Case Dossier Detail */}
        <div className="lg:col-span-7">
          {selectedCase ? (
            <div className="bg-white dark:bg-[#121722] rounded-xl border border-slate-200 dark:border-[#1c2638] p-6 space-y-6 shadow-xs text-left">
              {/* Dossier Header */}
              <div className="border-b border-slate-100 dark:border-[#1c2638] pb-5">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/50 px-2.5 py-1 rounded-lg border border-teal-200 dark:border-teal-800/40">
                      {selectedCase.caseRef}
                    </span>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border uppercase ${getPriorityBadge(selectedCase.priority)}`}>
                      {selectedCase.priority} Priority
                    </span>
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Status:</span>
                    <select
                      value={selectedCase.status}
                      disabled={isReadOnly}
                      onChange={(e) => handleStatusChange(e.target.value as any)}
                      className="text-xs font-semibold py-1.5 px-3 bg-slate-50 dark:bg-[#182030] border border-slate-200 dark:border-[#223048] rounded-lg text-slate-900 dark:text-white"
                    >
                      <option value="Open">Open</option>
                      <option value="Investigating">Investigating</option>
                      <option value="Escalated">Escalated</option>
                      <option value="Resolved">Resolved</option>
                      <option value="False Positive">False Positive</option>
                      <option value="Confirmed Fraud">Confirmed Fraud</option>
                    </select>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  {selectedCase.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {selectedCase.description}
                </p>

                {/* Tags & Assignee */}
                <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-100 dark:border-[#1c2638] text-xs">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Tag className="w-3.5 h-3.5 text-slate-400" />
                    {selectedCase.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-slate-100 dark:bg-[#182030] text-slate-700 dark:text-slate-300 text-[11px] px-2 py-0.5 rounded-md border border-slate-200 dark:border-[#223048]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <span>Assigned: <strong>{selectedCase.assignedTo}</strong></span>
                    <span>•</span>
                    <span>Updated: {selectedCase.updatedAt}</span>
                  </div>
                </div>
              </div>

              {/* Linked Evidence & Session Containment Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 bg-slate-50 dark:bg-[#161c28] rounded-xl border border-slate-200 dark:border-[#1c2638]">
                  <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">
                    Linked Transactions ({selectedCase.relatedTransactionIds.length})
                  </span>
                  <div className="mt-2 space-y-1.5">
                    {selectedCase.relatedTransactionIds.map((txnId) => (
                      <div key={txnId} className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-[#121722] px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-[#223048]">
                        <span className="font-mono font-semibold">{txnId}</span>
                        <span className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold">Evidence Record</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-[#161c28] rounded-xl border border-slate-200 dark:border-[#1c2638]">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">
                      Linked Accounts & Sessions ({selectedCase.relatedCustomerIds.length})
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">Containment Control</span>
                  </div>
                  <div className="mt-2 space-y-2">
                    {selectedCase.relatedCustomerIds.map((custId) => {
                      const isContained = isSessionContained(custId);
                      const record = getContainmentInfo(custId);
                      return (
                        <div key={custId} className="p-2.5 text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-[#121722] rounded-lg border border-slate-200 dark:border-[#223048] space-y-1.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-semibold text-slate-900 dark:text-white">{custId}</span>
                              {isContained ? (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1">
                                  <Lock className="w-2.5 h-2.5" />
                                  CONTAINED
                                </span>
                              ) : (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/30">
                                  ACTIVE
                                </span>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                if (isContained) {
                                  requestReleaseSession(custId);
                                } else {
                                  requestContainSession({
                                    sessionId: custId,
                                    sessionRef: custId,
                                    customerName: custId,
                                    riskTier: 'high',
                                  });
                                }
                              }}
                              className={`px-2 py-1 rounded-md text-[10px] font-mono font-bold flex items-center gap-1 transition-all cursor-pointer ${
                                isContained
                                  ? 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700'
                                  : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40'
                              }`}
                            >
                              {isContained ? (
                                <>
                                  <Unlock className="w-3 h-3 text-slate-500" />
                                  <span>Uncontain</span>
                                </>
                              ) : (
                                <>
                                  <Lock className="w-3 h-3 text-amber-600" />
                                  <span>Contain Session</span>
                                </>
                              )}
                            </button>
                          </div>

                          {isContained && record && (
                            <div className="text-[10px] text-amber-700 dark:text-amber-300 font-mono bg-amber-50 dark:bg-amber-950/40 p-1.5 rounded border border-amber-200 dark:border-amber-500/30">
                              🔒 Contained by {record.containedBy} at {new Date(record.containedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Step-up challenges enforced
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* AI Briefing Generator */}
              <div className="p-4 bg-gradient-to-br from-teal-50/70 to-indigo-50/70 dark:from-teal-950/20 dark:to-indigo-950/20 rounded-xl border border-teal-200/60 dark:border-teal-500/20">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      Gemini AI Case Briefing & Next Actions
                    </h4>
                  </div>
                  <button
                    onClick={handleGenerateAiBriefing}
                    disabled={isAiLoading}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {isAiLoading ? 'Synthesizing...' : 'Generate Briefing'}
                  </button>
                </div>

                {aiBriefing ? (
                  <div className="mt-3 p-3 bg-white dark:bg-[#121722] rounded-lg border border-teal-100 dark:border-teal-900/40 text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                    {aiBriefing}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Click to synthesize a structured executive case briefing using real transaction evidence and behavioral anomalies.
                  </p>
                )}
              </div>

              {/* Investigator Notes Thread */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold font-mono uppercase text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Investigator Activity & Forensic Notes ({selectedCase.notes.length})
                </h4>

                <div className="space-y-3 max-h-56 overflow-y-auto custom-scrollbar">
                  {selectedCase.notes.map((note) => (
                    <div
                      key={note.id}
                      className="p-3 bg-slate-50 dark:bg-[#161c28] rounded-xl border border-slate-200 dark:border-[#1c2638] text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between text-slate-400 dark:text-slate-500 text-[11px]">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {note.authorName} ({note.authorRole})
                        </span>
                        <span>{note.createdAt}</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 leading-normal">
                        {note.note}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Add Note Form */}
                <form onSubmit={handleAddNote} className="flex gap-2">
                  <input
                    type="text"
                    placeholder={isReadOnly ? 'Read-only mode (notes disabled)' : 'Add forensic case note...'}
                    value={newNote}
                    disabled={isReadOnly || isSubmittingNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs bg-slate-50 dark:bg-[#182030] border border-slate-200 dark:border-[#223048] rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 disabled:opacity-60"
                  />
                  <button
                    type="submit"
                    disabled={isReadOnly || isSubmittingNote || !newNote.trim()}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Post
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-[#121722] rounded-xl border border-slate-200 dark:border-[#1c2638] p-12 text-center text-slate-400 text-xs">
              Select a case from the list to view its complete evidence and notes.
            </div>
          )}
        </div>
      </div>

      {/* Modal: Create Case */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#121722] border border-slate-200 dark:border-[#1c2638] rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-xl text-left">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Create New Investigation Case
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleCreateCase} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Case Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Account Takeover via Zero-Dwell Paste"
                  value={newCaseTitle}
                  onChange={(e) => setNewCaseTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#182030] border border-slate-200 dark:border-[#223048] rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description / Incident Background
                </label>
                <textarea
                  rows={3}
                  placeholder="Summarize the anomaly pattern and initial risk indicators..."
                  value={newCaseDesc}
                  onChange={(e) => setNewCaseDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#182030] border border-slate-200 dark:border-[#223048] rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Priority Level
                  </label>
                  <select
                    value={newCasePriority}
                    onChange={(e) => setNewCasePriority(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#182030] border border-slate-200 dark:border-[#223048] rounded-xl text-slate-900 dark:text-white"
                  >
                    <option value="critical">Critical (Immediate Response)</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Assign Lead Analyst
                  </label>
                  <input
                    type="text"
                    value={newCaseAssignee}
                    onChange={(e) => setNewCaseAssignee(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#182030] border border-slate-200 dark:border-[#223048] rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="Mule Ring, Headless Bot, High Velocity"
                  value={newCaseTags}
                  onChange={(e) => setNewCaseTags(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#182030] border border-slate-200 dark:border-[#223048] rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs"
                >
                  Save & Open Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
